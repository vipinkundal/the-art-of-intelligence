(function () {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderParagraphs(value) {
    const paragraphs = Array.isArray(value) ? value : [value];
    return paragraphs
      .filter(Boolean)
      .map((paragraph) => `          <p>${escapeHtml(paragraph)}</p>`)
      .join("\n");
  }

  function renderList(items) {
    return `          <ul class="lesson-list topic-detail-list">
${items.map((item) => `            <li>${escapeHtml(item)}</li>`).join("\n")}
          </ul>`;
  }

  function renderPrerequisites(prerequisites) {
    if (!Array.isArray(prerequisites) || prerequisites.length === 0) {
      return "";
    }

    return `
        <section class="topic-prerequisites">
          <h2>Before you begin</h2>
          <p class="section-intro">You do not need to master everything below. Recognizing these ideas is enough to start.</p>
${renderList(prerequisites)}
        </section>`;
  }

  function renderNotationGuide(notation) {
    if (!Array.isArray(notation) || notation.length === 0) {
      return "";
    }

    return `
        <section>
          <h2>Notation guide</h2>
          <div class="topic-notation-guide">
${notation
  .map(
    (item) => `            <div class="topic-notation-row">
              <span class="topic-math-inline"${item.latex ? ` data-latex="${escapeHtml(item.latex)}"` : ""}>${escapeHtml(item.symbol)}</span>
              <p>${escapeHtml(item.meaning)}</p>
            </div>`
  )
  .join("\n")}
          </div>
        </section>`;
  }

  function renderDerivation(derivation) {
    if (!derivation?.title || !Array.isArray(derivation.steps) || derivation.steps.length === 0) {
      return "";
    }

    return `
        <section>
          <h2>Step-by-step derivation</h2>
          <div class="topic-derivation">
            <h3>${escapeHtml(derivation.title)}</h3>
            <ol>
${derivation.steps.map((step) => `              <li>${escapeHtml(step)}</li>`).join("\n")}
            </ol>
          </div>
        </section>`;
  }

  function renderWorkedExamples(examples) {
    if (!Array.isArray(examples) || examples.length === 0) {
      return "";
    }

    return `
        <section>
          <h2>More worked examples</h2>
          <div class="topic-worked-examples">
${examples
  .map(
    (example, index) => `            <article class="topic-worked-example">
              <span>Example ${index + 1}</span>
              <h3>${escapeHtml(example.title)}</h3>
              <p>${escapeHtml(example.setup)}</p>
              ${Array.isArray(example.steps) ? `<ol>${example.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>` : ""}
              <p class="topic-example-result"><strong>Result:</strong> ${escapeHtml(example.result)}</p>
            </article>`
  )
  .join("\n")}
          </div>
        </section>`;
  }

  function renderExercises(exercises) {
    if (!Array.isArray(exercises) || exercises.length === 0) {
      return "";
    }

    return `
        <section>
          <h2>Practice at three levels</h2>
          <div class="topic-exercises">
${exercises
  .map(
    (exercise) => `            <article class="topic-exercise">
              <span>${escapeHtml(exercise.level)}</span>
              <p>${escapeHtml(exercise.question)}</p>
              <details>
                <summary>Show solution</summary>
                <p>${escapeHtml(exercise.answer)}</p>
              </details>
            </article>`
  )
  .join("\n")}
          </div>
        </section>`;
  }

  function renderTakeaways(takeaways) {
    if (!Array.isArray(takeaways) || takeaways.length === 0) {
      return "";
    }

    return `
        <section class="topic-takeaways">
          <h2>Key takeaways</h2>
${renderList(takeaways)}
        </section>`;
  }

  function renderResources(resources) {
    return resources
      .map((resource) => {
        return `            <li><a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resource.label)}</a></li>`;
      })
      .join("\n");
  }

  function renderConcepts(concepts) {
    if (!Array.isArray(concepts) || concepts.length === 0) {
      return "";
    }

    return `
        <section>
          <h2>Concepts, one by one</h2>
          <div class="topic-concept-stack">
${concepts
  .map(
    (concept, index) => `            <article class="topic-concept">
              <div class="topic-concept-number" aria-hidden="true">${index + 1}</div>
              <div>
                <h3>${escapeHtml(concept.title)}</h3>
                <p>${escapeHtml(concept.explanation)}</p>
                ${concept.notation ? `<div class="topic-notation"><span>Notation</span><span class="topic-math-inline"${concept.latex ? ` data-latex="${escapeHtml(concept.latex)}"` : ""}>${escapeHtml(concept.notation)}</span></div>` : ""}
                ${concept.example ? `<p class="topic-mini-example"><strong>Example:</strong> ${escapeHtml(concept.example)}</p>` : ""}
              </div>
            </article>`
  )
  .join("\n")}
          </div>
        </section>`;
  }

  function renderFormulas(formulas) {
    if (!Array.isArray(formulas) || formulas.length === 0) {
      return "";
    }

    return `
        <section>
          <h2>Essential formulas</h2>
          <p class="section-intro">Read each formula as a sentence. The meaning matters more than memorizing the symbols.</p>
          <div class="topic-formula-list">
${formulas
  .map(
    (formula) => `            <div class="topic-formula">
              <strong>${escapeHtml(formula.label)}</strong>
              <div class="topic-math-display"${formula.latex ? ` data-latex="${escapeHtml(formula.latex)}"` : ""}><code>${escapeHtml(formula.expression)}</code></div>
              <span>${escapeHtml(formula.meaning)}</span>
            </div>`
  )
  .join("\n")}
          </div>
        </section>`;
  }

  function renderDiagram(diagram) {
    if (!diagram || !Array.isArray(diagram.nodes) || diagram.nodes.length === 0) {
      return "";
    }

    return `
        <section>
          <h2>See the structure</h2>
          <figure class="topic-diagram">
            <div class="topic-diagram-flow">
${diagram.nodes
  .map(
    (node, index) => `              <div class="topic-diagram-node">
                <span>${index + 1}</span>
                <strong>${escapeHtml(node.label)}</strong>
                <small>${escapeHtml(node.detail)}</small>
              </div>`
  )
  .join("\n")}
            </div>
            <figcaption>${escapeHtml(diagram.caption)}</figcaption>
          </figure>
        </section>`;
  }

  function renderPractice(practice) {
    if (!practice?.question || !practice?.answer) {
      return "";
    }

    return `
        <section>
          <h2>Check your understanding</h2>
          <div class="topic-practice">
            <p>${escapeHtml(practice.question)}</p>
            <details>
              <summary>Show answer</summary>
              <p>${escapeHtml(practice.answer)}</p>
            </details>
          </div>
        </section>`;
  }

  function topicHref(topicId) {
    return `../${topicId}/index.html`;
  }

  function renderTopic(target) {
    const topicId = target.dataset.mathTopic;
    const topics = window.mathematicalFoundationTopics || [];
    const groups = window.mathematicalFoundationGroups || {};
    const topic = topics.find((item) => item.id === topicId);

    if (!topic) {
      target.outerHTML = `<main class="lesson-main">
        <article class="lesson-article">
          <p class="eyebrow">Mathematical Foundations</p>
          <h1>Topic not found</h1>
          <p class="lesson-summary">The requested Mathematical Foundations topic could not be found.</p>
          <nav class="lesson-nav" aria-label="Lesson navigation">
            <a href="../../index.html">Mathematical Foundations</a>
            <a href="../../../index.html">All lessons</a>
          </nav>
        </article>
      </main>`;
      return;
    }

    const group = groups[topic.group] || {};
    const template = document.createElement("template");
    template.setAttribute("data-lesson-page", "");
    template.dataset.eyebrow = `${topic.groupLabel} | ${topic.section}`;
    template.dataset.title = topic.title;
    template.dataset.summary = topic.summary;

    const previousLink = topic.previousId ? `<a href="${topicHref(topic.previousId)}">Previous topic</a>` : "";
    const nextLink = topic.nextId ? `<a href="${topicHref(topic.nextId)}">Next topic</a>` : "";
    const isDetailedTopic = Array.isArray(topic.concepts) && topic.concepts.length > 0;

    template.innerHTML = `
${renderPrerequisites(topic.prerequisites)}

        <section>
          <h2>The simple idea</h2>
${renderParagraphs(topic.simpleIdea)}
        </section>

${renderDiagram(topic.diagram)}

${renderConcepts(topic.concepts)}

${renderNotationGuide(topic.notationGuide)}

        <section>
          <h2>How it works</h2>
${renderParagraphs(topic.howItWorks)}
        </section>

${renderFormulas(topic.formulas)}

${renderDerivation(topic.derivation)}

        <section>
          <h2>${isDetailedTopic ? "Worked example" : "Example"}</h2>
${renderParagraphs(topic.example)}
        </section>

${renderWorkedExamples(topic.workedExamples)}

        <section>
          <h2>What to learn</h2>
${renderList(topic.whatToLearn)}
        </section>

        <section>
          <h2>Why it matters for AI</h2>
${renderParagraphs(topic.whyItMatters)}
        </section>

        <section>
          <h2>${isDetailedTopic ? "Common pitfalls" : "Pitfalls"}</h2>
${renderList(topic.pitfalls)}
        </section>

${renderPractice(topic.practice)}

${renderExercises(topic.exercises)}

${renderTakeaways(topic.takeaways)}

        <section class="lesson-resource" aria-label="For more information">
          <h2>For more information</h2>
          <ul class="lesson-list topic-detail-list">
${renderResources(topic.resources)}
          </ul>
        </section>

        <nav class="lesson-nav" aria-label="Lesson navigation">
          ${previousLink}
          ${nextLink}
          <a href="../../${escapeHtml(topic.group)}/index.html">${escapeHtml(group.shortLabel || topic.groupLabel)}</a>
          <a href="../../index.html">Mathematical Foundations</a>
          <a href="../../../index.html">All lessons</a>
        </nav>
`;

    target.replaceWith(template);
  }

  document.querySelectorAll("[data-math-topic]").forEach(renderTopic);

  function renderProfessionalMath() {
    if (!window.katex) {
      return;
    }

    document.querySelectorAll("[data-latex]").forEach((element) => {
      if (element.dataset.mathRendered === "true") {
        return;
      }

      window.katex.render(element.dataset.latex, element, {
        displayMode: element.classList.contains("topic-math-display"),
        throwOnError: false,
        strict: "warn",
      });
      element.dataset.mathRendered = "true";
    });
  }

  function loadProfessionalMath() {
    if (!document.querySelector("[data-latex]")) {
      return;
    }

    if (!document.querySelector('link[data-math-styles="katex"]')) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css";
      stylesheet.integrity = "sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP";
      stylesheet.crossOrigin = "anonymous";
      stylesheet.dataset.mathStyles = "katex";
      document.head.appendChild(stylesheet);
    }

    if (window.katex) {
      renderProfessionalMath();
      return;
    }

    const existingScript = document.querySelector('script[data-math-script="katex"]');
    if (existingScript) {
      existingScript.addEventListener("load", renderProfessionalMath, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js";
    script.integrity = "sha384-cMkvdD8LoxVzGF/RPUKAcvmm49FQ0oxwDF3BGKtDXcEc+T1b2N+teh/OJfpU0jr6";
    script.crossOrigin = "anonymous";
    script.dataset.mathScript = "katex";
    script.addEventListener("load", renderProfessionalMath, { once: true });
    document.head.appendChild(script);
  }

  window.setTimeout(loadProfessionalMath, 0);
})();
