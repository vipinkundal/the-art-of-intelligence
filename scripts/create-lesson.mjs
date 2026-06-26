#!/usr/bin/env node

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const args = parseArgs(process.argv.slice(2));

if (!args.phase || !args.title) {
  printUsage();
  process.exit(1);
}

const phaseSlug = slugify(args.phase);
const topicSlug = args.slug ? slugify(args.slug) : slugify(args.title);
const phaseLabel = args.phaseLabel || titleCase(args.phase);
const lessonTitle = args.number ? `${args.number} ${args.title}` : args.title;
const summary =
  args.summary ||
  `This lesson introduces ${args.title} and explains why it matters in the AI learning roadmap.`;
const cardSummary = args.cardSummary || summary;
const simpleIdea =
  args.simpleIdea || "Replace this paragraph with a clear beginner-friendly explanation of the topic.";
const items = parseList(args.items);
const itemsHeading = args.itemsHeading || "You should understand";
const formulas = parseFormulas(args.formulas);
const why =
  args.why || "Explain how this topic supports AI models, workflows, evaluation, or systems design.";
const note = args.note && args.note !== true ? String(args.note) : "";
const example = args.example && args.example !== true ? String(args.example) : "";
const learningTarget =
  args.learningTarget ||
  "State what the learner should be able to explain, calculate, build, or recognize after this lesson.";

const topicDir = path.join(rootDir, "lessons", phaseSlug, topicSlug);
const outputFile = path.join(topicDir, "index.html");
const relativeOutput = path.relative(rootDir, outputFile).replaceAll(path.sep, "/");
const phaseIndexFile = path.join(rootDir, "lessons", phaseSlug, "index.html");
const lessonLibraryFile = path.join(rootDir, "lessons", "index.html");
const homePageFile = path.join(rootDir, "index.html");

await mkdir(topicDir, { recursive: true });

const html = renderLessonPage({
  phaseLabel,
  lessonTitle,
  summary,
  simpleIdea,
  items,
  itemsHeading,
  formulas,
  why,
  note,
  example,
  learningTarget,
});

try {
  await writeFile(outputFile, html, { flag: "wx" });
} catch (error) {
  if (error && error.code === "EEXIST") {
    console.error(`Lesson already exists: ${relativeOutput}`);
    process.exit(2);
  }

  throw error;
}

console.log(`Created ${relativeOutput}`);

await ensurePhaseIndex({
  phaseSlug,
  phaseLabel,
  lessonTitle,
  topicSlug,
  summary: cardSummary,
});

await ensureLessonLibraryLinks({
  phaseSlug,
  phaseLabel,
  lessonTitle,
  topicSlug,
  summary: cardSummary,
});

await ensureHomepageLessonLink({
  phaseSlug,
  phaseLabel,
  lessonTitle,
  topicSlug,
  summary: cardSummary,
});

console.log("Updated lesson indexes");

function parseArgs(rawArgs) {
  const parsed = {};

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];

    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg.slice(2);
    const next = rawArgs[index + 1];

    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }

    parsed[key] = next;
    index += 1;
  }

  return parsed;
}

function printUsage() {
  console.log(`Usage:
node scripts/create-lesson.mjs --phase "mathematical foundations" --title "Probability Theory" --number "1.2"

Options:
  --phase        Required. Phase folder or label.
  --title        Required. Lesson title.
  --number       Optional. Lesson number shown before the title.
  --slug         Optional. Topic folder slug. Defaults to title slug.
  --phaseLabel   Optional. Display label for the phase.
  --summary      Optional. Lesson summary paragraph.
  --cardSummary  Optional. Shorter summary for lesson cards.
  --simpleIdea   Optional. Paragraph for the simple idea section.
  --items        Optional. Semicolon-separated study items.
  --itemsHeading Optional. Heading for the study-items section.
  --formulas     Optional. Semicolon-separated label=formula pairs.
  --example      Optional. Paragraph for a concrete example section.
  --why          Optional. Paragraph for the AI relevance section.
  --note         Optional. Extra explanatory note paragraph.
  --learningTarget Optional. Paragraph for the learning target section.`);
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value) {
  return String(value)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseList(value) {
  if (!value || value === true) {
    return [];
  }

  return String(value)
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseFormulas(value) {
  if (!value || value === true) {
    return [];
  }

  return String(value)
    .split(";")
    .map((entry) => {
      const separatorIndex = entry.indexOf("=");
      if (separatorIndex === -1) {
        return null;
      }

      const label = entry.slice(0, separatorIndex).trim();
      const formula = entry.slice(separatorIndex + 1).trim();
      return label && formula ? { label, formula } : null;
    })
    .filter(Boolean);
}

function renderLessonPage({
  phaseLabel,
  lessonTitle,
  summary,
  simpleIdea,
  items,
  itemsHeading,
  formulas,
  why,
  note,
  example,
  learningTarget,
}) {
  const safePhaseLabel = escapeHtml(phaseLabel);
  const safeLessonTitle = escapeHtml(lessonTitle);
  const safeSummary = escapeHtml(summary);
  const safeSimpleIdea = escapeHtml(simpleIdea);
  const safeItemsHeading = escapeHtml(itemsHeading);
  const safeWhy = escapeHtml(why);
  const safeNote = escapeHtml(note);
  const safeExample = escapeHtml(example);
  const safeLearningTarget = escapeHtml(learningTarget);
  const renderedItems =
    items.length > 0
      ? items.map((item) => `            <li>${escapeHtml(item)}</li>`).join("\n")
      : [
          "            <li>Replace this with the first concept to study.</li>",
          "            <li>Replace this with the second concept to study.</li>",
          "            <li>Replace this with the third concept to study.</li>",
        ].join("\n");
  const listClass = items.length > 8 ? "lesson-list two-column-list" : "lesson-list";
  const renderedFormulaSection = formulas.length > 0 ? renderFormulaSection(formulas) : "";
  const renderedExampleSection = example ? renderExampleSection(safeExample) : "";
  const renderedNoteSection = note ? renderNoteSection(safeNote) : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${safeLessonTitle} | The Art of Intelligence</title>
    <link rel="stylesheet" href="../../../styles.css">
  </head>
  <body>
    <header class="site-header">
      <nav class="topbar" aria-label="Main navigation">
        <a class="brand" href="../../../index.html" aria-label="The Art of Intelligence home">
          <span class="brand-mark" aria-hidden="true">AI</span>
          <span>The Art of Intelligence</span>
        </a>
        <a href="../../../index.html#terms">Terms</a>
        <a href="../../index.html">Lessons</a>
        <a href="../../../index.html#roadmap">Roadmap</a>
      </nav>
    </header>

    <main class="lesson-main">
      <article class="lesson-article">
        <p class="eyebrow">${safePhaseLabel}</p>
        <h1>${safeLessonTitle}</h1>
        <p class="lesson-summary">
          ${safeSummary}
        </p>

        <section>
          <h2>The simple idea</h2>
          <p>
            ${safeSimpleIdea}
          </p>
        </section>

        <section>
          <h2>${safeItemsHeading}</h2>
          <ul class="${listClass}">
${renderedItems}
          </ul>
        </section>

${renderedFormulaSection}

${renderedExampleSection}

        <section>
          <h2>Why it matters for AI</h2>
          <p>
            ${safeWhy}
          </p>
        </section>

${renderedNoteSection}

        <section>
          <h2>Learning target</h2>
          <p>
            ${safeLearningTarget}
          </p>
        </section>

        <nav class="lesson-nav" aria-label="Lesson navigation">
          <a href="../../index.html">All lessons</a>
          <a href="../../../index.html#roadmap">Roadmap</a>
        </nav>
      </article>
    </main>
  </body>
</html>
`;
}

function renderExampleSection(safeExample) {
  return `        <section>
          <h2>Example</h2>
          <p>
            ${safeExample}
          </p>
        </section>
`;
}

function renderNoteSection(safeNote) {
  return `        <section>
          <h2>Note</h2>
          <p>
            ${safeNote}
          </p>
        </section>
`;
}

function renderFormulaSection(formulas) {
  const rows = formulas
    .map((item) => {
      return `            <div class="formula-row">
              <span>${escapeHtml(item.label)}</span>
              <code>${escapeHtml(item.formula)}</code>
            </div>`;
    })
    .join("\n");

  return `        <section>
          <h2>Essential formulas</h2>
          <div class="formula-stack" aria-label="Essential formulas">
${rows}
          </div>
        </section>
`;
}

async function ensurePhaseIndex({ phaseSlug, phaseLabel, lessonTitle, topicSlug, summary }) {
  const phaseHref = `${topicSlug}/index.html`;

  if (!(await exists(phaseIndexFile))) {
    await writeFile(
      phaseIndexFile,
      renderPhaseIndex({
        phaseLabel,
        lessonTitle,
        phaseHref,
        summary,
      }),
      { flag: "wx" },
    );
    return;
  }

  const phaseHtml = await readFile(phaseIndexFile, "utf8");
  if (phaseHtml.includes(`href="${phaseHref}"`)) {
    return;
  }

  const card = renderLessonCard({
    href: phaseHref,
    tag: args.number || phaseLabel,
    title: lessonTitle,
    summary,
    indent: 8,
  });

  await writeFile(phaseIndexFile, insertBeforeLastLessonLibraryClose(phaseHtml, card));
}

async function ensureLessonLibraryLinks({ phaseSlug, phaseLabel, lessonTitle, topicSlug, summary }) {
  const lessonLibraryHtml = await readFile(lessonLibraryFile, "utf8");
  const phaseHref = `${phaseSlug}/index.html`;
  const lessonHref = `${phaseSlug}/${topicSlug}/index.html`;
  let updatedHtml = lessonLibraryHtml;

  if (!updatedHtml.includes(`href="${phaseHref}"`)) {
    const phaseCard = renderLessonCard({
      href: phaseHref,
      tag: "Phase",
      title: phaseLabel,
      summary: `${phaseLabel} lessons and topic pages.`,
      indent: 10,
      extraClass: " compact-card",
    });
    updatedHtml = insertBeforeSectionClose(updatedHtml, "phase-library-title", phaseCard);
  }

  if (!updatedHtml.includes(`href="${lessonHref}"`)) {
    const lessonCard = renderLessonCard({
      href: lessonHref,
      tag: phaseLabel,
      title: lessonTitle,
      summary,
      indent: 10,
    });
    updatedHtml = insertBeforeSectionClose(updatedHtml, "topic-library-title", lessonCard);
  }

  if (updatedHtml !== lessonLibraryHtml) {
    await writeFile(lessonLibraryFile, updatedHtml);
  }
}

async function ensureHomepageLessonLink({ phaseSlug, phaseLabel, lessonTitle, topicSlug, summary }) {
  const homeHtml = await readFile(homePageFile, "utf8");
  const lessonHref = `lessons/${phaseSlug}/${topicSlug}/index.html`;

  if (homeHtml.includes(`href="${lessonHref}"`)) {
    return;
  }

  const lessonCard = renderLessonCard({
    href: lessonHref,
    tag: phaseLabel,
    title: lessonTitle,
    summary,
    indent: 10,
    headingLevel: 3,
  });

  await writeFile(homePageFile, insertBeforeHomepageLessonGridClose(homeHtml, lessonCard));
}

function renderLessonCard({ href, tag, title, summary, indent, extraClass = "", headingLevel = 2 }) {
  const space = " ".repeat(indent);
  return `${space}<a class="lesson-link-card${extraClass}" href="${escapeHtml(href)}">
${space}  <span class="term-tag">${escapeHtml(tag)}</span>
${space}  <h${headingLevel}>${escapeHtml(title)}</h${headingLevel}>
${space}  <p>${escapeHtml(summary)}</p>
${space}</a>
`;
}

function renderPhaseIndex({ phaseLabel, lessonTitle, phaseHref, summary }) {
  const safePhaseLabel = escapeHtml(phaseLabel);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${safePhaseLabel} | The Art of Intelligence</title>
    <link rel="stylesheet" href="../../styles.css">
  </head>
  <body>
    <header class="site-header">
      <nav class="topbar" aria-label="Main navigation">
        <a class="brand" href="../../index.html" aria-label="The Art of Intelligence home">
          <span class="brand-mark" aria-hidden="true">AI</span>
          <span>The Art of Intelligence</span>
        </a>
        <a href="../../index.html#terms">Terms</a>
        <a href="../index.html">Lessons</a>
        <a href="../../index.html#roadmap">Roadmap</a>
      </nav>
    </header>

    <main>
      <section class="lesson-hero" aria-labelledby="phase-title">
        <p class="eyebrow">Phase</p>
        <h1 id="phase-title">${safePhaseLabel}</h1>
        <p class="intro-text">
          Topic pages for ${safePhaseLabel}.
        </p>
      </section>

      <section class="lesson-library" aria-label="${safePhaseLabel} lessons">
${renderLessonCard({
  href: phaseHref,
  tag: args.number || safePhaseLabel,
  title: lessonTitle,
  summary,
  indent: 8,
})}      </section>
    </main>

    <footer class="site-footer">
      <p>The Art of Intelligence: a simple roadmap for learning AI clearly.</p>
    </footer>
  </body>
</html>
`;
}

function insertBeforeLastLessonLibraryClose(html, insertion) {
  const marker = "      </section>\n    </main>";
  const index = html.lastIndexOf(marker);
  if (index === -1) {
    throw new Error(`Could not find lesson library insertion point in ${path.relative(rootDir, phaseIndexFile)}`);
  }

  return `${html.slice(0, index)}${insertion}${html.slice(index)}`;
}

function insertBeforeSectionClose(html, labelledBy, insertion) {
  const sectionStart = html.indexOf(`<section class="phase-library" aria-labelledby="${labelledBy}">`);
  if (sectionStart === -1) {
    throw new Error(`Could not find section ${labelledBy} in lessons/index.html`);
  }

  const nextSection = html.indexOf("\n\n      <section", sectionStart + 1);
  const sectionEnd = nextSection === -1 ? html.indexOf("\n    </main>", sectionStart) : nextSection;
  const sectionHtml = html.slice(sectionStart, sectionEnd);
  const closeIndexInSection = sectionHtml.lastIndexOf("        </div>");

  if (closeIndexInSection === -1) {
    throw new Error(`Could not find card grid insertion point for ${labelledBy}`);
  }

  const insertAt = sectionStart + closeIndexInSection;
  return `${html.slice(0, insertAt)}${insertion}${html.slice(insertAt)}`;
}

function insertBeforeHomepageLessonGridClose(html, insertion) {
  const sectionStart = html.indexOf('<section id="lessons"');
  if (sectionStart === -1) {
    throw new Error("Could not find homepage lessons section");
  }

  const sectionEnd = html.indexOf("\n      </section>", sectionStart);
  const sectionHtml = html.slice(sectionStart, sectionEnd);
  const closeIndexInSection = sectionHtml.lastIndexOf("        </div>");

  if (closeIndexInSection === -1) {
    throw new Error("Could not find homepage lesson grid insertion point");
  }

  const insertAt = sectionStart + closeIndexInSection;
  return `${html.slice(0, insertAt)}${insertion}${html.slice(insertAt)}`;
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}
