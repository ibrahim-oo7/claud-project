import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Ajouter.css";

export default function Ajouter() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const addUser = async (e) => {
    e.preventDefault();
    const newUser = {
      username: username,
      email: email,
      password: password,
      role: role,
    };

    await axios.post("http://localhost:3001/add", newUser, {
      headers: { Authorization: `Bearer ${token}` },
    });

    navigate("/AfficherUtilisateurs");
  };

  return (
    <div className="add-user-page">
      <div className="add-user-container">
        <div className="add-user-header">
          <h1 className="add-user-title">Add New User</h1>
          <p className="add-user-subtitle">
            Create a new account and assign the appropriate role
          </p>
        </div>

        <form onSubmit={addUser} className="add-user-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-select"
            >
              <option value="" disabled>
                Choose role
              </option>
              <option value="admin">admin</option>
              <option value="membre">membre</option>
              <option value="invite">invite</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}