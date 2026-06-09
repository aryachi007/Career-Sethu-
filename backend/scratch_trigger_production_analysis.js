const baseUrl = "https://career-sethu.onrender.com/api";
const userId = "6a272a8af0d22cee0d33d672";

async function run() {
  try {
    console.log(`Triggering GitHub Analysis for user ${userId}...`);
    const githubRes = await fetch(`${baseUrl}/github/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    console.log(`GitHub Analysis Response Status: ${githubRes.status}`);
    const githubData = await githubRes.json();
    console.log("GitHub Analysis Response:", githubData);

    console.log(`\nTriggering Skill Gap Analysis for user ${userId}...`);
    const skillGapRes = await fetch(`${baseUrl}/skill-gap/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    console.log(`Skill Gap Response Status: ${skillGapRes.status}`);
    const skillGapData = await skillGapRes.json();
    console.log("Skill Gap Response:", skillGapData);

    console.log(`\nFetching updated Dashboard for user ${userId}...`);
    const dashboardRes = await fetch(`${baseUrl}/dashboard/${userId}`);
    const dashboardData = await dashboardRes.json();
    console.log("Updated Dashboard Payload:");
    console.log(JSON.stringify(dashboardData, null, 2));

  } catch (err) {
    console.error("Error triggering analysis:", err);
  }
}

run();
