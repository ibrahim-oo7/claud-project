import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function ModifierUtilisateur() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const { id } = useParams(); 
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const getUser = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            setUsername(res.data.username);
            setEmail(res.data.email);
            setPassword(res.data.password);
            setRole(res.data.role);
        } catch (error) {
            console.error('Error fetching user:', error);
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
            role: role
        };
        try {
            const res = await axios.put(`http://localhost:3001/update/${id}`, updatedUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/AfficherUtilisateurs');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h2>Modifier Utilisateur</h2>
            <form onSubmit={updateUser}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username..."
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email..."
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password..."
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="" disabled>choose</option>
                    <option value="admin">admin</option>
                    <option value="student">student</option>
                </select>
                <button type="submit">Modifier</button>
            </form>
        </>
    );
}