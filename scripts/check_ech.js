const fs = require('fs');
const path = require('path');
const https = require('https');

const tomlPath = path.join(process.env.APPDATA, 'xdg.config', '.wrangler', 'config', 'default.toml');
const content = fs.readFileSync(tomlPath, 'utf8');
const match = content.match(/oauth_token\s*=\s*"([^"]+)"/);
const token = match[1];

function cfFetch(urlPath, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.cloudflare.com',
      path: '/client/v4' + urlPath,
      method: method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
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

async function run() {
  const zoneId = '009a5bfc8b38f5ec323ba25493126e5a';
  // Check ECH setting
  const ech = await cfFetch(`/zones/${zoneId}/settings/ech`);
  console.log('ECH setting:', ech);

  // Check HTTP/3 setting
  const http3 = await cfFetch(`/zones/${zoneId}/settings/http3`);
  console.log('HTTP3 setting:', http3);

  // Check min_tls_version
  const minTls = await cfFetch(`/zones/${zoneId}/settings/min_tls_version`);
  console.log('Min TLS version:', minTls);

  // Check 0-RTT
  const zeroRtt = await cfFetch(`/zones/${zoneId}/settings/0rtt`);
  console.log('0-RTT setting:', zeroRtt);
}

run();
