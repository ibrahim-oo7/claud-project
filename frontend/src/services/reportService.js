import axios from "axios";

const API = "http://localhost:5003/api/reports";

export const getStatusStats = async (projectId) => {
  const res = await axios.get(`${API}/status/${projectId}`);
  return res.data;
};

export const getPriorityStats = async (projectId) => {
  const res = await axios.get(`${API}/priority/${projectId}`);
  return res.data;
};

export const getProgress = async (projectId) => {
  const res = await axios.get(`${API}/progress/${projectId}`);
  return res.data;
};

export const getUserStats = async (projectId) => {
  const res = await axios.get(`${API}/user/${projectId}`);
  return res.data;
};