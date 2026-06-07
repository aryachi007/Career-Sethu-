const fs = require('fs');

async function testUpload() {
  const formData = new FormData();
  formData.append('userId', '6a25d50dfd6f67c1f4700048');
  
  const fileBuffer = fs.readFileSync('./test-resume.txt');
  const blob = new Blob([fileBuffer], { type: 'text/plain' });
  formData.append('resume', blob, 'test-resume.txt');

  try {
    console.log('--- POST /api/resume/analyze ---');
    const res = await fetch('http://localhost:5000/api/resume/analyze', {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));

    console.log('\n--- POST /api/roadmaps/generate ---');
    const roadmapRes = await fetch('http://localhost:5000/api/roadmaps/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: '6a25d50dfd6f67c1f4700048' })
    });
    
    const roadmapData = await roadmapRes.json();
    console.log(JSON.stringify(roadmapData.roadmap, null, 2));
    
  } catch (err) {
    console.error(err);
  }
}

testUpload();
