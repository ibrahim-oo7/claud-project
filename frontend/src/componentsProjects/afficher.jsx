import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export default function AfficherProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const token = localStorage.getItem("token");
        let r = null;
        if(token){
            const decoded = jwtDecode(token);
            r = decoded.role; 
        }

  const getProjects = async () => {
    try {
      const res = await axios.get("http://localhost:3004/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.log("ERROR:", err.response || err.message);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const data = result.length > 0 ? result : projects;

  return (
    <>
      {r === "admin" && (
                <Link to="/ajouter">Ajouter Projet</Link>
            )}

      <br />
      <br />

      <input
        type="text"
        placeholder="Search by nom"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        onClick={async () => {
          if (!search) {
            setResult([]);
            return;
          }

          const res = await axios.get(
            `http://localhost:3004/searchNom/${search}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setResult(res.data);
        }}
      >
        search
      </button>

      <center>
        <table border="1">
          <thead>
            <tr>
              <th>nom</th>
              <th>description</th>
              <th>statut</th>
              <th>actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((p) => (
              <tr key={p._id}>
                <td>{p.nom}</td>
                <td>{p.description}</td>
                <td>{p.statut}</td>

                <td>
                  <Link to={`/details/${p._id}`}>voir détails</Link>{" "}
                  |{" "}
                   {r === "admin" ? (
    <Link to={`/modifier/${p._id}`}>modifier</Link>
  ) : (
    ""
  )}

  {r === "admin" && (
    <>
      {" | "}
      <button
        onClick={async () => {
          await axios.delete(`http://localhost:3004/delete/${p._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          getProjects();
        }}
      >
        supprimer
      </button>
    </>
  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>
    </>
  );
}