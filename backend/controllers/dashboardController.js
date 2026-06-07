const mongoose = require("mongoose");
const User = require("../models/User");
const Roadmap = require("../models/Roadmap");
const GithubAnalysis = require("../models/GithubAnalysis");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const SkillGap = require("../models/SkillGap");
const JobMatch = require("../models/JobMatch");

const getDashboardData = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Attempt to fetch the user first to ensure they exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use Promise.all to fetch all intelligence data concurrently
    const [roadmap, githubAnalysis, resumeAnalysis, skillGap, jobMatchesRaw] = await Promise.all([
      Roadmap.findOne({ userId }).sort({ createdAt: -1 }),
      GithubAnalysis.findOne({ userId }).sort({ createdAt: -1 }),
      ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 }),
      SkillGap.findOne({ userId }).sort({ createdAt: -1 }),
      JobMatch.find({ userId }).sort({ matchScore: -1 })
    ]);

    // Group job matches by category
    const categorizedJobMatches = {
      applyNow: [],
      applyAfterUpskilling: [],
      longTermGoals: []
    };

    if (jobMatchesRaw && jobMatchesRaw.length > 0) {
      jobMatchesRaw.forEach(job => {
        if (categorizedJobMatches[job.category]) {
          categorizedJobMatches[job.category].push(job);
        }
      });
    }

    const dashboardPayload = {
      profile: user,
      roadmap: roadmap ? roadmap.roadmap : null,
      skillGap: skillGap || null,
      resumeAnalysis: resumeAnalysis || null,
      githubAnalysis: githubAnalysis || null,
      jobMatches: categorizedJobMatches,
      lastUpdated: new Date()
    };

    res.status(200).json(dashboardPayload);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Server error fetching dashboard data" });
  }
};

module.exports = {
  getDashboardData,
};
