import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

/* ── Styles using project design tokens ── */
const s = {
  page: {
    minHeight: "100vh",
    backgroundColor: "var(--bg)",
    padding: "80px 24px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  topBar: {
    width: "100%",
    maxWidth: "760px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    backgroundColor: "var(--btn-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--btn-text)",
    fontSize: "16px",
    fontWeight: "700",
  },
  logoText: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "var(--t1)",
  },
  logoutBtn: {
    padding: "8px 18px",
    backgroundColor: "transparent",
    border: "1px solid var(--border2)",
    borderRadius: "8px",
    color: "var(--t2)",
    fontSize: "0.8rem",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  card: {
    width: "100%",
    maxWidth: "760px",
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "18px",
    padding: "36px",
    boxShadow: "var(--shadow-md)",
    marginBottom: "24px",
    animation: "fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
  },
  badge: {
    display: "inline-block",
    padding: "3px 10px",
    backgroundColor: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    fontSize: "0.72rem",
    fontWeight: "600",
    color: "var(--t3)",
    letterSpacing: "0.05em",
    marginBottom: "14px",
    textTransform: "uppercase",
  },
  heading: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "var(--t1)",
    marginBottom: "4px",
    letterSpacing: "-0.02em",
  },
  sub: {
    fontSize: "0.875rem",
    color: "var(--t2)",
    marginBottom: "28px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "6px",
  },
  infoBox: {
    backgroundColor: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "16px 18px",
  },
  infoLabel: {
    fontSize: "0.72rem",
    fontWeight: "600",
    color: "var(--t3)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "4px",
  },
  infoValue: {
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "var(--t1)",
    wordBreak: "break-all",
  },
  divider: {
    border: "none",
    borderTop: "1px solid var(--border)",
    margin: "28px 0",
  },
  sectionTitle: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "var(--t2)",
    marginBottom: "14px",
    letterSpacing: "-0.01em",
  },
  profileData: {
    backgroundColor: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "16px 18px",
  },
  profileLoading: {
    fontSize: "0.85rem",
    color: "var(--t3)",
    fontStyle: "italic",
  },
  codeBlock: {
    fontFamily: "monospace",
    fontSize: "0.8rem",
    color: "var(--t2)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
    lineHeight: "1.6",
  },
  errorState: {
    fontSize: "0.85rem",
    color: "#e05252",
  },
};

/* ─────────────────────────────────────────────────────────────
   DASHBOARD PAGE — Protected Route
   Redirects to /login if user is not authenticated.
───────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user, token, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  /* ── Guard: redirect if not logged in ── */
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  /* ── Demo: fetch protected API endpoint ── */
  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/auth/api/my-profile", {
          headers: {
            Authorization: `Bearer ${token}`,  // ← how to send JWT in every request
          },
        });
        setProfile(res.data);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to fetch profile";
        setProfileError(msg);
        // If session expired, force logout
        if (err.response?.status === 403) {
          toast.error("Session expired. Please log in again.");
          logout();
          navigate("/login");
        }
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [isLoggedIn, token, logout, navigate]);

  /* ── Logout handler ── */
  const handleLogout = () => {
    logout();
    toast.info("You've been logged out.");
    navigate("/login");
  };

  if (!isLoggedIn) return null; // prevent flash before redirect

  return (
    <div style={s.page}>

      {/* Top Bar */}
      <div style={s.topBar}>
        <div style={s.logo}>
          <div style={s.logoIcon}>A</div>
          <span style={s.logoText}>AI Debate Arena</span>
        </div>
        <button
          id="logout-btn"
          style={s.logoutBtn}
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--bg2)";
            e.currentTarget.style.color = "var(--t1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--t2)";
          }}
        >
          Sign out
        </button>
      </div>

      {/* Welcome Card */}
      <div style={s.card}>
        <span style={s.badge}>🔒 Protected Route</span>
        <h1 style={s.heading}>Hello, {user?.username || "User"} 👋</h1>
        <p style={s.sub}>You are successfully authenticated. This page is only visible to logged-in users.</p>

        {/* User Info Grid */}
        <div style={s.grid}>
          <div style={s.infoBox}>
            <div style={s.infoLabel}>Username</div>
            <div style={s.infoValue}>{user?.username || "—"}</div>
          </div>
          <div style={s.infoBox}>
            <div style={s.infoLabel}>Email</div>
            <div style={s.infoValue}>{user?.email || "—"}</div>
          </div>
          <div style={s.infoBox}>
            <div style={s.infoLabel}>User ID</div>
            <div style={s.infoValue}>{user?.id || "—"}</div>
          </div>
          <div style={s.infoBox}>
            <div style={s.infoLabel}>Session</div>
            <div style={s.infoValue}>Active (1 hour)</div>
          </div>
        </div>

        <hr style={s.divider} />

        {/* Protected API Demo */}
        <div style={s.sectionTitle}>
          Protected API response — GET /auth/api/my-profile
        </div>
        <div style={s.profileData}>
          {profileLoading && (
            <div style={s.profileLoading}>Fetching from server…</div>
          )}
          {profileError && (
            <div style={s.errorState}>⚠ {profileError}</div>
          )}
          {profile && !profileLoading && (
            <pre style={s.codeBlock}>{JSON.stringify(profile, null, 2)}</pre>
          )}
        </div>
      </div>

      {/* How it works note */}
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "20px 24px",
          boxShadow: "var(--shadow-sm)",
          animation: "fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
        }}
      >
        <div style={{ ...s.sectionTitle, marginBottom: "8px" }}>
          How protected routes work in this app
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "0.8rem",
            color: "var(--t2)",
            lineHeight: "1.8",
          }}
        >
          {"// Frontend sends JWT in every request:\n"}
          {"axios.get('/auth/api/my-profile', {\n"}
          {"  headers: { Authorization: `Bearer ${token}` }\n"}
          {"});\n\n"}
          {"// Backend verifyToken middleware:\n"}
          {"// 1. Reads Authorization header\n"}
          {"// 2. Verifies JWT signature + expiry\n"}
          {"// 3. Attaches decoded user to req.user\n"}
          {"// 4. Calls next() to reach the route handler"}
        </div>
      </div>
    </div>
  );
}
