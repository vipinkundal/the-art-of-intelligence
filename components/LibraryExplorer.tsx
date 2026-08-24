"use client";

import Link from "next/link";
import { ArrowRight, Funnel, MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { LessonDocument } from "@/lib/content/schema";

export function LibraryExplorer({ lessons }: { lessons: LessonDocument[] }) {
  const phaseOptions = [...new Map(lessons.map((lesson) => [lesson.phaseKey, lesson.phase])).entries()];
  const [phase, setPhase] = useState(phaseOptions[0]?.[0] || "all");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => lessons.filter((lesson) => (phase === "all" || lesson.phaseKey === phase) && `${lesson.title} ${lesson.summary} ${lesson.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())).slice(0, 100), [lessons, phase, query]);
  const selectedLabel = phaseOptions.find(([key]) => key === phase)?.[1] || "All phases";

  return (
    <div className="library-explorer">
      <aside className="phase-filter" aria-label="Learning phases">
        <div className="filter-label"><Funnel size={15} /> Learning phases</div>
        <button className={phase === "all" ? "active" : ""} onClick={() => setPhase("all")} type="button"><span>00</span> All phases <small>{lessons.length}</small></button>
        {phaseOptions.map(([key, label], index) => <button className={phase === key ? "active" : ""} onClick={() => setPhase(key)} type="button" key={key}><span>{String(index + 1).padStart(2, "0")}</span> {label} <small>{lessons.filter((lesson) => lesson.phaseKey === key).length}</small></button>)}
      </aside>
      <section className="library-panel">
        <div className="library-toolbar">
          <div><span className="section-kicker">{selectedLabel}</span><h2>{visible.length} visual labs</h2></div>
          <label className="compact-search"><MagnifyingGlass size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter this phase" /></label>
        </div>
        <div className="lesson-index">
          {visible.map((lesson, index) => (
            <Link href={`/lessons/${lesson.slug}/`} key={lesson.id} className="lesson-row">
              <span className="row-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="row-copy"><strong>{lesson.title}</strong><small>{lesson.summary}</small></span>
              <span className="lab-chip">{lesson.labs[0].engine}</span>
              <ArrowRight size={16} aria-hidden />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
