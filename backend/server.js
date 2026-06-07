const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const githubRoutes = require("./routes/githubRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const jobMatchRoutes = require("./routes/jobMatchRoutes");

const app = express();

// Connect to database
connectDB();

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, "http://localhost:5173"]
  : ["http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/job-matches", jobMatchRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Career Sethu Backend Running", timestamp: new Date() });
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
