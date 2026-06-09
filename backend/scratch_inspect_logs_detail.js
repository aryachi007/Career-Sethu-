const fs = require('fs');
const path = require('path');

const logFilePath = path.join('C:', 'Users', 'user07', '.gemini', 'antigravity-ide', 'brain', '266eaaea-c693-46ad-a089-b92090e47351', '.system_generated', 'logs', 'transcript.jsonl');

const fileContent = fs.readFileSync(logFilePath, 'utf8');
const lines = fileContent.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("Browser subagent result:")) {
    const obj = JSON.parse(lines[i]);
    fs.writeFileSync('c:\\Users\\user07\\Desktop\\Career-Sethu\\backend\\subagent_output.txt', obj.content, 'utf8');
    console.log("Successfully wrote to subagent_output.txt");
  }
}
