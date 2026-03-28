import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./AfficherUtilisateurs.css";

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
    <div className="users-page">
      <div className="users-container">
        <div className="users-topbar">
          <div className="users-title-box">
            <h1 className="users-main-title">User Management</h1>
            <p className="users-subtitle">
              Manage platform users, permissions and account status
            </p>
          </div>

          {r === "admin" && (
            <Link to="/AjouterUtilisateur" className="add-user-link">
              Add User
            </Link>
          )}
        </div>

        <div className="search-card">
          <div className="search-box">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Search by username..."
              className="search-input"
            />

            <button
              className="search-btn"
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
              Search
            </button>
          </div>
        </div>

        <div className="table-section">
          <div className="section-header">
            <h3 className="section-title">Connected Admin</h3>
          </div>

          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Edit</th>
                </tr>
              </thead>

              <tbody>
                {currentAdmin.map((u, i) => (
                  <tr key={i}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="role-badge admin-badge">{u.role}</span>
                    </td>
                    <td>
                      {r === "admin" && (
                        <Link
                          to={`/modifierUtilisateur/${u._id}`}
                          className="table-link"
                        >
                          Edit
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-section">
          <div className="section-header">
            <h3 className="section-title">Users</h3>
          </div>

          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                  <th>Block / Unblock</th>
                </tr>
              </thead>

              <tbody>
                {autresUsers.map((u, i) => (
                  <tr key={i}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={
                          u.role === "invite"
                            ? "role-badge invite-badge"
                            : "role-badge member-badge"
                        }
                      >
                        {u.role}
                      </span>
                    </td>

                    <td>
                      {r === "admin" ? (
                        <div className="action-group">
                          <button
                            className="action-btn delete-btn"
                            onClick={async () => {
                              await axios.delete(
                                `http://localhost:3001/delete/${u._id}`,
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );

                              setUsers((prev) =>
                                prev.filter((user) => user._id !== u._id)
                              );
                              setInfos((prev) =>
                                prev.filter((user) => user._id !== u._id)
                              );
                            }}
                          >
                            Delete
                          </button>

                          <Link
                            to={`/modifierUtilisateur/${u._id}`}
                            className="action-btn edit-btn"
                          >
                            Edit
                          </Link>
                        </div>
                      ) : (
                        <span className="not-admin-text">
                          Access denied: admin only
                        </span>
                      )}
                    </td>

                    <td>
                      {r === "admin" ? (
                        <button
                          className={
                            u.isBlocked
                              ? "action-btn unblock-btn"
                              : "action-btn block-btn"
                          }
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
                          {u.isBlocked ? "Unblock" : "Block"}
                        </button>
                      ) : (
                        <span className="not-admin-text">
                          Access denied: admin only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}