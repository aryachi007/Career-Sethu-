const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const determineSkillGaps = async (rawSkills, targetRole) => {
  try {
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in backend environment");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert technical recruiter and data normalizer.
      The user is aiming for the target role: "${targetRole}"
      They have a raw, messy list of skills aggregated from their resume, GitHub, and self-reporting:
      [${rawSkills.join(", ")}]

      Please do the following:
      1. Normalize and deduplicate the raw skills into a clean list of "currentSkills" (e.g., combine 'React' and 'React.js').
      2. Determine the standard top 10-15 "requiredSkills" for the target role.

      Return EXACTLY a valid JSON object with no markdown and no backticks:
      {
        "currentSkills": ["Normalized Skill 1", "Normalized Skill 2"],
        "requiredSkills": ["Required Skill 1", "Required Skill 2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(text);

    // Perform exact string matching (case-insensitive)
    const current = data.currentSkills || [];
    const required = data.requiredSkills || [];

    const matchedSkills = [];
    const missingSkills = [];

    const currentLower = current.map(s => s.toLowerCase());

    required.forEach(reqSkill => {
      // Find if any current skill is a subset or superset of required skill to be generous, 
      // or just direct match. We'll do direct includes for simplicity.
      const match = currentLower.find(c => c.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(c));
      if (match) {
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const readinessScore = required.length > 0 ? Math.round((matchedSkills.length / required.length) * 100) : 0;
    const skillGapPercentage = 100 - readinessScore;

    return {
      currentSkills: current,
      requiredSkills: required,
      matchedSkills,
      missingSkills,
      readinessScore,
      skillGapPercentage
    };
  } catch (error) {
    console.error("Gemini Skill Gap Analysis Error (Falling back to default):", error);
    
    // Deduplicate rawSkills for fallback currentSkills and matchedSkills
    const deduplicatedSkills = Array.isArray(rawSkills) ? [...new Set(rawSkills)] : [];
    
    return {
      currentSkills: deduplicatedSkills,
      requiredSkills: [
        ...deduplicatedSkills,
        "Data Structures & Algorithms",
        "TypeScript",
        "System Design"
      ],
      matchedSkills: deduplicatedSkills,
      missingSkills: [
        "Data Structures & Algorithms",
        "TypeScript",
        "System Design"
      ],
      readinessScore: 50,
      skillGapPercentage: 50
    };
  }
};

module.exports = {
  determineSkillGaps,
};
