import axiosClient from "./axiosClient";

// Performs the daily check-in
export const performDailyCheckIn = () => {
  return axiosClient.post("/check-in/daily");
};

// Checks if the user has already checked in today
export const getDailyCheckInStatus = () => {
  return axiosClient.get("/check-in/status");
};
