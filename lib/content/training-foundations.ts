import type { CalculationResult } from "./calculations.ts";

export const trainingModels = ["train-loss", "train-parameters", "train-sgd", "train-batch", "train-adaptive", "train-penalty", "calc-partial", "calc-gradient"] as const;
export type TrainingModel = typeof trainingModels[number];
export const isTrainingModel = (model: string): model is TrainingModel => (trainingModels as readonly string[]).includes(model);
type Point = [number, number];
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const format = (n: number) => n !== 0 && Math.abs(n) < 0.0001 ? n.toExponential(3) : Number(n.toFixed(6));
const curve = (lo: number, hi: number, f: (x: number) => number): Point[] => Array.from({ length: 161 }, (_, i) => { const x = lo + (hi - lo) * i / 160; return [x, f(x)]; });
const mean = (items: number[]) => items.reduce((sum, x) => sum + x, 0) / items.length;
const targets = [-1, 1, 3, 5];
// One disclosed, fixed sequence of indices: changing η never redraws examples.
const sampleIndices = [3, 0, 2, 1, 1, 3, 2, 0, 3, 3, 1, 2, 0, 2, 1, 0, 3, 1, 2, 2, 0, 3, 0, 1, 3, 2, 1, 1, 0, 2];

export function calculateTraining(model: TrainingModel, input: number): CalculationResult {
  const bounds: Record<TrainingModel, [number, number]> = { "train-loss": [-2, 6], "train-parameters": [-1, 4], "train-sgd": [0.05, 0.9], "train-batch": [1, 4], "train-adaptive": [0.5, 0.99], "train-penalty": [0, 5], "calc-partial": [-2, 2], "calc-gradient": [0, 360] };
  const [lo, hi] = bounds[model];
  if (!Number.isFinite(input) || input < lo || input > hi || (model === "train-batch" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "lines", series: [], xDomain: [0, 1], yDomain: [0, 1], xLabel: "", yLabel: "", summary: "", values: [] };
  if (model === "train-loss") {
    const observations = [-1, 0, 1, 5];
    const squared = (c: number) => mean(observations.map(y => (c - y) ** 2 / 2));
    const absolute = (c: number) => mean(observations.map(y => Math.abs(c - y)));
    const huber = (c: number) => mean(observations.map(y => { const r = Math.abs(c - y); return r <= 1 ? r * r / 2 : r - 0.5; }));
    return { ...base, xDomain: [-2, 6], yDomain: [0, 15], xLabel: "Constant prediction c", yLabel: "Mean loss (dimensionless)", selectedX: input, series: [{ label: "Half squared error", points: curve(-2, 6, squared) }, { label: "Absolute error", points: curve(-2, 6, absolute) }, { label: "Huber, δ=1", points: curve(-2, 6, huber) }], summary: `At prediction c=${input}, half squared loss=${format(squared(input))}, absolute loss=${format(absolute(input))}, and Huber loss=${format(huber(input))}. Their minimizers differ: mean 1.25, any median in [0,1], and Huber solution 0.5. Compare where each curve is minimized, not raw heights across different criteria.`, values: [value("Prediction c", input), value("Mean half squared error", squared(input)), value("Mean absolute error", absolute(input)), value("Mean Huber loss", huber(input)), value("Squared-loss minimizer", 1.25), value("MAE minimizer interval: lower", 0), value("MAE minimizer interval: upper", 1), value("Huber minimizer", 0.5), ...observations.map((y, i) => value(`Residual for observation ${i + 1} (y=${y})`, input - y))] };
  }
  if (model === "train-parameters") {
    const w = input, observations: Point[] = [[-1, -1], [0, 1], [1, 3]], mse = 2 * (w - 2) ** 2 / 3;
    return { ...base, xDomain: [-2, 2], yDomain: [-8, 10], xLabel: "Input feature x", yLabel: "Prediction / observed y", series: [{ label: "Adjustable model y=wx+1", points: [[-2, 1 - 2 * w], [2, 1 + 2 * w]] }, { label: "Exact fit y=2x+1", points: [[-2, -3], [2, 5]] }], markers: observations.map((point, i) => ({ label: `Observed example ${i + 1}`, point })), summary: `Only slope w is adjustable here; intercept b=1 and the three observations are fixed. At w=${w}, mean squared error=${format(mse)}. The optimum w=2 fits all three points. The slider changes a model parameter, not the input features or labels.`, values: [value("Trainable slope w", w), value("Frozen intercept b", 1), value("Mean squared error", mse), value("Gradient d(MSE)/dw", 4 * (w - 2) / 3), ...observations.map(([x, y]) => value(`Residual at x=${x}`, w * x + 1 - y))] };
  }
  if (model === "train-sgd") {
    const eta = input, points: Point[] = [[0, 0]];
    for (let t = 0; t < sampleIndices.length; t++) points.push([t + 1, (1 - eta) * points[t][1] + eta * targets[sampleIndices[t]]]);
    const moments = Array.from({ length: 31 }, (_, t) => ({ t, expectation: 2 * (1 - (1 - eta) ** t), variance: 5 * eta / (2 - eta) * (1 - (1 - eta) ** (2 * t)) }));
    return { ...base, xDomain: [0, 30], yDomain: [-2, 6], xLabel: "Optimizer update t", yLabel: "Parameter θ", series: [{ label: "One fixed sample-index sequence", points }, { label: "Exact mean under IID uniform sampling", points: moments.map(m => [m.t, m.expectation]) }, { label: "Mean + one standard deviation", points: moments.map(m => [m.t, m.expectation + Math.sqrt(m.variance)]) }, { label: "Mean − one standard deviation", points: moments.map(m => [m.t, m.expectation - Math.sqrt(m.variance)]) }], summary: `η=${eta}: this path ends at θ=${format(points[30][1])}; the ensemble mean is ${format(moments[30].expectation)} and variance ${format(moments[30].variance)}. A constant rate leaves limiting variance ${format(5 * eta / (2 - eta))}, even when the mean approaches the optimum 2. The ±1 SD curves are not confidence bounds or a claimed coverage interval.`, values: [value("Learning rate", eta), value("Full-data optimum", 2), value("Path final parameter", points[30][1]), value("Ensemble final mean", moments[30].expectation), value("Ensemble final variance", moments[30].variance), value("Limiting variance", 5 * eta / (2 - eta)), ...sampleIndices.map((index, t) => value(`Target used at update ${t + 1}`, targets[index]))] };
  }
  if (model === "train-batch") {
    const b = input, gradients = [-3, -1, 1, 3], batchMeans: number[] = [];
    for (let mask = 1; mask < 16; mask++) {
      const members = gradients.filter((_, i) => (mask & (1 << i)) !== 0);
      if (members.length === b) batchMeans.push(mean(members));
    }
    const mass = new Map<number, number>();
    for (const g of batchMeans) mass.set(g, (mass.get(g) || 0) + 1 / batchMeans.length);
    const points = [...mass].sort(([a], [b]) => a - b) as Point[];
    const variance = 5 / b * (4 - b) / 3;
    return { ...base, kind: "bars", xDomain: [-3.7, 3.7], yDomain: [0, 1.05], xLabel: "Average batch gradient", yLabel: "Probability over subsets", series: [{ label: `Exact distribution: all ${batchMeans.length} size-${b} subsets`, points }], selectedX: 0, summary: `Average ${b} distinct gradients from {−3,−1,1,3}. The batch estimate has mean 0 and variance ${format(variance)}, compared with ${format(5 / b)} for IID sampling with replacement. ${b === 4 ? "The full batch has no sampling noise: all mass is at zero." : "Every size-B subset has equal probability; repeated mean values combine their mass."}`, values: [value("Batch size B", b), value("Equally likely subsets", batchMeans.length), value("Expected batch gradient", 0), value("Without-replacement variance", variance), value("With-replacement variance", 5 / b), ...points.map(([g, p]) => value(`P(batch mean = ${format(g)})`, p))] };
  }
  if (model === "train-adaptive") {
    const beta2 = input, gradients = [1, 1, 1, 1, -1, -1, -1, -1, 0, 0, 0, 0];
    let m = 0, second = 0;
    const adam: Point[] = [], rmsprop: Point[] = [], plain: Point[] = [];
    const rows = gradients.map((g, i) => {
      const t = i + 1;
      m = 0.9 * m + 0.1 * g;
      second = beta2 * second + (1 - beta2) * g * g;
      const correctedM = m / (1 - 0.9 ** t), correctedV = second / (1 - beta2 ** t);
      const a = -0.1 * correctedM / (Math.sqrt(correctedV) + 1e-8), r = -0.1 * g / (Math.sqrt(second) + 1e-8);
      adam.push([t, a]); rmsprop.push([t, r]); plain.push([t, -0.1 * g]);
      return [value(`Input gradient at t=${t}`, g), value(`Adam Δθ at t=${t}`, a), value(`RMSProp Δθ at t=${t}`, r)];
    }).flat();
    const extent = Math.max(0.12, ...adam.map(([, d]) => Math.abs(d)), ...rmsprop.map(([, d]) => Math.abs(d))) * 1.15;
    return { ...base, xDomain: [1, 12], yDomain: [-extent, extent], xLabel: "Gradient-stream step t", yLabel: "Signed parameter update Δθ", series: [{ label: "Adam, β₁=0.9 with bias correction", points: adam }, { label: "Uncentered RMSProp, no momentum", points: rmsprop }, { label: "Plain SGD, same rate 0.1", points: plain }], summary: `Squared-gradient decay=${beta2}. First updates: Adam ${format(adam[0][1])}, RMSProp ${format(rmsprop[0][1])}. At t=5 the gradient flips to −1, but Adam's update is ${format(adam[4][1])} because its first moment retains history. At t=9 the gradient is zero: RMSProp stops, while Adam can keep moving. The vertical scale follows the largest update.`, values: [value("Squared-gradient decay", beta2), value("Global rate η", 0.1), value("Epsilon outside square root", 1e-8), ...rows] };
  }
  if (model === "train-penalty") {
    const ridge = (lambda: number) => 3 / (1 + lambda), lasso = (lambda: number) => Math.max(0, 3 - lambda);
    return { ...base, xDomain: [0, 5], yDomain: [0, 3.3], xLabel: "Penalty strength λ", yLabel: "Optimal coefficient w*", selectedX: input, series: [{ label: "L2: smooth shrinkage", points: curve(0, 5, ridge) }, { label: "L1: soft threshold at λ=3", points: curve(0, 5, lasso) }], summary: `At λ=${input}, the L2 solution is ${format(ridge(input))}; the L1 solution is ${format(lasso(input))}. L1 reaches exactly zero once λ≥3. L2 stays positive for every finite λ. These are exact scalar optima, not the outputs of a finite optimizer run.`, values: [value("Penalty strength", input), value("Unpenalized optimum", 3), value("L2 optimum", ridge(input)), value("L1 optimum", lasso(input)), value("L2 solution: unpenalized data loss", (ridge(input) - 3) ** 2 / 2), value("L1 solution: unpenalized data loss", (lasso(input) - 3) ** 2 / 2)] };
  }
  if (model === "calc-partial") {
    const a = input, slice = (x: number) => x * x + Math.sin(1), tangent = (x: number) => slice(a) + 2 * a * (x - a);
    return { ...base, xDomain: [-2.5, 2.5], yDomain: [0, 7.5], xLabel: "x, while y is fixed at 1", yLabel: "f(x,1)=x²+sin(1)", selectedX: a, series: [{ label: "Slice through the surface", points: curve(-2.5, 2.5, slice) }, { label: "Local tangent at selected x", points: [[a - 0.5, tangent(a - 0.5)], [a + 0.5, tangent(a + 0.5)]] }], markers: [{ label: "Point on the slice", point: [a, slice(a)] }], summary: `At (x,y)=(${a},1), f=${format(slice(a))}, ∂f/∂x=${format(2 * a)}, and ∂f/∂y=${format(a * a + Math.cos(1))}. The plotted tangent varies x only. Moving both inputs requires the chain rule; it is not described by ∂f/∂x alone.`, values: [value("Selected x", a), value("Held-fixed y", 1), value("Function value", slice(a)), value("Partial with respect to x", 2 * a), value("Partial with respect to y", a * a + Math.cos(1)), value("Exact change for Δx=0.1 at fixed y", 0.2 * a + 0.01), value("Linear prediction for Δx=0.1", 0.2 * a)] };
  }
  const radians = input * Math.PI / 180, ux = Math.cos(radians), uy = Math.sin(radians), dot = 2 * ux + 4 * uy;
  return { ...base, equalAspect: true, xDomain: [-4.6, 4.6], yDomain: [-4.6, 4.6], xLabel: "First vector component", yLabel: "Second vector component", series: [{ label: "Gradient g=(2,4)", points: [[0, 0], [2, 4]] }, { label: "Unit direction u", points: [[0, 0], [ux, uy]] }, { label: "Projection (g·u)u", points: [[0, 0], [dot * ux, dot * uy]] }], summary: `At angle ${input}°, directional derivative g·u=${format(dot)}. ${Math.abs(dot) < 1e-10 ? "This direction is tangent to the level set to first order." : dot > 0 ? "An infinitesimal step along u increases f." : "An infinitesimal step along u decreases f."} The largest possible unit-direction increase is ‖g‖=√20≈4.472136, reached when u aligns with the gradient.`, values: [value("Direction angle", input, "degrees"), value("u₁", ux), value("u₂", uy), value("Gradient first component", 2), value("Gradient second component", 4), value("Directional derivative", dot), value("Gradient norm", Math.sqrt(20)), value("Steepest-ascent angle", Math.atan2(4, 2) * 180 / Math.PI, "degrees")] };
}
