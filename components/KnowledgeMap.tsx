import Link from "next/link";
import { ArrowUpRight, Function, Graph, Robot, ShieldCheck, Sparkle } from "@phosphor-icons/react/dist/ssr";
import type { LessonDocument } from "@/lib/content/schema";

const phaseIcons = [Function, Graph, Robot, Sparkle, ShieldCheck];

export function KnowledgeMap({ lessons }: { lessons: LessonDocument[] }) {
  const groups = [...new Map(lessons.map((lesson) => [lesson.phaseKey, { key: lesson.phaseKey, label: lesson.phase, items: lessons.filter((item) => item.phaseKey === lesson.phaseKey) }])).values()];
  return (
    <section className="knowledge-map" aria-labelledby="map-title">
      <div className="section-kicker">Navigable knowledge map</div>
      <div className="section-heading-row">
        <h2 id="map-title">See the system before entering the detail.</h2>
        <p>Choose a section to explore its lessons. This map groups subjects; prerequisites are listed separately on reviewed lessons.</p>
      </div>
      <div className="map-canvas">
        <div className="map-axis"><span>All learning sections</span></div>
        <div className="map-grid">
          {groups.map((group, index) => {
            const Icon = phaseIcons[index % phaseIcons.length];
            const first = group.items.find((item) => item.slug === group.key) || group.items[0];
            return (
              <Link className={`map-node node-${index % 5}`} href={`/lessons/${first.slug}/`} key={group.key}>
                <span className="map-icon"><Icon size={18} weight="duotone" aria-hidden /></span>
                <span><strong>{group.label}</strong><small>{group.items.length} lessons</small></span>
                <ArrowUpRight size={14} aria-hidden />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
