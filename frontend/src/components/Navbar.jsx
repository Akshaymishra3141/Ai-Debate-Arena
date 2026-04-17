import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const NAV_LINKS = [
  { label: "Home",      path: "/" },
  { label: "About",     path: "/about" },
  { label: "Join Beta", path: "/join-beta" },
  { label: "Contact",   path: "/contact" },
];

/* ── Sun icon ── */
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
    </svg>
  );
}

/* ── Moon icon ── */
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/* ── Avatar + Dropdown ── */
function UserAvatar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  // First letter of username, uppercased
  const initial = (user?.username || user?.userName || "U")[0].toUpperCase();

  return (
    <div ref={ref} style={{ position: "relative", marginLeft: "10px" }}>
      {/* Avatar button */}
      <button
        id="nav-avatar-btn"
        onClick={() => setOpen((v) => !v)}
        title={user?.username || "Account"}
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          backgroundColor: "var(--btn-bg)",
          color: "var(--btn-text)",
          border: "2px solid var(--border2)",
          fontSize: "0.85rem",
          fontWeight: "700",
          fontFamily: "Inter, sans-serif",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "border-color 0.2s ease, transform 0.15s ease",
          transform: open ? "scale(0.94)" : "scale(1)",
          letterSpacing: "0",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--t2)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border2)"; }}
      >
        {initial}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            minWidth: "180px",
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden",
            animation: "fadeIn 0.15s ease both",
            zIndex: 999,
          }}
        >
          {/* User info header */}
          <div
            style={{
              padding: "12px 14px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--t1)" }}>
              {user?.username || user?.userName}
            </div>
            <div style={{ fontSize: "0.74rem", color: "var(--t3)", marginTop: "2px", wordBreak: "break-all" }}>
              {user?.email}
            </div>
          </div>

          {/* Sign out */}
          <button
            id="nav-signout-btn"
            onClick={() => { setOpen(false); onLogout(); }}
            style={{
              width: "100%",
              padding: "10px 14px",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "0",
              color: "var(--t2)",
              fontSize: "0.82rem",
              fontWeight: "500",
              fontFamily: "Inter, sans-serif",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background-color 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg2)";
              e.currentTarget.style.color = "var(--t1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--t2)";
            }}
          >
            <span style={{ fontSize: "13px" }}>↪</span>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────────── */
function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { dark, toggle } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.info("You've been signed out.");
    navigate("/");   // go to Home, not /login
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: "60px",
        backgroundColor: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          letterSpacing: "3px",
          color: "var(--t1)",
          textDecoration: "none",
          textTransform: "uppercase",
        }}
      >
        AI Debate Arena
      </Link>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>

        {/* Nav links */}
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding: "6px 16px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: isActive ? 500 : 400,
                letterSpacing: "0.3px",
                textDecoration: "none",
                color: isActive ? "var(--t1)" : "var(--t2)",
                backgroundColor: isActive ? "var(--bg2)" : "transparent",
                border: isActive ? "1px solid var(--border)" : "1px solid transparent",
              }}
              className="nav-link"
            >
              {link.label}
            </Link>
          );
        })}

        {/* ── Auth section ──────────────────────────────── */}
        {isLoggedIn ? (
          /* Logged in → show avatar with dropdown */
          <UserAvatar user={user} onLogout={handleLogout} />
        ) : (
          /* Logged out → Show Sign up + Login */
          <>
            <Link
              id="nav-signup-btn"
              to="/signup"
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: 500,
                textDecoration: "none",
                color: "var(--t2)",
                border: "1px solid var(--border)",
                marginLeft: "8px",
              }}
              className="nav-link"
            >
              Sign up
            </Link>
            <Link
              id="nav-login-btn"
              to="/login"
              style={{
                padding: "6px 16px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
                color: "var(--btn-text)",
                backgroundColor: "var(--btn-bg)",
                border: "1px solid transparent",
                marginLeft: "6px",
              }}
              className="nav-login"
            >
              Login
            </Link>
          </>
        )}

        {/* ── Dark mode toggle ──────────────────────────── */}
        <button
          id="theme-toggle"
          onClick={toggle}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            marginLeft: "8px",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--card2)",
            color: "var(--t2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          className="theme-btn"
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      <style>{`
        .nav-link:hover {
          color: var(--t1) !important;
          background-color: var(--bg2) !important;
          border-color: var(--border) !important;
        }
        .nav-login:hover {
          background-color: var(--btn-hover) !important;
        }
        .theme-btn:hover {
          background-color: var(--card) !important;
          color: var(--t1) !important;
          border-color: var(--border2) !important;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
