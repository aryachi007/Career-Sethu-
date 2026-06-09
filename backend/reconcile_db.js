const fs = require('fs');
const path = require('path');

const userIds = [
  "6a272a8af0d22cee0d33d672",
  "6a27299ef0d22cee0d33d66f",
  "6a2725c378da39ffe39c96b1",
  "6a27257e78da39ffe39c96af",
  "6a27256078da39ffe39c96ad",
  "6a27240f78da39ffe39c96ab"
];

const productionUrl = "https://career-sethu.onrender.com/api/dashboard";
const localDbPath = path.join(__dirname, 'local_db.json');

async function sync() {
  const localDb = {
    users: [],
    roadmaps: [],
    githubanalyses: [],
    resumeanalyses: [],
    skillgaps: [],
    jobmatches: []
  };

  for (const userId of userIds) {
    try {
      console.log(`Fetching dashboard data from production for user: ${userId}...`);
      const res = await fetch(`${productionUrl}/${userId}`);
      if (!res.ok) {
        console.error(`Failed to fetch for ${userId}: status ${res.status}`);
        continue;
      }
      const data = await res.json();
      
      const { profile, roadmap, skillGap, resumeAnalysis, githubAnalysis, jobMatches } = data;
      
      if (profile) {
        localDb.users.push(profile);
      }
      if (roadmap) {
        localDb.roadmaps.push({
          _id: `roadmap_${userId}`,
          userId,
          roadmap,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      if (githubAnalysis) {
        localDb.githubanalyses.push(githubAnalysis);
      }
      if (resumeAnalysis) {
        localDb.resumeanalyses.push(resumeAnalysis);
      }
      if (skillGap) {
        localDb.skillgaps.push(skillGap);
      }
      if (jobMatches) {
        const { applyNow = [], applyAfterUpskilling = [], longTermGoals = [] } = jobMatches;
        localDb.jobmatches.push(...applyNow, ...applyAfterUpskilling, ...longTermGoals);
      }
      
      console.log(`Successfully synced user ${userId} (${profile?.name || 'Unknown'})`);
    } catch (err) {
      console.error(`Error syncing user ${userId}:`, err.message);
    }
  }

  fs.writeFileSync(localDbPath, JSON.stringify(localDb, null, 2));
  console.log(`\nSync complete! Local database written successfully.`);
}

sync();
