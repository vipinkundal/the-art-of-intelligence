import { CheckCircle, Code, Warning } from "@phosphor-icons/react/dist/ssr";
import type { LessonNarrative } from "@/lib/content/schema";

export function LessonBody({ narrative, presentedText = [] }: { narrative: LessonNarrative; presentedText?: string[] }) {
  const alreadyVisible = new Set(presentedText);
  const formulas = narrative.formulas.filter((formula) => !alreadyVisible.has(formula.expression) || !alreadyVisible.has(formula.meaning));
  const takeaways = narrative.takeaways.filter((takeaway) => !alreadyVisible.has(takeaway));
  const hasIntro = narrative.concepts.length > 0 || (narrative.hook && !alreadyVisible.has(narrative.hook)) || (narrative.overview && !alreadyVisible.has(narrative.overview));
  return (
    <div className="lesson-body">
      {!narrative.process.length && <span id="mechanism" />}
      {!formulas.length && <span id="formulas" />}
      {!narrative.example.setup && <span id="worked-example" />}
      {!narrative.pitfalls.length && <span id="failure-modes" />}
      {!narrative.implementation.length && <span id="implementation" />}
      {!takeaways.length && <span id="takeaways" />}
      {hasIntro ? <section id="operational-model" className="lesson-section intro-section">
        <span className="section-kicker">Operational model</span>
        {narrative.hook && !alreadyVisible.has(narrative.hook) && <blockquote>{narrative.hook}</blockquote>}
        {!alreadyVisible.has(narrative.overview) && <p className="lead-copy">{narrative.overview}</p>}
        <div className="concept-grid">
          {narrative.concepts.map((concept, index) => <article key={`${concept.title}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><h3>{concept.title}</h3><p>{concept.explanation}</p></article>)}
        </div>
      </section> : <span id="operational-model" />}

      {narrative.process.length > 0 && <section id="mechanism" className="lesson-section split-section">
        <div><span className="section-kicker">Mechanism</span><h2>Run the idea as a procedure.</h2></div>
        <ol className="mechanism-list">{narrative.process.map((step, index) => <li key={index}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
      </section>}

      {formulas.length > 0 && <section id="formulas" className="lesson-section formula-section">
        <div><span className="section-kicker">Working equations</span><h2>Track the units and the dependency.</h2></div>
        <div className="formula-stack">{formulas.map((formula) => <article key={formula.expression}><span>{formula.label}</span><code>{formula.expression}</code><p>{formula.meaning}</p></article>)}</div>
      </section>}

      {narrative.example.setup && <section id="worked-example" className="lesson-section example-section">
        <div className="example-index">EX / 01</div>
        <div><span className="section-kicker">Worked example</span><h2>{narrative.example.title}</h2><p>{narrative.example.setup}</p>
          {narrative.example.steps.length > 0 && <ol>{narrative.example.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>}
          {narrative.example.result && <div className="example-result"><CheckCircle size={18} weight="duotone" aria-hidden /><span><small>Result</small>{narrative.example.result}</span></div>}
        </div>
      </section>}

      {narrative.pitfalls.length > 0 && <section id="failure-modes" className="lesson-section failure-section">
        <div><span className="section-kicker">Failure modes</span><h2>Where the mental model breaks.</h2></div>
        <div className="failure-list">{narrative.pitfalls.map((pitfall, index) => <article key={index}><Warning size={18} weight="duotone" aria-hidden /><span><small>FM-{String(index + 1).padStart(2, "0")}</small>{pitfall}</span></article>)}</div>
      </section>}

      {narrative.implementation.length > 0 && <section id="implementation" className="lesson-section implementation-section">
        <div><span className="section-kicker">Implementation notes</span><h2>Make it observable in a real system.</h2></div>
        <div>{narrative.implementation.map((note, index) => <p key={index}><Code size={17} aria-hidden />{note}</p>)}</div>
      </section>}

      {takeaways.length > 0 && <section id="takeaways" className="lesson-section takeaway-section">
        <span className="section-kicker">Takeaways</span><h2>What to keep in working memory.</h2>
        <div>{takeaways.map((takeaway, index) => <p key={index}><span>{String(index + 1).padStart(2, "0")}</span>{takeaway}</p>)}</div>
      </section>}
    </div>
  );
}
