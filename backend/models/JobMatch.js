const mongoose = require("mongoose");

const jobMatchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["applyNow", "applyAfterUpskilling", "longTermGoals"],
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
    },
    confidenceScore: {
      type: Number,
      required: true,
      default: 80,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    recommendation: {
      type: String,
      required: true,
    },
    nextAction: {
      type: String,
      required: true,
      default: 'Prepare your resume',
    },
    applicationReadiness: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobMatch", jobMatchSchema);
