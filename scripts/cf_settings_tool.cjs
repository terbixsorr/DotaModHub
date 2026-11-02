const fs = require('fs');
const https = require('https');
const { DatabaseSync } = require('node:sqlite');

const src = 'C:/Users/terbix/AppData/Roaming/Mozilla/Firefox/Profiles/sctea2w1.default-release/cookies.sqlite';
const dst = 'C:/Users/terbix/cookies_temp2.sqlite';
fs.copyFileSync(src, dst);
const db = new DatabaseSync(dst);
const rows = db.prepare("SELECT host, name, value FROM moz_cookies WHERE host LIKE '%dash.cloudflare.com%'").all();
const cookieHeader = rows.map(r => `${r.name}=${r.value}`).join('; ');

function dashFetch(urlPath, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'dash.cloudflare.com',
      path: '/api/v4' + urlPath,
      method: method,
      headers: {
        'Cookie': cookieHeader,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Referer': 'https://dash.cloudflare.com/'
      }
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function check() {
  const zoneId = '009a5bfc8b38f5ec323ba25493126e5a';
  for (const s of ['tls_1_3', 'ech', 'http3', '0rtt', 'always_use_https']) {
    const r = await dashFetch(`/zones/${zoneId}/settings/${s}`);
    console.log(s, ':', r.result ? r.result.value : r.errors || r);
  }
}

const action = process.argv[2];
const setting = process.argv[3];
const value = process.argv[4];

if (action === 'set' && setting && value) {
  const zoneId = '009a5bfc8b38f5ec323ba25493126e5a';
  dashFetch(`/zones/${zoneId}/settings/${setting}`, 'PATCH', { value: value }).then(res => {
    console.log(`Updated ${setting} to ${value}:`, res.result ? res.result.value : res);
  }).catch(console.error);
} else {
  check().catch(console.error);
}
