import axiosClient from "./axiosClient";

// Add a new vocabulary word
export const addWord = (word) => {
  return axiosClient.post("/vocabulary", { word });
};

// Get all vocabulary words for the authenticated user
export const getAllWords = () => {
  return axiosClient.get("/vocabulary");
};

// Get a single vocabulary word by ID
export const getWordById = (id) => {
  return axiosClient.get(`/vocabulary/${id}`);
};

// Update an existing vocabulary word
export const updateWord = (id, updateData) => {
  return axiosClient.put(`/vocabulary/${id}`, updateData);
};

// Delete a vocabulary word
export const deleteWord = (id) => {
  return axiosClient.delete(`/vocabulary/${id}`);
};

// Submit a review for a vocabulary word (for SRS)
export const reviewWord = (id, quality) => {
  return axiosClient.post(`/vocabulary/review/${id}`, { quality });
};
