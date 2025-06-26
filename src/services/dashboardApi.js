import axiosClient from "./axiosClient";

// Get comprehensive dashboard summary data
// This API call assumes your backend has an endpoint like GET /api/dashboard/summary
// which returns processed data (total words, words today, review count, difficulty counts, 7-day data).
// In our current backend, getDashboardSummary in backend's dashboardService.js fetches all vocab
// and processes it. So, this frontend API simply calls a backend endpoint that aggregates data.
export const getDashboardSummary = () => {
  return axiosClient.get("/dashboard/summary");
};

// You can add more specific API calls for different chart data if your backend provides them separately.
// For example:
// export const getSevenDayProgress = () => {
//   return axiosClient.get('/dashboard/seven-day-progress');
// };
//
// export const getDifficultyDistribution = () => {
//   return axiosClient.get('/dashboard/difficulty-distribution');
// };
