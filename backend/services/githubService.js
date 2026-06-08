const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const analyzeGithubProfile = async (githubUrl) => {
  if (!githubUrl || !githubUrl.includes("github.com/")) {
    throw new Error("Invalid GitHub URL");
  }

  // Extract username from URL (e.g., https://github.com/octocat)
  const username = githubUrl.split("github.com/")[1].split("/")[0].trim();

  // Fetch basic profile
  const profileRes = await fetch(`https://api.github.com/users/${username}`);
  if (!profileRes.ok) {
    throw new Error(`GitHub API error fetching profile for ${username}`);
  }
  const profileData = await profileRes.json();

  // Fetch repos
  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`);
  let reposData = [];
  if (reposRes.ok) {
    reposData = await reposRes.json();
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
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
