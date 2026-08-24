import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const documents = JSON.parse(fs.readFileSync(path.join(root, "content/generated/lessons.json"), "utf8"));
const legacyRoutes = JSON.parse(fs.readFileSync(path.join(root, "content/generated/legacy-routes.json"), "utf8"));
const errors = [];
const seenIds = new Set();
const seenSlugs = new Set();
const generatedLegacy = new Set(documents.map((document) => document.legacyPath));

for (const document of documents) {
  if (seenIds.has(document.id)) errors.push(`Duplicate id: ${document.id}`);
  if (seenSlugs.has(document.slug)) errors.push(`Duplicate slug: ${document.slug}`);
  seenIds.add(document.id);
  seenSlugs.add(document.slug);
  if (!document.title || !document.summary || !document.phase) errors.push(`Missing identity fields: ${document.id}`);
  if (!Array.isArray(document.labs) || document.labs.length === 0) errors.push(`Missing lab: ${document.id}`);
  if (!document.labs.every((lab) => lab.engine && lab.accessibilitySummary && lab.takeaway && lab.parameter)) errors.push(`Invalid lab: ${document.id}`);
  if (!Array.isArray(document.sources) || document.sources.length < 2) errors.push(`Missing curated sources: ${document.id}`);
  if (!document.sources.every((source) => /^https?:\/\//.test(source.url))) errors.push(`Invalid source URL: ${document.id}`);
  if (!fs.existsSync(path.join(root, "content/lessons", `${document.id}.mdx`))) errors.push(`Missing MDX: ${document.id}`);
}

for (const route of legacyRoutes) {
  if (!generatedLegacy.has(route)) errors.push(`Legacy route without document: ${route}`);
}

const summaryCounts = new Map();
for (const document of documents) summaryCounts.set(document.summary, (summaryCounts.get(document.summary) || 0) + 1);
for (const [summary, count] of summaryCounts) {
  if (count > 1) errors.push(`Repeated summary (${count}): ${summary.slice(0, 80)}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Content validation passed: ${documents.length} lessons, ${legacyRoutes.length} legacy routes, ${new Set(documents.map((document) => document.labs[0].engine)).size} lab engines.`);
