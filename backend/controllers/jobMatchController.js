const JobMatch = require("../models/JobMatch");
const User = require("../models/User");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const GithubAnalysis = require("../models/GithubAnalysis");
const SkillGap = require("../models/SkillGap");
const Roadmap = require("../models/Roadmap");
const { generateJobMatches } = require("../services/jobMatchingService");

const createJobMatches = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`[JobMatch] Generating matches for user ${user.name}`);

    // Fetch all user intelligence
    const [resume, github, skillGap, roadmap] = await Promise.all([
      ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 }),
      GithubAnalysis.findOne({ userId }).sort({ createdAt: -1 }),
      SkillGap.findOne({ userId }).sort({ createdAt: -1 }),
      Roadmap.findOne({ userId }).sort({ createdAt: -1 }),
    ]);

    // Call Gemini Service
    const aiData = await generateJobMatches(user, resume, github, skillGap, roadmap);

    // Clear old matches for this user
    await JobMatch.deleteMany({ userId });

    const newMatches = [];

    // Helper to format and push
    const formatAndPush = (categoryArray, categoryName) => {
      if (categoryArray && Array.isArray(categoryArray)) {
        categoryArray.forEach(job => {
          newMatches.push({
            userId,
            category: categoryName,
            jobTitle: job.jobTitle,
            company: job.company,
            matchScore: job.matchScore,
            confidenceScore: job.confidenceScore || 80,
            matchedSkills: job.matchedSkills,
            missingSkills: job.missingSkills,
            recommendation: job.recommendation,
            nextAction: job.nextAction || 'Prepare resume',
            applicationReadiness: job.applicationReadiness
          });
        });
      }
    };

    formatAndPush(aiData.applyNow, "applyNow");
    formatAndPush(aiData.applyAfterUpskilling, "applyAfterUpskilling");
    formatAndPush(aiData.longTermGoals, "longTermGoals");

    // Bulk insert
    const savedMatches = await JobMatch.insertMany(newMatches);
    console.log(`[JobMatch] Saved ${savedMatches.length} job matches to MongoDB`);

    res.status(201).json(savedMatches);
  } catch (error) {
    console.error("Error creating job matches:", error);
    res.status(500).json({ error: "Server error creating job matches" });
  }
};

const getJobMatches = async (req, res) => {
  try {
    const { userId } = req.params;
    const matches = await JobMatch.find({ userId }).sort({ matchScore: -1 });
    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching job matches:", error);
    res.status(500).json({ error: "Server error fetching job matches" });
  }
};

module.exports = {
  createJobMatches,
  getJobMatches
};
