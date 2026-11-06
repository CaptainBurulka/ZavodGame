// Роздає гру з цієї папки на телефон у тій самій Wi-Fi. Запуск: подвійний клік на "Запустити гру.bat".
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.js': 'text/javascript; charset=utf-8' };

http.createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html';
  const file = path.resolve(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log('Нічна заводь працює. Відкрий на айфоні в Safari:');
  for (const list of Object.values(os.networkInterfaces())) for (const a of list) if (a.family === 'IPv4' && !a.internal) console.log(`  http://${a.address}:${PORT}`);
  console.log('Не закривай це вікно, поки граєш.');
});
