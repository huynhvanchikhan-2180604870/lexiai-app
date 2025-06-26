import { useCallback, useState } from "react";
import { toast } from "react-hot-toast"; // For notifications

/**
 * A custom hook for handling asynchronous API calls, managing loading and error states.
 * @param {Function} apiFunction - The asynchronous function that performs the API call.
 * @returns {{ data: any, loading: boolean, error: string | null, execute: Function, setData: Function, setError: Function }}
 */
export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFunction(...args);
        setData(response.data);
        return response.data; // Return data for chaining if needed
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred.";
        setError(errorMessage);
        toast.error(errorMessage); // Show toast notification for API errors
        throw err; // Re-throw to allow callers to handle specific errors
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  return { data, loading, error, execute, setData, setError };
};
