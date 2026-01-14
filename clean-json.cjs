const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'courses.json');

try {
  const rawData = fs.readFileSync(filePath, 'utf8');
  const courses = JSON.parse(rawData);

  const uniqueCourses = [];
  const seenCodes = new Set();

  courses.forEach(course => {
    if (!course.code) return;
    
    const normalizedCode = course.code.toLowerCase().replace(/\s+/g, '');

    if (!seenCodes.has(normalizedCode)) {
      seenCodes.add(normalizedCode);
      uniqueCourses.push(course);
    }
  });

  uniqueCourses.sort((a, b) => a.code.localeCompare(b.code));

  fs.writeFileSync(filePath, JSON.stringify(uniqueCourses, null, 2));

  console.log(`Success! Removed ${courses.length - uniqueCourses.length} duplicates.`);
} catch (error) {
  console.error("Error:", error.message);
}