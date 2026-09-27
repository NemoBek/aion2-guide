"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, BookOpen, Check, ChevronRight, CircleAlert, CircleDot, Compass, Crown, Gem, Hammer, Keyboard, Map, Menu, MousePointer2, Route, Swords, Target, Timer, WandSparkles, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { guide, assetPath } from "@/data/guide";

type GuideModelContext = { registerTool: (tool: { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => unknown }, options?: { signal?: AbortSignal }) => void | Promise<void> };

const { routeSteps, after45, classData, farmTiers, crafting, tierLists, mechanics } = guide;
const allTaskIds = [...routeSteps.map((item) => item.id), ...after45.map((item) => item.id)];

const navItems = [["start", "Старт", Compass], ["route", "1–45", Route], ["endgame", "После 45", Crown], ["farm", "Фарм", Gem], ["crafting", "Крафт", Hammer], ["tiers", "Тир-листы", Target], ["mechanics", "Механики", Hammer], ["macros", "Макросы", Keyboard], ["classes", "Классы", Swords]] as const;

const macroClasses = [
  ["Assassin", "Ассасин"], ["Cleric", "Клирик"], ["Sorcerer", "Волшебник"], ["Templar", "Страж"],
  ["Chanter", "Чантер"], ["Gladiator", "Гладиатор"], ["Spiritmaster", "Заклинатель"], ["Ranger", "Лучник"],
] as const;

function MacroGuide() {
  const steps = [
    { number: "01", title: "Назначь клавишу макроса", text: "Esc → Настройки → Управление → Общее → Игровой процесс. Найди «Макрос» и назначь удобную клавишу." },
    { number: "02", title: "Собери основную панель", text: "Поставь часто используемые боевые навыки на одну клавишу панели — например, Q. Умения должны быть доступны в этой ячейке." },
    { number: "03", title: "Создай макрос в игре", text: "Открой «Макрос» в правом верхнем углу → «Добавить макрос». Нажми на ячейку макроса и выбери клавишу панели Q, а не отдельное умение." },
    { number: "04", title: "Используй две кнопки", text: "Удерживай кнопку макроса вместе с ЛКМ. Так базовая атака вплетается в ротацию и помогает прерывать анимации навыков." },
  ];

  return <section id="macros" className="scroll-mt-20 border-b border-white/8 px-4 py-14 sm:px-8 xl:px-14">
    <SectionTitle eyebrow="Ротация навыков" title="Макросы: настрой один раз — нажимай проще" text="Пошаговая настройка встроенного макроса и понятная схема нажатий из видео Grobs. Внешние программы для мыши не нужны." />
    <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-2xl border border-cyan-200/20 bg-[linear-gradient(145deg,rgba(45,116,135,.18),rgba(18,34,47,.82)_58%,rgba(161,129,73,.10))] p-5 sm:p-7">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl border border-cyan-100/15 bg-cyan-100/10 text-cyan-100"><MousePointer2 className="size-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-cyan-100/70">Боевая связка</p><h3 className="mt-1 text-xl font-semibold text-white">Удерживай обе кнопки</h3></div></div>
        <div className="mt-7 flex flex-wrap items-center gap-3" aria-label="Удерживай левую кнопку мыши и кнопку макроса одновременно">
          <div className="grid min-w-28 place-items-center rounded-xl border border-white/15 bg-[#0a1420]/80 px-4 py-3"><MousePointer2 className="mb-1 size-5 text-cyan-200" /><kbd className="font-sans text-sm font-bold text-white">ЛКМ</kbd><span className="mt-1 text-[.68rem] text-slate-400">базовая атака</span></div>
          <span className="text-xl font-light text-slate-500">+</span>
          <div className="grid min-w-28 place-items-center rounded-xl border border-amber-200/20 bg-[#0a1420]/80 px-4 py-3"><Keyboard className="mb-1 size-5 text-amber-200" /><kbd className="font-sans text-sm font-bold text-white">КЛАВИША</kbd><span className="mt-1 text-[.68rem] text-slate-400">встроенный макрос</span></div>
          <p className="basis-full pt-2 text-sm leading-6 text-slate-300">Игра повторяет выбранные навыки, а обычная атака вплетается между ними. Автор советует не добавлять ЛКМ в тот же список макроса: так анимации могут отменяться реже.</p>
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#070d14]">
          <p className="border-b border-white/8 px-3 py-2 text-xs font-semibold text-slate-300">Видеогайд Grobs по макросам</p>
          <div className="relative aspect-video w-full"><iframe className="absolute inset-0 size-full" src="https://www.youtube-nocookie.com/embed/HMod6Z4GrE0?rel=0" title="Руководство по макросам в AION 2 — Grobs" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#101d2a]/80 p-5 sm:p-7">
        <p className="aion-eyebrow">Настройка в игре</p>
        <ol className="mt-5 space-y-4">{steps.map((step) => <li key={step.number} className="flex gap-4"><span className="grid size-9 shrink-0 place-items-center rounded-lg border border-amber-100/15 bg-amber-100/[.06] font-mono text-xs font-bold text-[#ead29b]">{step.number}</span><div><h3 className="font-semibold text-white">{step.title}</h3><p className="mt-1.5 text-sm leading-6 text-slate-400">{step.text}</p></div></li>)}</ol>
      </div>
    </div>
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-amber-200/15 bg-amber-100/[.035] p-5 sm:p-6"><div className="flex items-center gap-2 text-amber-100"><CircleAlert className="size-4" /><h3 className="font-semibold">Как выбирается навык</h3></div><p className="mt-3 text-sm leading-6 text-slate-300">В закреплённом комментарии автор уточнил: игра проверяет навыки снизу списка вверх и использует доступный. Если нижний навык не уходит на перезарядку, он может срабатывать снова и мешать навыкам выше. Это не строгая очередь «раз, два, три».</p></div>
      <div className="rounded-2xl border border-white/10 bg-white/[.025] p-5 sm:p-6"><h3 className="font-semibold text-white">Что оставить вне макроса</h3><p className="mt-3 text-sm leading-6 text-slate-400">На старте добавляй только умения для постоянной ротации. Передвижение и важные баффы оставь на отдельных кнопках, чтобы самому выбирать момент их применения. Позже проверь ротацию ещё раз после открытия специализаций.</p></div>
    </div>
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="aion-eyebrow">Подборки автора</p><h3 className="mt-2 font-display text-2xl text-[#f8f3e8]">Ранние макросы для 8 классов</h3></div><a href="https://www.youtube.com/watch?v=HMod6Z4GrE0&t=453s" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 underline decoration-cyan-200/25 underline-offset-4 hover:text-white">Открыть схемы с 7:33 <ArrowUpRight className="size-4" /></a></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{macroClasses.map(([name, label], index) => <div key={name} className="flex min-h-[72px] items-center gap-3 rounded-xl border border-white/10 bg-[#111e2a]/80 p-3 sm:p-4"><span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[.04] font-mono text-xs text-slate-300">0{index + 1}</span><span><span className="block text-[.65rem] font-semibold uppercase tracking-[.12em] text-slate-500">{name}</span><span className="mt-0.5 block font-semibold text-slate-100">{label}</span></span></div>)}</div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#070d14]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3 sm:px-5"><p className="text-sm font-semibold text-slate-200">Схемы макросов Grobs для всех классов</p><span className="text-xs text-slate-500">Источник: видео автора, 7:33</span></div>
        <a href="https://www.youtube.com/watch?v=HMod6Z4GrE0&t=453s" target="_blank" rel="noopener noreferrer" className="group block bg-[#070d14]" aria-label="Открыть видео Grobs с настройками макросов для всех классов на отметке 7 минут 33 секунды"><Image src={assetPath("/assets/macros/grobs-early-class-macros.png")} alt="Схемы ранних макросов Grobs для ассасина, клирика, волшебника, стража, чантера, гладиатора, заклинателя и лучника" width={863} height={487} unoptimized className="mx-auto h-auto w-full transition group-hover:brightness-110" loading="lazy" /></a>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">Названия классов переведены для удобства; конкретные значки навыков и порядок автора показаны в ролике. Назначения клавиш в видео личные — их можно выбрать под себя.</p>
    </div>
  </section>;
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="aion-section-title mb-7 max-w-3xl"><p className="aion-eyebrow mb-3">{eyebrow}</p><h2 className="font-display text-3xl font-medium leading-tight text-[#f8f3e8] sm:text-[2.65rem]">{title}</h2>{text ? <p className="mt-4 text-[1rem] leading-7 text-slate-300/80">{text}</p> : null}</div>;
}

function ImageStrip({ files, alt }: { files: string[]; alt: string }) {
  return <div className="gallery-scroll -mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-3">{files.map((src, index) => <a key={src} href={assetPath(src)} target="_blank" rel="noreferrer" className="aion-gallery-item group relative min-w-[220px] snap-start overflow-hidden rounded-xl border border-white/10 bg-[#0b101b] sm:min-w-[260px]"><img src={assetPath(src)} alt={`${alt}: изображение ${index + 1}`} className="h-[300px] w-full object-contain p-2 transition duration-300 group-hover:scale-[1.02]" loading="lazy" /><span className="absolute right-2 top-2 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 text-xs text-white/80">Открыть</span></a>)}</div>;
}

export default function Home() {
  const [done, setDone] = useState<string[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = JSON.parse(window.localStorage.getItem("aion2-guide-progress") || "[]");
        if (Array.isArray(saved)) setDone(saved.filter((id): id is string => typeof id === "string" && allTaskIds.includes(id)));
      } catch { /* Ignore damaged local progress. */ }
    });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    const context = (document as Document & { modelContext?: GuideModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "set_guide_progress",
      title: "Обновить прогресс гайда",
      description: "Отмечает выполненные этапы маршрута Aion 2 и обновляет видимый прогресс на странице.",
      inputSchema: { type: "object", properties: { completedIds: { type: "array", items: { type: "string", enum: allTaskIds }, uniqueItems: true } }, required: ["completedIds"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        if (!input || typeof input !== "object" || !Array.isArray((input as { completedIds?: unknown }).completedIds)) throw new Error("completedIds must be an array");
        const completedIds = (input as { completedIds: unknown[] }).completedIds;
        if (!completedIds.every((id): id is string => typeof id === "string" && allTaskIds.includes(id))) throw new Error("Unknown guide step");
        const next = Array.from(new Set(completedIds));
        setDone(next);
        window.localStorage.setItem("aion2-guide-progress", JSON.stringify(next));
        return { completedIds: next, completedCount: next.length, total: allTaskIds.length };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
  const completedCount = done.filter((id) => allTaskIds.includes(id)).length;
  const progress = Math.round((completedCount / allTaskIds.length) * 100);
  function toggleDone(id: string, checked: boolean) { setDone((current) => { const next = checked ? Array.from(new Set([...current, id])) : current.filter((item) => item !== id); window.localStorage.setItem("aion2-guide-progress", JSON.stringify(next)); return next; }); }
  function goTo(id: string) { setMobileMenu(false); requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })); }

  return <main className="aion-page min-h-screen overflow-x-clip text-slate-100 selection:bg-cyan-400/25">
    <header className="aion-header sticky top-0 z-50 backdrop-blur-xl"><div className="mx-auto flex h-[4.5rem] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
      <button onClick={() => goTo("start")} className="flex items-center gap-3 text-left" aria-label="К началу гайда"><span className="aion-brand-mark grid size-10 place-items-center text-[#e4d2a8]"><Compass className="size-5" /></span><span><span className="block font-display text-[1.28rem] font-medium tracking-[0.08em] text-[#faf4e8]">AION 2</span><span className="block text-[0.64rem] uppercase tracking-[0.2em] text-[#a9bac6]">Путь новичка</span></span></button>
      <div className="hidden items-center gap-3 sm:flex"><span className="text-sm text-slate-300/75">Прогресс</span><Progress value={progress} className="h-1.5 w-28 bg-white/10 [&_[data-slot=progress-indicator]]:bg-[#d9bf89]" /><span className="w-9 text-sm font-semibold text-[#e6d2a3]">{progress}%</span></div>
      <button onClick={() => setMobileMenu((value) => !value)} className="aion-menu-button grid size-10 place-items-center lg:hidden" aria-label="Меню">{mobileMenu ? <X className="size-5" /> : <Menu className="size-5" />}</button>
    </div>{mobileMenu ? <nav className="aion-mobile-nav p-3 lg:hidden"><div className="grid grid-cols-2 gap-2">{navItems.map(([id, label, Icon]) => <button key={id} onClick={() => goTo(id)} className="aion-nav-item flex items-center gap-2 px-3 py-3 text-left text-sm text-slate-200"><Icon className="size-4 text-[#d9bf89]" /> {label}</button>)}</div></nav> : null}</header>

    <div className="relative z-10 mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="aion-sidebar sticky top-[4.5rem] hidden h-[calc(100vh-4.5rem)] px-5 py-8 lg:block"><p className="aion-eyebrow mb-5 px-3">Навигация</p><nav className="space-y-1">{navItems.map(([id, label, Icon]) => <button key={id} onClick={() => goTo(id)} className="aion-side-link group flex w-full items-center gap-3 px-3 py-3 text-left text-[0.93rem] text-slate-300/75 transition hover:text-white"><Icon className="size-4 text-[#a7b9bf] transition group-hover:text-[#e0c386]" /> {label}</button>)}</nav><div className="aion-aside-note mt-9 p-4"><p className="font-display text-lg text-[#ecd6aa]">Главное правило</p><p className="mt-2 text-sm leading-6 text-slate-300/75">До 45 уровня не пытайся закрыть всю карту. Сначала сюжет, затем исследование.</p></div></aside>
      <div className="min-w-0">
        <section id="start" className="aion-hero relative scroll-mt-24 overflow-hidden px-4 py-12 sm:px-8 sm:py-16 xl:px-14 xl:py-20"><div className="aion-hero-art" style={{ backgroundImage: `url(${assetPath("/assets/aion-sky-hero.webp")})` }} aria-hidden="true" /><div className="aion-hero-content relative z-10 max-w-[640px]"><p className="aion-eyebrow mb-5">Путеводитель по миру Aion 2</p><h1 className="font-display max-w-3xl text-[2.75rem] font-medium leading-[1.08] text-[#fff8e8] sm:text-[3.75rem] xl:text-[4.5rem]">Твой путь в Aion 2 начинается здесь</h1><p className="mt-6 max-w-[580px] text-[1rem] leading-7 text-[#d6e1e4] sm:text-[1.08rem] sm:leading-8">Понятный маршрут через первые уровни, спокойный старт после 45, фарм, механики и материалы по трём классам. Выбирай следующий шаг и отмечай пройденное.</p><div className="mt-8 flex flex-wrap gap-3"><button onClick={() => goTo("route")} className="aion-button-primary px-6 py-3 text-sm font-bold">Начать маршрут 1–45 <ChevronRight className="ml-2 inline size-4" /></button><button onClick={() => goTo("classes")} className="aion-button-secondary px-6 py-3 text-sm font-semibold">Выбрать класс</button></div><div className="aion-hero-progress mt-12 max-w-[500px] p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="aion-eyebrow">Твой маршрут</p><p className="mt-2 text-xl font-semibold text-[#faf3e4]">{completedCount} из {allTaskIds.length} этапов</p></div><div className="aion-progress-icon grid size-11 place-items-center"><Route className="size-5" /></div></div><Progress value={progress} className="mt-4 h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-[#b7e0e7] [&_[data-slot=progress-indicator]]:to-[#dfc68e]" /><p className="mt-3 text-sm text-[#bbcccf]">Прогресс сохранится на этом устройстве</p></div></div>
        </section>

        <section id="route" className="scroll-mt-20 border-b border-white/8 px-4 py-14 sm:px-8 xl:px-14"><SectionTitle eyebrow="Маршрут" title="Прокачка с 1 до 45 уровня" text="Открой шаг, выполни его и отметь галочкой. Прогресс сохранится на этом устройстве." /><div className="space-y-3">{routeSteps.map((step, index) => { const checked = done.includes(step.id); return <div key={step.id} className={`rounded-2xl border transition ${checked ? "border-cyan-300/25 bg-cyan-300/[0.045]" : "border-white/9 bg-white/[0.025]"}`}><div className="grid gap-4 p-4 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center sm:p-5"><div className={`grid size-11 place-items-center rounded-xl text-sm font-bold ${checked ? "bg-cyan-300 text-[#061017]" : "bg-white/7 text-slate-300"}`}>{checked ? <Check className="size-5" /> : String(index + 1).padStart(2, "0")}</div><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300/80">{step.range}</p><h3 className="mt-1 text-lg font-semibold text-white">{step.title}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{step.short}</p></div><label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400 sm:pl-3"><Checkbox checked={checked} onCheckedChange={(value) => toggleDone(step.id, value === true)} className="size-5 border-white/20 data-[state=checked]:border-cyan-300 data-[state=checked]:bg-cyan-300 data-[state=checked]:text-[#061017]" />Выполнено</label></div><Accordion type="single" collapsible><AccordionItem value="details" className="border-t border-white/7 px-4 sm:px-5"><AccordionTrigger className="py-3 text-sm text-slate-300 hover:no-underline">Подробности шага</AccordionTrigger><AccordionContent><div className={`grid gap-5 pb-2 ${step.image ? "lg:grid-cols-[minmax(0,1fr)_340px]" : ""}`}><ul className="space-y-3">{step.details.map((detail) => <li key={detail} className="flex gap-3 text-[0.96rem] leading-6 text-slate-400"><CircleDot className="mt-1.5 size-3.5 shrink-0 text-cyan-300" />{detail}</li>)}</ul>{step.image ? <a href={assetPath(step.image)} target="_blank" rel="noreferrer" className="overflow-hidden rounded-xl border border-white/10 bg-black/20"><img src={assetPath(step.image)} alt={step.title} className="h-52 w-full object-contain" loading="lazy" /></a> : null}</div></AccordionContent></AccordionItem></Accordion></div>; })}</div><Accordion type="single" collapsible className="mt-6 rounded-2xl border border-white/9 bg-[#080c15] px-5"><AccordionItem value="maps"><AccordionTrigger className="text-base text-white hover:no-underline"><span className="flex items-center gap-3"><Map className="size-5 text-cyan-300" /> Карты и скриншоты из исходника</span></AccordionTrigger><AccordionContent><ImageStrip files={guide.galleries.progression} alt="Маршрут 1–45" /></AccordionContent></AccordionItem></Accordion></section>

        <section id="endgame" className="scroll-mt-20 border-b border-white/8 px-4 py-14 sm:px-8 xl:px-14"><SectionTitle eyebrow="После сюжета" title="Первые цели после 45" text="Исходный гайд предлагает хардкорный фарм. Здесь он превращён в нормальный список: сначала обязательное, затем то, на что хватает времени и энергии." /><Tabs defaultValue="balanced" className="gap-5"><TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl border border-white/9 bg-white/[0.035] p-1 sm:w-fit"><TabsTrigger value="balanced" className="px-4 py-2.5 data-[state=active]:bg-cyan-300 data-[state=active]:text-[#061017]">Сбалансированный путь</TabsTrigger><TabsTrigger value="economic" className="px-4 py-2.5 data-[state=active]:bg-amber-300 data-[state=active]:text-[#160f03]">Экономический путь</TabsTrigger></TabsList><TabsContent value="balanced"><div className="grid gap-3 md:grid-cols-2">{after45.map((item, index) => { const checked = done.includes(item.id); return <div key={item.id} className={`rounded-2xl border p-5 ${checked ? "border-cyan-300/25 bg-cyan-300/[0.04]" : "border-white/9 bg-white/[0.025]"}`}><div className="flex items-start gap-4"><Checkbox checked={checked} onCheckedChange={(value) => toggleDone(item.id, value === true)} className="mt-0.5 size-5 border-white/20 data-[state=checked]:border-cyan-300 data-[state=checked]:bg-cyan-300 data-[state=checked]:text-[#061017]" /><div><p className="text-xs font-bold text-cyan-300">0{index + 1}</p><h3 className="mt-1 font-semibold text-white">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p></div></div></div>; })}</div></TabsContent><TabsContent value="economic"><div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.035] p-5 sm:p-7"><div className="grid gap-6 lg:grid-cols-[1fr_320px]"><div><h3 className="text-xl font-semibold text-amber-100">Сбор и крафт вместо гонки за GS</h3><ul className="mt-4 space-y-3 text-[0.96rem] leading-6 text-slate-400"><li>• Приоритет: одилия и дерево. Дополнительно — сапфиры, рубины и алмазы.</li><li>• Качай сбор и производство расходников, затем профессию под основное оружие.</li><li>• Синие и зелёные предметы, лишние расходники и кожу можно продавать, но рынок на старте нестабилен.</li><li>• Этот путь требует много времени и понимания аукциона. Для обычной игры он необязателен.</li></ul></div><div className="rounded-xl border border-amber-300/12 bg-black/20 p-5"><Timer className="size-6 text-amber-300" /><p className="mt-3 font-semibold text-white">Важно</p><p className="mt-2 text-sm leading-6 text-slate-400">В исходнике речь идёт о 10 часах сбора в день. Это отдельная стратегия, а не обязательная норма.</p></div></div></div></TabsContent></Tabs></section>

        <section id="farm" className="scroll-mt-20 border-b border-white/8 px-4 py-14 sm:px-8 xl:px-14"><SectionTitle eyebrow="Первые 1–5 дней" title="Что действительно фармить" text="Тир основан на исходной таблице. Он описывает раннюю экономику, поэтому позже приоритеты могут измениться." /><div className="overflow-hidden rounded-2xl border border-white/9">{farmTiers.map((group) => <div key={group.tier} className="grid border-b border-white/8 last:border-b-0 sm:grid-cols-[88px_1fr]"><div className={`${group.color} grid min-h-20 place-items-center text-2xl font-black text-[#1b1212]`}>{group.tier}</div><div className="bg-white/[0.025] p-5"><ul className="space-y-2.5">{group.items.map((item) => <li key={item} className="flex gap-3 text-[0.96rem] leading-6 text-slate-300"><ChevronRight className="mt-1 size-4 shrink-0 text-slate-600" />{item}</li>)}</ul></div></div>)}</div><div className="mt-5 rounded-xl border border-cyan-300/12 bg-cyan-300/[0.035] px-5 py-4 text-sm leading-6 text-slate-400"><strong className="text-cyan-100">Для спокойного старта:</strong> шуго, ежедневный Nightmare, доступные подземелья и умеренный сбор ресурсов дадут больше пользы, чем бесконечный гринд твинков.</div></section>

        <section id="crafting" className="scroll-mt-20 border-b border-white/8 px-4 py-14 sm:px-8 xl:px-14">
          <SectionTitle eyebrow="Сбор и производство" title="Как начать крафт" text="Короткий маршрут из вкладки автора о сборе и ремёслах. Выбирай предмет, затем собирай материалы под него." />
          <div className="grid gap-3 md:grid-cols-2">{crafting.steps.map((step, index) => <div key={step.title} className="rounded-2xl border border-white/9 bg-white/[0.025] p-5"><p className="text-xs font-bold text-cyan-300">0{index + 1}</p><h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{step.text}</p></div>)}</div>
          <div className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/[0.035] p-5 text-sm leading-6 text-slate-300"><ul className="space-y-2">{crafting.notes.map((note) => <li key={note}>• {note}</li>)}</ul></div>
          <a href={`${guide.sourceUrl}?gid=683322434`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">Скриншоты и полный маршрут в таблице <ArrowUpRight className="size-4" /></a>
        </section>

        <section id="tiers" className="scroll-mt-20 border-b border-white/8 px-4 py-14 sm:px-8 xl:px-14">
          <SectionTitle eyebrow="Оценка автора таблицы" title="Тир-листы классов" text="Сравнения по комфорту и разным режимам игры. Расстановка отражает мнение автора и может меняться с балансом." />
          <div className="grid gap-4 md:grid-cols-2">{tierLists.map((item) => <div key={item.title} className="min-w-0 rounded-2xl border border-white/9 bg-white/[0.025] p-5"><h3 className="mb-4 text-lg font-semibold text-white">{item.title}</h3><div className="space-y-2">{item.images.map((src) => <a key={src} href={assetPath(src)} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-white/10 bg-[#161616]"><img src={assetPath(src)} alt={item.title} className="h-auto max-w-full" loading="lazy" /></a>)}</div></div>)}</div>
          <p className="mt-5 rounded-xl border border-cyan-300/12 bg-cyan-300/[0.035] px-5 py-4 text-sm leading-6 text-slate-300">Список группы при низком GS рассчитан на первые трансценденсы. По словам автора, по мере роста экипировки такие рейтинги теряют актуальность.</p>
          <a href="https://www.youtube.com/watch?v=Q8cl1ld7uY8&t=1170s" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">Пояснение автора в видео <ArrowUpRight className="size-4" /></a>
          <a href={`${guide.sourceUrl}?gid=1644866515`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">Открыть тир-листы в таблице <ArrowUpRight className="size-4" /></a>
        </section>

        <section id="mechanics" className="scroll-mt-20 border-b border-white/8 px-4 py-14 sm:px-8 xl:px-14"><SectionTitle eyebrow="Система развития" title="Пять механик, которые нельзя пропустить" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{mechanics.map((item) => <a key={item.title} href={assetPath(item.image)} target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/9 bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/[0.04]"><div className="grid size-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200"><item.icon className="size-5" /></div><h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p><span className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-300">Открыть исходную схему <ArrowUpRight className="size-3.5" /></span></a>)}</div></section>

        <MacroGuide />

        <section id="classes" className="scroll-mt-20 border-b border-white/8 px-4 py-14 sm:px-8 xl:px-14"><SectionTitle eyebrow="Готовые материалы" title="Выбор класса" text="В таблице подробно разобраны три класса. Открой вкладку класса, чтобы посмотреть его роль, билды и схемы." /><Tabs defaultValue="chanter" className="gap-5"><TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl border border-white/9 bg-white/[0.035] p-1 sm:w-fit"><TabsTrigger value="chanter" className="px-4 py-2.5 data-[state=active]:bg-amber-300 data-[state=active]:text-[#160f03]"><WandSparkles /> Чантер</TabsTrigger><TabsTrigger value="ranger" className="px-4 py-2.5 data-[state=active]:bg-cyan-300 data-[state=active]:text-[#061017]"><Target /> Лучник</TabsTrigger><TabsTrigger value="assassin" className="px-4 py-2.5 data-[state=active]:bg-rose-300 data-[state=active]:text-[#18070b]"><Swords /> Ассасин</TabsTrigger></TabsList>{Object.entries(classData).map(([key, item]) => <TabsContent key={key} value={key}><div className="rounded-2xl border border-white/9 bg-white/[0.025] p-5 sm:p-7"><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"><div><p className="text-sm font-semibold text-cyan-300">{item.role}</p><h3 className="mt-1 text-3xl font-semibold tracking-tight text-white">{item.name}</h3><p className="mt-3 max-w-2xl leading-7 text-slate-400">{item.summary}</p><p className="mt-4 rounded-xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-slate-300">{item.stones}</p></div><div className="grid gap-3"><a href={item.startBuild} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-300/30"><span><span className="block text-xs font-normal text-slate-500">Прокачка 1–45</span>Стартовый билд</span><ArrowUpRight className="size-4 text-cyan-300" /></a><a href={item.skillBuild} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-300/30"><span><span className="block text-xs font-normal text-slate-500">После 45</span>Прокачка навыков</span><ArrowUpRight className="size-4 text-cyan-300" /></a></div></div><div className="mt-7 border-t border-white/8 pt-6"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold text-white">Ноды и панели из исходника</p><p className="text-xs text-slate-600">Нажми на изображение</p></div><ImageStrip files={item.files} alt={item.name} /></div></div></TabsContent>)}</Tabs></section>

        <footer className="px-4 py-10 sm:px-8 xl:px-14">
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-white/8 bg-white/[0.025] p-5 sm:flex-row sm:items-start">
            <div>
              <p className="flex items-center gap-2 font-semibold text-white"><BookOpen className="size-4 text-cyan-300" /> О материале</p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Неофициальная интерактивная версия таблицы TitanTheF. Баланс, цены и механики после обновлений могут меняться.</p>
              <p className="mt-3 text-sm font-semibold text-[#ead5a5]">Автор исходной таблицы — TitanTheF</p>
              <nav aria-label="Каналы автора" className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <a href="https://discord.com/invite/m5UNHgK6P8" target="_blank" rel="noopener noreferrer" className="text-cyan-200 underline decoration-white/25 underline-offset-4 hover:text-white">Discord</a>
                <a href="https://t.me/titanforeve" target="_blank" rel="noopener noreferrer" className="text-cyan-200 underline decoration-white/25 underline-offset-4 hover:text-white">Telegram</a>
                <a href="https://www.twitch.tv/titanthef" target="_blank" rel="noopener noreferrer" className="text-cyan-200 underline decoration-white/25 underline-offset-4 hover:text-white">Twitch</a>
                <a href="https://www.youtube.com/@TitanTheF" target="_blank" rel="noopener noreferrer" className="text-cyan-200 underline decoration-white/25 underline-offset-4 hover:text-white">YouTube</a>
              </nav>
              <p className="mt-4 text-xs text-slate-500">Данные обновлены: {guide.lastSyncedAt ? guide.lastSyncedAt.slice(0, 10).split("-").reverse().join(".") : "ещё не обновлялись"}</p>
            </div>
            <a href={guide.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-2 text-sm font-semibold text-cyan-300">Открыть оригинальную таблицу <ArrowUpRight className="size-4" /></a>
          </div>
        </footer>
      </div>
    </div>
  </main>;
}
