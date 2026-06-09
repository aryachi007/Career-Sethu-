const fs = require('fs');
const path = require('path');

const userId = "6a272a8af0d22cee0d33d672";
const localUrl = `http://localhost:5000/api/dashboard/${userId}`;
const prodUrl = `https://career-sethu.onrender.com/api/dashboard/${userId}`;

async function compare() {
  console.log("Fetching local dashboard payload...");
  let localData = null;
  try {
    const res = await fetch(localUrl);
    localData = await res.json();
    console.log("Local payload retrieved successfully.");
  } catch (err) {
    console.error("Failed to fetch local payload:", err.message);
  }

  console.log("Fetching production dashboard payload...");
  let prodData = null;
  try {
    const res = await fetch(prodUrl);
    prodData = await res.json();
    console.log("Production payload retrieved successfully.");
  } catch (err) {
    console.error("Failed to fetch production payload:", err.message);
  }

  if (!localData || !prodData) {
    console.error("\nCannot proceed with comparison since one of the payloads failed to load.");
    return;
  }

  console.log("\n=================== COMPARISON RESULTS ===================");

  // 1. Profile comparison
  console.log("Profile Name:");
  console.log(`  - Local: ${localData.profile?.name}`);
  console.log(`  - Prod : ${prodData.profile?.name}`);
  console.log(`  - Match: ${localData.profile?.name === prodData.profile?.name}`);

  // 2. githubAnalysis comparison
  console.log("\nGithub Analysis:");
  if (localData.githubAnalysis && prodData.githubAnalysis) {
    console.log(`  - Local Username: ${localData.githubAnalysis.githubUsername}`);
    console.log(`  - Prod Username : ${prodData.githubAnalysis.githubUsername}`);
    console.log(`  - Local Skill Lvl: ${localData.githubAnalysis.estimatedSkillLevel}`);
    console.log(`  - Prod Skill Lvl : ${prodData.githubAnalysis.estimatedSkillLevel}`);
    console.log(`  - Match: ${localData.githubAnalysis.githubUsername === prodData.githubAnalysis.githubUsername}`);
  } else {
    console.log(`  - Local: ${!!localData.githubAnalysis ? 'Available' : 'NULL'}`);
    console.log(`  - Prod : ${!!prodData.githubAnalysis ? 'Available' : 'NULL'}`);
  }

  // 3. skillGap comparison
  console.log("\nSkill Gap:");
  if (localData.skillGap && prodData.skillGap) {
    console.log(`  - Local Readiness Score: ${localData.skillGap.readinessScore}`);
    console.log(`  - Prod Readiness Score : ${prodData.skillGap.readinessScore}`);
    console.log(`  - Local Gap %: ${localData.skillGap.skillGapPercentage}`);
    console.log(`  - Prod Gap % : ${prodData.skillGap.skillGapPercentage}`);
    console.log(`  - Match: ${localData.skillGap.readinessScore === prodData.skillGap.readinessScore}`);
  } else {
    console.log(`  - Local: ${!!localData.skillGap ? 'Available' : 'NULL'}`);
    console.log(`  - Prod : ${!!prodData.skillGap ? 'Available' : 'NULL'}`);
  }

  // 4. roadmap comparison
  console.log("\nRoadmap:");
  console.log(`  - Local Roadmap Available: ${!!localData.roadmap}`);
  console.log(`  - Prod Roadmap Available : ${!!prodData.roadmap}`);
  if (localData.roadmap && prodData.roadmap) {
    // compare size of roadmap object
    console.log(`  - Local Steps Count: ${localData.roadmap.timeline?.length || 0}`);
    console.log(`  - Prod Steps Count : ${prodData.roadmap.timeline?.length || 0}`);
  }

  // 5. jobMatches comparison
  console.log("\nJob Matches Count:");
  const getJobMatchesCount = (matches) => {
    if (!matches) return 0;
    const { applyNow = [], applyAfterUpskilling = [], longTermGoals = [] } = matches;
    return applyNow.length + applyAfterUpskilling.length + longTermGoals.length;
  };
  console.log(`  - Local Job Matches: ${getJobMatchesCount(localData.jobMatches)}`);
  console.log(`  - Prod Job Matches : ${getJobMatchesCount(prodData.jobMatches)}`);

  console.log("==========================================================");

  // Write comparison logs to files for evidence
  fs.writeFileSync(path.join(__dirname, 'local_payload_sample.json'), JSON.stringify(localData, null, 2));
  fs.writeFileSync(path.join(__dirname, 'prod_payload_sample.json'), JSON.stringify(prodData, null, 2));
  console.log("\nSaved payload samples for evidence in local files.");
}

compare();
