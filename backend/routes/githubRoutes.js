const express = require("express");
const router = express.Router();
const { analyzeGithub } = require("../controllers/githubController");

router.post("/analyze", analyzeGithub);

module.exports = router;
