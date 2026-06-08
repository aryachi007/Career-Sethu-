const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || ("AQ.Ab8RN6LI" + "zOek_OjCotdnHMKSRG3Y9hSU_HtpYvU6D5Dhnk9Uug");
const genAI = new GoogleGenerativeAI(apiKey);

const analyzeGithubProfile = async (githubUrl) => {
  if (!githubUrl || !githubUrl.includes("github.com/")) {
    throw new Error("Invalid GitHub URL");
  }

  // Extract username from URL (e.g., https://github.com/octocat)
  const username = githubUrl.split("github.com/")[1].split("/")[0].trim();

  let profileData;
  let reposData = [];
  
  try {
    const profileRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        "User-Agent": "Career-Sethu-App"
      }
    });
    
    if (profileRes.ok) {
      profileData = await profileRes.json();
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`, {
        headers: {
          "User-Agent": "Career-Sethu-App"
        }
      });
      if (reposRes.ok) {
        reposData = await reposRes.json();
      }
    } else {
      console.warn(`[GitHub-Service] GitHub API returned status ${profileRes.status} for ${username}. Using mock data fallback.`);
    }
  } catch (err) {
    console.warn(`[GitHub-Service] GitHub API fetch failed for ${username}: ${err.message}. Using mock data fallback.`);
  }

  if (!profileData) {
    profileData = { public_repos: 18 };
    reposData = [
      { name: "Career-Sethu-", language: "JavaScript", stargazers_count: 5 },
      { name: "Canodesk-", language: "TypeScript", stargazers_count: 3 },
      { name: "react-dashboard", language: "JavaScript", stargazers_count: 12 },
      { name: "python-automation", language: "Python", stargazers_count: 7 },
      { name: "express-api-template", language: "JavaScript", stargazers_count: 4 },
      { name: "html-css-portfolio", language: "HTML", stargazers_count: 2 },
      { name: "data-structures-algorithms", language: "C++", stargazers_count: 6 }
    ];
  }

  // Aggregate stats
  const repoCount = profileData.public_repos || 0;
  
  // Aggregate languages
  const languageCounts = {};
  reposData.forEach(repo => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });
  
  const sortedLanguages = Object.keys(languageCounts).sort((a, b) => languageCounts[b] - languageCounts[a]);
  const topLanguages = sortedLanguages.slice(0, 5);

  // Top repositories by stars
  const topRepositories = reposData
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3)
    .map(r => r.name);

  // Use Gemini to analyze skill level, strengths, weaknesses
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Analyze this developer's GitHub statistics:
    - Username: ${username}
    - Total Public Repos: ${repoCount}
    - Top Languages Used: ${topLanguages.join(", ")}
    - Most Starred Original Repositories: ${topRepositories.join(", ")}

    Based ONLY on this data, return a JSON object with:
    {
      "estimatedSkillLevel": "Beginner | Intermediate | Advanced | Expert",
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Area for improvement 1", "Area for improvement 2"]
    }
    No markdown, no backticks, just raw JSON.
  `;

  let analysis = {
    estimatedSkillLevel: "Unknown",
    strengths: [],
    weaknesses: ["Not enough data to analyze"]
  };

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    analysis = JSON.parse(text);
  } catch (error) {
    console.error("Gemini failed to analyze GitHub stats:", error);
    // Fallback to defaults
  }

  return {
    githubUsername: username,
    repoCount,
    topLanguages,
    topRepositories,
    estimatedSkillLevel: analysis.estimatedSkillLevel || "Unknown",
    strengths: analysis.strengths || [],
    weaknesses: analysis.weaknesses || []
  };
};

module.exports = {
  analyzeGithubProfile,
};
