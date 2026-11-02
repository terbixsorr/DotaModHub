const fs = require('fs');
const html = fs.readFileSync('C:/безопасный интернет/Хвойный мир/index.html', 'utf8');

// Find all external URLs (http:// or https://)
const urls = [...html.matchAll(/https?:\/\/[^\s"'><\)\`]+/gi)].map(m => m[0]);
const domains = new Set();
urls.forEach(u => {
  try {
    const parsed = new URL(u);
    domains.add(parsed.hostname);
  } catch (e) {}
});

console.log('Domains found in index.html:');
Array.from(domains).sort().forEach(d => console.log(' -', d));
