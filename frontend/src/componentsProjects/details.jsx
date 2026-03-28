import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, Outlet, useParams } from "react-router-dom";
import "./ProjectDetails.css";

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

  if (!project) return <p className="project-details-loading">Loading...</p>;

  const linkClassName = ({ isActive }) =>
    isActive
      ? "project-sidebar-link active"
      : "project-sidebar-link";

  return (
    <div className="project-details-page">
      <div className="project-details-container">
        <div className="project-details-header">
          <h1 className="project-details-title">Project Details</h1>
          <p className="project-details-subtitle">
            View project information and manage related sections
          </p>
        </div>

        <div className="project-summary-card">
          <p className="project-summary-item">
            <strong>Project Name:</strong> {project.nom}
          </p>
          <p className="project-summary-item">
            <strong>Description:</strong> {project.description}
          </p>
          <p className="project-summary-item">
            <strong>Status:</strong> {project.statut}
          </p>
          <p className="project-summary-item">
            <strong>start date:</strong> {new Date(project.date_debut).toLocaleDateString("en-CA")}
          </p>
          <p className="project-summary-item">
            <strong>end date:</strong> {new Date(project.date_fin).toLocaleDateString("en-CA")}
          </p>
        </div>

        <div className="project-layout">
          <div className="project-sidebar">
            <h3 className="project-sidebar-title">Project Management</h3>

            <NavLink to="tasks" className={linkClassName}>
              Tasks
            </NavLink>

            <NavLink to="kanban" className={linkClassName}>
              Kanban
            </NavLink>

            <NavLink to="reports" className={linkClassName}>
              Reports
            </NavLink>

            <NavLink to="chat" className={linkClassName}>
              Chat
            </NavLink>
          </div>

          <div className="project-content-panel">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}