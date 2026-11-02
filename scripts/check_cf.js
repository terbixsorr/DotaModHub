const fs = require('fs');
const path = require('path');
const https = require('https');

const tomlPath = path.join(process.env.APPDATA, 'xdg.config', '.wrangler', 'config', 'default.toml');
const content = fs.readFileSync(tomlPath, 'utf8');
const match = content.match(/oauth_token\s*=\s*"([^"]+)"/);
if (!match) {
  console.log('No token');
  process.exit(1);
}
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
  const zone = await cfFetch('/zones/009a5bfc8b38f5ec323ba25493126e5a');
  console.log('Zone:', zone.result ? {
    id: zone.result.id,
    name: zone.result.name,
    status: zone.result.status,
    name_servers: zone.result.name_servers
  } : zone);

  // Trigger zone activation check if pending
  if (zone.result && zone.result.status === 'pending') {
    console.log('Zone is pending. Triggering activation check...');
    const activation = await cfFetch('/zones/009a5bfc8b38f5ec323ba25493126e5a/activation_check', 'PUT');
    console.log('Activation check response:', activation);
  }

  const dnsRecords = await cfFetch('/zones/009a5bfc8b38f5ec323ba25493126e5a/dns_records');
  if (dnsRecords.result) {
    console.log('Found ' + dnsRecords.result.length + ' DNS records:');
    dnsRecords.result.forEach(r => console.log('  ', r.type.padEnd(6), r.name.padEnd(25), r.content, 'proxied:', r.proxied));
  } else {
    console.log('DNS records response:', dnsRecords);
  }

  // Also check Pages domains
  const pagesDomains = await cfFetch('/accounts/8acde46173623a4b5aed4945ff132bad/pages/projects/hvoyniy-mir/domains');
  console.log('\nPages custom domains:');
  if (pagesDomains.result) {
    pagesDomains.result.forEach(d => console.log('  Domain:', d.name, 'status:', d.status, 'cert_status:', d.certificate_status));
  } else {
    console.log('Pages domains response:', pagesDomains);
  }
}

run();
