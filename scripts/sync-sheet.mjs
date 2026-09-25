import { createHash } from 'node:crypto';
import { existsSync, readFileSync, renameSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { root, snapshotPath, sourceUrl, validateSnapshot } from './validate-snapshot.mjs';

const sheetIds = {
  progression: 367558458,
  endgame: 53494555,
  farm: 1190858574,
  mechanics: 1961811882,
  ranger: 1995008018,
  assassin: 927915054,
  chanter: 1998682920,
};
const publishBase = sourceUrl.replace(/\/pubhtml$/, '');
const maxImageBytes = 5 * 1024 * 1024;

async function download(url, binary = false) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'aion2-guide-sync/1.0' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  if (!binary) return response.text();
  const declared = Number(response.headers.get('content-length') || 0);
  if (declared > maxImageBytes) throw new Error(`Image too large: ${url}`);
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > maxImageBytes) throw new Error(`Image too large: ${url}`);
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  const mime = response.headers.get('content-type')?.split(';')[0].trim();
  const signatures = {
    'image/png': buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? 'png' : null,
    'image/jpeg': buffer[0] === 255 && buffer[1] === 216 && buffer[buffer.length - 2] === 255 && buffer[buffer.length - 1] === 217 ? 'jpg' : null,
    'image/webp': buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP' ? 'webp' : null,
  };
  const ext = signatures[mime];
  if (!ext || buffer.length < 100) throw new Error(`Invalid image type or data: ${url}`);
  return { buffer, ext };
}

function csvRows(csv) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (char === '"') {
      if (quoted && csv[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && csv[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += char;
  }
  if (quoted) throw new Error('Unclosed CSV quote');
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function cells(csv) { return csvRows(csv).flat().map((v) => v.trim()).filter(Boolean); }

function farmItems(csv) {
  const lines = cells(csv);
  const sections = { S: [], A: [], B: [] };
  let tier = null;
  for (const line of lines) {
    if (/^S тир фарм:/i.test(line)) { tier = 'S'; continue; }
    if (/^A тир фарм:/i.test(line)) { tier = 'A'; continue; }
    if (/^B тир фарм/i.test(line)) { tier = 'B'; continue; }
    if (tier && /^\d+\.\s+/.test(line)) sections[tier].push(line.replace(/^\d+\.\s+/, '').trim());
  }
  const editorial = new Map([
    ['Абисс фарм мобов, голда, ап, голд шмот, квесты', 'Мобы в Бездне: кина, AP, золотое снаряжение, материалы и задания'],
    ['Фарм ресов: Дерево, одилия, кожа', 'Сбор ресурсов: дерево, одилия и кожа'],
    ['Крафт супереор манастоунов (но для этого надо набить маленьких, в данжах и кв)', 'Крафт superior-манастоунов после накопления малых камней'],
    ['Флипать на ауке (не S тир так как нужно знать мелочи, и понимать рынок)', 'Торговля на аукционе — только если уже понимаешь рынок и цены'],
    ['Крафт балванок 60лвл и лоу лвл шмота (Б тир так как требует вложений)', 'Крафт заготовок 60 уровня и низкоуровневого снаряжения'],
    ['Раш т1 данжей (не S тир так как низкий шанс на т1 крафт рес)', 'Быстрые забеги в T1 ради редких материалов'],
    ['Ранний фарм твинами (много время, мало прибыли)', 'Ранние твинки: много времени при небольшой начальной прибыли'],
  ]);
  for (const [tier, count] of [['S', 3], ['A', 1], ['B', 3]]) {
    if (sections[tier].length !== count) throw new Error(`Unexpected ${tier} tier item count: ${sections[tier].length}`);
    sections[tier] = sections[tier].map((item) => {
      if (!editorial.has(item)) throw new Error(`Unreviewed ${tier} tier item: ${item.slice(0, 80)}`);
      return editorial.get(item);
    });
  }
  return sections;
}

function classBuilds(csv, job) {
  const urls = cells(csv).flatMap((cell) => cell.match(/https:\/\/aion2t\.com\/ru\/simulator\?job=\d+&b=[A-Za-z0-9]+/g) || []);
  const unique = [...new Set(urls)];
  if (unique.length !== 2 || unique.some((url) => new URL(url).searchParams.get('job') !== String(job))) throw new Error(`Unexpected class builds for job ${job}`);
  return unique;
}

function imageUrls(html, expected, label) {
  const urls = [...html.matchAll(/<img\b[^>]*\bsrc=['"]([^'"]+)['"]/gi)].map((match) => match[1].replaceAll('&amp;', '&'));
  if (urls.length !== expected) throw new Error(`Unexpected ${label} image count: ${urls.length}`);
  for (const value of urls) {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com' || !url.pathname.startsWith('/sheets-images-rt/')) throw new Error(`Untrusted ${label} image URL`);
  }
  return urls;
}

function hash(buffer) { return createHash('sha256').update(buffer).digest('hex'); }
function imageFile(reference) { return path.join(root, 'public', reference.slice(1)); }

async function prepareImages(html, currentPaths, label) {
  const urls = imageUrls(html, currentPaths.length, label);
  const result = [];
  for (let i = 0; i < urls.length; i++) {
    const { buffer, ext } = await download(urls[i], true);
    const existing = currentPaths[i];
    if (existsSync(imageFile(existing)) && hash(readFileSync(imageFile(existing))) === hash(buffer)) {
      result.push({ reference: existing });
    } else {
      const reference = `/assets/synced/${label}-${String(i + 1).padStart(2, '0')}-${hash(buffer).slice(0, 12)}.${ext}`;
      result.push({ reference, buffer });
    }
  }
  return result;
}

async function main() {
  const current = validateSnapshot(JSON.parse(readFileSync(snapshotPath, 'utf8')));
  const csv = {};
  for (const key of ['progression', 'endgame', 'farm', 'ranger', 'assassin', 'chanter']) {
    csv[key] = await download(`${publishBase}/pub?gid=${sheetIds[key]}&single=true&output=csv`);
  }
  const progression = cells(csv.progression).join(' ');
  const endgame = cells(csv.endgame).join(' ');
  if (!/40 перьев/.test(progression) || !/45\s*лвл/.test(progression) || !/шуго/i.test(endgame) || !/найтмер/i.test(endgame)) throw new Error('Expected progression sections missing');
  const farm = farmItems(csv.farm);
  const builds = {
    ranger: classBuilds(csv.ranger, 4),
    assassin: classBuilds(csv.assassin, 5),
    chanter: classBuilds(csv.chanter, 9),
  };
  const progressionHtml = await download(`${publishBase}/pubhtml/sheet?headers=false&gid=${sheetIds.progression}`);
  const mechanicsHtml = await download(`${publishBase}/pubhtml/sheet?headers=false&gid=${sheetIds.mechanics}`);
  const images = {
    progression: await prepareImages(progressionHtml, current.galleries.progression, 'progression'),
    mechanics: await prepareImages(mechanicsHtml, current.mechanics.map((item) => item.image), 'mechanics'),
  };
  const next = structuredClone(current);
  next.farmTiers.forEach((tier) => { tier.items = farm[tier.tier]; });
  for (const key of Object.keys(builds)) [next.classData[key].startBuild, next.classData[key].skillBuild] = builds[key];
  next.galleries.progression = images.progression.map((item) => item.reference);
  next.routeSteps[0].image = next.galleries.progression[0];
  next.routeSteps[1].image = next.galleries.progression[15];
  next.routeSteps[3].image = next.galleries.progression[10];
  next.mechanics.forEach((item, i) => { item.image = images.mechanics[i].reference; });
  const same = JSON.stringify({ ...next, lastSyncedAt: null }) === JSON.stringify({ ...current, lastSyncedAt: null });
  if (same) { console.log('No guide data changes. Snapshot preserved.'); return; }
  next.lastSyncedAt = new Date().toISOString();
  const files = [...images.progression, ...images.mechanics].filter((item) => item.buffer);
  mkdirSync(path.join(root, 'public', 'assets', 'synced'), { recursive: true });
  for (const item of files) if (!existsSync(imageFile(item.reference))) writeFileSync(imageFile(item.reference), item.buffer, { flag: 'wx' });
  validateSnapshot(next);
  const temporary = `${snapshotPath}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(next, null, 2)}\n`);
  renameSync(temporary, snapshotPath);
  console.log(`Guide updated: ${next.lastSyncedAt}; ${files.length} local images added.`);
}

main().catch((error) => { console.error(`Sync failed; previous snapshot is unchanged: ${error.message}`); process.exitCode = 1; });
