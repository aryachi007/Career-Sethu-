const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const { parseResume } = require("../services/resumeParser");
const { analyzeResume } = require("../services/resumeAnalysisService");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (ext === ".pdf" || ext === ".docx" || ext === ".txt" || mime === "application/pdf" || mime.includes("wordprocessingml") || mime === "text/plain") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOCX, and TXT files are allowed"), false);
    }
  },
});

const processResumeUpload = async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.file;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    if (!file) {
      return res.status(400).json({ error: "resume file is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`[Resume] Extracting text from ${file.filename} for user ${user.name}`);
    const extractedText = await parseResume(file.path, file.mimetype);

    if (!extractedText || extractedText.length < 50) {
      return res.status(400).json({ error: "Could not extract enough text from the resume" });
    }

    console.log(`[Resume] Analyzing text via Gemini for user ${user.name}`);
    const analysisData = await analyzeResume(extractedText, user.targetRole);

    let existingAnalysis = await ResumeAnalysis.findOne({ userId });

    if (existingAnalysis) {
      Object.assign(existingAnalysis, {
        fileName: file.originalname,
        extractedText,
        ...analysisData,
      });
      await existingAnalysis.save();
    } else {
      existingAnalysis = await ResumeAnalysis.create({
        userId,
        fileName: file.originalname,
        extractedText,
        ...analysisData,
      });
    }

    console.log(`[Resume] Analysis saved for user ${user.name}`);
    res.status(200).json(existingAnalysis);
  } catch (error) {
    console.error("Resume Upload Error:", error);
    res.status(500).json({ error: error.message || "Server error processing resume" });
  }
};

const getResumeAnalysis = async (req, res) => {
  try {
    const { userId } = req.params;
    const analysis = await ResumeAnalysis.findOne({ userId });
    
    if (!analysis) {
      return res.status(404).json({ error: "No resume analysis found for this user" });
    }
    
    res.status(200).json(analysis);
  } catch (error) {
    console.error("Error fetching resume analysis:", error);
    res.status(500).json({ error: "Server error fetching resume analysis" });
  }
};

module.exports = {
  upload,
  processResumeUpload,
  getResumeAnalysis
};
