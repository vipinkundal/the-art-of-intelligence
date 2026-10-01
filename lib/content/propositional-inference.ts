import type { CalculationResult } from "./calculations.ts";

export const propositionalModels = ["logic-implication", "logic-sat", "logic-resolution", "logic-dpll"] as const;
export type PropositionalModel = typeof propositionalModels[number];
export const isPropositionalModel = (model: string): model is PropositionalModel => (propositionalModels as readonly string[]).includes(model);
type Clause = number[];
type Assignment = Record<number, boolean>;
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const base = { kind: "matrix" as const, series: [], xLabel: "Assignment", yLabel: "Truth value", xDomain: [0, 7] as [number, number], yDomain: [0, 1] as [number, number] };
const literalText = (literal: number, names: string[]) => `${literal < 0 ? "¬" : ""}${names[Math.abs(literal) - 1]}`;
const clauseText = (clause: Clause, names: string[]) => clause.length ? clause.map(l => literalText(l, names)).join("∨") : "□";
function clauseStatus(clause: Clause, assignment: Assignment): -1 | 0 | 1 {
  let unknown = false;
  for (const literal of clause) {
    const truth = assignment[Math.abs(literal)];
    if (truth === undefined) unknown = true;
    else if (truth === (literal > 0)) return 1;
  }
  return unknown ? 0 : -1;
}
function truthGrid(title: string, rows: string[], columns: string[], entries: number[][], selected: number): NonNullable<CalculationResult["grid"]> {
  return { title, summary: "Each labeled row is a complete Boolean assignment, in the variable order given by the control. A striped cell labeled 1 is true; an outlined cell labeled 0 is false. The coral row outline marks the assignment selected by the control. These values are truth evaluations, not probabilities or confidence scores.", rows: rows.length, columns: columns.length, columnLabels: columns, rowLabels: rows,
    legend: ["Striped 1 = true; outlined 0 = false", "Coral outline = selected assignment"],
    cells: entries.flatMap((row, i) => row.map((entry, j) => ({ row: i, column: j, label: String(entry), accent: entry === 1, selected: i === selected }))) };
}
function resolve(left: Clause, right: Clause, pivot: number): Clause {
  if (!left.includes(pivot) || !right.includes(-pivot)) throw new Error("Resolution requires one complementary pivot pair");
  return [...new Set([...left.filter(l => l !== pivot), ...right.filter(l => l !== -pivot)])].sort((a, b) => Math.abs(a) - Math.abs(b) || a - b);
}
const dpllClauses: Clause[] = [[-1, 2], [-1, -2], [1, 3], [-3, 4], [3, -4]];
type Trace = { assignment: Assignment; event: string; label: string; statuses: number[] };
function dpllTrace() {
  const trace: Trace[] = [];
  const record = (assignment: Assignment, event: string, label = event) => trace.push({ assignment: { ...assignment }, event, label, statuses: dpllClauses.map(c => clauseStatus(c, assignment)) });
  function solve(input: Assignment, event: string, label = event): Assignment | undefined {
    const assignment = { ...input };
    record(assignment, event, label);
    for (;;) {
      const statuses = dpllClauses.map(c => clauseStatus(c, assignment));
      if (statuses.includes(-1)) return undefined;
      if (statuses.every(s => s === 1)) return assignment;
      const index = dpllClauses.findIndex((clause, i) => statuses[i] === 0 && clause.filter(l => assignment[Math.abs(l)] === undefined).length === 1);
      if (index < 0) break;
      const literal = dpllClauses[index].find(l => assignment[Math.abs(l)] === undefined)!;
      assignment[Math.abs(literal)] = literal > 0;
      record(assignment, `Unit C${index + 1}: ${literalText(literal, ["P", "Q", "R", "S"])}=true`, `Unit ${["P", "Q", "R", "S"][Math.abs(literal) - 1]}=${Number(literal > 0)}`);
    }
    const variable = [1, 2, 3, 4].find(n => assignment[n] === undefined)!;
    const names = ["P", "Q", "R", "S"];
    return solve({ ...assignment, [variable]: true }, `Decide ${names[variable - 1]}=1`) ?? solve({ ...assignment, [variable]: false }, `Backtrack; try ${names[variable - 1]}=0`, `Retry ${names[variable - 1]}=0`);
  }
  const solution = solve({}, "Start with no assignments", "Start");
  return { trace, solution };
}

export function calculatePropositional(model: PropositionalModel, input: number): CalculationResult {
  const max = { "logic-implication": 3, "logic-sat": 7, "logic-resolution": 4, "logic-dpll": 5 }[model];
  if (!Number.isInteger(input) || input < 0 || input > max) throw new Error(`Invalid ${model} input`);
  if (model === "logic-implication") {
    const rows = Array.from({ length: 4 }, (_, i) => [Math.floor(i / 2), i % 2]);
    const entries = rows.map(([p, q]) => [p, q, Number(!p || q), Number(!q || p)]), [p, q, implies, converse] = entries[input];
    return { ...base, controlValue: `P=${p}, Q=${q}`, grid: truthGrid("Implication has exactly one false row", rows.map(r => r.join("")), ["P", "Q", "P⇒Q", "Q⇒P"], entries, input),
      matrices: [{ label: "Complete truth table; 1=true and 0=false", rowLabels: rows.map((r, i) => `${i}: P=${r[0]}, Q=${r[1]}`), columnLabels: ["P", "Q", "P⇒Q", "Q⇒P"], entries }],
      summary: `Selected assignment P=${p}, Q=${q}: P⇒Q is ${implies ? "true" : "false"}, while its converse Q⇒P is ${converse ? "true" : "false"}. The only failure of P⇒Q is P=1,Q=0. A false antecedent makes a material implication true, but does not establish a causal mechanism or make Q true. Across all four assignments the implication is satisfiable, not valid. Its converse differs on assignments 01 and 10.`,
      values: [value("P truth value", p), value("Q truth value", q), value("Material implication", implies), value("Converse", converse), value("Models satisfying P⇒Q", 3, "of 4 assignments")] };
  }
  if (model === "logic-sat") {
    const clauses = [[1, 2], [-1, 3], [-2, -3]], names = ["X", "Y", "Z"];
    const assignments = Array.from({ length: 8 }, (_, i) => [Math.floor(i / 4), Math.floor(i / 2) % 2, i % 2]);
    const entries = assignments.map(s => { const assignment = Object.fromEntries(s.map((v, i) => [i + 1, Boolean(v)])); const truths = clauses.map(c => Number(clauseStatus(c, assignment) === 1)); return [...truths, Number(truths.every(Boolean))]; });
    const chosen = assignments[input], failed = entries[input].slice(0, 3).flatMap((t, i) => t ? [] : [`C${i + 1}`]), models = assignments.filter((_, i) => entries[i][3]).map(s => s.join(""));
    return { ...base, controlValue: `(X,Y,Z)=(${chosen.join(",")})`, grid: truthGrid("One false clause breaks the whole conjunction", assignments.map(s => s.join("")), ["C1", "C2", "C3", "F"], entries, input),
      matrices: [{ label: `C1=${clauseText(clauses[0], names)}; C2=${clauseText(clauses[1], names)}; C3=${clauseText(clauses[2], names)}`, rowLabels: assignments.map((s, i) => `${i}: ${s.join("")}`), columnLabels: ["C1", "C2", "C3", "F"], entries }],
      summary: `At (${chosen.join(",")}), ${failed.length ? `${failed.join(", ")} ${failed.length === 1 ? "is" : "are"} false, so this candidate fails.` : "all three clauses are true: this assignment is a SAT witness."} Exhaustive enumeration finds exactly two satisfying assignments: ${models.join(" and ")}. A failed candidate does not prove UNSAT. This table exhausts only a three-variable toy; it is not a general efficient SAT solver or an NP-hardness demonstration.`,
      values: [value("Satisfied clauses", 3 - failed.length, "of 3 clauses"), value("Formula true (1=yes)", entries[input][3]), value("Total satisfying assignments", models.length), value("Assignments enumerated", assignments.length)] };
  }
  if (model === "logic-resolution") {
    const names = ["A", "B", "C"], clauses: Clause[] = [[1, 2], [-1, 3], [-2, 3], [-3]];
    const steps: [number, number, number][] = [[1, 3, 3], [2, 3, 3], [0, 4, 1], [6, 5, 2]];
    for (let i = 0; i < input; i++) { const [left, right, pivot] = steps[i]; clauses.push(resolve(clauses[left], clauses[right], pivot)); }
    const positions = [[70, 365], [70, 45], [70, 255], [250, 45], [160, 150], [250, 255], [250, 365], [160, 475]];
    const edges = steps.slice(0, input).flatMap(([left, right, pivot], i) => [{ from: `C${left + 1}`, to: `C${i + 5}`, directed: true, label: names[pivot - 1], accent: i === input - 1 }, { from: `C${right + 1}`, to: `C${i + 5}`, directed: true, accent: i === input - 1 }]);
    const remainingModels = Array.from({ length: 8 }, (_, mask) => ({ 1: Boolean(mask & 4), 2: Boolean(mask & 2), 3: Boolean(mask & 1) })).filter(a => clauses.every(c => clauseStatus(c, a) === 1)).length;
    return { ...base, controlValue: `${input} resolution steps${input === 4 ? " · empty clause derived" : ""}`, graph: { title: "Negate the query, then derive a contradiction", height: 555, maxWidth: 420, summary: "C1 through C3 are the knowledge base; C4 is the added negated query ¬C. Edges identify both parents of each resolvent. A labeled edge names the one pivot canceled. Dashed coral marks the latest derivation. □ denotes the empty, always-false clause.", nodes: clauses.map((c, i) => ({ id: `C${i + 1}`, label: `C${i + 1}`, x: positions[i][0], y: positions[i][1], observed: false, state: clauseText(c, names) })), edges },
      matrices: [{ label: "Literal membership: +1=positive, −1=negative, 0=absent", rowLabels: clauses.map((c, i) => `C${i + 1}: ${clauseText(c, names)}`), columnLabels: names, entries: clauses.map(c => names.map((_, i) => c.includes(i + 1) ? 1 : c.includes(-i - 1) ? -1 : 0)) }],
      summary: `${input ? `Latest: C${input + 4}=${clauseText(clauses.at(-1)!, names)} from C${steps[input - 1][0] + 1} and C${steps[input - 1][1] + 1}, pivot ${names[steps[input - 1][2] - 1]}.` : "No resolution step has been performed yet."} ${input === 4 ? "The empty clause certifies that KB∧¬C is unsatisfiable; therefore KB entails C." : "The displayed proof is unfinished. An independent eight-assignment enumeration already finds zero models for KB∧¬C, but that oracle result is not a resolution step."} KB alone has three models and is consistent. A zero-filled empty-clause row means no literals, not a satisfying assignment.`,
      values: [value("Resolution steps", input), value("Clauses displayed", clauses.length), value("Empty clause derived (1=yes)", Number(input === 4)), value("Models of KB∧¬C (enumerated)", remainingModels), value("Models of KB alone", 3)] };
  }
  const { trace, solution } = dpllTrace(), current = trace[input], names = ["P", "Q", "R", "S"];
  const status = current.statuses.includes(-1) ? "conflict" : current.statuses.every(s => s === 1) ? "satisfied" : "open";
  return { ...base, controlValue: `Trace event ${input}: ${status}`, grid: { title: "Decisions branch; units force; conflicts restore", summary: "Numbered rows are trace events and columns are original clauses. Striped 1 means already satisfied, outlined 0 is unresolved and −1 is false under the current partial assignment. Coral outlines select the current event. Zero is an unresolved-clause code here, not a false literal.", rows: input + 1, columns: 5, rowLabels: trace.slice(0, input + 1).map((_, i) => String(i)), columnLabels: ["C1", "C2", "C3", "C4", "C5"], legend: ["1 = satisfied, 0 = unresolved, −1 = conflict", "Coral outline = current trace event"], cells: trace.slice(0, input + 1).flatMap((event, i) => event.statuses.map((s, j) => ({ row: i, column: j, label: String(s), accent: s === 1, selected: i === input }))) },
    matrices: [{ label: "Assignment trail: −1=unassigned; 0=false; 1=true", rowLabels: trace.slice(0, input + 1).map((event, i) => `${i}: ${event.label}`), columnLabels: names, entries: trace.slice(0, input + 1).map(event => names.map((_, i) => event.assignment[i + 1] === undefined ? -1 : Number(event.assignment[i + 1]))) }, { label: "Current original clause status: −1=false, 0=open, 1=true", rowLabels: dpllClauses.map((c, i) => `C${i + 1}: ${clauseText(c, names)}`), columnLabels: ["status"], entries: current.statuses.map(s => [s]) }],
    summary: `${current.event}. Current trail: ${names.map((name, i) => `${name}=${current.assignment[i + 1] === undefined ? "unassigned" : Number(current.assignment[i + 1])}`).join(", ")}. ${status === "conflict" ? "C2 is false after Q=1; this P=1 branch cannot extend to a solution. The next event discards Q and flips the P decision." : status === "satisfied" ? "All original clauses already hold, with Q still free. Either Q value completes the SAT witness; one completion is (P,Q,R,S)=(0,0,1,1)." : "Unresolved clauses still require propagation or a decision; no SAT or UNSAT conclusion has been returned at this event."} The solver uses unit propagation, alphabetic decisions, true first and chronological backtracking. It deliberately omits pure-literal elimination and clause learning.`,
    values: [value("Trace events shown", input + 1), value("Assigned variables", Object.keys(current.assignment).length), value("Satisfied original clauses", current.statuses.filter(s => s === 1).length), value("False original clauses", current.statuses.filter(s => s === -1).length), value("SAT returned at this event (1=yes)", Number(status === "satisfied" && Boolean(solution)))] };
}
