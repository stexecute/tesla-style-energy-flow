// Tiny static server for the local preview page.
//   node dev/serve.js   ->  http://localhost:8080/dev/preview.html
// Node's built-in http.server equivalents (e.g. python -m http.server) serve .js
// as text/plain, which browsers refuse to load as ES modules — hence this file.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REAL_ROOT = fs.realpathSync(ROOT);
const PORT = Number(process.env.PORT) || 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif'
};

http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400);
    res.end('bad request');
    return;
  }
  if (urlPath.includes('\0')) {
    res.writeHead(400);
    res.end('bad request');
    return;
  }
  if (urlPath === '/') urlPath = '/dev/preview.html';

  const filePath = path.resolve(ROOT, `.${urlPath}`);
  const relativePath = path.relative(ROOT, filePath);
  const allowed = relativePath === 'dev/preview.html' ||
    relativePath === 'dist/tesla-style-energy-flow.js' ||
    relativePath.startsWith(`dist${path.sep}backgrounds${path.sep}`);
  if (!allowed || relativePath.split(path.sep).some((part) => part.startsWith('.'))) {
    res.writeHead(403);
    res.end('forbidden');
    return;
  }

  fs.realpath(filePath, (pathError, realPath) => {
    if (pathError) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 — not found: ' + urlPath);
      return;
    }
    if (path.relative(REAL_ROOT, realPath) !== relativePath) {
      res.writeHead(403);
      res.end('forbidden');
      return;
    }
    fs.readFile(realPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(realPath).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      res.end(data);
    });
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Preview server running:  http://localhost:${PORT}/dev/preview.html`);
  console.log('Press Ctrl+C to stop.');
});
