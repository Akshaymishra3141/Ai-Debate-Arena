import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const s = {
  page: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "72px 24px 96px",
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
    fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: "-0.5px",
    color: "var(--t1)",
    marginBottom: "14px",
    fontFamily: "'Inter', sans-serif",
  },
  subtext: {
    maxWidth: "560px",
    fontSize: "0.92rem",
    color: "var(--t2)",
    lineHeight: 1.8,
    marginBottom: "30px",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    boxShadow: "var(--shadow-md)",
    padding: "28px 24px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  formLabel: {
    display: "block",
    fontSize: "0.76rem",
    fontWeight: 600,
    letterSpacing: "0.7px",
    textTransform: "uppercase",
    color: "var(--t3)",
    marginBottom: "7px",
  },
  textArea: {
    resize: "vertical",
    minHeight: "92px",
  },
  fieldError: {
    fontSize: "0.76rem",
    color: "#e05252",
    marginTop: "6px",
  },
  submitBtn: (loading) => ({
    width: "100%",
    padding: "12px",
    backgroundColor: loading ? "var(--border2)" : "var(--btn-bg)",
    color: loading ? "var(--t3)" : "var(--btn-text)",
    border: "1px solid transparent",
    borderRadius: "10px",
    fontSize: "0.88rem",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    cursor: loading ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "var(--shadow-sm)",
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
  formError: {
    marginTop: "14px",
    fontSize: "0.82rem",
    color: "#e05252",
  },
  resultCard: {
    width: "100%",
    maxWidth: "600px",
    margin: "20px auto 0",
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    boxShadow: "var(--shadow-md)",
    padding: "24px",
  },
  resultHeading: {
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "var(--t3)",
    marginBottom: "10px",
  },
  resultText: {
    fontSize: "0.9rem",
    color: "var(--t1)",
    lineHeight: 1.75,
    whiteSpace: "pre-wrap",
  },
  scoreGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "10px",
    marginTop: "16px",
  },
  scoreBox: {
    backgroundColor: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "10px 12px",
  },
  scoreLabel: {
    fontSize: "0.7rem",
    color: "var(--t3)",
    textTransform: "uppercase",
    letterSpacing: "0.9px",
    marginBottom: "2px",
  },
  scoreValue: {
    fontSize: "0.86rem",
    color: "var(--t1)",
    fontWeight: 600,
  },
  feedback: {
    marginTop: "14px",
    fontSize: "0.83rem",
    color: "var(--t2)",
    lineHeight: 1.7,
  },
  resetBtn: {
    marginTop: "18px",
    width: "100%",
    backgroundColor: "transparent",
    color: "var(--t2)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "0.84rem",
    fontWeight: 500,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
  },
};

function DebatePage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    topic: "",
    opinion: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [debateData, setDebateData] = useState(null);

  const validate = () => {
    const nextErrors = {};

    if (!form.topic.trim()) {
      nextErrors.topic = "Please enter a debate topic.";
    }

    if (!form.opinion.trim()) {
      nextErrors.opinion = "Please share your stance before starting.";
    }

    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setFormError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/ai/debate`,
        {
          topic: form.topic.trim(),
          opinion: form.opinion.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const responseData = res.data || {};
      const counterArgument =
        responseData.counterArgument ||
        responseData.debate?.response ||
        responseData.response ||
        "";

      if (!counterArgument) {
        setFormError(
          "No response was returned from the debate engine. Please try again.",
        );
        return;
      }

      setDebateData(responseData.debate || null);
      setResult(counterArgument);
    } catch (error) {
      const statusCode = error.response?.status;
      const message =
        error.response?.data?.message ||
        "Could not start the debate right now. Please try again.";

      if (statusCode === 401 || statusCode === 403) {
        navigate("/login", { replace: true });
        return;
      }

      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDebate = () => {
    setForm({ topic: "", opinion: "" });
    setErrors({});
    setFormError("");
    setResult("");
    setDebateData(null);
  };

  return (
    <div style={s.page} className="animate-fadeUp">
      <div style={s.label}>Debate Arena</div>
      <h1 style={s.h1}>Enter the Arena</h1>
      <p style={s.subtext}>
        Pick a topic, state your position, and challenge an AI opponent that
        pushes back with structured counter-arguments.
      </p>

      <div style={s.card}>
        <form onSubmit={handleSubmit} noValidate>
          <div style={s.formGroup}>
            <label htmlFor="topic" style={s.formLabel}>
              Debate Topic
            </label>
            <input
              id="topic"
              name="topic"
              type="text"
              placeholder="e.g. AI will replace human jobs"
              value={form.topic}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.topic && <p style={s.fieldError}>{errors.topic}</p>}
          </div>

          <div style={s.formGroup}>
            <label htmlFor="opinion" style={s.formLabel}>
              Your Stance / Opinion
            </label>
            <textarea
              id="opinion"
              name="opinion"
              rows={4}
              placeholder="e.g. I believe AI will create more jobs than it replaces"
              value={form.opinion}
              onChange={handleChange}
              disabled={loading}
              style={s.textArea}
            />
            {errors.opinion && <p style={s.fieldError}>{errors.opinion}</p>}
          </div>

          <button type="submit" disabled={loading} style={s.submitBtn(loading)}>
            {loading ? (
              <>
                <span style={s.spinner} />
                Starting debate...
              </>
            ) : (
              "Start Debate"
            )}
          </button>
        </form>

        {formError && <p style={s.formError}>{formError}</p>}
      </div>

      {result && (
        <div style={s.resultCard} className="arena-result-reveal">
          <div style={s.resultHeading}>The Arena Speaks</div>
          <p style={s.resultText}>{result}</p>

          {debateData?.score && (
            <div style={s.scoreGrid}>
              <div style={s.scoreBox}>
                <div style={s.scoreLabel}>Clarity</div>
                <div style={s.scoreValue}>{debateData.score.clarity}/10</div>
              </div>
              <div style={s.scoreBox}>
                <div style={s.scoreLabel}>Logic</div>
                <div style={s.scoreValue}>{debateData.score.logic}/10</div>
              </div>
              <div style={s.scoreBox}>
                <div style={s.scoreLabel}>Evidence</div>
                <div style={s.scoreValue}>
                  {debateData.score.evidence_quality}/10
                </div>
              </div>
            </div>
          )}

          {debateData?.feedback && (
            <p style={s.feedback}>{debateData.feedback}</p>
          )}

          <button type="button" style={s.resetBtn} onClick={handleResetDebate}>
            Debate Again
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes arenaResultReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .arena-result-reveal {
          animation: arenaResultReveal 0.35s ease both;
        }
      `}</style>
    </div>
  );
}

export default DebatePage;
