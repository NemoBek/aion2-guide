"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, BookOpen, ChevronRight, Expand, Play, X, ZoomIn, ZoomOut } from "lucide-react";
import { assetPath } from "@/data/guide";
import { dayTwoChapters, dayTwoVideo, originalSheet, videoAt, type GuideShot } from "@/data/day-two";

const screenshotCount = dayTwoChapters.reduce((total, chapter) => total + chapter.lessons.reduce((sum, lesson) => sum + (lesson.shots?.length || 0), 0), 0);
function timestamp(seconds: number) { return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`; }

export default function DayTwoGuide() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<GuideShot | null>(null);
  const [zoomed, setZoomed] = useState(false);

  function openShot(image: GuideShot) {
    setSelected(image);
    setZoomed(false);
    dialog.current?.showModal();
  }

  return <div className="aion-page day-guide">
    <header className="aion-header day-header">
      <a href={assetPath("/")} className="day-brand"><BookOpen size={20} /><span>AION <b>2</b> <small>ГАЙД</small></span></a>
      <a href={assetPath("/#endgame")} className="day-back"><ArrowLeft size={16} /> Главный гайд</a>
    </header>
    <main>
      <section className="day-hero">
        <div className="day-kicker">ПОСЛЕ 45 УРОВНЯ <span>РАЗБОР ВИДЕО · 03.10.2026</span></div>
        <h1 className="font-display">После 45 уровня —<br /><em>до 2200 GS.</em></h1>
        <p className="day-lead">От первых золотых предметов до 2200 GS. Где взять ресурсы, как читать рецепт и что именно автор показывает на экране.</p>
        <div className="day-hero-actions">
          <a href="#finish-story" className="aion-button-primary">Начать после 45 <ChevronRight size={18} /></a>
          <a href={dayTwoVideo} target="_blank" rel="noreferrer" className="aion-button-secondary"><Play size={17} /> Видео TitanTheF <ArrowUpRight size={15} /></a>
        </div>
        <div className="day-facts"><span><b>6</b> разделов</span><span><b>{screenshotCount}</b> скриншотов из ролика</span><span><b>33:28</b> исходное видео</span></div>
      </section>
      <div className="day-route-picker">
        <span>Уже знаешь свой GS? Перейди к порогу</span>
        <nav aria-label="Пороги GS">{[1400, 1600, 1900, 2100].map(gs => <a key={gs} href={`#gs${gs}`}>{gs}<ChevronRight size={13} /></a>)}<a href="#gs2100">2200<ChevronRight size={13} /></a></nav>
      </div>
      <div className="day-layout">
        <aside className="day-contents">
          <p className="day-kicker">В ЭТОМ ГАЙДЕ</p>
          <nav aria-label="Оглавление гайда">{dayTwoChapters.map(chapter => <a href={`#${chapter.id}`} key={chapter.id}><span>{chapter.number}</span>{chapter.title}</a>)}</nav>
          <div className="day-reading-note"><Expand size={17} /><p>Нажми на скриншот, чтобы рассмотреть названия и цифры. У каждого шага есть ссылка на нужный момент видео.</p></div>
        </aside>
        <div className="day-article">
          <div className="day-editor-note"><strong>Как пользоваться</strong><p>Иди по своему доступному порогу. Примеры крафта и билд относятся к персонажу автора; цены, лимиты и рецепты сверяй в своём клиенте. Оговорки и неподтверждённые расчёты разобраны рядом с соответствующим шагом.</p></div>
          {dayTwoChapters.map(chapter => <section id={chapter.id} className="day-chapter" key={chapter.id}>
            <div className="day-chapter-heading"><span>{chapter.number}</span><div><h2 className="font-display">{chapter.title}</h2><p>{chapter.summary}</p></div></div>
            {chapter.lessons.map(lesson => <article id={lesson.id} key={lesson.id} className="day-lesson">
              <div className="day-lesson-title"><h3>{lesson.title}</h3><a href={videoAt(lesson.time)} target="_blank" rel="noreferrer" aria-label={`Смотреть «${lesson.title}» с ${timestamp(lesson.time)}`}><Play size={13} />{timestamp(lesson.time)}<ArrowUpRight size={13} /></a></div>
              {lesson.path && <div className="day-menu-path"><span>ГДЕ ОТКРЫТЬ</span>{lesson.path}</div>}
              {lesson.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
              {lesson.steps && <ol className="day-steps">{lesson.steps.map((step, i) => <li key={i}><span>{i + 1}</span><p>{step}</p></li>)}</ol>}
              {lesson.table && <div className="day-table-scroll" role="region" aria-label={`Таблица: ${lesson.title}`} tabIndex={0}><table><thead><tr>{lesson.table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{lesson.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
              {lesson.note && <aside className="day-callout"><strong>{lesson.note.title}</strong><p>{lesson.note.text}</p></aside>}
              {lesson.source && <a className="day-source-link" href={lesson.source.url} target="_blank" rel="noreferrer">{lesson.source.label}<ArrowUpRight size={15} /></a>}
              {lesson.shots && <div className="day-figures">{lesson.shots.map((image, i) => <figure key={image.file} className={image.height > image.width ? "day-figure day-figure-portrait" : "day-figure"}>
                <button type="button" className="day-image-button" onClick={() => openShot(image)} aria-label={`Увеличить скриншот: ${image.caption}`}>
                  <Image src={assetPath(image.file)} alt={image.caption} width={image.width} height={image.height} sizes="(max-width: 900px) 100vw, 850px" />
                  <span className="day-expand"><Expand size={15} />Увеличить</span>
                </button>
                <figcaption><span>КАДР {i + 1}</span>{image.caption}</figcaption>
              </figure>)}</div>}
            </article>)}
          </section>)}
          <section className="day-finish"><h2 className="font-display">Что сделать прямо сейчас</h2><ol><li>Найди следующий доступный порог по своему GS.</li><li>Выбери один слабый слот и проверь подходящую гарантированную награду.</li><li>Перед дорогим крафтом проверь рецепт, шанс, привязку и общий бюджет.</li><li>Проверь четыре отдельные квоты энергии и её фактическую стоимость.</li></ol><a href={assetPath("/#endgame")}>Вернуться к чек-листу после 45<ChevronRight size={17} /></a></section>
        </div>
      </div>
    </main>
    <footer className="day-footer"><p>Неофициальная интерактивная версия. Разбор видео TitanTheF от 3 октября 2026. Проверено 03.10.2026.</p><div><a href={originalSheet} target="_blank" rel="noreferrer">Открыть оригинальную таблицу<ArrowUpRight size={14} /></a><a href={dayTwoVideo} target="_blank" rel="noreferrer">Смотреть исходное видео<ArrowUpRight size={14} /></a></div><p>Скриншоты взяты из ролика; названия и цифры относятся к показанной версии игры. Текст разбора редактируется вручную.</p></footer>
    <dialog ref={dialog} className="day-lightbox" aria-labelledby="screenshot-title" onClose={() => { setSelected(null); setZoomed(false); }} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="day-lightbox-header"><h2 id="screenshot-title">Скриншот из видео TitanTheF</h2><div><button type="button" onClick={() => setZoomed(value => !value)} aria-label={zoomed ? "Вписать изображение" : "Показать исходный размер"}>{zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}</button><button type="button" onClick={() => dialog.current?.close()} aria-label="Закрыть скриншот"><X size={22} /></button></div></div>
      {selected && <><div className={`day-lightbox-image ${zoomed ? "is-zoomed" : ""}`}><Image src={assetPath(selected.file)} alt={selected.caption} width={selected.width} height={selected.height} sizes="100vw" /></div><p className="day-lightbox-caption">{selected.caption}</p></>}
    </dialog>
  </div>;
}
