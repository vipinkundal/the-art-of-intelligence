import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { reviewedLessons, lessonAliases } from "../content/editorial/reviewed-lessons.mjs";

const root = process.cwd();
const lessonsRoot = path.join(root, "lessons");
const outputRoot = path.join(root, "content", "lessons");
const generatedRoot = path.join(root, "content", "generated");
const updatedAt = "2026-08-24";

const phaseNames = {
  "mathematical-foundations": "Mathematical Foundations",
  "classical-artificial-intelligence": "Classical AI",
  "probabilistic-ai": "Probabilistic AI",
  "generative-modelling": "Generative Modelling",
  "deep-learning": "Deep Learning",
  foundations: "Foundations",
  "machine-learning": "Machine Learning",
  "generative-ai": "Generative AI",
  "ai-systems": "AI Systems",
};

const canonicalSources = {
  "mathematical-foundations": [
    { label: "Mathematics for Machine Learning", url: "https://mml-book.github.io/" },
    { label: "The Matrix Calculus You Need For Deep Learning", url: "https://explained.ai/matrix-calculus/" },
  ],
  "classical-artificial-intelligence": [
    { label: "Artificial Intelligence: A Modern Approach", url: "https://aima.cs.berkeley.edu/" },
    { label: "Berkeley CS 188", url: "https://inst.eecs.berkeley.edu/~cs188/" },
  ],
  "probabilistic-ai": [
    { label: "Probabilistic Machine Learning", url: "https://probml.github.io/pml-book/" },
    { label: "Stanford CS228", url: "https://ermongroup.github.io/cs228-notes/" },
  ],
  "generative-modelling": [
    { label: "Stanford CS236", url: "https://deepgenerativemodels.github.io/" },
    { label: "Lilian Weng: Generative Models", url: "https://lilianweng.github.io/posts/2018-10-13-flow-models/" },
  ],
  "deep-learning": [
    { label: "Deep Learning", url: "https://www.deeplearningbook.org/" },
    { label: "Dive into Deep Learning", url: "https://d2l.ai/" },
  ],
  default: [
    { label: "Artificial Intelligence: A Modern Approach", url: "https://aima.cs.berkeley.edu/" },
    { label: "Google Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course" },
  ],
};

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function decode(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function textOnly(value = "") {
  return decode(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
}

function capture(html, expression) {
  return decode(html.match(expression)?.[1] || "");
}

function titleFromHtml(html, fallback) {
  return capture(html, /data-title="([^"]+)"/i) || capture(html, /<title>([^<|]+)/i) || fallback;
}

function phaseFromPath(legacyPath, html) {
  const segment = legacyPath.split("/")[1] || "foundations";
  return capture(html, /data-eyebrow="([^"]+)"/i) || phaseNames[segment] || segment.replaceAll("-", " ");
}

function sentence(value, fallback) {
  const clean = textOnly(String(value || ""));
  return clean || fallback;
}

function asStrings(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(asStrings).filter(Boolean);
  if (typeof value === "object") {
    return Object.values(value).flatMap(asStrings).filter(Boolean);
  }
  return [sentence(value, "")].filter(Boolean);
}

function unique(values, limit = 8) {
  return [...new Set(values.map((item) => sentence(item, "")).filter((item) => item.length > 12))].slice(0, limit);
}

function substantive(value) {
  return !/learn the definition|the definition and notation for|a small worked example you can compute|where this shows up|the assumptions that make the concept|do not memorize the term|watch for hidden assumptions|check whether the concept is being used|can be used to interpret|^how this (supports|affects|appears in)\b|matters for AI because|it also gives you language for debugging models/i.test(value);
}

function cleanNarrative(narrative) {
  narrative.concepts = narrative.concepts.filter((item) => substantive(item.explanation));
  for (const key of ["process", "pitfalls", "implementation", "takeaways"]) narrative[key] = narrative[key].filter(substantive);
  if (!substantive(narrative.example.setup)) narrative.example = { title: "", setup: "", steps: [], result: "" };
  return narrative;
}

function sourcesFor(phaseKey, resources = []) {
  const normalized = resources
    .map((resource) => typeof resource === "string" ? null : ({ label: sentence(resource.label || resource.title, "Further reading"), url: resource.url || resource.href }))
    .filter((item) => item?.url?.startsWith("http"));
  return uniqueSources([...normalized, ...(canonicalSources[phaseKey] || canonicalSources.default)]).slice(0, 4);
}

function uniqueSources(sources) {
  const seen = new Set();
  return sources.filter((source) => {
    if (!source?.url || seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  });
}

function hash(input) {
  let value = 2166136261;
  for (const character of input) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function labFor(title, summary, legacyPath) {
  const haystack = `${title} ${summary} ${legacyPath}`.toLowerCase();
  const seed = hash(legacyPath);
  const initial = Number((0.24 + (seed % 53) / 100).toFixed(2));
  const base = {
    title: `${title} field lab`,
    summary: `Interrogate the operating geometry of ${title.toLowerCase()} instead of memorizing a definition.`,
    equation: title.match(/eigen|matrix|vector/i) ? "A v = λ v" : title.match(/bayes|probab|distribution/i) ? "p(z|x) ∝ p(x|z)p(z)" : title.match(/optim|gradient|loss/i) ? "θₜ₊₁ = θₜ − η∇L(θₜ)" : "output = mechanism(input, context)",
    accessibilitySummary: `An interactive ${title} diagram. Adjust the main control to compare structure, behavior, and failure boundaries.`,
    takeaway: `Watch what remains invariant as the control changes; that invariant is the durable mental model for ${title}.`,
    parameter: { id: "intensity", label: "Intervention", min: 0, max: 1, step: 0.01, initial, unit: "" },
    seed,
  };

  if (/eigen|matrix|vector|tensor|geometry|manifold|linear algebra|projection|basis|norm|distance|similarity/.test(haystack)) {
    return { engine: "geometry", ...base, vectors: [[1, 0.2], [-0.35, 0.9]], transform: [1.25, 0.35, -0.2, 0.82] };
  }
  if (/probab|bayes|distribution|variance|expectation|markov|uncertain|likelihood|posterior|sampling/.test(haystack)) {
    return { engine: "probability", ...base, modes: [0.28, 0.66], spread: 0.13 };
  }
  if (/optim|gradient|loss|descent|anneal|learning rate|schedule|convex|minimum|regulariz/.test(haystack)) {
    return { engine: "optimization", ...base, minima: [0.24, 0.73], curvature: 0.74 };
  }
  if (/attention|transformer|sequence|token|language|recurrent|lstm|gru|decode|encode/.test(haystack)) {
    return { engine: "sequence", ...base, tokens: title.split(/\s+/).slice(0, 5).concat(["context", "state"]) };
  }
  if (/retriev|embedding|vector database|rag|search index|ranking/.test(haystack)) {
    return { engine: "retrieval", ...base, query: title, documents: ["high signal", "near miss", "distractor", "boundary case"] };
  }
  if (/diffusion|flow|gan|vae|generative|autoencoder|energy-based|score matching|transport/.test(haystack)) {
    return { engine: "transport", ...base, particles: 38, targetShape: seed % 3 };
  }
  if (/image|vision|convolution|cnn|pixel|signal|audio|fourier|filter|wave|spectr/.test(haystack)) {
    return { engine: "signal", ...base, frequency: 2 + (seed % 5), kernel: [0.06, 0.24, 0.4, 0.24, 0.06] };
  }
  if (/reinforcement|policy|reward|value function|q-learning|bandit|agent|game|self-play/.test(haystack)) {
    return { engine: "reinforcement", ...base, states: 7, rewardAt: 5 };
  }
  if (/system|infrastructure|latency|throughput|memory|compute|parallel|serving|quantiz|distill|cache/.test(haystack)) {
    return { engine: "systems", ...base, stages: ["input", "prepare", "compute", "verify", "serve"], bottleneck: seed % 5 };
  }
  if (/safety|evaluation|privacy|security|bias|fairness|govern|calibration|metric|test/.test(haystack)) {
    return { engine: "evaluation", ...base, positiveRate: 0.56, baseRate: 0.34 };
  }
  if (/history|timeline|era|winter|breakthrough|evolution/.test(haystack)) {
    return { engine: "timeline", ...base, events: [1956, 1986, 2012, 2017, 2024] };
  }
  return { engine: "graph", ...base, nodeCount: 6 + (seed % 5), density: Number((0.25 + (seed % 40) / 100).toFixed(2)) };
}

function evaluateData(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
  return context.window;
}

const dataSources = [
  { file: "lessons/mathematical-foundations/mathematical-foundations-data.js", key: "mathematicalFoundationTopics", phaseKey: "mathematical-foundations", route: (id) => `lessons/mathematical-foundations/topics/${id}/index.html` },
  { file: "lessons/classical-artificial-intelligence/classical-ai-data.js", key: "classicalAiTopics", phaseKey: "classical-artificial-intelligence", route: (id) => `lessons/classical-artificial-intelligence/topics/${id}/index.html` },
  { file: "lessons/probabilistic-ai/probabilistic-ai-data.js", key: "probabilisticAiTopics", phaseKey: "probabilistic-ai", route: (id) => `lessons/probabilistic-ai/topics/${id}/index.html` },
  { file: "lessons/generative-modelling/generative-modelling-data.js", key: "generativeModellingTopics", phaseKey: "generative-modelling", route: (id) => `lessons/generative-modelling/topics/${id}/index.html` },
  { file: "lessons/deep-learning/deep-learning-data.js", key: "deepLearningTopics", phaseKey: "deep-learning", route: (id) => `lessons/deep-learning/topics/${id}/index.html` },
];

const topicByRoute = new Map();
for (const source of dataSources) {
  const topics = evaluateData(source.file)[source.key] || [];
  for (const topic of topics) topicByRoute.set(source.route(topic.id), { topic, phaseKey: source.phaseKey });
}

function staticNarrative(html, title, summary) {
  const sections = [...html.matchAll(/<section[^>]*>([\s\S]*?)<\/section>/gi)].map((match) => {
    const block = match[1];
    const heading = capture(block, /<h2[^>]*>([\s\S]*?)<\/h2>/i) || "Operating note";
    const points = unique([
      ...[...block.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((item) => textOnly(item[1])),
      ...[...block.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((item) => textOnly(item[1])),
    ], 5);
    return points.length ? { heading, points } : null;
  }).filter(Boolean);

  return {
    hook: "",
    overview: summary,
    concepts: sections.flatMap((section) => section.points.map((point) => ({ title: section.heading, explanation: point }))).slice(0, 8),
    process: sections.find((section) => /work|process|idea|understand|flow/i.test(section.heading))?.points || sections[0]?.points || [],
    formulas: [],
    example: { title: `${title} example`, setup: sections.find((section) => /example/i.test(section.heading))?.points[0] || "", steps: sections.find((section) => /example/i.test(section.heading))?.points.slice(1) || [], result: "" },
    pitfalls: sections.find((section) => /pitfall|mistake|limit|risk/i.test(section.heading))?.points || [],
    implementation: [],
    takeaways: unique([summary, ...(sections.at(-1)?.points || [])], 4),
  };
}

function topicNarrative(topic) {
  const example = topic.example && typeof topic.example === "object" ? topic.example : { title: "Worked example", setup: sentence(topic.example, topic.summary), steps: [], result: sentence(topic.example, topic.summary) };
  return {
    hook: "",
    overview: sentence(topic.summary, topic.title),
    concepts: (topic.concepts || topic.whatToLearn || []).map((item) => typeof item === "string" ? ({ title: "Concept", explanation: sentence(item, "") }) : ({ title: sentence(item.title || item.label, `${topic.title} concept`), explanation: sentence(item.explanation || item.meaning || item.description, "") })).slice(0, 8),
    process: unique(asStrings(topic.process || topic.howItWorks), 7),
    formulas: (topic.formulas || []).map((formula) => ({ label: sentence(formula.label, "Working equation"), expression: sentence(formula.expression, ""), meaning: sentence(formula.meaning, "") })).filter((formula) => formula.expression).slice(0, 4),
    example: { title: sentence(example.title, `${topic.title} worked example`), setup: sentence(example.setup, ""), steps: unique(asStrings(example.steps), 6), result: sentence(example.result, "") },
    pitfalls: unique(asStrings(topic.pitfalls), 6),
    implementation: [],
    takeaways: unique(asStrings(topic.takeaways || topic.whyItMatters || topic.simpleIdea), 4),
  };
}

function externalSourcesFromHtml(html) {
  return [...html.matchAll(/<a[^>]+href="(https?:\/\/[^"#]+)"[^>]*>([\s\S]*?)<\/a>/gi)].map((match) => ({ url: decode(match[1]), label: textOnly(match[2]) || "Further reading" }));
}

const legacyFiles = walk(lessonsRoot)
  .filter((file) => file.endsWith(`${path.sep}index.html`))
  .map((file) => path.relative(root, file).split(path.sep).join("/"))
  .filter((legacyPath) => legacyPath !== "lessons/index.html" && !legacyPath.includes("/_template/"));

const routes = new Set([...legacyFiles, ...topicByRoute.keys(), ...Object.keys(reviewedLessons).map((slug) => `lessons/${slug}/index.html`)]);
const documents = [];

for (const legacyPath of [...routes].sort()) {
  const absolute = path.join(root, legacyPath);
  const html = fs.existsSync(absolute) ? fs.readFileSync(absolute, "utf8") : "";
  const dynamic = topicByRoute.get(legacyPath);
  const phaseKey = dynamic?.phaseKey || legacyPath.split("/")[1] || "foundations";
  const fallbackTitle = legacyPath.split("/").at(-2).replaceAll("-", " ");
  const rawTitle = dynamic?.topic.title || titleFromHtml(html, fallbackTitle);
  const title = rawTitle.replace(/^\d+(?:\.\d+)?[.\s]+/, "");
  const summary = sentence(dynamic?.topic.summary || capture(html, /data-summary="([^"]+)"/i) || capture(html, /<meta[^>]+name="description"[^>]+content="([^"]+)"/i), `A field guide to the mechanisms, assumptions, and operating limits of ${title}.`);
  const narrative = cleanNarrative(dynamic ? topicNarrative(dynamic.topic) : staticNarrative(html, title, summary));

  const phase = phaseNames[phaseKey] || phaseFromPath(legacyPath, html).replace(/^Phase\s+\d+(?:\.\d+)?$/i, title);
  const sources = sourcesFor(phaseKey, [...(dynamic?.topic.resources || []), ...externalSourcesFromHtml(html)]);
  const slug = legacyPath.replace(/^lessons\//, "").replace(/\/index\.html$/, "");
  const id = slug.replaceAll("/", "--");
  const lab = labFor(title, summary, legacyPath);
  // A keyword-selected illustration does not establish a mathematical relation.
  // Only source-provided or editorially reviewed equations belong in the lesson.
  lab.equation = "";
  lab.summary = "Illustrative diagram. Its control changes the drawing, not a calculated result for this topic.";
  lab.takeaway = `This ${title} illustration is awaiting a topic-specific mathematical review; use the written sources for its assumptions.`;
  const headings = ["Field lab", "Operational model", "Worked example", "Failure modes", "Implementation notes", "Sources"];
  const tags = unique([phase, phaseKey.replaceAll("-", " "), ...title.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3)], 6);

  documents.push({
    id,
    slug,
    canonicalSlug: lessonAliases[slug] || slug,
    reviewStatus: "pending",
    legacyPath: `/${legacyPath}`,
    phase,
    phaseKey,
    title,
    summary,
    prerequisites: [],
    outcomes: [],
    tags,
    updatedAt,
    sources,
    headings,
    labs: [lab],
    narrative,
  });
  const document = documents.at(-1);
  const reviewed = reviewedLessons[document.canonicalSlug];
  if (reviewed) {
    Object.assign(document, reviewed, { reviewStatus: "reviewed", updatedAt: "2026-09-28" });
  }
  document.headings = ["Field lab", "Operational model", ...(document.narrative.process.length ? ["Mechanism"] : []), ...(document.narrative.formulas.length ? ["Formulas"] : []), ...(document.narrative.example.setup ? ["Worked example"] : []), ...(document.narrative.pitfalls.length ? ["Failure modes"] : []), ...(document.narrative.implementation.length ? ["Implementation notes"] : []), "Sources"];
}

documents.sort((a, b) => a.phaseKey.localeCompare(b.phaseKey) || a.title.localeCompare(b.title));
for (let index = 0; index < documents.length; index += 1) {
  const document = documents[index];
  const siblings = documents.filter((candidate) => candidate.phaseKey === document.phaseKey && candidate.canonicalSlug === candidate.slug);
  const position = siblings.findIndex((candidate) => candidate.slug === document.canonicalSlug);
  // Browse order is not a prerequisite relation. Dependencies are authored explicitly.
  document.previous = siblings[position - 1]?.slug || null;
  document.next = siblings[position + 1]?.slug || null;
}

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });
fs.mkdirSync(generatedRoot, { recursive: true });

for (const document of documents) {
  // Omit exact repetitions already visible in the hero or first lab, without
  // discarding the authored content or legacy fragment targets.
  const firstLab = document.labs[0];
  const presentedText = [document.summary, ...document.outcomes, firstLab.summary, firstLab.equation, firstLab.assumptions, firstLab.takeaway].filter(Boolean);
  const mdx = `import { LessonBody } from "@/components/lesson/LessonBody";\n\nexport const narrative = ${JSON.stringify(document.narrative, null, 2)};\n\n<LessonBody narrative={narrative} presentedText={${JSON.stringify(presentedText)}} />\n`;
  fs.writeFileSync(path.join(outputRoot, `${document.id}.mdx`), mdx);
}

const publicDocuments = documents.map(({ narrative, ...metadata }) => metadata);
fs.writeFileSync(path.join(generatedRoot, "lessons.json"), `${JSON.stringify(publicDocuments, null, 2)}\n`);
fs.writeFileSync(path.join(generatedRoot, "legacy-routes.json"), `${JSON.stringify(legacyFiles.map((legacyPath) => `/${legacyPath}`).sort(), null, 2)}\n`);

const loaderLines = documents.map((document) => `  ${JSON.stringify(document.slug)}: () => import(${JSON.stringify(`../lessons/${document.id}.mdx`)}),`).join("\n");
fs.writeFileSync(path.join(generatedRoot, "lesson-loaders.ts"), `import type { ComponentType } from "react";\n\ntype LessonModule = { default: ComponentType };\n\nexport const lessonLoaders: Record<string, () => Promise<LessonModule>> = {\n${loaderLines}\n};\n`);

const titlesById = new Map(documents.map((document) => [document.id, document.title]));
// A relationship map must contain authored concepts, not engine IDs, title
// fragments, phase labels or editorial-status tags from the search metadata.
const glossary = documents.filter((document) => document.slug === document.canonicalSlug).map((document) => ({ term: document.title, definition: document.summary, phase: document.phase, href: `/lessons/${document.slug}/`, tags: document.prerequisites.map((id) => titlesById.get(id)).filter(Boolean) })).sort((a, b) => a.term.localeCompare(b.term));
fs.writeFileSync(path.join(generatedRoot, "glossary.json"), `${JSON.stringify(glossary, null, 2)}\n`);

console.log(`Generated ${documents.length} lesson documents (${legacyFiles.length} legacy lesson routes). Run content:validate and audit:editorial to check structure and review coverage.`);
