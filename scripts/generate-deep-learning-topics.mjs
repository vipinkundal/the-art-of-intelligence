#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deepLearningDir = path.join(rootDir, "lessons", "deep-learning");
const topicDir = path.join(deepLearningDir, "topics");
const dataFile = path.join(deepLearningDir, "deep-learning-data.js");
const indexFile = path.join(deepLearningDir, "index.html");

const source = await readFile(dataFile, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: dataFile });
const topics = sandbox.window.deepLearningTopics || [];

if (topics.length !== 52) {
  throw new Error(`Expected 52 Deep Learning topics, found ${topics.length}.`);
}

for (const topic of topics) {
  const targetDir = path.join(topicDir, topic.id);
  const relativeTarget = path.relative(topicDir, targetDir);

  if (!relativeTarget || relativeTarget.startsWith("..") || path.isAbsolute(relativeTarget)) {
    throw new Error(`Refusing to generate an unsafe topic path for ${topic.id}.`);
  }

  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, "index.html"), renderTopicStub(topic), "utf8");
}

let indexHtml = await readFile(indexFile, "utf8");

for (const topic of topics) {
  const anchorPattern = new RegExp(
    `<a class="wiki-term" href="[^"]+"[^>]*>${escapeRegExp(topic.title)}</a>`,
    "g"
  );
  const localAnchor = `<a class="wiki-term" href="topics/${topic.id}/index.html">${topic.title}</a>`;
  const matches = indexHtml.match(anchorPattern) || [];

  if (matches.length !== 1) {
    throw new Error(`Expected one index link for ${topic.title}, found ${matches.length}.`);
  }

  indexHtml = indexHtml.replace(anchorPattern, localAnchor);
}

await writeFile(indexFile, indexHtml, "utf8");
console.log(`Generated ${topics.length} Deep Learning topic pages and updated their index links.`);

function renderTopicStub(topic) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(topic.title)} | Deep Learning Foundations | The Art of Intelligence</title>
    <link rel="stylesheet" href="../../../../styles.css">
  </head>
  <body>
    <div data-site-header data-root="../../../../" data-active="lessons"></div>

    <div data-deep-learning-topic="${escapeHtml(topic.id)}"></div>

    <div data-site-footer></div>
    <script src="../../deep-learning-data.js"></script>
    <script src="../../deep-learning-topic.js"></script>
    <script src="../../../../site-template.js"></script>
  </body>
</html>
`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
