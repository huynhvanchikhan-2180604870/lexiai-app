import axiosClient from "./axiosClient";

export const registerUser = (username, email, password) => {
  return axiosClient.post("/auth/register", { username, email, password });
};

export const loginUser = (email, password) => {
  return axiosClient.post("/auth/login", { email, password });
};

export const verifyEmail = (token) => {
  // Use a GET request for email verification with token as query parameter
  return axiosClient.get(`/auth/verify-email?token=${token}`);
};
