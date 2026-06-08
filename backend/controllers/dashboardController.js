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

    let finalGithub = githubAnalysis;
    const isFallbackGithub = finalGithub && (
      finalGithub.estimatedSkillLevel === "Unknown" ||
      (finalGithub.weaknesses && finalGithub.weaknesses.includes("Not enough data to analyze")) ||
      finalGithub.repoCount === 18 ||
      (finalGithub.topRepositories && finalGithub.topRepositories.includes("react-dashboard"))
    );

    if (isFallbackGithub) {
      console.log(`[Dashboard-Repair] Detected fallback GithubAnalysis for user ${user.name}. Deleting to trigger regeneration...`);
      await GithubAnalysis.deleteOne({ _id: finalGithub._id });
      finalGithub = null;
    }

    if (!finalGithub && user.githubUrl && user.githubUrl.includes("github.com/")) {
      try {
        console.log(`[Dashboard-Auto] Generating missing GitHub analysis for user ${user.name}`);
        const { analyzeGithubProfile } = require("../services/githubService");
        const analysisData = await analyzeGithubProfile(user.githubUrl);
        finalGithub = await GithubAnalysis.create({
          userId,
          ...analysisData
        });
        console.log(`[Dashboard-Auto] GitHub analysis generated and saved.`);
      } catch (err) {
        console.error(`[Dashboard-Auto] Failed to generate GitHub analysis:`, err.message);
      }
    }

    let finalSkillGap = skillGap;
    const isFallbackSkillGap = finalSkillGap && 
      finalSkillGap.readinessScore === 50 && 
      finalSkillGap.skillGapPercentage === 50 && 
      finalSkillGap.missingSkills && 
      finalSkillGap.missingSkills.includes("System Design");

    if (isFallbackSkillGap) {
      console.log(`[Dashboard-Repair] Detected fallback SkillGap for user ${user.name}. Deleting to trigger regeneration...`);
      await SkillGap.deleteOne({ _id: finalSkillGap._id });
      finalSkillGap = null;
    }

    if (!finalSkillGap) {
      try {
        console.log(`[Dashboard-Auto] Generating missing SkillGap for user ${user.name}`);
        const { determineSkillGaps } = require("../services/skillGapService");
        
        let rawSkills = [...(user.skills || [])];
        if (finalGithub && finalGithub.topLanguages) {
          rawSkills.push(...finalGithub.topLanguages);
        }
        if (resumeAnalysis && resumeAnalysis.detectedSkills) {
          rawSkills.push(...resumeAnalysis.detectedSkills);
        }

        const analysisData = await determineSkillGaps(rawSkills, user.targetRole);
        finalSkillGap = await SkillGap.create({
          userId,
          targetRole: user.targetRole,
          ...analysisData
        });
        console.log(`[Dashboard-Auto] SkillGap generated and saved. Score: ${analysisData.readinessScore}%`);
      } catch (err) {
        console.error(`[Dashboard-Auto] Failed to generate SkillGap:`, err.message);
      }
    }

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
      skillGap: finalSkillGap || null,
      resumeAnalysis: resumeAnalysis || null,
      githubAnalysis: finalGithub || null,
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
