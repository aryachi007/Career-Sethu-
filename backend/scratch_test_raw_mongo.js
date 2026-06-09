const { MongoClient } = require("mongodb");
require("dotenv").config({ path: __dirname + "/.env" });

async function run() {
  const uri = process.env.MONGODB_URI;
  console.log("Raw URI:", uri);
  const client = new MongoClient(uri);
  
  try {
    console.log("Attempting direct connection...");
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("careersethu");
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
  } catch (err) {
    console.error("Connection failed with error:");
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
