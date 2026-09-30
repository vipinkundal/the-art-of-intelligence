import type { CalculationResult } from "./calculations.ts";

export const predictiveReliabilityModels = ["bayesian-hypotheses", "binary-reliability", "shift-risk"] as const;
export type PredictiveReliabilityModel = typeof predictiveReliabilityModels[number];
export const isPredictiveReliabilityModel = (model: string): model is PredictiveReliabilityModel => (predictiveReliabilityModels as readonly string[]).includes(model);
type Point = [number, number];
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const fmt = (x: number) => Number(x.toFixed(6));
const value = (label: string, value: number, unit = "") => ({ label, value, unit });

export function calculatePredictiveReliability(model: PredictiveReliabilityModel, input: number): CalculationResult {
  const bounds: Record<PredictiveReliabilityModel, Point> = { "bayesian-hypotheses": [0, 12], "binary-reliability": [.25, 3], "shift-risk": [0, 1] };
  if (!Number.isFinite(input) || input < bounds[model][0] || input > bounds[model][1] || (model === "bayesian-hypotheses" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "lines", series: [], xDomain: [0, 1], yDomain: [0, 1], xLabel: "Probability", yLabel: "Probability", summary: "", values: [] };
  if (model === "bayesian-hypotheses") {
    const observations = [1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1].slice(0, input);
    const successes = sum(observations), failures = input - successes, theta = [.2, .5, .8], prior = [.2, .6, .2];
    const likelihood = theta.map(t => t ** successes * (1 - t) ** failures), joint = prior.map((p, i) => p * likelihood[i]), evidence = sum(joint), posterior = joint.map(p => p / evidence);
    const mean = sum(theta.map((t, i) => t * posterior[i])), variance = sum(theta.map((t, i) => (t - mean) ** 2 * posterior[i]));
    const coefficients = [1, 3, 3, 1];
    const predictive = coefficients.map((c, k) => sum(theta.map((t, i) => posterior[i] * c * t ** k * (1 - t) ** (3 - k))));
    const plugin = coefficients.map((c, k) => c * mean ** k * (1 - mean) ** (3 - k));
    return { ...base, kind: "bars", xDomain: [-.5, 2.5], xTicks: [0, 1, 2], xTickLabels: ["0.2", "0.5", "0.8"], xLabel: "Hypothesized success probability θ", yLabel: "Probability mass on θ",
      controlValue: `${input} observations · ${successes} successes, ${failures} failures`,
      series: [{ label: "Prior over three hypotheses", points: prior.map((p, i): Point => [i, p]) }, { label: "Posterior after the selected prefix", points: posterior.map((p, i): Point => [i, p]) }],
      matrices: [{ label: "Bayes update for the observed ordered prefix", rowLabels: theta.map(t => `θ=${t}`), columnLabels: ["prior", "likelihood", "posterior"], entries: theta.map((_, i) => [prior[i], likelihood[i], posterior[i]]) }, { label: "Successes K in three future trials: integrate versus plug in", rowLabels: ["K=0", "K=1", "K=2", "K=3"], columnLabels: ["predictive", "plug-in"], entries: predictive.map((p, i) => [p, plugin[i]]) }],
      summary: `${successes} successes and ${failures} failures give posterior masses (${posterior.map(fmt).join(", ")}) on θ=(0.2,0.5,0.8). The next-trial success probability is the posterior mean ${fmt(mean)}. For three future successes, integrating gives ${fmt(predictive[3])}, versus ${fmt(plugin[3])} from cubing that mean. Parameter uncertainty induces dependence between future trials after θ is marginalized out.`,
      values: [value("Observed successes", successes), value("Ordered-prefix evidence", evidence), value("Posterior mean / next success probability", mean), value("Posterior variance of θ", variance), value("Future-count predictive mean", 3 * mean, "successes"), value("Future-count predictive variance", 3 * mean * (1 - mean) + 6 * variance, "successes²"), value("Plug-in count variance", 3 * mean * (1 - mean), "successes²"), value("Predictive probability sum", sum(predictive))] };
  }
  if (model === "binary-reliability") {
    const rates = [.1, .3, .7, .9], forecast = rates.map(r => 1 / (1 + Math.exp(-input * Math.log(r / (1 - r)))));
    const gaps = rates.map((r, i) => Math.abs(r - forecast[i])), ece = sum(gaps) / 4;
    const brier = sum(rates.map((r, i) => r * (1 - forecast[i]) ** 2 + (1 - r) * forecast[i] ** 2)) / 4;
    return { ...base, xLabel: "Forecast P(Y=1)", yLabel: "Observed positive fraction",
      series: [{ label: "Ideal reliability: observed = forecast", points: [[0, 0], [1, 1]] }, { label: "Four score groups · 100 cases each", style: "points", points: rates.map((r, i): Point => [forecast[i], r]) }],
      matrices: [{ label: "Four fixed groups, changing only their forecasts", rowLabels: ["group A", "group B", "group C", "group D"], columnLabels: ["positive/100", "forecast", "abs gap"], entries: rates.map((r, i) => [100 * r, forecast[i], gaps[i]]) }],
      summary: `At logit multiplier k=${fmt(input)}, the four forecasts are (${forecast.map(fmt).join(", ")}). Group-weighted absolute calibration error is ${fmt(ece)}; binary Brier loss is ${fmt(brier)}. Classification accuracy stays 320/400=0.8 at threshold 0.5, and ranking is unchanged. At k=1 the four observed rates match their forecasts, but a finite sample cannot certify population calibration.`,
      values: [value("Observed cases", 400), value("Correct classifications at threshold 0.5", 320), value("Accuracy", .8), value("Four-group absolute calibration error", ece), value("Binary Brier loss", brier), value("Brier loss at k=1", .15), value("Mean forecast", sum(forecast) / 4), value("Observed overall positive rate", .5)] };
  }
  const sourceRisk = .8 * .05 + .2 * .4, covariateRisk = (q: number) => (1 - q) * .05 + q * .4, changedRisk = (q: number) => (1 - q) * .05 + q * .8;
  const q = input, weights = [(1 - q) / .8, q / .2], weighted = .8 * weights[0] * .05 + .2 * weights[1] * .4;
  return { ...base, xLabel: "Target share of group B", yLabel: "Expected classification error", selectedX: q,
    series: [{ label: "Source risk: 80% A / 20% B", points: [[0, sourceRisk], [1, sourceRisk]] }, { label: "Target: stable conditional errors", points: [[0, .05], [1, .4]] }, { label: "Target: B error also changes to 0.8", points: [[0, .05], [1, .8]] }],
    matrices: [{ label: "Group mix and density ratios", rowLabels: ["A", "B"], columnLabels: ["source", "target", "weight"], entries: [[.8, 1 - q, weights[0]], [.2, q, weights[1]]] }, { label: "Conditional error: stable versus changed relationship", rowLabels: ["A", "B"], columnLabels: ["stable", "changed"], entries: [[.05, .05], [.4, .8]] }],
    summary: `Source error is ${fmt(sourceRisk)}. At target B share ${fmt(q)}, stable conditional errors give target error ${fmt(covariateRisk(q))}, exactly recovered by the population-weighted source risk ${fmt(weighted)}. If B's conditional error changes to 0.8, actual target error is ${fmt(changedRisk(q))}; the same input-only weights still predict ${fmt(weighted)}. Both target worlds have identical input distributions.`,
    values: [value("Source risk", sourceRisk), value("Target risk under covariate shift", covariateRisk(q)), value("Importance-weighted source risk", weighted), value("Target risk with conditional drift", changedRisk(q)), value("Missed error from conditional drift", changedRisk(q) - weighted), value("Source expectation of density ratio", .8 * weights[0] + .2 * weights[1])] };
}
