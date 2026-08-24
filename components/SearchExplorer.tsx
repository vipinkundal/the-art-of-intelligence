"use client";

import Link from "next/link";
import { ArrowRight, Command, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonDocument } from "@/lib/content/schema";

export function SearchExplorer({ lessons, mode = "hero" }: { lessons: LessonDocument[]; mode?: "hero" | "library" }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return lessons.slice(0, mode === "hero" ? 6 : 24);
    return lessons
      .map((lesson) => ({ lesson, score: `${lesson.title} ${lesson.summary} ${lesson.tags.join(" ")}`.toLowerCase().includes(needle) ? (lesson.title.toLowerCase().includes(needle) ? 2 : 1) : 0 }))
      .filter((entry) => entry.score)
      .sort((a, b) => b.score - a.score || a.lesson.title.localeCompare(b.lesson.title))
      .slice(0, mode === "hero" ? 8 : 60)
      .map((entry) => entry.lesson);
  }, [lessons, mode, query]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <div className={`search-explorer ${mode}`} id="search">
      <div className="search-input-wrap">
        <MagnifyingGlass size={19} aria-hidden />
        <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search mechanisms, equations, or failure modes…" aria-label="Search every lesson" />
        {query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button> : <span className="key-hint"><Command size={13} /> K</span>}
      </div>
      <div className="search-results" aria-live="polite">
        {results.map((lesson, index) => (
          <Link href={`/lessons/${lesson.slug}/`} className="search-result" key={lesson.id}>
            <span className="result-index">{String(index + 1).padStart(2, "0")}</span>
            <span><strong>{lesson.title}</strong><small>{lesson.phase} · {lesson.labs[0].engine} lab</small></span>
            <ArrowRight size={15} aria-hidden />
          </Link>
        ))}
        {!results.length && <p className="empty-state">No exact match. Try a mechanism, equation, or phase name.</p>}
      </div>
    </div>
  );
}
