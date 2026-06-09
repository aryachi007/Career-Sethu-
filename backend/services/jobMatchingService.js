const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("[jobMatchingService] FATAL: GEMINI_API_KEY environment variable is not set.");
}
const genAI = new GoogleGenerativeAI(apiKey || "MISSING_KEY");

const generateJobMatches = async (user, resume, github, skillGap, roadmapRaw) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    console.error("Error generating job matches with Gemini (Using fallback):", error.message);
    
    const targetRole = user.targetRole || "Software Engineer";
    const targetCompany = user.targetCompany || "Google";
    const userSkills = user.skills && user.skills.length > 0 ? user.skills : ["React", "JavaScript", "Python"];
    
    return {
      applyNow: [
        {
          jobTitle: `Junior ${targetRole}`,
          company: `${targetCompany} (Contract)`,
          matchScore: 80,
          confidenceScore: 85,
          matchedSkills: userSkills,
          missingSkills: ["System Design"],
          recommendation: "Great fit for an entry-level or contract tier based on your verified baseline stack.",
          nextAction: "Solidify TypeScript and complete a modular REST API project.",
          applicationReadiness: "Ready to apply today"
        },
        {
          jobTitle: `Frontend Developer`,
          company: `GlobalTech Solutions`,
          matchScore: 88,
          confidenceScore: 90,
          matchedSkills: userSkills.filter(s => s.toLowerCase() !== 'python'),
          missingSkills: ["TypeScript"],
          recommendation: "Strong match for UI engineering roles requiring modern framework experience.",
          nextAction: "Convert your React portfolio projects to TypeScript.",
          applicationReadiness: "Ready to apply today"
        }
      ],
      applyAfterUpskilling: [
        {
          jobTitle: `Mid-level ${targetRole}`,
          company: `InnoStream Systems`,
          matchScore: 65,
          confidenceScore: 80,
          matchedSkills: userSkills,
          missingSkills: ["System Design", "Docker", "Node.js (Advanced)"],
          recommendation: "Excellent growth path once intermediate architecture and microservices skills are learned.",
          nextAction: "Complete a course on Docker and design a multi-service message broker.",
          applicationReadiness: "1-3 months of upskilling needed"
        }
      ],
      longTermGoals: [
        {
          jobTitle: `Lead ${targetRole}`,
          company: targetCompany,
          matchScore: 40,
          confidenceScore: 75,
          matchedSkills: userSkills,
          missingSkills: ["System Design", "Cloud Architecture", "Distributed Caching"],
          recommendation: "Target destination objective. Focus on end-to-end design patterns and technical leadership.",
          nextAction: "Read designing data-intensive applications and build a load-balanced prototype.",
          applicationReadiness: "6+ months of experience needed"
        }
      ]
    };
  }
};

module.exports = {
  generateJobMatches
};
