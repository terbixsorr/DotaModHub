const fs = require('fs');
const html = fs.readFileSync('c:\\безопасный интернет\\index.html', 'utf8');
const regex = /id=["']([^"']*(?:modal|page|view|window|lightbox|detail)[^"']*)["']/gi;
let match;
const results = new Set();
while ((match = regex.exec(html)) !== null) {
  results.add(match[1]);
}
console.log('Found IDs:', Array.from(results));
