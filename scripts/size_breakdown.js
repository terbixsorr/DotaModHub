const fs = require('fs');
const html = fs.readFileSync('C:/безопасный интернет/Хвойный мир/index.html', 'utf8');

console.log('Total characters:', html.length);

const parts = [
  { name: 'Head (<head>...</head>)', start: 0, end: html.indexOf('</head>') },
  { name: 'Body HTML before main script', start: html.indexOf('</head>'), end: html.indexOf('<script id="app-script"') !== -1 ? html.indexOf('<script id="app-script"') : html.indexOf('<script>\n    // Data structures') },
];

console.log('Main sections:');
const scriptIndex = html.lastIndexOf('<script');
console.log('HTML markup length:', scriptIndex);
console.log('Main <script> length:', html.length - scriptIndex);

// In main script:
const mainScript = html.substring(scriptIndex);
const plantDataMatch = mainScript.match(/const PLANTS = \[[\s\S]*?\];/);
console.log('PLANTS array length in script:', plantDataMatch ? plantDataMatch[0].length : 'not found');

const articlesMatch = mainScript.match(/const ARTICLES = \[[\s\S]*?\];/);
console.log('ARTICLES array length:', articlesMatch ? articlesMatch[0].length : 'not found');

const reviewsMatch = mainScript.match(/const REVIEWS = \[[\s\S]*?\];/);
console.log('REVIEWS array length:', reviewsMatch ? reviewsMatch[0].length : 'not found');
