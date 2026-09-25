import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { root } from './validate-snapshot.mjs';

const out = path.join(root, 'out');
const html = readFileSync(path.join(out, 'index.html'), 'utf8');
if (!existsSync(path.join(out, '.nojekyll'))) throw new Error('Missing .nojekyll');
if (!html.includes('Неофициальная интерактивная версия') || !html.includes('Открыть оригинальную таблицу')) throw new Error('Missing source attribution');
const refs = [...html.matchAll(/(?:href|src)="(\/aion2-guide\/[^"?#]+)"/g)].map((match) => match[1]);
if (refs.length < 20) throw new Error('Too few exported local references');
for (const ref of refs) {
  const relative = ref.slice('/aion2-guide/'.length);
  if (!existsSync(path.join(out, relative))) throw new Error(`Missing exported resource: ${ref}`);
}
if (/(?:href|src)="\/(?:assets|_next)\//.test(html)) throw new Error('Found a resource without the Pages base path');
console.log(`Static export valid: ${refs.length} prefixed local references.`);
