import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { root } from './validate-snapshot.mjs';

const out = path.join(root, 'out');
if (!existsSync(path.join(out, '.nojekyll'))) throw new Error('Missing .nojekyll');
let total = 0;
for (const page of ['index.html', 'day-two/index.html']) {
const html = readFileSync(path.join(out, page), 'utf8');
if (!html.includes('Неофициальная интерактивная версия') || !html.includes('Открыть оригинальную таблицу')) throw new Error('Missing source attribution');
const refs = [...html.matchAll(/(?:href|src)="(\/aion2-guide\/[^"?#]+)"/g)].map((match) => match[1]);
if (refs.length < 20) throw new Error('Too few exported local references');
for (const ref of refs) {
  const relative = ref.slice('/aion2-guide/'.length);
  if (!existsSync(path.join(out, relative))) throw new Error(`Missing exported resource: ${ref}`);
}
if (/(?:href|src)="\/(?:assets|_next)\//.test(html)) throw new Error('Found a resource without the Pages base path');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(match[1])) throw new Error(`Missing anchor in ${page}: ${match[1]}`);
}
total += refs.length;
}
console.log(`Static export valid: 2 pages, ${total} prefixed local references.`);
