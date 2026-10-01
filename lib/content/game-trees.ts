import type { CalculationResult } from "./calculations.ts";

export const gameTreeModels = ["game-minimax", "game-alpha-beta", "game-negamax", "game-expectimax"] as const;
export type GameTreeModel = typeof gameTreeModels[number];
export const isGameTreeModel = (model: string): model is GameTreeModel => (gameTreeModels as readonly string[]).includes(model);
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const base = { kind: "matrix" as const, series: [], xLabel: "Choice", yLabel: "Utility", xDomain: [0, 2] as [number, number], yDomain: [0, 10] as [number, number] };
type TreeNode = { id: string; children?: TreeNode[]; utility?: number };
const tree = (b: number): TreeNode => ({ id: "R", children: [{ id: "A", children: [{ id: "a1", utility: 3 }, { id: "a2", utility: 5 }] }, { id: "B", children: [{ id: "b1", utility: b }, { id: "b2", utility: 9 }] }] });
const positions: [string, number, number][] = [["R", 160, 45], ["A", 75, 155], ["B", 245, 155], ["a1", 35, 265], ["a2", 115, 265], ["b1", 205, 265], ["b2", 285, 265]];
const links = [["R", "A"], ["R", "B"], ["A", "a1"], ["A", "a2"], ["B", "b1"], ["B", "b2"]];

export function calculateGameTree(model: GameTreeModel, input: number): CalculationResult {
  if (!Number.isFinite(input) || input < 0 || input > (model === "game-expectimax" || model === "game-negamax" ? 1 : 8) || (model !== "game-expectimax" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  if (model === "game-expectimax") {
    const p = input, expected = 10 * p, chosen = expected >= 4 ? "A" : "B";
    return { ...base, controlValue: `p(10)=${p.toFixed(2)}; choose ${chosen}`, graph: {
      title: "Average the chance branch before choosing", height: 375, maxWidth: 420,
      summary: "R is a MAX decision, A is a chance node, and B is a terminal safe option. Chance outcomes have utilities zero and ten with probabilities 1−p and p. Edge probability labels occur only below A. Dashed coral marks the chosen root action, not a sampled outcome. Values are utility points from the decision maker's perspective.",
      nodes: [{ id: "R", label: "R", x: 160, y: 45, observed: false, state: `MAX ${Math.max(expected, 4).toFixed(1)}` }, { id: "A", label: "A", x: 95, y: 155, observed: false, state: `E ${expected.toFixed(1)}` }, { id: "B", label: "B", x: 245, y: 155, observed: false, state: "safe 4" }, { id: "low", label: "0", x: 35, y: 295, observed: false, state: "utility" }, { id: "high", label: "10", x: 155, y: 295, observed: false, state: "utility" }],
      edges: [{ from: "R", to: "A", directed: true, accent: chosen === "A" }, { from: "R", to: "B", directed: true, accent: chosen === "B" }, { from: "A", to: "low", directed: true, label: (1 - p).toFixed(2) }, { from: "A", to: "high", directed: true, label: p.toFixed(2) }],
    }, matrices: [{ label: "Chance outcomes: probability × utility", rowLabels: ["Low", "High"], columnLabels: ["probability", "utility", "contribution"], entries: [[1 - p, 0, 0], [p, 10, expected]] }],
      summary: `A has expected utility (1−${p.toFixed(2)})×0+${p.toFixed(2)}×10=${expected.toFixed(2)}. B supplies 4 for certain. Choose ${chosen}${Math.abs(expected - 4) < 1e-9 ? " by the first-action tie policy" : ""}, with expected utility ${Math.max(expected, 4).toFixed(2)}. An adversarial model allowing both listed replies would choose B because A's minimum listed utility is zero. That is a different model; a zero-probability chance outcome cannot occur under the supplied distribution. This is an exact expectation, not a sampled result or a guarantee of the realized payoff. The switch occurs at p=0.40.`,
      values: [value("Expected A", expected, "utility points"), value("Certain B", 4, "utility points"), value("Chosen expected utility", Math.max(expected, 4), "utility points"), value("Smallest listed A utility", 0, "utility points"), value("Probability mass", (1 - p) + p)] };
  }
  const root = tree(model === "game-negamax" ? 2 : input), scores = new Map<string, number>(), choices = new Map<string, string>(), leafVisits: string[] = [], pruned = new Set<string>(), bounds = new Set<string>();
  if (model === "game-negamax") {
    const rootColor = input === 0 ? 1 : -1, colors = new Map<string, number>();
    function negamax(node: TreeNode, color: number): number {
      colors.set(node.id, color);
      if (!node.children) { leafVisits.push(node.id); const v = color * node.utility!; scores.set(node.id, v); return v; }
      let best = -Infinity;
      for (const child of node.children) { const v = -negamax(child, -color); if (v > best) { best = v; choices.set(node.id, child.id); } }
      scores.set(node.id, best); return best;
    }
    const result = negamax(root, rootColor), branch = choices.get("R")!, terminal = choices.get(branch)!, path = ["R", branch, terminal];
    return { ...base, controlValue: `${rootColor === 1 ? "X" : "Y"} moves first; own value ${result}`, graph: { title: "Negate a child's value before maximizing", height: 345, maxWidth: 420, summary: "Every node's displayed number is relative to its own side to move: X or Y. Terminals use the side that would move next, although play has ended. Dashed coral marks the optimal two-ply line. X's fixed terminal payoffs are a1=3, a2=5, b1=2, b2=9; Y's payoffs are their negatives. Changing the first player changes the game, not just the displayed sign.", nodes: positions.map(([id, x, y]) => ({ id, label: id, x, y, observed: false, state: `${colors.get(id) === 1 ? "X" : "Y"} ${scores.get(id)}` })), edges: links.map(([from, to]) => ({ from, to, directed: true, accent: path.some((id, i) => id === from && path[i + 1] === to) })) },
      matrices: [{ label: "Root comparisons after conversion to its own perspective", rowLabels: ["A", "B"], columnLabels: ["child value", "negated"], entries: ["A", "B"].map(id => [scores.get(id)!, -scores.get(id)!]) }],
      summary: `${rootColor === 1 ? "X" : "Y"} acts at R; the other player acts at A and B. Child-side values are A=${scores.get("A")} and B=${scores.get("B")}; negate them to compare ${-scores.get("A")!} and ${-scores.get("B")!} at R. The chosen line is ${path.join(" → ")}, giving root-side utility ${result} and fixed-X utility ${rootColor * result}. Both players maximize their own zero-sum payoff. Negamax visits all four terminals here; it is an equivalent recurrence, not a pruning method.`,
      values: [value("Root-side value", result, "utility points"), value("Fixed-X payoff", rootColor * result, "utility points"), value("Fixed-Y payoff", -rootColor * result, "utility points"), value("Terminal evaluations", leafVisits.length)] };
  }
  function search(node: TreeNode, maximizing: boolean, alpha: number, beta: number): number {
    if (!node.children) { leafVisits.push(node.id); scores.set(node.id, node.utility!); return node.utility!; }
    let best = maximizing ? -Infinity : Infinity;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i], v = search(child, !maximizing, alpha, beta);
      if (maximizing ? v > best : v < best) { best = v; choices.set(node.id, child.id); }
      if (maximizing) alpha = Math.max(alpha, best); else beta = Math.min(beta, best);
      if (model === "game-alpha-beta" && alpha >= beta && i + 1 < node.children.length) {
        bounds.add(node.id);
        for (const remaining of node.children.slice(i + 1)) pruned.add(remaining.id);
        break;
      }
    }
    scores.set(node.id, best); return best;
  }
  const result = search(root, true, -Infinity, Infinity), branch = choices.get("R")!, path = ["R", branch, choices.get(branch)!], pruning = model === "game-alpha-beta";
  return { ...base, controlValue: `b1=${input}; root ${result}, choose ${branch}`, graph: { title: pruning ? "A known alternative makes one reply irrelevant" : "The opponent selects the branch's smaller payoff", height: 345, maxWidth: 420,
    summary: pruning ? "Left-to-right depth-first alpha-beta search. All values use MAX's utility points. R maximizes, A and B minimize. Dashed coral marks a pruned edge, not a preferred move. A pruned terminal's payoff is hidden from the trace; ≤ marks an upper bound from an incomplete MIN branch. The separately supplied full example contains b2=9." : "R is MAX, A and B are MIN, and a1/a2/b1/b2 are terminals. All numbers use one fixed MAX-player perspective. Dashed coral marks the root's chosen action and the minimizing reply within it. All four terminal utilities are evaluated; ties select the first child.",
    nodes: positions.map(([id, x, y]) => ({ id, label: id, x, y, observed: false, state: pruned.has(id) ? "pruned" : id === "R" ? `MAX ${scores.get(id)}` : id === "A" || id === "B" ? `MIN ${bounds.has(id) ? "≤" : ""}${scores.get(id)}` : `u ${scores.get(id)}` })),
    edges: links.map(([from, to]) => ({ from, to, directed: true, accent: pruning ? pruned.has(to) : path.some((id, i) => id === from && path[i + 1] === to) })),
  }, matrices: [{ label: "Terminals actually evaluated, in visit order", rowLabels: leafVisits, columnLabels: ["MAX utility"], entries: leafVisits.map(id => [scores.get(id)!]) }],
    summary: pruning ? `A is fully evaluated as min(3,5)=3, establishing root α=3. B's first reply supplies β=${input}. ${pruned.size ? `Because β≤α, b2 is never evaluated. Search knows only V(B)≤${input}, sufficient to retain A.` : "Because β>α, b2 must be evaluated; B then has exact value min(b1,9)."} Root value ${result} and chosen action ${branch} agree with full minimax. ${leafVisits.length} of four terminals were evaluated, saving ${pruned.size}. This algorithmic trace excludes the separate four-leaf reference calculation. Equality pruning retains the first optimal action but does not enumerate every tied action.` : `A returns min(3,5)=3; B returns min(${input},9)=${input}. R therefore returns max(3,${input})=${result}, choosing ${branch}${input === 3 ? " by first-child tie-breaking" : ""}. The resulting optimal line is ${path.join(" → ")}. The tempting payoff 9 cannot be forced because MIN has another reply. These are exact terminal utilities in a finite two-player zero-sum game, not depth-cutoff estimates or a prediction of a fallible opponent.`,
    values: [value("Exact root value", result, "utility points"), value("Terminal evaluations", leafVisits.length), value("Pruned terminals", pruned.size), value("Full minimax reference", Math.max(3, Math.min(input, 9)), "utility points"), value("B upper bound", scores.get("B")!, "utility points")] };
}
