const baseUrl = "https://career-sethu.onrender.com/api";

const userIds = [
  "6a272a8af0d22cee0d33d672",
  "6a27299ef0d22cee0d33d66f",
  "6a2725c378da39ffe39c96b1",
  "6a27257e78da39ffe39c96af",
  "6a27256078da39ffe39c96ad",
  "6a27240f78da39ffe39c96ab"
];

async function run() {
  for (const userId of userIds) {
    try {
      const res = await fetch(`${baseUrl}/dashboard/${userId}`);
      if (!res.ok) {
        console.log(`User ${userId}: fetch status ${res.status}`);
        continue;
      }
      const data = await res.json();
      console.log(`\n=================== USER: ${userId} ===================`);
      console.log("Name:", data.profile?.name);
      console.log("GitHub URL in Profile:", data.profile?.githubUrl);
      console.log("GitHub Analysis Available:", !!data.githubAnalysis);
      if (data.githubAnalysis) {
        console.log("  - Username:", data.githubAnalysis.githubUsername);
        console.log("  - Languages:", data.githubAnalysis.topLanguages);
      }
      console.log("Skill Gap Available:", !!data.skillGap);
      if (data.skillGap) {
        console.log("  - Readiness Score:", data.skillGap.readinessScore);
        console.log("  - Skill Gap %:", data.skillGap.skillGapPercentage);
        console.log("  - Missing Skills Count:", data.skillGap.missingSkills?.length);
        console.log("  - Missing Skills:", data.skillGap.missingSkills);
      }
      console.log("Roadmap Available:", !!data.roadmap);
      console.log("Job Matches Category counts:");
      console.log("  - Apply Now:", data.jobMatches?.applyNow?.length || 0);
      console.log("  - Apply After Upskilling:", data.jobMatches?.applyAfterUpskilling?.length || 0);
      console.log("  - Long Term:", data.jobMatches?.longTermGoals?.length || 0);
    } catch (err) {
      console.error(`Error fetching user ${userId}:`, err.message);
    }
  }
}
run();
