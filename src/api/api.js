import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8098/api", // Spring Boot backend
  timeout: 10000,
});

// ✅ Authentication
export const loginUser = (payload) => API.post("/users/login", payload);
export const registerUser = (payload) => API.post("/users/register", payload);

// ✅ Users
export const getAllUsers = () => API.get("/users/all");
export const getTeamUsers = (teamName) => API.get(`/users/team/${teamName}`);

// Pass currentUser as query param for authorization
export const updateEmployee = (id, payload, options = {}) =>
  API.put(`/users/update/${id}`, payload, options);

export const deleteUser = (id, options = {}) =>
  API.delete(`/users/delete/${id}`, options);

// ✅ Product endpoints
export const getProductSales = (scope = "") => API.get(`/master/sales${scope}`);
export const addProduct = (payload) => API.post("/master/sales", payload);
export const updateProduct = (id, payload) => API.put(`/master/sales/${id}`, payload);
export const deleteProduct = (id) => API.delete(`/master/sales/${id}`);

// ✅ Revenue endpoint
export const getRevenue = (scope = "") => API.get(`/master/revenue${scope}`);
