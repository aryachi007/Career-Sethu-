const fs = require('fs');
const fetch = require('node-fetch'); // If not available we'll use node's http or just mock

async function test() {
  const db = JSON.parse(fs.readFileSync('./backend/local_db.json', 'utf8'));
  console.log("DB Users:");
  console.log(db.users.map(u => ({ id: u._id, githubUrl: u.githubUrl })));
}

test();
