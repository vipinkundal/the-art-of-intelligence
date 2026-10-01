import type { CalculationResult } from "./calculations.ts";

export const sampledTreeModels = ["tree-mcts", "tree-uct"] as const;
export type SampledTreeModel = typeof sampledTreeModels[number];
export const isSampledTreeModel = (model: string): model is SampledTreeModel => (sampledTreeModels as readonly string[]).includes(model);
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
type Node = { id: string; children: string[]; reward?: number; n: number; w: number; expanded: string[] };

export function calculateSampledTree(model: SampledTreeModel, input: number): CalculationResult {
  if (!Number.isFinite(input) || input < 0 || input > (model === "tree-uct" ? 2 : 32) || (model === "tree-mcts" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  if (model === "tree-uct") {
    const counts = [80, 20], totals = [56, 12], means = totals.map((w, i) => w / counts[i]);
    const bonuses = counts.map(n => input * Math.sqrt(Math.log(100) / n)), scores = means.map((q, i) => q + bonuses[i]);
    const next = scores[0] >= scores[1] ? "A" : "B", threshold = (means[0] - means[1]) / (Math.sqrt(Math.log(100) / 20) - Math.sqrt(Math.log(100) / 80));
    return { kind: "bars", controlValue: `c=${input.toFixed(2)}; sample ${next} next`, xLabel: "Root action", yLabel: "Mean / selection score", xDomain: [-0.5, 1.5], yDomain: [0, 1.8], xTicks: [0, 1], xTickLabels: ["A", "B"],
      series: [{ label: "Empirical mean", points: means.map((q, i) => [i, q]) }, { label: "UCT selection score", points: scores.map((s, i) => [i, s]) }],
      matrices: [{ label: "One fixed root snapshot; counts do not change with c", rowLabels: ["A", "B"], columnLabels: ["visits", "mean", "bonus", "score"], entries: counts.map((n, i) => [n, means[i], bonuses[i], scores[i]]) }],
      summary: `Parent N=100. A has N=80, W=56 and mean 0.70; B has N=20, W=12 and mean 0.60. At c=${input.toFixed(2)}, bonuses are ${bonuses[0].toFixed(4)} and ${bonuses[1].toFixed(4)}, giving scores ${scores[0].toFixed(4)} and ${scores[1].toFixed(4)}. Sample ${next} next${Math.abs(scores[0] - scores[1]) < 1e-12 ? " by the A-first tie rule" : ""}. The crossover is c≈${threshold.toFixed(4)}. B receives twice A's bonus because it has one quarter the visits. The declared final most-visited recommendation stays A: selecting a simulation is not the same as committing an action. Scores may exceed the reward range; they are not probabilities or a user-calibrated confidence interval.`,
      values: [value("Exploration coefficient", input), value("Crossover coefficient", threshold), value("A bonus", bonuses[0]), value("B bonus", bonuses[1]), value("A selection score", scores[0]), value("B selection score", scores[1])] };
  }
  const nodes: Record<string, Node> = Object.fromEntries([
    { id: "R", children: ["A", "B"] }, { id: "A", children: [], reward: 0.6 }, { id: "B", children: ["L", "H"] },
    { id: "L", children: [], reward: 0 }, { id: "H", children: [], reward: 1 },
  ].map(n => [n.id, { ...n, n: 0, w: 0, expanded: [] }]));
  let seed = 7;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  let lastPath: string[] = [], lastSelection: string[] = [], lastExpansion: string | undefined, lastRollout: string[] = [], lastReward = 0;
  for (let iteration = 0; iteration < input; iteration++) {
    const path = ["R"]; let current = nodes.R;
    // Only expanded nodes participate in tree selection and backup. A rollout
    // may pass an unexpanded domain state without inventing tree statistics.
    while (current.children.length && current.expanded.length === current.children.length) {
      const score = (id: string) => { const child = nodes[id]; return child.w / child.n + Math.sqrt(2) * Math.sqrt(Math.log(current.n) / child.n); };
      const best = current.expanded.reduce((a, b) => score(b) > score(a) ? b : a);
      current = nodes[best]; path.push(best);
    }
    lastSelection = [...path]; lastExpansion = undefined;
    if (current.children.length) {
      const child = current.children.find(id => !current.expanded.includes(id))!;
      current.expanded.push(child); current = nodes[child]; path.push(child); lastExpansion = child;
    }
    const rollout = [current.id]; let terminal = current;
    while (terminal.children.length) { terminal = nodes[terminal.children[Math.floor(random() * terminal.children.length)]]; rollout.push(terminal.id); }
    lastReward = terminal.reward!;
    for (const id of path) { nodes[id].n++; nodes[id].w += lastReward; }
    lastPath = [...path]; lastRollout = rollout;
  }
  const recommended = input === 0 ? undefined : nodes.A.n >= nodes.B.n ? "A" : "B";
  const positions: [string, number, number][] = [["R", 160, 45], ["A", 65, 185], ["B", 245, 185], ["L", 205, 325], ["H", 285, 325]];
  const rows = Object.values(nodes).filter(n => n.n > 0);
  const expanded = new Set(["R", ...Object.values(nodes).flatMap(n => n.expanded)]);
  return { kind: "matrix", series: [], xLabel: "Tree node", yLabel: "Terminal reward", xDomain: [0, 4], yDomain: [0, 1], controlValue: `${input} simulation${input === 1 ? "" : "s"}; ${recommended ? `recommend ${recommended}` : "no recommendation"}`,
    graph: { title: "Grow a search tree without confusing a rollout with expansion", height: 410, maxWidth: 420,
      summary: "One agent controls R and B. Terminal rewards: A=0.6, L=0, H=1. The full domain is shown; 'outside' means not yet in the search tree. n counts backed-up visits. Dashed coral marks the last tree path, not the recommendation. A rollout can visit an outside terminal without storing its statistics.",
      nodes: positions.map(([id, x, y]) => ({ id, label: id, x, y, observed: false, state: expanded.has(id) ? `n ${nodes[id].n}` : "outside" })),
      edges: [["R", "A"], ["R", "B"], ["B", "L"], ["B", "H"]].map(([from, to]) => ({ from, to, directed: true, accent: lastPath.some((id, i) => id === from && lastPath[i + 1] === to) })) },
    listings: [{ title: input ? `Simulation ${input}: four phases` : "Before simulation 1", language: "Trace", code: input ? `1. SELECT   ${lastSelection.join(" → ")}\n2. EXPAND   ${lastExpansion ?? "none: selected terminal"}\n3. ROLLOUT  ${lastRollout.join(" → ")}\n   reward   ${lastReward.toFixed(1)}\n4. BACKUP   ${[...lastPath].reverse().join(" → ")}\n   each: N += 1, W += ${lastReward.toFixed(1)}` : "Tree contains R only.\nNo samples, no estimated mean.\nNo action recommendation yet." }],
    matrices: rows.length ? [{ label: "Backed-up tree statistics; only visited nodes have a mean", rowLabels: rows.map(n => n.id), columnLabels: ["N", "W", "W/N"], entries: rows.map(n => [n.n, n.w, n.w / n.n]) }] : [{ label: "Initialized root; a mean is not defined yet", rowLabels: ["R"], columnLabels: ["N", "W"], entries: [[0, 0]] }],
    summary: input ? `${input} reproducible simulation${input === 1 ? "" : "s"} from seed 7. Last tree path ${lastPath.join(" → ")}; rollout ${lastRollout.join(" → ")} returned ${lastReward.toFixed(1)}. Backup updates only ${lastPath.join(", ")}. Root counts A=${nodes.A.n}, B=${nodes.B.n}; recommend ${recommended} by most visits, with A first on ties. A's exact terminal reward is 0.6; B permits reward 1 if H is chosen. B's sampled mean reflects the evolving continuation policy, not a fixed 50–50 chance distribution. This finite-budget recommendation is not an optimality certificate. Moving the slider replays the entire run, rather than continuing a different random history.` : "No simulations have run. Only R belongs to the search tree; W=0 and N=0, so W/N is undefined. The other nodes show the supplied domain, not discovered search evidence. There is no recommendation. Start with one simulation to expand A and back up its reward 0.6.",
    values: [value("Completed simulations", input), value("Expanded tree nodes", expanded.size), value("A visits", nodes.A.n), value("B visits", nodes.B.n), value("Root reward sum", nodes.R.w, "reward units"), value("Reference best achievable reward", 1, "reward units")] };
}
