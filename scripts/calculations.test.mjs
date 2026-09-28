import assert from "node:assert/strict";
import test from "node:test";
import { binomialMass, binaryEntropy, binaryCrossEntropy, expectedBrier, markovDistribution, stoppingCheckpoint, conformalRadius, calculate } from "../lib/content/calculations.ts";
import { reviewedLessons } from "../content/editorial/reviewed-lessons.mjs";
import { multiply, kronecker, linearModels } from "../lib/content/linear-algebra.ts";
const near = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

test("binomial mass stays normalized including degenerate endpoints and has the correct moments", () => {
  for (const n of [1, 10]) for (const p of [0, 0.01, 0.3, 0.5, 0.99, 1]) {
    const mass = binomialMass(n, p);
    near(mass.reduce((s, [, v]) => s + v, 0), 1);
    near(mass.reduce((s, [k, v]) => s + k * v, 0), n * p);
    near(mass.reduce((s, [k, v]) => s + (k - n * p) ** 2 * v, 0), n * p * (1 - p));
  }
  near(binomialMass(10, 0.3)[3][1], 0.266827932);
});
test("information quantities match independent worked values and boundary behavior", () => {
  near(binaryEntropy(0.5), 1); near(binaryEntropy(0), 0); near(binaryEntropy(1), 0);
  near(binaryEntropy(0.25), 0.8112781244591328);
  near(binaryCrossEntropy(0.7, 0.5), 1);
  near(binaryCrossEntropy(0.7, 0.5) - binaryEntropy(0.7), 0.1187091007693073);
  assert.equal(binaryCrossEntropy(0.7, 0), Infinity);
  near(expectedBrier(0.7, 0.7), 0.21);
  assert.ok(expectedBrier(0.7, 0.5) > expectedBrier(0.7, 0.7));
});
test("Bayes includes the false-alert contribution", () => {
  near(calculate("bayes", 0.1).values.find((v) => v.label === "P(H|+)").value, 0.5);
  near(calculate("bayes", 0).values.find((v) => v.label === "P(H|+)").value, 0);
  near(calculate("bayes", 1).values.find((v) => v.label === "P(H|+)").value, 1);
});
test("conditional probabilities use the stated denominators and nonnegative cells", () => {
  const data = calculate("conditional", 20).values;
  near(data.find((v) => v.label === "P(A|B)").value, 0.4);
  near(data.find((v) => v.label === "P(B|A)").value, 0.5);
  for (let overlap = 0; overlap <= 40; overlap++) {
    const cells = calculate("conditional", overlap).values.slice(0, 4);
    near(cells.reduce((s, v) => s + v.value, 0), 100);
    assert.ok(cells.every((v) => v.value >= 0));
  }
});
test("normal mean confidence widths scale with the square root of sample size", () => {
  const halfWidth = (n) => calculate("confidence", n).values.find((v) => v.label === "Half-width").value;
  near(halfWidth(25), 3.92); near(halfWidth(100), 1.96);
});
test("Markov propagation conserves mass and agrees with the hand calculation", () => {
  const [a, b] = markovDistribution(2); near(a, 0.72); near(b, 0.28);
  near(markovDistribution(100)[0], 2 / 3);
  for (let t = 0; t <= 20; t++) near(markovDistribution(t).reduce((s, p) => s + p, 0), 1);
});
test("early stopping never selects an unobserved checkpoint", () => {
  assert.deepEqual(stoppingCheckpoint(2), { stopped: true, epoch: 6, bestEpoch: 4, best: 0.5 });
  assert.deepEqual(stoppingCheckpoint(3), { stopped: true, epoch: 10, bestEpoch: 7, best: 0.49 });
  assert.equal(stoppingCheckpoint(5).stopped, false);
});
test("eigenvector calculations distinguish parallel and general directions", () => {
  const cross = (angle) => calculate("eigen", angle).values.at(-1).value;
  near(cross(45), 0); near(cross(135), 0); near(cross(0), 1);
});
test("conformal uses a corrected order statistic, sorts inputs, and handles an unattainable finite rank", () => {
  const r = [2, 0.2, 1.4, 0.3, 1.1, 0.4, 0.9, 0.5, 0.7];
  assert.deepEqual(conformalRadius(r, 0.1), { rank: 9, radius: 2 });
  assert.deepEqual(conformalRadius(r, 0.2), { rank: 8, radius: 1.4 });
  assert.deepEqual(conformalRadius(r, 0.05), { rank: 10, radius: Infinity });
  assert.throws(() => conformalRadius([], 0.1));
});
test("every reviewed lab renders finite data throughout its declared control range", () => {
  for (const lesson of Object.values(reviewedLessons)) {
    const lab = lesson.labs[0], p = lab.parameter;
    for (let i = 0; i <= Math.round((p.max - p.min) / p.step); i++) {
      const input = Number((p.min + p.step * i).toFixed(8));
      const result = calculate(lab.model, input);
      assert.ok(result.series.flatMap((s) => s.points.flat()).every(Number.isFinite), `${lesson.title} at ${input}`);
      assert.ok(result.values.every((v) => Number.isFinite(v.value)), `${lesson.title} at ${input}`);
      assert.equal(new Set(result.values.map(v => v.label)).size, result.values.length, `${lesson.title}: duplicate numeric labels`);
      assert.ok(result.series.length || result.matrices?.length, `${lesson.title} has no visual`);
      assert.ok((result.matrices || []).flatMap((m) => m.entries.flat()).every(Number.isFinite));
      assert.ok((result.shaded || []).flat().every(Number.isFinite));
    }
  }
});

const quantity = (model, input, name) => calculate(model, input).values.find((v) => v.label === name).value;
const transpose = (a) => a[0].map((_, j) => a.map((row) => row[j]));
const matrixNear = (a, b) => { assert.equal(a.length, b.length); a.forEach((row, i) => { assert.equal(row.length, b[i].length); row.forEach((v, j) => near(v, b[i][j])); }); };

test("linear-algebra review covers every declared model with one distinct topic", () => {
  const models = Object.values(reviewedLessons).map((l) => l.labs[0].model);
  for (const model of linearModels) assert.equal(models.filter((m) => m === model).length, 1);
});
test("matrix products preserve contraction order and hand-calculated entries", () => {
  const a = [[1, 2], [0, 1]], b = [[1, 0], [1, 2]];
  assert.deepEqual(multiply(a, b), [[3, 4], [1, 2]]);
  assert.deepEqual(multiply(b, a), [[1, 2], [1, 4]]);
  assert.deepEqual(calculate("la-einsum", 1).matrices[2].entries, multiply(a, b));
});
test("tensor slices, norms, and scale-sensitive distances have correct units", () => {
  near(quantity("la-shape", 8, "Scalar entries"), 48);
  near(quantity("la-shape", 8, "Float32 payload"), 192);
  assert.equal(calculate("la-shape", 8).matrices.flatMap((m) => m.entries.flat()).length, 48);
  near(quantity("la-norms", 4, "L₁"), 7); near(quantity("la-norms", 4, "L₂"), 5); near(quantity("la-norms", 4, "L∞"), 4);
  near(quantity("la-similarity", 3, "Cosine similarity"), 1);
  near(quantity("la-similarity", 3, "Euclidean distance"), Math.sqrt(8));
});
test("orthonormal coordinates and projections conserve squared length", () => {
  for (let angle = 0; angle <= 180; angle++) {
    const [q, c] = calculate("la-orthogonal", angle).matrices.map((m) => m.entries);
    matrixNear(multiply(transpose(q), q), [[1, 0], [0, 1]]);
    matrixNear(multiply(q, c), [[2], [1]]);
    near(quantity("la-projection", angle, "uᵀ(x−p)"), 0);
    near(quantity("la-projection", angle, "‖p‖²") + quantity("la-projection", angle, "‖x−p‖²"), 5);
  }
});
test("rank, determinant and quadratic form distinguish collapsed and indefinite maps", () => {
  near(quantity("la-independence", 0, "Exact rank"), 1);
  near(quantity("la-independence", 0.05, "Exact rank"), 2);
  for (const t of [-1, 0, 1]) near(quantity("la-rank", t, "Rank") + quantity("la-rank", t, "Nullity"), 3);
  near(quantity("la-trace-det", -2, "Trace"), 0);
  near(quantity("la-trace-det", -2, "Determinant"), -4);
  near(quantity("la-psd", -1, "Smallest eigenvalue"), -1);
  assert.match(calculate("la-psd", 0).summary, /semidefinite and singular/);
});
test("reduced rectangular SVD reconstructs A and produces the claimed spectrum", () => {
  const [a, u, sigma, vt] = calculate("la-svd", 90).matrices.map((m) => m.entries);
  matrixNear(multiply(multiply(u, sigma), vt), a);
  matrixNear(multiply(transpose(a), a), [[9, 0], [0, 4]]);
  matrixNear(multiply(transpose(u), u), [[1, 0], [0, 1]]);
  near(quantity("la-svd", 90, "Output length"), 2);
});
test("truncation errors and sparse storage crossover match independently counted values", () => {
  near(quantity("la-low-rank", 1, "Frobenius residual"), Math.sqrt(5));
  near(quantity("la-low-rank", 1, "Spectral residual"), 2);
  near(quantity("la-low-rank", 2, "Frobenius residual"), 1);
  near(quantity("la-low-rank", 3, "Frobenius residual"), 0);
  near(quantity("la-sparse", 14, "CSR payload"), 192);
  near(quantity("la-sparse", 15, "CSR payload"), 204);
});
test("matrix gradient agrees with finite differences for every parameter", () => {
  const x = [1, 2], target = [1, 1], h = 1e-5;
  const loss = (w) => w.reduce((total, row, r) => total + (row.reduce((s, entry, c) => s + entry * x[c], 0) - target[r]) ** 2 / 2, 0);
  for (const t of [-1, 0, 1, 2]) {
    const matrices = calculate("la-gradient", t).matrices;
    const w = matrices[0].entries, grad = matrices[3].entries;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
      const plus = w.map((row) => [...row]), minus = w.map((row) => [...row]);
      plus[r][c] += h; minus[r][c] -= h;
      near(grad[r][c], (loss(plus) - loss(minus)) / (2 * h), 1e-8);
    }
  }
});
test("Jacobian and Hessian are derivatives of their stated distinct functions", () => {
  const f = (x, y) => [x * x + y, x * y], gradG = (x, y) => [2 * x + y, x + 4 * y], h = 1e-5;
  for (const t of [-2, 0, 1, 2]) {
    const [j, hes] = calculate("la-jacobian", t).matrices.map((m) => m.entries);
    for (const [fn, mat] of [[f, j], [gradG, hes]]) {
      const dx = fn(t + h, 1).map((v, i) => (v - fn(t - h, 1)[i]) / (2 * h));
      const dy = fn(t, 1 + h).map((v, i) => (v - fn(t, 1 - h)[i]) / (2 * h));
      for (let i = 0; i < 2; i++) { near(mat[i][0], dx[i], 1e-8); near(mat[i][1], dy[i], 1e-8); }
    }
  }
});
test("Kronecker block placement and worst-case conditioning match hand examples", () => {
  assert.deepEqual(kronecker([[1, -1], [0, 2]], [[1, 2], [3, 4]]), [[1, 2, -1, -2], [3, 4, -3, -4], [0, 0, 2, 4], [0, 0, 6, 8]]);
  for (let s = 0; s <= 4; s++) {
    const k = quantity("la-conditioning", s, "Condition number κ₂");
    near(quantity("la-conditioning", s, "Relative x error"), k * 0.001);
  }
});
