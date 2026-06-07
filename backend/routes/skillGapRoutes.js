const express = require("express");
const router = express.Router();
const { analyzeUserSkillGap, getSkillGap } = require("../controllers/skillGapController");

router.post("/analyze", analyzeUserSkillGap);
router.get("/:userId", getSkillGap);

module.exports = router;
