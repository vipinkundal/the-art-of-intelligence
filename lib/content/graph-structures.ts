import type { CalculationResult } from "./calculations.ts";

export const graphStructureModels = ["graph-connectivity", "dag-ordering"] as const;
export type GraphStructureModel = typeof graphStructureModels[number];
export const isGraphStructureModel = (model: string): model is GraphStructureModel => (graphStructureModels as readonly string[]).includes(model);
type Edge = [number, number];
const value = (label: string, value: number, unit = "") => ({ label, value, unit });

function adjacency(size: number, edges: Edge[], directed = false) {
  const matrix = Array.from({ length: size }, () => Array<number>(size).fill(0));
  for (const [a, b] of edges) { matrix[a][b] = 1; if (!directed) matrix[b][a] = 1; }
  return matrix;
}
function distances(matrix: number[][], start: number) {
  const result = Array<number>(matrix.length).fill(-1), queue = [start]; result[start] = 0;
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    matrix[current].forEach((edge, next) => { if (edge && result[next] === -1) { result[next] = result[current] + 1; queue.push(next); } });
  }
  return result;
}
function components(matrix: number[][]) {
  const membership = Array<number>(matrix.length).fill(0); let count = 0;
  for (let start = 0; start < matrix.length; start++) if (!membership[start]) {
    count++; distances(matrix, start).forEach((d, i) => { if (d >= 0) membership[i] = count; });
  }
  return { membership, count };
}

export function calculateGraphStructure(model: GraphStructureModel, input: number): CalculationResult {
  if (!Number.isInteger(input) || input < 0 || input > (model === "graph-connectivity" ? 3 : 6)) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "matrix", series: [], xDomain: [0, 1], yDomain: [0, 1], xLabel: "", yLabel: "", summary: "", values: [] };
  if (model === "graph-connectivity") {
    const original: Edge[] = [[0,1],[1,2],[2,0],[2,3],[3,4]];
    const names = ["Original network", "Remove bridge C—D", "Remove cycle edge A—B", "Add bypass C—E"];
    const edges: Edge[] = input === 1 ? original.filter((_, i) => i !== 3) : input === 2 ? original.filter((_, i) => i !== 0) : input === 3 ? [...original, [2,4]] : original;
    const labels = ["A", "B", "C", "D", "E"], positions = [[45,45],[275,45],[160,155],[45,275],[275,275]];
    const matrix = adjacency(5, edges), grouped = components(matrix), fromA = distances(matrix, 0), degrees = matrix.map(row => row.reduce((s, x) => s + x, 0));
    const bridges = edges.filter((_, i) => components(adjacency(5, edges.filter((_, j) => i !== j))).count > grouped.count);
    const bridgeNames = bridges.map(([a,b]) => `${labels[a]}—${labels[b]}`), rank = edges.length - labels.length + grouped.count;
    return { ...base, controlValue: `${input} · ${names[input]}`,
      graph: { title: "One edge can be redundant—or the only connection", height: 325, maxWidth: 420,
        nodes: labels.map((label, i) => ({ id: label, label, x: positions[i][0], y: positions[i][1], observed: false, state: "" })),
        edges: edges.map(([a,b]) => ({ from: labels[a], to: labels[b], directed: false })),
        summary: `${names[input]}. Each line is one undirected edge; geometric length carries no weight. Connected components: ${grouped.count}. Bridges: ${bridgeNames.join(", ") || "none"}. The adjacency and distance tables below are calculated from these exact edges.` },
      matrices: [{ label: "Adjacency: 1 means an undirected edge exists", rowLabels: labels, columnLabels: labels, entries: matrix }, { label: "Vertex diagnostics; distance −1 means unreachable from A", rowLabels: labels, columnLabels: ["degree", "group", "hops A"], entries: labels.map((_, i) => [degrees[i], grouped.membership[i], fromA[i]]) }],
      summary: `Scenario “${names[input]}”: the network has ${edges.length} edges and ${grouped.count} connected component${grouped.count === 1 ? "" : "s"}. Degrees sum to ${degrees.reduce((s,x)=>s+x,0)}=2×${edges.length}. ${fromA[4] < 0 ? "E is unreachable from A." : `The shortest A-to-E path has ${fromA[4]} edges.`} Removing a bridge increases the component count; removing an edge on a cycle does not. The independent-cycle count m−n+c is ${rank}, not a count of all possible simple cycles.`,
      values: [value("Vertices n", 5), value("Edges m", edges.length), value("Connected components c", grouped.count), value("Bridges", bridges.length), value("Degree sum", degrees.reduce((s,x)=>s+x,0)), value("Independent cycles m−n+c", rank)] };
  }
  const labels = ["A", "B", "C", "D", "E", "F"], edges: Edge[] = [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5]];
  const emitted: number[] = [];
  const remainingDegree = () => labels.map((_, v) => edges.filter(([u,w]) => w === v && !emitted.includes(u)).length);
  const ready = () => remainingDegree().flatMap((degree, i) => degree === 0 && !emitted.includes(i) ? [i] : []);
  const trace: number[][] = [];
  for (let step = 0; step < input; step++) { const available = ready(), chosen = available[0]; emitted.push(chosen); trace.push([chosen + 1, available.length]); }
  const available = ready(), indegree = remainingDegree(), positions = [[160,45],[45,155],[275,155],[160,280],[45,405],[275,405]];
  const statuses = labels.map((_,i) => emitted.includes(i) ? "done" : available.includes(i) ? "ready" : "waiting");
  return { ...base, controlValue: `${input}/6 tasks emitted`,
    graph: { title: "D must wait for both B and C", height: 465, maxWidth: 400,
      nodes: labels.map((label,i) => ({ id: label, label, x:positions[i][0], y:positions[i][1], observed:false, state:statuses[i] })),
      edges: edges.map(([a,b]) => ({ from:labels[a],to:labels[b] })),
      summary: `An arrow u→v means u must finish before v. Emitted: ${emitted.map(i=>labels[i]).join(" → ") || "none"}. Ready now: ${available.map(i=>labels[i]).join(", ") || "none; all tasks are emitted"}. The original dependency edges remain visible after emission. States are written below nodes; they are not probability observations.` },
    matrices: [{ label: "Remaining prerequisites; state 0 waiting / 1 ready / 2 done", rowLabels: labels, columnLabels: ["unmet", "state"], entries: labels.map((_,i)=>[indegree[i],emitted.includes(i)?2:available.includes(i)?1:0]) }, ...(trace.length ? [{ label:"Emission trace; task code A=1 through F=6", rowLabels:trace.map((_,i)=>`step ${i+1}`), columnLabels:["task", "choices"], entries:trace }] : [])],
    summary: `${input === 0 ? "No task has been emitted; only A has no prerequisites." : `The emitted prefix is ${emitted.map(i=>labels[i]).join(" → ")}.`} ${input === 6 ? "All dependencies point forward in A,B,C,D,E,F. This is one of four valid topological orders." : `Ready tasks: ${available.map(i=>labels[i]).join(", ")}. The next step chooses the alphabetically first ready task, not necessarily the only valid choice.`} The diamond A→B→D and A→C→D contains an undirected cycle but no directed cycle. This DAG is not a tree.`,
    values: [value("Tasks", 6), value("Dependencies", edges.length), value("Tasks emitted", emitted.length), value("Ready tasks", available.length), value("Remaining tasks", 6-emitted.length), value("Valid topological orders of this graph", 4), value("Underlying undirected independent cycles", 1)] };
}
