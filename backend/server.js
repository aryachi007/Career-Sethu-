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

const app = express();

// Connect to database
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
res.send("Career Sethu Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
