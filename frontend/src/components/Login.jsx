import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
    <>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      <Link to="/register">register</Link>
    </>
  );
}