import assert from "node:assert/strict";
import test from "node:test";
import { calculateDistribution as calculate, distributionModels, logGamma, normalPDF, gammaPDF, betaPDF, lognormalPDF, studentPDF, poissonMass } from "../lib/content/distributions.ts";
import { distributionLessons } from "../content/editorial/distributions.mjs";

const near = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
const value = (model, parameter, label) => calculate(model, parameter).values.find(v => v.label === label).value;
const area = points => points.slice(1).reduce((sum, [x, y], i) => sum + (x - points[i][0]) * (y + points[i][1]) / 2, 0);
// Composite Simpson integration is independent of the renderer's sampled paths.
function integral(fn, lo, hi, n = 12000) {
  const h = (hi - lo) / n;
  let sum = fn(lo) + fn(hi);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * fn(lo + i * h);
  return sum * h / 3;
}

test("every distribution model has one topic and rejects invalid controls", () => {
  const labs = Object.values(distributionLessons).map(l => l.labs[0]);
  for (const model of distributionModels) {
    assert.equal(labs.filter(l => l.model === model).length, 1);
    const p = labs.find(l => l.model === model).parameter;
    for (const input of [NaN, Infinity, p.min - 1, p.max + 1]) assert.throws(() => calculate(model, input));
  }
  assert.throws(() => calculate("dist-multinomial", 2.5));
});

test("log gamma obeys known values and the recurrence", () => {
  near(Math.exp(logGamma(0.5)), Math.sqrt(Math.PI));
  near(logGamma(1), 0); near(Math.exp(logGamma(5)), 24);
  for (const z of [0.1, 0.25, 0.75, 1, 5, 20]) near(logGamma(z + 1) - logGamma(z), Math.log(z));
});

test("categorical and multinomial probabilities conserve mass and fixed-total covariance", () => {
  for (const p of [0, 0.5, 1]) near(calculate("dist-categorical", p).series[0].points.reduce((s, [, p]) => s + p, 0), 1);
  for (let n = 1; n <= 12; n++) {
    const r = calculate("dist-multinomial", n);
    near(r.series[0].points.reduce((s, [, p]) => s + p, 0), 1);
    near(r.series[0].points.reduce((s, [k, p]) => s + k * p, 0), 0.2 * n);
    for (const row of r.matrices[0].entries) near(row.reduce((s, x) => s + x, 0), 0);
    near(r.matrices[0].entries[0][1], -0.06 * n);
  }
});

test("PDF area and CDF height use different probability rules", () => {
  for (const b of [0.25, 0.5, 1, 2]) {
    const r = calculate("dist-density", b);
    near(area(r.shaded), 0.5); near(area(r.series[0].points), 1);
  }
  near(value("dist-density", 0.25, "Density height"), 4);
  near(value("dist-uniform", 4, "Mean"), 2);
  near(value("dist-uniform", 4, "Variance"), 4 / 3);
  near(value("dist-uniform", 4, "Shaded probability"), 0.25);
  for (const [t, p] of [[-0.5, 0], [0, 0], [0.3, 0.3], [1, 1], [1.5, 1]]) {
    near(value("dist-cdf", t, "P(X≤t)"), p);
    near(value("dist-cdf", t, "P(X=t)"), 0);
  }
});

test("Gaussian normalization, variance and shaded one-sigma area agree", () => {
  for (const sigma of [0.5, 1, 2]) {
    near(integral(x => normalPDF(x, sigma), -10 * sigma, 10 * sigma), 1);
    near(integral(x => x * x * normalPDF(x, sigma), -10 * sigma, 10 * sigma), sigma * sigma);
    near(area(calculate("dist-normal", sigma).shaded), 0.682689492137, 0.00006);
  }
});

test("Gaussian contours obey Mahalanobis radii and two-dimensional coverage", () => {
  for (const rho of [-0.9, 0, 0.5, 0.9]) {
    const r = calculate("dist-mvn", rho);
    assert.equal(r.equalAspect, true);
    r.series.forEach((series, i) => series.points.forEach(([x, y]) => near((x*x - 2*rho*x*y + y*y) / (1-rho*rho), (i+1)**2)));
    near(value("dist-mvn", rho, "Radius-1 coverage"), 0.3934693402873666);
    near(value("dist-mvn", rho, "Radius-2 coverage"), 0.8646647167633873);
  }
});

test("Poisson recurrence has correct masses, normalization, mean and variance", () => {
  for (const lambda of [0, 0.25, 3, 10]) {
    const ps = poissonMass(lambda, 100);
    near(ps.reduce((s, [, p]) => s + p, 0), 1);
    near(ps.reduce((s, [k, p]) => s + k * p, 0), lambda);
    near(ps.reduce((s, [k, p]) => s + (k-lambda)**2 * p, 0), lambda);
    const r = calculate("dist-poisson", lambda);
    near(r.series[0].points.reduce((s, [, p]) => s + p, 0) + value("dist-poisson", lambda, "Omitted upper-tail probability"), 1);
  }
  near(poissonMass(3)[2][1], 0.22404180765538775);
  assert.ok(value("dist-poisson", 3, "Omitted upper-tail probability") > 0);
});

test("geometric PMF starts at one and reports rather than renormalizes its tail", () => {
  for (const p of [0.1, 0.25, 0.5, 1]) {
    const r = calculate("dist-geometric", p);
    assert.equal(r.series[0].points[0][0], 1);
    near(r.series[0].points.reduce((s, [, q]) => s + q, 0) + value("dist-geometric", p, "P(K>40)"), 1);
  }
  near(value("dist-geometric", 0.25, "P(K=3)"), 0.140625);
  near(value("dist-geometric", 0.25, "Mean trial"), 4);
  near(value("dist-geometric", 0.25, "Variance"), 12);
  near(value("dist-geometric", 1, "Mean trial"), 1);
});

test("exponential and gamma rate conventions match normalization and moments", () => {
  near(value("dist-exponential", 2, "Mean wait"), 0.5);
  near(value("dist-exponential", 2, "P(T≤1)"), 1 - Math.exp(-2));
  assert.match(calculate("dist-exponential", 3).summary, /P\(T>12s\)=2\.320e-16/);
  for (const shape of [1, 3, 6]) for (const rate of [1, 2]) {
    near(integral(x => gammaPDF(x, shape, rate), 0, 60), 1, 1e-8);
    near(integral(x => x * gammaPDF(x, shape, rate), 0, 60), shape / rate, 1e-8);
    near(integral(x => (x-shape/rate)**2 * gammaPDF(x, shape, rate), 0, 60), shape / rate**2, 1e-8);
  }
  for (const x of [0, 0.5, 3]) near(gammaPDF(x, 1, 2), 2 * Math.exp(-2*x));
});

test("beta and Dirichlet marginals integrate to their declared moments", () => {
  for (const [a, b] of [[1, 2], [2, 2], [8, 2], [8, 16]]) {
    const mean = a / (a+b), variance = a*b / ((a+b)**2*(a+b+1));
    near(integral(x => betaPDF(x, a, b), 0, 1), 1);
    near(integral(x => x * betaPDF(x, a, b), 0, 1), mean);
    near(integral(x => (x-mean)**2 * betaPDF(x, a, b), 0, 1), variance);
  }
  near(value("dist-dirichlet", 1, "Variance"), 1/18);
  near(value("dist-dirichlet", 1, "Cov(p₁,p₂)"), -1/36);
  near(betaPDF(0.3, 1, 2), 1.4);
});

test("lognormal includes the change-of-variables Jacobian", () => {
  for (const sigma of [0.25, 1, 1.25]) {
    near(integral(z => lognormalPDF(Math.exp(z), sigma) * Math.exp(z), -10*sigma, 10*sigma), 1);
    near(value("dist-lognormal", sigma, "Median"), 1);
  }
  near(lognormalPDF(1, 1), 1 / Math.sqrt(2*Math.PI));
  near(value("dist-lognormal", 1, "Mean"), Math.exp(0.5));
  near(value("dist-lognormal", 1, "Mode"), Math.exp(-1));
});

test("Student t handles nonexistent moments and approaches the normal density", () => {
  near(studentPDF(0, 1), 1/Math.PI);
  near(studentPDF(1, 1), 1/(2*Math.PI));
  const cauchy = calculate("dist-student", 1);
  assert.match(cauchy.summary, /mean is undefined/);
  assert.ok(!cauchy.values.some(v => ["Mean", "Variance"].includes(v.label)));
  assert.ok(!calculate("dist-student", 2).values.some(v => v.label === "Variance"));
  near(value("dist-student", 5, "Variance"), 5/3);
  assert.ok(Math.abs(studentPDF(0, 30) - normalPDF(0)) < Math.abs(studentPDF(0, 5) - normalPDF(0)));
});

test("right Gumbel separates mode, median and mean", () => {
  const r = calculate("dist-gumbel", 1);
  near(r.series[0].points.find(([x]) => x === 0)[1], Math.exp(-1));
  near(value("dist-gumbel", 1, "Mean"), 0.5772156649015329);
  near(value("dist-gumbel", 1, "Median"), 0.36651292058166435);
  near(value("dist-gumbel", 1, "Variance"), Math.PI**2/6);
});
