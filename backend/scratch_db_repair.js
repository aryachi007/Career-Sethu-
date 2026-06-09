const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const User = require("./models/User");
const GithubAnalysis = require("./models/GithubAnalysis");
const SkillGap = require("./models/SkillGap");
const ResumeAnalysis = require("./models/ResumeAnalysis");
const Roadmap = require("./models/Roadmap");
const JobMatch = require("./models/JobMatch");

async function main() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected successfully.");

    // 1. Identify User
    const users = await User.find().sort({ updatedAt: -1 });
    console.log(`Found ${users.length} user(s) in the database.`);
    if (users.length === 0) {
      console.log("No users found in database.");
      process.exit(0);
    }

    const activeUser = users[0];
    console.log("\n=================== ACTIVE USER ===================");
    console.log("ID:", activeUser._id);
    console.log("Name:", activeUser.name);
    console.log("College:", activeUser.college);
    console.log("Target Role:", activeUser.targetRole);
    console.log("Target Company:", activeUser.targetCompany);
    console.log("GitHub URL:", activeUser.githubUrl);
    console.log("Skills:", activeUser.skills);
    console.log("====================================================\n");

    const userId = activeUser._id;

    // 2. Query other collections
    const githubDoc = await GithubAnalysis.findOne({ userId });
    const skillGapDoc = await SkillGap.findOne({ userId });
    const resumeDoc = await ResumeAnalysis.findOne({ userId });
    const roadmapDoc = await Roadmap.findOne({ userId });
    const jobMatches = await JobMatch.find({ userId });

    console.log("================ COLLECTION CHECKS ================");
    console.log("GithubAnalysis exists:", !!githubDoc);
    if (githubDoc) {
      console.log("  - Username:", githubDoc.githubUsername);
      console.log("  - Repo Count:", githubDoc.repoCount);
      console.log("  - Top Languages:", githubDoc.topLanguages);
    }
    
    console.log("SkillGap exists:", !!skillGapDoc);
    if (skillGapDoc) {
      console.log("  - Readiness Score:", skillGapDoc.readinessScore);
      console.log("  - Skill Gap %:", skillGapDoc.skillGapPercentage);
      console.log("  - Current Skills:", skillGapDoc.currentSkills);
      console.log("  - Missing Skills:", skillGapDoc.missingSkills);
    }

    console.log("ResumeAnalysis exists:", !!resumeDoc);
    if (resumeDoc) {
      console.log("  - Detected Skills:", resumeDoc.detectedSkills);
      console.log("  - Missing Skills:", resumeDoc.missingSkills);
    }

    console.log("Roadmap exists:", !!roadmapDoc);
    console.log(`JobMatches count: ${jobMatches.length}`);
    console.log("====================================================\n");

    process.exit(0);
  } catch (err) {
    console.error("Error running diagnostic:", err);
    process.exit(1);
  }
}

main();
