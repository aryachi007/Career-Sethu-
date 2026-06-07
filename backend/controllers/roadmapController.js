const Roadmap = require("../models/Roadmap");

// Get the latest roadmap for a user
const getRoadmapByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the latest roadmap for the user
    const roadmap = await Roadmap.findOne({ userId }).sort({ createdAt: -1 });

    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    res.status(200).json(roadmap);
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    res.status(500).json({ error: "Server error fetching roadmap" });
  }
};

const mongoose = require("mongoose");
const User = require("../models/User");
const { generateCareerRoadmap } = require("../services/geminiService");

// Generate a real AI roadmap
const generateRoadmap = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    console.log(`[Roadmap] Looking up user ${userId}`);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const githubAnalysis = await mongoose.model("GithubAnalysis").findOne({ userId });
    if (githubAnalysis) {
      console.log(`[Roadmap] Found GitHub analysis for user ${user.name}`);
    } else {
      console.log(`[Roadmap] No GitHub analysis found for user ${user.name}`);
    }

    const resumeAnalysis = await mongoose.model("ResumeAnalysis").findOne({ userId });
    if (resumeAnalysis) {
      console.log(`[Roadmap] Found Resume analysis for user ${user.name}`);
    } else {
      console.log(`[Roadmap] No Resume analysis found for user ${user.name}`);
    }

    const skillGap = await mongoose.model("SkillGap").findOne({ userId });
    if (skillGap) {
      console.log(`[Roadmap] Found Skill Gap analysis for user ${user.name}. Readiness: ${skillGap.readinessScore}%`);
    } else {
      console.log(`[Roadmap] No Skill Gap analysis found for user ${user.name}`);
    }

    console.log(`[Roadmap] Sending request to Gemini for user ${user.name}`);
    const generatedRoadmapData = await generateCareerRoadmap(user, githubAnalysis, resumeAnalysis, skillGap);
    console.log(`[Roadmap] Gemini response received & parsed successfully`);

    const newRoadmap = await Roadmap.create({
      userId: user._id,
      roadmap: generatedRoadmapData,
    });
    
    console.log(`[Roadmap] Saved roadmap to MongoDB with ID ${newRoadmap._id}`);

    res.status(201).json(newRoadmap);
  } catch (error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ error: "Server error generating roadmap" });
  }
};

module.exports = {
  getRoadmapByUserId,
  generateRoadmap,
};
