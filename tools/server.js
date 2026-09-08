/* 极简静态服务器：电脑与手机同一 WiFi 时，手机访问电脑 IP 即可打开 Leano */
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);
const MIME = {
  '.html':'text/html; charset=utf-8', '.htm':'text/html; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.webmanifest':'application/manifest+json; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.gif':'image/gif',
  '.svg':'image/svg+xml', '.ico':'image/x-icon', '.txt':'text/plain; charset=utf-8', '.md':'text/plain; charset=utf-8'
};
const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath.endsWith('/')) urlPath += 'index.html';
    const file = path.normalize(path.join(ROOT, urlPath));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    });
  } catch (e) { res.writeHead(500); res.end('Error'); }
});
server.listen(PORT, '0.0.0.0', () => {
  const nets = os.networkInterfaces();
  const addrs = [];
  Object.keys(nets).forEach(k => (nets[k]||[]).forEach(i => { if (i.family === 'IPv4' && !i.internal) addrs.push(i.address); }));
  console.log('[Leano] local server running at:');
  console.log('  http://localhost:' + PORT);
  addrs.forEach(a => console.log('  手机访问(同一WiFi): http://' + a + ':' + PORT));
  console.log('Press Ctrl+C to stop.');
});