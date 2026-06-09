const baseUrl = "http://localhost:5000/api";

async function verify() {
  console.log("=== STABILIZATION VERIFICATION PHASE ===");

  console.log("\n[1/5] Creating a fresh test user...");
  const timestamp = Date.now();
  const testEmail = `test_verification_${timestamp}@example.com`;
  
  const loginRes = await fetch(`${baseUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail, name: "Test User", googleId: `google_${timestamp}` })
  });
  
  const user = await loginRes.json();
  const userId = user._id;
  console.log(`Test user created. ID: ${userId}`);

  console.log("\n[2/5] Updating user profile with target roles...");
  await fetch(`${baseUrl}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      college: "Stanford",
      targetRole: "Frontend Engineer",
      targetCompany: "Google",
      githubUrl: "https://github.com/aryachi007",
      skills: ["JavaScript", "React", "CSS"]
    })
  });

  console.log("\n[3/5] Triggering GitHub Analysis (No Gemini Dependency)...");
  const t0 = Date.now();
  const githubRes = await fetch(`${baseUrl}/github/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  console.log(`Status: ${githubRes.status} (${Date.now() - t0}ms)`);
  const githubData = await githubRes.json();
  console.log(`Output Estimated Skill: ${githubData.estimatedSkillLevel}`);
  console.log(`Output Strengths: ${JSON.stringify(githubData.strengths)}`);

  console.log("\n[4/5] Triggering Skill Gap...");
  const t1 = Date.now();
  const skillGapRes = await fetch(`${baseUrl}/skill-gap/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  console.log(`Status: ${skillGapRes.status} (${Date.now() - t1}ms)`);
  const skillGapData = await skillGapRes.json();
  console.log(`Skill Gap Readiness Score: ${skillGapData.readinessScore}%`);
  console.log(`Fallback 50% behavior active?: ${skillGapData.readinessScore === 50 && skillGapData.skillGapPercentage === 50}`);

  console.log("\n[5/5] Triggering Roadmap Generation...");
  const t2 = Date.now();
  const roadmapRes = await fetch(`${baseUrl}/roadmaps/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  console.log(`Status: ${roadmapRes.status} (${Date.now() - t2}ms)`);
  const roadmapData = await roadmapRes.json();
  console.log(`Roadmap Title: ${roadmapData.title}`);
  
  console.log("\n[6/6] Triggering Job Matches...");
  const t3 = Date.now();
  const jobRes = await fetch(`${baseUrl}/job-matches/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  console.log(`Status: ${jobRes.status} (${Date.now() - t3}ms)`);
  
  console.log("\n=== VERIFICATION COMPLETE ===");
}

verify().catch(console.error);
