import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const snapshotPath = path.join(root, 'data', 'guide.snapshot.json');
export const sourceUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0C3iKFteGvIbgqNDnQq7bmwIaU23DvjbPa0HPSVAdOOiCeBkEq69Cn8jVMJhToJcztCRylYeTYfOk/pubhtml';
const routeIds = ['feathers', 'amulet', 'acts23', 'act4', 'rush45'];
const afterIds = ['shugo', 'map', 'altar', 'nightmare', 'arcana', 'dungeons'];
const icons = ['Hammer', 'Target', 'Crown', 'Gem', 'Sparkles'];

function fail(message) { throw new Error(`Invalid guide snapshot: ${message}`); }
function object(value, label) { if (!value || typeof value !== 'object' || Array.isArray(value)) fail(label); return value; }
function string(value, label, max = 500) {
  if (typeof value !== 'string' || !value.trim() || value.length > max || /[<>\u0000-\u0008]/.test(value)) fail(label);
  return value;
}
function list(value, label, size) { if (!Array.isArray(value) || value.length !== size) fail(label); return value; }
function localImage(value, label) {
  string(value, label, 160);
  if (!/^\/assets\/[a-z0-9/-]+\.(png|jpg|webp)$/.test(value)) fail(label);
  const file = path.join(root, 'public', value.slice(1));
  let info;
  try { info = statSync(file); } catch { fail(`${label}: missing ${value}`); }
  if (!info.isFile() || info.size < 100 || info.size > 5 * 1024 * 1024) fail(`${label}: invalid file size`);
}
function buildUrl(value, label) {
  string(value, label, 250);
  const url = new URL(value);
  if (url.origin !== 'https://aion2t.com' || url.pathname !== '/ru/simulator' || !/^[0-9]+$/.test(url.searchParams.get('job') || '') || !/^[A-Za-z0-9]+$/.test(url.searchParams.get('b') || '')) fail(label);
}

export function validateSnapshot(snapshot) {
  object(snapshot, 'root');
  if (snapshot.schemaVersion !== 1 || snapshot.sourceUrl !== sourceUrl) fail('schema/source');
  if (snapshot.lastSyncedAt !== null && (typeof snapshot.lastSyncedAt !== 'string' || Number.isNaN(Date.parse(snapshot.lastSyncedAt)))) fail('lastSyncedAt');
  list(snapshot.routeSteps, 'routeSteps', routeIds.length).forEach((entry, i) => {
    object(entry, `routeSteps[${i}]`);
    if (entry.id !== routeIds[i]) fail(`routeSteps[${i}].id`);
    for (const field of ['range', 'title', 'short']) string(entry[field], `routeSteps[${i}].${field}`);
    if (!Array.isArray(entry.details) || entry.details.length < 2 || entry.details.length > 6) fail(`routeSteps[${i}].details`);
    entry.details.forEach((value, j) => string(value, `routeSteps[${i}].details[${j}]`));
    if (entry.image !== undefined) localImage(entry.image, `routeSteps[${i}].image`);
  });
  list(snapshot.after45, 'after45', afterIds.length).forEach((entry, i) => {
    object(entry, `after45[${i}]`);
    if (entry.id !== afterIds[i]) fail(`after45[${i}].id`);
    string(entry.title, `after45[${i}].title`);
    string(entry.text, `after45[${i}].text`);
  });
  object(snapshot.classData, 'classData');
  for (const [key, count, name] of [['ranger', 10, 'Лучник'], ['assassin', 10, 'Ассасин'], ['chanter', 14, 'Чантер']]) {
    const entry = object(snapshot.classData[key], `classData.${key}`);
    if (entry.name !== name) fail(`classData.${key}.name`);
    for (const field of ['role', 'summary', 'stones']) string(entry[field], `classData.${key}.${field}`);
    buildUrl(entry.startBuild, `classData.${key}.startBuild`);
    buildUrl(entry.skillBuild, `classData.${key}.skillBuild`);
    list(entry.files, `classData.${key}.files`, count).forEach((value, i) => localImage(value, `classData.${key}.files[${i}]`));
  }
  list(snapshot.farmTiers, 'farmTiers', 3).forEach((entry, i) => {
    if (entry.tier !== ['S', 'A', 'B'][i] || entry.color !== ['bg-[#ff6b6b]', 'bg-[#ffad66]', 'bg-[#f6cf65]'][i]) fail(`farmTiers[${i}]`);
    list(entry.items, `farmTiers[${i}].items`, [3, 1, 3][i]).forEach((value, j) => string(value, `farmTiers[${i}].items[${j}]`));
  });
  list(snapshot.mechanics, 'mechanics', 5).forEach((entry, i) => {
    object(entry, `mechanics[${i}]`);
    if (entry.icon !== icons[i]) fail(`mechanics[${i}].icon`);
    string(entry.title, `mechanics[${i}].title`);
    string(entry.text, `mechanics[${i}].text`);
    localImage(entry.image, `mechanics[${i}].image`);
  });
  list(object(snapshot.galleries, 'galleries').progression, 'galleries.progression', 16).forEach((value, i) => localImage(value, `galleries.progression[${i}]`));
  if (snapshot.sourceImageUrls !== undefined) {
    const sources = object(snapshot.sourceImageUrls, 'sourceImageUrls');
    for (const [key, count] of [['progression', 16], ['mechanics', 5]]) {
      list(sources[key], `sourceImageUrls.${key}`, count).forEach((url, i) => {
        if (typeof url !== 'string' || url.length > 600 || !url.startsWith('https://docs.google.com/sheets-images-rt/')) fail(`sourceImageUrls.${key}[${i}]`);
      });
    }
  }
  return snapshot;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  validateSnapshot(JSON.parse(readFileSync(snapshotPath, 'utf8')));
  console.log('Guide snapshot valid.');
}
