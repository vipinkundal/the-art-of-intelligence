(function () {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderParagraphs(paragraphs) {
    return paragraphs.map((paragraph) => `          <p>${escapeHtml(paragraph)}</p>`).join("\n");
  }

  function renderList(items, className = "lesson-list topic-detail-list") {
    return `          <ul class="${className}">
${items.map((item) => `            <li>${escapeHtml(item)}</li>`).join("\n")}
          </ul>`;
  }

  function renderConcepts(concepts) {
    return `        <section>
          <h2>Core concepts</h2>
          <div class="topic-concept-stack">
${concepts
  .map(
    (concept, index) => `            <article class="topic-concept">
              <div class="topic-concept-number" aria-hidden="true">${index + 1}</div>
              <div>
                <h3>${escapeHtml(concept.title)}</h3>
                <p>${escapeHtml(concept.explanation)}</p>
              </div>
            </article>`
  )
  .join("\n")}
          </div>
        </section>`;
  }

  function renderProcess(steps) {
    return `        <section>
          <h2>How it works, step by step</h2>
          <div class="topic-derivation">
            <ol>
${steps.map((step) => `              <li>${escapeHtml(step)}</li>`).join("\n")}
            </ol>
          </div>
        </section>`;
  }

  function renderFormulas(formulas) {
    return `        <section>
          <h2>Essential formulas</h2>
          <p class="section-intro">Read the notation as a description of the computation, then check the meaning below it.</p>
          <div class="topic-formula-list">
${formulas
  .map(
    (formula) => `            <div class="topic-formula">
              <strong>${escapeHtml(formula.label)}</strong>
              <div class="topic-math-display"><code>${escapeHtml(formula.expression)}</code></div>
              <span>${escapeHtml(formula.meaning)}</span>
            </div>`
  )
  .join("\n")}
          </div>
        </section>`;
  }

  function renderExample(example) {
    return `        <section>
          <h2>Worked example</h2>
          <article class="topic-worked-example">
            <span>Example</span>
            <h3>${escapeHtml(example.title)}</h3>
            <p>${escapeHtml(example.setup)}</p>
            <ol>
${example.steps.map((step) => `              <li>${escapeHtml(step)}</li>`).join("\n")}
            </ol>
            <p class="topic-example-result"><strong>Result:</strong> ${escapeHtml(example.result)}</p>
          </article>
        </section>`;
  }

  function renderPractice(practice) {
    return `        <section>
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

  function renderResources(resources) {
    return resources
      .map(
        (resource) => `            <li><a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resource.label)}</a></li>`
      )
      .join("\n");
  }

  function topicHref(topicId) {
    return `../${topicId}/index.html`;
  }

  function renderTopic(target) {
    const topicId = target.dataset.deepLearningTopic;
    const topics = window.deepLearningTopics || [];
    const topic = topics.find((item) => item.id === topicId);

    if (!topic) {
      target.outerHTML = `<main class="lesson-main">
        <article class="lesson-article">
          <p class="eyebrow">Deep Learning Foundations</p>
          <h1>Topic not found</h1>
          <p class="lesson-summary">The requested Deep Learning topic could not be found.</p>
          <nav class="lesson-nav" aria-label="Lesson navigation">
            <a href="../../index.html">Deep Learning Foundations</a>
            <a href="../../../index.html">All lessons</a>
          </nav>
        </article>
      </main>`;
      return;
    }

    const template = document.createElement("template");
    template.setAttribute("data-lesson-page", "");
    template.dataset.eyebrow = `6. Deep Learning Foundations | ${topic.groupLabel}`;
    template.dataset.title = topic.title;
    template.dataset.summary = topic.summary;

    const previousLink = topic.previousId ? `<a href="${topicHref(topic.previousId)}">Previous topic</a>` : "";
    const nextLink = topic.nextId ? `<a href="${topicHref(topic.nextId)}">Next topic</a>` : "";

    template.innerHTML = `
        <section>
          <h2>The simple idea</h2>
${renderParagraphs(topic.simpleIdea)}
        </section>

${renderConcepts(topic.concepts)}

${renderProcess(topic.process)}

${renderFormulas(topic.formulas)}

${renderExample(topic.example)}

        <section>
          <h2>Why it matters for AI</h2>
${renderParagraphs(topic.whyItMatters)}
        </section>

        <section>
          <h2>Common pitfalls</h2>
${renderList(topic.pitfalls)}
        </section>

${renderPractice(topic.practice)}

        <section class="topic-takeaways">
          <h2>Key takeaways</h2>
${renderList(topic.takeaways)}
        </section>

        <section class="lesson-resource" aria-label="For more information">
          <h2>For more information</h2>
          <ul class="lesson-list topic-detail-list">
${renderResources(topic.resources)}
          </ul>
        </section>

        <nav class="lesson-nav" aria-label="Lesson navigation">
          ${previousLink}
          ${nextLink}
          <a href="../../index.html">Deep Learning Foundations</a>
          <a href="../../../index.html">All lessons</a>
        </nav>
`;

    target.replaceWith(template);
  }

  document.querySelectorAll("[data-deep-learning-topic]").forEach(renderTopic);
})();
