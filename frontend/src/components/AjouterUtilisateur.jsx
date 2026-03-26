import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
export default function Ajouter(){
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [role,setRole] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const addUser = async (e) => {
        e.preventDefault(); 
        const newUser = {
            username : username,
            email : email,
            password : password,
            role : role
        }
        const res = await axios.post('http://localhost:3001/add', newUser, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/AfficherUtilisateurs');
    }
    return (
        <>
        <form onSubmit={addUser}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username..." />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email..." />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password..." />
            <select value={role} onChange={(e) => setRole(e.target.value)} id="">
                <option value="" disabled>choose</option>
                <option value="admin">admin</option>
                <option value="membre">membre</option>
                <option value="invite">invite</option>
            </select>
            <button type="submit">ajouter</button>
        </form>
        </>
    )
}