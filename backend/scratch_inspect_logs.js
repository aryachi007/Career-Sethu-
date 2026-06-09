const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logFilePath = path.join('C:', 'Users', 'user07', '.gemini', 'antigravity-ide', 'brain', '266eaaea-c693-46ad-a089-b92090e47351', '.system_generated', 'logs', 'transcript.jsonl');

async function inspect() {
  const fileStream = fs.createReadStream(logFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  console.log("Reading logs...");
  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    if (line.includes("error") || line.includes("failed") || line.includes("Profile") || line.includes("Exception")) {
      console.log(`Line ${lineCount}: ${line.substring(0, 300)}...`);
    }
  }
  console.log(`Total lines read: ${lineCount}`);
}

inspect();
