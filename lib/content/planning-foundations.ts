import type { CalculationResult } from "./calculations.ts";

export const planningFoundationModels = ["plan-state-search", "plan-strips-effects", "plan-progression-regression"] as const;
export type PlanningFoundationModel = typeof planningFoundationModels[number];
export const isPlanningFoundationModel = (model: string): model is PlanningFoundationModel => (planningFoundationModels as readonly string[]).includes(model);
const atoms = ["H", "O", "P", "C", "D"];
// H=home, O=office, P=parcel available at home, C=carrying, D=delivered.
type Action = { name: string; code: string; pre: string[]; add: string[]; del: string[] };
const actions: Action[] = [
  { name: "Pickup", code: "P", pre: ["H", "P"], add: ["C"], del: ["P"] },
  { name: "Go", code: "G", pre: ["H"], add: ["O"], del: ["H"] },
  { name: "Back", code: "B", pre: ["O"], add: ["H"], del: ["O"] },
  { name: "Deliver", code: "D", pre: ["O", "C"], add: ["D"], del: ["C"] },
];
const apply = (state: Set<string>, action: Action): Set<string> | undefined => action.pre.every(p => state.has(p)) ? new Set([...state].filter(p => !action.del.includes(p)).concat(action.add)) : undefined;
const key = (state: Set<string>) => atoms.filter(a => state.has(a)).join("");
const describe = (state: Set<string>) => `{${atoms.filter(a => state.has(a)).join(",")}}`;
const initial = () => new Set(["H", "P"]);
const base = { kind: "matrix" as const, series: [], xLabel: "Step", yLabel: "Facts", xDomain: [0, 4] as [number, number], yDomain: [0, 1] as [number, number] };
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const stateOrder = ["HP", "OP", "HC", "OC", "HD", "OD"];
function reachable() {
  const states = [initial()], seen = new Set([key(states[0])]);
  for (let i = 0; i < states.length; i++) for (const a of actions) { const next = apply(states[i], a); if (next && !seen.has(key(next))) { seen.add(key(next)); states.push(next); } }
  return states;
}
export function calculatePlanningFoundation(model: PlanningFoundationModel, input: number): CalculationResult {
  if (!Number.isInteger(input) || input < 0 || input > (model === "plan-strips-effects" ? 5 : 3)) throw new Error(`Invalid ${model} input`);
  if (model === "plan-state-search") {
    const starts = [initial(), new Set(["O", "P"]), new Set(["H", "C"]), new Set(["H", "D"])], start = starts[input];
    type Entry = { state: Set<string>; states: Set<string>[]; plan: string[] };
    const frontier: Entry[] = [{ state: start, states: [start], plan: [] }], seen = new Set([key(start)]);
    let removed = 0, solution: Entry | undefined;
    while (frontier.length) {
      const node = frontier.shift()!; removed++;
      if (node.state.has("D")) { solution = node; break; }
      for (const a of actions) { const next = apply(node.state, a); if (next && !seen.has(key(next))) { seen.add(key(next)); frontier.push({ state: next, states: [...node.states, next], plan: [...node.plan, a.name] }); } }
    }
    if (!solution) throw new Error("The supplied planning instance must have a solution");
    const path = new Set(solution.states.map(key)), all = reachable();
    return { ...base, controlValue: `Start ${describe(start)}; shortest plan ${solution.plan.length} actions`, grid: { title: "Six reachable states, two states satisfying the goal", summary: "Columns are robot location H=home and O=office; rows are parcel status P=available at home, C=carrying and D=delivered. Each labeled striped cell is a reachable complete state from the original {H,P} instance. Coral outlines mark states on the returned shortest plan from the selected starting scenario. This is a state map, not an action graph; the table gives action order.", rows: 3, columns: 2, rowLabels: ["P", "C", "D"], columnLabels: ["H", "O"], legend: ["State labels = all true atoms; omitted atoms are false", "Coral = returned plan states; D row = goal satisfied"], cells: stateOrder.map((id, i) => ({ row: Math.floor(i / 2), column: i % 2, label: id, accent: true, selected: path.has(id) })) },
      matrices: [{ label: "Shortest plan trace: 1=true, 0=false", rowLabels: solution.states.map((_, i) => i === 0 ? "Start" : `${i}: ${solution!.plan[i - 1]}`), columnLabels: atoms, entries: solution.states.map(s => atoms.map(a => Number(s.has(a)))) }],
      summary: `Starting at ${describe(start)}, BFS returns ${solution.plan.length ? solution.plan.join(" → ") : "the empty plan"} with ${solution.plan.length} unit-cost actions. State trace: ${solution.states.map(describe).join(" → ")}. Goal D ${solution.plan.length ? "holds at the final state" : "already holds initially"}; the robot's final location is not part of this goal. Search removed ${removed} ${removed === 1 ? "state" : "states"}, including the goal, and discovered ${seen.size}. Separately, exhaustive reachability from the original {H,P} instance has ${all.length} states, ${all.filter(s => s.has("D")).length} satisfying D. These reference counts are not this early-stopping BFS run's work.`,
      values: [value("Shortest plan length", solution.plan.length, "actions"), value("Removed states (goal included)", removed), value("Discovered states", seen.size), value("Reference reachable states", all.length), value("Reference goal states", all.filter(s => s.has("D")).length)] };
  }
  if (model === "plan-strips-effects") {
    const cases = [{ state: initial(), action: actions[0] }, { state: initial(), action: actions[1] }, { state: initial(), action: actions[3] }, { state: new Set(["H", "C"]), action: actions[1] }, { state: new Set(["O", "C"]), action: actions[3] }, { state: new Set(["O", "P"]), action: actions[0] }];
    const { state, action } = cases[input], after = apply(state, action), missing = action.pre.filter(a => !state.has(a));
    const columns = ["Old", "Pre", "Del", "Add", "New"], sets = [state, new Set(action.pre), new Set(action.del), new Set(action.add), after];
    return { ...base, controlValue: `${action.name} at ${describe(state)}: ${after ? "applicable" : "rejected"}`, grid: { title: after ? "Change the effects; preserve every other fact" : "An unmet precondition produces no successor", summary: "Rows are H=home, O=office, P=parcel available at home, C=carrying, D=delivered. Old/New columns show before/after truth; Pre/Del/Add columns show membership in the precondition/delete/add sets. 1 means true or listed according to the column, 0 means false or unlisted. An em dash means no successor exists for this attempted action, not a false after-state. Coral marks changed after-facts on success, or unmet preconditions on rejection.", rows: atoms.length, columns: columns.length, rowLabels: atoms, columnLabels: columns, legend: ["Old/New = truth; Pre/Del/Add = set membership", after ? "Coral = changed truth value" : "Coral = unmet requirement; — = no successor"], cells: atoms.flatMap((atom, row) => sets.map((set, column) => ({ row, column, label: set ? String(Number(set.has(atom))) : "—", accent: Boolean(set?.has(atom)), selected: after ? column === 4 && state.has(atom) !== after.has(atom) : column === 1 && missing.includes(atom) }))) },
      matrices: [{ label: after ? "Before and valid successor truth values" : "Rejected attempt: no after-state is invented", rowLabels: after ? ["Before", "After"] : ["Before"], columnLabels: atoms, entries: [state, ...(after ? [after] : [])].map(s => atoms.map(a => Number(s.has(a)))) }],
      summary: `${action.name} declares pre=${describe(new Set(action.pre))}, delete=${describe(new Set(action.del))}, add=${describe(new Set(action.add))}. ${after ? `All preconditions hold. (${describe(state)} ∖ delete) ∪ add = ${describe(after)}. Facts outside the effects persist; ${atoms.filter(a => !action.add.includes(a) && !action.del.includes(a)).join(",")} are unaffected.` : `Missing ${missing.join(",")}; the action is inapplicable, so there is no successor. Rejecting this attempt does not model a legal no-op transition.`} This is a complete closed-world planning state, unlike an open logical KB where absent facts need not be false.`,
      values: [value("Applicable (1=yes)", Number(Boolean(after))), value("Unmet preconditions", missing.length), value("True facts before", state.size), ...(after ? [value("True facts after", after.size), value("Changed atom values", atoms.filter(a => state.has(a) !== after.has(a)).length)] : [])] };
  }
  const plan = [actions[0], actions[1], actions[3]], forward = [initial()], regression = [new Set(["D"])], reverse = [...plan].reverse();
  for (let i = 0; i < input; i++) {
    forward.push(apply(forward.at(-1)!, plan[i])!);
    const goal = regression.at(-1)!, action = reverse[i];
    if (!action.add.some(a => goal.has(a)) || action.del.some(a => goal.has(a))) throw new Error("Invalid regression step");
    regression.push(new Set([...goal].filter(a => !action.add.includes(a)).concat(action.pre)));
  }
  const nodes: NonNullable<CalculationResult["graph"]>["nodes"] = [], edges: NonNullable<CalculationResult["graph"]>["edges"] = [];
  forward.forEach((s, i) => { nodes.push({ id: `F${i}`, label: `F${i}`, x: 65, y: 45 + i * 140, observed: false, state: key(s).split("").join(" ") }); if (i) edges.push({ from: `F${i - 1}`, to: `F${i}`, directed: true, label: plan[i - 1].code }); });
  regression.forEach((s, i) => { nodes.push({ id: `B${i}`, label: `B${i}`, x: 255, y: 45 + i * 140, observed: false, state: key(s).split("").join(" ") }); if (i) edges.push({ from: `B${i - 1}`, to: `B${i}`, directed: true, label: reverse[i - 1].code, accent: true }); });
  const required = regression.at(-1)!, initialSupports = [...required].every(a => initial().has(a)), goalReached = forward.at(-1)!.has("D");
  return { ...base, controlValue: `${input} steps: forward ${describe(forward.at(-1)!)}; required ${describe(required)}`, graph: { title: "Progress complete states; regress partial requirements", height: 125 + input * 140, maxWidth: 420, summary: "Left F nodes are full world states progressed from {H,P}; omitted atoms are false. Right B nodes are goal requirements regressed from {D}; omitted atoms are unconstrained. Solid left arrows apply actions; dashed right arrows compute preceding requirements, not inverse physical execution. Edge codes P=Pickup, G=Go, D=Deliver. Read the right edge sequence in reverse to obtain the executable plan.", nodes, edges },
    matrices: [{ label: "Forward states: 1=true, 0=false", rowLabels: forward.map((_, i) => `F${i}`), columnLabels: atoms, entries: forward.map(s => atoms.map(a => Number(s.has(a)))) }, { label: "Regressed requirements: 1=required, 0=unconstrained", rowLabels: regression.map((_, i) => `B${i}`), columnLabels: atoms, entries: regression.map(s => atoms.map(a => Number(s.has(a)))) }],
    summary: `Forward prefix: ${plan.slice(0, input).map(a => a.name).join(" → ") || "no actions yet"}; current full state ${describe(forward.at(-1)!)}. Regression choices: ${reverse.slice(0, input).map(a => a.name).join(" ← ") || "none yet"}; current preceding requirement ${describe(required)}. ${initialSupports ? "The initial state satisfies this requirement, closing the three-action regression proof." : "The initial state does not yet satisfy this requirement; more regression is needed."} ${goalReached ? "The forward execution also satisfies D." : "The forward prefix has not yet delivered the parcel."} This follows one declared solution chain, not a measurement or comparison of complete forward and backward search work.`,
    values: [value("Shown forward actions", input), value("Shown regression choices", input), value("Forward goal reached (1=yes)", Number(goalReached)), value("Initial state supports requirement (1=yes)", Number(initialSupports)), value("Current required atoms", required.size)] };
}
