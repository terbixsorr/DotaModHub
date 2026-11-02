const fs = require('fs');
const https = require('https');
const { DatabaseSync } = require('node:sqlite');

const src = 'C:/Users/terbix/AppData/Roaming/Mozilla/Firefox/Profiles/sctea2w1.default-release/cookies.sqlite';
const dst = 'C:/Users/terbix/cookies_temp.sqlite';
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
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  const zoneId = '009a5bfc8b38f5ec323ba25493126e5a';
  console.log('Querying zone status via Dash API...');
  const zone = await dashFetch(`/zones/${zoneId}`);
  console.log('Zone result:', zone.result ? {
    id: zone.result.id,
    name: zone.result.name,
    status: zone.result.status
  } : zone);

  if (zone.result && zone.result.status === 'pending') {
    console.log('Triggering activation check via Dash API...');
    const check = await dashFetch(`/zones/${zoneId}/activation_check`, 'PUT');
    console.log('Activation check result:', check);
  }
}

main().catch(console.error);
