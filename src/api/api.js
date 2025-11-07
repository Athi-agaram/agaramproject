import axios from "axios";

// Axios instance
const API = axios.create({
  baseURL: "http://localhost:8098/api",
  timeout: 10000,
});

// Update user authorization
export const updateUserAuthorization = (id, authorized) => {
  return API.put(`/users/update/${id}`, { authorized });
};

// User endpoints
export const loginUser = (payload) => API.post("/users/login", payload);
export const registerUser = (payload) => API.post("/users/register", payload);
export const getAllUsers = () => API.get("/users/all");
export const getTeamUsers = (teamId) => API.get(`/users/team/${teamId}`);

// Master endpoints
export const getProductSales = (scope = "") => API.get(`/master/sales${scope}`);
export const getRevenue = (scope = "") => API.get(`/master/revenue${scope}`);

// Admin actions 
export const addEmployee = (payload) => API.post("/master/employee", payload);
export const updateEmployee = (id, payload) => API.put(`/users/update/${id}`, payload);
export const deleteUser = (id) => API.delete(`/users/delete/${id}`);
