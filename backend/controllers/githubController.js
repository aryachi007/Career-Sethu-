const User = require("../models/User");
const GithubAnalysis = require("../models/GithubAnalysis");
const { analyzeGithubProfile } = require("../services/githubService");

const analyzeGithub = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.githubUrl) {
      return res.status(400).json({ error: "User does not have a GitHub URL" });
    }

    console.log(`[GitHub] Analyzing profile for user ${user.name}`);
    const analysisData = await analyzeGithubProfile(user.githubUrl);

    // Save to MongoDB
    // Check if one already exists, update it, otherwise create new
    let existingAnalysis = await GithubAnalysis.findOne({ userId });
    
    if (existingAnalysis) {
      Object.assign(existingAnalysis, analysisData);
      await existingAnalysis.save();
    } else {
      existingAnalysis = await GithubAnalysis.create({
        userId,
        ...analysisData
      });
    }

    console.log(`[GitHub] Analysis complete and saved for ${user.name}`);
    res.status(200).json(existingAnalysis);
  } catch (error) {
    console.error("Error analyzing GitHub profile:", error);
    res.status(500).json({ error: "Server error analyzing GitHub profile" });
  }
};

module.exports = {
  analyzeGithub,
};
