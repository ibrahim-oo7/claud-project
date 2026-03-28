import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3001/register", {
        username,
        email,
        password,
        role,
      });

      const userData = res.data.user || res.data;

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      localStorage.setItem("user", JSON.stringify(userData));

      if (userData.role === "admin") {
        navigate("/AfficherUtilisateurs");
      } else {
        navigate("/afficher");
      }
    } catch (err) {
      console.log(err.response);
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">
            Join TaskFlow and start managing your projects easily
          </p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          {error && <div className="register-error">{error}</div>}

          <div className="register-form-group">
            <label className="register-label">Username</label>
            <input
              type="text"
              value={username}
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
              className="register-input"
              required
            />
          </div>

          <div className="register-form-group">
            <label className="register-label">Email</label>
            <input
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              className="register-input"
              required
            />
          </div>

          <div className="register-form-group">
            <label className="register-label">Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              className="register-input"
              required
            />
          </div>

          <div className="register-form-group">
            <label className="register-label">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="register-select"
              required
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="admin">admin</option>
              <option value="membre">membre</option>
              <option value="invite">invite</option>
            </select>
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}