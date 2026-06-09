const fs = require("fs");
const path = require("path");

const rootDirs = [
  "C:\\Users\\user07\\Desktop",
  "C:\\Users\\user07\\Documents",
  "C:\\Users\\user07\\.gemini"
];

const skipDirs = [
  "node_modules",
  ".git",
  ".github",
  "dist",
  "build",
  "AppData",
  "antigravity-ide"
];

function searchDir(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        continue;
      }
      
      if (stat.isDirectory()) {
        if (skipDirs.includes(file)) continue;
        searchDir(fullPath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if ([".txt", ".env", ".json", ".js", ".md"].includes(ext)) {
          try {
            const content = fs.readFileSync(fullPath, "utf8");
            if (content.includes("mongodb+srv://")) {
              console.log(`FOUND in file: ${fullPath}`);
              const lines = content.split("\n");
              lines.forEach(line => {
                if (line.includes("mongodb+srv://")) {
                  console.log("  Line:", line.trim());
                }
              });
            }
          } catch (e) {
            // ignore read errors
          }
        }
      }
    }
  } catch (e) {
    // ignore read errors
  }
}

console.log("Starting search for mongodb+srv...");
rootDirs.forEach(dir => {
  console.log(`Searching directory: ${dir}`);
  searchDir(dir);
});
console.log("Search finished.");
