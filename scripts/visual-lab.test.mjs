import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { searchGlossary } from "../lib/content/glossary-search.ts";

const lessons = JSON.parse(fs.readFileSync(new URL("../content/generated/lessons.json", import.meta.url), "utf8"));
const supportedEngines = new Set(["calculation", "geometry", "probability", "optimization", "sequence", "retrieval", "transport", "signal", "reinforcement", "systems", "evaluation", "timeline", "graph"]);

test("every learning document owns a valid lab configuration", () => {
  assert.ok(lessons.length >= 382);
  for (const lesson of lessons) {
    assert.ok(lesson.labs.length >= 1, lesson.id);
    const lab = lesson.labs[0];
    assert.ok(supportedEngines.has(lab.engine), `${lesson.id}: ${lab.engine}`);
    assert.ok(lab.parameter.initial >= lab.parameter.min && lab.parameter.initial <= lab.parameter.max, lesson.id);
    assert.ok(lab.accessibilitySummary.length > 30, lesson.id);
    assert.ok(lab.takeaway.length > 30, lesson.id);
  }
});

test("the corpus uses only supported lab engines", () => {
  const used = new Set(lessons.map((lesson) => lesson.labs[0].engine));
  assert.ok([...used].every((engine) => supportedEngines.has(engine)));
});

test("duplicate topics share a canonical document without dropping legacy addresses", () => {
  const visible = lessons.filter((lesson) => lesson.slug === lesson.canonicalSlug);
  const names = visible.map((lesson) => lesson.title.toLowerCase().replace(/[^a-z0-9]/g, ""));
  assert.equal(new Set(names).size, names.length);
  for (const name of ["early-stopping", "markov-chains", "multiple-testing-correction"]) {
    const alias = lessons.find((lesson) => lesson.slug === `mathematical-foundations/topics/${name}`);
    assert.ok(alias);
    const canonical = visible.find((lesson) => lesson.slug === alias.canonicalSlug);
    assert.ok(canonical);
    assert.equal(alias.summary, canonical.summary);
  }
});

test("legacy paths are unique and map to exported index files", () => {
  const paths = lessons.map((lesson) => lesson.legacyPath);
  assert.equal(new Set(paths).size, paths.length);
  assert.ok(paths.every((legacyPath) => legacyPath.startsWith("/lessons/") && legacyPath.endsWith("/index.html")));
});

test("generated lessons do not expose unfinished authoring prompts", () => {
  const directory = new URL("../content/lessons/", import.meta.url);
  for (const filename of fs.readdirSync(directory).filter((name) => name.endsWith(".mdx"))) {
    const content = fs.readFileSync(new URL(filename, directory), "utf8");
    assert.doesNotMatch(content, /How this (?:supports|affects|appears in)\b|matters for AI because|it also gives you language for debugging models/i, filename);
  }
});

test("glossary relationship labels are authored prerequisites, never internal tags", () => {
  const glossary=JSON.parse(fs.readFileSync(new URL("../content/generated/glossary.json",import.meta.url),"utf8"));
  for(const item of glossary){
    const lesson=lessons.find(l=>`/lessons/${l.slug}/`===item.href);
    assert.ok(lesson,item.href);
    assert.deepEqual(item.tags,lesson.prerequisites.map(id=>lessons.find(l=>l.id===id).title));
  }
  assert.deepEqual(glossary.find(item=>item.term==="Standard error").tags,["Variance and covariance","Point estimation"]);
});

test("exact glossary term wins over lessons that mention it as a prerequisite",()=>{
  const glossary=JSON.parse(fs.readFileSync(new URL("../content/generated/glossary.json",import.meta.url),"utf8"));
  for(const item of glossary)assert.equal(searchGlossary(glossary,` ${item.term.toUpperCase()} `)[0].href,item.href);
  assert.equal(searchGlossary(glossary,"standard error")[0].term,"Standard error");
  assert.deepEqual(searchGlossary(glossary,"no-such-concept-987"),[]);
});
