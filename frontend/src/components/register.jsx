import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        role
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
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Créer un compte</h2>

        {error && <div className="register-error">{error}</div>}

        <input 
          type="text" 
          value={username}
          placeholder="Username" 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          value={email}
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          value={password}
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="" disabled>select</option>
          <option value="admin">admin</option>
          <option value="membre">membre</option>
          <option value="invite">invite</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}