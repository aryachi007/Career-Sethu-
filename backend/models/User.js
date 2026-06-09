const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    college: {
      type: String,
    },
    targetRole: {
      type: String,
    },
    targetCompany: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    skills: {
      type: [String],
      default: [],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    googleId: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
