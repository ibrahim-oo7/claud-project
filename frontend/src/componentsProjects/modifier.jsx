import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateProject() {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [statut, setStatut] = useState("");
  const [date_debut, setDateDebut] = useState("");
  const [date_fin, setDateFin] = useState("");
  const [categorie_id, setCategorie] = useState("");
  const [categories, setCategories] = useState([]);

  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    // get project
    axios.get("http://localhost:3004/projects", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const p = res.data.find(el => el._id === id);

      setNom(p.nom);
      setDescription(p.description);
      setStatut(p.statut);
      setDateDebut(p.date_debut?.slice(0,10));
      setDateFin(p.date_fin?.slice(0,10));
      setCategorie(p.categorie_id);
    });

    // get categories
    axios.get("http://localhost:3004/categories")
      .then(res => setCategories(res.data));

  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    await axios.put(`http://localhost:3004/update/${id}`,
      { nom, description, statut, date_debut, date_fin, categorie_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate("/afficher");
  };

  return (
    <form onSubmit={handleUpdate}>
      <input value={nom} onChange={(e) => setNom(e.target.value)} />
      <input value={description} onChange={(e) => setDescription(e.target.value)} />
      <input value={statut} onChange={(e) => setStatut(e.target.value)} />

      <input type="date" value={date_debut} onChange={(e) => setDateDebut(e.target.value)} />
      <input type="date" value={date_fin} onChange={(e) => setDateFin(e.target.value)} />

      <select value={categorie_id} onChange={(e) => setCategorie(e.target.value)}>
        {categories.map((c, i) => (
          <option key={i} value={c._id}>{c.nom}</option>
        ))}
      </select>

      <button type="submit">Modifier</button>
    </form>
  );
}