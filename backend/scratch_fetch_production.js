const url = "https://career-sethu.onrender.com/api/users";

async function run() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("PRODUCTION USERS:");
    data.forEach(u => {
      console.log(`- ID: ${u._id}, Name: ${u.name}, Target: ${u.targetRole} @ ${u.targetCompany}, GitHub: ${u.githubUrl}`);
    });
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
run();
