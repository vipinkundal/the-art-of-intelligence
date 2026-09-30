import type { CalculationResult } from "./calculations.ts";

export const particleModels = ["particle-filtering", "particle-tempering", "probabilistic-decision"] as const;
export type ParticleModel = typeof particleModels[number];
export const isParticleModel = (model: string): model is ParticleModel => (particleModels as readonly string[]).includes(model);
type Point = [number, number];
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const normalize = (xs: number[]) => { const z = sum(xs); return xs.map(x => x / z); };
const ess = (weights: number[]) => 1 / sum(weights.map(w => w * w));
const fmt = (x: number) => Number(x.toFixed(6));
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const locations = [0, 1, 2, 3, 4];
const distance = (a: number, b: number) => Math.min(Math.abs(a - b), 5 - Math.abs(a - b));
const transition = (from: number, to: number) => distance(from, to) === 0 ? .6 : distance(from, to) === 1 ? .2 : 0;
const likelihood = (state: number, observation: number) => distance(state, observation) === 0 ? .6 : distance(state, observation) === 1 ? .15 : .05;
function categorical(weights: number[], u: number) {
  let cumulative = 0;
  for (let i = 0; i < weights.length - 1; i++) { cumulative += weights[i]; if (u < cumulative) return i; }
  return weights.length - 1;
}
function systematic(weights: number[], offset: number) {
  // offset is in [0,1/N); each threshold selects its CDF interval.
  return weights.map((_, i) => categorical(weights, offset + i / weights.length));
}
function seededRandom() {
  let seed = 20260930;
  return () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
}

export function calculateParticle(model: ParticleModel, input: number): CalculationResult {
  const bounds: Record<ParticleModel, Point> = { "particle-filtering": [1, 6], "particle-tempering": [0, 1], "probabilistic-decision": [0, 10] };
  if (!Number.isFinite(input) || input < bounds[model][0] || input > bounds[model][1] || (model === "particle-filtering" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "bars", series: [], xDomain: [-.5, 4.5], yDomain: [0, 1], xLabel: "State", yLabel: "Probability", summary: "", values: [] };
  if (model === "particle-tempering") {
    const scores = [1, 2, 4, 16], names = ["A", "B", "C", "D"], powers = scores.map(l => l ** input), weights = normalize(powers);
    const selected = systematic(weights, .125), counts = scores.map((_, i) => selected.filter(j => j === i).length);
    const post = counts.map(n => n / 4), unique = new Set(selected).size, tv = sum(weights.map((w, i) => Math.abs(w - post[i]))) / 2;
    return { ...base, xDomain: [-.5, 3.5], xTicks: [0, 1, 2, 3], xTickLabels: names, xLabel: "Static hypothesis", yLabel: "Mass on each hypothesis", controlValue: `β=${fmt(input)} · restart from the same four particles`,
      series: [{ label: "Weighted target before resampling", points: weights.map((w, i): Point => [i, w]) }, { label: "Empirical mass after resampling", points: post.map((w, i): Point => [i, w]) }],
      matrices: [{ label: "One tempered weighting and resampling stage", rowLabels: names, columnLabels: ["weight", "copies", "mass"], entries: weights.map((w, i) => [w, counts[i], post[i]]) }, { label: "Systematic CDF thresholds and selected hypothesis index", rowLabels: ["child 1", "child 2", "child 3", "child 4"], columnLabels: ["threshold", "A=0…D=3"], entries: selected.map((p, i) => [.125 + i / 4, p]) }],
      summary: `At β=${fmt(input)}, pre-resampling weight ESS=${fmt(ess(weights))} of 4. Thresholds (0.125,0.375,0.625,0.875) select ${selected.map(i => names[i]).join(", ")}. The four child weights are all 1/4, so their weight ESS is 4, with ${unique} distinct hypotheses surviving. Total variation from the exact tempered target is ${fmt(tv)} after this resampling realization.`,
      values: [value("Pre-resampling weight ESS", ess(weights)), value("Post-resampling weight ESS", 4), value("Distinct hypotheses after resampling", unique), value("Total variation after resampling", tv), value("Tempered normalizer under uniform prior", sum(powers) / 4)] };
  }
  if (model === "probabilistic-decision") {
    const posterior = .08 / .26, intervene = 1 - posterior, wait = input * posterior;
    const action = Math.abs(intervene - wait) < 1e-12 ? "Both actions have equal expected loss" : intervene < wait ? "Intervene has lower expected loss" : "Wait has lower expected loss";
    return { ...base, kind: "lines", xDomain: [0, 10], yDomain: [0, 3.5], xLabel: "Loss C for missing a fault", yLabel: "Posterior expected loss", selectedX: input,
      series: [{ label: "Intervene: loss only on a false alarm", points: [[0, intervene], [10, intervene]] }, { label: "Wait: loss C only if a fault exists", points: [[0, 0], [10, 10 * posterior]] }], markers: [{ label: "Lower achievable expected loss", point: [input, Math.min(intervene, wait)] }],
      matrices: [{ label: "Explicit loss table (abstract loss units)", rowLabels: ["intervene", "wait"], columnLabels: ["no fault", "fault"], entries: [[1, 0], [0, input]] }, { label: "Joint probability of a positive signal and hidden state", rowLabels: ["positive"], columnLabels: ["no fault", "fault"], entries: [[.18, .08]] }],
      summary: `The same positive signal gives P(fault|positive)=4/13=${fmt(posterior)} at every cost setting. At C=${fmt(input)}, expected loss is ${fmt(intervene)} for intervene and ${fmt(wait)} for wait. ${action}. The decision threshold is 1/(C+1)=${fmt(1 / (input + 1))}; the posterior itself does not change when preferences change.`,
      values: [value("Posterior fault probability", posterior), value("Probability of a positive signal", .26), value("Intervene expected loss", intervene, "loss units"), value("Wait expected loss", wait, "loss units"), value("Posterior threshold", 1 / (input + 1)), value("Cost at the tie", 2.25, "loss units")] };
  }
  const n = 20, observations = [0, 1, 1, 3, 4, 4], random = seededRandom();
  // One draw in each equal prior-CDF stratum gives four initial particles per site.
  let particles = Array.from({ length: n }, (_, i) => ({ state: Math.floor(5 * (i + random()) / n), ancestor: i }));
  let weights = Array(n).fill(1 / n) as number[], exact = Array(5).fill(.2) as number[];
  const history = [];
  for (let t = 0; t < input; t++) {
    if (t > 0) {
      particles = particles.map(p => ({ ...p, state: categorical(locations.map(to => transition(p.state, to)), random()) }));
      exact = locations.map(to => sum(locations.map(from => exact[from] * transition(from, to))));
    }
    const observation = observations[t];
    exact = normalize(exact.map((p, site) => p * likelihood(site, observation)));
    weights = normalize(weights.map((w, i) => w * likelihood(particles[i].state, observation)));
    const preESS = ess(weights), approximate = locations.map(site => sum(weights.filter((_, i) => particles[i].state === site)));
    const resampled = preESS < n / 2;
    if (resampled) { const selected = systematic(weights, random() / n); particles = selected.map(i => ({ ...particles[i] })); weights = Array(n).fill(1 / n) as number[]; }
    const counts = locations.map(site => particles.filter(p => p.state === site).length);
    history.push({ t: t + 1, observation, exact: [...exact], approximate, preESS, postESS: ess(weights), resampled, counts, ancestors: new Set(particles.map(p => p.ancestor)).size, tv: sum(exact.map((p, i) => Math.abs(p - approximate[i]))) / 2 });
  }
  const current = history[history.length - 1];
  return { ...base, xTicks: locations, xLabel: "Site on a five-position ring", yLabel: "Filtering probability", controlValue: `${input} observation${input === 1 ? "" : "s"} · ${observations.slice(0, input).join(", ")}`,
    series: [{ label: "Exact finite-state filter", points: current.exact.map((p, i): Point => [i, p]) }, { label: "20-particle weighted estimate before resampling", points: current.approximate.map((p, i): Point => [i, p]) }],
    matrices: [{ label: "Selected filtering step by site", rowLabels: locations.map(i => `site ${i}`), columnLabels: ["exact", "weighted", "count after"], entries: current.exact.map((p, i) => [p, current.approximate[i], current.counts[i]]) }, { label: "Weight diagnostic and initial-particle ancestry by observation", rowLabels: history.map(h => `t=${h.t}, O=${h.observation}`), columnLabels: ["ESS before", "resample 1/0", "ancestors"], entries: history.map(h => [h.preESS, Number(h.resampled), h.ancestors]) }],
    summary: `After observations ${observations.slice(0, input).join(", ")}, the pre-resampling estimate has total variation error ${fmt(current.tv)} against the exact filter. Weight ESS=${fmt(current.preESS)} of 20, so ${current.resampled ? "systematic resampling ran" : "resampling was skipped"} (threshold: strictly below 10). ${current.ancestors} original particle identities remain in the population. Counts in the table describe the population carried forward, not necessarily equal-weight posterior mass when resampling is skipped.`,
    values: [value("Observations incorporated", input), value("Weight ESS before resampling", current.preESS), value("Weight ESS after the optional step", current.postESS), value("Initial particle identities remaining", current.ancestors), value("Pre-resampling total variation error", current.tv), ...current.exact.map((p, i) => value(`Exact P(site ${i})`, p)), ...current.approximate.map((p, i) => value(`Particle P(site ${i}) before resampling`, p))] };
}
