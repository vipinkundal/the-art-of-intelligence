import type { CalculationResult } from "./calculations.ts";
export const predicateModels = ["logic-predicate-model", "logic-quantifier-order"] as const;
export type PredicateModel = typeof predicateModels[number];
export const isPredicateModel = (model: string): model is PredicateModel => (predicateModels as readonly string[]).includes(model);
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const base = { kind: "matrix" as const, series: [], xLabel: "Domain element", yLabel: "Predicate truth", xDomain: [0, 2] as [number, number], yDomain: [0, 1] as [number, number] };
export function calculatePredicate(model: PredicateModel, input: number): CalculationResult {
  if (!Number.isInteger(input) || input < 0 || input > (model === "logic-predicate-model" ? 7 : 3)) throw new Error(`Invalid ${model} input`);
  if (model === "logic-predicate-model") {
    const names = ["a", "b", "c"], active = [1, 1, 0], healthy = names.map((_, i) => Number(Boolean(input & (1 << i))));
    const entries = names.map((_, i) => [active[i], healthy[i], Number(!active[i] || healthy[i]), active[i] * healthy[i]]);
    const counterexamples = names.filter((_, i) => !entries[i][2]), witnesses = names.filter((_, i) => entries[i][3]);
    return { ...base, controlValue: `Healthy={${names.filter((_, i) => healthy[i]).join(",")}}; mask ${input}`,
      grid: { title: "One interpretation, three domain elements", summary: "Rows are the three distinct objects in the specified domain, not three possible worlds. A=Active and H=Healthy. Striped 1 is true; outlined 0 is false. Predicate extensions are completely specified here; zero does not mean an unknown database fact.", rows: 3, columns: 4, rowLabels: names, columnLabels: ["A", "H", "A⇒H", "A∧H"], legend: ["Rows = objects a, b, c", "Striped 1 = true; outlined 0 = false"], cells: entries.flatMap((row, i) => row.map((v, j) => ({ row: i, column: j, label: String(v), accent: v === 1 }))) },
      matrices: [{ label: "Evaluation in a fully specified interpretation", rowLabels: names, columnLabels: ["Active", "Healthy", "A⇒H", "A∧H"], entries }],
      summary: `Active={a,b}; Healthy={${names.filter((_, i) => healthy[i]).join(",")}}. ∀x(Active(x)⇒Healthy(x)) is ${counterexamples.length ? `false, with counterexample${counterexamples.length > 1 ? "s" : ""} ${counterexamples.join(", ")}` : "true: both active objects are healthy"}. ∃x(Active(x)∧Healthy(x)) is ${witnesses.length ? `true, witnessed by ${witnesses.join(", ")}` : "false: no active object is healthy"}. Inactive c satisfies the implication regardless of its health, but cannot witness the conjunction. This evaluates two closed sentences in one interpretation; it does not prove entailment over every model of a knowledge base.`,
      values: [value("Domain size", 3, "objects"), value("Active objects", 2), value("Healthy active witnesses", witnesses.length), value("Universal-rule counterexamples", counterexamples.length), value("Universal sentence true (1=yes)", Number(!counterexamples.length)), value("Existential sentence true (1=yes)", Number(Boolean(witnesses.length)))] };
  }
  const patterns = [
    { name: "Different witnesses", matrix: [[1, 0, 0], [0, 1, 0]] },
    { name: "One shared witness", matrix: [[1, 0, 0], [1, 1, 0]] },
    { name: "Uncovered second job", matrix: [[1, 0, 0], [0, 0, 0]] },
    { name: "All pairs compatible", matrix: [[1, 1, 1], [1, 1, 1]] },
  ];
  const selected = patterns[input], workers = ["w1", "w2", "w3"], jobs = ["j1", "j2"];
  const supports = selected.matrix.map(row => workers.filter((_, j) => row[j])), common = workers.filter((_, j) => selected.matrix.every(row => row[j]));
  const each = supports.every(s => s.length), shared = common.length > 0, uncovered = jobs.filter((_, i) => !supports[i].length);
  return { ...base, controlValue: `${input}: ${selected.name}`, grid: { title: "A witness per row is not one full column", summary: "R(job,worker) means that worker can handle that job. Striped 1 is a compatible pair; outlined 0 is incompatible. ∀job∃worker checks for a 1 in every row. ∃worker∀job checks for a column filled with 1s. These checks do not assign capacity, enforce distinct workers or plan simultaneous execution.", rows: 2, columns: 3, rowLabels: jobs, columnLabels: workers, legend: ["Every row has a 1: a witness may depend on the job", "One full column: the same witness serves every job", "Coral outlines mark shared-witness columns"], cells: selected.matrix.flatMap((row, i) => row.map((v, j) => ({ row: i, column: j, label: String(v), accent: v === 1, selected: common.includes(workers[j]) }))) },
    matrices: [{ label: "Fully specified compatibility relation R", rowLabels: jobs, columnLabels: workers, entries: selected.matrix }, { label: "Witness counts; positive row counts do not imply a common column", rowLabels: jobs, columnLabels: ["compatible workers"], entries: supports.map(s => [s.length]) }],
    summary: `Pattern ${input}: ${selected.name}. Job supports: ${jobs.map((job, i) => `${job}→{${supports[i].join(",")}}`).join("; ")}. ∀job∃worker R is ${each ? "true" : `false because ${uncovered.join(",")} has no witness`}. ∃worker∀job R is ${shared ? `true, with shared witness${common.length > 1 ? "es" : ""} ${common.join(",")}` : "false: no worker's column covers both jobs"}. A common witness implies a witness for each job; the reverse implication fails in pattern 0. This is finite-model evaluation, not a claim that quantified first-order reasoning generally reduces to six lookups.`,
    values: [value("Jobs with at least one witness", supports.filter(s => s.length).length, "of 2 jobs"), value("Shared witnesses", common.length, "workers"), value("∀job∃worker true (1=yes)", Number(each)), value("∃worker∀job true (1=yes)", Number(shared)), value("Compatible pairs", selected.matrix.flat().reduce((a, b) => a + b, 0), "of 6 pairs")] };
}
