#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lessonsDir = path.join(rootDir, "lessons");
const lessonDataFile = path.join(rootDir, "lesson-data.js");
const mathematicalFoundationsDir = path.join(lessonsDir, "mathematical-foundations");
const mathematicalTopicDir = path.join(mathematicalFoundationsDir, "topics");
const mathematicalTopicDataFile = path.join(mathematicalFoundationsDir, "mathematical-foundations-data.js");
const linearAlgebraDetailDataFile = path.join(mathematicalFoundationsDir, "linear-algebra-details.js");
const calculusDetailDataFile = path.join(mathematicalFoundationsDir, "calculus-details.js");
const probabilityDetailDataFile = path.join(mathematicalFoundationsDir, "probability-details.js");
const statisticsDetailDataFile = path.join(mathematicalFoundationsDir, "statistics-details.js");
const optimizationDetailDataFile = path.join(mathematicalFoundationsDir, "optimization-details.js");
const informationTheoryDetailDataFile = path.join(mathematicalFoundationsDir, "information-theory-details.js");
const discreteMathematicsDetailDataFile = path.join(mathematicalFoundationsDir, "discrete-mathematics-details.js");
const classicalAiDir = path.join(lessonsDir, "classical-artificial-intelligence");
const classicalAiTopicDir = path.join(classicalAiDir, "topics");
const classicalAiTopicDataFile = path.join(classicalAiDir, "classical-ai-data.js");
const classicalAiTopicRendererFile = path.join(classicalAiDir, "classical-ai-topic.js");
const probabilisticAiDir = path.join(lessonsDir, "probabilistic-ai");
const probabilisticAiTopicDir = path.join(probabilisticAiDir, "topics");
const probabilisticAiTopicDataFile = path.join(probabilisticAiDir, "probabilistic-ai-data.js");
const probabilisticAiTopicRendererFile = path.join(probabilisticAiDir, "probabilistic-ai-topic.js");
const generativeModellingDir = path.join(lessonsDir, "generative-modelling");
const generativeTopicDir = path.join(generativeModellingDir, "topics");
const generativeTopicDataFile = path.join(generativeModellingDir, "generative-modelling-data.js");
const ignoredLessonFolders = new Set(["_template"]);
const failures = [];

const htmlFiles = await collectHtmlFiles(rootDir);
const lessonHtmlFiles = htmlFiles.filter((file) => isInside(file, lessonsDir));
const topicPages = lessonHtmlFiles.filter((file) => {
  const relativeParts = path.relative(lessonsDir, file).split(path.sep);
  return (
    relativeParts.length === 3 &&
    relativeParts[2] === "index.html" &&
    !ignoredLessonFolders.has(relativeParts[0])
  );
});

await auditPhaseFolders();
await auditTopicPageStructure();
await auditPhaseTopicLinks();
await auditLessonLibrary();
await auditHomepageLessonLinks();
await auditSiteTemplates();
await auditGlossaryData();
await auditMathematicalFoundationsTopics();
await auditMathematicalFoundationOverviews();
await auditGenerativeModellingTopics();
await auditClassicalAiTopics();
await auditProbabilisticAiTopics();
await auditLinks(htmlFiles);

if (failures.length > 0) {
  console.error(`Lesson audit failed with ${failures.length} issue${failures.length === 1 ? "" : "s"}:`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Lesson audit passed: ${topicPages.length} topic pages, ${lessonHtmlFiles.length} lesson HTML files, ${htmlFiles.length} total HTML files.`);

async function auditPhaseFolders() {
  const entries = await readdir(lessonsDir, { withFileTypes: true });
  const phaseFolders = entries
    .filter((entry) => entry.isDirectory() && !ignoredLessonFolders.has(entry.name))
    .map((entry) => entry.name)
    .sort();

  for (const phaseFolder of phaseFolders) {
    const phaseIndex = path.join(lessonsDir, phaseFolder, "index.html");
    if (!(await exists(phaseIndex))) {
      failures.push(`Missing phase landing page: ${relativePath(phaseIndex)}`);
    }
  }
}

async function auditTopicPageStructure() {
  const requiredChecks = [
    ["lesson page template", /<template\b[^>]*\bdata-lesson-page\b[^>]*>/i],
    ["lesson title", /<template\b[^>]*\bdata-title="[^"]+"/i],
    ["lesson summary", /<template\b[^>]*\bdata-summary="[^"]+"/i],
    ["simple idea section", /<h2\b[^>]*>\s*The simple idea\s*<\/h2>/i],
    ["study list", /<ul\b[^>]*class="[^"]*\blesson-list\b[^"]*"/i],
    ["AI relevance section", /<h2\b[^>]*>\s*Why it matters(?: for AI)?\s*<\/h2>/i],
    ["learning target section", /<h2\b[^>]*>\s*Learning target\s*<\/h2>/i],
    ["lesson navigation", /<nav\b[^>]*class="[^"]*\blesson-nav\b[^"]*"/i],
  ];
  const placeholderPattern = /\b(?:Replace this|Topic Title|Phase Name)\b/i;

  for (const topicPage of topicPages) {
    const html = await readFile(topicPage, "utf8");
    const relativeTopicPage = relativePath(topicPage);

    for (const [label, pattern] of requiredChecks) {
      if (!pattern.test(html)) {
        failures.push(`Topic page ${relativeTopicPage} is missing ${label}.`);
      }
    }

    if (placeholderPattern.test(html)) {
      failures.push(`Topic page ${relativeTopicPage} still contains starter placeholder text.`);
    }

    if (html.includes('<main class="lesson-main"') || html.includes('<article class="lesson-article')) {
      failures.push(`Topic page ${relativeTopicPage} should use data-lesson-page instead of copied lesson article shell markup.`);
    }
  }
}

async function auditLessonLibrary() {
  const libraryPath = path.join(lessonsDir, "index.html");
  const libraryHtml = await readFile(libraryPath, "utf8");
  const lessonDataText = await readFile(lessonDataFile, "utf8");

  if (libraryHtml.includes("lesson-link-card")) {
    failures.push("Lesson library should render lesson cards from lesson-data.js instead of hardcoded lesson-link-card markup.");
  }

  if (!libraryHtml.includes('data-lesson-card-grid="phaseCards"')) {
    failures.push("Lesson library is missing phaseCards template placeholder.");
  }

  if (!libraryHtml.includes('data-lesson-card-grid="topicCards"')) {
    failures.push("Lesson library is missing topicCards template placeholder.");
  }

  for (const topicPage of topicPages) {
    const href = path.relative(lessonsDir, topicPage).replaceAll(path.sep, "/");
    if (!libraryHtml.includes(`href="${href}"`) && !lessonDataText.includes(`href: "${href}"`)) {
      failures.push(`Lesson library does not link topic page: ${href}`);
    }
  }
}

async function auditPhaseTopicLinks() {
  const lessonDataText = await readFile(lessonDataFile, "utf8");

  for (const topicPage of topicPages) {
    const relativeParts = path.relative(lessonsDir, topicPage).split(path.sep);
    const [phaseFolder, topicFolder] = relativeParts;
    const phaseIndex = path.join(lessonsDir, phaseFolder, "index.html");
    const phaseHtml = await readFile(phaseIndex, "utf8");
    const href = `${topicFolder}/index.html`;
    const phaseGroupSource = extractPhaseGroupSource(lessonDataText, phaseFolder);
    const renderedFromPhaseData =
      phaseHtml.includes(`data-phase-card-grid="${phaseFolder}"`) && phaseGroupSource.includes(`href: "${href}"`);

    if (phaseHtml.includes(`data-phase-card-grid="${phaseFolder}"`) && phaseHtml.includes("lesson-link-card")) {
      failures.push(`Phase page ${phaseFolder}/index.html should render its card grid from lesson-data.js instead of hardcoded cards.`);
    }

    if (!phaseHtml.includes(`href="${href}"`) && !renderedFromPhaseData) {
      failures.push(`Phase page ${phaseFolder}/index.html does not link topic page: ${href}`);
    }
  }
}

async function auditHomepageLessonLinks() {
  const homepagePath = path.join(rootDir, "index.html");
  const homepageHtml = await readFile(homepagePath, "utf8");

  if (!homepageHtml.includes('href="lessons/index.html"')) {
    failures.push("Homepage does not link the full lesson library: lessons/index.html");
  }
}

async function auditSiteTemplates() {
  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    const relativeFile = relativePath(file);
    const scriptSources = extractHtmlAttributeValues(html, "src").filter((src) => src.endsWith("site-template.js"));
    const lessonDataScriptSources = extractHtmlAttributeValues(html, "src").filter((src) => src.endsWith("lesson-data.js"));
    const usesLessonData =
      html.includes("data-lesson-card-grid") || html.includes("data-phase-card-grid");

    if (html.includes('<header class="site-header"')) {
      failures.push(`HTML page still contains copied site header instead of template placeholder: ${relativeFile}`);
    }

    if (html.includes('<footer class="site-footer"')) {
      failures.push(`HTML page still contains copied site footer instead of template placeholder: ${relativeFile}`);
    }

    if (isInside(file, lessonsDir) && (html.includes('<main class="lesson-main"') || html.includes('<article class="lesson-article'))) {
      failures.push(`Lesson HTML page should use data-lesson-page instead of copied lesson article shell markup: ${relativeFile}`);
    }

    if (!html.includes("data-site-header")) {
      failures.push(`HTML page is missing site header template placeholder: ${relativeFile}`);
    }

    if (!html.includes("data-site-footer")) {
      failures.push(`HTML page is missing site footer template placeholder: ${relativeFile}`);
    }

    if (scriptSources.length !== 1) {
      failures.push(`HTML page should include exactly one site-template.js script: ${relativeFile}`);
      continue;
    }

    const scriptTarget = resolveHref(file, scriptSources[0]);
    if (!(await exists(scriptTarget))) {
      failures.push(`Site template script does not resolve in ${relativeFile}: ${scriptSources[0]}`);
    }

    if (usesLessonData && lessonDataScriptSources.length !== 1) {
      failures.push(`HTML page with lesson-card data placeholders should include exactly one lesson-data.js script: ${relativeFile}`);
      continue;
    }

    if (lessonDataScriptSources.length > 0) {
      const lessonDataTarget = resolveHref(file, lessonDataScriptSources[0]);
      if (!(await exists(lessonDataTarget))) {
        failures.push(`Lesson data script does not resolve in ${relativeFile}: ${lessonDataScriptSources[0]}`);
      }
    }
  }
}

async function auditGlossaryData() {
  const homepagePath = path.join(rootDir, "index.html");
  const scriptPath = path.join(rootDir, "script.js");
  const homepageHtml = await readFile(homepagePath, "utf8");
  const scriptText = await readFile(scriptPath, "utf8");
  const filterCategories = new Set(extractHtmlAttributeValues(homepageHtml, "data-category"));
  const termCategories = new Set(extractObjectPropertyValues(scriptText, "category"));
  const lessonHrefs = extractObjectPropertyValues(scriptText, "lessonHref");

  if (filterCategories.size > 0) {
    for (const category of termCategories) {
      if (!filterCategories.has(category)) {
        failures.push(`Glossary term category has no matching filter button: ${category}`);
      }
    }
  }

  for (const href of lessonHrefs) {
    const target = path.resolve(rootDir, href);
    if (!(await exists(target))) {
      failures.push(`Glossary lesson link does not resolve: ${href} -> ${relativePath(target)}`);
    }
  }
}

async function auditGenerativeModellingTopics() {
  if (!(await exists(generativeTopicDataFile))) {
    failures.push(`Missing Generative Modelling topic data: ${relativePath(generativeTopicDataFile)}`);
    return;
  }

  const parentPath = path.join(generativeModellingDir, "index.html");
  const parentHtml = await readFile(parentPath, "utf8");
  const topics = await loadGenerativeModellingTopics();
  const topicIds = new Set();
  const requiredFields = [
    "id",
    "group",
    "title",
    "summary",
    "simpleIdea",
    "howItWorks",
    "whatToLearn",
    "whyItMatters",
    "pitfalls",
    "example",
    "resources",
  ];

  if (topics.length !== 51) {
    failures.push(`Generative Modelling should define exactly 51 deep-dive topics, found ${topics.length}.`);
  }

  for (const topic of topics) {
    const topicLabel = topic?.id || topic?.title || "unknown topic";

    for (const field of requiredFields) {
      if (!hasTopicValue(topic?.[field])) {
        failures.push(`Generative Modelling topic ${topicLabel} is missing required field: ${field}.`);
      }
    }

    if (topicIds.has(topic.id)) {
      failures.push(`Duplicate Generative Modelling topic id: ${topic.id}`);
    }
    topicIds.add(topic.id);

    if (!Array.isArray(topic.whatToLearn) || topic.whatToLearn.length === 0) {
      failures.push(`Generative Modelling topic ${topicLabel} must have a non-empty whatToLearn list.`);
    }

    if (!Array.isArray(topic.pitfalls) || topic.pitfalls.length === 0) {
      failures.push(`Generative Modelling topic ${topicLabel} must have a non-empty pitfalls list.`);
    }

    if (!Array.isArray(topic.resources) || topic.resources.length === 0) {
      failures.push(`Generative Modelling topic ${topicLabel} must have at least one external resource.`);
    } else {
      for (const resource of topic.resources) {
        if (!resource?.label || !resource?.url || !/^https?:\/\//.test(resource.url)) {
          failures.push(`Generative Modelling topic ${topicLabel} has an invalid external resource.`);
        }
      }
    }

    const expectedPage = path.join(generativeTopicDir, topic.id, "index.html");
    if (!(await exists(expectedPage))) {
      failures.push(`Missing Generative Modelling deep-dive page: ${relativePath(expectedPage)}`);
      continue;
    }

    const pageHtml = await readFile(expectedPage, "utf8");
    const relativePage = relativePath(expectedPage);

    if (!pageHtml.includes(`data-generative-topic="${topic.id}"`)) {
      failures.push(`Generative Modelling page ${relativePage} is missing its topic placeholder.`);
    }

    for (const scriptName of ["generative-modelling-data.js", "generative-modelling-topic.js", "site-template.js"]) {
      const scriptSources = extractHtmlAttributeValues(pageHtml, "src").filter((src) => src.endsWith(scriptName));
      if (scriptSources.length !== 1) {
        failures.push(`Generative Modelling page ${relativePage} should include exactly one ${scriptName} script.`);
        continue;
      }

      const scriptTarget = resolveHref(expectedPage, scriptSources[0]);
      if (!(await exists(scriptTarget))) {
        failures.push(`Generative Modelling script does not resolve in ${relativePage}: ${scriptSources[0]}`);
      }
    }

    if (pageHtml.includes('<main class="lesson-main"') || pageHtml.includes('<article class="lesson-article"')) {
      failures.push(`Generative Modelling page ${relativePage} should be a topic stub, not copied lesson article markup.`);
    }

    if (pageHtml.includes("<section") || pageHtml.includes("<h1")) {
      failures.push(`Generative Modelling page ${relativePage} should render article content from shared data, not copied sections.`);
    }

    if (!parentHtml.includes(`href="topics/${topic.id}/index.html"`)) {
      failures.push(`Generative Modelling parent page does not link local topic page: topics/${topic.id}/index.html`);
    }
  }

  if (await exists(generativeTopicDir)) {
    const generatedPages = (await collectHtmlFiles(generativeTopicDir)).filter((file) => path.basename(file) === "index.html");
    if (generatedPages.length !== 51) {
      failures.push(`Generative Modelling should have exactly 51 generated deep-dive pages, found ${generatedPages.length}.`);
    }
  } else {
    failures.push(`Missing Generative Modelling topic directory: ${relativePath(generativeTopicDir)}`);
  }
}

async function auditMathematicalFoundationsTopics() {
  if (!(await exists(mathematicalTopicDataFile))) {
    failures.push(`Missing Mathematical Foundations topic data: ${relativePath(mathematicalTopicDataFile)}`);
    return;
  }

  if (!(await exists(linearAlgebraDetailDataFile))) {
    failures.push(`Missing Linear Algebra detail data: ${relativePath(linearAlgebraDetailDataFile)}`);
    return;
  }

  if (!(await exists(calculusDetailDataFile))) {
    failures.push(`Missing Calculus detail data: ${relativePath(calculusDetailDataFile)}`);
    return;
  }

  if (!(await exists(probabilityDetailDataFile))) {
    failures.push(`Missing Probability detail data: ${relativePath(probabilityDetailDataFile)}`);
    return;
  }

  if (!(await exists(statisticsDetailDataFile))) {
    failures.push(`Missing Statistics detail data: ${relativePath(statisticsDetailDataFile)}`);
    return;
  }

  if (!(await exists(optimizationDetailDataFile))) {
    failures.push(`Missing Optimization detail data: ${relativePath(optimizationDetailDataFile)}`);
    return;
  }

  if (!(await exists(informationTheoryDetailDataFile))) {
    failures.push(`Missing Information Theory detail data: ${relativePath(informationTheoryDetailDataFile)}`);
    return;
  }

  if (!(await exists(discreteMathematicsDetailDataFile))) {
    failures.push(`Missing Discrete Mathematics detail data: ${relativePath(discreteMathematicsDetailDataFile)}`);
    return;
  }

  const topics = await loadMathematicalFoundationsTopics();
  const topicIds = new Set();
  const requiredFields = [
    "id",
    "group",
    "section",
    "title",
    "summary",
    "simpleIdea",
    "howItWorks",
    "whatToLearn",
    "whyItMatters",
    "pitfalls",
    "example",
    "resources",
  ];

  if (topics.length !== 133) {
    failures.push(`Mathematical Foundations should define exactly 133 deep-dive topics, found ${topics.length}.`);
  }

  const calculusTopics = topics.filter((topic) => topic.group === "calculus-and-matrix-calculus");
  if (calculusTopics.length !== 14) {
    failures.push(`Calculus and Matrix Calculus should define exactly 14 detailed topics, found ${calculusTopics.length}.`);
  }

  const probabilityTopics = topics.filter((topic) => topic.group === "probability");
  if (probabilityTopics.length !== 34) {
    failures.push(`Probability should define exactly 34 detailed topics, found ${probabilityTopics.length}.`);
  }

  const statisticsTopics = topics.filter((topic) => topic.group === "statistics");
  if (statisticsTopics.length !== 18) {
    failures.push(`Statistics should define exactly 18 detailed topics, found ${statisticsTopics.length}.`);
  }

  const optimizationTopics = topics.filter((topic) => topic.group === "optimization");
  if (optimizationTopics.length !== 18) {
    failures.push(`Optimization should define exactly 18 detailed topics, found ${optimizationTopics.length}.`);
  }

  const informationTheoryTopics = topics.filter((topic) => topic.group === "information-theory");
  if (informationTheoryTopics.length !== 11) {
    failures.push(`Information Theory should define exactly 11 detailed topics, found ${informationTheoryTopics.length}.`);
  }

  const discreteMathematicsTopics = topics.filter(
    (topic) => topic.group === "discrete-mathematics-theoretical-computer-science"
  );
  if (discreteMathematicsTopics.length !== 16) {
    failures.push(`Discrete Mathematics should define exactly 16 detailed topics, found ${discreteMathematicsTopics.length}.`);
  }

  for (const topic of topics) {
    const topicLabel = topic?.id || topic?.title || "unknown topic";

    for (const field of requiredFields) {
      if (!hasTopicValue(topic?.[field])) {
        failures.push(`Mathematical Foundations topic ${topicLabel} is missing required field: ${field}.`);
      }
    }

    if (topicIds.has(topic.id)) {
      failures.push(`Duplicate Mathematical Foundations topic id: ${topic.id}`);
    }
    topicIds.add(topic.id);

    if (!Array.isArray(topic.whatToLearn) || topic.whatToLearn.length === 0) {
      failures.push(`Mathematical Foundations topic ${topicLabel} must have a non-empty whatToLearn list.`);
    }

    if (!Array.isArray(topic.pitfalls) || topic.pitfalls.length === 0) {
      failures.push(`Mathematical Foundations topic ${topicLabel} must have a non-empty pitfalls list.`);
    }

    if (!Array.isArray(topic.resources) || topic.resources.length === 0) {
      failures.push(`Mathematical Foundations topic ${topicLabel} must have at least one external resource.`);
    } else {
      for (const resource of topic.resources) {
        if (!resource?.label || !resource?.url || !/^https?:\/\//.test(resource.url)) {
          failures.push(`Mathematical Foundations topic ${topicLabel} has an invalid external resource.`);
        }
      }
    }

    if (["linear-algebra", "calculus-and-matrix-calculus", "probability", "statistics", "optimization", "information-theory", "discrete-mathematics-theoretical-computer-science"].includes(topic.group)) {
      if (!Array.isArray(topic.concepts) || topic.concepts.length === 0) {
        failures.push(`Detailed Mathematical Foundations topic ${topicLabel} must explain its named concepts individually.`);
      } else {
        for (const concept of topic.concepts) {
          if (!concept?.title || !concept?.explanation || !concept?.example) {
            failures.push(`Detailed Mathematical Foundations topic ${topicLabel} has an incomplete concept explanation.`);
          }
        }
      }

      if (!Array.isArray(topic.formulas) || topic.formulas.length === 0) {
        failures.push(`Detailed Mathematical Foundations topic ${topicLabel} must include at least one explained formula.`);
      }

      if (!topic.diagram?.caption || !Array.isArray(topic.diagram?.nodes) || topic.diagram.nodes.length < 3) {
        failures.push(`Detailed Mathematical Foundations topic ${topicLabel} must include a structured diagram with at least three nodes.`);
      }

      if (!topic.practice?.question || !topic.practice?.answer) {
        failures.push(`Detailed Mathematical Foundations topic ${topicLabel} must include a practice question and answer.`);
      }
    }

    if (["linear-algebra", "calculus-and-matrix-calculus", "probability", "statistics", "optimization", "information-theory", "discrete-mathematics-theoretical-computer-science"].includes(topic.group)) {
      if (!Array.isArray(topic.prerequisites) || topic.prerequisites.length < 3) {
        failures.push(`Expanded Mathematical Foundations topic ${topicLabel} must include at least three prerequisites.`);
      }

      if (!Array.isArray(topic.notationGuide) || topic.notationGuide.length < 3) {
        failures.push(`Expanded Mathematical Foundations topic ${topicLabel} must include at least three notation entries.`);
      } else if (topic.notationGuide.some((item) => !item?.symbol || !item?.meaning || !item?.latex)) {
        failures.push(`Expanded Mathematical Foundations topic ${topicLabel} has an incomplete notation entry.`);
      }

      if (!Array.isArray(topic.formulas) || topic.formulas.some((item) => !item?.latex)) {
        failures.push(`Expanded Mathematical Foundations topic ${topicLabel} must provide LaTeX for every formula.`);
      }

      if (!topic.derivation?.title || !Array.isArray(topic.derivation?.steps) || topic.derivation.steps.length < 4) {
        failures.push(`Expanded Mathematical Foundations topic ${topicLabel} must include a four-step derivation.`);
      }

      if (!Array.isArray(topic.workedExamples) || topic.workedExamples.length < 2) {
        failures.push(`Expanded Mathematical Foundations topic ${topicLabel} must include at least two additional worked examples.`);
      } else if (topic.workedExamples.some((item) => !item?.title || !item?.setup || !item?.result || !Array.isArray(item?.steps))) {
        failures.push(`Expanded Mathematical Foundations topic ${topicLabel} has an incomplete worked example.`);
      }

      if (!Array.isArray(topic.exercises) || topic.exercises.length < 3) {
        failures.push(`Expanded Mathematical Foundations topic ${topicLabel} must include beginner, intermediate, and applied exercises.`);
      } else {
        const exerciseLevels = new Set(topic.exercises.map((item) => item?.level));
        for (const level of ["Beginner", "Intermediate", "Applied"]) {
          if (!exerciseLevels.has(level)) {
            failures.push(`Expanded Mathematical Foundations topic ${topicLabel} is missing its ${level} exercise.`);
          }
        }
        if (topic.exercises.some((item) => !item?.question || !item?.answer)) {
          failures.push(`Expanded Mathematical Foundations topic ${topicLabel} has an incomplete exercise.`);
        }
      }

      if (!Array.isArray(topic.takeaways) || topic.takeaways.length < 4) {
        failures.push(`Expanded Mathematical Foundations topic ${topicLabel} must include at least four key takeaways.`);
      }

      const topicWordCount = countTopicWords(topic);
      if (topicWordCount < 400 || topicWordCount > 2000) {
        failures.push(`Expanded Mathematical Foundations topic ${topicLabel} should contain 400-2000 words, found ${topicWordCount}.`);
      }
    }

    const expectedPage = path.join(mathematicalTopicDir, topic.id, "index.html");
    if (!(await exists(expectedPage))) {
      failures.push(`Missing Mathematical Foundations deep-dive page: ${relativePath(expectedPage)}`);
      continue;
    }

    const pageHtml = await readFile(expectedPage, "utf8");
    const relativePage = relativePath(expectedPage);

    if (!pageHtml.includes(`data-math-topic="${topic.id}"`)) {
      failures.push(`Mathematical Foundations page ${relativePage} is missing its topic placeholder.`);
    }

    for (const scriptName of ["mathematical-foundations-data.js", "mathematical-foundations-topic.js", "site-template.js"]) {
      const scriptSources = extractHtmlAttributeValues(pageHtml, "src").filter((src) => src.endsWith(scriptName));
      if (scriptSources.length !== 1) {
        failures.push(`Mathematical Foundations page ${relativePage} should include exactly one ${scriptName} script.`);
        continue;
      }

      const scriptTarget = resolveHref(expectedPage, scriptSources[0]);
      if (!(await exists(scriptTarget))) {
        failures.push(`Mathematical Foundations script does not resolve in ${relativePage}: ${scriptSources[0]}`);
      }
    }

    const detailScriptSources = extractHtmlAttributeValues(pageHtml, "src").filter((src) =>
      src.endsWith("linear-algebra-details.js")
    );
    const expectedDetailScriptCount = topic.group === "linear-algebra" ? 1 : 0;
    if (detailScriptSources.length !== expectedDetailScriptCount) {
      failures.push(
        `Mathematical Foundations page ${relativePage} should include ${expectedDetailScriptCount} linear-algebra-details.js script.`
      );
    } else if (detailScriptSources.length === 1) {
      const scriptTarget = resolveHref(expectedPage, detailScriptSources[0]);
      if (!(await exists(scriptTarget))) {
        failures.push(`Linear Algebra detail script does not resolve in ${relativePage}: ${detailScriptSources[0]}`);
      }
    }

    const calculusScriptSources = extractHtmlAttributeValues(pageHtml, "src").filter((src) =>
      src.endsWith("calculus-details.js")
    );
    const expectedCalculusScriptCount = topic.group === "calculus-and-matrix-calculus" ? 1 : 0;
    if (calculusScriptSources.length !== expectedCalculusScriptCount) {
      failures.push(
        `Mathematical Foundations page ${relativePage} should include ${expectedCalculusScriptCount} calculus-details.js script.`
      );
    } else if (calculusScriptSources.length === 1) {
      const scriptTarget = resolveHref(expectedPage, calculusScriptSources[0]);
      if (!(await exists(scriptTarget))) {
        failures.push(`Calculus detail script does not resolve in ${relativePage}: ${calculusScriptSources[0]}`);
      }
    }

    const probabilityScriptSources = extractHtmlAttributeValues(pageHtml, "src").filter((src) =>
      src.endsWith("probability-details.js")
    );
    const expectedProbabilityScriptCount = topic.group === "probability" ? 1 : 0;
    if (probabilityScriptSources.length !== expectedProbabilityScriptCount) {
      failures.push(
        `Mathematical Foundations page ${relativePage} should include ${expectedProbabilityScriptCount} probability-details.js script.`
      );
    } else if (probabilityScriptSources.length === 1) {
      const scriptTarget = resolveHref(expectedPage, probabilityScriptSources[0]);
      if (!(await exists(scriptTarget))) {
        failures.push(`Probability detail script does not resolve in ${relativePage}: ${probabilityScriptSources[0]}`);
      }
    }

    const statisticsScriptSources = extractHtmlAttributeValues(pageHtml, "src").filter((src) =>
      src.endsWith("statistics-details.js")
    );
    const expectedStatisticsScriptCount = topic.group === "statistics" ? 1 : 0;
    if (statisticsScriptSources.length !== expectedStatisticsScriptCount) {
      failures.push(
        `Mathematical Foundations page ${relativePage} should include ${expectedStatisticsScriptCount} statistics-details.js script.`
      );
    } else if (statisticsScriptSources.length === 1) {
      const scriptTarget = resolveHref(expectedPage, statisticsScriptSources[0]);
      if (!(await exists(scriptTarget))) {
        failures.push(`Statistics detail script does not resolve in ${relativePage}: ${statisticsScriptSources[0]}`);
      }
    }

    const optimizationScriptSources = extractHtmlAttributeValues(pageHtml, "src").filter((src) =>
      src.endsWith("optimization-details.js")
    );
    const expectedOptimizationScriptCount = topic.group === "optimization" ? 1 : 0;
    if (optimizationScriptSources.length !== expectedOptimizationScriptCount) {
      failures.push(
        `Mathematical Foundations page ${relativePage} should include ${expectedOptimizationScriptCount} optimization-details.js script.`
      );
    } else if (optimizationScriptSources.length === 1) {
      const scriptTarget = resolveHref(expectedPage, optimizationScriptSources[0]);
      if (!(await exists(scriptTarget))) {
        failures.push(`Optimization detail script does not resolve in ${relativePage}: ${optimizationScriptSources[0]}`);
      }
    }

    const informationTheoryScriptSources = extractHtmlAttributeValues(pageHtml, "src").filter((src) =>
      src.endsWith("information-theory-details.js")
    );
    const expectedInformationTheoryScriptCount = topic.group === "information-theory" ? 1 : 0;
    if (informationTheoryScriptSources.length !== expectedInformationTheoryScriptCount) {
      failures.push(
        `Mathematical Foundations page ${relativePage} should include ${expectedInformationTheoryScriptCount} information-theory-details.js script.`
      );
    } else if (informationTheoryScriptSources.length === 1) {
      const scriptTarget = resolveHref(expectedPage, informationTheoryScriptSources[0]);
      if (!(await exists(scriptTarget))) {
        failures.push(`Information Theory detail script does not resolve in ${relativePage}: ${informationTheoryScriptSources[0]}`);
      }
    }

    const discreteMathematicsScriptSources = extractHtmlAttributeValues(pageHtml, "src").filter((src) =>
      src.endsWith("discrete-mathematics-details.js")
    );
    const expectedDiscreteMathematicsScriptCount =
      topic.group === "discrete-mathematics-theoretical-computer-science" ? 1 : 0;
    if (discreteMathematicsScriptSources.length !== expectedDiscreteMathematicsScriptCount) {
      failures.push(
        `Mathematical Foundations page ${relativePage} should include ${expectedDiscreteMathematicsScriptCount} discrete-mathematics-details.js script.`
      );
    } else if (discreteMathematicsScriptSources.length === 1) {
      const scriptTarget = resolveHref(expectedPage, discreteMathematicsScriptSources[0]);
      if (!(await exists(scriptTarget))) {
        failures.push(`Discrete Mathematics detail script does not resolve in ${relativePage}: ${discreteMathematicsScriptSources[0]}`);
      }
    }

    if (pageHtml.includes('<main class="lesson-main"') || pageHtml.includes('<article class="lesson-article"')) {
      failures.push(`Mathematical Foundations page ${relativePage} should be a topic stub, not copied lesson article markup.`);
    }

    if (pageHtml.includes("<section") || pageHtml.includes("<h1")) {
      failures.push(`Mathematical Foundations page ${relativePage} should render article content from shared data, not copied sections.`);
    }

    const groupPage = path.join(mathematicalFoundationsDir, topic.group, "index.html");
    const groupHtml = await readFile(groupPage, "utf8");
    if (!groupHtml.includes(`href="../topics/${topic.id}/index.html"`)) {
      failures.push(`Mathematical Foundations lesson ${topic.group}/index.html does not link local topic page: ../topics/${topic.id}/index.html`);
    }
  }

  if (await exists(mathematicalTopicDir)) {
    const generatedPages = (await collectHtmlFiles(mathematicalTopicDir)).filter((file) => path.basename(file) === "index.html");
    if (generatedPages.length !== 133) {
      failures.push(`Mathematical Foundations should have exactly 133 generated deep-dive pages, found ${generatedPages.length}.`);
    }
  } else {
    failures.push(`Missing Mathematical Foundations topic directory: ${relativePath(mathematicalTopicDir)}`);
  }
}

async function auditMathematicalFoundationOverviews() {
  const overviewScriptName = "mathematical-foundations-overview.js";
  const groupPages = [
    ["linear-algebra", "linear-algebra-details.js", 22],
    ["calculus-and-matrix-calculus", "calculus-details.js", 14],
    ["probability", "probability-details.js", 34],
    ["statistics", "statistics-details.js", 18],
    ["optimization", "optimization-details.js", 18],
    ["information-theory", "information-theory-details.js", 11],
    ["discrete-mathematics-theoretical-computer-science", "discrete-mathematics-details.js", 16],
  ];

  for (const [group, detailScriptName, expectedTopicCount] of groupPages) {
    const page = path.join(mathematicalFoundationsDir, group, "index.html");
    const html = await readFile(page, "utf8");
    const topicLinks = extractHtmlAttributeValues(html, "href").filter((href) =>
      /^\.\.\/topics\/[^/]+\/index\.html$/.test(href)
    );

    if (topicLinks.length !== expectedTopicCount) {
      failures.push(
        `Mathematical Foundations overview ${group}/index.html should link ${expectedTopicCount} topics, found ${topicLinks.length}.`
      );
    }

    const requiredScripts = [
      "mathematical-foundations-data.js",
      detailScriptName,
      "site-template.js",
      overviewScriptName,
    ];
    const scriptSources = extractHtmlAttributeValues(html, "src");
    const scriptPositions = [];

    for (const scriptName of requiredScripts) {
      const matches = scriptSources.filter((src) => src.endsWith(scriptName));
      if (matches.length !== 1) {
        failures.push(`Mathematical Foundations overview ${group}/index.html should include exactly one ${scriptName}.`);
        continue;
      }

      const scriptTarget = resolveHref(page, matches[0]);
      if (!(await exists(scriptTarget))) {
        failures.push(`Mathematical Foundations overview script does not resolve in ${group}/index.html: ${matches[0]}`);
      }
      scriptPositions.push(scriptSources.indexOf(matches[0]));
    }

    if (
      scriptPositions.length === requiredScripts.length &&
      scriptPositions.some((position, index) => index > 0 && position <= scriptPositions[index - 1])
    ) {
      failures.push(
        `Mathematical Foundations overview ${group}/index.html must load topic data, detail data, site templates, and the overview enhancer in that order.`
      );
    }
  }
}

async function auditClassicalAiTopics() {
  if (!(await exists(classicalAiTopicDataFile))) {
    failures.push("Classical AI topic data file is missing.");
    return;
  }
  if (!(await exists(classicalAiTopicRendererFile))) {
    failures.push("Classical AI topic renderer is missing.");
    return;
  }

  const topics = await loadClassicalAiTopics();
  const ids = topics.map((topic) => topic.id);
  const uniqueIds = new Set(ids);
  if (topics.length !== 85 || uniqueIds.size !== 85) {
    failures.push(`Classical AI must define 85 unique topics; found ${topics.length} entries and ${uniqueIds.size} unique ids.`);
  }

  const indexPath = path.join(classicalAiDir, "index.html");
  const indexHtml = await readFile(indexPath, "utf8");
  let expectedLinks = 0;

  for (const topic of topics) {
    const label = `Classical AI topic ${topic.id || "<missing id>"}`;
    const scalarFields = ["id", "group", "groupLabel", "title", "summary"];
    for (const field of scalarFields) {
      if (typeof topic[field] !== "string" || topic[field].trim() === "") {
        failures.push(`${label} is missing ${field}.`);
      }
    }

    const arrayChecks = [
      ["simple idea paragraphs", topic.simpleIdea, 2],
      ["concepts", topic.concepts, 3],
      ["process steps", topic.process, 4],
      ["formulas", topic.formulas, 1],
      ["AI relevance paragraphs", topic.whyItMatters, 2],
      ["pitfalls", topic.pitfalls, 3],
      ["takeaways", topic.takeaways, 4],
      ["resources", topic.resources, 1],
      ["worked example steps", topic.example?.steps, 3],
      ["diagram nodes", topic.diagram?.nodes, 4],
    ];
    for (const [field, value, minimum] of arrayChecks) {
      if (!Array.isArray(value) || value.length < minimum) {
        failures.push(`${label} needs at least ${minimum} ${field}.`);
      }
    }

    if (!topic.practice?.question || !topic.practice?.answer) {
      failures.push(`${label} needs a practice question and answer.`);
    }
    if (!topic.example?.title || !topic.example?.setup || !topic.example?.result) {
      failures.push(`${label} needs a complete worked example.`);
    }
    if (!topic.formulas?.every((formula) => formula.label && formula.expression && formula.meaning)) {
      failures.push(`${label} has an incomplete formula or formal rule.`);
    }
    if (!topic.resources?.every((resource) => resource.label && /^https:\/\//.test(resource.url))) {
      failures.push(`${label} must retain at least one labelled external HTTPS resource.`);
    }

    const topicPath = path.join(classicalAiTopicDir, topic.id, "index.html");
    if (!(await exists(topicPath))) {
      failures.push(`${label} page is missing: ${relativePath(topicPath)}.`);
      continue;
    }
    const pageHtml = await readFile(topicPath, "utf8");
    const requiredPageFragments = [
      `data-classical-ai-topic="${topic.id}"`,
      'src="../../classical-ai-data.js"',
      'src="../../classical-ai-topic.js"',
      'src="../../../../site-template.js"',
      'href="../../../../styles.css"',
    ];
    for (const fragment of requiredPageFragments) {
      if (!pageHtml.includes(fragment)) {
        failures.push(`${label} page is missing ${fragment}.`);
      }
    }

    const occurrenceCount = Number.isInteger(topic.indexOccurrences) ? topic.indexOccurrences : 1;
    const href = `topics/${topic.id}/index.html`;
    const linkCount = (indexHtml.match(new RegExp(`href="${escapeRegExp(href)}"`, "g")) || []).length;
    if (linkCount !== occurrenceCount) {
      failures.push(`${label} should be linked ${occurrenceCount} time(s) from the phase page; found ${linkCount}.`);
    }
    expectedLinks += occurrenceCount;
  }

  const generatedPages = (await collectHtmlFiles(classicalAiTopicDir)).filter((file) => path.basename(file) === "index.html");
  if (generatedPages.length !== 85) {
    failures.push(`Classical AI topics directory should contain 85 pages; found ${generatedPages.length}.`);
  }
  const localTopicLinks = (indexHtml.match(/href="topics\/[^"/]+\/index\.html"/g) || []).length;
  if (localTopicLinks !== expectedLinks || expectedLinks !== 86) {
    failures.push(`Classical AI phase page should contain 86 local topic links; found ${localTopicLinks}.`);
  }
  if (/<a\s+class="wiki-term"[^>]+href="https?:\/\//i.test(indexHtml)) {
    failures.push("Classical AI phase topics should open local explanations; external references belong inside topic pages.");
  }
}

async function loadClassicalAiTopics() {
  const source = await readFile(classicalAiTopicDataFile, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: classicalAiTopicDataFile });
  return sandbox.window.classicalAiTopics || [];
}

async function auditProbabilisticAiTopics() {
  if (!(await exists(probabilisticAiTopicDataFile))) {
    failures.push("Probabilistic AI topic data file is missing.");
    return;
  }
  if (!(await exists(probabilisticAiTopicRendererFile))) {
    failures.push("Probabilistic AI topic renderer is missing.");
    return;
  }

  const topics = await loadProbabilisticAiTopics();
  const uniqueIds = new Set(topics.map((topic) => topic.id));
  if (topics.length !== 29 || uniqueIds.size !== 29) {
    failures.push(`Probabilistic AI must define 29 unique topics; found ${topics.length} entries and ${uniqueIds.size} unique ids.`);
  }

  const indexPath = path.join(probabilisticAiDir, "index.html");
  const indexHtml = await readFile(indexPath, "utf8");

  for (const topic of topics) {
    const label = `Probabilistic AI topic ${topic.id || "<missing id>"}`;
    for (const field of ["id", "group", "groupLabel", "title", "summary"]) {
      if (typeof topic[field] !== "string" || topic[field].trim() === "") {
        failures.push(`${label} is missing ${field}.`);
      }
    }

    const arrayChecks = [
      ["simple idea paragraphs", topic.simpleIdea, 2],
      ["concepts", topic.concepts, 3],
      ["process steps", topic.process, 4],
      ["formulas", topic.formulas, 1],
      ["AI relevance paragraphs", topic.whyItMatters, 2],
      ["pitfalls", topic.pitfalls, 3],
      ["takeaways", topic.takeaways, 4],
      ["resources", topic.resources, 1],
      ["worked example steps", topic.example?.steps, 3],
      ["diagram nodes", topic.diagram?.nodes, 4],
    ];
    for (const [field, value, minimum] of arrayChecks) {
      if (!Array.isArray(value) || value.length < minimum) {
        failures.push(`${label} needs at least ${minimum} ${field}.`);
      }
    }

    if (!topic.practice?.question || !topic.practice?.answer) {
      failures.push(`${label} needs a practice question and answer.`);
    }
    if (!topic.example?.title || !topic.example?.setup || !topic.example?.result) {
      failures.push(`${label} needs a complete worked example.`);
    }
    if (!topic.formulas?.every((formula) => formula.label && formula.expression && formula.meaning)) {
      failures.push(`${label} has an incomplete formula or probability rule.`);
    }
    if (!topic.resources?.every((resource) => resource.label && /^https:\/\//.test(resource.url))) {
      failures.push(`${label} must retain at least one labelled external HTTPS resource.`);
    }

    const topicPath = path.join(probabilisticAiTopicDir, topic.id, "index.html");
    if (!(await exists(topicPath))) {
      failures.push(`${label} page is missing: ${relativePath(topicPath)}.`);
      continue;
    }
    const pageHtml = await readFile(topicPath, "utf8");
    for (const fragment of [
      `data-probabilistic-ai-topic="${topic.id}"`,
      'src="../../probabilistic-ai-data.js"',
      'src="../../probabilistic-ai-topic.js"',
      'src="../../../../site-template.js"',
      'href="../../../../styles.css"',
    ]) {
      if (!pageHtml.includes(fragment)) {
        failures.push(`${label} page is missing ${fragment}.`);
      }
    }

    const href = `topics/${topic.id}/index.html`;
    const linkCount = (indexHtml.match(new RegExp(`href="${escapeRegExp(href)}"`, "g")) || []).length;
    if (linkCount !== 1) {
      failures.push(`${label} should be linked once from the phase page; found ${linkCount}.`);
    }
  }

  const generatedPages = (await collectHtmlFiles(probabilisticAiTopicDir)).filter((file) => path.basename(file) === "index.html");
  if (generatedPages.length !== 29) {
    failures.push(`Probabilistic AI topics directory should contain 29 pages; found ${generatedPages.length}.`);
  }
  const localTopicLinks = (indexHtml.match(/href="topics\/[^"/]+\/index\.html"/g) || []).length;
  if (localTopicLinks !== 29) {
    failures.push(`Probabilistic AI phase page should contain 29 local topic links; found ${localTopicLinks}.`);
  }
  if (/<a\s+class="wiki-term"[^>]+href="https?:\/\//i.test(indexHtml)) {
    failures.push("Probabilistic AI phase topics should open local explanations; external references belong inside topic pages.");
  }
}

async function loadProbabilisticAiTopics() {
  const source = await readFile(probabilisticAiTopicDataFile, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: probabilisticAiTopicDataFile });
  return sandbox.window.probabilisticAiTopics || [];
}

async function loadMathematicalFoundationsTopics() {
  const source = await readFile(mathematicalTopicDataFile, "utf8");
  const linearAlgebraSource = await readFile(linearAlgebraDetailDataFile, "utf8");
  const calculusSource = await readFile(calculusDetailDataFile, "utf8");
  const probabilitySource = await readFile(probabilityDetailDataFile, "utf8");
  const statisticsSource = await readFile(statisticsDetailDataFile, "utf8");
  const optimizationSource = await readFile(optimizationDetailDataFile, "utf8");
  const informationTheorySource = await readFile(informationTheoryDetailDataFile, "utf8");
  const discreteMathematicsSource = await readFile(discreteMathematicsDetailDataFile, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: mathematicalTopicDataFile });
  vm.runInNewContext(linearAlgebraSource, sandbox, { filename: linearAlgebraDetailDataFile });
  vm.runInNewContext(calculusSource, sandbox, { filename: calculusDetailDataFile });
  vm.runInNewContext(probabilitySource, sandbox, { filename: probabilityDetailDataFile });
  vm.runInNewContext(statisticsSource, sandbox, { filename: statisticsDetailDataFile });
  vm.runInNewContext(optimizationSource, sandbox, { filename: optimizationDetailDataFile });
  vm.runInNewContext(informationTheorySource, sandbox, { filename: informationTheoryDetailDataFile });
  vm.runInNewContext(discreteMathematicsSource, sandbox, { filename: discreteMathematicsDetailDataFile });
  return sandbox.window.mathematicalFoundationTopics || [];
}

async function loadGenerativeModellingTopics() {
  const source = await readFile(generativeTopicDataFile, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: generativeTopicDataFile });
  return sandbox.window.generativeModellingTopics || [];
}

function hasTopicValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== null && value !== "";
}

function countTopicWords(value, key = "") {
  if (["id", "group", "previousId", "nextId", "url"].includes(key)) {
    return 0;
  }

  if (typeof value === "string") {
    return value.trim().split(/\s+/).filter(Boolean).length;
  }

  if (Array.isArray(value)) {
    return value.reduce((total, item) => total + countTopicWords(item), 0);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((total, [childKey, childValue]) => {
      return total + countTopicWords(childValue, childKey);
    }, 0);
  }

  return 0;
}

async function auditLinks(files) {
  for (const file of files) {
    const html = await readFile(file, "utf8");
    const links = extractLocalHrefs(html);

    for (const href of links) {
      const target = resolveHref(file, href);

      if (!(await exists(target))) {
        failures.push(`Broken link in ${relativePath(file)}: ${href} -> ${relativePath(target)}`);
      }
    }
  }
}

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === ".agents" || entry.name === ".codex") {
        continue;
      }

      files.push(...(await collectHtmlFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function extractHtmlAttributeValues(html, attributeName) {
  const values = [];
  const escapedName = escapeRegExp(attributeName);
  const pattern = new RegExp(`\\b${escapedName}="([^"]+)"`, "g");
  let match = pattern.exec(html);

  while (match) {
    values.push(match[1]);
    match = pattern.exec(html);
  }

  return values;
}

function extractObjectPropertyValues(source, propertyName) {
  const values = [];
  const escapedName = escapeRegExp(propertyName);
  const pattern = new RegExp(`\\b${escapedName}:\\s*"([^"]+)"`, "g");
  let match = pattern.exec(source);

  while (match) {
    values.push(match[1]);
    match = pattern.exec(source);
  }

  return values;
}

function extractPhaseGroupSource(source, phaseFolder) {
  const groupStart = source.indexOf(`      "${phaseFolder}": [`);

  if (groupStart === -1) {
    return "";
  }

  const groupEnd = source.indexOf("      ],", groupStart);
  return groupEnd === -1 ? source.slice(groupStart) : source.slice(groupStart, groupEnd);
}

function extractLocalHrefs(html) {
  const links = [];
  const hrefPattern = /\bhref="([^"]+)"/g;
  let match = hrefPattern.exec(html);

  while (match) {
    const href = match[1];
    if (!isExternalOrPageOnlyLink(href)) {
      links.push(href);
    }
    match = hrefPattern.exec(html);
  }

  return links;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isExternalOrPageOnlyLink(href) {
  return (
    href.startsWith("#") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function resolveHref(fromFile, href) {
  const [withoutQuery] = href.split("?");
  const [withoutHash] = withoutQuery.split("#");
  const target = path.resolve(path.dirname(fromFile), withoutHash);

  if (target.endsWith(path.sep) || withoutHash.endsWith("/")) {
    return path.join(target, "index.html");
  }

  return target;
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

function isInside(filePath, directoryPath) {
  const relative = path.relative(directoryPath, filePath);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function relativePath(filePath) {
  return path.relative(rootDir, filePath).replaceAll(path.sep, "/");
}
