// Produce a readable review copy from the same typed content used by the page.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../data/day-two.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const { dayTwoChapters, dayTwoVideo, videoAt, originalSheet } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const lines = ['# После 45: маршрут до 2200 GS, крафт, арканы и энергия', '', 'Разбор видео TitanTheF от 03.10.2026. Текст проверен 03.10.2026. Неофициальный гайд.', '', `[Исходное видео](${dayTwoVideo}) · [Исходная таблица](${originalSheet})`, '', 'Показанные цены, лимиты, рецепты и названия относятся к версии игры в ролике. Скриншоты открываются на сайте в полном размере.'];
for (const chapter of dayTwoChapters) {
  lines.push('', `## ${chapter.number}. ${chapter.title}`, '', chapter.summary);
  for (const lesson of chapter.lessons) {
    lines.push('', `### ${lesson.title}`, '', `[Момент в видео](${videoAt(lesson.time)})`);
    if (lesson.path) lines.push('', `**Где открыть:** ${lesson.path}`);
    for (const paragraph of lesson.paragraphs) lines.push('', paragraph);
    if (lesson.steps) lines.push('', ...lesson.steps.map((step, i) => `${i + 1}. ${step}`));
    if (lesson.table) lines.push('', `| ${lesson.table.headers.join(' | ')} |`, `| ${lesson.table.headers.map(() => '---').join(' | ')} |`, ...lesson.table.rows.map(row => `| ${row.join(' | ')} |`));
    if (lesson.note) lines.push('', `**${lesson.note.title}.** ${lesson.note.text}`);
    if (lesson.source) lines.push('', `[${lesson.source.label}](${lesson.source.url})`);
    for (const image of lesson.shots || []) lines.push('', `![${image.caption}](../public${image.file})`, '', image.caption);
  }
}
mkdirSync(new URL('../docs/', import.meta.url), { recursive: true });
writeFileSync(new URL('../docs/day-two-guide.md', import.meta.url), `${lines.join('\n')}\n`);
console.log(`Guide review copy exported: ${dayTwoChapters.length} chapters.`);
