const stats = [
  { n: "500+", l: "Topics" },
  { n: "24/7", l: "Available" },
  { n: "AI",   l: "Feedback" },
  { n: "Free", l: "Early Access" },
];

const team = [
  { initials: "AR", name: "Aryan Raj",    role: "Founder & Dev" },
  { initials: "MS", name: "Meera Shah",   role: "AI & Research" },
  { initials: "KV", name: "Kunal Verma",  role: "Design & UX" },
];

const s = {
  page: {
    maxWidth: "820px",
    margin: "0 auto",
    padding: "80px 32px 100px",
  },
  label: {
    fontSize: "0.68rem",
    fontWeight: 500,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "var(--t3)",
    marginBottom: "20px",
  },
  h2: {
    fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: "-0.5px",
    color: "var(--t1)",
    marginBottom: "32px",
    fontFamily: "'Inter', sans-serif",
  },
  body: {
    color: "var(--t2)",
    fontSize: "0.95rem",
    lineHeight: 1.8,
    marginBottom: "20px",
    maxWidth: "620px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    margin: "48px 0",
  },
  statCard: {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "28px 16px",
    textAlign: "center",
    boxShadow: "var(--shadow-sm)",
  },
  statNum: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "var(--t1)",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "-0.5px",
  },
  statLabel: {
    fontSize: "0.7rem",
    color: "var(--t3)",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    marginTop: "6px",
    fontWeight: 500,
  },
  divider: {
    height: "1px",
    backgroundColor: "var(--border)",
    margin: "48px 0",
    border: "none",
  },
  teamH3: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--t1)",
    letterSpacing: "0.5px",
    marginBottom: "24px",
    textTransform: "uppercase",
    fontSize: "0.8rem",
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },
  teamCard: {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "24px 20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "var(--shadow-sm)",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "var(--bg2)",
    border: "1px solid var(--border)",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "var(--t2)",
    letterSpacing: "0.5px",
  },
  memberName: {
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "var(--t1)",
    marginBottom: "2px",
  },
  memberRole: {
    fontSize: "0.75rem",
    color: "var(--t3)",
  },
};

function About() {
  return (
    <div className="animate-fadeUp" style={s.page}>
      <div style={s.label}>About the project</div>

      <h1 style={s.h2}>
        Built for students<br />
        who think deeper.
      </h1>

      <p style={s.body}>
        Debate sharpens the most important skills you can have — critical
        thinking, confidence, and the ability to communicate clearly under
        pressure. But great practice partners are hard to find.
      </p>
      <p style={s.body}>
        AI Debate Arena gives every student a tireless, intelligent opponent
        available anytime. Whether you're prepping for a competition or just
        want to think more clearly, we built it for you.
      </p>

      {/* Stats */}
      <div style={s.statsGrid} className="stagger">
        {stats.map((stat) => (
          <div key={stat.l} style={s.statCard} className="stat-card animate-fadeUp">
            <div style={s.statNum}>{stat.n}</div>
            <div style={s.statLabel}>{stat.l}</div>
          </div>
        ))}
      </div>

      <hr style={s.divider} />

      {/* Team */}
      <div style={s.teamH3}>The Team</div>
      <div style={s.teamGrid} className="stagger">
        {team.map((t) => (
          <div key={t.initials} style={s.teamCard} className="team-card animate-fadeUp">
            <div style={s.avatar}>{t.initials}</div>
            <div>
              <div style={s.memberName}>{t.name}</div>
              <div style={s.memberRole}>{t.role}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .stat-card:hover,
        .team-card:hover {
          border-color: var(--border2) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-md) !important;
        }
        @media (max-width: 600px) {
          div[style*="repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

export default About;
