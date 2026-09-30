import type { CalculationResult } from "./calculations.ts";

export const calculusModels = ["calc-limit", "calc-rules", "calc-direction", "calc-taylor", "calc-autodiff", "calc-modes"] as const;
export type CalculusModel = typeof calculusModels[number];
export const isCalculusModel = (model: string): model is CalculusModel => (calculusModels as readonly string[]).includes(model);
type Point = [number, number];
type Dual = { primal: number; tangent: number };
const multiply = (a: Dual, b: Dual): Dual => ({ primal: a.primal * b.primal, tangent: a.tangent * b.primal + a.primal * b.tangent });
const sine = (a: Dual): Dual => ({ primal: Math.sin(a.primal), tangent: Math.cos(a.primal) * a.tangent });
const add = (a: Dual, b: Dual): Dual => ({ primal: a.primal + b.primal, tangent: a.tangent + b.tangent });
const trace = (input: number) => {
  const x = { primal: input, tangent: 1 }, square = multiply(x, x), wave = sine(square), cube = multiply(square, x), total = add(wave, cube);
  return { x, square, wave, cube, total };
};
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const fmt = (n: number) => n !== 0 && Math.abs(n) < 0.0001 ? n.toExponential(3) : Number(n.toFixed(6));
const curve = (lo: number, hi: number, fn: (x: number) => number): Point[] => Array.from({ length: 161 }, (_, i) => { const x = lo + (hi - lo) * i / 160; return [x, fn(x)]; });
const factorial = (n: number) => { let product = 1; for (let k = 2; k <= n; k++) product *= k; return product; };

export function calculateCalculus(model: CalculusModel, input: number): CalculationResult {
  const bounds: Record<CalculusModel, [number, number]> = { "calc-limit": [-1, 5], "calc-rules": [-1, 2], "calc-direction": [0, 180], "calc-taylor": [0, 4], "calc-autodiff": [-2, 2], "calc-modes": [0, 360] };
  const [lo, hi] = bounds[model];
  if (!Number.isFinite(input) || input < lo || input > hi || (model === "calc-taylor" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "lines", series: [], xDomain: [-2, 2], yDomain: [-1, 5], xLabel: "Input x", yLabel: "Function value", summary: "", values: [] };
  if (model === "calc-limit") {
    return { ...base, xDomain: [-1, 3], yDomain: [-1.5, 5.5], series: [{ label: "g(x)=x+1 away from x=1", points: [[-1, 0], [3, 4]] }], markers: [...(input === 2 ? [] : [{ label: "Excluded value on the line (limit)", point: [1, 2] as Point, hollow: true }]), { label: "Assigned function value g(1)", point: [1, input] }], summary: `Both one-sided limits at x=1 equal 2, while g(1)=${input}. ${input === 2 ? "The point fills the hole: g is continuous at 1." : "The assigned value differs from the limit: g has a removable discontinuity at 1."} Changing one point does not change the neighboring values or their limit.`, values: [value("Assigned g(1)", input), value("Left-hand limit at 1", 2), value("Right-hand limit at 1", 2), value("Distance from assigned value to limit", Math.abs(input - 2)), value("g(0.99)", 1.99), value("g(1.01)", 2.01)] };
  }
  if (model === "calc-rules") {
    const a = (x: number) => 2 * x / (x + 2), b = (x: number) => -(x * x + 1) / (x + 2) ** 2;
    return { ...base, xDomain: [-1, 2], yDomain: [-4.4, 1.2], yLabel: "Contribution to derivative", selectedX: input, series: [{ label: "Numerator contribution u′/v", points: curve(-1, 2, a) }, { label: "Denominator contribution −uv′/v²", points: curve(-1, 2, b) }, { label: "Total derivative of u/v", points: curve(-1, 2, x => a(x) + b(x)) }], summary: `For r(x)=(x²+1)/(x+2) at x=${input}, numerator change contributes ${fmt(a(input))} and denominator change contributes ${fmt(b(input))}. Their sum r′(x)=${fmt(a(input) + b(input))}. Dropping either contribution differentiates a different expression.`, values: [value("Numerator u", input * input + 1), value("Denominator v", input + 2), value("Numerator derivative u′", 2 * input), value("Denominator derivative v′", 1), value("Numerator contribution", a(input)), value("Denominator contribution", b(input)), value("Total derivative", a(input) + b(input))] };
  }
  if (model === "calc-direction") {
    const raw = Math.cos(2 * input * Math.PI / 180), curvature = Math.abs(raw) < 1e-12 ? 0 : raw;
    return { ...base, xDomain: [-1, 1], yDomain: [-1.1, 1.1], xLabel: "Signed distance h along u", yLabel: "f(hu)−f(0)", series: [{ label: "Exact change h² cos(2θ)", points: curve(-1, 1, h => h * h * curvature) }, { label: "First-order prediction: zero", points: [[-1, 0], [1, 0]] }], summary: `At the saddle's origin, Dᵤf=0 for every direction. For θ=${input}°, the exact change is ${fmt(curvature)}h²: ${curvature > 0 ? "it rises on both sides along this line." : curvature < 0 ? "it falls on both sides along this line." : "this diagonal line stays at zero."} The second directional derivative is ${fmt(2 * curvature)}. Zero first-order slope does not certify a minimum.`, values: [value("Direction θ", input, "degrees"), value("Directional derivative at origin", 0), value("Second directional derivative", 2 * curvature), value("Change at h=0.1", 0.01 * curvature), value("Change at h=1", curvature)] };
  }
  if (model === "calc-taylor") {
    const n = input, polynomial = (x: number) => { let sum = 1, term = 1; for (let k = 1; k <= n; k++) { term *= x / k; sum += term; } return sum; };
    return { ...base, yDomain: [-1.5, 8], yLabel: "exp(x) and its approximation", series: [{ label: "True exp(x)", points: curve(-2, 2, Math.exp) }, { label: `Maclaurin polynomial, degree ${n}`, points: curve(-2, 2, polynomial) }], markers: [{ label: "True value at x=1", point: [1, Math.E] }, { label: "Approximation at x=1", point: [1, polynomial(1)] }], summary: `Degree ${n} gives Pₙ(1)=${fmt(polynomial(1))}, versus e=${fmt(Math.E)}; absolute error=${fmt(Math.abs(Math.E - polynomial(1)))}. On |x|≤2, Taylor's theorem gives the conservative bound e²·2ⁿ⁺¹/(n+1)! = ${fmt(Math.exp(2) * 2 ** (n + 1) / factorial(n + 1))}. A bound need not be close to the actual error.`, values: [value("Polynomial degree", n), value("Pₙ(1)", polynomial(1)), value("exp(1)", Math.E), value("Absolute error at x=1", Math.abs(Math.E - polynomial(1))), value("Absolute error at x=−2", Math.abs(Math.exp(-2) - polynomial(-2))), value("Absolute error at x=2", Math.abs(Math.exp(2) - polynomial(2))), value("Uniform bound on [−2,2]", Math.exp(2) * 2 ** (n + 1) / factorial(n + 1))] };
  }
  if (model === "calc-autodiff") {
    const state = trace(input), fn = (x: number) => Math.sin(x * x) + x ** 3, difference = (x: number) => (fn(x + 0.5) - fn(x - 0.5));
    return { ...base, yDomain: [-2, 17], yLabel: "Derivative estimate", selectedX: input, series: [{ label: "Forward-mode derivative, seed ẋ=1", points: curve(-2, 2, x => trace(x).total.tangent) }, { label: "Central difference with fixed h=0.5", points: curve(-2, 2, difference) }], summary: `At x=${input}, the program value is ${fmt(state.total.primal)} and its propagated derivative is ${fmt(state.total.tangent)}. The coarse central difference gives ${fmt(difference(input))}. The derivative is accumulated through multiply, sine and add rules—not estimated by perturbing x. Floating-point error still applies.`, matrices: [{ label: "Operation trace: values and propagated derivatives", rowLabels: ["x", "x²", "sin(x²)", "x³", "sum"], columnLabels: ["Value", "Derivative"], entries: Object.values(state).map(d => [d.primal, d.tangent]) }], values: Object.entries(state).flatMap(([name, d]) => [value(`${name}: value`, d.primal), value(`${name}: derivative`, d.tangent)]).concat([value("Central difference h=0.5", difference(input)), value("Absolute derivative discrepancy", Math.abs(state.total.tangent - difference(input)))]) };
  }
  const angle = input * Math.PI / 180, v1 = Math.cos(angle), v2 = Math.sin(angle), jvp = [2 * v1 + v2, v1 + v2, 2 * v1], w = [1, -1, 0.5], pullback = [2, 0];
  return { ...base, kind: "matrix", matrices: [{ label: "Jacobian J: output rows, input columns", entries: [[2, 1], [1, 1], [2, 0]] }, { label: "Forward seed v (input direction)", entries: [[v1], [v2]] }, { label: "Forward result Jv", entries: jvp.map(x => [x]) }, { label: "Reverse seed w (output weights)", entries: w.map(x => [x]) }, { label: "Reverse result Jᵀw", entries: pullback.map(x => [x]) }], summary: `Forward mode sends the input direction (${fmt(v1)},${fmt(v2)}) to output change (${jvp.map(fmt).join(", ")}). Reverse mode pulls fixed output weights (1,−1,0.5) back to input sensitivities (2,0). The consistency identity wᵀ(Jv) = (Jᵀw)ᵀv = ${fmt(2 * v1)} holds; the two products have different shapes.`, values: [value("Input seed angle", input, "degrees"), ...jvp.map((x, i) => value(`Jv output ${i + 1}`, x)), value("Jᵀw input 1", 2), value("Jᵀw input 2", 0), value("wᵀ(Jv)", jvp.reduce((sum, x, i) => sum + x * w[i], 0)), value("(Jᵀw)ᵀv", 2 * v1)] };
}
