import axiosClient from "./axiosClient";

// Generates exercises for the authenticated user
export const generateExercises = (limit = 5) => {
  // Added export
  return axiosClient.get(`/exercises/generate?limit=${limit}`);
};

// Submits the answer to an exercise for evaluation
export const submitExerciseAnswer = (exerciseId, userAnswer) => {
  // Added export
  return axiosClient.post(`/exercises/${exerciseId}/submit`, { userAnswer });
};
