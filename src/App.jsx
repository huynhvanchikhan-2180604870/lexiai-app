import { Toaster } from "react-hot-toast"; // Toaster is best placed at the root level
import { BrowserRouter as Router } from "react-router-dom"; // Router should be the outermost component
import { AuthProvider } from "./contexts/AuthContext.jsx"; // AuthProvider now a child of Router

// Layout Components
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

// Import the centralized routing component
import AppRoutes from "./router/index.jsx";

const App = () => {
  return (
    <Router>
      {" "}
      {/* BrowserRouter is now the top-level router */}
      <AuthProvider>
        {" "}
        {/* AuthProvider is now within the Router's context, allowing useNavigate to work */}
        <div className="flex flex-col min-h-screen">
          <Header /> {/* Header and Footer remain part of the main layout */}
          <main className="flex-grow container mx-auto p-4">
            <AppRoutes /> {/* AppRoutes handles all specific routes */}
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" reverseOrder={false} />{" "}
        {/* Toaster for notifications */}
      </AuthProvider>
    </Router>
  );
};

export default App;
