const fs = require('fs');
const html = fs.readFileSync('C:/безопасный интернет/Хвойный мир/index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.toLowerCase().includes('<script') && l.includes('${p.image}')) {
    console.log(`Line ${i + 1}: ${l}`);
  }
});

// Also let's list all script tags and their start/end lines
const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = re.exec(html)) !== null) {
  count++;
  const startPos = match.index;
  const lineNo = html.substring(0, startPos).split('\n').length;
  const tagOpen = match[0].substring(0, match[0].indexOf('>') + 1);
  console.log(`Tag #${count} at line ${lineNo}: ${tagOpen} (length ${match[0].length})`);
}
