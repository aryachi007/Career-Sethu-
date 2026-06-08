const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const generateCareerRoadmap = async (user, githubAnalysis = null, resumeAnalysis = null, skillGap = null) => {
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in backend environment");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let githubContext = "";
  if (githubAnalysis) {
    githubContext = `
    GitHub Profile Analysis:
    - Estimated Skill Level: ${githubAnalysis.estimatedSkillLevel}
    - Top Technologies: ${githubAnalysis.topLanguages.join(", ")}
    - Demonstrated Strengths: ${githubAnalysis.strengths.join(", ")}
    - Areas for Improvement: ${githubAnalysis.weaknesses.join(", ")}
    `;
  }

  let resumeContext = "";
  if (resumeAnalysis) {
    resumeContext = `
    Resume Analysis Context:
    - Verified Detected Skills: ${resumeAnalysis.detectedSkills.join(", ")}
    - Missing Skills (Relative to Target Role): ${resumeAnalysis.missingSkills.join(", ")}
    - Resume Strengths: ${resumeAnalysis.strengths.join(", ")}
    - Resume Weaknesses: ${resumeAnalysis.weaknesses.join(", ")}
    - Key Education: ${resumeAnalysis.education.join(", ")}
    - Key Experience: ${resumeAnalysis.experience.join(" | ")}
    `;
  }

  let skillGapContext = "";
  if (skillGap) {
    skillGapContext = `
    Structured Skill Gap Engine Results:
    - Overall Readiness Score: ${skillGap.readinessScore}%
    - Skill Gap Percentage: ${skillGap.skillGapPercentage}%
    - Normalized Matched Skills: ${skillGap.matchedSkills.join(", ")}
    - Normalized Missing Skills: ${skillGap.missingSkills.join(", ")}
    `;
  }

  const prompt = `
    You are an expert AI career counselor.
    User Profile:
    - Name: ${user.name}
    - Degree/College: ${user.college}
    - Target Role: ${user.targetRole}
    - Target Company: ${user.targetCompany}
    - Self-Reported Skills: ${user.skills.join(", ")}
    ${githubContext}
    ${resumeContext}
    ${skillGapContext}

    Analyze the skill gaps between their current skills and the requirements for a ${user.targetRole} at ${user.targetCompany}.
    Use the provided GitHub, Resume, and Skill Gap analyses if available to tailor the advice uniquely.
    Generate a detailed career roadmap.

    Respond ONLY with a valid JSON object matching exactly this structure (no markdown, no backticks, no code fences):
    {
      "title": "Roadmap title",
      "overview": "Brief overview of what it takes",
      "skillsToLearn": ["Skill 1", "Skill 2"],
      "projects": ["Project 1", "Project 2"],
      "courses": ["Course 1", "Course 2"],
      "timeline": [
        { "phase": "Months 1-2", "goal": "..." }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  // Strip markdown code fences if present
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini JSON Parsing Error. Raw Text:", text);
    throw new Error("Failed to parse Gemini response as JSON");
  }
};

module.exports = {
  generateCareerRoadmap,
};
