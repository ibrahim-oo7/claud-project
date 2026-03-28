import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import "./ModifierUtilisateur.css";

export default function ModifierUtilisateur() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getUser = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setPassword(res.data.password);
      setRole(res.data.role);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, [id]);

  const updateUser = async (e) => {
    e.preventDefault();
    const updatedUser = {
      username: username,
      email: email,
      password: password,
      role: role,
    };
    try {
      await axios.put(`http://localhost:3001/update/${id}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/AfficherUtilisateurs");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!user) {
    return <div className="modifier-loading">Loading...</div>;
  }

  return (
    <div className="modifier-page">
      <div className="modifier-card">
        <div className="modifier-header">
          <h1 className="modifier-title">Modifier Utilisateur</h1>
          <p className="modifier-subtitle">
            Update user information and role settings
          </p>
        </div>

        <form onSubmit={updateUser} className="modifier-form">
          <div className="modifier-form-group">
            <label className="modifier-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username..."
              className="modifier-input"
            />
          </div>

          <div className="modifier-form-group">
            <label className="modifier-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email..."
              className="modifier-input"
            />
          </div>

          <div className="modifier-form-group">
            <label className="modifier-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password..."
              className="modifier-input"
            />
          </div>

          <div className="modifier-form-group">
            <label className="modifier-label">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="modifier-select"
            >
              <option value="" disabled>
                choose
              </option>
              <option value="admin">admin</option>
              <option value="student">student</option>
            </select>
          </div>

          <button type="submit" className="modifier-btn">
            Modifier
          </button>
        </form>
      </div>
    </div>
  );
}