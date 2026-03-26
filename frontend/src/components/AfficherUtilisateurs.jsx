import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Utilisateur() {
  const [users, setUsers] = useState([]);
  const [infos, setInfos] = useState([]);
  const [username, setUsername] = useState("");

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  let r = null;
  if (token) {
    const decoded = jwtDecode(token);
    r = decoded.role;
  }

  const getUsers = async () => {
    const res = await axios.get("http://localhost:3001/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const nas = infos.length > 0 ? infos : users;

  const currentAdmin = nas.filter((u) => u._id === currentUser?._id);
  const autresUsers = nas.filter(
    (u) => u.role === "membre" || u.role === "invite"
  );

  return (
    <>
      {r === "admin" && <Link to="/AjouterUtilisateur">Ajouter un utilisateur</Link>}

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        onClick={async () => {
          if (!username.trim()) {
            setInfos([]);
            return;
          }

          const res = await axios.get(
            `http://localhost:3001/searchUsername/${username}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setInfos(res.data);
        }}
      >
        search
      </button>

      <center>
        <h3>Admin connecté</h3>
        <table border="1">
          <tr>
            <th>name</th>
            <th>email</th>
            <th>role</th>
            <th>modifier</th>
          </tr>

          {currentAdmin.map((u, i) => (
            <tr key={i}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {r === "admin" && (
                  <Link to={`/modifierUtilisateur/${u._id}`}>modifier</Link>
                )}
              </td>
            </tr>
          ))}
        </table>

        <br />

        <h3>Users</h3>
        <table border="1">
          <tr>
            <th>name</th>
            <th>email</th>
            <th>role</th>
            <th>actions</th>
            <th>block/unblock</th>
          </tr>

          {autresUsers.map((u, i) => (
            <tr key={i}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {r === "admin" ? (
                  <>
                    <button
                      onClick={async () => {
                        await axios.delete(`http://localhost:3001/delete/${u._id}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        });

                        setUsers((prev) => prev.filter((user) => user._id !== u._id));
                        setInfos((prev) => prev.filter((user) => user._id !== u._id));
                      }}
                    >
                      supprimer
                    </button>

                    <Link to={`/modifierUtilisateur/${u._id}`}>modifier</Link>
                  </>
                ) : (
                  "gha smahna tn machi admin"
                )}
              </td>

              <td>
                {r === "admin" ? (
                  <center>
                    <button
                      onClick={async () => {
                        if (u.isBlocked) {
                          await axios.put(
                            `http://localhost:3001/unblock/${u._id}`,
                            {},
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );
                        } else {
                          await axios.put(
                            `http://localhost:3001/block/${u._id}`,
                            {},
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );
                        }

                        getUsers();
                        setInfos([]);
                      }}
                    >
                      {u.isBlocked ? "unblock" : "block"}
                    </button>
                  </center>
                ) : (
                  "gha smahna tn machi admin"
                )}
              </td>
            </tr>
          ))}
        </table>
      </center>
    </>
  );
}