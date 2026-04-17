import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

/* ── Inline styles follow the project's design token system ── */
const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--bg)",
    padding: "24px 16px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "18px",
    padding: "40px 36px",
    boxShadow: "var(--shadow-lg)",
    animation: "fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "var(--btn-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--btn-text)",
    fontSize: "18px",
    fontWeight: "700",
  },
  logoText: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "var(--t1)",
    letterSpacing: "-0.01em",
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "var(--t1)",
    marginBottom: "6px",
    letterSpacing: "-0.02em",
  },
  subheading: {
    fontSize: "0.85rem",
    color: "var(--t2)",
    marginBottom: "28px",
  },
  formGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: "500",
    color: "var(--t2)",
    marginBottom: "6px",
    letterSpacing: "0.01em",
  },
  inputWrapper: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--t3)",
    fontSize: "14px",
    pointerEvents: "none",
  },
  input: (hasError) => ({
    width: "100%",
    padding: "10px 14px 10px 36px",
    backgroundColor: "var(--card2)",
    border: `1px solid ${hasError ? "#e05252" : "var(--border)"}`,
    borderRadius: "10px",
    color: "var(--t1)",
    fontFamily: "Inter, sans-serif",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  }),
  errorText: {
    fontSize: "0.75rem",
    color: "#e05252",
    marginTop: "5px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  btn: (loading) => ({
    width: "100%",
    padding: "11px",
    backgroundColor: loading ? "var(--border2)" : "var(--btn-bg)",
    color: loading ? "var(--t3)" : "var(--btn-text)",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: "600",
    fontFamily: "Inter, sans-serif",
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background-color 0.2s ease, transform 0.1s ease",
    transform: loading ? "none" : undefined,
  }),
  divider: {
    textAlign: "center",
    margin: "22px 0 0",
    fontSize: "0.82rem",
    color: "var(--t3)",
  },
  link: {
    color: "var(--t1)",
    fontWeight: "600",
    textDecoration: "none",
    marginLeft: "4px",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid var(--t3)",
    borderTop: "2px solid var(--t1)",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};

/* ── Spinner CSS injected once ── */
const spinnerStyle = document.createElement("style");
spinnerStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinnerStyle);

/* ─────────────────────────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────────────────────────── */
export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email)             errs.email    = "Email is required";
    else if (!emailRx.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password)          errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be ≥ 6 characters";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/auth/api/login", {
        email: form.email,
        password: form.password,
      });

      // Success
      authLogin(res.data.user, res.data.token);
      toast.success("Login successful! Welcome back 👋");
      navigate("/");   // redirect to Home

    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ── */
  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Logo */}
        <div style={s.logo}>
          <div style={s.logoIcon}>A</div>
          <span style={s.logoText}>AI Debate Arena</span>
        </div>

        <h1 style={s.heading}>Welcome back</h1>
        <p style={s.subheading}>Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} noValidate id="login-form">

          {/* Email */}
          <div style={s.formGroup}>
            <label htmlFor="email" style={s.label}>Email address</label>
            <div style={s.inputWrapper}>
              <span style={s.inputIcon}>✉</span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                style={s.input(!!errors.email)}
              />
            </div>
            {errors.email && (
              <div style={s.errorText}>⚠ {errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div style={s.formGroup}>
            <label htmlFor="password" style={s.label}>Password</label>
            <div style={s.inputWrapper}>
              <span style={s.inputIcon}>🔒</span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                style={s.input(!!errors.password)}
              />
            </div>
            {errors.password && (
              <div style={s.errorText}>⚠ {errors.password}</div>
            )}
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            style={s.btn(loading)}
          >
            {loading ? (
              <>
                <div style={s.spinner} />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p style={s.divider}>
          Don't have an account?
          <Link to="/signup" style={s.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
