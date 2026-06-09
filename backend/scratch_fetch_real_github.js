async function run() {
  const username = "aryachi007";
  try {
    console.log("Fetching profile from GitHub API...");
    const profileRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        "User-Agent": "Career-Sethu-App"
      }
    });
    console.log("Profile Status:", profileRes.status);
    const profileData = await profileRes.json();
    console.log("Profile Data:", JSON.stringify(profileData, null, 2));

    console.log("\nFetching repos from GitHub API...");
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`, {
      headers: {
        "User-Agent": "Career-Sethu-App"
      }
    });
    console.log("Repos Status:", reposRes.status);
    const reposData = await reposRes.json();
    console.log("Repos Count:", Array.isArray(reposData) ? reposData.length : "Not an array");
    if (Array.isArray(reposData)) {
      console.log("Repos Names & Languages:");
      reposData.forEach(r => console.log(`- ${r.name} (${r.language || 'none'}) stars: ${r.stargazers_count}`));
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
run();
