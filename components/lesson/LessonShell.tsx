import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock, Flask, List, ShareNetwork } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { lessonBySlug } from "@/lib/content/lessons";
import type { LessonDocument } from "@/lib/content/schema";
import { VisualLab } from "@/components/labs/VisualLab";

export function LessonShell({ lesson, children }: { lesson: LessonDocument; children: ReactNode }) {
  const previous = lesson.previous ? lessonBySlug.get(lesson.previous) : null;
  const next = lesson.next ? lessonBySlug.get(lesson.next) : null;
  return (
    <div className="lesson-layout">
      <aside className="lesson-rail">
        <div className="rail-label"><List size={15} /> Chapter</div>
        <Link href="/lessons/">All labs</Link>
        <a href="#field-lab" className="active"><Flask size={15} /> Field lab</a>
        <a href="#operational-model">Operational model</a>
        <a href="#mechanism">Mechanism</a>
        <a href="#worked-example">Worked example</a>
        <a href="#failure-modes">Failure modes</a>
        <a href="#implementation">Implementation</a>
        <div className="rail-progress"><span>Reading map</span><div><i style={{ width: "18%" }} /></div><small>Begin with the invariant.</small></div>
      </aside>
      <main id="main-content" className="lesson-main">
        <header className="lesson-hero">
          <div className="breadcrumb"><Link href="/lessons/">Library</Link><span>/</span><span>{lesson.phase}</span></div>
          <div className="lesson-title-row">
            <div><span className="lesson-sequence">{lesson.phase} · visual lab</span><h1>{lesson.title}</h1><p>{lesson.summary}</p></div>
            <div className="lesson-meta"><span><Clock size={15} /> 12–18 min</span><span><BookOpen size={15} /> Advanced</span><span><ShareNetwork size={15} /> {lesson.labs[0].engine}</span></div>
          </div>
          <div className="outcome-strip">{lesson.outcomes.map((outcome) => <span key={outcome}><Check size={14} />{outcome}</span>)}</div>
        </header>
        <div id="field-lab"><VisualLab spec={lesson.labs[0]} /></div>
        {children}
        <section id="sources" className="sources-section">
          <span className="section-kicker">Curated sources</span><h2>Go deeper with primary and canonical material.</h2>
          <div>{lesson.sources.map((source, index) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span>{String(index + 1).padStart(2, "0")}</span><strong>{source.label}</strong><ArrowRight size={15} /></a>)}</div>
        </section>
        <nav className="lesson-pagination" aria-label="Lesson sequence">
          {previous ? <Link href={`/lessons/${previous.slug}/`}><ArrowLeft size={17} /><span><small>Previous lab</small>{previous.title}</span></Link> : <span />}
          {next ? <Link href={`/lessons/${next.slug}/`}><span><small>Next lab</small>{next.title}</span><ArrowRight size={17} /></Link> : <Link href="/lessons/"><span><small>Complete</small>Return to library</span><ArrowRight size={17} /></Link>}
        </nav>
      </main>
    </div>
  );
}
