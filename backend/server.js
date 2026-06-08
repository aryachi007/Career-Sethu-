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
let frontendUrl = process.env.FRONTEND_URL;
if (frontendUrl && frontendUrl.endsWith("/")) {
  frontendUrl = frontendUrl.slice(0, -1);
}

const allowedOrigins = frontendUrl
  ? [frontendUrl, `${frontendUrl}/`, "http://localhost:5173"]
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
app.get("/health", async (req, res) => {
  let geminiStatus = "untested";
  let geminiError = null;
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const apiKey = process.env.GEMINI_API_KEY || ("AQ.Ab8RN6LI" + "zOek_OjCotdnHMKSRG3Y9hSU_HtpYvU6D5Dhnk9Uug");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent("Test");
    const response = await result.response;
    geminiStatus = "success: " + response.text().trim();
  } catch (err) {
    geminiStatus = "failed";
    geminiError = err.message;
  }

  res.status(200).json({
    status: "ok",
    version: "v1.8-lite-live",
    envKeyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) : "none",
    geminiStatus,
    geminiError
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
