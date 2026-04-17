import { Link } from "react-router-dom";

const contactItems = [
  {
    id: "general",
    label: "General Inquiries",
    content: (
      <>
        Email us at{" "}
        <a
          href="mailto:hello@aidebatearena.com"
          style={{ color: "var(--t1)", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          hello@aidebatearena.com
        </a>{" "}
        for support, collaboration, or media requests.
      </>
    ),
  },
  {
    id: "social",
    label: "Follow Us",
    content: (
      <>
        Stay updated with launch news and product updates on{" "}
        <span style={{ color: "var(--t1)", fontWeight: 500 }}>@AIDebateArena</span>.
      </>
    ),
  },
  {
    id: "waitlist",
    label: "Join the Waitlist",
    content: (
      <>
        Want to join the beta?{" "}
        <Link
          to="/join-beta"
          style={{
            color: "var(--t1)",
            fontWeight: 500,
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Reserve your spot →
        </Link>
      </>
    ),
  },
];

const s = {
  page: {
    maxWidth: "640px",
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
  h1: {
    fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    lineHeight: 1,
    color: "var(--t1)",
    marginBottom: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  intro: {
    color: "var(--t2)",
    fontSize: "0.92rem",
    lineHeight: 1.8,
    marginBottom: "48px",
  },
  card: {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "var(--shadow-md)",
  },
  item: {
    padding: "24px 28px",
  },
  divider: {
    height: "1px",
    backgroundColor: "var(--border)",
    margin: "0",
  },
  itemLabel: {
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "var(--t3)",
    marginBottom: "8px",
  },
  itemText: {
    fontSize: "0.88rem",
    color: "var(--t2)",
    lineHeight: 1.75,
  },
};

function Contact() {
  return (
    <div className="animate-fadeUp" style={s.page}>
      <div style={s.label}>Contact</div>
      <h1 style={s.h1}>Let's talk.</h1>
      <p style={s.intro}>
        For questions, partnerships, or press inquiries — reach out and we'll
        get back to you as soon as possible.
      </p>

      <div style={s.card}>
        {contactItems.map((item, i) => (
          <div key={item.id}>
            <div style={s.item}>
              <div style={s.itemLabel}>{item.label}</div>
              <p style={s.itemText}>{item.content}</p>
            </div>
            {i < contactItems.length - 1 && <div style={s.divider} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contact;
