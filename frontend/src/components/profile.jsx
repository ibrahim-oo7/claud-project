import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfileEdit.css";

export default function ProfileEdit() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:3001/profile/update/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err.response || err.message);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="profile-edit-page">
      <div className="profile-edit-container">
        <div className="profile-edit-header">
          <h2 className="profile-edit-title">Edit Profile</h2>
          <p className="profile-edit-subtitle">
            Update your personal information and password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="profile-edit-form-group">
            <label className="profile-edit-label">Username:</label>
            <input
              className="profile-edit-input"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-edit-form-group">
            <label className="profile-edit-label">Email:</label>
            <input
              className="profile-edit-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-edit-form-group">
            <label className="profile-edit-label">
              Old Password (required to change password):
            </label>
            <input
              className="profile-edit-input"
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
            />
          </div>

          <div className="profile-edit-form-group">
            <label className="profile-edit-label">New Password:</label>
            <input
              className="profile-edit-input"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>

          <button className="profile-edit-btn" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}