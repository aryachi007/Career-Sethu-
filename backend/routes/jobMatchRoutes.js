const express = require("express");
const router = express.Router();
const { createJobMatches, getJobMatches } = require("../controllers/jobMatchController");

router.post("/generate", createJobMatches);
router.get("/:userId", getJobMatches);

module.exports = router;
