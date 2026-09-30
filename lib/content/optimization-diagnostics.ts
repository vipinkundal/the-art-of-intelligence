import type { CalculationResult } from "./calculations.ts";

export const optimizationDiagnosticModels = ["armijo-backtracking", "cancellation-stability", "stationary-classification"] as const;
export type OptimizationDiagnosticModel = typeof optimizationDiagnosticModels[number];
export const isOptimizationDiagnosticModel = (model: string): model is OptimizationDiagnosticModel => (optimizationDiagnosticModels as readonly string[]).includes(model);
type Point = [number, number];
const fmt = (x: number) => Number(x.toFixed(6));
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const curve = (lo: number, hi: number, fn: (x: number) => number): Point[] => Array.from({ length: 161 }, (_, i) => { const x = lo + (hi - lo) * i / 160; return [x, fn(x)]; });

export function calculateOptimizationDiagnostic(model: OptimizationDiagnosticModel, input: number): CalculationResult {
  const bounds: Record<OptimizationDiagnosticModel, Point> = { "armijo-backtracking": [.1, 2], "cancellation-stability": [0, 18], "stationary-classification": [0, 2] };
  if (!Number.isFinite(input) || input < bounds[model][0] || input > bounds[model][1] || (model !== "armijo-backtracking" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "lines", series: [], xDomain: [0, 1], yDomain: [0, 1], xLabel: "", yLabel: "", summary: "", values: [] };
  if (model === "armijo-backtracking") {
    const phi = (a: number) => 2 * (1 - 4 * a) ** 2, bound = (a: number) => 2 - 1.6 * a;
    const passes = (a: number) => phi(a) - bound(a) <= 32 * Number.EPSILON * Math.max(1, Math.abs(phi(a)), Math.abs(bound(a)));
    const trials: number[] = [input];
    while (!passes(trials.at(-1)!)) trials.push(trials.at(-1)! / 2);
    const accepted = trials.at(-1)!, next = 1 - 4 * accepted, end = Math.max(.55, input);
    return { ...base, xDomain: [0, end], yDomain: [Math.min(-.2, bound(end) - .2), Math.max(3, phi(end)) * 1.06], xLabel: "Step length α", yLabel: "Objective / acceptance bound", selectedX: accepted,
      series: [{ label: "Actual objective along the direction", points: curve(0, end, phi) }, { label: "Armijo upper bound (c₁=0.1)", points: [[0, 2], [end, bound(end)]] }, { label: "Trials actually evaluated", style: "points", points: trials.map(a => [a, phi(a)]) }],
      markers: [{ label: "First acceptable trial", point: [accepted, phi(accepted)], hollow: true }],
      matrices: [{ label: "Trial order: pass means objective ≤ bound (roundoff tolerance)", rowLabels: trials.map((_, i) => `trial ${i + 1}`), columnLabels: ["α", "f", "bound", "pass 1/0"], entries: trials.map(a => [a, phi(a), bound(a), Number(passes(a))]) }],
      summary: `Starting at α₀=${fmt(input)}, the evaluated sequence is ${trials.map(fmt).join(" → ")}. After ${trials.length - 1} halvings, α=${fmt(accepted)} passes: ${fmt(phi(accepted))} ≤ ${fmt(bound(accepted))}. The updated parameter is x=${fmt(next)}. Exact line minimization would choose α=0.25; backtracking only asks for sufficient decrease and can accept a different value. The plot rescales to include rejected trials.`,
      values: [value("Starting objective", 2), value("Directional derivative ∇f·p", -16), value("Initial trial α₀", input), value("Accepted step α", accepted), value("Trial objective evaluations", trials.length), value("Halvings", trials.length - 1), value("Updated parameter", next), value("Accepted objective", phi(accepted)), value("Armijo upper bound at accepted step", bound(accepted)), value("Exact line minimizer α", .25), value("Largest Armijo-acceptable positive step", .45)] };
  }
  if (model === "cancellation-stability") {
    const direct = (k: number) => (Math.sqrt(1 + 10 ** -k) - 1) / (10 ** -k);
    const stable = (k: number) => 1 / (Math.sqrt(1 + 10 ** -k) + 1);
    const x = 10 ** -input, naiveRatio = direct(input), stableRatio = stable(input), s = Math.sqrt(1 + x), condition = (s + 1) / (2 * s);
    return { ...base, xDomain: [0, 18], yDomain: [0, .65], xTicks: [0, 6, 12, 18], xLabel: "Decimal exponent k in x=10⁻ᵏ", yLabel: "Computed result divided by x", selectedX: input, controlValue: `k=${input} · x=1e−${input}`,
      series: [{ label: "Direct subtraction: (√(1+x)−1)/x", points: Array.from({ length: 19 }, (_, k) => [k, direct(k)]) }, { label: "Rationalized: 1/(√(1+x)+1)", points: Array.from({ length: 19 }, (_, k) => [k, stable(k)]) }, { label: "Limiting ratio as x→0: 0.5", points: [[0, .5], [18, .5]] }],
      summary: `At x=10⁻${input}, direct subtraction gives a scaled result ${fmt(naiveRatio)}, while the rationalized evaluation gives ${fmt(stableRatio)}. Their relative discrepancy is ${(Math.abs(naiveRatio - stableRatio) / stableRatio).toExponential(3)}. ${naiveRatio === 0 ? "Rounding has erased the small difference completely; the input x is still representable." : "Inspect the full values below; rounded display text can hide smaller discrepancies."} The problem's relative condition number is ${fmt(condition)}, near 1 for small positive x. This is an evaluation problem, not severe intrinsic sensitivity.`,
      values: [value("Input x", x), value("Direct result √(1+x)−1", naiveRatio * x), value("Rationalized result x/(√(1+x)+1)", x / (s + 1)), value("Direct scaled result", naiveRatio), value("Rationalized scaled result", stableRatio), value("Relative discrepancy between evaluations", Math.abs(naiveRatio - stableRatio) / stableRatio), value("Relative condition number |x f′/f|", condition), value("Binary64 spacing above 1", Number.EPSILON)] };
  }
  const positions = [-1, 0, 2], names = ["strict local, not global minimum", "saddle point", "unique global minimum"], x0 = positions[input];
  const f = (x: number) => x ** 4 / 4 - x ** 3 / 3 - x * x, curvature = (x: number) => 3 * x * x - 2 * x - 2;
  const horizontal = curve(-.6, .6, t => f(x0 + t) - f(x0)), vertical = curve(-.6, .6, t => t * t);
  return { ...base, xDomain: [-.6, .6], yDomain: [-.5, 1.5], xLabel: "Displacement t from selected point", yLabel: "Objective change ΔF", controlValue: `(${x0}, 0) · ${names[input]}`,
    series: [{ label: "Move in x: F(x₀+t,0)−F(x₀,0)", points: horizontal }, { label: "Move in y: F(x₀,t)−F(x₀,0)", points: vertical }], markers: [{ label: "Selected stationary point", point: [0, 0] }],
    matrices: [{ label: "All stationary points; Hessian is diagonal", rowLabels: ["local (−1,0)", "saddle (0,0)", "global (2,0)"], columnLabels: ["F", "Hxx", "Hyy"], entries: positions.map(x => [f(x), curvature(x), 2]) }],
    summary: `At (${x0},0), the gradient is zero and Hessian eigenvalues are (${curvature(x0)},2). This point is a ${names[input]}. ${input === 1 ? "Moving along x decreases F nearby, while moving along y increases it: one rising slice cannot certify a minimum." : "Both displayed directions rise nearby. Positive-definite curvature certifies a strict local minimum; comparing all candidates and behavior at infinity establishes the global result here."} Values at (−1,0) and (2,0) are −5/12 and −8/3, respectively. The global gap of the selected point is ${fmt(f(x0) + 8 / 3)}.`,
    values: [value("Selected x coordinate", x0), value("Selected objective", f(x0)), value("Gradient norm at selected point", 0), value("Hessian x eigenvalue", curvature(x0)), value("Hessian y eigenvalue", 2), value("Global minimum value", -8 / 3), value("Gap to global minimum", f(x0) + 8 / 3), value("Change for x displacement +0.1", f(x0 + .1) - f(x0)), value("Change for y displacement +0.1", .01)] };
}
