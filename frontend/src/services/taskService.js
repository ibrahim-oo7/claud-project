import axios from "axios";

const API_URL = "http://localhost:5002/api/tasks";

export const getTasksByProject = async (projectId) => {
  const response = await axios.get(`${API_URL}/project/${projectId}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axios.delete(`${API_URL}/${taskId}`);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await axios.patch(`${API_URL}/${taskId}/status`, { status });
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await axios.put(`${API_URL}/${taskId}`, taskData);
  return response.data;
};

export const assignTaskToUser = async (taskId, assignedTo) => {
  const response = await axios.patch(`${API_URL}/${taskId}/assign`, {
    assignedTo,
  });
  return response.data;
};

export const addCommentToTask = async (taskId, commentData) => {
  const response = await axios.post(`${API_URL}/${taskId}/comments`, commentData);
  return response.data;
};

export const uploadTaskFile = async (taskId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_URL}/${taskId}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};