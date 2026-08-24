import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const lessons = JSON.parse(fs.readFileSync(new URL("../content/generated/lessons.json", import.meta.url), "utf8"));
const supportedEngines = new Set(["geometry", "probability", "optimization", "sequence", "retrieval", "transport", "signal", "reinforcement", "systems", "evaluation", "timeline", "graph"]);

test("every learning document owns a valid lab configuration", () => {
  assert.equal(lessons.length, 382);
  for (const lesson of lessons) {
    assert.ok(lesson.labs.length >= 1, lesson.id);
    const lab = lesson.labs[0];
    assert.ok(supportedEngines.has(lab.engine), `${lesson.id}: ${lab.engine}`);
    assert.ok(lab.parameter.initial >= lab.parameter.min && lab.parameter.initial <= lab.parameter.max, lesson.id);
    assert.ok(lab.accessibilitySummary.length > 30, lesson.id);
    assert.ok(lab.takeaway.includes(lesson.title), lesson.id);
  }
});

test("the corpus exercises every reusable lab engine", () => {
  const used = new Set(lessons.map((lesson) => lesson.labs[0].engine));
  assert.deepEqual([...used].sort(), [...supportedEngines].sort());
});

test("legacy paths are unique and map to exported index files", () => {
  const paths = lessons.map((lesson) => lesson.legacyPath);
  assert.equal(new Set(paths).size, paths.length);
  assert.ok(paths.every((legacyPath) => legacyPath.startsWith("/lessons/") && legacyPath.endsWith("/index.html")));
});
