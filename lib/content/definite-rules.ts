import type { CalculationResult } from "./calculations.ts";
export const definiteRuleModels = ["logic-horn-shape", "logic-forward-closure", "logic-backward-query"] as const;
export type DefiniteRuleModel = typeof definiteRuleModels[number];
export const isDefiniteRuleModel = (model: string): model is DefiniteRuleModel => (definiteRuleModels as readonly string[]).includes(model);
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const base = { kind: "matrix" as const, series: [], xLabel: "Rule", yLabel: "Derivation", xDomain: [0, 4] as [number, number], yDomain: [0, 1] as [number, number] };
type Rule = { head: string; body: string[] };
export function calculateDefiniteRules(model: DefiniteRuleModel, input: number): CalculationResult {
  if (!Number.isInteger(input) || input < 0 || input > (model === "logic-backward-query" ? 3 : 4)) throw new Error(`Invalid ${model} input`);
  if (model === "logic-horn-shape") {
    const examples = [
      { clause: "¬A∨¬B∨C", positive: ["C"], negative: ["A", "B"], equivalent: "A∧B⇒C" },
      { clause: "¬A∨B", positive: ["B"], negative: ["A"], equivalent: "A⇒B" },
      { clause: "¬A∨¬B", positive: [], negative: ["A", "B"], equivalent: "A∧B⇒⊥" },
      { clause: "A∨B", positive: ["A", "B"], negative: [], equivalent: "A∨B (no unique positive head)" },
      { clause: "C", positive: ["C"], negative: [], equivalent: "true⇒C (fact)" },
    ];
    const selected = examples[input], horn = selected.positive.length <= 1, definite = selected.positive.length === 1;
    const nodes: NonNullable<CalculationResult["graph"]>["nodes"] = [], edges: NonNullable<CalculationResult["graph"]>["edges"] = [];
    if (input === 3) {
      nodes.push({ id: "A", label: "A", x: 65, y: 45, observed: false, state: "" }, { id: "B", label: "B", x: 255, y: 45, observed: false, state: "" }, { id: "or", label: "∨", x: 160, y: 145, kind: "factor", observed: false, state: "two positives" });
      edges.push({ from: "A", to: "or", directed: false }, { from: "B", to: "or", directed: false });
    } else if (!selected.negative.length) {
      nodes.push({ id: "C", label: "C", x: 160, y: 45, observed: false, state: "fact" });
    } else {
      selected.negative.forEach((id, i) => {
        nodes.push({ id, label: id, x: selected.negative.length === 1 ? 160 : 65 + i * 190, y: 45, observed: false, state: "" });
        edges.push({ from: id, to: "and", directed: true });
      });
      nodes.push({ id: "and", label: "∧", x: 160, y: 145, kind: "factor", observed: false, state: "joint body" }, { id: "head", label: selected.positive[0] ?? "⊥", x: 160, y: 255, observed: false, state: selected.positive.length ? "single head" : "forbidden body" });
      edges.push({ from: "and", to: "head", directed: true });
    }
    return { ...base, controlValue: `${selected.clause}: ${horn ? definite ? "definite Horn" : "headless Horn" : "not Horn"}`, graph: { title: selected.equivalent, height: selected.negative.length ? 330 : input === 3 ? 225 : 125, maxWidth: 420, summary: "This is a syntax diagram, not a causal or probabilistic graph. A square ∧ combines all antecedents jointly; arrows then identify an implication's head. ⊥ means false. The ∨ example has two alternative positive literals and is not an implication with a unique positive head. No truth assignment is being evaluated.", nodes, edges },
      matrices: [{ label: "Classify each individual clause: 1=yes, 0=no", rowLabels: examples.map((e, i) => `${i}: ${e.clause}`), columnLabels: ["positive", "negative", "Horn", "definite"], entries: examples.map(e => [e.positive.length, e.negative.length, Number(e.positive.length <= 1), Number(e.positive.length === 1)]) }],
      summary: `Selected clause ${selected.clause} has ${selected.positive.length} positive ${selected.positive.length === 1 ? "literal" : "literals"} and ${selected.negative.length} negative ${selected.negative.length === 1 ? "literal" : "literals"}. ${horn ? definite ? "Exactly one positive literal makes it a definite Horn clause." : "No positive literal makes it a Horn constraint, not a definite clause." : "Two positive literals exclude it from Horn syntax."} Equivalent reading: ${selected.equivalent}. In A∧B⇒C, both antecedents are required; A⇒C and B⇒C would be stronger, different rules. This classifies one clause, not the satisfiability or Horn status of an entire collection containing the non-Horn example.`,
      values: [value("Positive literals", selected.positive.length), value("Negative literals", selected.negative.length), value("Horn (1=yes)", Number(horn)), value("Definite (1=yes)", Number(definite))] };
  }
  if (model === "logic-forward-closure") {
    const atoms = ["A", "B", "C", "D", "E", "F", "G", "H"], rules: Rule[] = [{ head: "C", body: ["A", "B"] }, { head: "D", body: ["C"] }, { head: "E", body: ["B"] }, { head: "F", body: ["D", "E"] }, { head: "H", body: ["G"] }, { head: "G", body: ["H"] }];
    const rounds = [new Set(["A", "B"])];
    for (let round = 0; round < input; round++) {
      const before = rounds.at(-1)!, after = new Set(before);
      for (const rule of rules) if (rule.body.every(a => before.has(a))) after.add(rule.head);
      rounds.push(after);
    }
    const current = rounds.at(-1)!, previous = rounds.at(-2) ?? new Set<string>(), added = [...current].filter(a => !previous.has(a)), fixed = rules.every(r => !r.body.every(a => current.has(a)) || current.has(r.head));
    return { ...base, controlValue: `Round ${input}: known {${[...current].sort().join(",")}}`, grid: { title: "Consequences accumulate; a bare cycle never starts", summary: "Round zero contains asserted facts A and B. Each later round fires every rule whose full body was known at the preceding round. Striped 1 means derived or asserted, and 0 means not yet derived, not false. Coral outlines identify additions in the current row. A final unchanged round checks the fixed point.", rows: input + 1, columns: atoms.length, rowLabels: rounds.map((_, i) => String(i)), columnLabels: atoms, legend: ["1 = in the known consequence set; 0 ≠ logically false", "Coral outline = new in the selected round"], cells: rounds.flatMap((known, i) => atoms.map((a, j) => ({ row: i, column: j, label: known.has(a) ? "1" : "0", accent: known.has(a), selected: i === input && added.includes(a) }))) },
      matrices: [{ label: "Synchronous rounds: additions use only the previous set", rowLabels: rounds.map((_, i) => `Round ${i}`), columnLabels: atoms, entries: rounds.map(s => atoms.map(a => Number(s.has(a)))) }],
      summary: `Known set after round ${input}: {${[...current].sort().join(",")}}. ${input === 0 ? "A and B are initial asserted facts." : `New this round: ${added.length ? added.sort().join(", ") : "none"}.`} ${fixed ? "No applicable rule can add another atom; the least closure is {A,B,C,D,E,F}." : "Further rules can still add consequences; this is not the final closure."} G⇒H and H⇒G have no seed, so neither G nor H is derived. Their non-derivability does not entail ¬G or ¬H: setting both true is also compatible with the KB. These are pedagogical synchronous rounds, not measured runtime or an optimized agenda implementation.`,
      values: [value("Completed propagation rounds", input), value("Known atoms", current.size), value("Additions in selected row", added.length), value("Fixed point reached (1=yes)", Number(fixed)), value("F derived (1=yes)", Number(current.has("F")))] };
  }
  const facts = new Set<string>(); if (input & 1) facts.add("P"); if (input & 2) facts.add("Q");
  const rules: Rule[] = [{ head: "D", body: ["A", "B"] }, { head: "A", body: ["P"] }, { head: "B", body: ["Q"] }, { head: "C", body: ["C"] }];
  const calls: { atom: string; depth: number; success: boolean }[] = [];
  function prove(atom: string, ancestors: Set<string>, depth: number): boolean {
    const call = { atom, depth, success: false }; calls.push(call);
    if (facts.has(atom)) return call.success = true;
    if (ancestors.has(atom)) return false;
    const next = new Set([...ancestors, atom]);
    call.success = rules.filter(r => r.head === atom).some(r => r.body.every(a => prove(a, next, depth + 1)));
    return call.success;
  }
  const success = prove("D", new Set(), 0), visited = new Set(calls.map(c => c.atom));
  const positions: [string, number, number][] = [["D", 160, 45], ["A", 65, 155], ["B", 255, 155], ["P", 65, 265], ["Q", 255, 265]];
  return { ...base, controlValue: `Facts={${[...facts].join(",")}}; D ${success ? "proved" : "not entailed"}`, graph: { title: "Work backward from D's required evidence", height: 345, maxWidth: 420, summary: "D requires both A and B; A requires P, B requires Q. Downward arrows are subgoal dependencies, not implications or causal effects. Dashed coral identifies explored dependencies. The left-to-right depth-first procedure stops a conjunction at its first failed subgoal. The irrelevant rule C←C is not entered.", nodes: positions.map(([id, x, y]) => ({ id, label: id, x, y, observed: false, state: !visited.has(id) ? "not visited" : facts.has(id) ? "given fact" : calls.find(c => c.atom === id)!.success ? "proved" : "not proved" })), edges: [["D", "A"], ["D", "B"], ["A", "P"], ["B", "Q"]].map(([from, to]) => ({ from, to, directed: true, accent: visited.has(to) })) },
    matrices: [{ label: "Calls in entry order; result after return (1=proved, 0=not proved)", rowLabels: calls.map((c, i) => `${i + 1}: ask ${c.atom}`), columnLabels: ["depth", "result"], entries: calls.map(c => [c.depth, Number(c.success)]) }],
    summary: `Query D with facts {${[...facts].join(",")}} visits ${calls.map(c => c.atom).join(" → ")}. ${success ? "P and Q discharge both branches, so D follows from the declared rules and facts." : !facts.has("P") ? "P has no fact or defining rule, so the A branch fails and B is not visited." : "P discharges A, but Q has no fact or defining rule, so the B branch fails."} ${success ? "A positive derivation is obtained." : "For this finite acyclic query dependency, the complete failed search establishes non-entailment of D, not entailment of ¬D."} The unused C←C rule is irrelevant to D. General depth-first backward chaining can loop on relevant cycles; this implementation checks ancestors and explores alternative defining rules.`,
    values: [value("Asserted facts", facts.size), value("Subgoal calls", calls.length), value("Successful returned calls", calls.filter(c => c.success).length), value("D proved (1=yes)", Number(success)), value("Irrelevant C calls", calls.filter(c => c.atom === "C").length)] };
}
