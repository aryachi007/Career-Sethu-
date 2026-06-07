const mongoose = require("mongoose");
const User = require("../models/User");
const GithubAnalysis = require("../models/GithubAnalysis");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const SkillGap = require("../models/SkillGap");
const { determineSkillGaps } = require("../services/skillGapService");

const analyzeUserSkillGap = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Gather skills from all available sources
    let rawSkills = [...(user.skills || [])];

    const githubAnalysis = await GithubAnalysis.findOne({ userId });
    if (githubAnalysis && githubAnalysis.topLanguages) {
      rawSkills.push(...githubAnalysis.topLanguages);
    }

    const resumeAnalysis = await ResumeAnalysis.findOne({ userId });
    if (resumeAnalysis && resumeAnalysis.detectedSkills) {
      rawSkills.push(...resumeAnalysis.detectedSkills);
    }

    console.log(`[SkillGap] Aggregated ${rawSkills.length} raw skills for user ${user.name}`);
    
    const analysisData = await determineSkillGaps(rawSkills, user.targetRole);

    let existingSkillGap = await SkillGap.findOne({ userId });
    
    if (existingSkillGap) {
      Object.assign(existingSkillGap, {
        targetRole: user.targetRole,
        ...analysisData
      });
      await existingSkillGap.save();
    } else {
      existingSkillGap = await SkillGap.create({
        userId,
        targetRole: user.targetRole,
        ...analysisData
      });
    }

    console.log(`[SkillGap] Analysis complete for ${user.name}. Readiness: ${analysisData.readinessScore}%`);
    res.status(200).json(existingSkillGap);
  } catch (error) {
    console.error("Error analyzing skill gap:", error);
    res.status(500).json({ error: "Server error analyzing skill gap" });
  }
};

const getSkillGap = async (req, res) => {
  try {
    const { userId } = req.params;
    const skillGap = await SkillGap.findOne({ userId });
    
    if (!skillGap) {
      return res.status(404).json({ error: "No skill gap analysis found for this user" });
    }
    
    res.status(200).json(skillGap);
  } catch (error) {
    console.error("Error fetching skill gap:", error);
    res.status(500).json({ error: "Server error fetching skill gap" });
  }
};

module.exports = {
  analyzeUserSkillGap,
  getSkillGap,
};
