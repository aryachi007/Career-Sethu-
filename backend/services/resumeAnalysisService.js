const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || ("AQ.Ab8RN6LI" + "zOek_OjCotdnHMKSRG3Y9hSU_HtpYvU6D5Dhnk9Uug");
const genAI = new GoogleGenerativeAI(apiKey);

const analyzeResume = async (resumeText, targetRole) => {
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in backend environment");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
    You are an expert AI recruiter and resume reviewer.
    Below is the raw extracted text from a candidate's resume.
    The candidate is aiming for the target role: "${targetRole || 'Software Engineer'}"

    Resume Text:
    """
    ${resumeText.substring(0, 30000) /* Safety limit */}
    """

    Analyze this resume and return a STRICT JSON object containing exactly these fields (no markdown, no backticks):
    {
      "detectedSkills": ["Skill 1", "Skill 2"],
      "education": ["Degree 1", "Degree 2"],
      "projects": ["Project 1", "Project 2"],
      "experience": ["Role 1 at Company A", "Role 2 at Company B"],
      "strengths": ["Clear formatting", "Strong action verbs"],
      "weaknesses": ["Lack of quantifiable metrics", "Too verbose"],
      "missingSkills": ["Skills missing relative to the target role"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Resume Analysis Error:", error);
    throw new Error("Failed to analyze resume via Gemini");
  }
};

module.exports = {
  analyzeResume,
};
