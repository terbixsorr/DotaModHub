const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');
const src = 'C:/Users/terbix/AppData/Roaming/Mozilla/Firefox/Profiles/sctea2w1.default-release/cookies.sqlite';
const dst = 'C:/Users/terbix/cookies_temp.sqlite';
fs.copyFileSync(src, dst);
const db = new DatabaseSync(dst);
const rows = db.prepare("SELECT host, name, value FROM moz_cookies WHERE host LIKE '%cloudflare.com%'").all();
console.log('Cloudflare cookies count:', rows.length);
rows.forEach(r => console.log('Host:', r.host, 'Name:', r.name, 'Value length:', r.value.length));
