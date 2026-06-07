const mongoose = require("mongoose");

const githubAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    githubUsername: {
      type: String,
      required: true,
    },
    repoCount: {
      type: Number,
      default: 0,
    },
    topLanguages: {
      type: [String],
      default: [],
    },
    topRepositories: {
      type: [String],
      default: [],
    },
    estimatedSkillLevel: {
      type: String,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GithubAnalysis", githubAnalysisSchema);
