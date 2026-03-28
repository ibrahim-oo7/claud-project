import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./UpdateProject.css";

export default function UpdateProject() {
  const token = localStorage.getItem("token");
  let r = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      r = decoded.id;
    } catch (error) {
      console.log("Invalid token:", error.message);
    }
  }

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

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3004/projects", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const p = res.data.find(el => el._id === id);

      setNom(p.nom);
      setDescription(p.description);
      setStatut(p.statut);
      setDateDebut(p.date_debut?.slice(0, 10));
      setDateFin(p.date_fin?.slice(0, 10));
      setCategorie(p.categorie_id);
    });

    axios.get("http://localhost:3004/categories")
      .then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMembers(res.data));
  }, []);

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      option => option.value
    );
    setMember(selectedOptions);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    await axios.put(
      `http://localhost:3004/update/${id}`,
      { nom, description, statut, date_debut, date_fin, owner, member, categorie_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate("/afficher");
  };

  return (
    <div className="update-project-page">
      <div className="update-project-container">
        <div className="update-project-header">
          <h1 className="update-project-title">Update Project</h1>
          <p className="update-project-subtitle">
            Edit project details, schedule, category, and assigned members
          </p>
        </div>

        <form onSubmit={handleUpdate} className="update-project-form">
          <div className="update-project-form-group">
            <label className="update-project-label">Project Name</label>
            <input
              className="update-project-input"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Enter project name"
            />
          </div>

          <div className="update-project-form-group">
            <label className="update-project-label">Description</label>
            <input
              className="update-project-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="update-project-form-group">
            <label className="update-project-label">Status</label>
            <input
              className="update-project-input"
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              placeholder="Enter status"
            />
          </div>

          <div className="update-project-row">
            <div className="update-project-form-group">
              <label className="update-project-label">Start Date</label>
              <input
                className="update-project-input"
                type="date"
                value={date_debut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>

            <div className="update-project-form-group">
              <label className="update-project-label">End Date</label>
              <input
                className="update-project-input"
                type="date"
                value={date_fin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
          </div>

          <div className="update-project-form-group">
            <label className="update-project-label">Members</label>
            <select
              className="update-project-select update-project-multiple"
              multiple
              onChange={handleSelectChange}
            >
              <option disabled>Select members</option>
              {members.map((c, i) => (
                <option key={i} value={c.username}>{c.username}</option>
              ))}
            </select>
          </div>

          <div className="update-project-form-group">
            <label className="update-project-label">Category</label>
            <select
              className="update-project-select"
              value={categorie_id}
              onChange={(e) => setCategorie(e.target.value)}
            >
              {categories.map((c, i) => (
                <option key={i} value={c._id}>{c.nom}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="update-project-btn">
            Update Project
          </button>
        </form>
      </div>
    </div>
  );
}