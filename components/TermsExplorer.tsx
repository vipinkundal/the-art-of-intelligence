"use client";

import Link from "next/link";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type GlossaryItem = { term: string; definition: string; phase: string; href: string; tags: string[] };

export function TermsExplorer({ items }: { items: GlossaryItem[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("term") || "");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => !needle || `${item.term} ${item.definition} ${item.tags.join(" ")}`.toLowerCase().includes(needle)).slice(0, 80);
  }, [items, query]);
  const selected = results[0];
  return (
    <div className="terms-explorer">
      <aside className="term-search-panel"><span className="section-kicker">Concept index</span><h1>Glossary</h1><p>Searches resolve beside the input, with a visual context and direct lesson path.</p><label><MagnifyingGlass size={17}/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a concept" /></label><div className="term-result-list">{results.slice(0,20).map((item)=><button className={selected?.term===item.term?"active":""} type="button" key={item.term} onClick={()=>setQuery(item.term)}><span>{item.term}</span><small>{item.phase}</small></button>)}</div></aside>
      <section className="term-detail">{selected ? <><span className="section-kicker">{selected.phase}</span><h2>{selected.term}</h2><p>{selected.definition}</p><div className="term-graph" aria-label={`Related concept map for ${selected.term}`}><span className="term-core">{selected.term}</span>{selected.tags.slice(0,5).map((tag,index)=><span className={`term-satellite satellite-${index}`} key={tag}>{tag}</span>)}</div><Link href={selected.href}>Open the full visual lab <ArrowRight size={16}/></Link></> : <p className="empty-state">No concept matches that query.</p>}</section>
    </div>
  );
}
