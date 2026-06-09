const analyzeGithubProfile = async (githubUrl) => {
  if (!githubUrl || !githubUrl.includes("github.com/")) {
    throw new Error("Invalid GitHub URL");
  }

  // Extract username from URL (e.g., https://github.com/octocat)
  const username = githubUrl.split("github.com/")[1].split("/")[0].trim();

  // Fetch basic profile
  const profileRes = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      "User-Agent": "Career-Sethu-App"
    }
  });
  
  if (!profileRes.ok) {
    throw new Error(`GitHub API profile fetch failed for user ${username} with status ${profileRes.status}`);
  }
  const profileData = await profileRes.json();

  // Fetch repos
  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`, {
    headers: {
      "User-Agent": "Career-Sethu-App"
    }
  });
  
  if (!reposRes.ok) {
    throw new Error(`GitHub API repos fetch failed for user ${username} with status ${reposRes.status}`);
  }
  const reposData = await reposRes.json();

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

  // Deterministic Analysis Logic
  let estimatedSkillLevel = "Beginner";
  if (repoCount > 30) {
    estimatedSkillLevel = "Advanced";
  } else if (repoCount > 10) {
    estimatedSkillLevel = "Intermediate";
  }

  const strengths = [];
  if (topLanguages.length > 0) {
    strengths.push(`Demonstrated familiarity with ${topLanguages.join(', ')}`);
  } else {
    strengths.push("Consistent code organization");
  }
  
  if (repoCount > 15) {
    strengths.push("Highly active public code contributions");
  } else {
    strengths.push("Active public contributions");
  }

  const weaknesses = [
    "Needs deeper architectural patterns",
    "Could improve automated test coverage"
  ];

  if (repoCount < 5) {
    weaknesses.push("Requires more public portfolio building");
  }

  return {
    githubUsername: username,
    repoCount,
    topLanguages,
    topRepositories,
    estimatedSkillLevel,
    strengths,
    weaknesses
  };
};

module.exports = {
  analyzeGithubProfile,
};
