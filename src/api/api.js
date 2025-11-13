import axios from "axios";

// ✅ Axios instance for backend
const API = axios.create({
  baseURL: "http://localhost:8098/api", // Spring Boot backend URL
  timeout: 10000,
});

// ==================== Users ====================
export const loginUser = (payload) => API.post("/users/login", payload);
export const registerUser = (payload) => API.post("/users/register", payload);
export const getAllUsers = () => API.get("/users/all");
export const getTeamUsers = (teamName) => API.get(`/users/team/${teamName}`);
export const updateEmployee = (id, payload, currentUser) =>
  API.put(`/users/update/${id}?currentUser=${encodeURIComponent(currentUser)}`, payload);
export const deleteUser = (id, currentUser) =>
  API.delete(`/users/delete/${id}?currentUser=${encodeURIComponent(currentUser)}`);

// ==================== Products ====================
export const addProduct = (payload) => API.post("/master/products", payload);
export const updateProduct = (id, payload) => API.put(`/master/products/${id}`, payload);
export const deleteProduct = (id) => API.delete(`/master/products/${id}`);
export const getProducts = (teamName = "") =>
  API.get(`/master/products${teamName ? `?teamName=${teamName}` : ""}`);

// ==================== Employees ====================
export const getEmployees = (teamName = "") =>
  API.get(`/master/employee${teamName ? `?teamName=${teamName}` : ""}`);

// ==================== Revenue ====================
export const getRevenue = (teamName = "") =>
  API.get(`/master/revenue${teamName ? `?teamName=${teamName}` : ""}`);

// ==================== Teams ====================
export const getTeams = async () => {
  try {
    const response = await API.get("/master/teams");
    return response.data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
};
// Add this in the Users section
export const checkUsernameExists = (username) =>
  API.get(`/users/check-username?username=${encodeURIComponent(username)}`);
