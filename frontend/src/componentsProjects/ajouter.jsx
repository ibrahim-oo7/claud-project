import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./AddProject.css";

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

    await axios.post(
      "http://localhost:3004/add",
      { nom, description, statut, date_debut, date_fin, owner, member, categorie_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate("/afficher");
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      option => option.value
    );
    setMember(selectedOptions);
  };

  return (
    <div className="add-project-page">
      <div className="add-project-container">
        <div className="add-project-header">
          <h1 className="add-project-title">Add New Project</h1>
          <p className="add-project-subtitle">
            Create a project and assign its category, schedule, and members
          </p>
        </div>

        <form onSubmit={handleAdd} className="add-project-form">
          <div className="add-project-form-group">
            <label className="add-project-label">Project Name</label>
            <input
              className="add-project-input"
              placeholder="Enter project name"
              onChange={(e) => setNom(e.target.value)}
            />
          </div>

          <div className="add-project-form-group">
            <label className="add-project-label">Description</label>
            <input
              className="add-project-input"
              placeholder="Enter description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="add-project-form-group">
            <label className="add-project-label">Status</label>
            <input
              className="add-project-input"
              placeholder="Enter status"
              onChange={(e) => setStatut(e.target.value)}
            />
          </div>

          <div className="add-project-row">
            <div className="add-project-form-group">
              <label className="add-project-label">Start Date</label>
              <input
                className="add-project-input"
                type="date"
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>

            <div className="add-project-form-group">
              <label className="add-project-label">End Date</label>
              <input
                className="add-project-input"
                type="date"
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
          </div>

          <div className="add-project-form-group">
            <label className="add-project-label">Category</label>
            <select
              className="add-project-select"
              onChange={(e) => setCategorie(e.target.value)}
            >
              <option>Choose a category</option>
              {categories.map((c, i) => (
                <option key={i} value={c._id}>{c.nom}</option>
              ))}
            </select>
          </div>

          <div className="add-project-form-group">
            <label className="add-project-label">Members</label>
            <select
              className="add-project-select add-project-multiple"
              multiple
              onChange={handleSelectChange}
            >
              <option disabled>Select members</option>
              {members.map((c, i) => (
                <option key={i} value={c.username}>{c.username}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="add-project-btn">
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
}