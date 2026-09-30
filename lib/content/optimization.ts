import type { CalculationResult } from "./calculations.ts";

export const optimizationModels = ["opt-descent", "opt-momentum", "opt-schedule", "opt-convex", "opt-constraint", "opt-newton"] as const;
export type OptimizationModel = typeof optimizationModels[number];
export const isOptimizationModel = (model: string): model is OptimizationModel => (optimizationModels as readonly string[]).includes(model);
type Point = [number, number];
const v = (label: string, value: number, unit = "") => ({ label, value, unit });
const fmt = (n: number) => n !== 0 && Math.abs(n) < 0.0001 ? n.toExponential(3) : Number(n.toFixed(6));
const curve = (lo: number, hi: number, fn: (x: number) => number): Point[] => Array.from({ length: 161 }, (_, i) => { const x = lo + (hi - lo) * i / 160; return [x, fn(x)]; });
const trajectory = (initial: number, count: number, step: (x: number, t: number) => number): Point[] => {
  const points: Point[] = [[0, initial]];
  for (let t = 0; t < count; t++) points.push([t + 1, step(points[t][1], t)]);
  return points;
};

export function calculateOptimization(model: OptimizationModel, input: number): CalculationResult {
  const bounds: Record<OptimizationModel, [number, number]> = { "opt-descent": [0, 0.6], "opt-momentum": [0, 0.95], "opt-schedule": [0, 10], "opt-convex": [-2, 2], "opt-constraint": [-1, 4], "opt-newton": [0.2, 2.5] };
  const [lo, hi] = bounds[model];
  if (!Number.isFinite(input) || input < lo || input > hi || (model === "opt-schedule" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "lines", series: [], xDomain: [0, 30], yDomain: [-1.2, 1.2], xLabel: "Update number t", yLabel: "Parameter x", summary: "", values: [] };
  if (model === "opt-descent") {
    const multiplier = 1 - 4 * input, points = trajectory(1, 12, x => multiplier * x), end = points[12][1];
    const extent = Math.max(1, ...points.map(([, x]) => Math.abs(x))) * 1.1;
    const behavior = input === 0 ? "No updates: the iterate stays at 1." : Math.abs(multiplier) < 1 ? "The error contracts toward zero." : Math.abs(multiplier) === 1 ? "The iterate oscillates without shrinking." : "The error grows: this step size is unstable.";
    return { ...base, xDomain: [0, 12], yDomain: [-extent, extent], series: [{ label: "Gradient-descent iterates", points }, { label: "Minimizer x*=0", points: [[0, 0], [12, 0]] }], summary: `Each update multiplies x by ${fmt(multiplier)}. ${behavior} After 12 updates x=${fmt(end)}, with loss ${fmt(2 * end * end)}. The vertical scale expands to include unstable iterates.`, values: [v("Step size η", input), v("Error multiplier 1−4η", multiplier), v("Final parameter x₁₂", end), v("Initial loss", 2), v("Final loss", 2 * end * end)] };
  }
  if (model === "opt-momentum") {
    let velocity = 0;
    const momentum = trajectory(1, 30, x => { velocity = input * velocity + x; return x - 0.1 * velocity; });
    const plain = trajectory(1, 30, x => 0.9 * x), end = momentum[30][1];
    return { ...base, series: [{ label: `Heavy-ball momentum β=${input}`, points: momentum }, { label: "Gradient descent, same η=0.1", points: plain }], summary: `At β=${input}, momentum ends at x=${fmt(end)} versus ${fmt(plain[30][1])} for plain descent. ${momentum.some(([, x]) => x < 0) ? "Momentum crosses the optimum; stored velocity can keep moving after the gradient changes sign." : "No crossing occurs within these 30 updates."} Compare absolute error, not which curve sits lower.`, values: [v("Momentum β", input), v("Momentum final absolute error", Math.abs(end)), v("Plain final absolute error", Math.abs(plain[30][1])), v("Momentum final loss", end * end / 2), v("Final velocity", velocity), ...momentum.map(([t, x]) => v(`Momentum x at update ${t}`, x))] };
  }
  if (model === "opt-schedule") {
    const warmup = input, cosine = (t: number) => 0.15 * (1 + Math.cos(Math.PI * t / 40));
    const scheduled = (t: number) => warmup > 0 && t < warmup ? 0.3 * (t + 1) / warmup : 0.15 * (1 + Math.cos(Math.PI * (t - warmup) / (40 - warmup)));
    const rates = Array.from({ length: 41 }, (_, t) => [t, scheduled(t)] as Point);
    const rateRows = rates.filter(([t]) => ![0, 20, 40].includes(t)).map(([t, rate]) => v(`Rate at t=${t}`, rate));
    const end = trajectory(1, 40, (x, t) => x * (1 - 4 * scheduled(t)))[40][1];
    return { ...base, xDomain: [0, 40], yDomain: [0, 0.33], yLabel: "Learning rate ηₜ", selectedX: warmup, series: [{ label: "Linear warmup → cosine decay", points: rates }, { label: "Cosine decay without warmup", points: Array.from({ length: 41 }, (_, t) => [t, cosine(t)] as Point) }, { label: "Constant rate 0.3", points: [[0, 0.3], [40, 0.3]] }], summary: `${warmup} warmup updates; first rate ${fmt(scheduled(0))}, peak 0.3, endpoint zero at t=40. The vertical marker is the decay boundary. Applying rates t=0…39 to f(x)=2x² from x=1 gives final |x|=${Math.abs(end).toExponential(3)}. This deterministic bowl does not establish that warmup improves neural-network training.`, values: [v("Warmup updates", warmup), v("First applied rate", scheduled(0)), v("Rate at t=20", scheduled(20)), v("Endpoint rate at t=40 (not applied)", scheduled(40)), v("Final absolute error on quadratic", Math.abs(end)), ...rateRows] };
  }
  if (model === "opt-convex") {
    const a = input, objective = (x: number) => x ** 4 / 4 + a * x * x / 2, well = Math.sqrt(Math.max(0, -a));
    return { ...base, xDomain: [-1.8, 1.8], yDomain: [Math.min(0, objective(well)) - 0.15, Math.max(0, objective(1.8)) + 0.15], xLabel: "Parameter x", yLabel: "Objective fₐ(x)", series: [{ label: "Quartic objective", points: curve(-1.8, 1.8, objective) }, { label: "Chord between x=−1 and x=1", points: [[-1, objective(1)], [1, objective(1)]] }], markers: a < 0 ? [{ label: "Left global minimum", point: [-well, objective(well)] }, { label: "Right global minimum", point: [well, objective(well)] }] : [{ label: "Unique global minimum", point: [0, 0] }], summary: a < 0 ? `a=${a}: curvature at zero is negative. Two global minima occur at x=±${fmt(well)}, with value ${fmt(-a * a / 4)}; zero is a stationary local maximum. ${a < -0.5 ? "The displayed chord lies below f(0), explicitly violating convexity." : "This wide chord alone does not reveal the violation; negative curvature near zero does."}` : `a=${a}: f″(x)=3x²+a is nonnegative everywhere, so the function is convex. The unique minimum is x=0. ${a === 0 ? "It is strictly convex but not globally strongly convex: curvature reaches zero." : `It is strongly convex with lower curvature bound ${a}.`}`, values: [v("Curvature at zero", a), v("Objective at zero", 0), v("Chord height at zero", objective(1)), v("Nonnegative minimizer", well), v("Global minimum value", a < 0 ? -a * a / 4 : 0)] };
  }
  if (model === "opt-constraint") {
    const cap = input, optimum = Math.min(3, cap), objective = (x: number) => (x - 3) ** 2 / 2, multiplier = Math.max(0, 3 - cap);
    return { ...base, xDomain: [-2, 5], yDomain: [0, 14], xLabel: "Decision x (feasible if x ≤ b)", yLabel: "Objective ½(x−3)²", selectedX: cap, series: [{ label: "Objective on the full line", points: curve(-2, 5, objective) }, { label: "Feasible part, x≤b", points: curve(-2, cap, objective) }], markers: [{ label: "Constrained minimizer", point: [optimum, objective(optimum)] }], summary: `With upper bound b=${cap}, x*=${optimum} and optimal loss=${fmt(objective(optimum))}. Multiplier λ=${fmt(multiplier)} balances gradient x*−3=${fmt(optimum - 3)}. ${cap < 3 ? "The bound is active: a negative gradient does not imply an available feasible improvement." : cap === 3 ? "The bound is active but its multiplier is zero." : "The bound is slack; the unconstrained minimizer is feasible."}`, values: [v("Upper bound b", cap), v("Constrained minimizer", optimum), v("Optimal loss", objective(optimum)), v("Objective gradient at optimum", optimum - 3), v("Constraint multiplier λ", multiplier), v("Slack b−x*", cap - optimum), v("Complementarity λ(x*−b)", multiplier * (optimum - cap))] };
  }
  const objective = (x: number) => x ** 4 / 4 + x * x / 2;
  // Algebraically identical Newton update avoids cancellation near the minimum.
  const newton = trajectory(input, 8, x => 2 * x ** 3 / (3 * x * x + 1));
  const descent = trajectory(input, 8, x => x - 0.1 * (x ** 3 + x));
  return { ...base, xDomain: [0, 8], yDomain: [0, 2.75], series: [{ label: "Newton with full steps", points: newton }, { label: "Gradient descent, η=0.1", points: descent }], summary: `From x₀=${input}, Newton's first iterate is ${fmt(newton[1][1])}. After eight updates, |x|=${Math.abs(newton[8][1]).toExponential(3)} versus ${fmt(descent[8][1])} for gradient descent. Curvature is positive in this example; an indefinite Hessian in another problem needs safeguards.`, values: [v("Initial parameter", input), v("Initial gradient", input ** 3 + input), v("Initial curvature", 3 * input * input + 1), v("First Newton iterate", newton[1][1]), v("Newton final objective", objective(newton[8][1])), v("Gradient descent final objective", objective(descent[8][1])), ...newton.map(([t, x]) => v(`Newton x at update ${t}`, x))] };
}
