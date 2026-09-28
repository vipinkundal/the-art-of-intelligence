import { isLinearModel, calculateLinear, type LinearModel } from "./linear-algebra.ts";
import { isDistributionModel, calculateDistribution, type DistributionModel } from "./distributions.ts";
import { isProbabilityModel, calculateProbability, type ProbabilityModel } from "./probability-foundations.ts";
import { binomialMass } from "./probability-math.ts";
import { isInferenceModel, calculateInference, type InferenceModel } from "./statistical-inference.ts";
export { binomialMass } from "./probability-math.ts";
export type CalculationModel = InferenceModel | ProbabilityModel | DistributionModel | LinearModel | "bernoulli" | "binomial" | "bayes" | "entropy" | "cross-entropy" | "kl" | "perplexity" | "brier" | "markov" | "early-stopping" | "eigen" | "conformal" | "conditional" | "confidence";
type Point = [number, number];
export type CalculationResult = {
  kind: "bars" | "lines" | "matrix" | "scatter";
  equalAspect?: boolean;
  matrices?: { label: string; entries: number[][] }[];
  series: { label: string; points: Point[] }[];
  xLabel: string; yLabel: string;
  xDomain: Point; yDomain: Point;
  selectedX?: number;
  shaded?: Point[];
  summary: string;
  values: { label: string; value: number; unit: string }[];
};

export const validationLosses = [0.90, 0.70, 0.55, 0.50, 0.51, 0.52, 0.49, 0.53, 0.54, 0.55];
export const calibrationResiduals = [0.2, 0.3, 0.4, 0.5, 0.7, 0.9, 1.1, 1.4, 2.0];
export const binaryEntropy = (p: number) => (p === 0 || p === 1) ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
export const binaryCrossEntropy = (p: number, q: number) => -(p === 0 ? 0 : p * Math.log2(q)) - (p === 1 ? 0 : (1 - p) * Math.log2(1 - q));
export const expectedBrier = (p: number, q: number) => (q - p) ** 2 + p * (1 - p);
export function markovDistribution(steps: number): Point {
  let a = 1, b = 0;
  for (let i = 0; i < steps; i++) [a, b] = [0.8 * a + 0.4 * b, 0.2 * a + 0.6 * b];
  return [a, b];
}
export function stoppingCheckpoint(patience: number) {
  let best = Infinity, bestEpoch = 0, wait = 0;
  for (let index = 0; index < validationLosses.length; index++) {
    const loss = validationLosses[index];
    if (loss < best) { best = loss; bestEpoch = index + 1; wait = 0; }
    else wait++;
    if (wait >= patience) return { stopped: true, epoch: index + 1, bestEpoch, best };
  }
  return { stopped: false, epoch: validationLosses.length, bestEpoch, best };
}
export function conformalRadius(residuals: number[], alpha: number) {
  if (!(alpha > 0 && alpha < 1) || !residuals.length || residuals.some((r) => !Number.isFinite(r) || r < 0)) throw new Error("Invalid conformal calibration input");
  const rank = Math.ceil((residuals.length + 1) * (1 - alpha) - 1e-12);
  return { rank, radius: rank > residuals.length ? Infinity : [...residuals].sort((a, b) => a - b)[rank - 1] };
}
const value = (label: string, amount: number, unit = "") => ({ label, value: amount, unit });
const f = (n: number) => n.toFixed(4);

export function calculate(model: CalculationModel, input: number): CalculationResult {
  if (isInferenceModel(model)) return calculateInference(model, input);
  if (isProbabilityModel(model)) return calculateProbability(model, input);
  if (isDistributionModel(model)) return calculateDistribution(model, input);
  if (isLinearModel(model)) return calculateLinear(model, input);
  if (!Number.isFinite(input)) throw new Error("The lab input must be finite");
  const probabilityModels = ["bernoulli", "binomial", "bayes", "entropy", "brier"];
  if (probabilityModels.includes(model) && (input < 0 || input > 1)) throw new Error("Probability must lie in [0,1]");
  if (["cross-entropy", "kl", "perplexity"].includes(model) && (input <= 0 || input >= 1)) throw new Error("Model probability must lie in (0,1)");
  if (model === "conditional") {
    if (!Number.isInteger(input) || input < 0 || input > 40) throw new Error("Intersection count must lie in [0,40]");
    const conditional = input / 50, reverse = input / 40;
    return { kind: "bars", series: [{ label: "Conditional probabilities", points: [[0, conditional], [1, reverse]] }], xLabel: "0: P(A|B) · 1: P(B|A)", yLabel: "Probability", xDomain: [-0.5, 1.5], yDomain: [0, 1],
      summary: `Among 50 B cases, ${input} are A: P(A|B)=${f(conditional)}. Among 40 A cases, ${input} are B: P(B|A)=${f(reverse)}.`,
      values: [value("A and B", input, "cases"), value("A and not B", 40 - input, "cases"), value("Not A and B", 50 - input, "cases"), value("Neither A nor B", 10 + input, "cases"), value("P(A|B)", conditional), value("P(B|A)", reverse)] };
  }
  if (model === "confidence") {
    if (!Number.isInteger(input) || input < 5 || input > 200) throw new Error("Sample size must be an integer in [5,200]");
    const halfWidth = (n: number) => 1.96 * 10 / Math.sqrt(n), radius = halfWidth(input);
    return { kind: "lines", series: [{ label: "95% interval half-width", points: Array.from({ length: 196 }, (_, i) => [i + 5, halfWidth(i + 5)]) }], xLabel: "Sample size n", yLabel: "Half-width (target units)", xDomain: [5, 200], yDomain: [0, 9], selectedX: input,
      summary: `For n=${input}, standard error is ${f(10 / Math.sqrt(input))}. Around observed mean 50, the interval is [${f(50 - radius)}, ${f(50 + radius)}]. The 95% level describes repeated-sampling coverage, not a posterior probability.`,
      values: [value("Standard error", 10 / Math.sqrt(input), "target units"), value("Half-width", radius, "target units"), value("Lower confidence limit", 50 - radius), value("Upper confidence limit", 50 + radius)] };
  }
  if (model === "bernoulli" || model === "binomial") {
    const n = model === "bernoulli" ? 1 : 10;
    const points = binomialMass(n, input);
    return { kind: "bars", series: [{ label: "Probability mass", points }], xLabel: n === 1 ? "Outcome (0 or 1)" : "Number of successes k", yLabel: "Probability", xDomain: [-0.5, n + 0.5], yDomain: [0, 1],
      summary: `The probabilities sum to ${f(points.reduce((sum, [, p]) => sum + p, 0))}. Mean ${f(n * input)}; variance ${f(n * input * (1 - input))}.`,
      values: [...points.map(([k, p]) => value(`P(${n === 1 ? "X" : "K"}=${k})`, p)), value("Mean", n * input, "successes"), value("Variance", n * input * (1 - input), "successes²")] };
  }
  if (model === "bayes") {
    const trueAlerts = 0.9 * input, falseAlerts = 0.1 * (1 - input), posterior = trueAlerts / (trueAlerts + falseAlerts);
    return { kind: "bars", series: [{ label: "Share of all requests", points: [[0, trueAlerts], [1, falseAlerts]] }], xLabel: "0: true alerts · 1: false alerts", yLabel: "Joint probability", xDomain: [-0.5, 1.5], yDomain: [0, 1],
      summary: `Among alerts, ${(100 * posterior).toFixed(2)}% are true alerts. The bars show shares of all requests before normalization.`,
      values: [value("True alerts per 1,000", 1000 * trueAlerts), value("False alerts per 1,000", 1000 * falseAlerts), value("P(H|+)", posterior), value("P(+)", trueAlerts + falseAlerts)] };
  }
  if (["entropy", "cross-entropy", "kl", "perplexity", "brier"].includes(model)) {
    const evaluate = (q: number) => model === "entropy" ? binaryEntropy(q) : model === "cross-entropy" ? binaryCrossEntropy(0.7, q) : model === "kl" ? binaryCrossEntropy(0.7, q) - binaryEntropy(0.7) : model === "perplexity" ? 2 ** binaryCrossEntropy(0.7, q) : expectedBrier(0.7, q);
    const bounded = ["cross-entropy", "kl", "perplexity"].includes(model);
    const lo = bounded ? 0.01 : 0, hi = bounded ? 0.99 : 1;
    const points: Point[] = Array.from({ length: 101 }, (_, i) => { const q = lo + (hi - lo) * i / 100; return [q, evaluate(q)]; });
    const unit = model === "perplexity" ? "effective outcomes" : model === "brier" ? "squared probability error" : "bits / outcome";
    return { kind: "lines", series: [{ label: model === "entropy" ? "Binary entropy" : `Expected ${model}`, points }], xLabel: model === "entropy" ? "Source probability p" : "Forecast probability q", yLabel: unit, xDomain: [lo, hi], yDomain: [0, Math.max(...points.map(([, y]) => y)) * 1.08], selectedX: input,
      summary: `At ${model === "entropy" ? "p" : "q"}=${f(input)}, ${model} is ${f(evaluate(input))} ${unit}. ${model === "entropy" ? "Both endpoint distributions are certain." : "The target event probability is fixed at 0.7."}`,
      values: [value(model, evaluate(input), unit), ...(model === "entropy" ? [] : [value("Target event probability p", 0.7)]), value("Selected probability", input)] };
  }
  if (model === "markov") {
    if (!Number.isInteger(input) || input < 0 || input > 20) throw new Error("Transition count must be an integer in [0,20]");
    const distributions = Array.from({ length: 21 }, (_, i) => markovDistribution(i));
    const [a, b] = distributions[input];
    return { kind: "lines", series: [0, 1].map((state) => ({ label: state === 0 ? "P(A)" : "P(B)", points: distributions.map((d, i) => [i, d[state]] as Point) })), xLabel: "Transitions t", yLabel: "State probability", xDomain: [0, 20], yDomain: [0, 1], selectedX: input,
      summary: `After ${input} transitions: P(A)=${f(a)}, P(B)=${f(b)}. Stationary probabilities for this matrix are 2/3 and 1/3.`,
      values: [value("P(A)", a), value("P(B)", b), value("Total mass", a + b)] };
  }
  if (model === "early-stopping") {
    if (!Number.isInteger(input) || input < 1 || input > 5) throw new Error("Patience must be an integer in [1,5]");
    const state = stoppingCheckpoint(input);
    return { kind: "lines", series: [{ label: "Observed validation loss", points: validationLosses.slice(0, state.epoch).map((loss, i) => [i + 1, loss]) }], xLabel: "Epoch (one validation check per epoch)", yLabel: "Validation loss", xDomain: [1, 10], yDomain: [0.4, 1], selectedX: state.bestEpoch,
      summary: `${state.stopped ? `Stop at epoch ${state.epoch}` : "Patience is not exhausted within the ten supplied epochs"}. Restore epoch ${state.bestEpoch}, loss ${state.best.toFixed(2)}. The vertical marker shows the restored checkpoint.`,
      values: [value("Patience", input, "checks"), value("Last observed epoch", state.epoch), value("Restored epoch", state.bestEpoch), value("Restored loss", state.best)] };
  }
  if (model === "eigen") {
    if (input < 0 || input > 180) throw new Error("Input direction must lie in [0,180] degrees");
    const angle = input * Math.PI / 180, x = Math.cos(angle), y = Math.sin(angle);
    const ax = 2 * x + y, ay = x + 2 * y, cross = x * ay - y * ax;
    return { kind: "lines", series: [{ label: "Input v", points: [[0, 0], [x, y]] }, { label: "Output Av", points: [[0, 0], [ax, ay]] }, { label: "Eigenvector line λ=3", points: [[-2.4, -2.4], [2.4, 2.4]] }, { label: "Eigenvector line λ=1", points: [[-2.4, 2.4], [2.4, -2.4]] }], xLabel: "First coordinate", yLabel: "Second coordinate", xDomain: [-3.2, 3.2], yDomain: [-3.2, 3.2],
      summary: `v=(${f(x)},${f(y)}), Av=(${f(ax)},${f(ay)}). ${Math.abs(cross) < 1e-9 ? "The vectors are parallel: this is an eigenvector direction." : "The vectors are not parallel: this is not an eigenvector direction."}`,
      values: [value("v₁", x), value("v₂", y), value("(Av)₁", ax), value("(Av)₂", ay), value("2D cross product (zero means parallel)", cross)] };
  }
  const { rank, radius } = conformalRadius(calibrationResiduals, input);
  return { kind: "bars", series: [{ label: "Sorted absolute calibration residuals", points: calibrationResiduals.map((r, i) => [i + 1, r]) }], xLabel: "Residual rank (one-based)", yLabel: "Absolute error (target units)", xDomain: [0.5, 9.5], yDomain: [0, 2.2], selectedX: rank,
    summary: `With α=${input.toFixed(2)}, select rank ${rank}. Radius ${radius}; prediction 5 gets interval [${5 - radius}, ${5 + radius}]. The theorem concerns marginal coverage under exchangeability.`,
    values: [value("Selected rank", rank), value("Radius", radius, "target units"), value("Lower endpoint", 5 - radius), value("Upper endpoint", 5 + radius), value("Marginal coverage lower bound", 1 - input)] };
}
