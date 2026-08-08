(function () {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function paragraphs(items) {
    return items.map((item) => `          <p>${escapeHtml(item)}</p>`).join("\n");
  }

  function list(items) {
    return `          <ul class="lesson-list topic-detail-list">
${items.map((item) => `            <li>${escapeHtml(item)}</li>`).join("\n")}
          </ul>`;
  }

  function diagram(value) {
    return `        <section>
          <h2>See the uncertainty pipeline</h2>
          <figure class="topic-diagram">
            <div class="topic-diagram-flow">
${value.nodes.map((node, index) => `              <div class="topic-diagram-node">
                <span>${index + 1}</span>
                <strong>${escapeHtml(node.label)}</strong>
                <small>${escapeHtml(node.detail)}</small>
              </div>`).join("\n")}
            </div>
            <figcaption>${escapeHtml(value.caption)}</figcaption>
          </figure>
        </section>`;
  }

  function concepts(items) {
    return `        <section>
          <h2>Core concepts</h2>
          <div class="topic-concept-stack">
${items.map((item, index) => `            <article class="topic-concept">
              <div class="topic-concept-number" aria-hidden="true">${index + 1}</div>
              <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.explanation)}</p></div>
            </article>`).join("\n")}
          </div>
        </section>`;
  }

  function process(items) {
    return `        <section>
          <h2>How it works, step by step</h2>
          <div class="topic-derivation">
            <ol>
${items.map((item) => `              <li>${escapeHtml(item)}</li>`).join("\n")}
            </ol>
          </div>
        </section>`;
  }

  function formulas(items) {
    return `        <section>
          <h2>Formula or probability rule</h2>
          <p class="section-intro">Use the notation to make assumptions and updates precise; understanding each term matters more than memorizing symbols.</p>
          <div class="topic-formula-list">
${items.map((item) => `            <div class="topic-formula">
              <strong>${escapeHtml(item.label)}</strong>
              <div class="topic-math-display"><code>${escapeHtml(item.expression)}</code></div>
              <span>${escapeHtml(item.meaning)}</span>
            </div>`).join("\n")}
          </div>
        </section>`;
  }

  function example(value) {
    return `        <section>
          <h2>Worked example</h2>
          <article class="topic-worked-example">
            <span>Example</span>
            <h3>${escapeHtml(value.title)}</h3>
            <p>${escapeHtml(value.setup)}</p>
            <ol>
${value.steps.map((item) => `              <li>${escapeHtml(item)}</li>`).join("\n")}
            </ol>
            <p class="topic-example-result"><strong>Result:</strong> ${escapeHtml(value.result)}</p>
          </article>
        </section>`;
  }

  function practice(value) {
    return `        <section>
          <h2>Check your understanding</h2>
          <div class="topic-practice">
            <p>${escapeHtml(value.question)}</p>
            <details><summary>Show answer</summary><p>${escapeHtml(value.answer)}</p></details>
          </div>
        </section>`;
  }

  function resources(items) {
    return items.map((item) => `            <li><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)}</a></li>`).join("\n");
  }

  function topicHref(id) {
    return `../${id}/index.html`;
  }

  function renderTopic(target) {
    const id = target.dataset.probabilisticAiTopic;
    const topics = window.probabilisticAiTopics || [];
    const topic = topics.find((item) => item.id === id);

    if (!topic) {
      target.outerHTML = `<main class="lesson-main"><article class="lesson-article">
        <p class="eyebrow">Probabilistic AI</p><h1>Topic not found</h1>
        <p class="lesson-summary">The requested Probabilistic AI topic could not be found.</p>
        <nav class="lesson-nav" aria-label="Lesson navigation"><a href="../../index.html">Probabilistic AI</a><a href="../../../index.html">All lessons</a></nav>
      </article></main>`;
      return;
    }

    const template = document.createElement("template");
    template.setAttribute("data-lesson-page", "");
    template.dataset.eyebrow = `4. Probabilistic AI | ${topic.groupLabel}`;
    template.dataset.title = topic.title;
    template.dataset.summary = topic.summary;
    const previous = topic.previousId ? `<a href="${topicHref(topic.previousId)}">Previous topic</a>` : "";
    const next = topic.nextId ? `<a href="${topicHref(topic.nextId)}">Next topic</a>` : "";

    template.innerHTML = `
        <section><h2>The simple idea</h2>
${paragraphs(topic.simpleIdea)}
        </section>

${diagram(topic.diagram)}
${concepts(topic.concepts)}
${process(topic.process)}
${formulas(topic.formulas)}
${example(topic.example)}

        <section><h2>Why it matters for AI</h2>
${paragraphs(topic.whyItMatters)}
        </section>

        <section><h2>Common pitfalls</h2>
${list(topic.pitfalls)}
        </section>

${practice(topic.practice)}

        <section class="topic-takeaways"><h2>Key takeaways</h2>
${list(topic.takeaways)}
        </section>

        <section class="lesson-resource" aria-label="For more information">
          <h2>For more information</h2>
          <ul class="lesson-list topic-detail-list">
${resources(topic.resources)}
          </ul>
        </section>

        <nav class="lesson-nav" aria-label="Lesson navigation">
          ${previous}${next}
          <a href="../../index.html">Probabilistic AI</a>
          <a href="../../../index.html">All lessons</a>
        </nav>`;

    target.replaceWith(template);
  }

  document.querySelectorAll("[data-probabilistic-ai-topic]").forEach(renderTopic);
})();
