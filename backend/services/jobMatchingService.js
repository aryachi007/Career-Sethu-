const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateJobMatches = async (user, resume, github, skillGap, roadmapRaw) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prompt Size Protections
    const safeJoin = (arr, limit) => (Array.isArray(arr) ? arr.slice(0, limit).join(', ') : 'None');
    
    const expStr = resume?.experience ? safeJoin(resume.experience, 3) : 'No resume uploaded';
    const githubStrengths = github?.strengths ? safeJoin(github.strengths, 5) : 'No GitHub connected';
    
    const matchedSkillsStr = skillGap?.matchedSkills 
      ? safeJoin(skillGap.matchedSkills, 10) 
      : safeJoin(user.skills, 10);
      
    const missingSkillsStr = skillGap?.missingSkills ? safeJoin(skillGap.missingSkills, 10) : 'None';

    const roadmapTitle = roadmapRaw?.roadmap?.title || 'None';
    const roadmapSkills = roadmapRaw?.roadmap?.skillsToLearn ? safeJoin(roadmapRaw.roadmap.skillsToLearn, 5) : 'None';
    const roadmapFocus = roadmapRaw?.roadmap?.overview || 'None';

    const prompt = `
      You are an expert technical recruiter and career coach.
      Analyze the following candidate's profile and recommend highly realistic job matches.

      --- Candidate Data ---
      Target Role: ${user.targetRole}
      Target Company: ${user.targetCompany || 'Any'}
      Overall Readiness Score: ${skillGap ? skillGap.readinessScore : 'Unknown'}%
      Matched Skills: ${matchedSkillsStr}
      Missing Skills for Target: ${missingSkillsStr}
      Experience: ${expStr}
      GitHub Strengths: ${githubStrengths}
      
      --- Roadmap Focus ---
      Roadmap Title: ${roadmapTitle}
      Top Skills to Learn: ${roadmapSkills}
      Current Focus Overview: ${roadmapFocus}

      Based on their actual readiness, divide your recommendations into three strict categories:
      1. applyNow: Jobs they are highly qualified for *today* based on their matched skills. If their readiness is low, these might be internships or junior roles.
      2. applyAfterUpskilling: Jobs they can apply for in 1-3 months once they learn the missing skills.
      3. longTermGoals: Dream jobs or senior roles taking 6+ months of experience.

      Return a strict JSON object with EXACTLY this structure:
      {
        "applyNow": [
          {
            "jobTitle": "String",
            "company": "String (Realistic company or their target)",
            "matchScore": Number (0-100),
            "confidenceScore": Number (0-100, AI confidence in this match),
            "matchedSkills": ["String"],
            "missingSkills": ["String"],
            "recommendation": "String (Why they fit this role)",
            "nextAction": "String (e.g. 'Build two TypeScript React projects')",
            "applicationReadiness": "String (e.g. 'Ready to apply today')"
          }
        ],
        "applyAfterUpskilling": [ ...same structure... ],
        "longTermGoals": [ ...same structure... ]
      }
      
      Generate at least 2 jobs per category. Do NOT wrap the JSON in Markdown formatting blocks like \`\`\`json. Return pure JSON string.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean potential markdown blocks with improved regex
    const cleanedText = responseText
      .replace(/```(?:json)?/gi, '')
      .replace(/```/g, '')
      .trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating job matches with Gemini:", error);
    throw error;
  }
};

module.exports = {
  generateJobMatches
};
