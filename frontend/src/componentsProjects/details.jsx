import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const token = localStorage.getItem("token");

  const getProjectDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3004/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(res.data);
    } catch (error) {
      console.log("ERROR:", error.response || error.message);
    }
  };

  useEffect(() => {
    getProjectDetails();
  }, [id]);

  if (!project) return <p>Chargement...</p>;
  console.log(id);
  return (
    <div>
      <h1>Détails du projet</h1>
      <p><strong>Nom :</strong> {project.nom}</p>
      <p><strong>Description :</strong> {project.description}</p>
      <p><strong>Statut :</strong> {project.statut}</p>

      <hr />

      <h3>Gestion du projet</h3>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Link to={`/tasks/${id}`}>Tasks</Link>
        <Link to={`/kanban/${id}`}>Kanban</Link>
        <Link to={`/reports/${id}`}>Reports</Link>
      </div>
    </div>
  );
}