const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const filesToSync = ['app.js', 'main.js'];

const targetDirs = [
  path.join(root, 'DotaModHub'),
  path.join(root, 'DotaModHub', 'dist', 'DotaModHub-win32-x64', 'resources', 'app'),
  'C:\\Users\\terbix\\AppData\\Local\\Programs\\DotaModHub\\resources\\app'
];

for (const dir of targetDirs) {
  if (fs.existsSync(dir)) {
    console.log(`Syncing to: ${dir}`);
    for (const f of filesToSync) {
      const src = path.join(root, f);
      const dest = path.join(dir, f);
      fs.copyFileSync(src, dest);
      console.log(`  Copied ${f} -> ${dest}`);
    }
  } else {
    console.log(`Skipping (not found): ${dir}`);
  }
}

console.log('Synchronization completed successfully!');
