const express = require("express");
const router = express.Router();
const { getRoadmapByUserId, generateRoadmap } = require("../controllers/roadmapController");

router.get("/:userId", getRoadmapByUserId);
router.post("/generate", generateRoadmap);

module.exports = router;
