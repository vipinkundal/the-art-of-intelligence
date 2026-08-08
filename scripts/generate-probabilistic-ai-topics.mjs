import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lessonDir = path.join(root, "lessons", "probabilistic-ai");
const topicsDir = path.join(lessonDir, "topics");
const dataPath = path.join(lessonDir, "probabilistic-ai-data.js");
const indexPath = path.join(lessonDir, "index.html");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function loadTopics(source) {
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: dataPath });
  return context.window.probabilisticAiTopics || [];
}

function pageFor(topic) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(topic.summary)}">
  <title>${escapeHtml(topic.title)} | The Art of Intelligence</title>
  <link rel="stylesheet" href="../../../../styles.css">
</head>
<body>
  <div data-site-header data-root="../../../../" data-active="lessons"></div>
  <div data-probabilistic-ai-topic="${escapeHtml(topic.id)}"></div>
  <div data-site-footer></div>
  <script src="../../probabilistic-ai-data.js"></script>
  <script src="../../probabilistic-ai-topic.js"></script>
  <script src="../../../../site-template.js"></script>
</body>
</html>
`;
}

const source = await readFile(dataPath, "utf8");
const topics = loadTopics(source);
if (topics.length !== 29 || new Set(topics.map((topic) => topic.id)).size !== 29) {
  throw new Error(`Expected 29 unique Probabilistic AI topics, found ${topics.length}.`);
}

await mkdir(topicsDir, { recursive: true });
for (const topic of topics) {
  const topicDir = path.resolve(topicsDir, topic.id);
  if (path.dirname(topicDir) !== topicsDir) {
    throw new Error(`Refusing unsafe topic path: ${topic.id}`);
  }
  await mkdir(topicDir, { recursive: true });
  await writeFile(path.join(topicDir, "index.html"), pageFor(topic), "utf8");
}

let indexHtml = await readFile(indexPath, "utf8");
for (const topic of topics) {
  const title = escapeRegExp(topic.title);
  const localAnchor = `<a class="wiki-term" href="topics/${topic.id}/index.html">${topic.title}</a>`;
  const linked = new RegExp(`<a\\s+class="wiki-term"[^>]*>${title}<\\/a>`, "g");
  const plain = new RegExp(`<strong>${title}:<\\/strong>`, "g");
  let matches = 0;
  indexHtml = indexHtml.replace(linked, () => {
    matches += 1;
    return localAnchor;
  });
  indexHtml = indexHtml.replace(plain, () => {
    matches += 1;
    return `<strong>${localAnchor}:</strong>`;
  });
  if (matches !== 1) {
    throw new Error(`Expected one index occurrence for ${topic.title}, found ${matches}.`);
  }
}

await writeFile(indexPath, indexHtml, "utf8");
console.log(`Generated ${topics.length} Probabilistic AI topic pages and linked ${topics.length} index entries.`);
