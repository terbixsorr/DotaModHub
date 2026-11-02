const https = require('https');

const req = https.get('https://www.hvoyniy-mir.ru/', {
  headers: {
    'Accept-Encoding': 'gzip, deflate, br',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}, res => {
  console.log('Status:', res.statusCode);
  console.log('Content-Encoding:', res.headers['content-encoding']);
  console.log('Content-Length:', res.headers['content-length']);
  let bytes = 0;
  let chunks = 0;
  res.on('data', chunk => {
    bytes += chunk.length;
    chunks++;
    if (chunks % 5 === 0 || bytes > 100000) {
      console.log(`Received chunk #${chunks}: ${chunk.length} bytes (total ${bytes})`);
    }
  });
  res.on('end', () => {
    console.log(`COMPLETE! Total chunks: ${chunks}, Total wire bytes: ${bytes}`);
  });
});

req.on('error', err => {
  console.log('Request Error:', err.message);
});

setTimeout(() => {
  console.log('Watchdog timeout after 15s');
  req.destroy();
}, 15000);
