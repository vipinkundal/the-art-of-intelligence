#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignoredFolders = new Set([".git", ".agents", ".codex", "node_modules"]);
const headerPattern = /    <header class="site-header">[\s\S]*?    <\/header>\n\n/;
const footerPattern =
  /    <footer class="site-footer">\n      <p>The Art of Intelligence: a simple roadmap for learning AI clearly\.<\/p>\n    <\/footer>\n/;

const htmlFiles = await collectHtmlFiles(rootDir);
let changedCount = 0;

for (const file of htmlFiles) {
  const relativePath = path.relative(rootDir, file).replaceAll(path.sep, "/");
  const originalHtml = await readFile(file, "utf8");
  const rootPrefix = rootPrefixFor(relativePath);
  const active = activeSectionFor(relativePath);
  let html = originalHtml;

  html = html.replace(headerPattern, renderHeaderPlaceholder({ rootPrefix, active }));
  html = html.replace(footerPattern, renderFooterPlaceholder());

  if (!html.includes("data-site-footer")) {
    html = insertBeforeFirstScriptOrBodyClose(html, renderFooterPlaceholder());
  }

  if (!html.includes("site-template.js")) {
    html = insertBeforeFirstScriptOrBodyClose(html, `    <script src="${rootPrefix}site-template.js"></script>\n`);
  }

  if (html !== originalHtml) {
    await writeFile(file, html);
    changedCount += 1;
  }
}

console.log(`Applied site templates to ${changedCount} HTML file${changedCount === 1 ? "" : "s"}.`);

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredFolders.has(entry.name)) {
        files.push(...(await collectHtmlFiles(fullPath)));
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function rootPrefixFor(relativePath) {
  const depth = path.posix.dirname(relativePath) === "." ? 0 : path.posix.dirname(relativePath).split("/").length;
  return "../".repeat(depth);
}

function activeSectionFor(relativePath) {
  if (relativePath === "terms/index.html") {
    return "terms";
  }

  if (relativePath === "lessons/learning-sequence/index.html") {
    return "sequence";
  }

  if (relativePath.startsWith("lessons/")) {
    return "lessons";
  }

  return "";
}

function renderHeaderPlaceholder({ rootPrefix, active }) {
  const activeAttribute = active ? ` data-active="${active}"` : "";
  return `    <div data-site-header data-root="${rootPrefix}"${activeAttribute}></div>\n\n`;
}

function renderFooterPlaceholder() {
  return "    <div data-site-footer></div>\n";
}

function insertBeforeFirstScriptOrBodyClose(html, insertion) {
  const firstScriptIndex = html.indexOf("    <script ");
  const insertAt = firstScriptIndex === -1 ? html.indexOf("  </body>") : firstScriptIndex;

  if (insertAt === -1) {
    throw new Error("Could not find insertion point before script or body close.");
  }

  return `${html.slice(0, insertAt)}${insertion}${html.slice(insertAt)}`;
}
