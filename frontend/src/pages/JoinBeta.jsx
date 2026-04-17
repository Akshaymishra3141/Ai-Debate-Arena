import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const s = {
  page: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 24px 80px",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    maxWidth: "460px",
  },
  label: {
    fontSize: "0.68rem",
    fontWeight: 500,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "var(--t3)",
    marginBottom: "14px",
  },
  h1: {
    fontSize: "clamp(2rem, 5vw, 2.8rem)",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    lineHeight: 1.1,
    color: "var(--t1)",
    marginBottom: "14px",
    fontFamily: "'Inter', sans-serif",
  },
  subtext: {
    fontSize: "0.9rem",
    color: "var(--t2)",
    lineHeight: 1.75,
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "36px 32px",
    boxShadow: "var(--shadow-lg)",
  },
  formTitle: {
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "var(--t3)",
    marginBottom: "28px",
    paddingBottom: "16px",
    borderBottom: "1px solid var(--border)",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "16px",
  },
  field: {
    marginBottom: "16px",
  },
  label_f: {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 500,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    color: "var(--t3)",
    marginBottom: "7px",
  },
  submitBtn: {
    width: "100%",
    marginTop: "8px",
    backgroundColor: "var(--btn-bg)",
    color: "var(--btn-text)",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    fontSize: "0.88rem",
    fontWeight: 500,
    cursor: "pointer",
    letterSpacing: "0.2px",
    boxShadow: "var(--shadow-sm)",
  },
  errorText: {
    fontSize: "0.8rem",
    color: "#c0392b",
    marginBottom: "12px",
    marginTop: "-4px",
  },
  /* success state */
  successWrap: {
    textAlign: "center",
    padding: "40px 0 20px",
  },
  successIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    backgroundColor: "var(--bg2)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  successH: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "var(--t1)",
    marginBottom: "10px",
    letterSpacing: "-0.3px",
    fontFamily: "'Inter', sans-serif",
  },
  successP: {
    fontSize: "0.85rem",
    color: "var(--t2)",
    lineHeight: 1.7,
  },
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
         style={{ color: "var(--t1)" }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function JoinBeta() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    school: "",
    grade: "",
    referral: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit() {
    if (!form.firstName.trim() || !form.email.trim() || !form.school.trim() || !form.grade) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${process.env.VITE_BACKEND_URL}/api/preregister`, form);
      toast.success("You're on the waitlist!");
      setSubmitted(true);
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong!";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page} className="animate-fadeUp">
      {/* Header */}
      <div style={s.header}>
        <div style={s.label}>Pre-register</div>
        <h1 style={s.h1}>Join the Waitlist</h1>
        <p style={s.subtext}>
          Be among the first to access AI Debate Arena. We'll reach out the
          moment we launch.
        </p>
      </div>

      {/* Form Card */}
      <div style={s.card}>
        {submitted ? (
          <div style={s.successWrap} className="animate-fadeIn">
            <div style={s.successIcon}>
              <CheckIcon />
            </div>
            <h2 style={s.successH}>You're in!</h2>
            <p style={s.successP}>
              We'll email you the moment AI Debate Arena is live.<br />
              Get ready to argue.
            </p>
          </div>
        ) : (
          <>
            <div style={s.formTitle}>Registration Details</div>

            {/* First + Last name */}
            <div style={s.row}>
              <div>
                <label style={s.label_f}>First Name *</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Rahul"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={s.label_f}>Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Sharma"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div style={s.field}>
              <label style={s.label_f}>Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* School */}
            <div style={s.field}>
              <label style={s.label_f}>School / College *</label>
              <input
                id="school"
                name="school"
                type="text"
                placeholder="Delhi Public School"
                value={form.school}
                onChange={handleChange}
              />
            </div>

            {/* Grade */}
            <div style={s.field}>
              <label style={s.label_f}>Grade *</label>
              <select
                id="grade"
                name="grade"
                value={form.grade}
                onChange={handleChange}
              >
                <option value="">Select grade</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
                <option value="College / University">College / University</option>
              </select>
            </div>

            {/* Referral */}
            <div style={s.field}>
              <label style={s.label_f}>Referral Code <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>(optional)</span></label>
              <input
                id="referral"
                name="referral"
                type="text"
                placeholder="Enter referral code"
                value={form.referral}
                onChange={handleChange}
              />
            </div>

            {error && <p style={s.errorText}>{error}</p>}

            <button
              id="submit-btn"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                ...s.submitBtn,
                opacity: loading ? 0.65 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              className="submit-btn-hover"
            >
              {loading ? "Saving…" : "Reserve My Spot →"}
            </button>
          </>
        )}
      </div>

      <style>{`
        .submit-btn-hover:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md) !important;
          opacity: 0.92;
        }
        .submit-btn-hover:not(:disabled):active {
          transform: scale(0.99);
        }
      `}</style>
    </div>
  );
}

export default JoinBeta;
