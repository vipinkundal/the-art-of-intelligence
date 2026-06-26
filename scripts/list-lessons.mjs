#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lessonsDir = path.join(rootDir, "lessons");
const ignoredLessonFolders = new Set(["_template"]);

const phases = await collectLessons();
const topicCount = phases.reduce((count, phase) => count + phase.topics.length, 0);

console.log(`Lessons: ${topicCount} topic page${topicCount === 1 ? "" : "s"} across ${phases.length} phase folder${phases.length === 1 ? "" : "s"}`);

for (const phase of phases) {
  console.log(`\n${phase.title}`);

  if (phase.topics.length === 0) {
    console.log("  No topic pages yet.");
    continue;
  }

  for (const topic of phase.topics) {
    console.log(`  - ${topic.title} (${topic.path})`);
  }
}

async function collectLessons() {
  const entries = await readdir(lessonsDir, { withFileTypes: true });
  const phaseFolders = entries
    .filter((entry) => entry.isDirectory() && !ignoredLessonFolders.has(entry.name))
    .map((entry) => entry.name)
    .sort();

  const phases = [];

  for (const phaseFolder of phaseFolders) {
    const phaseDir = path.join(lessonsDir, phaseFolder);
    const phaseIndex = path.join(phaseDir, "index.html");
    const phaseTitle = (await readTitle(phaseIndex)) || titleCase(phaseFolder);
    const topicEntries = await readdir(phaseDir, { withFileTypes: true });
    const topics = [];

    for (const topicEntry of topicEntries) {
      if (!topicEntry.isDirectory()) {
        continue;
      }

      const topicIndex = path.join(phaseDir, topicEntry.name, "index.html");
      if (!(await isFile(topicIndex))) {
        continue;
      }

      topics.push({
        path: path.relative(rootDir, topicIndex).replaceAll(path.sep, "/"),
        title: (await readHeading(topicIndex)) || titleCase(topicEntry.name),
      });
    }

    topics.sort((left, right) => left.title.localeCompare(right.title, undefined, { numeric: true }));
    phases.push({ title: phaseTitle, topics });
  }

  return phases;
}

async function readTitle(filePath) {
  if (!(await isFile(filePath))) {
    return null;
  }

  const html = await readFile(filePath, "utf8");
  const titleMatch = html.match(/<title>(.*?)\s*\|\s*The Art of Intelligence<\/title>/s);
  return titleMatch ? cleanText(titleMatch[1]) : null;
}

async function readHeading(filePath) {
  const html = await readFile(filePath, "utf8");
  const headingMatch = html.match(/<h1(?:\s[^>]*)?>(.*?)<\/h1>/s);
  return headingMatch ? cleanText(headingMatch[1]) : null;
}

function cleanText(value) {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

function titleCase(value) {
  return String(value)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
