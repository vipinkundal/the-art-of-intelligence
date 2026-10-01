import type { CalculationResult } from "./calculations.ts";
export const localSearchModels = ["local-hill", "local-restarts", "local-annealing", "local-tabu", "local-beam", "local-min-conflicts"] as const;
export type LocalSearchModel = typeof localSearchModels[number];
export const isLocalSearchModel = (model: string): model is LocalSearchModel => (localSearchModels as readonly string[]).includes(model);
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const landscape = [1, 4, 7, 6, 3, 5, 8, 10, 9];
const neighbors = (x: number) => [x - 1, x + 1].filter(y => y >= 0 && y < landscape.length);
function climb(start: number) {
  const path = [start];
  for (;;) {
    const x = path[path.length - 1], choices = neighbors(x).sort((a, b) => landscape[b] - landscape[a] || a - b);
    if (landscape[choices[0]] <= landscape[x]) return path;
    path.push(choices[0]);
  }
}
const matrixBase = { kind: "matrix" as const, series: [], xLabel: "Step", yLabel: "Cost", xDomain: [0, 8] as [number, number], yDomain: [0, 10] as [number, number] };
export function calculateLocalSearch(model: LocalSearchModel, input: number): CalculationResult {
  const limits: Record<LocalSearchModel, [number, number]> = { "local-hill": [0, 8], "local-restarts": [1, 12], "local-annealing": [0, 5], "local-tabu": [0, 2], "local-beam": [1, 3], "local-min-conflicts": [0, 2] };
  if (!Number.isFinite(input) || input < limits[model][0] || input > limits[model][1] || (model !== "local-annealing" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  if (model === "local-hill") {
    const path = climb(input), final = path.at(-1)!;
    return { kind: "lines", controlValue: `Start x=${input}; stop at x=${final}`, series: [{ label: "Objective landscape (maximize)", points: landscape.map((u, x) => [x, u]) }, { label: "Visited configurations", style: "points", points: path.map(x => [x, landscape[x]]) }], xLabel: "Configuration index x", yLabel: "Utility (points)", xDomain: [0, 8], yDomain: [0, 11], selectedX: input,
      markers: [{ label: "Terminal local maximum", point: [final, landscape[final]], hollow: true }],
      matrices: [{ label: "Strict improvement trace", rowLabels: path.map((x, i) => `Step ${i}: x=${x}`), columnLabels: ["utility"], entries: path.map(x => [landscape[x]]) }],
      summary: `Path: ${path.join(" → ")}. At x=${final}, utility is ${landscape[final]} and no adjacent configuration improves it. ${final === 2 ? "This is a local maximum, three points below the global value 10 at x=7. Reaching that basin from x=2 requires a temporary decrease." : "This run reaches the global maximum at x=7."} Starts 0 through 4 finish at x=2; starts 5 through 8 finish at x=7. The line connects discrete configurations for readability; no fractional x or derivative is part of this search.`,
      values: [value("Accepted moves", path.length - 1), value("Terminal configuration", final), value("Returned utility", landscape[final], "points"), value("Global utility (enumerated)", 10, "points"), value("Gap to global maximum", 10 - landscape[final], "points")] };
  }
  if (model === "local-restarts") {
    const p = 4 / 9, probability = 1 - (1 - p) ** input, starts = landscape.map((_, x) => ({ x, end: climb(x).at(-1)! }));
    return { kind: "lines", controlValue: `${input} independent runs · success ${(100 * probability).toFixed(2)}%`, series: [{ label: "Probability at least one run reaches x=7", points: Array.from({ length: 13 }, (_, r) => [r, 1 - (1 - p) ** r]) }], xLabel: "Independent restart runs r (includes first run)", yLabel: "Probability of finding the global maximum", xDomain: [0, 12], yDomain: [0, 1], selectedX: input,
      matrices: [{ label: "Uniform starting-state basins", rowLabels: starts.map(s => `Start ${s.x}`), columnLabels: ["terminal x", "utility", "global (1=yes)"], entries: starts.map(s => [s.end, landscape[s.end], Number(s.end === 7)]) }],
      summary: `Four of nine equally likely starting configurations climb to x=7, so one run succeeds with p=4/9. With ${input} independent ${input === 1 ? "run" : "runs"} sampled with replacement, P(at least one success)=1−(5/9)^${input}=${probability.toFixed(6)}. Failure probability remains ${((5 / 9) ** input).toFixed(6)} at this finite budget. The expected number of independent runs until first success is 1/p=2.25; this is not a time bound. The calculation uses exact basin counts, not random simulation.`,
      values: [value("One-run success probability", p), value("Runs budgeted", input), value("At-least-one success probability", probability), value("All-runs failure probability", (1 - p) ** input), value("Expected runs until success", 1 / p)] };
  }
  if (model === "local-annealing") {
    const acceptance = (gap: number, temperature: number) => temperature === 0 ? 0 : Math.exp(-gap / temperature);
    const gaps = [1, 3, 5], temperatures = Array.from({ length: 51 }, (_, i) => i / 10);
    return { kind: "lines", controlValue: `T=${input.toFixed(1)} cost units`, series: gaps.map(gap => ({ label: `Uphill cost ΔE=${gap}`, points: temperatures.map(t => [t, acceptance(gap, t)]) })), xLabel: "Temperature T (same units as cost E)", yLabel: "Conditional acceptance probability", xDomain: [0, 5], yDomain: [0, 1], selectedX: input,
      matrices: [{ label: "Acceptance of a proposed worsening move", rowLabels: gaps.map(g => `ΔE=${g}`), columnLabels: ["accept probability"], entries: gaps.map(g => [acceptance(g, input)]) }],
      summary: `For minimization, improving or equal-cost proposals are accepted; a worsening proposal with ΔE>0 is accepted with exp(−ΔE/T) for T>0. At T=${input}, a cost increase of three is accepted with probability ${acceptance(3, input).toFixed(6)}. ${input === 0 ? "The displayed T=0 point is the greedy limit for strictly positive gaps, not a division by zero." : "These probabilities are conditional on that neighbor being proposed; the proposal distribution still determines which move is attempted."} This lab evaluates one-step probabilities, not an annealing trajectory or cooling schedule.`,
      values: [value("Temperature", input, "cost units"), value("Accept ΔE=1", acceptance(1, input)), value("Accept ΔE=3", acceptance(3, input)), value("Accept ΔE=5", acceptance(5, input)), value("Accept improvement or tie", 1)] };
  }
  if (model === "local-tabu") {
    const labels = ["P", "Q", "R", "G"], energy = [0, 1, 4, -2], adjacent = [[1], [0, 2], [1, 3], [2]];
    const path = [0], memories: number[][] = [[]], bestCosts = [0];
    let memory: number[] = [], best = 0;
    for (let step = 0; step < 12 && path.at(-1) !== 3; step++) {
      const current = path.at(-1)!, allowed = adjacent[current].filter(n => !memory.includes(n) || energy[n] < best).sort((a, b) => energy[a] - energy[b] || a - b);
      if (!allowed.length) break;
      const next = allowed[0]; path.push(next); best = Math.min(best, energy[next]);
      memory = input ? [...memory, current].slice(-input) : [];
      memories.push([...memory]); bestCosts.push(best);
    }
    return { ...matrixBase, controlValue: `State tabu tenure ${input}; ${path.length - 1} moves`, graph: { title: "The cheaper return can block a useful escape", height: 410, maxWidth: 360, summary: "Undirected edges are allowed configuration moves, not path costs. Node labels show the objective E to minimize. Dashed coral marks moves used in the trace. Memory forbids recently departed states, unless entering one strictly improves the best cost seen.", nodes: labels.map((id, i) => ({ id, label: id, x: 160, y: 45 + i * 95, observed: false, state: `E=${energy[i]}` })), edges: labels.slice(0, -1).map((id, i) => ({ from: id, to: labels[i + 1], directed: false, accent: path.some((v, j) => j > 0 && ((v === i && path[j - 1] === i + 1) || (v === i + 1 && path[j - 1] === i))) })) },
      matrices: [{ label: "Current objective and best objective are separate", rowLabels: path.map((v, i) => `${i}. ${labels[v]} · tabu {${memories[i].map(n => labels[n]).join(",")}}`), columnLabels: ["current E", "best E"], entries: path.map((v, i) => [energy[v], bestCosts[i]]) }],
      summary: `Trace: ${path.map(v => labels[v]).join(" → ")}. ${input === 0 ? "Without memory, best-neighbor selection cycles P↔Q for the twelve-move display budget. It accepts worsening moves, but repeatedly chooses the cheap return instead of R." : "At Q, P is tabu, so the run accepts R at cost four and then reaches G at cost minus two. This temporary worsening is needed to escape."} Tenure counts the last ${input} departed states; G is a known target in this four-state toy. The best-so-far aspiration rule is implemented but never triggered here. Neither short memory nor this successful trace proves a general absence of cycles or optimality.`,
      values: [value("Moves performed", path.length - 1), value("Current cost", energy[path.at(-1)!], "cost units"), value("Best cost seen", best, "cost units"), value("Target G reached (1=yes)", Number(path.at(-1) === 3)), value("Stored departed states", memory.length)] };
  }
  if (model === "local-beam") {
    const utility = [0, 5, 4, 1, 3, 2, 9, 6], bits = (n: number) => n.toString(2).padStart(3, "0");
    let beam = [0, 7, 2].slice(0, input);
    const generations = [beam];
    for (let step = 0; step < 3 && !beam.includes(6); step++) {
      const pool = [...new Set(beam.flatMap(s => [s ^ 1, s ^ 2, s ^ 4]))];
      beam = pool.sort((a, b) => utility[b] - utility[a] || a - b).slice(0, input);
      generations.push(beam);
    }
    const best = [...beam].sort((a, b) => utility[b] - utility[a] || a - b)[0];
    return { kind: "bars", controlValue: `Width ${input}; ${generations.length - 1} pooled generations`, series: [{ label: "Utility of each complete three-bit configuration", points: utility.map((u, n) => [n, u]) }], xLabel: "Configuration ID (binary mapping in table)", yLabel: "Utility (points)", xDomain: [-0.5, 7.5], yDomain: [0, 10], selectedX: best,
      matrices: [{ label: "Shared successor pool; selected beams by generation", rowLabels: generations.map((g, i) => `g${i}: ${g.map(bits).join(" + ")}`), columnLabels: ["beam size", "best utility"], entries: generations.map(g => [g.length, Math.max(...g.map(n => utility[n]))]) }, { label: "Complete configuration scores", rowLabels: utility.map((_, n) => `${n} = ${bits(n)}`), columnLabels: ["utility"], entries: utility.map(u => [u]) }],
      summary: `Width ${input} starts with ${generations[0].map(bits).join(", ")}. Each generation flips one bit in every beam member, deduplicates the combined successors and keeps the top ${input}; numeric IDs break ties. Parents do not receive automatic elite slots. ${input === 1 ? "The three-generation trace is 000→001→101→111, finishing at utility six without finding 110 at utility nine." : "Pooling successors of 000 and 111 finds 110 at utility nine after one generation; the known target stops this toy run."} This comparison changes both width and the explicitly supplied starting population. It is not a controlled claim that wider beams always perform better.`,
      values: [value("Beam width", input), value("Generations performed", generations.length - 1), value("Best final utility", utility[best], "points"), value("Target 110 found (1=yes)", Number(beam.includes(6)))] };
  }
  const labels = ["A", "B", "C"], pairs: [number, number][] = [[0, 1], [1, 2], [0, 2]], states = [[1, 1, 1]];
  const violations = (s: number[]) => pairs.filter(([a, b]) => s[a] === s[b]).length;
  for (let step = 0; step < input; step++) {
    const state = states.at(-1)!, variable = labels.findIndex((_, i) => pairs.some(([a, b]) => (a === i || b === i) && state[a] === state[b]));
    if (variable < 0) break;
    const ranked = [1, 2, 3].map(v => { const s = [...state]; s[variable] = v; return { v, count: violations(s), state: s }; }).sort((a, b) => a.count - b.count || a.v - b.v);
    states.push(ranked[0].state);
  }
  const current = states.at(-1)!, variable = labels.findIndex((_, i) => pairs.some(([a, b]) => (a === i || b === i) && current[a] === current[b]));
  const positions = [[160, 45], [65, 210], [255, 210]];
  const matrices: NonNullable<CalculationResult["matrices"]> = [{ label: "Repair trace of complete assignments", rowLabels: states.map((_, i) => `After ${i} repairs`), columnLabels: ["A", "B", "C", "conflicts"], entries: states.map(s => [...s, violations(s)]) }];
  if (variable >= 0) matrices.push({ label: `Next conflicted variable ${labels[variable]}: trial total conflicts`, rowLabels: [1, 2, 3].map(v => `${labels[variable]}=${v}`), columnLabels: ["conflicts"], entries: [1, 2, 3].map(v => { const s = [...current]; s[variable] = v; return [violations(s)]; }) });
  return { ...matrixBase, controlValue: `${input} repairs; ${violations(current)} conflicts`, graph: { title: "Repair one conflicted color at a time", height: 310, maxWidth: 420, summary: "Every edge requires unequal colors. Node annotations show the complete current assignment. Dashed coral marks violated constraints, not selected transitions. Conflicted-variable selection and value ties are deterministic in this trace.", nodes: labels.map((id, i) => ({ id, label: id, x: positions[i][0], y: positions[i][1], observed: false, state: `color ${current[i]}` })), edges: pairs.map(([a, b]) => ({ from: labels[a], to: labels[b], directed: false, label: "≠", accent: current[a] === current[b] })) }, matrices,
    summary: `Assignment (${current.join(",")}) has ${violations(current)} violated ${violations(current) === 1 ? "edge" : "edges"}. ${variable < 0 ? "Every inequality is satisfied: (2,3,1) is a solution after two repairs." : `Choose the alphabetically first conflicted variable, ${labels[variable]}, then minimize incident conflicts over colors 1,2,3; ties choose the smaller color. Other edges remain fixed, so ranking total conflicts gives the same choice.`} The trace starts (1,1,1), repairs A to 2, then B to 3; conflict counts are 3→1→0. This deterministic demonstration is one min-conflicts policy, not a performance guarantee for arbitrary CSPs.`,
    values: [value("Repairs completed", states.length - 1), value("Violated constraints", violations(current)), value("Constraints satisfied", 3 - violations(current)), value("Complete assignment feasible (1=yes)", Number(violations(current) === 0))] };
}
