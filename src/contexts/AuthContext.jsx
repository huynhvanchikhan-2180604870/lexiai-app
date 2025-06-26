import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast"; // For toast notifications
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  verifyEmail as verifyEmailApi,
} from "../services/authApi"; // Import API functions

// Create a context for authentication state and EXPORT IT
export const AuthContext = createContext(null);

// AuthProvider component to wrap the application and provide auth state
export const AuthProvider = ({ children }) => {
  // State for authentication status, user data, and loading
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state for auth check
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Effect to check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem("token"); // Get JWT token from local storage
        const storedUser = localStorage.getItem("user"); // Get user data from local storage
        if (token && storedUser) {
          // Basic token validation (in a real app, you might want to send it to backend for verification)
          // For now, just check existence
          setUser(JSON.parse(storedUser)); // Parse and set user data
          setIsAuthenticated(true); // Set authenticated status
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.clear(); // Clear potentially corrupted data in local storage
        setIsAuthenticated(false); // Set authenticated status to false
        setUser(null); // Clear user data
      } finally {
        setLoading(false); // Set loading to false once check is complete
      }
    };
    checkAuthStatus(); // Call the function to check auth status
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to handle user login
  const login = async (email, password) => {
    setLoading(true); // Set loading to true during login process
    try {
      const response = await loginUser(email, password); // Call login API
      const { token, _id, username, email: userEmail } = response.data; // Destructure response data
      localStorage.setItem("token", token); // Store JWT token in local storage
      localStorage.setItem(
        "user",
        JSON.stringify({ _id, username, email: userEmail })
      ); // Store user data in local storage
      setIsAuthenticated(true); // Set authenticated status to true
      setUser({ _id, username, email: userEmail }); // Set user data
      toast.success("Đăng nhập thành công! Chào mừng bạn đến với LEXIAI!"); // Show success toast notification
      navigate("/vocabulary"); // Redirect to vocabulary page after successful login
      return true; // Return true for successful login
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      ); // Log error
      toast.error(
        error.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      ); // Show error toast notification
      setIsAuthenticated(false); // Set authenticated status to false
      setUser(null); // Clear user data
      return false; // Return false for failed login
    } finally {
      setLoading(false); // Set loading to false after login attempt
    }
  };

  // Function to handle user registration
  const register = async (username, email, password) => {
    setLoading(true); // Set loading to true during registration process
    try {
      const response = await registerUser(username, email, password); // Call register API
      toast.success(
        response.data.message ||
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản của bạn."
      ); // Show success toast notification
      navigate("/login"); // Redirect to login page after successful registration
      return true; // Return true for successful registration
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      ); // Log error
      toast.error(
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
      ); // Show error toast notification
      return false; // Return false for failed registration
    } finally {
      setLoading(false); // Set loading to false after registration attempt
    }
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.clear(); // Clear all data from local storage (token and user)
    setIsAuthenticated(false); // Set authenticated status to false
    setUser(null); // Clear user data
    toast("Bạn đã đăng xuất.", { icon: "👋" }); // Show logout toast notification
    navigate("/login"); // Redirect to login page after logout
  };

  // Function to handle email verification
  const verifyEmail = async (token) => {
    setLoading(true); // Set loading to true during verification process
    try {
      const response = await verifyEmailApi(token); // Call email verification API
      toast.success(
        response.data.message ||
          "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ."
      ); // Show success toast notification
      return true; // Return true for successful verification
    } catch (error) {
      console.error(
        "Email verification failed:",
        error.response?.data?.message || error.message
      ); // Log error
      toast.error(
        error.response?.data?.message ||
          "Xác thực email thất bại. Token không hợp lệ hoặc đã hết hạn."
      ); // Show error toast notification
      return false; // Return false for failed verification
    } finally {
      setLoading(false); // Set loading to false after verification attempt
    }
  };

  // Provide authentication state and functions to children components
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext
export const useAuth = () => useContext(AuthContext);
