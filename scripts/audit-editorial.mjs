import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const documents = JSON.parse(fs.readFileSync(path.join(root, "content/generated/lessons.json"), "utf8"));
const canonical = documents.filter((d) => d.slug === d.canonicalSlug);
const inventory = canonical.map((document) => {
  const mdx = fs.readFileSync(path.join(root, "content/lessons", `${document.id}.mdx`), "utf8");
  const n = JSON.parse(mdx.match(/export const narrative = ([\s\S]+);\n\n<LessonBody/)[1]);
  const issues = [];
  if (document.reviewStatus !== "reviewed") issues.push("Factual and source review pending");
  if (document.labs.some((lab) => lab.engine !== "calculation")) issues.push("Topic-specific calculated or explanatory visual needed");
  if (!n.concepts.length) issues.push("Explanations needed");
  if (!n.example.setup || !n.example.steps.length || !n.example.result) issues.push("Worked example needed");
  if (!n.pitfalls.length) issues.push("Assumptions and failure modes needed");
  if (!n.implementation.length) issues.push("Implementation context needed");
  return { slug: document.slug, title: document.title, phase: document.phaseKey, reviewStatus: document.reviewStatus, issues };
});
const paragraphs = new Map();
for (const document of canonical) {
  const mdx = fs.readFileSync(path.join(root, "content/lessons", `${document.id}.mdx`), "utf8");
  const n = JSON.parse(mdx.match(/export const narrative = ([\s\S]+);\n\n<LessonBody/)[1]);
  for (const paragraph of new Set([...n.concepts.map((c) => c.explanation), ...n.process, ...n.pitfalls, ...n.implementation])) {
    if (paragraph.length < 70) continue;
    const normalized = paragraph.replaceAll(document.title, "[TOPIC]").toLowerCase().replace(/\s+/g, " ").trim();
    paragraphs.set(normalized, [...(paragraphs.get(normalized) || []), document.slug]);
  }
}
const repeatedPassages = [...paragraphs].filter(([, routes]) => routes.length > 2).map(([text, routes]) => ({ text, routes }));
const report = { scope: "All canonical lesson documents; checks describe editorial gaps, not independent factual certification.", total: canonical.length, reviewed: inventory.filter((item) => !item.issues.length).length, pending: inventory.filter((item) => item.issues.length).length, aliases: documents.filter((d) => d.slug !== d.canonicalSlug).map(({ slug, canonicalSlug }) => ({ slug, canonicalSlug })), repeatedPassages, inventory };
fs.writeFileSync(path.join(root, "content/generated/editorial-audit.json"), JSON.stringify(report, null, 2) + "\n");
console.log(`${report.reviewed}/${report.total} canonical lessons reviewed; ${report.pending} remain. ${report.aliases.length} duplicate addresses retained as aliases. ${repeatedPassages.length} repeated passages require editorial review.`);
if (process.argv.includes("--require-complete") && (report.pending || repeatedPassages.length)) process.exitCode = 1;
