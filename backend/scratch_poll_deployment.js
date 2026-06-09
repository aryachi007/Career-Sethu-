const url = "https://career-sethu.onrender.com/health";

async function run() {
  console.log("Polling health endpoint for version update...");
  let count = 0;
  
  const interval = setInterval(async () => {
    count++;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        console.log(`[Attempt ${count}] Status: ${res.status}, Version: ${data.version}`);
        if (data.version === "v2.0-force-github-regeneration") {
          console.log("\nDEPLOYMENT DETECTED SUCCESSFULLY!");
          clearInterval(interval);
          process.exit(0);
        }
      } else {
        console.log(`[Attempt ${count}] Error response status: ${res.status}`);
      }
    } catch (err) {
      console.log(`[Attempt ${count}] Connection failed: ${err.message}`);
    }
    
    if (count >= 30) { // 5 minutes max
      console.log("Polling timed out.");
      clearInterval(interval);
      process.exit(1);
    }
  }, 10000);
}

run();
