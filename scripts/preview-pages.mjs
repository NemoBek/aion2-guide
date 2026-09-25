import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { root } from './validate-snapshot.mjs';

const out = path.join(root, 'out');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.txt': 'text/plain' };
createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); } catch { response.writeHead(400).end(); return; }
  if (!pathname.startsWith('/aion2-guide/')) { response.writeHead(404).end(); return; }
  const relative = pathname.slice('/aion2-guide/'.length);
  const file = path.resolve(out, relative || 'index.html');
  if (!file.startsWith(out + path.sep)) { response.writeHead(403).end(); return; }
  try {
    const target = statSync(file).isDirectory() ? path.join(file, 'index.html') : file;
    response.writeHead(200, { 'Content-Type': `${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8` }).end(readFileSync(target));
  } catch { response.writeHead(404).end(); }
}).listen(4173, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4173/aion2-guide/'));
