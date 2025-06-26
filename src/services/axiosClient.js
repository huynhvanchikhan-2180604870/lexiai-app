import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token to headers
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Bearer token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (e.g., 401 Unauthorized)
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Example: If 401 Unauthorized, automatically log out user
    if (error.response && error.response.status === 401) {
      // Use window.location.href or a more robust global state management
      // to redirect to login and clear token.
      // For now, just log and reject.
      console.error(
        "Unauthorized access or session expired:",
        error.response.data.message
      );
      // You would typically dispatch a logout action here if using Redux/Zustand
      // or clear AuthContext state and redirect
      // This is handled more robustly in AuthContext for redirecting
    }
    return Promise.reject(error); // Propagate error
  }
);

export default axiosClient;
