import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock, Flask, List, ShareNetwork } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { lessonBySlug, lessonById } from "@/lib/content/lessons";
import type { LessonDocument } from "@/lib/content/schema";
import { VisualLab } from "@/components/labs/VisualLab";
import { phaseLearningPaths } from "@/lib/content/phase-paths";

export function LessonShell({ lesson, children }: { lesson: LessonDocument; children: ReactNode }) {
  const previous = lesson.previous ? lessonBySlug.get(lesson.previous) : null;
  const next = lesson.next ? lessonBySlug.get(lesson.next) : null;
  const entryPath = phaseLearningPaths[lesson.phaseKey]?.find(path=>path.slugs[0]===lesson.slug);
  return (
    <div className="lesson-layout">
      <aside className="lesson-rail">
        <div className="rail-label"><List size={15} /> Chapter</div>
        <Link href="/lessons/">All labs</Link>
        <a href="#field-lab" className="active"><Flask size={15} /> Field lab</a>
        <a href="#operational-model">Operational model</a>
        {lesson.headings.includes("Mechanism") && <a href="#mechanism">Mechanism</a>}
        {lesson.headings.includes("Formulas") && <a href="#formulas">Equations</a>}
        {lesson.headings.includes("Worked example") && <a href="#worked-example">Worked example</a>}
        {lesson.headings.includes("Failure modes") && <a href="#failure-modes">Failure modes</a>}
        {lesson.headings.includes("Implementation notes") && <a href="#implementation">Implementation</a>}
        <a href="#sources">Sources</a>
      </aside>
      <main id="main-content" className="lesson-main">
        <header className="lesson-hero">
          <div className="breadcrumb"><Link href="/lessons/">Library</Link><span>/</span><Link href={`/lessons/${lesson.phaseKey}/`}>{lesson.phase}</Link></div>
          <div className="lesson-title-row">
            <div><span className="lesson-sequence">{lesson.phase} · visual lab</span><h1>{lesson.title}</h1><p>{lesson.summary}</p></div>
            <div className="lesson-meta"><span><Clock size={15} /> 12–18 min</span><span><BookOpen size={15} /> Advanced</span><span><ShareNetwork size={15} /> {lesson.labs[0].engine}</span></div>
          </div>
          <p className="review-status">{lesson.reviewStatus === "reviewed" ? `Content and calculated example reviewed · ${lesson.updatedAt}` : "Editorial review pending: this lesson has not yet received a full factual review."}</p>
          {lesson.prerequisites.length > 0 && <p className="prerequisite-links">Before this lesson: {lesson.prerequisites.map((id) => { const prerequisite = lessonById.get(id); return prerequisite ? <Link key={id} href={`/lessons/${prerequisite.slug}/`}>{prerequisite.title}</Link> : null; })}</p>}
          {lesson.outcomes.length > 0 && <div className="outcome-strip">{lesson.outcomes.map((outcome) => <span key={outcome}><Check size={14} />{outcome}</span>)}</div>}
        </header>
        <div id="field-lab"><VisualLab spec={lesson.labs[0]} /></div>
        {entryPath && <nav className="section-entry-path" aria-label="Suggested starting labs"><div><span className="section-kicker">Continue this learning path</span><h2>{entryPath.title}</h2><p>Suggested next labs; each lesson lists its prerequisites and review status.</p></div><ol>{entryPath.slugs.slice(1).map((slug,index)=>{const topic=lessonBySlug.get(slug);if(!topic)throw new Error(`Missing section-entry lesson: ${slug}`);return <li key={slug}><Link href={`/lessons/${slug}/`}><span>{String(index+1).padStart(2,"0")}</span>{topic.title}<ArrowRight size={15}/></Link></li>;})}</ol></nav>}
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
