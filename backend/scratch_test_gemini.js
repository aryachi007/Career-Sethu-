const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent("Say hello!");
    const response = await result.response;
    console.log("Success! Gemini response:", response.text());
  } catch (err) {
    console.error("Gemini API call failed with:", err.message);
  }
}
run();
