#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lessonsDir = path.join(rootDir, "lessons");
const lessonDataFile = path.join(rootDir, "lesson-data.js");
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
