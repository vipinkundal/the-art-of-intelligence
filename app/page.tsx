import Link from "next/link";
import { ArrowRight, Cube, Flask, Path, Target } from "@phosphor-icons/react/dist/ssr";
import { KnowledgeMap } from "@/components/KnowledgeMap";
import { SearchExplorer } from "@/components/SearchExplorer";
import { lessons } from "@/lib/content/lessons";

const featured = lessons.filter((lesson) => ["geometry", "sequence", "transport", "evaluation"].includes(lesson.labs[0].engine)).slice(0, 4);

function HeroInstrument() {
  const points = [[205,72],[315,98],[385,170],[342,254],[244,282],[148,228],[120,142],[256,170],[290,210],[198,198],[352,130],[170,110]];
  return <div className="hero-instrument"><svg viewBox="0 0 500 350" role="img" aria-labelledby="hero-viz-title hero-viz-desc"><title id="hero-viz-title">Latent geometry instrument</title><desc id="hero-viz-desc">A field of points organized around two eigenvector directions, illustrating the visual lab language used across the site.</desc><g className="hero-grid-lines">{Array.from({length:10},(_,index)=><line key={`v${index}`} x1={25+index*50} x2={25+index*50} y1="20" y2="325"/>)}{Array.from({length:7},(_,index)=><line key={`h${index}`} x1="20" x2="480" y1={25+index*50} y2={25+index*50}/>)}</g><ellipse cx="255" cy="175" rx="145" ry="92" className="hero-orbit"/><ellipse cx="255" cy="175" rx="92" ry="55" className="hero-orbit secondary"/>{points.map((point,index)=><circle key={index} cx={point[0]} cy={point[1]} r={index===7?7:3.5} className={index===7?"hero-point selected":"hero-point"}/>) }<line x1="255" y1="175" x2="440" y2="92" className="hero-vector cyan"/><line x1="255" y1="175" x2="152" y2="44" className="hero-vector violet"/><text x="394" y="78">v₁</text><text x="132" y="36">v₂</text><text x="38" y="308">latent state · live geometry</text><text x="385" y="304">λ₁ 2.41</text><text x="385" y="322">λ₂ 0.73</text></svg></div>;
}

export default function HomePage() {
  return (
    <main id="main-content" className="home-page">
      <section className="home-hero">
        <div className="hero-grid-glow" aria-hidden />
        <div className="hero-copy">
          <span className="hero-label"><Flask size={15} weight="duotone" /> Visual learning lab · 382 experiments</span>
          <h1>Stop memorizing AI.<br/><em>Interrogate it.</em></h1>
          <p>Advanced concepts become durable when you can move the parameter, watch the geometry change, and name the invariant that survives.</p>
          <div className="hero-actions"><Link className="primary-action" href="/lessons/">Enter the lab <ArrowRight size={16}/></Link><Link className="text-action" href="#knowledge-map">Explore the knowledge map</Link></div>
        </div>
        <HeroInstrument />
        <SearchExplorer lessons={lessons} />
      </section>

      <div id="knowledge-map"><KnowledgeMap lessons={lessons} /></div>

      <section className="featured-labs">
        <div className="section-kicker">Featured instruments</div>
        <div className="section-heading-row"><h2>Choose the representation that exposes the mechanism.</h2><Link href="/lessons/">View all labs <ArrowRight size={15}/></Link></div>
        <div className="featured-grid">{featured.map((lesson,index)=>{const Icon=[Cube,Path,Target,Flask][index];return <Link href={`/lessons/${lesson.slug}/`} key={lesson.id}><span className="featured-icon"><Icon size={22} weight="duotone"/></span><small>{lesson.labs[0].engine} lab</small><h3>{lesson.title}</h3><p>{lesson.summary}</p><span className="open-label">Open instrument <ArrowRight size={14}/></span></Link>})}</div>
      </section>
    </main>
  );
}
