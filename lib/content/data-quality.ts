import type { CalculationResult } from "./calculations.ts";
import { normalPDF } from "./distributions.ts";

export const dataQualityModels = ["finite-sampling", "missingness-mechanisms", "standardized-effect", "randomized-design"] as const;
export type DataQualityModel = typeof dataQualityModels[number];
export const isDataQualityModel = (model: string): model is DataQualityModel => (dataQualityModels as readonly string[]).includes(model);
type Point = [number, number];
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const fmt = (x: number) => Number(x.toFixed(6));
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
// Simpson integration of a standard-normal density; all calls use |z| < 2.
function normalCDF(z: number) {
  const steps = 400, h = Math.abs(z) / steps;
  let total = normalPDF(0) + normalPDF(Math.abs(z));
  for (let i = 1; i < steps; i++) total += (i % 2 ? 4 : 2) * normalPDF(i * h);
  return .5 + Math.sign(z) * h * total / 3;
}

export function calculateDataQuality(model: DataQualityModel, input: number): CalculationResult {
  const bounds: Record<DataQualityModel, Point> = { "finite-sampling": [1, 6], "missingness-mechanisms": [0, 2], "standardized-effect": [2, 20], "randomized-design": [1, 6] };
  if (!Number.isFinite(input) || input < bounds[model][0] || input > bounds[model][1] || (model !== "standardized-effect" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "bars", series: [], xDomain: [-.5, 2.5], yDomain: [0, 1], xLabel: "Category", yLabel: "Probability", summary: "", values: [] };
  if (model === "finite-sampling") {
    const samples = [[2, 4], [2, 8], [2, 10], [4, 8], [4, 10], [8, 10]], means = samples.map(p => sum(p) / 2), selected = samples[input - 1], mean = means[input - 1], positions = [3, 5, 6, 7, 9];
    const frameMeans = [3, 5, 6];
    const mass = (xs: number[], x: number) => xs.filter(v => v === x).length / xs.length;
    return { ...base, xDomain: [2.5, 9.5], yDomain: [0, .5], xTicks: positions, xLabel: "Sample mean (score units)", yLabel: "Sampling probability", selectedX: mean,
      controlValue: `Sample ${input}/6 · {${selected.join(", ")}} · mean ${mean}`,
      series: [{ label: "All four population units eligible", points: positions.map(x => [x, mass(means, x)]) }, { label: "Frame omits the unit with value 10", points: positions.map(x => [x, mass(frameMeans, x)]) }],
      markers: [{ label: "Selected complete-frame sample mean", point: [mean, mass(means, mean)] }],
      matrices: [{ label: "Every equally likely size-two sample from the complete frame", rowLabels: samples.map((_, i) => `sample ${i + 1}${i + 1 === input ? " • selected" : ""}`), columnLabels: ["first", "second", "mean"], entries: samples.map((s, i) => [...s, means[i]]) }],
      summary: `Sample ${input} contains {${selected.join(", ")}}, with mean ${mean} and error ${mean - 6} relative to population mean 6. Averaging all six complete-frame sample means gives 6: unbiased does not mean every sample is correct. Omitting the unit 10 changes the frame mean and expected sample mean to 14/3=${fmt(14 / 3)}. That coverage error does not disappear by sampling more often from the same incomplete frame.`,
      values: [value("Population size N", 4), value("Sample size n", 2), value("Population mean", 6, "score units"), value("Selected sample mean", mean, "score units"), value("Complete-frame estimator expectation", 6, "score units"), value("Complete-frame sampling variance", 10 / 3, "score units²"), value("Complete-frame sampling standard deviation", Math.sqrt(10 / 3), "score units"), value("Incomplete-frame estimator expectation", 14 / 3, "score units"), value("Bias relative to target population", -4 / 3, "score units")] };
  }
  if (model === "missingness-mechanisms") {
    const names = ["MCAR", "MAR given X", "MNAR given X"], cells = [{ x: 0, y: 0, p: .4 }, { x: 0, y: 1, p: .1 }, { x: 1, y: 0, p: .1 }, { x: 1, y: 1, p: .4 }];
    const response = cells.map(c => input === 0 ? .6 : input === 1 ? c.x === 0 ? .9 : .3 : c.y === 0 ? .9 : .3);
    const observed = cells.map((c, i) => c.p * response[i]), responseRate = sum(observed), complete = sum(cells.map((c, i) => c.y * observed[i])) / responseRate;
    const conditional = [0, 1].map(x => sum(cells.map((c, i) => c.x === x ? c.y * observed[i] : 0)) / sum(cells.map((c, i) => c.x === x ? observed[i] : 0)));
    const standardized = sum(conditional) / 2;
    return { ...base, xTicks: [0, 1, 2], xTickLabels: ["Full", "Observed", "X-adjusted"], xLabel: "Which population is being summarized?", yLabel: "Positive-label fraction", controlValue: names[input],
      series: [{ label: "Full-data, complete-case and standardized means", points: [[0, .5], [1, complete], [2, standardized]] }],
      matrices: [{ label: "Known generating mechanism: expected counts out of 1,000", rowLabels: cells.map(c => `X=${c.x}, Y=${c.y}`), columnLabels: ["full", "P(R=1)", "observed"], entries: cells.map((c, i) => [1000 * c.p, response[i], 1000 * observed[i]]) }, { label: "Positive rate within observed X groups", rowLabels: ["X=0", "X=1"], columnLabels: ["full", "observed"], entries: [[.2, conditional[0]], [.8, conditional[1]]] }],
      summary: `${names[input]}: 40% of Y values are missing, just as in the other two scenarios. The full-data positive rate is 0.5; the complete-case rate is ${fmt(complete)}. Standardizing observed within-X rates back to the known 50/50 X mix gives ${fmt(standardized)}. ${input === 2 ? "Adjustment for X fails here because response still depends on the unseen Y within X groups." : input === 1 ? "Adjustment succeeds at the population level because response is independent of Y once X is known." : "Response is independent of both X and Y, so all three means agree at the population level."}`,
      values: [value("Observed fraction", responseRate), value("Missing fraction", 1 - responseRate), value("True full-data mean", .5), value("Complete-case mean", complete), value("X-standardized observed mean", standardized), value("Remaining adjusted bias", standardized - .5)] };
  }
  if (model === "randomized-design") {
    const y0 = [2, 4, 8, 10], y1 = [6, 8, 8, 10], assignments = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
    const effects = assignments.map(treated => sum(treated.map(i => y1[i])) / 2 - sum(y0.filter((_, i) => !treated.includes(i))) / 2);
    const blocked = assignments.map(treated => treated.some(i => i < 2) && treated.some(i => i >= 2));
    const chosen = assignments[input - 1], contrast = effects[input - 1], observed = y0.map((y, i) => chosen.includes(i) ? y1[i] : y);
    const truth = sum(y1.map((y, i) => y - y0[i])) / 4;
    const completeVariance = sum(effects.map(t => (t - truth) ** 2)) / 6, blockedEffects = effects.filter((_, i) => blocked[i]), blockedVariance = sum(blockedEffects.map(t => (t - truth) ** 2)) / 4;
    return { ...base, kind: "lines", xDomain: [.5, 6.5], yDomain: [-3, 7], xTicks: [1, 2, 3, 4, 5, 6], xLabel: "Assignment index (not time)", yLabel: "Treated minus control mean", selectedX: input,
      controlValue: `Assignment ${input}/6 · treat units ${chosen.map(i => i + 1).join(" and ")}`,
      series: [{ label: "Known four-unit average effect: 2", points: [[.5, truth], [6.5, truth]] }, { label: "Complete-randomization assignments", style: "points", points: effects.map((t, i): Point => [i + 1, t]) }, { label: "Subset allowed by the two-block design", style: "points", points: effects.flatMap((t, i): Point[] => blocked[i] ? [[i + 1, t]] : []) }],
      markers: [{ label: "Selected assignment contrast", point: [input, contrast], hollow: true }],
      matrices: [{ label: "Toy oracle: potential outcomes, not jointly observable in a real experiment", rowLabels: ["unit 1", "unit 2", "unit 3", "unit 4"], columnLabels: ["Y(0)", "Y(1)", "effect"], entries: y0.map((y, i) => [y, y1[i], y1[i] - y]) }, { label: "What the selected assignment actually reveals", rowLabels: ["unit 1", "unit 2", "unit 3", "unit 4"], columnLabels: ["treated 1/0", "observed Y"], entries: observed.map((y, i) => [Number(chosen.includes(i)), y]) }, { label: "Assignment results and membership in the blocked design", rowLabels: assignments.map((a, i) => `${i + 1}: treat ${a.map(j => j + 1).join(",")}`), columnLabels: ["contrast", "blocked 1/0"], entries: effects.map((t, i) => [t, Number(blocked[i])]) }],
      summary: `Assignment ${input} gives observed contrast ${contrast}, while the known average treatment effect is 2. It ${blocked[input - 1] ? "is" : "is not"} allowed by the design that treats one unit from each baseline block. Complete randomization averages all six contrasts to 2 with variance ${fmt(completeVariance)}. The four equally likely blocked assignments also average to 2, with variance ${fmt(blockedVariance)} in this particular population. Randomization does not force each realized estimate to equal the causal effect.`,
      values: [value("Known finite-population average effect", truth, "score units"), value("Selected observed contrast", contrast, "score units"), value("Complete-randomization mean contrast", sum(effects) / 6, "score units"), value("Complete-randomization variance", completeVariance, "score units²"), value("Blocked-design mean contrast", sum(blockedEffects) / 4, "score units"), value("Blocked-design variance", blockedVariance, "score units²")] };
  }
  const sigma = input, delta = 5 / sigma, lo = 50 - 4 * sigma, hi = 55 + 4 * sigma;
  const xs = Array.from({ length: 241 }, (_, i) => lo + (hi - lo) * i / 240);
  const a = xs.map((x): Point => [x, normalPDF(x - 50, sigma)]), b = xs.map((x): Point => [x, normalPDF(x - 55, sigma)]);
  const overlap = 2 * normalCDF(-delta / 2), superiority = normalCDF(delta / Math.sqrt(2));
  return { ...base, kind: "lines", xDomain: [lo, hi], yDomain: [0, .44 / sigma], xLabel: "Outcome (score units)", yLabel: "Density (per score unit)",
    series: [{ label: "Population A · mean 50", points: a }, { label: "Population B · mean 55", points: b }],
    shaded: [[lo, 0], ...xs.map((x, i): Point => [x, Math.min(a[i][1], b[i][1])]), [hi, 0]],
    summary: `The raw mean difference stays 5 score units. At shared σ=${fmt(sigma)}, the population standardized difference is δ=${fmt(delta)}. Under these equal-variance normal models, density overlap is approximately ${fmt(overlap)} and P(B>A) for independent draws is approximately ${fmt(superiority)}. Neither number is a p-value or the fraction of individuals helped by an intervention. Both plot axes rescale with σ; shaded area shows the common density.`,
    values: [value("Raw mean difference B−A", 5, "score units"), value("Common population SD", sigma, "score units"), value("Population standardized mean difference δ", delta), value("Normal-density overlap", overlap), value("P(independent B draw > A draw)", superiority)],
    matrices: [{ label: "Same difference, explicitly chosen standardizer", rowLabels: ["A", "B"], columnLabels: ["mean", "SD", "variance"], entries: [[50, sigma, sigma * sigma], [55, sigma, sigma * sigma]] }] };
}
