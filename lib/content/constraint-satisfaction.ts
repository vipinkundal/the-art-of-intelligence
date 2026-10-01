import type { CalculationResult } from "./calculations.ts";

export const constraintModels = ["csp-assignment", "csp-backtracking", "csp-forward", "csp-arc", "csp-ac3", "csp-propagation", "csp-mrv", "csp-degree", "csp-lcv"] as const;
export type ConstraintModel = typeof constraintModels[number];
export const isConstraintModel = (model: string): model is ConstraintModel => (constraintModels as readonly string[]).includes(model);
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const base = { kind: "matrix" as const, series: [], xLabel: "Variable", yLabel: "Domain value", xDomain: [0, 4] as [number, number], yDomain: [0, 4] as [number, number] };
const names = ["A", "B", "C"];
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
function domainGrid(labels: string[], domains: number[][], maximum: number, title: string): NonNullable<CalculationResult["grid"]> {
  return { title, rows: labels.length, columns: maximum, columnLabels: range(maximum).map(String), cells: domains.flatMap((domain, row) => domain.map(v => ({ row, column: v - 1, label: labels[row], accent: true }))),
    legend: ["Rows: " + labels.join(", "), "Columns: candidate values", "Striped labeled cells remain in the domain; empty cells are excluded"],
    summary: labels.map((label, i) => `${label}: {${domains[i].join(", ")}}`).join("; ") + ". Domains describe possibilities, not necessarily a mutually compatible complete assignment." };
}
function chain(domains: number[][], accent = -1): NonNullable<CalculationResult["graph"]> {
  return { title: "Two relations: A < B and B < C", height: 220, maxWidth: 450,
    summary: "These undirected connections show constraint scopes, not actions or causal arrows. Read the first relation as A < B and the second as B < C. Dashed coral, when present, identifies the relation currently checked.",
    nodes: names.map((id, i) => ({ id, label: id, x: 50 + i * 110, y: 80, observed: false, state: `{${domains[i].join(",")}}` })),
    edges: [{ from: "A", to: "B", directed: false, label: "<", accent: accent === 0 }, { from: "B", to: "C", directed: false, label: "<", accent: accent === 1 }] };
}
function tuples(domains: number[][], valid: (tuple: number[]) => boolean): number[][] {
  let candidates: number[][] = [[]];
  for (const domain of domains) candidates = candidates.flatMap(prefix => domain.map(v => [...prefix, v]));
  return candidates.filter(valid);
}
const increasing = (x: number[]) => x[0] < x[1] && x[1] < x[2];
type Attempt = { assignment: number[]; accepted: boolean; solution: boolean };
function backtrackTrace(): Attempt[] {
  const trace: Attempt[] = [];
  function visit(prefix: number[]) {
    for (const v of range(3)) {
      const assignment = [...prefix, v], accepted = prefix.length === 0 || prefix[prefix.length - 1] < v;
      trace.push({ assignment, accepted, solution: accepted && assignment.length === 3 });
      if (accepted && assignment.length < 3) visit(assignment);
    }
  }
  visit([]); return trace;
}
type Arc = [number, number];
function ac3Trace() {
  const domains = [range(4), range(4), range(4)], queue: Arc[] = [[0, 1], [1, 0], [1, 2], [2, 1]];
  const snapshots = [{ domains: domains.map(d => [...d]), queue: queue.map(a => [...a] as Arc), arc: undefined as Arc | undefined, removed: [] as number[] }];
  while (queue.length) {
    const arc = queue.shift()!, [i, j] = arc;
    const removed = domains[i].filter(v => !domains[j].some(w => i < j ? v < w : w < v));
    if (removed.length) {
      domains[i] = domains[i].filter(v => !removed.includes(v));
      for (const k of [0, 1, 2]) if (Math.abs(k - i) === 1 && k !== j && !queue.some(([a, b]) => a === k && b === i)) queue.push([k, i]);
    }
    snapshots.push({ domains: domains.map(d => [...d]), queue: queue.map(a => [...a] as Arc), arc, removed });
    if (domains[i].length === 0) break;
  }
  return snapshots;
}

export function calculateConstraint(model: ConstraintModel, input: number): CalculationResult {
  const limits: Record<ConstraintModel, [number, number]> = { "csp-assignment": [0, 26], "csp-backtracking": [0, 21], "csp-forward": [1, 3], "csp-arc": [1, 3], "csp-ac3": [0, 5], "csp-propagation": [0, 2], "csp-mrv": [1, 3], "csp-degree": [0, 4], "csp-lcv": [1, 3] };
  if (!Number.isInteger(input) || input < limits[model][0] || input > limits[model][1]) throw new Error(`Invalid ${model} input`);
  if (model === "csp-assignment") {
    const assignment = [Math.floor(input / 9) + 1, Math.floor(input / 3) % 3 + 1, input % 3 + 1], checks = [assignment[0] < assignment[1], assignment[1] < assignment[2]];
    const solutions = tuples([range(3), range(3), range(3)], increasing);
    const candidateGrid = domainGrid(names, assignment.map(v => [v]), 3, "One complete candidate, not a domain reduction");
    candidateGrid.legend = ["Rows: A, B, C", "Columns: values 1, 2, 3", "Striped cells mark the chosen value; empty cells are not chosen"];
    candidateGrid.summary = `Candidate A=${assignment[0]}, B=${assignment[1]}, C=${assignment[2]}. All original domains remain {1,2,3}; the grid displays a candidate, not pruned domains.`;
    return { ...base, controlValue: `Candidate ${input + 1}/27: (${assignment.join(", ")})`, graph: chain(assignment.map(v => [v])), grid: candidateGrid,
      matrices: [{ label: "Hard constraints evaluated on this candidate", rowLabels: ["A < B", "B < C"], columnLabels: ["satisfied (1=yes)"], entries: checks.map(v => [Number(v)]) }],
      summary: `A=${assignment[0]}, B=${assignment[1]}, C=${assignment[2]}. A<B is ${checks[0] ? "true" : "false"}; B<C is ${checks[1] ? "true" : "false"}. ${checks.every(Boolean) ? "This candidate is a solution." : "This candidate is infeasible; satisfying only one relation is insufficient."} Enumeration of all 27 candidates gives ${solutions.length} solution: (1,2,3). The indices order A, then B, then C lexicographically; they do not measure solution quality.`,
      values: [value("Candidate assignments", 27), value("Satisfied constraints", checks.filter(Boolean).length), value("Solutions in the full model", solutions.length), value("Current candidate feasible (1=yes)", Number(checks.every(Boolean)))] };
  }
  if (model === "csp-backtracking") {
    const trace = backtrackTrace(), visible = trace.slice(0, input), last = visible.at(-1), assignment = last?.assignment ?? [];
    const found = visible.filter(s => s.solution).length;
    const prefixGrid = domainGrid(names, names.map((_, i) => assignment[i] === undefined ? [] : [assignment[i]]), 3, "The latest attempted prefix; empty rows are unassigned");
    prefixGrid.legend = ["Rows: A, B, C", "Columns: values 1, 2, 3", "Striped cells show this attempted prefix; empty rows are unassigned"];
    prefixGrid.summary = `${last ? `Attempt (${assignment.join(", ")}): ${last.accepted ? "legal prefix" : "rejected prefix"}.` : "No variable has been tried."} The final cell is a trial, not necessarily an accepted assignment. This panel does not display filtered domains.`;
    return { ...base, controlValue: `${input}/21 attempted assignments`, grid: prefixGrid,
      matrices: [{ label: "Attempt trace; 0 in a value column means unassigned", rowLabels: ["Start", ...visible.map((s, i) => `${i + 1}. ${s.accepted ? "keep" : "reject"}${s.solution ? " · solution" : ""}`)], columnLabels: ["A", "B", "C", "legal prefix"], entries: [[0, 0, 0, 1], ...visible.map(s => [s.assignment[0] ?? 0, s.assignment[1] ?? 0, s.assignment[2] ?? 0, Number(s.accepted)])] }],
      summary: `${last ? `Latest attempt: (${assignment.join(", ")}); ${last.accepted ? "consistent with assigned neighbors" : "rejected immediately because its new inequality fails"}.` : "The search starts with an empty assignment."} ${found} solution${found === 1 ? "" : "s"} found so far. The first solution (1,2,3) appears at attempt six. This run continues to enumerate all solutions and exhausts after 21 attempts, of which 14 are rejected. It does not assign C below an already invalid A,B prefix. Before trying a sibling, deeper assignments are undone; the drawing includes the just-rejected candidate only to explain that step.`,
      values: [value("Attempts shown", input), value("Rejected attempts shown", visible.filter(s => !s.accepted).length), value("Solutions found", found), value("Attempts for full enumeration", trace.length)] };
  }
  if (model === "csp-forward") {
    const domains = [[input], range(3).filter(b => input < b), range(3)], solutions = tuples(domains, increasing);
    return { ...base, controlValue: `Assign A=${input}, then forward-check`, graph: chain(domains, 0), grid: domainGrid(names, domains, 3, "Forward checking touches B; C stays unchanged"),
      summary: `After A=${input}, D(B)={${domains[1].join(",")}} and D(C)={1,2,3}. ${input === 3 ? "B has no value: this branch fails immediately." : input === 2 ? "B still has 3, so forward checking reports no wipeout. But B<C then has no possible support: no complete solution exists on this branch." : "The unique completion is B=2,C=3; B=3 still survives this limited filtering."} Complete enumeration finds ${solutions.length} ${solutions.length === 1 ? "extension" : "extensions"}. That count is a teaching oracle, not information computed by forward checking.`,
      values: [value("B domain size", domains[1].length), value("C domain size", domains[2].length), value("Values removed from B", 3 - domains[1].length), value("Complete extensions (oracle)", solutions.length), value("Forward-check wipeout (1=yes)", Number(domains[1].length === 0))] };
  }
  if (model === "csp-arc") {
    const domain = range(input), domains = [domain, domain, domain], solutions = tuples(domains, x => x[0] !== x[1] && x[1] !== x[2] && x[0] !== x[2]);
    return { ...base, controlValue: `${input} candidate color${input === 1 ? "" : "s"} per vertex`,
      graph: { title: "A triangle must give every adjacent pair different values", height: 310, maxWidth: 400, summary: "All three edges mean unequal colors. The displayed domains are the input domains; this panel checks local support without running a pruning algorithm.", nodes: [{ id: "A", label: "A", x: 160, y: 45, observed: false, state: `{${domain.join(",")}}`, stateAbove: false }, { id: "B", label: "B", x: 65, y: 210, observed: false, state: `{${domain.join(",")}}` }, { id: "C", label: "C", x: 255, y: 210, observed: false, state: `{${domain.join(",")}}` }], edges: [{ from: "A", to: "B", directed: false, label: "≠" }, { from: "B", to: "C", directed: false, label: "≠" }, { from: "A", to: "C", directed: false, label: "≠" }] },
      matrices: [{ label: "Support for each color on any directed inequality arc", rowLabels: domain.map(v => `Tail color ${v}`), columnLabels: ["compatible head values"], entries: domain.map(() => [input - 1]) }],
      summary: `Each value has ${input - 1} support${input === 2 ? "" : "s"} across each incident arc. ${input === 1 ? "The network is not arc consistent: a lone color cannot differ from itself." : input === 2 ? "Every arc is consistent, yet there is no solution. A=1 forces both B=2 and C=2, contradicting B≠C. Separate supporting witnesses cannot be combined into one legal triangle." : "Every arc is consistent and the six permutations of (1,2,3) are solutions."} Exhaustive counting gives ${solutions.length} global solutions. Local support is a necessary filter, not a general satisfiability certificate.`,
      values: [value("Supports per value per arc", input - 1), value("Arc consistent (1=yes)", Number(input >= 2)), value("Full assignments", input ** 3), value("Global solutions (oracle)", solutions.length)] };
  }
  if (model === "csp-ac3") {
    const snapshots = ac3Trace(), current = snapshots[input], { domains, queue, arc, removed } = current;
    const queueText = queue.map(([a, b]) => `${names[a]}→${names[b]}`).join(", ") || "empty";
    return { ...base, controlValue: `${input}/5 arc revisions`, graph: chain(domains, arc ? Math.min(...arc) : -1), grid: domainGrid(names, domains, 4, "Domains after the selected FIFO queue step"),
      matrices: [{ label: "Domain sizes after each completed revision", rowLabels: snapshots.slice(0, input + 1).map(s => s.arc ? `Revise ${names[s.arc[0]]}→${names[s.arc[1]]}` : "Initial"), columnLabels: ["|A|", "|B|", "|C|", "queue"], entries: snapshots.slice(0, input + 1).map(s => [...s.domains.map(d => d.length), s.queue.length]) }],
      summary: `${arc ? `Latest revision ${names[arc[0]]}→${names[arc[1]]}: ${removed.length ? `remove ${removed.join(",")} from ${names[arc[0]]}` : "no deletion"}.` : "Initially all four directed arcs are queued."} Next-first queue: ${queueText}. ${input === 3 ? "Shrinking B from {2,3,4} to {2,3} requeues A→B; A=3 has lost its support B=4." : ""} ${input === 5 ? "Fixed point: A={1,2}, B={2,3}, C={3,4}. Four complete solutions survive. The cartesian product of the reduced domains has eight candidates, so remaining values still cannot be chosen independently." : "Only completed revisions have affected the displayed domains."} Arc direction means revise the tail using the head domain, not execute an action along the graph.`,
      values: [value("Completed revisions", input), value("Pending arcs", queue.length), value("Remaining domain entries", domains.reduce((n, d) => n + d.length, 0)), value("Complete solutions preserved", tuples(domains, increasing).length)] };
  }
  if (model === "csp-propagation") {
    const initial = [[1, 2], [1, 2], [1, 2, 3]], solutions = tuples(initial, x => new Set(x).size === 3);
    const domains = input === 2 ? initial.map((d, i) => d.filter(v => solutions.some(s => s[i] === v))) : initial;
    const stage = ["Input domains", "Binary inequality fixed point", "Global allDifferent support"][input];
    return { ...base, controlValue: stage, grid: domainGrid(["X", "Y", "Z"], domains, 3, stage),
      matrices: [{ label: "Complete supports of the global constraint (teaching enumeration)", rowLabels: solutions.map((_, i) => `Solution ${i + 1}`), columnLabels: ["X", "Y", "Z"], entries: solutions }],
      summary: `${stage}: X={${domains[0].join(",")}}, Y={${domains[1].join(",")}}, Z={${domains[2].join(",")}}. Three pairwise inequalities and one allDifferent constraint describe the same complete solutions here. Binary arc consistency deletes nothing: each candidate finds an unequal value on each edge. Global support removes Z=1 and Z=2 because X and Y must already occupy both values. Both solutions use Z=3. Propagation strength depends on the relation and its propagator, not only on the complete solution set.`,
      values: [value("Remaining domain entries", domains.reduce((n, d) => n + d.length, 0)), value("Entries removed", 7 - domains.reduce((n, d) => n + d.length, 0)), value("Full solutions preserved", solutions.length), value("Z domain size", domains[2].length)] };
  }
  if (model === "csp-mrv") {
    const labels = ["A", "B", "C", "D"], domains = [range(input), [1, 2], [1, 2, 3], [1, 2]];
    const order = labels.map((id, i) => ({ id, size: domains[i].length })).sort((a, b) => a.size - b.size || a.id.localeCompare(b.id));
    return { ...base, controlValue: `|D(A)|=${input}; MRV chooses ${order[0].id}`, grid: domainGrid(labels, domains, 3, "Current legal choices before selecting a variable"),
      matrices: [{ label: "MRV ranking; alphabetical tie-break", rowLabels: order.map(x => x.id), columnLabels: ["remaining values"], entries: order.map(x => [x.size]) }],
      summary: `Domain sizes are A:${input}, B:2, C:3, D:2. MRV selects ${order[0].id} with ${order[0].size} ${order[0].size === 1 ? "value" : "values"}. ${input === 2 ? "A, B and D tie; the explicit alphabetical tie-break picks A." : input === 3 ? "B and D tie at two; B wins the tie even though A was listed first." : "The forced singleton A is handled first."} The control changes the supplied domain snapshot. No value is assigned and no search-speed claim follows from this ranking alone. An empty unassigned domain would instead signal failure immediately.`,
      values: [value("Minimum domain size", order[0].size), value("Variables tied for minimum", order.filter(v => v.size === order[0].size).length), value("Unassigned variables", 4)] };
  }
  if (model === "csp-degree") {
    const labels = ["A", "B", "C", "D", "E"], pairs: [number, number][] = [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4]];
    const active = labels.slice(input), order = active.map(id => ({ id, degree: pairs.filter(([a, b]) => a >= input && b >= input && (labels[a] === id || labels[b] === id)).length })).sort((a, b) => b.degree - a.degree || a.id.localeCompare(b.id));
    const positions = [[65, 50], [255, 50], [160, 170], [160, 280], [160, 390]];
    return { ...base, controlValue: `${input} assigned variables; choose ${order[0].id}`,
      graph: { title: "Count neighbors still awaiting assignment", height: 460, maxWidth: 390, summary: "Edges show binary constraint scopes. Prefix A, then B, then C, then D is marked already assigned as the slider moves. All remaining variables are supplied with equally sized current domains. Double rings mark assigned vertices, not the heuristic's choice.", nodes: labels.map((id, i) => ({ id, label: id, x: positions[i][0], y: positions[i][1], observed: i < input, state: i < input ? "assigned" : `degree ${order.find(x => x.id === id)!.degree}` })), edges: pairs.map(([a, b]) => ({ from: labels[a], to: labels[b], directed: false, accent: a >= input && b >= input })) },
      matrices: [{ label: "Degree ranking among equal-domain unassigned variables", rowLabels: order.map(x => x.id), columnLabels: ["unassigned neighbors"], entries: order.map(x => [x.degree]) }],
      summary: `Assigned prefix: ${labels.slice(0, input).join(", ") || "none"}. Remaining ranking: ${order.map(v => `${v.id}:${v.degree}`).join(", ")}. Choose ${order[0].id}; ties are alphabetical. The relevant degree counts only constraints to still-unassigned neighbors. C's original degree three does not keep it preferred after its neighbors are assigned. This is a ranking snapshot; domains and constraint predicates are not recalculated by this demonstration.`,
      values: [value("Unassigned variables", active.length), value("Chosen residual degree", order[0].degree), value("Active constraint edges", pairs.filter(([a, b]) => a >= input && b >= input).length)] };
  }
  const neighbors = [[1, 2], [1, 3], [1]], domains = neighbors.map(d => d.filter(v => v !== input));
  const losses = range(3).map(v => neighbors.reduce((n, d) => n + Number(d.includes(v)), 0));
  const extensions = tuples(domains, () => true).length;
  return { ...base, controlValue: `Try X=${input}; remove ${losses[input - 1]} neighbor values`, grid: domainGrid(["Y", "Z", "W"], domains, 3, "Neighbors after forward checking X≠Y, X≠Z, X≠W"),
    matrices: [{ label: "LCV scores before committing; smaller is preferred", rowLabels: ["X=1", "X=2", "X=3"], columnLabels: ["deletions", "empty domains"], entries: range(3).map(v => [losses[v - 1], neighbors.filter(d => d.every(w => w === v)).length]) }],
    summary: `Trying X=${input} removes ${losses[input - 1]} value${losses[input - 1] === 1 ? "" : "s"} across Y, Z and W. ${input === 1 ? "W becomes empty, so this branch is impossible." : `There are ${extensions} completions of the independent neighbors.`} X=2 and X=3 each delete one value and tie for least constraining; the stated numeric tie-break prefers 2. Scoring each candidate uses a temporary copy of domains. Deletion count is a local proxy; it is not generally the number of complete solutions or a probability of success.`,
    values: [value("Neighbor values deleted", losses[input - 1]), value("Empty neighbor domains", domains.filter(d => d.length === 0).length), value("Complete extensions here", extensions), value("Minimum LCV deletion score", Math.min(...losses))] };
}
