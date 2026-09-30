import type { CalculationResult } from "./calculations.ts";

export const samplingModels = ["sample-mc", "sample-importance", "sample-rejection", "process-markov", "process-sde"] as const;
export type SamplingModel = typeof samplingModels[number];
export const isSamplingModel = (model: string): model is SamplingModel => (samplingModels as readonly string[]).includes(model);
type Point = [number, number];
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const fmt = (n: number) => n !== 0 && Math.abs(n) < 0.0001 ? n.toExponential(3) : Number(n.toFixed(6));
const curve = (lo: number, hi: number, fn: (x: number) => number): Point[] => Array.from({ length: 161 }, (_, i) => { const x = lo + (hi - lo) * i / 160; return [x, fn(x)]; });
// Fixed 32-bit pseudorandom streams make the illustrative realizations reproducible.
const stream = (seed: number) => () => {
  seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

export function calculateSampling(model: SamplingModel, input: number): CalculationResult {
  const bounds: Record<SamplingModel, [number, number]> = { "sample-mc": [4, 400], "sample-importance": [0.01, 0.99], "sample-rejection": [2, 5], "process-markov": [0.1, 2], "process-sde": [0, 2] };
  const [lo, hi] = bounds[model];
  if (!Number.isFinite(input) || input < lo || input > hi || (model === "sample-mc" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "lines", series: [], xDomain: [0, 1], yDomain: [0, 1.05], xLabel: "Input", yLabel: "Value", summary: "", values: [] };
  if (model === "sample-mc") {
    const uniform = stream(1729), means: Point[] = []; let sum = 0, sumSquares = 0;
    for (let k = 1; k <= input; k++) { const u = uniform(), z = u * u; sum += z; sumSquares += z * z; if (k >= 4) means.push([k, sum / k]); }
    const mean = sum / input, variance = (sumSquares - sum * sum / input) / (input - 1), se = Math.sqrt(4 / (45 * input));
    return { ...base, xDomain: [4, 400], yDomain: [0, 0.75], xLabel: "Number of samples n", yLabel: "Estimate of E[U²]", selectedX: input, series: [{ label: "Fixed-seed running mean (through n)", points: means }, { label: "Exact expectation 1/3", points: [[4, 1 / 3], [400, 1 / 3]] }, { label: "Expectation + one theoretical SE", points: curve(4, 400, n => 1 / 3 + Math.sqrt(4 / (45 * n))) }, { label: "Expectation − one theoretical SE", points: curve(4, 400, n => 1 / 3 - Math.sqrt(4 / (45 * n))) }], markers: [{ label: "Current running mean", point: [input, mean] }], summary: `At n=${input}, the fixed-seed estimate is ${fmt(mean)} versus exact 1/3; absolute error=${fmt(Math.abs(mean - 1 / 3))}. The IID model's true standard error is ${fmt(se)}, while the sample-based estimate is ${fmt(Math.sqrt(variance / input))}. More samples reduce variance, not necessarily the realized error at every step. The reference curves are not a confidence band.`, values: [value("Sample count", input, "draws"), value("Fixed-seed mean", mean), value("Exact expectation", 1 / 3), value("Absolute realized error", Math.abs(mean - 1 / 3)), value("Exact variance of U²", 4 / 45), value("Exact standard error", se), value("Estimated standard error", Math.sqrt(variance / input))] };
  }
  if (model === "sample-importance") {
    const p = 0.01, q = input, n = 100, variance = p * p * (1 - q) / (n * q), baseline = p * (1 - p) / n;
    return { ...base, xDomain: [0.01, 0.99], xLabel: "Proposal success probability q", yLabel: "Estimator variance / direct-MC variance", selectedX: q, series: [{ label: "Ordinary importance-sampling variance ratio", points: curve(0.01, 0.99, t => p * (1 - t) / (t * (1 - p))) }, { label: "Direct target sampling: ratio 1", points: [[0.01, 1], [0.99, 1]] }], summary: `For 100 proposal draws at q=${q}, the unbiased rare-event estimate has variance ${fmt(variance)} and SE ${fmt(Math.sqrt(variance))}, versus direct-sampling SE ${fmt(Math.sqrt(baseline))}. A success contributes p/q=${fmt(p / q)} before division by n. Zero successes occur with probability ${fmt((1 - q) ** n)}. This efficiency is specific to estimating the rare-event probability, not every target expectation.`, values: [value("Target event probability p", p), value("Proposal event probability q", q), value("Event weight p/q", p / q), value("Non-event weight (1−p)/(1−q)", (1 - p) / (1 - q)), value("Expected estimate", p), value("IS estimator variance", variance), value("Direct estimator variance", baseline), value("IS standard error", Math.sqrt(variance)), value("Variance ratio", variance / baseline), value("Probability of no event draws", (1 - q) ** n)] };
  }
  if (model === "sample-rejection") {
    const uniform = stream(2718), accepted: Point[] = [], rejected: Point[] = [];
    for (let i = 0; i < 80; i++) { const x = uniform(), height = input * uniform(); (height <= 2 * x ? accepted : rejected).push([x, height]); }
    return { ...base, xDomain: [-0.03, 1.03], yDomain: [0, 5.2], xLabel: "Proposal x on [0,1]", yLabel: "Envelope height M·U", shaded: [[0, 0], [1, 2], [1, 0]], series: [{ label: "Target density f(x)=2x", points: [[0, 0], [1, 2]] }, { label: `Valid envelope M·g(x)=${input}`, points: [[0, input], [1, input]] }, { label: "Accepted proposals", points: accepted, style: "points" }, { label: "Rejected proposals", points: rejected, style: "points" }], summary: `Envelope M=${input} gives theoretical acceptance 1/M=${fmt(1 / input)} and expected ${input} proposals per accepted draw. This fixed set accepts ${accepted.length} of 80 proposals (${fmt(accepted.length / 80)}). That realized fraction need not equal 1/M. Increasing M keeps the target law but wastes more proposals.`, values: [value("Envelope constant M", input), value("Theoretical acceptance probability", 1 / input), value("Expected proposals per accepted draw", input, "proposals"), value("Accepted in fixed sample", accepted.length, "proposals"), value("Rejected in fixed sample", rejected.length, "proposals"), value("Realized acceptance fraction", accepted.length / 80), value("Exact target mean", 2 / 3)] };
  }
  if (model === "process-markov") {
    const failure = 0.5, repair = input, stationary = failure / (failure + repair), failed = (t: number) => stationary * (1 - Math.exp(-(failure + repair) * t));
    return { ...base, xDomain: [0, 6], xLabel: "Elapsed time (hours)", yLabel: "State probability", series: [{ label: "Working probability (starts at 1)", points: curve(0, 6, t => 1 - failed(t)) }, { label: "Failed probability (starts at 0)", points: curve(0, 6, failed) }, { label: "Stationary failed probability", points: [[0, stationary], [6, stationary]] }], matrices: [{ label: "Generator Q: rows are current state; entries per hour", rowLabels: ["working", "failed"], columnLabels: ["working", "failed"], entries: [[-failure, failure], [repair, -repair]] }], summary: `Repair rate β=${repair} per hour gives stationary failed probability ${fmt(stationary)}. Starting working, failed probability after 6 hours is ${fmt(failed(6))}. Mean failed-state holding time is 1/β=${fmt(1 / repair)} hours. The generator contains rates, not transition probabilities; each row sums to zero.`, values: [value("Failure rate α", failure, "per hour"), value("Repair rate β", repair, "per hour"), value("Mean working holding time", 1 / failure, "hours"), value("Mean failed holding time", 1 / repair, "hours"), value("Failed probability at 6 hours", failed(6)), value("Stationary failed probability", stationary), value("Stationary working probability", 1 - stationary), value("Relaxation time 1/(α+β)", 1 / (failure + repair), "hours")] };
  }
  const sigma = input, dt = 0.05, a = Math.exp(-dt), uniform = stream(31415), path: Point[] = [[0, 1]];
  let state = 1;
  for (let k = 1; k <= 80; k++) {
    const z = Math.sqrt(-2 * Math.log(1 - uniform())) * Math.cos(2 * Math.PI * uniform());
    state = a * state + sigma * Math.sqrt(-Math.expm1(-2 * dt) / 2) * z;
    path.push([k * dt, state]);
  }
  const sd = (t: number) => sigma * Math.sqrt(-Math.expm1(-2 * t) / 2);
  const upper = curve(0, 4, t => Math.exp(-t) + sd(t)), lower = curve(0, 4, t => Math.exp(-t) - sd(t));
  const allY = [...path, ...upper, ...lower].map(([, y]) => y), minY = Math.min(0, ...allY), maxY = Math.max(1, ...allY), pad = (maxY - minY) * 0.1;
  return { ...base, xDomain: [0, 4], yDomain: [minY - pad, maxY + pad], xLabel: "Time (seconds)", yLabel: "Normalized state X", series: [{ label: "Exact mean exp(−t)", points: curve(0, 4, t => Math.exp(-t)) }, { label: "One fixed-seed exact-grid realization", points: path }, { label: "Mean + one pointwise SD", points: upper }, { label: "Mean − one pointwise SD", points: lower }], summary: `For diffusion σ=${sigma}, E[X₄]=exp(−4)=${fmt(Math.exp(-4))} and Var(X₄)=${fmt(sd(4) ** 2)}. The displayed realization ends at ${fmt(state)}. ${sigma === 0 ? "Zero diffusion recovers deterministic exponential decay." : "Individual paths fluctuate even while their mean decays."} The ±1 SD curves describe marginal spread at each time, not a confidence interval or a simultaneous path envelope.`, values: [value("Diffusion σ", sigma, "state / √second"), value("Grid step", dt, "seconds"), value("Mean at t=4", Math.exp(-4), "state"), value("Variance at t=4", sd(4) ** 2, "state²"), value("Pointwise SD at t=4", sd(4), "state"), value("Displayed endpoint at t=4", state, "state"), value("Stationary variance σ²/2", sigma * sigma / 2, "state²")] };
}
