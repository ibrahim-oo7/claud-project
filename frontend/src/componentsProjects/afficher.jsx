// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import "./AfficherProjects.css";

// export default function AfficherProjects() {
//   const [projects, setProjects] = useState([]);
//   const [search, setSearch] = useState("");
//   const [result, setResult] = useState([]);
//   const token = localStorage.getItem("token");

//   let r = null;
//   if (token) {
//     const decoded = jwtDecode(token);
//     r = decoded.role;
//   }

//   const getProjects = async () => {
//     try {
//       const res = await axios.get("http://localhost:3004/projects", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProjects(res.data);
//     } catch (err) {
//       console.log("ERROR:", err.response || err.message);
//     }
//   };

//   useEffect(() => {
//     getProjects();
//   }, []);

//   const data = result.length > 0 ? result : projects;

//   return (
//     <div className="projects-page">
//       <div className="projects-container">
//         <div className="projects-topbar">
//           <div className="projects-title-box">
//             <h1 className="projects-main-title">Projects</h1>
//             <p className="projects-subtitle">
//               Manage and explore all project records in one place
//             </p>
//           </div>

//           {r === "admin" && (
//             <Link to="/ajouter" className="add-project-link">
//               Ajouter Projet
//             </Link>
//           )}
//         </div>

//         <div className="projects-search-card">
//           <div className="projects-search-box">
//             <input
//               type="text"
//               placeholder="Search by nom"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="projects-search-input"
//             />

//             <button
//               className="projects-search-btn"
//               onClick={async () => {
//                 if (!search) {
//                   setResult([]);
//                   return;
//                 }

//                 const res = await axios.get(
//                   `http://localhost:3004/searchNom/${search}`,
//                   {
//                     headers: { Authorization: `Bearer ${token}` },
//                   }
//                 );
//                 setResult(res.data);
//               }}
//             >
//               Search
//             </button>
//           </div>
//         </div>

//         <div className="projects-grid">
//           {data.map((p) => (
//             <div className="project-card" key={p._id}>
//               <div className="project-card-header">
//                 <h3 className="project-card-title">{p.nom}</h3>
//                 <span className="project-status-badge">{p.statut}</span>
//               </div>

//               <div className="project-card-body">
//                 <p className="project-card-description">{p.description}</p>
//               </div>

//               <div className="project-card-actions">
//                 <Link to={`/details/${p._id}`} className="project-link details-link">
//                   voir détails
//                 </Link>

//                 {r === "admin" ? (
//                   <Link
//                     to={`/modifier/${p._id}`}
//                     className="project-link edit-link"
//                   >
//                     modifier
//                   </Link>
//                 ) : (
//                   ""
//                 )}

//                 {r === "admin" && (
//                   <button
//                     className="project-action-btn delete-project-btn"
//                     onClick={async () => {
//                       await axios.delete(`http://localhost:3004/delete/${p._id}`, {
//                         headers: { Authorization: `Bearer ${token}` },
//                       });
//                       getProjects();
//                     }}
//                   >
//                     supprimer
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./AfficherProjects.css";

export default function AfficherProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const token = localStorage.getItem("token");

  let r = null;
  if (token) {
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
    <div className="projects-page">
      <div className="projects-container">
        <div className="projects-topbar">
          <div className="projects-title-box">
            <h1 className="projects-main-title">Projects</h1>
            <p className="projects-subtitle">
              Manage and explore all project records in one place
            </p>
          </div>

          {r === "admin" && (
            <Link to="/ajouter" className="add-project-link">
              Add Project
            </Link>
          )}
        </div>

        <div className="projects-search-card">
          <div className="projects-search-box">
            <input
              type="text"
              placeholder="Search by project name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="projects-search-input"
            />

            <button
              className="projects-search-btn"
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
              Search
            </button>
          </div>
        </div>

        <div className="projects-table-wrapper">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>start date</th>
                <th>end date</th>
                {r === "admin" && (
                  <th>Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {data.map((p) => (
                <tr key={p._id}>
                  <td className="project-name-cell">{p.nom}</td>
                  <td className="project-description-cell">{p.description}</td>
                  <td>
                    <span className="project-status-badge">{p.statut}</span>
                  </td>
                  <td className="project-description-cell">{new Date(p.date_debut).toLocaleDateString("en-CA")}</td>
                  <td className="project-description-cell">{new Date(p.date_fin).toLocaleDateString("en-CA")}</td>

                  <td>
                    <div className="project-actions">

                      {r === "admin" && (
                        <Link
                          to={`/details/${p._id}`}
                          className="table-link details-link"
                        >
                          View Details
                        </Link>
                      )}

                      {r === "admin" && (
                        <Link
                          to={`/modifier/${p._id}`}
                          className="table-link edit-link"
                        >
                          Edit
                        </Link>
                      )}

                      {r === "admin" && (
                        <button
                          className="table-btn delete-btn"
                          onClick={async () => {
                            await axios.delete(
                              `http://localhost:3004/delete/${p._id}`,
                              {
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            getProjects();
                          }}
                        >
                          Delete
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}