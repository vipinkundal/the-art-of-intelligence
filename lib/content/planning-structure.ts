import type { CalculationResult } from "./calculations.ts";
export const planningStructureModels = ["plan-pddl-grounding", "plan-partial-order"] as const;
export type PlanningStructureModel = typeof planningStructureModels[number];
export const isPlanningStructureModel = (model: string): model is PlanningStructureModel => (planningStructureModels as readonly string[]).includes(model);
const base = { kind: "matrix" as const, series: [], xLabel: "Action", yLabel: "Requirements", xDomain: [0, 4] as [number, number], yDomain: [0, 1] as [number, number] };
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
export function calculatePlanningStructure(model: PlanningStructureModel, input: number): CalculationResult {
  if (!Number.isInteger(input) || input < (model === "plan-pddl-grounding" ? 1 : 0) || input > (model === "plan-pddl-grounding" ? 4 : 2)) throw new Error(`Invalid ${model} input`);
  if (model === "plan-pddl-grounding") {
    const n = input, locations = Array.from({ length: n }, (_, i) => `l${i}`), roads: [number, number][] = [];
    for (let i = 0; i + 1 < n; i++) roads.push([i, i + 1], [i + 1, i]);
    const candidates = locations.flatMap((from, i) => locations.map((to, j) => ({ from, to, i, j, road: roads.some(([a, b]) => a === i && b === j) })));
    const queue = [{ at: 0, route: [0] }], seen = new Set([0]);
    let route: number[] = [];
    while (queue.length) { const node = queue.shift()!; if (node.at === n - 1) { route = node.route; break; } for (const [, to] of roads.filter(([from]) => from === node.at)) if (!seen.has(to)) { seen.add(to); queue.push({ at: to, route: [...node.route, to] }); } }
    const domain = `(define (domain chain-travel)
  (:requirements :strips :typing)
  (:types location)
  (:predicates
    (at ?l - location)
    (road ?from ?to - location))
  (:action move
    :parameters (?from ?to - location)
    :precondition (and
      (at ?from) (road ?from ?to))
    :effect (and
      (not (at ?from)) (at ?to))))`;
    const problem = `(define (problem chain-${n})
  (:domain chain-travel)
  (:objects ${locations.join(" ")} - location)
  (:init
    (at l0)${roads.map(([from, to]) => `\n    (road l${from} l${to})`).join("")})
  (:goal (at l${n - 1})))`;
    const positions = [[n === 1 ? 160 : 45, 45], [160, 45], [275, 45], [275, 185]];
    return { ...base, controlValue: `${n} ${n === 1 ? "location" : "locations"}: ${n * n} candidate bindings, ${roads.length} road-supported`, graph: { title: "A plan computed from the displayed instance", height: n === 4 ? 265 : 125, maxWidth: 420, summary: "The diagram shows the shortest forward plan only, not every road. The problem lists both directions of each neighboring road. Nodes are locations and arrows are grounded move actions. One location makes the goal true initially and yields an empty plan. The JavaScript lab mirrors these exact action semantics; it does not parse the PDDL or invoke an external planner.", nodes: route.map(i => ({ id: `l${i}`, label: `l${i}`, x: positions[i][0], y: positions[i][1], observed: false, state: n === 1 ? "start/goal" : i === 0 ? "start" : i === n - 1 ? "goal" : "" })), edges: route.slice(1).map((to, i) => ({ from: `l${route[i]}`, to: `l${to}`, directed: true })) },
      grid: { title: "Bindings are not automatically executable actions", summary: "Rows supply ?from, columns supply ?to. Striped 1 means a listed static road supports that parameter pair; unstriped 0 means no such road. Coral outlines identify the moves applicable at the initial state (at l0). Static support alone does not satisfy the dynamic at precondition. Self-pairs are allowed by typing but have no listed road.", rows: n, columns: n, rowLabels: locations, columnLabels: locations, legend: ["1 = road listed; 0 = no road", "Coral = also applicable at initial l0"], cells: candidates.map(c => ({ row: c.i, column: c.j, label: String(Number(c.road)), accent: c.road, selected: c.road && c.i === 0 })) },
      listings: [{ title: "Reusable action domain", language: "PDDL", code: domain }, { title: "Generated task instance", language: "PDDL", code: problem }],
      matrices: [{ label: "Grounded pairs: static support and initial applicability", rowLabels: candidates.map(c => `${c.from}→${c.to}`), columnLabels: ["road", "at from", "applicable"], entries: candidates.map(c => [Number(c.road), Number(c.i === 0), Number(c.road && c.i === 0)]) }],
      summary: `The typed schema has ${n}×${n}=${n * n} candidate parameter ${n === 1 ? "binding" : "bindings"} before filtering. ${roads.length} have a listed road, and ${n > 1 ? "one is" : "none are"} applicable initially. The shortest unit-action plan is ${route.length > 1 ? route.slice(1).map((to, i) => `(move l${route[i]} l${to})`).join(" → ") : "empty because (at l0) is already the goal"}, with ${route.length - 1} ${route.length === 2 ? "action" : "actions"}. Preconditions are checked in each successive state, not just once at grounding. These binding counts describe this lab's enumeration, not a claim about a real planner's grounding implementation. The displayed text is explanatory PDDL, not externally parser- or planner-validated.`,
      values: [value("Candidate typed bindings", candidates.length), value("Road-supported bindings", roads.length), value("Initially applicable actions", n > 1 ? 1 : 0), value("Shortest plan", route.length - 1, "actions"), value("Goal already true (1=yes)", Number(n === 1))] };
  }
  type Action = { id: string; pre: string[]; add: string[]; del: string[] };
  const actions: Action[] = [{ id: "P", pre: [], add: ["r"], del: [] }, { id: "C", pre: ["r"], add: ["d"], del: [] }, { id: "T", pre: [], add: ["a"], del: ["r"] }];
  const permutations: string[][] = [];
  function permute(prefix: string[], remaining: string[]) { if (!remaining.length) permutations.push(prefix); else remaining.forEach(id => permute([...prefix, id], remaining.filter(x => x !== id))); }
  permute([], actions.map(a => a.id));
  const constraints = [["P", "C"], ...(input === 1 ? [["T", "P"]] : input === 2 ? [["C", "T"]] : [])];
  const orders = permutations.filter(order => constraints.every(([from, to]) => order.indexOf(from) < order.indexOf(to)));
  const traces = orders.map(order => {
    let state = new Set<string>(), failed = "";
    for (const id of order) { const action = actions.find(a => a.id === id)!; if (!action.pre.every(a => state.has(a))) { failed = id; break; } state = new Set([...state].filter(a => !action.del.includes(a)).concat(action.add)); }
    return { order, executable: !failed, goals: !failed && state.has("d") && state.has("a"), failed };
  });
  const edges: NonNullable<CalculationResult["graph"]>["edges"] = [{ from: "P", to: "C", directed: true, label: "r" }];
  if (input === 0) edges.push({ from: "T", to: "C", directed: false, accent: true, label: "threat" });
  else edges.push(input === 1 ? { from: "T", to: "P", directed: true } : { from: "C", to: "T", directed: true });
  return { ...base, controlValue: input === 0 ? "P<C; threat unresolved" : input === 1 ? "T<P<C" : "P<C<T", graph: { title: "Protect the ready fact until its consumer uses it", height: 295, maxWidth: 420, summary: "P produces ready r; C requires r and produces done d; T deletes r and produces audit flag a. The P→C edge labeled r is a causal link plus ordering. Other solid arrows are ordering constraints. The dashed undirected threat line is not an ordering edge. T may be placed before P or after C to protect the link. P can reestablish r after T; a is an audit record, not a claim that r stays false.", nodes: [{ id: "P", label: "P", x: 75, y: 45, observed: false, state: "add r" }, { id: "C", label: "C", x: 245, y: 45, observed: false, state: "need r" }, { id: "T", label: "T", x: 160, y: 205, observed: false, state: "delete r" }], edges },
    matrices: [{ label: "All total orders satisfying the current constraints", rowLabels: traces.map(t => t.order.join("→")), columnLabels: ["executable", "d and a"], entries: traces.map(t => [Number(t.executable), Number(t.goals)]) }],
    summary: `${orders.length} ${orders.length === 1 ? "total order satisfies" : "total orders satisfy"} the displayed constraints: ${traces.map(t => `${t.order.join("→")} ${t.goals ? "valid" : `fails at ${t.failed}`}`).join("; ")}. ${input === 0 ? "P→T→C destroys readiness before C. Having two valid linearizations does not make this unresolved partial plan safe: every allowed linearization must be supported." : input === 1 ? "T executes before P; P restores r, then C uses it. The audit flag a persists." : "C uses r before T deletes it; done d persists and T adds audit flag a."} Empty initial state, positive goal {d,a}, sequential instantaneous execution. This checks a supplied partial plan and two threat repairs; it is not a complete partial-order planner or a concurrency schedule.`,
    values: [value("Allowed linearizations", orders.length), value("Executable goal-reaching orders", traces.filter(t => t.goals).length), value("Invalid linearizations", traces.filter(t => !t.goals).length), value("Threat resolved (1=yes)", Number(input !== 0))] };
}
