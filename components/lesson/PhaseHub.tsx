import Link from "next/link";
import { ArrowRight, Flask, Path, Stack } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import type { LessonDocument } from "@/lib/content/schema";
import { VisualLab } from "@/components/labs/VisualLab";
import { lessonById } from "@/lib/content/lessons";
import { phaseLearningPaths, phasePathOrientation } from "@/lib/content/phase-paths";

const engineOrder = ["calculation", "geometry", "probability", "optimization", "graph", "sequence", "retrieval", "transport", "signal", "reinforcement", "systems", "evaluation", "timeline"];

export function PhaseHub({ phase, lessons, children }: { phase: LessonDocument; lessons: LessonDocument[]; children: ReactNode }) {
  const topics = lessons.filter((lesson) => lesson.id !== phase.id);
  const learningPaths = phaseLearningPaths[phase.slug];
  const orientation = phasePathOrientation[phase.slug];
  const clusters = learningPaths ? learningPaths.map(path => ({ engine: path.title, description: path.description, lessons: path.slugs.map(slug => {
    const lesson = topics.find(topic => topic.slug === slug);
    if (!lesson) throw new Error(`Missing learning-path lesson: ${slug}`);
    return lesson;
  }) })) : engineOrder
    .map((engine) => ({ engine, description: "", lessons: topics.filter((lesson) => lesson.labs[0].engine === engine) }))
    .filter((cluster) => cluster.lessons.length > 0);
  const prerequisiteCount = new Set(topics.flatMap((lesson) => lesson.prerequisites)).size;
  const reviewedCount = topics.filter(lesson=>lesson.reviewStatus==="reviewed").length;
  const startTopic = learningPaths ? clusters[0]?.lessons[0] : topics[0];

  return (
    <div className="phase-hub-layout">
      <aside className="phase-hub-rail">
        <div className="rail-label"><Stack size={15} /> Section map</div>
        <a className="active" href="#phase-map">{learningPaths ? "Learning paths" : "Topic map"}</a>
        <a href="#phase-lab">Section lab</a>
        <a href="#phase-sequence">Browse topics</a>
        <a href="#phase-model">Operating model</a>
        <a href="#sources">Sources</a>
        <Link href="/lessons/">All phases</Link>
        <div className="phase-rail-stats"><span>{topics.length}</span><small>topic labs</small><span>{clusters.length}</span><small>{learningPaths ? "learning paths" : "visual engines"}</small></div>
      </aside>

      <main id="main-content" className="phase-hub-main">
        <header className="phase-hub-hero">
          <div className="breadcrumb"><Link href="/lessons/">Library</Link><span>/</span><span>{phase.phase}</span></div>
          <span className="section-kicker">Section system map</span>
          <div className="phase-title-row">
            <div><h1>{phase.title}</h1><p>{phase.summary}</p></div>
            <div className="phase-metrics"><span><strong>{topics.length}</strong> topic labs</span><span><strong>{clusters.length}</strong> {learningPaths ? "learning paths" : "visual engines"}</span><span><strong>{prerequisiteCount}</strong> prerequisite topics</span></div>
          </div>
          <p className="review-status">{phase.reviewStatus === "reviewed" ? `Overview content and calculated example reviewed · ${phase.updatedAt}` : "Overview editorial review pending."}</p>
          <p className="review-status">Topic review: {reviewedCount} reviewed · {topics.length-reviewedCount} pending. An overview review does not certify every topic in this section.</p>
          {phase.prerequisites.length > 0 && <p className="prerequisite-links">Before this section: {phase.prerequisites.map(id => {
            const prerequisite = lessonById.get(id);
            return prerequisite ? <Link key={id} href={`/lessons/${prerequisite.slug}/`}>{prerequisite.title}</Link> : null;
          })}</p>}
        </header>

        <section id="phase-map" className="phase-dependency-map" aria-labelledby="phase-map-title">
          <div className="section-heading-row"><div><span className="section-kicker">{learningPaths ? "Choose a learning path" : "Topic map"}</span><h2 id="phase-map-title">{learningPaths ? "Start with the question you need to answer." : "Explore related representations."}</h2></div><p>{orientation?.intro ?? "Groups organize lessons by visual format. Their position does not imply a prerequisite; explicit prerequisites are listed on individual lessons."}</p></div>
          <div className={`phase-map-canvas${learningPaths ? " phase-learning-paths" : ""}`}>
            {!learningPaths && <div className="phase-map-spine" aria-hidden />}
            {clusters.map((cluster, clusterIndex) => {
              const representative = cluster.lessons[0];
              return <div className={`phase-cluster cluster-${clusterIndex % 4}`} key={cluster.engine}>
                <div className="phase-cluster-label"><span>{String(clusterIndex + 1).padStart(2, "0")}</span><strong>{cluster.engine}</strong><small>{cluster.lessons.length} labs</small></div>
                {cluster.description && <p className="phase-path-description">{cluster.description}</p>}
                <div className="phase-cluster-nodes">{(learningPaths ? cluster.lessons : cluster.lessons.slice(0, 4)).map((lesson) => <Link href={`/lessons/${lesson.slug}/`} key={lesson.id}>{lesson.title}<ArrowRight size={13} /></Link>)}</div>
                <Link className="phase-cluster-entry" aria-label={`${learningPaths ? "Start learning path" : "Enter cluster"}: ${cluster.engine}`} href={`/lessons/${representative.slug}/`}>{learningPaths ? "Start this path" : "Enter cluster"} <ArrowRight size={14} /></Link>
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
              <span className="lab-chip">{lesson.reviewStatus==="reviewed"?"reviewed":"review pending"}</span>
              <ArrowRight size={15} />
            </Link>)}
          </div>
        </section>

        <section id="phase-model" className="phase-model-section">
          <div className="phase-model-heading"><span className="section-kicker">Section operating model</span><h2>Keep the section’s invariant in working memory.</h2></div>
          <div className="phase-model-body">{children}</div>
          <div className="phase-actions"><Link href={`/lessons/${startTopic?.slug || phase.slug}/`}><Flask size={16} /> {orientation?.startLabel ?? "Start the first topic lab"} <ArrowRight size={15} /></Link><Link href="/lessons/"><Path size={16} /> Change learning phase</Link></div>
        </section>
        <section id="sources" className="sources-section">
          <span className="section-kicker">Overview sources</span><h2>Check the section’s foundations.</h2>
          <div>{phase.sources.map((source,index)=><a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span>{String(index+1).padStart(2,"0")}</span><strong>{source.label}</strong><ArrowRight size={15}/></a>)}</div>
        </section>
      </main>
    </div>
  );
}
