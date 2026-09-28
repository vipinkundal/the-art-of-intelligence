import fs from "node:fs";
import path from "node:path";
import { lessonCollectionSchema } from "../lib/content/schema.ts";

const root = process.cwd();
const documents = JSON.parse(fs.readFileSync(path.join(root, "content/generated/lessons.json"), "utf8"));
const legacyRoutes = JSON.parse(fs.readFileSync(path.join(root, "content/generated/legacy-routes.json"), "utf8"));
const errors = [];
const parsed = lessonCollectionSchema.safeParse(documents);
if (!parsed.success) errors.push(parsed.error.message);
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
  const canonical = documents.find((item) => item.slug === document.canonicalSlug);
  if (!canonical || canonical.canonicalSlug !== canonical.slug) errors.push(`Unresolved canonical route: ${document.slug}`);
  for (const prerequisite of document.prerequisites) {
    if (prerequisite === document.id || !documents.some((item) => item.id === prerequisite && item.slug === item.canonicalSlug)) errors.push(`Invalid prerequisite: ${document.id} -> ${prerequisite}`);
  }
  for (const lab of document.labs) {
    const p = lab.parameter;
    if (!(p.min < p.max && p.step > 0 && p.initial >= p.min && p.initial <= p.max)) errors.push(`Invalid parameter bounds: ${document.id}`);
  }
  if (document.reviewStatus === "reviewed") {
    if (document.labs.some((lab) => lab.engine !== "calculation")) errors.push(`Reviewed lesson has an unverified illustration: ${document.id}`);
    const mdx = fs.readFileSync(path.join(root, "content/lessons", `${document.id}.mdx`), "utf8");
    const narrative = JSON.parse(mdx.match(/export const narrative = ([\s\S]+);\n\n<LessonBody/)[1]);
    if (!narrative.hook || narrative.concepts.length < 2 || !narrative.example.steps.length || !narrative.example.result || !narrative.formulas.length || narrative.pitfalls.length < 2 || !narrative.implementation.length) errors.push(`Incomplete reviewed content: ${document.id}`);
    if (/follow the quantity that survives|output = mechanism|the definition and notation for|can be used to interpret/i.test(mdx)) errors.push(`Boilerplate in reviewed content: ${document.id}`);
  }
}

for (const route of legacyRoutes) {
  if (!generatedLegacy.has(route)) errors.push(`Legacy route without document: ${route}`);
}

const summaryCounts = new Map();
for (const document of documents.filter((item) => item.canonicalSlug === item.slug)) summaryCounts.set(document.summary, (summaryCounts.get(document.summary) || 0) + 1);
for (const [summary, count] of summaryCounts) {
  if (count > 1) errors.push(`Repeated summary (${count}): ${summary.slice(0, 80)}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const canonical = documents.filter((item) => item.canonicalSlug === item.slug);
console.log(`Structural validation passed: ${canonical.length} canonical lessons, ${legacyRoutes.length} legacy routes. Editorial review: ${canonical.filter((item) => item.reviewStatus === "reviewed").length} reviewed, ${canonical.filter((item) => item.reviewStatus === "pending").length} pending. Structural validation does not certify factual accuracy.`);
