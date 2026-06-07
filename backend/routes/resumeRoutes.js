const express = require("express");
const router = express.Router();
const { upload, processResumeUpload, getResumeAnalysis } = require("../controllers/resumeController");

router.post("/analyze", upload.single("resume"), processResumeUpload);
router.get("/:userId", getResumeAnalysis);

module.exports = router;
