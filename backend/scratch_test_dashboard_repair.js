const url = "https://career-sethu.onrender.com/api/dashboard/6a272a8af0d22cee0d33d672";

async function run() {
  try {
    console.log("Fetching live dashboard from production backend...");
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch dashboard: ${res.status}`);
    }
    const data = await res.json();
    console.log("Dashboard Payload:");
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error fetching dashboard:", err);
  }
}

run();
