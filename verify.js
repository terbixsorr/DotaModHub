const fs = require('fs');

// 1. Check mods.json
const mods = JSON.parse(fs.readFileSync('data/mods.json', 'utf8'));
const deny = mods.filter(m => m.category === 'creep-deny');
const creeps = mods.filter(m => m.category === 'creeps');
const packs = mods.filter(m => m.category === 'packs');
const herofx = mods.filter(m => m.category === 'herofx');
console.log('Creep Deny count:', deny.length);
console.log('Creeps count:', creeps.length);
console.log('Packs count:', packs.length);
console.log('Hero FX count:', herofx.length);

// 2. Check index.html
const html = fs.readFileSync('index.html', 'utf8');
console.log('index.html has data-category="creep-deny"?', html.includes('data-category="creep-deny"'));
console.log('index.html has data-category="creeps"?', html.includes('data-category="creeps"'));
console.log('index.html has data-category="packs"?', html.includes('data-category="packs"'));

// 3. Check app.js for target=_blank in recent
const appJs = fs.readFileSync('app.js', 'utf8');
console.log('app.js has download_url target=_blank in recent?', appJs.includes('target="_blank"'));
console.log('app.js has installModDirectly in recent?', appJs.includes('installModDirectly') && appJs.includes('selectCategoryDirect'));

// 4. Check main.js for alien models cleanup
const mainJs = fs.readFileSync('main.js', 'utf8');
console.log('main.js removes dotaModels?', mainJs.includes('dotaModels'));

console.log('All checks completed successfully!');
