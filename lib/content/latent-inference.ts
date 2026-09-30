import type { CalculationResult } from "./calculations.ts";
import { binomialMass } from "./probability-math.ts";
export const latentInferenceModels = ["infer-approximation", "infer-variational", "infer-em"] as const;
export type LatentInferenceModel = typeof latentInferenceModels[number];
export const isLatentInferenceModel = (model: string): model is LatentInferenceModel => (latentInferenceModels as readonly string[]).includes(model);
type Point = [number, number];
const target = [0.49, 0.01, 0.01, 0.49];
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const fmt = (n: number) => Number(n.toFixed(6));
const independent = (a: number) => [(1 - a) ** 2, a * (1 - a), a * (1 - a), a * a];
const divergence = (a: number) => independent(a).reduce((sum, q, i) => sum + q * Math.log(q / target[i]), 0);
const jointTable = (label: string, p: number[]) => ({ label, rowLabels: ["X=0", "X=1"], columnLabels: ["Y=0", "Y=1"], entries: [p.slice(0, 2), p.slice(2)] });

export function calculateLatentInference(model: LatentInferenceModel, input: number): CalculationResult {
  const bounds: Record<LatentInferenceModel, [number, number]> = { "infer-approximation": [10, 1000], "infer-variational": [0.01, 0.99], "infer-em": [0, 12] };
  if (!Number.isFinite(input) || input < bounds[model][0] || input > bounds[model][1] || (model !== "infer-variational" && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "lines", series: [], xDomain: [0, 1], yDomain: [0, 1], xLabel: "Input", yLabel: "Value", summary: "", values: [] };
  if (model === "infer-approximation") {
    const p = 0.98, q = 0.5, se = Math.sqrt(p * (1 - p) / input), bias = p - q;
    return { ...base, xDomain: [10, 1000], xTicks: [10, 500, 1000], yDomain: [0, 0.52], xLabel: "Number of IID target draws n", yLabel: "Root mean squared probability error", selectedX: input, series: [{ label: "IID target-sampling RMSE (exact repeated-sampling value)", points: Array.from({ length: 100 }, (_, i): Point => { const n = 10 + 10 * i; return [n, Math.sqrt(p * (1 - p) / n)]; }) }, { label: "Fixed independent approximation: absolute bias 0.48", points: [[10, bias], [1000, bias]] }], markers: [{ label: "RMSE at selected sample count", point: [input, se] }], matrices: [jointTable("Target joint distribution p", target), jointTable("Independent approximation matching both marginals", independent(0.5))], summary: `The target gives P(X=Y)=0.98; the independent approximation gives 0.5 despite matching both one-variable marginals. Its deterministic error remains 0.48. With ${input} IID target draws, the unbiased event-frequency estimator has RMSE ${fmt(se)}. This toy permits exact sampling and enumeration; it isolates two error mechanisms, not a universal method ranking.`, values: [value("Target agreement probability", p), value("Approximate agreement probability", q), value("Marginal P(X=1)=P(Y=1) in both models", 0.5), value("Independent approximation absolute bias", bias), value("IID sample count", input, "draws"), value("IID estimator expected value", p), value("IID estimator variance", p * (1 - p) / input), value("IID estimator RMSE", se)] };
  }
  if (model === "infer-variational") {
    const a = input, q = independent(a), kl = divergence(a), entropy = -q.reduce((s, p) => s + p * Math.log(p), 0), expectedLogWeight = q.reduce((s, p, i) => s + p * Math.log([49, 1, 1, 49][i]), 0), elbo = expectedLogWeight + entropy;
    return { ...base, xDomain: [0.01, 0.99], yDomain: [0, 1.4], xLabel: "Tied mean-field parameter a", yLabel: "KL(qₐ || p) in nats", selectedX: a, series: [{ label: "Exact variational objective for this restricted family", points: Array.from({ length: 197 }, (_, i): Point => { const t = 0.01 + i * 0.005; return [t, divergence(t)]; }) }], markers: [{ label: "Selected approximate distribution", point: [a, kl] }], matrices: [jointTable("Normalized target p ∝ (49,1,1,49)", target), jointTable(`Product approximation qₐ with a=${fmt(a)}`, q)], summary: `At a=${fmt(a)}, KL(qₐ||p)=${fmt(kl)} nats and ELBO=${fmt(elbo)}. Their sum is log(100)=${fmt(Math.log(100))}. The approximation assigns P(X=Y)=${fmt(q[0] + q[3])} versus target 0.98, and marginal mean a=${fmt(a)} versus target 0.5. Lower objective does not mean every selected statistic improves.`, values: [value("Tied marginal a", a), value("KL(q||p)", kl, "nats"), value("Approximation entropy", entropy, "nats"), value("Expected log unnormalized weight", expectedLogWeight), value("ELBO", elbo), value("Exact log normalizer log(100)", Math.log(100)), value("Approximate P(X=Y)", q[0] + q[3]), value("Target P(X=Y)", 0.98), value("Approximate covariance", 0), value("Target covariance", 0.24)] };
  }
  const counts = [0, 1, 2, 8, 9, 10], n = 10;
  const mass = (k: number, p: number) => binomialMass(n, p)[k][1];
  const responsibilities = (a: number, b: number) => counts.map(k => { const pa = mass(k, a), pb = mass(k, b); return pa / (pa + pb); });
  const likelihood = (a: number, b: number) => counts.reduce((s, k) => s + Math.log(0.5 * mass(k, a) + 0.5 * mass(k, b)), 0);
  const history = [{ a: 0.4, b: 0.6, logLikelihood: likelihood(0.4, 0.6) }];
  for (let step = 1; step <= 12; step++) {
    const previous = history[step - 1], r = responsibilities(previous.a, previous.b), massA = r.reduce((s, x) => s + x, 0), massB = counts.length - massA;
    const a = r.reduce((s, x, i) => s + x * counts[i], 0) / (n * massA), b = r.reduce((s, x, i) => s + (1 - x) * counts[i], 0) / (n * massB);
    history.push({ a, b, logLikelihood: likelihood(a, b) });
  }
  const current = history[input], r = responsibilities(current.a, current.b);
  return { ...base, xDomain: [0, 12], xTicks: [0, 3, 6, 9, 12], yDomain: [Math.floor(history[0].logLikelihood) - 1, Math.ceil(history[12].logLikelihood) + 1], xLabel: "Completed E–M iterations", yLabel: "Observed-data log likelihood (nats)", selectedX: input, series: [{ label: "Observed count-data log likelihood through selected iteration", points: history.slice(0, input + 1).map((h, i) => [i, h.logLikelihood]) }, { label: "Initial log likelihood", points: [[0, history[0].logLikelihood], [12, history[0].logLikelihood]] }], markers: [{ label: "Current parameter fit", point: [input, current.logLikelihood] }], matrices: [{ label: "Next E-step responsibilities (4-decimal rounding; displayed 0 and 1 are approximate)", rowLabels: counts.map(k => `${k}/10`), columnLabels: ["coin A", "coin B"], entries: r.map(p => [p, 1 - p]) }], summary: `After ${input} EM iterations, coin probabilities are pA=${fmt(current.a)} and pB=${fmt(current.b)}. Observed count-data log likelihood is ${fmt(current.logLikelihood)}, up ${fmt(current.logLikelihood - history[0].logLikelihood)} from initialization. Mixture weights stay fixed at 1/2. Table entries are fractional posterior coin assignments, not hard labels or posterior distributions over the coin parameters.`, values: [value("Completed iterations", input), value("Coin A success probability", current.a), value("Coin B success probability", current.b), value("Observed log likelihood", current.logLikelihood, "nats"), value("Log-likelihood improvement", current.logLikelihood - history[0].logLikelihood, "nats"), value("Effective bags assigned to A in next E-step", r.reduce((s, x) => s + x, 0)), value("Mixture weight of each coin (fixed)", 0.5)] };
}
