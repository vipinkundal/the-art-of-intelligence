import type { CalculationResult } from "./calculations.ts";

export const structuredModels = ["structured-junction", "structured-crf", "structured-dbn"] as const;
export type StructuredModel = typeof structuredModels[number];
export const isStructuredModel = (model: string): model is StructuredModel => (structuredModels as readonly string[]).includes(model);
type Point = [number, number];
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const fmt = (n: number) => Number(n.toFixed(6));
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const node = (id: string, label: string, x: number, y: number, observed = false) => ({ id, label, x, y, observed, state: "" });
const pair = (a: number, b: number) => a === b ? 3 : 1;
const binary = [0, 1];

export function calculateStructured(model: StructuredModel, input: number): CalculationResult {
  const bounds: Record<StructuredModel, Point> = { "structured-junction": [.25, 4], "structured-crf": [1, 6], "structured-dbn": [1, 6] };
  if (!Number.isFinite(input) || input < bounds[model][0] || input > bounds[model][1] || (model === "structured-dbn" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "lines", series: [], xDomain: [0, 1], yDomain: [0, 1], xLabel: "Parameter", yLabel: "Probability", summary: "", values: [] };
  if (model === "structured-junction") {
    const a = input;
    // Original cycle AB, BC, CD, DA. The fill edge AC creates no extra factor.
    const left = (x: number, b: number, c: number) => (x ? a : 1) * pair(x, b) * pair(b, c);
    const right = (x: number, c: number, d: number) => pair(c, d) * pair(d, x);
    const lMessage = binary.map(x => binary.map(c => sum(binary.map(b => left(x, b, c)))));
    const rMessage = binary.map(x => binary.map(c => sum(binary.map(d => right(x, c, d)))));
    const lBelief = binary.flatMap(x => binary.flatMap(b => binary.map(c => ({ x, b, c, weight: left(x, b, c) * rMessage[x][c] }))));
    const rBelief = binary.flatMap(x => binary.flatMap(c => binary.map(d => ({ x, c, d, weight: right(x, c, d) * lMessage[x][c] }))));
    const z = sum(lBelief.map(r => r.weight));
    const separator = (rows: typeof lBelief | typeof rBelief) => binary.map(x => binary.map(c => sum(rows.filter(r => r.x === x && r.c === c).map(r => r.weight)) / z));
    const lSep = separator(lBelief), rSep = separator(rBelief);
    const pA = sum(lSep[1]), pC = lSep[0][1] + lSep[1][1];
    const error = Math.max(...lSep.flatMap((row, i) => row.map((v, j) => Math.abs(v - rSep[i][j]))));
    const table = (label: string, entries: number[][]) => ({ label, rowLabels: ["A=0", "A=1"], columnLabels: ["C=0", "C=1"], entries });
    return { ...base, kind: "matrix", controlValue: `a=${fmt(a)} · both cliques calibrated`,
      graph: { title: "A cyclic model becomes a tree of overlapping clusters", summary: "The original graph is A—B—C—D—A. Its junction tree has clusters ABC and ACD, joined on separator {A,C}. These circles are clusters, not individual variables. Adding fill edge AC changes the computation, not the original probability model.", nodes: [node("left", "ABC", 70, 50), node("right", "ACD", 250, 50)], edges: [{ from: "left", to: "right", directed: false }] },
      matrices: [table("ABC → ACD: sum out B", lMessage), table("ACD → ABC: sum out D", rMessage), table("P(A,C) from calibrated ABC", lSep), table("P(A,C) from calibrated ACD", rSep)],
      summary: `At a=${fmt(a)}, both calibrated clique tables sum to Z=${fmt(z)} before normalization. Their separator marginals agree (largest absolute difference ${fmt(error)}). P(A=1)=${fmt(pA)} and P(C=1)=${fmt(pC)}. Each binary three-variable clique has 8 entries; the separator has 4.`,
      values: [value("Partition function Z", z), value("P(A=1)", pA), value("P(C=1)", pC), value("Separator disagreement", error), value("Entries per clique", 8), value("Entries per separator", 4)] };
  }
  if (model === "structured-crf") {
    const r = input, unary = [[1, 4], [3, 1], [1, 2]];
    const rows = Array.from({ length: 8 }, (_, i) => {
      const y = [i >> 2, (i >> 1) & 1, i & 1];
      const agreements = Number(y[0] === y[1]) + Number(y[1] === y[2]);
      return { name: y.join(""), y, agreements, weight: y.reduce((p, state, t) => p * unary[t][state], 1) * r ** agreements };
    });
    const z = sum(rows.map(row => row.weight)), best = Math.max(...rows.map(row => row.weight));
    const maps = rows.filter(row => Math.abs(row.weight - best) < 1e-10).map(row => row.name);
    const marginal = sum(rows.filter(row => row.y[1] === 1).map(row => row.weight)) / z;
    const expectedAgreements = sum(rows.map(row => row.agreements * row.weight)) / z;
    return { ...base, kind: "bars", xDomain: [-.5, 7.5], xTicks: rows.map((_, i) => i), xTickLabels: rows.map(row => row.name), xLabel: "Complete label sequence y₁y₂y₃", yLabel: "Sequence probability P(y|x)",
      graph: { title: "Input scores compete with neighboring-label agreement", summary: `The fixed input supplies unary scores (1,4), (3,1), (1,2). Every adjacent matching pair multiplies the sequence weight by r=${fmt(r)}. Edges denote compatibility, not causal direction. Joint MAP: ${maps.join(" and ")}; independent unary choices: 101.`, nodes: [node("y1", "y₁", 50, 50), node("y2", "y₂", 160, 50), node("y3", "y₃", 270, 50)], edges: [{ from: "y1", to: "y2", directed: false }, { from: "y2", to: "y3", directed: false }] },
      series: [{ label: "Globally normalized sequence probabilities", points: rows.map((row, i): Point => [i, row.weight / z]) }],
      matrices: [{ label: "Input-dependent unary weights (not probabilities)", rowLabels: ["position 1", "position 2", "position 3"], columnLabels: ["label 0", "label 1"], entries: unary }, { label: "Enumerated sequence weights and probabilities", rowLabels: rows.map(row => row.name), columnLabels: ["matches", "weight", "P(y|x)"], entries: rows.map(row => [row.agreements, row.weight, row.weight / z]) }],
      summary: `At r=${fmt(r)}, Z(x)=${fmt(z)} and joint MAP is ${maps.join(" or ")} with probability ${fmt(best / z)}. The unary-only choice 101 has probability ${fmt(rows[5].weight / z)}. Marginal P(y₂=1|x)=${fmt(marginal)}; decoding a complete sequence is a different query. Expected adjacent matches=${fmt(expectedAgreements)} of 2.`,
      values: [value("Conditional partition function Z(x)", z), value("Joint MAP probability", best / z), value("Probability of unary-only sequence 101", rows[5].weight / z), value("P(y₂=1|x)", marginal), value("Expected adjacent matches", expectedAgreements)] };
  }
  const observations = [1, 1, 0, 1, 0, 0], states = [[0, 0], [0, 1], [1, 0], [1, 1]];
  const healthChance = [[.05, .6], [.7, .95]];
  let filtered = [.4, .1, .4, .1];
  const history = [];
  for (let t = 0; t < input; t++) {
    const predicted = t === 0 ? [...filtered] : states.map(([r, h]) => sum(states.map(([oldR, oldH], i) => {
      const chance = healthChance[oldH][r];
      return filtered[i] * (r === oldR ? .9 : .1) * (h ? chance : 1 - chance);
    })));
    const weights = states.map(([, h], i) => predicted[i] * (observations[t] === h ? .9 : .1));
    const evidence = sum(weights);
    filtered = weights.map(w => w / evidence);
    const regime = filtered[2] + filtered[3], health = filtered[1] + filtered[3];
    history.push({ t: t + 1, predicted, filtered: [...filtered], evidence, regime, health, gap: filtered[3] - regime * health });
  }
  const current = history[history.length - 1];
  return { ...base, xDomain: [1, 6], xTicks: [1, 2, 3, 4, 5, 6], xLabel: "Observation prefix length t", yLabel: "Filtered probability given O₁:ₜ", selectedX: input,
    controlValue: `${input} readings · ${observations.slice(0, input).join(", ")}`,
    graph: { title: "Two hidden variables, one repeated time-slice template", height: 305, summary: "Left is a recurring slice t≥2, right (prime) is t+1. R is a regime, H is a fault state and O is an alarm. Horizontal arrows carry memory; vertical R→H arrows couple each slice. Highlighted O nodes identify the observed variable type, not future evidence used by the filter. The separate initial slice has independent R₁ and H₁.", nodes: [node("r", "R", 65, 40), node("rn", "R′", 255, 40), node("h", "H", 65, 145), node("hn", "H′", 255, 145), node("o", "O", 65, 255, true), node("on", "O′", 255, 255, true)], edges: [{ from: "r", to: "rn" }, { from: "h", to: "hn" }, { from: "r", to: "h" }, { from: "rn", to: "hn" }, { from: "h", to: "o" }, { from: "hn", to: "on" }] },
    series: [{ label: "P(Rₜ=1 | observed prefix)", points: history.map(h => [h.t, h.regime]) }, { label: "P(Hₜ=1 | observed prefix)", points: history.map(h => [h.t, h.health]) }],
    markers: [{ label: "Current fault probability", point: [input, current.health] }],
    matrices: [{ label: `Joint state at t=${input}: prediction then observation update`, rowLabels: ["R0 H0", "R0 H1", "R1 H0", "R1 H1"], columnLabels: ["predicted", "filtered"], entries: current.predicted.map((p, i) => [p, current.filtered[i]]) }, { label: "P(H′=1 | H,R′)", rowLabels: ["H=0", "H=1"], columnLabels: ["R′=0", "R′=1"], entries: healthChance }],
    summary: `After readings ${observations.slice(0, input).join(", ")}, P(Rₜ=1|O₁:ₜ)=${fmt(current.regime)} and P(Hₜ=1|O₁:ₜ)=${fmt(current.health)}. The latest observation has predictive probability ${fmt(current.evidence)}. Joint P(Rₜ=1,Hₜ=1) minus the product of its marginals is ${fmt(current.gap)}. The filter retains all four joint states rather than assuming the hidden variables stay independent.`,
    values: [value("Readings incorporated", input), value("Regime-1 probability", current.regime), value("Fault probability", current.health), value("Latest evidence normalizer", current.evidence), value("Posterior binary covariance", current.gap)] };
}
