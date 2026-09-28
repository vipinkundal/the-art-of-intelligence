"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { searchGlossary } from "@/lib/content/glossary-search";

type GlossaryItem = { term: string; definition: string; phase: string; href: string; tags: string[] };

export function TermsExplorer({ items }: { items: GlossaryItem[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("term") || "");
  const results = useMemo(() => searchGlossary(items,query).slice(0,80), [items, query]);
  const selected = results[0];
  return (
    <div className="terms-explorer">
      <aside className="term-search-panel"><span className="section-kicker">Concept index</span><h1>Glossary</h1><p>Searches resolve beside the input, with a visual context and direct lesson path.</p><label><MagnifyingGlass size={17}/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a concept" /></label><div className="term-result-list">{results.slice(0,20).map((item)=><button className={selected?.term===item.term?"active":""} type="button" key={item.term} onClick={()=>setQuery(item.term)}><span>{item.term}</span><small>{item.phase}</small></button>)}</div></aside>
      <section className="term-detail">{selected ? <><span className="section-kicker">{selected.phase}</span><h2>{selected.term}</h2><p>{selected.definition}</p>{selected.tags.length>0 ? <><p className="section-kicker">Prerequisite concepts</p><div className="term-graph prerequisite-map" role="group" aria-label={`Prerequisite map for ${selected.term}`}><span className="term-core">{selected.term}</span>{selected.tags.map((tag)=><span className="term-satellite" key={tag}>{tag}</span>)}<ArrowDown className="prerequisite-arrow" size={24} aria-hidden="true" /></div></> : <p>Prerequisite relationships have not been mapped for this lesson yet.</p>}<Link href={selected.href}>Open the full visual lab <ArrowRight size={16}/></Link></> : <p className="empty-state">No concept matches that query.</p>}</section>
    </div>
  );
}
