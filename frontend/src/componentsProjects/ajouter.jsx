import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
let r = null;

if (token) {
  try {
    const decoded = jwtDecode(token);
    r = decoded.id;
  } catch (error) {
    console.log("Token invalide :", error.message);
  }
}

export default function AddProject() {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [statut, setStatut] = useState("");
  const [date_debut, setDateDebut] = useState("");
  const [date_fin, setDateFin] = useState("");
  const [owner, setOwner] = useState(r);
  const [categorie_id, setCategorie] = useState("");
  const [categories, setCategories] = useState([]);
  const [member, setMember] = useState([]);
  const [members, setMembers] = useState([]);

  const navigate = useNavigate();

  // get categories
  useEffect(() => {
    axios.get("http://localhost:3004/categories")
      .then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMembers(res.data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:3004/add",
      { nom, description, statut, date_debut, date_fin, owner, member, categorie_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate("/afficher");
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setMember(selectedOptions);
  };

  return (
    <form onSubmit={handleAdd}>
      <input placeholder="nom" onChange={(e) => setNom(e.target.value)} />
      <input placeholder="description" onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="statut" onChange={(e) => setStatut(e.target.value)} />

      <input type="date" onChange={(e) => setDateDebut(e.target.value)} />
      <input type="date" onChange={(e) => setDateFin(e.target.value)} />

      <select onChange={(e) => setCategorie(e.target.value)}>
        <option>choisir categorie</option>
        {categories.map((c, i) => (
          <option key={i} value={c._id}>{c.nom}</option>
        ))}
      </select>

      <select multiple onChange={handleSelectChange}>
        <option disabled>choisir membres</option>
        {members.map((c, i) => (
          <option key={i} value={c.username}>{c.username}</option>
        ))}
      </select>

      <button type="submit">Ajouter</button>
    </form>
  );
}