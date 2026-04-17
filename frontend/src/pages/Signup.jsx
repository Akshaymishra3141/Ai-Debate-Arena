import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

/* ── Spinner keyframe (injected once) ── */
if (!document.getElementById("spin-style")) {
  const style = document.createElement("style");
  style.id = "spin-style";
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

/* ── Styles using the project's design tokens ── */
const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--bg)",
    padding: "40px 16px",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
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
    marginBottom: "26px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: "500",
    color: "var(--t2)",
    marginBottom: "6px",
    letterSpacing: "0.01em",
  },
  inputWrap: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--t3)",
    fontSize: "13px",
    pointerEvents: "none",
  },
  input: (err) => ({
    width: "100%",
    padding: "10px 14px 10px 36px",
    backgroundColor: "var(--card2)",
    border: `1px solid ${err ? "#e05252" : "var(--border)"}`,
    borderRadius: "10px",
    color: "var(--t1)",
    fontFamily: "Inter, sans-serif",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  }),
  errorText: {
    fontSize: "0.74rem",
    color: "#e05252",
    marginTop: "5px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  passwordHint: {
    fontSize: "0.74rem",
    color: "var(--t3)",
    marginTop: "5px",
  },
  strengthBar: {
    height: "3px",
    borderRadius: "2px",
    marginTop: "7px",
    transition: "width 0.3s ease, background-color 0.3s ease",
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
    marginTop: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background-color 0.2s ease",
  }),
  spinner: {
    width: "15px",
    height: "15px",
    border: "2px solid var(--t3)",
    borderTop: "2px solid var(--t1)",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    flexShrink: 0,
  },
  footer: {
    textAlign: "center",
    marginTop: "22px",
    fontSize: "0.82rem",
    color: "var(--t3)",
  },
  link: {
    color: "var(--t1)",
    fontWeight: "600",
    textDecoration: "none",
    marginLeft: "4px",
  },
};

/* ── Password strength helper ── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "", color: "transparent" },
    { label: "Very weak", color: "#e05252" },
    { label: "Weak",      color: "#e07c52" },
    { label: "Fair",      color: "#d4a017" },
    { label: "Good",      color: "#52a8e0" },
    { label: "Strong",    color: "#4caf7d" },
  ];
  return { score, ...map[score] };
}

/* ─────────────────────────────────────────────────────────────
   SIGNUP PAGE
───────────────────────────────────────────────────────────── */
export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = getStrength(form.password);

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.userName.trim())
      errs.userName = "Username is required";
    else if (form.userName.trim().length < 2)
      errs.userName = "Username must be at least 2 characters";

    if (!form.email)
      errs.email = "Email is required";
    else if (!emailRx.test(form.email))
      errs.email = "Enter a valid email address";

    if (!form.password)
      errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";

    if (!form.confirmPassword)
      errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/auth/api/register", {
        userName: form.userName.trim(),
        email: form.email.toLowerCase(),
        password: form.password,
      });

      toast.success("Account created! You can now log in 🎉");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      // Show field-level error for duplicate email
      if (err.response?.status === 409) {
        setErrors((prev) => ({ ...prev, email: msg }));
      } else {
        toast.error(msg);
      }
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

        <h1 style={s.heading}>Create your account</h1>
        <p style={s.subheading}>Join the arena — it's free</p>

        <form onSubmit={handleSubmit} noValidate id="signup-form">

          {/* Username */}
          <div style={s.formGroup}>
            <label htmlFor="userName" style={s.label}>Username</label>
            <div style={s.inputWrap}>
              <span style={s.icon}>👤</span>
              <input
                id="userName"
                name="userName"
                type="text"
                autoComplete="username"
                placeholder="John Doe"
                value={form.userName}
                onChange={handleChange}
                disabled={loading}
                style={s.input(!!errors.userName)}
              />
            </div>
            {errors.userName && <div style={s.errorText}>⚠ {errors.userName}</div>}
          </div>

          {/* Email */}
          <div style={s.formGroup}>
            <label htmlFor="email" style={s.label}>Email address</label>
            <div style={s.inputWrap}>
              <span style={s.icon}>✉</span>
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
            {errors.email && <div style={s.errorText}>⚠ {errors.email}</div>}
          </div>

          {/* Password */}
          <div style={s.formGroup}>
            <label htmlFor="password" style={s.label}>Password</label>
            <div style={s.inputWrap}>
              <span style={s.icon}>🔒</span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                style={{ ...s.input(!!errors.password), paddingRight: "44px" }}
              />
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--t3)",
                  padding: "4px",
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {/* Password strength bar */}
            {form.password && (
              <div>
                <div
                  style={{
                    ...s.strengthBar,
                    width: `${(strength.score / 5) * 100}%`,
                    backgroundColor: strength.color,
                  }}
                />
                <div style={{ ...s.passwordHint, color: strength.color, marginTop: "4px" }}>
                  {strength.label}
                </div>
              </div>
            )}
            {errors.password && <div style={s.errorText}>⚠ {errors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div style={s.formGroup}>
            <label htmlFor="confirmPassword" style={s.label}>Confirm password</label>
            <div style={s.inputWrap}>
              <span style={s.icon}>🔒</span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                style={s.input(!!errors.confirmPassword)}
              />
            </div>
            {/* Match indicator */}
            {form.confirmPassword && !errors.confirmPassword && (
              <div style={{ ...s.passwordHint, color: "#4caf7d", marginTop: "4px" }}>
                ✓ Passwords match
              </div>
            )}
            {errors.confirmPassword && (
              <div style={s.errorText}>⚠ {errors.confirmPassword}</div>
            )}
          </div>

          {/* Submit */}
          <button
            id="signup-submit-btn"
            type="submit"
            disabled={loading}
            style={s.btn(loading)}
          >
            {loading ? (
              <>
                <div style={s.spinner} />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p style={s.footer}>
          Already have an account?
          <Link to="/login" style={s.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
