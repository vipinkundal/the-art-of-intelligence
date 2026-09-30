import type { CalculationResult } from "./calculations.ts";

export const hiddenSequenceModels = ["sequence-hmm", "sequence-forward-backward", "sequence-viterbi"] as const;
export type HiddenSequenceModel = typeof hiddenSequenceModels[number];
export const isHiddenSequenceModel = (model: string): model is HiddenSequenceModel => (hiddenSequenceModels as readonly string[]).includes(model);
type Point = [number, number];
const observations = [1, 1, 0, 0];
const fmt = (x: number) => Number(x.toFixed(6));
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const emission = (state: number, observed: number, reliability: number) => state === observed ? reliability : 1 - reliability;
const transition = (from: number, to: number, persistence: number) => from === to ? persistence : 1 - persistence;

// Unscaled messages are safe for these four-observation examples, not long sequences.
function infer(observed: number[], persistence: number, reliability: number) {
  const forward: number[][] = [], backward: number[][] = [];
  for (let t = 0; t < observed.length; t++) {
    forward.push([0, 1].map(s => emission(s, observed[t], reliability) * (t === 0 ? 0.5 : forward[t - 1].reduce((sum, p, j) => sum + p * transition(j, s, persistence), 0))));
  }
  backward[observed.length - 1] = [1, 1];
  for (let t = observed.length - 2; t >= 0; t--) backward[t] = [0, 1].map(s => [0, 1].reduce((sum, j) => sum + transition(s, j, persistence) * emission(j, observed[t + 1], reliability) * backward[t + 1][j], 0));
  const likelihood = forward.at(-1)!.reduce((a, b) => a + b, 0);
  const filtered = forward.map(row => row[1] / (row[0] + row[1]));
  const smoothed = forward.map((row, t) => row[1] * backward[t][1] / likelihood);
  return { forward, backward, likelihood, filtered, smoothed };
}

export function calculateHiddenSequence(model: HiddenSequenceModel, input: number): CalculationResult {
  const bounds: Record<HiddenSequenceModel, [number, number]> = { "sequence-hmm": [0.05, 0.95], "sequence-forward-backward": [1, 4], "sequence-viterbi": [0.5, 0.99] };
  if (!Number.isFinite(input) || input < bounds[model][0] || input > bounds[model][1] || (model === "sequence-forward-backward" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "lines", series: [], xDomain: [1, 4], yDomain: [0, 1.05], xLabel: "Time index t", yLabel: "Probability", summary: "", values: [] };
  if (model === "sequence-hmm") {
    const patterns = [[1, 1, 0, 0], [1, 0, 1, 0], [1, 1, 1, 1]], selected = patterns.map(o => infer(o, input, 0.85).likelihood);
    return { ...base, xDomain: [0.05, 0.95], yDomain: [0, 0.25], xLabel: "Hidden-state persistence a", yLabel: "Probability of an exact observed sequence", selectedX: input, series: patterns.map(o => ({ label: `Observed ${o.join("")}`, points: Array.from({ length: 91 }, (_, i): Point => { const a = 0.05 + i / 100; return [a, infer(o, a, 0.85).likelihood]; }) })), markers: patterns.map((o, i) => ({ label: `P(${o.join("")}) at selected a`, point: [input, selected[i]] as Point })), matrices: [{ label: "Hidden transition A: current state → next state", rowLabels: ["S=0", "S=1"], columnLabels: ["S′=0", "S′=1"], entries: [[input, 1 - input], [1 - input, input]] }, { label: "Emission B: hidden state → observation", rowLabels: ["S=0", "S=1"], columnLabels: ["Y=0", "Y=1"], entries: [[0.85, 0.15], [0.15, 0.85]] }], summary: `At a=${fmt(input)}, P(1100)=${fmt(selected[0])}, P(1010)=${fmt(selected[1])} and P(1111)=${fmt(selected[2])}. Every individual Y still has P(Y=1)=0.5. The hidden transition changes sequence structure without changing that marginal. The three displayed events are only three of 16 possible observation strings.`, values: [...selected.map((p, i) => value(`P(observed ${patterns[i].join("")})`, p)), value("Marginal P(Yₜ=1)", 0.5), value("Adjacent observation correlation", (2 * input - 1) * 0.7 ** 2), value("Probability of all other observation strings", 1 - selected.reduce((a, b) => a + b, 0))] };
  }
  if (model === "sequence-forward-backward") {
    const prefix = observations.slice(0, input), result = infer(prefix, 0.8, 0.85);
    return { ...base, xTicks: [1, 2, 3, 4], yLabel: "P(hidden state Sₜ=1)", series: [{ label: "Filtering: observations through t", points: result.filtered.map((p, t) => [t + 1, p]) }, { label: `Smoothing: all ${input} revealed observations`, points: result.smoothed.map((p, t) => [t + 1, p]) }, { label: "Revealed observations (binary values, not probabilities)", points: prefix.map((p, t) => [t + 1, p]), style: "points" }], markers: [{ label: "Filtered state at t=1", point: [1, result.filtered[0]], hollow: true }, { label: "Smoothed state at t=1", point: [1, result.smoothed[0]] }], matrices: [{ label: "Forward αₜ(s): joint mass of prefix and state", rowLabels: prefix.map((_, t) => `t=${t + 1}`), columnLabels: ["S=0", "S=1"], entries: result.forward }, { label: "Backward βₜ(s): remaining-evidence likelihood", rowLabels: prefix.map((_, t) => `t=${t + 1}`), columnLabels: ["S=0", "S=1"], entries: result.backward }], summary: `Revealed prefix: ${prefix.join("")}. Filtering at t=1 stays at 0.85; smoothing at t=1 is now ${fmt(result.smoothed[0])}. At the final revealed time t=${input}, both agree at ${fmt(result.filtered.at(-1)!)} because there is no later evidence. Prefix likelihood P(y₁:${input})=${fmt(result.likelihood)}. Unrevealed observations are not used.`, values: [value("Revealed observations", input), value("Prefix likelihood", result.likelihood), ...result.filtered.map((p, t) => value(`Filtered P(S${t + 1}=1)`, p)), ...result.smoothed.map((p, t) => value(`Smoothed P(S${t + 1}=1 | prefix)`, p))] };
  }
  const e = input, a = 0.8, result = infer(observations, a, e), scores: number[][] = [], back: number[][] = [];
  for (let t = 0; t < 4; t++) {
    back[t] = [0, 0];
    scores[t] = [0, 1].map(s => {
      if (t === 0) return Math.log(0.5) + Math.log(emission(s, observations[t], e));
      const options = [0, 1].map(j => scores[t - 1][j] + Math.log(transition(j, s, a)));
      const parent = options[1] > options[0] + 1e-12 ? 1 : 0;
      back[t][s] = parent;
      return options[parent] + Math.log(emission(s, observations[t], e));
    });
  }
  const path = Array(4).fill(0) as number[];
  path[3] = scores[3][1] > scores[3][0] + 1e-12 ? 1 : 0;
  for (let t = 3; t > 0; t--) path[t - 1] = back[t][path[t]];
  const bestLog = scores[3][path[3]], joint = Math.exp(bestLog), marginalPath = result.smoothed.map(p => p > 0.5 + 1e-12 ? 1 : 0);
  const pathMass = (states: number[]) => states.reduce((p, s, t) => p * emission(s, observations[t], e) * (t ? transition(states[t - 1], s, a) : 0.5), 1);
  const ties = Array.from({ length: 16 }, (_, index) => [3, 2, 1, 0].map(bit => index >> bit & 1)).filter(states => Math.abs(Math.log(pathMass(states)) - bestLog) < 1e-12).length;
  return { ...base, xTicks: [1, 2, 3, 4], yDomain: [-0.1, 1.1], yLabel: "State label / marginal probability", series: [{ label: `Viterbi path ${path.join("")} (binary labels)`, points: path.map((s, t) => [t + 1, s]) }, { label: "Smoothed P(Sₜ=1), not a path", points: result.smoothed.map((p, t) => [t + 1, p]) }, { label: `Marginal decisions ${marginalPath.join("")} (binary labels)`, points: marginalPath.map((s, t) => [t + 1, s]), style: "points" }], matrices: [{ label: "Max-product scores exp(δ): best joint prefix mass", rowLabels: observations.map((_, t) => `t=${t + 1}`), columnLabels: ["end 0", "end 1"], entries: scores.map(row => row.map(Math.exp)) }, { label: "Backpointers: best predecessor for each end state", rowLabels: ["t=2", "t=3", "t=4"], columnLabels: ["end 0", "end 1"], entries: back.slice(1) }], summary: `At emission reliability e=${fmt(e)}, Viterbi selects ${path.join("")} with posterior path probability ${fmt(joint / result.likelihood)}. There ${ties === 1 ? "is 1 optimal path" : `are ${ties} tied optimal paths`}. Separate marginal decisions give ${marginalPath.join("")} with joint posterior probability ${fmt(pathMass(marginalPath) / result.likelihood)}. These answer different loss functions. Lines joining binary labels only connect discrete time steps.`, values: [value("Emission reliability", e), value("Observation likelihood P(1100)", result.likelihood), value("Best joint mass P(path, observations)", joint), value("Posterior probability of selected best path", joint / result.likelihood), value("Posterior probability of marginal-decision path", pathMass(marginalPath) / result.likelihood), value("Number of optimal paths (tolerance 1e−12 in log score)", ties), ...result.smoothed.map((p, t) => value(`Smoothed P(S${t + 1}=1)`, p))] };
}
