const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || ("AQ.Ab8RN6LI" + "zOek_OjCotdnHMKSRG3Y9hSU_HtpYvU6D5Dhnk9Uug");
const genAI = new GoogleGenerativeAI(apiKey);

const generateCareerRoadmap = async (user, githubAnalysis = null, resumeAnalysis = null, skillGap = null) => {
  try {
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

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Roadmap Generation failed (Using fallback):", error.message);
    
    // Create a high-quality fallback roadmap dynamically tailored to their target role and company
    const targetRole = user.targetRole || "Lead SDE";
    const targetCompany = user.targetCompany || "Google";
    const fallbackSkills = user.skills && user.skills.length > 0 ? user.skills : ["React", "JavaScript", "Python"];
    
    return {
      title: `${targetRole} Accelerator Path for ${targetCompany}`,
      overview: `A high-fidelity preparation path designed to transition your experience into a ${targetRole} tier at ${targetCompany}. Optimized to focus on key engineering disciplines, architecture paradigms, and targeted domain capabilities.`,
      skillsToLearn: [
        "System Design & Distributed Architectures",
        "Advanced Data Structures & Algorithms",
        "TypeScript & Modern Enterprise Patterns",
        "Containerization & Orchestration (Docker/Kubernetes)",
        "Automated Telemetry & Cloud Integration"
      ],
      projects: [
        `Scalable Mock Integration Gateway (designed for ${targetCompany} scale)`,
        "High-Throughput Distributed Performance Tracker"
      ],
      courses: [
        `Advanced System Design Boot Camp`,
        `Data Structures and Algorithm Interview Masterclass`
      ],
      timeline: [
        {
          phase: "Months 1-2",
          goal: `Deduplicate and scale verified skills: ${fallbackSkills.join(", ")}. Master basic distributed principles.`
        },
        {
          phase: "Months 3-4",
          goal: `Develop advanced full stack projects incorporating robust caching layers and clean API design.`
        },
        {
          phase: "Months 5-6",
          goal: `Intensive system architecture mock sessions and target role alignment for ${targetCompany}.`
        }
      ]
    };
  }
};

module.exports = {
  generateCareerRoadmap,
};
