const { MongoClient } = require("mongodb");

const usernames = [
  "aryachi007_db_user",
  "aryachi007-db-user",
  "aryachi007",
  "admin",
  "user",
  "db_user",
  "careersethu"
];

const password = "WMIi6tbQV6lTo9tZ";
const cluster = "cluster0.3bu9yjt.mongodb.net";

async function testUser(user) {
  const uri = `mongodb+srv://${user}:${password}@${cluster}/careersethu?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    console.log(`SUCCESS: Connected with user: ${user}`);
    return true;
  } catch (err) {
    console.log(`FAILED for ${user}: ${err.message}`);
    return false;
  } finally {
    await client.close();
  }
}

async function run() {
  for (const u of usernames) {
    const success = await testUser(u);
    if (success) {
      console.log(`\nFound valid database username: ${u}`);
      process.exit(0);
    }
  }
  console.log("\nAll usernames failed.");
}

run();
