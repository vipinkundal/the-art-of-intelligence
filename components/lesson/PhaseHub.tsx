import Link from "next/link";
import { ArrowRight, Flask, Path, Stack } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import type { LessonDocument } from "@/lib/content/schema";
import { VisualLab } from "@/components/labs/VisualLab";

const engineOrder = ["calculation", "geometry", "probability", "optimization", "graph", "sequence", "retrieval", "transport", "signal", "reinforcement", "systems", "evaluation", "timeline"];

export function PhaseHub({ phase, lessons, children }: { phase: LessonDocument; lessons: LessonDocument[]; children: ReactNode }) {
  const topics = lessons.filter((lesson) => lesson.id !== phase.id);
  const clusters = engineOrder
    .map((engine) => ({ engine, lessons: topics.filter((lesson) => lesson.labs[0].engine === engine) }))
    .filter((cluster) => cluster.lessons.length > 0);
  const prerequisiteCount = new Set(topics.flatMap((lesson) => lesson.prerequisites)).size;

  return (
    <div className="phase-hub-layout">
      <aside className="phase-hub-rail">
        <div className="rail-label"><Stack size={15} /> Section map</div>
        <a className="active" href="#phase-map">Topic map</a>
        <a href="#phase-lab">Section lab</a>
        <a href="#phase-sequence">Browse topics</a>
        <a href="#phase-model">Operating model</a>
        <Link href="/lessons/">All phases</Link>
        <div className="phase-rail-stats"><span>{topics.length}</span><small>topic labs</small><span>{clusters.length}</span><small>visual engines</small></div>
      </aside>

      <main id="main-content" className="phase-hub-main">
        <header className="phase-hub-hero">
          <div className="breadcrumb"><Link href="/lessons/">Library</Link><span>/</span><span>{phase.phase}</span></div>
          <span className="section-kicker">Section system map</span>
          <div className="phase-title-row">
            <div><h1>{phase.title}</h1><p>{phase.summary}</p></div>
            <div className="phase-metrics"><span><strong>{topics.length}</strong> topic labs</span><span><strong>{clusters.length}</strong> visual engines</span><span><strong>{prerequisiteCount}</strong> dependencies</span></div>
          </div>
        </header>

        <section id="phase-map" className="phase-dependency-map" aria-labelledby="phase-map-title">
          <div className="section-heading-row"><div><span className="section-kicker">Topic map</span><h2 id="phase-map-title">Explore related representations.</h2></div><p>Groups organize lessons by visual format. Their position does not imply a prerequisite; explicit prerequisites are listed on individual lessons.</p></div>
          <div className="phase-map-canvas">
            <div className="phase-map-spine" aria-hidden />
            {clusters.map((cluster, clusterIndex) => {
              const representative = cluster.lessons[0];
              return <div className={`phase-cluster cluster-${clusterIndex % 4}`} key={cluster.engine}>
                <div className="phase-cluster-label"><span>{String(clusterIndex + 1).padStart(2, "0")}</span><strong>{cluster.engine}</strong><small>{cluster.lessons.length} labs</small></div>
                <div className="phase-cluster-nodes">{cluster.lessons.slice(0, 4).map((lesson) => <Link href={`/lessons/${lesson.slug}/`} key={lesson.id}>{lesson.title}<ArrowRight size={13} /></Link>)}</div>
                <Link className="phase-cluster-entry" href={`/lessons/${representative.slug}/`}>Enter cluster <ArrowRight size={14} /></Link>
              </div>;
            })}
          </div>
        </section>

        <div id="phase-lab" className="phase-featured-lab"><VisualLab spec={phase.labs[0]} /></div>

        <section id="phase-sequence" className="phase-sequence-section">
          <div className="section-heading-row"><div><span className="section-kicker">All topics</span><h2>Browse this section.</h2></div><p>This is an alphabetical index, not a recommended prerequisite order.</p></div>
          <div className="phase-sequence-list">
            {topics.map((lesson, index) => <Link href={`/lessons/${lesson.slug}/`} key={lesson.id}>
              <span className="sequence-number">{String(index + 1).padStart(2, "0")}</span>
              <span><strong>{lesson.title}</strong><small>{lesson.summary}</small></span>
              <span className="lab-chip">{lesson.labs[0].engine}</span>
              <ArrowRight size={15} />
            </Link>)}
          </div>
        </section>

        <section id="phase-model" className="phase-model-section">
          <div className="phase-model-heading"><span className="section-kicker">Section operating model</span><h2>Keep the section’s invariant in working memory.</h2></div>
          <div className="phase-model-body">{children}</div>
          <div className="phase-actions"><Link href={`/lessons/${topics[0]?.slug || phase.slug}/`}><Flask size={16} /> Start the first topic lab <ArrowRight size={15} /></Link><Link href="/lessons/"><Path size={16} /> Change learning phase</Link></div>
        </section>
      </main>
    </div>
  );
}
