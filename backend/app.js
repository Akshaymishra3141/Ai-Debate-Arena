const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // for HTTP-only cookie support

const connectDB = require("./config/db");
const registrationRoutes = require("./routes/registrationRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// ── Database ────────────────────────────────────────────────────────────
connectDB();

// ── CORS ────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,   // required for cookies to be sent cross-origin
};
app.use(cors(corsOptions));

// ── Body / Cookie parsers ────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());   // parses req.cookies — needed for HTTP-only cookie auth

// ── Routes ───────────────────────────────────────────────────────────────
app.use("/api", registrationRoutes);
app.use("/auth/api", authRoutes);
app.use("/api/ai", aiRoutes);

// ── Health check ─────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "AI Debate Arena backend is running!" });
});

module.exports = app;
