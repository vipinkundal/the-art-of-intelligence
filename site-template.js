(function () {
  const footerText = "The Art of Intelligence: a simple roadmap for learning AI clearly.";

  function cleanRoot(root) {
    if (!root) {
      return "";
    }

    return root.endsWith("/") ? root : `${root}/`;
  }

  function homeHref(root, fragment) {
    if (!root && fragment) {
      return `#${fragment}`;
    }

    return `${root}index.html${fragment ? `#${fragment}` : ""}`;
  }

  function escapeAttr(value) {
    return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderHeader(target) {
    const root = cleanRoot(target.dataset.root || "");
    const active = target.dataset.active || "";
    const links = [
      { key: "terms", label: "Terms", href: homeHref(root, "terms") },
      { key: "lessons", label: "Lessons", href: root ? `${root}lessons/index.html` : "#lessons" },
      { key: "sequence", label: "Sequence", href: `${root}lessons/learning-sequence/index.html` },
      { key: "roadmap", label: "Roadmap", href: homeHref(root, "roadmap") },
    ];

    const navLinks = links
      .map((link) => {
        const current = active === link.key ? ' aria-current="page"' : "";
        return `        <a href="${escapeAttr(link.href)}"${current}>${link.label}</a>`;
      })
      .join("\n");

    target.outerHTML = `<header class="site-header">
      <nav class="topbar" aria-label="Main navigation">
        <a class="brand" href="${escapeAttr(homeHref(root))}" aria-label="The Art of Intelligence home">
          <span class="brand-mark" aria-hidden="true">AI</span>
          <span>The Art of Intelligence</span>
        </a>
${navLinks}
      </nav>
    </header>`;
  }

  function renderFooter(target) {
    target.outerHTML = `<footer class="site-footer">
      <p>${footerText}</p>
    </footer>`;
  }

  function renderLessonCard(card, options) {
    const classes = ["lesson-link-card"];
    const headingLevel = options.headingLevel || 2;

    if (options.compact) {
      classes.push("compact-card");
    }

    return `          <a class="${classes.join(" ")}" href="${escapeAttr(card.href)}">
            <span class="term-tag">${escapeHtml(card.tag)}</span>
            <h${headingLevel}>${escapeHtml(card.title)}</h${headingLevel}>
            <p>${escapeHtml(card.summary)}</p>
          </a>`;
  }

  function renderCardGrid(target, cards, options = {}) {
    const label = target.dataset.label ? ` aria-label="${escapeAttr(target.dataset.label)}"` : "";
    const cardHtml = cards.map((card) => renderLessonCard(card, options)).join("\n");

    target.outerHTML = `        <div class="lesson-library"${label}>
${cardHtml}
        </div>`;
  }

  function renderSharedCardGrid(target) {
    const key = target.dataset.lessonCardGrid;
    const cards = window.lessonData?.[key] || [];

    renderCardGrid(target, cards, {
      compact: target.dataset.compact === "true",
      headingLevel: Number(target.dataset.headingLevel || 2),
    });
  }

  function renderPhaseCardGrid(target) {
    const phase = target.dataset.phaseCardGrid;
    const cards = window.lessonData?.phaseTopicCards?.[phase] || [];

    renderCardGrid(target, cards, {
      compact: target.dataset.compact === "true",
      headingLevel: Number(target.dataset.headingLevel || 2),
    });
  }

  function renderLessonPage(template) {
    const main = document.createElement("main");
    const article = document.createElement("article");
    const eyebrow = document.createElement("p");
    const title = document.createElement("h1");
    const summary = document.createElement("p");
    const articleClass = template.dataset.articleClass || "";

    main.className = template.dataset.mainClass || "lesson-main";
    article.className = ["lesson-article", articleClass].filter(Boolean).join(" ");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = template.dataset.eyebrow || "";
    title.textContent = template.dataset.title || "";
    summary.className = "lesson-summary";
    summary.textContent = template.dataset.summary || "";

    article.append(eyebrow, title, summary, document.createTextNode("\n\n"));
    article.append(template.content.cloneNode(true));
    main.append(article);
    template.replaceWith(main);
  }

  document.querySelectorAll("[data-site-header]").forEach(renderHeader);
  document.querySelectorAll("[data-site-footer]").forEach(renderFooter);
  document.querySelectorAll("[data-lesson-card-grid]").forEach(renderSharedCardGrid);
  document.querySelectorAll("[data-phase-card-grid]").forEach(renderPhaseCardGrid);
  document.querySelectorAll("template[data-lesson-page]").forEach(renderLessonPage);
})();
