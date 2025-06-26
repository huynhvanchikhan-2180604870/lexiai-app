import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";

// Main Application Pages
import AIAssistantPage from "../pages/ai-assistant/AIAssistantPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ReviewPracticePage from "../pages/review-practice/ReviewPracticePage"; // Uncomment this
import VocabPage from "../pages/vocabulary/VocabPage";
// import AchievementsPage from '../pages/gamification/AchievementsPage';
// import LeaderboardPage from '../pages/gamification/LeaderboardPage';
import NotFoundPage from "../pages/NotFoundPage";

// Private Route component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-lexi-background">
        <div className="text-xl font-semibold text-lexi-subheadline">
          Đang tải...
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Main component that defines all application routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route
        path="/forgot-password"
        element={
          <p className="text-center text-lexi-subheadline text-xl mt-10">
            Forgot Password Page (TODO)
          </p>
        }
      />
      {/* Private Routes */}
      <Route
        path="/vocabulary"
        element={
          <PrivateRoute>
            <VocabPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/ai-chat"
        element={
          <PrivateRoute>
            <AIAssistantPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/practice"
        element={
          <PrivateRoute>
            <ReviewPracticePage />
          </PrivateRoute>
        }
      />{" "}
      {/* Uncomment this */}
      {/*
      <Route path="/achievements" element={<PrivateRoute><AchievementsPage /></PrivateRoute>} />
      <Route path="/leaderboard" element={<PrivateRoute><LeaderboardPage /></PrivateRoute>} />
      */}
      {/* Default redirect for the root path. After login, users are directed here. */}
      <Route path="/" element={<Navigate to="/vocabulary" />} />
      {/* Catch-all for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
