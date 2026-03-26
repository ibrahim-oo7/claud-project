import axios from "axios";

const API_URL = "http://localhost:3004/projects";

export const getProjectById = async (projectId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};