import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import JoinBeta from "./pages/JoinBeta";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DebatePage from "./pages/DebatePage";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider gives useAuth() access to every page in the app */}
      <AuthProvider>
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "var(--bg)",
            color: "var(--t1)",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          {/* Navbar is hidden on /login and /dashboard for a clean full-page layout */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Main app routes — all wrapped with Navbar */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/join-beta" element={<JoinBeta />} />
                    <Route
                      path="/debate"
                      element={
                        <ProtectedRoute>
                          <DebatePage />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </>
              }
            />
          </Routes>
        </div>

        <ToastContainer
          position="bottom-right"
          autoClose={3500}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          toastStyle={{
            backgroundColor: "var(--card)",
            color: "var(--t1)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            boxShadow: "var(--shadow-md)",
            fontSize: "0.85rem",
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
