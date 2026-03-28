import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      const userData = res.data.user || res.data;

      if (userData.isBlocked) {
        alert("Utilisateur bloqué");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      if (userData.role === "admin") {
        navigate("/AfficherUtilisateurs");
      } else {
        navigate("/afficher");
      }
    } catch (err) {
      console.log(err.response);
      alert("Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand-box">
            <h1 className="login-brand-title">TaskFlow</h1>
            <p className="login-brand-subtitle">Project Management Platform</p>
          </div>

          <div className="login-welcome">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">
              Sign in to access your workspace and manage your projects easily.
            </p>
          </div>
        </div>

        <div className="login-right">
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <div className="register-box">
            <span className="register-text">Don&apos;t have an account?</span>
            <Link to="/register" className="register-link">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}