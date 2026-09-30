import type { CalculationResult } from "./calculations.ts";

export const discreteFoundationModels = ["relation-function", "boolean-distribution", "counting-conventions"] as const;
export type DiscreteFoundationModel = typeof discreteFoundationModels[number];
export const isDiscreteFoundationModel = (model: string): model is DiscreteFoundationModel => (discreteFoundationModels as readonly string[]).includes(model);
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const node = (id: string, label: string, x: number, y: number, state = "") => ({ id, label, x, y, observed: false, state });

export function calculateDiscreteFoundation(model: DiscreteFoundationModel, input: number): CalculationResult {
  const upper = model === "relation-function" ? 3 : model === "boolean-distribution" ? 7 : 4;
  if (!Number.isInteger(input) || input < 0 || input > upper) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "matrix", series: [], xDomain: [0, 1], yDomain: [0, 1], xLabel: "", yLabel: "", summary: "", values: [] };
  if (model === "relation-function") {
    const scenarios = [
      { title: "Bijection", pairs: [[0, 0], [1, 1], [2, 2]] },
      { title: "Many-to-one total function", pairs: [[0, 0], [1, 0], [2, 1]] },
      { title: "Partial function, not total on A", pairs: [[0, 0], [1, 1]] },
      { title: "Multivalued relation", pairs: [[0, 0], [0, 1], [1, 1], [2, 2]] }
    ], current = scenarios[input], domain = ["a", "b", "c"], target = ["1", "2", "3"];
    const incidence = domain.map((_, a) => target.map((_, b) => Number(current.pairs.some(([u, v]) => u === a && v === b))));
    const out = incidence.map(row => row.reduce((s, x) => s + x, 0)), into = target.map((_, j) => incidence.reduce((s, row) => s + row[j], 0));
    const total = out.every(x => x === 1), injective = total && into.every(x => x <= 1), surjective = total && into.every(x => x >= 1);
    const classification = total ? `It is a total function: ${injective ? "injective" : "not injective"} and ${surjective ? "surjective onto B" : "not surjective onto B"}.` : out.some(x => x > 1) ? "It is not a function: a has two outputs." : "It is a partial function, but not a total function A→B: c has no output.";
    return { ...base, controlValue: `${input} · ${current.title}`,
      graph: { title: "A={a,b,c} on the left; B={1,2,3} on the right", height: 310, nodes: [...domain.map((s, i) => node(`a${i}`, s, 65, 50 + 95 * i)), ...target.map((s, i) => node(`b${i}`, s, 255, 50 + 95 * i))], edges: current.pairs.map(([a, b]) => ({ from: `a${a}`, to: `b${b}` })), summary: `Each arrow is one ordered pair in R⊆A×B. ${classification} Crossing arrows do not create extra nodes or pairs.` },
      matrices: [{ label: "Relation membership: 1 means this pair belongs to R", rowLabels: domain, columnLabels: target, entries: incidence }, { label: "Outgoing pairs for each input", rowLabels: domain, columnLabels: ["outputs"], entries: out.map(x => [x]) }, { label: "Incoming pairs for each codomain element", rowLabels: target, columnLabels: ["inputs"], entries: into.map(x => [x]) }],
      summary: `${current.title}: R={${current.pairs.map(([a, b]) => `(${domain[a]},${target[b]})`).join(", ")}}. Outgoing counts are (${out.join(", ")}); incoming counts are (${into.join(", ")}). ${classification} The specified codomain remains {1,2,3}, even when an element has no incoming arrow.`,
      values: [value("Domain size |A|", 3), value("Codomain size |B|", 3), value("Relation size |R|", current.pairs.length), value("Total function A→B (1 yes, 0 no)", Number(total)), value("Unused codomain elements", into.filter(x => x === 0).length), value("All possible relations A to B", 2 ** 9), value("All total functions A→B", 3 ** 3), value("All bijections A→B", 6)] };
  }
  if (model === "boolean-distribution") {
    const rows = Array.from({ length: 8 }, (_, i) => {
      const a = i >> 2, b = (i >> 1) & 1, c = i & 1;
      return { a, b, c, f: Number(Boolean(a && (b || c))), g: Number(Boolean((a && b) || (a && c))), h: Number(Boolean((a && b) || c)) };
    });
    const r = rows[input], joined = Number(Boolean(r.b || r.c)), differences = rows.filter(v => v.f !== v.h);
    return { ...base, controlValue: `Row ${input} · A=${r.a}, B=${r.b}, C=${r.c}`,
      graph: { title: "Evaluate the original rule F=A∧(B∨C)", height: 300,
        nodes: [node("a", "A", 45, 45, `value ${r.a}`), node("b", "B", 45, 145, `value ${r.b}`), node("c", "C", 270, 235, `value ${r.c}`), node("or", "OR", 155, 145, `value ${joined}`), node("and", "AND", 270, 45, `F=${r.f}`)],
        edges: [{ from: "b", to: "or" }, { from: "c", to: "or" }, { from: "or", to: "and" }, { from: "a", to: "and" }],
        summary: `A means enabled, B means condition B holds, and C means condition C holds. OR combines B and C; AND still requires A. These are labeled logic operations, not conventional electronic gate symbols. Current output F=${r.f}.` },
      matrices: [{ label: "Exhaustive truth table: row label is the input triple ABC", rowLabels: rows.map((v, i) => `${v.a}${v.b}${v.c}${i === input ? " •" : ""}`), columnLabels: ["F", "G", "H"], entries: rows.map(v => [v.f, v.g, v.h]) }],
      summary: `For ABC=${r.a}${r.b}${r.c}, F=A∧(B∨C)=${r.f} and its distributed form G=(A∧B)∨(A∧C)=${r.g}. The incorrect rewrite H=(A∧B)∨C gives ${r.h}. F and G agree on all eight assignments; H differs on ${differences.map(v => `${v.a}${v.b}${v.c}`).join(" and ")}. A true C must not bypass A in the original rule.`,
      values: [value("Input A", r.a), value("Input B", r.b), value("Input C", r.c), value("Intermediate B∨C", joined), value("Original output F", r.f), value("Distributed output G", r.g), value("Incorrect output H", r.h), value("F versus G disagreements over all assignments", rows.filter(v => v.f !== v.g).length), value("F versus H disagreements over all assignments", differences.length)] };
  }
  let sequences: string[] = [""];
  for (let position = 0; position < input; position++) sequences = sequences.flatMap(prefix => ["A", "B", "C", "D"].map(letter => prefix + letter));
  const distinct = sequences.filter(s => new Set(s).size === s.length);
  const canonical = (s: string) => [...s].sort().join("");
  const subsets = new Set(distinct.map(canonical)), multisets = new Map<string, number>();
  for (const s of sequences) { const key = canonical(s); multisets.set(key, (multisets.get(key) ?? 0) + 1); }
  const groups = [...multisets.entries()].sort(([a], [b]) => a.localeCompare(b)), counts = [sequences.length, distinct.length, subsets.size, multisets.size];
  return { ...base, kind: "bars", xDomain: [-.5, 3.5], yDomain: [0, Math.ceil(Math.max(...counts) * 1.1 / 4) * 4], xTicks: [0, 1, 2, 3], xTickLabels: ["seq+", "seq−", "set", "multi"], xLabel: "Outcome convention", yLabel: "Number of possible outcomes", controlValue: `k=${input} selections from four labels`,
    series: [{ label: "seq+: ordered with repeats; seq−: ordered without repeats; set: subset; multi: multiset", points: counts.map((count, i) => [i, count]) }],
    matrices: [{ label: "Every multiset and how many ordered sequences produce it", rowLabels: groups.map(([s]) => s || "empty"), columnLabels: ["sequences", "probability"], entries: groups.map(([, count]) => [count, count / sequences.length]) }],
    summary: `With four distinct labels and k=${input}, the counts are: ordered sequences allowing repeats, ${counts[0]}; ordered sequences without repeats, ${counts[1]}; size-${input} subsets, ${counts[2]}; size-${input} multisets, ${counts[3]}. ${input === 0 ? "All four spaces contain one empty outcome, not zero outcomes." : "The multiset table groups equally likely ordered sequences; groups need not have equal sizes, so uniform ordered sampling does not generally yield uniform multisets."} These are counts, not measured runtimes or probabilities of the four conventions.`,
    values: [value("Distinct labels n", 4), value("Selections k", input), value("Ordered, repetitions allowed: nᵏ", counts[0]), value("Ordered, no repetitions: n!/(n−k)!", counts[1]), value("Unordered, no repetitions: C(n,k)", counts[2]), value("Unordered, repetitions allowed: C(n+k−1,k)", counts[3]), value("Total probability across multiset groups", groups.reduce((s, [, count]) => s + count / sequences.length, 0))] };
}
