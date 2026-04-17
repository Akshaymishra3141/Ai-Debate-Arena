import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    num: "01",
    title: "AI Opponent",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
        <path d="M18 8h2M18 12h2" />
      </svg>
    ),
    desc: "Argues any side of any topic with structured, real arguments — no easy wins.",
  },
  {
    num: "02",
    title: "Live Scoring",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    desc: "Instant feedback on logic, structure, and persuasion as you debate in real time.",
  },
  {
    num: "03",
    title: "Topic Library",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    desc: "Hundreds of fresh topics across ethics, economics, tech, and current affairs.",
  },
  {
    num: "04",
    title: "Leaderboard",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    desc: "Compete with peers. See who the top debater in your class actually is.",
  },
];

const s = {
  hero: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 32px 80px",
    overflow: "hidden",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "var(--bg2)",
    border: "1px solid var(--border)",
    color: "var(--t3)",
    fontSize: "0.68rem",
    fontWeight: 500,
    letterSpacing: "1.8px",
    textTransform: "uppercase",
    padding: "5px 14px",
    borderRadius: "999px",
    marginBottom: "36px",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "var(--t3)",
  },
  h1: {
    fontSize: "clamp(3.5rem, 11vw, 7rem)",
    fontWeight: 800,
    lineHeight: 0.92,
    letterSpacing: "-1px",
    color: "var(--t1)",
    marginBottom: "28px",
    fontFamily: "'Inter', sans-serif",
  },
  subtext: {
    color: "var(--t2)",
    fontSize: "1rem",
    lineHeight: 1.75,
    maxWidth: "400px",
    marginBottom: "40px",
    fontWeight: 400,
  },
  btnRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  btnPrimary: {
    backgroundColor: "var(--btn-bg)",
    color: "var(--btn-text)",
    border: "1px solid transparent",
    padding: "11px 28px",
    borderRadius: "10px",
    fontSize: "0.88rem",
    fontWeight: 500,
    cursor: "pointer",
    letterSpacing: "0.2px",
    boxShadow: "var(--shadow-sm)",
  },
  btnGhost: {
    backgroundColor: "transparent",
    color: "var(--t2)",
    border: "1px solid var(--border)",
    padding: "11px 28px",
    borderRadius: "10px",
    fontSize: "0.88rem",
    fontWeight: 400,
    cursor: "pointer",
    letterSpacing: "0.2px",
  },
  section: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "0 32px 96px",
  },
  sectionLabel: {
    fontSize: "0.68rem",
    fontWeight: 500,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "var(--t3)",
    marginBottom: "32px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  },
  card: {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "28px 24px",
    boxShadow: "var(--shadow-sm)",
    cursor: "default",
  },
  cardNum: {
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "var(--t3)",
    letterSpacing: "1.5px",
    marginBottom: "14px",
    fontFamily: "'Inter', monospace",
  },
  cardIcon: {
    color: "var(--t2)",
    marginBottom: "12px",
  },
  cardTitle: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "var(--t1)",
    marginBottom: "8px",
  },
  cardDesc: {
    fontSize: "0.8rem",
    color: "var(--t2)",
    lineHeight: 1.65,
  },
};

function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div className="animate-fadeUp">
      {/* ── HERO ─────────────────────────────── */}
      <div style={s.hero}>
        <div style={s.badge}>
          <span style={s.dot} className="animate-pulse2" />
          AI-Powered Learning
        </div>

        <h1 style={s.h1}>
          <span style={{ display: "block", marginBottom: "8px" }}>Argue</span>
          <span
            style={{
              display: "block",
              color: "var(--t2)",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Think
          </span>
          <span style={{ display: "block" }}>Win</span>
        </h1>

        <p style={s.subtext}>
          Practice debate with an AI opponent that pushes back, scores your
          logic, and makes you sharper — every single round.
        </p>

        <div style={s.btnRow}>
          {isLoggedIn ? (
            <button
              id="cta-debate"
              onClick={() => navigate("/debate")}
              style={s.btnPrimary}
              className="btn-primary-hover"
            >
              Debate with AI
            </button>
          ) : (
            <button
              id="cta-login-debate"
              onClick={() => navigate("/login")}
              style={s.btnGhost}
              className="btn-ghost-hover"
            >
              Login to Debate
            </button>
          )}
          <button
            id="cta-secondary"
            onClick={() => navigate("/about")}
            style={s.btnGhost}
            className="btn-ghost-hover"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────── */}
      <div style={s.section}>
        <div style={s.sectionLabel} className="text-center">
          Features
        </div>
        <div style={s.grid} className="stagger">
          {features.map((f) => (
            <div
              key={f.num}
              style={s.card}
              className="feature-card animate-fadeUp"
            >
              <div style={s.cardNum}>{f.num}</div>
              <div style={s.cardIcon}>{f.icon}</div>
              <h3 style={s.cardTitle}>{f.title}</h3>
              <p style={s.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .btn-primary-hover:hover {
          background-color: var(--btn-hover) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-md) !important;
        }
        .btn-ghost-hover:hover {
          color: var(--t1) !important;
          border-color: var(--border2) !important;
          background-color: var(--bg2) !important;
        }
        .feature-card:hover {
          border-color: var(--border2) !important;
          transform: translateY(-3px);
          box-shadow: var(--shadow-md) !important;
        }
      `}</style>
    </div>
  );
}

export default Home;
