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

  function renderResources(resources) {
    return resources
      .map((resource) => {
        return `            <li><a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resource.label)}</a></li>`;
      })
      .join("\n");
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

    template.innerHTML = `
        <section>
          <h2>The simple idea</h2>
${renderParagraphs(topic.simpleIdea)}
        </section>

        <section>
          <h2>How it works</h2>
${renderParagraphs(topic.howItWorks)}
        </section>

        <section>
          <h2>What to learn</h2>
${renderList(topic.whatToLearn)}
        </section>

        <section>
          <h2>Why it matters for AI</h2>
${renderParagraphs(topic.whyItMatters)}
        </section>

        <section>
          <h2>Pitfalls</h2>
${renderList(topic.pitfalls)}
        </section>

        <section>
          <h2>Example</h2>
${renderParagraphs(topic.example)}
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
          <a href="../../${escapeHtml(topic.group)}/index.html">${escapeHtml(group.shortLabel || topic.groupLabel)}</a>
          <a href="../../index.html">Mathematical Foundations</a>
          <a href="../../../index.html">All lessons</a>
        </nav>
`;

    target.replaceWith(template);
  }

  document.querySelectorAll("[data-math-topic]").forEach(renderTopic);
})();
