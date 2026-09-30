import type { CalculationResult } from "./calculations.ts";

export const mcmcModels = ["mcmc-mh", "mcmc-gibbs", "mcmc-hmc"] as const;
export type McmcModel = typeof mcmcModels[number];
export const isMcmcModel = (model: string): model is McmcModel => (mcmcModels as readonly string[]).includes(model);
type Point = [number, number];
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const fmt = (x: number) => x !== 0 && Math.abs(x) < 0.0001 ? x.toExponential(3) : Number(x.toFixed(6));

export function calculateMcmc(model: McmcModel, input: number): CalculationResult {
  const bounds: Record<McmcModel, [number, number]> = { "mcmc-mh": [0.1, 0.8], "mcmc-gibbs": [0, 0.98], "mcmc-hmc": [0.05, 1.9] };
  if (!Number.isFinite(input) || input < bounds[model][0] || input > bounds[model][1]) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "lines", series: [], xDomain: [0, 1], yDomain: [0, 1], xLabel: "Input", yLabel: "Probability", summary: "", values: [] };
  if (model === "mcmc-mh") {
    const target = [0.2, 0.3, 0.5], proposal = [input, (1 - input) / 2, (1 - input) / 2];
    const kernel = (correct: boolean) => target.map((pi, i) => {
      const row = target.map((pj, j) => i === j ? 0 : proposal[j] * Math.min(1, pj / pi * (correct ? proposal[i] / proposal[j] : 1)));
      row[i] = 1 - row.reduce((a, b) => a + b, 0);
      return row;
    });
    const normalizer = target.reduce((s, p, i) => s + p * proposal[i], 0), wrong = target.map((p, i) => p * proposal[i] / normalizer);
    const corrected = kernel(true), uncorrected = kernel(false), forward = corrected[0][2], reverse = corrected[2][0];
    return { ...base, kind: "bars", xDomain: [-0.5, 2.5], yDomain: [0, 0.85], xLabel: "Discrete state (0, 1, 2)", yLabel: "Stationary probability mass", series: [{ label: "Desired target π", points: target.map((p, i) => [i, p]) }, { label: "Correct MH invariant law", points: target.map((p, i) => [i, p]) }, { label: "Wrong rule: omit proposal ratio", points: wrong.map((p, i) => [i, p]) }], matrices: [{ label: "Proposal Q: every row is q", entries: target.map(() => [...proposal]) }, { label: "Correct transition P (includes stays)", entries: corrected }, { label: "Incorrect transition (missing q ratio)", entries: uncorrected }], summary: `With q(0)=${fmt(input)}, omitting the proposal ratio changes the invariant mass at state 0 from 0.2 to ${fmt(wrong[0])}. Correct MH balances the 0↔2 probability flows: 0.2·P₀₂=${fmt(0.2 * forward)} and 0.5·P₂₀=${fmt(0.5 * reverse)}. Bars are exact stationary laws, not finite-run histograms.`, values: [value("q(0)", proposal[0]), value("q(1)=q(2)", proposal[1]), value("Acceptance 0→2", Math.min(1, target[2] * proposal[0] / (target[0] * proposal[2]))), value("Acceptance 2→0", Math.min(1, target[0] * proposal[2] / (target[2] * proposal[0]))), value("Correct flow 0→2", 0.2 * forward), value("Correct flow 2→0", 0.5 * reverse), value("Wrong invariant mass at 0", wrong[0]), value("Wrong-law total variation from target", wrong.reduce((s, p, i) => s + Math.abs(p - target[i]), 0) / 2)] };
  }
  if (model === "mcmc-gibbs") {
    const c = input, target = [(1 + c) / 4, (1 - c) / 4, (1 - c) / 4, (1 + c) / 4];
    // Random scan: choose one bit uniformly, then redraw from its full conditional.
    const kernel = (coupling: number) => Array.from({ length: 4 }, (_, i) => {
      const row = Array(4).fill(0) as number[];
      for (const bit of [1, 2]) { const j = i ^ bit, same = i === 0 || i === 3; row[j] = (1 + (same ? -coupling : coupling)) / 4; }
      row[i] = 1 - row.reduce((a, b) => a + b, 0);
      return row;
    });
    const evolve = (transition: number[][], pi: number[]) => {
      let law = [1, 0, 0, 0]; const points: Point[] = [];
      for (let k = 0; k <= 40; k++) {
        points.push([k, law.reduce((s, p, i) => s + Math.abs(p - pi[i]), 0) / 2]);
        if (k < 40) law = pi.map((_, j) => law.reduce((s, p, i) => s + p * transition[i][j], 0));
      }
      return { points, law };
    };
    const transition = kernel(c), current = evolve(transition, target), independent = evolve(kernel(0), [0.25, 0.25, 0.25, 0.25]);
    return { ...base, xDomain: [0, 40], yDomain: [0, 0.8], xLabel: "Single-coordinate updates (not sweeps)", yLabel: "Total variation distance to own target", series: [{ label: `Selected coupling c=${fmt(c)}`, points: current.points }, { label: "Independent target c=0", points: independent.points }], matrices: [{ label: "Target joint mass: row X, column Y", rowLabels: ["X=0", "X=1"], columnLabels: ["Y=0", "Y=1"], entries: [[target[0], target[1]], [target[2], target[3]]] }, { label: "Random-scan transition, state order 00, 01, 10, 11", entries: transition }], summary: `At coupling c=${fmt(c)}, a redraw matches the other bit with probability ${fmt((1 + c) / 2)}. Starting at 00, exact total variation after 40 updates is ${fmt(current.points[40][1])}. The spectral gap is (1−c)/2=${fmt((1 - c) / 2)}. Full conditional draws need no rejection step, but can stay put and mix slowly.`, values: [value("Probability bits match under target", (1 + c) / 2), value("P(flip one specified bit | state 00)", (1 - c) / 4), value("P(stay | state 00)", transition[0][0]), value("Spectral gap", (1 - c) / 2), value("Total variation at update 40", current.points[40][1]), ...current.law.map((p, i) => value(`P(state ${["00", "01", "10", "11"][i]} at update 40)`, p))] };
  }
  const epsilon = input, steps = 10, initialQ = 1, initialP = 0.5, initialEnergy = 0.625;
  let q = initialQ, p = initialP; const numerical: Point[] = [[q, p]];
  for (let k = 0; k < steps; k++) { p -= epsilon * q / 2; q += epsilon * p; p -= epsilon * q / 2; numerical.push([q, p]); }
  const duration = steps * epsilon, exactQ = Math.cos(duration) + 0.5 * Math.sin(duration), exactP = 0.5 * Math.cos(duration) - Math.sin(duration);
  const energy = (q * q + p * p) / 2, delta = energy - initialEnergy, acceptance = Math.exp(Math.min(0, -delta));
  const radius = Math.sqrt(2 * initialEnergy), extent = Math.max(radius, ...numerical.flatMap(([x, y]) => [Math.abs(x), Math.abs(y)])) * 1.15;
  return { ...base, equalAspect: true, xDomain: [-extent, extent], yDomain: [-extent, extent], xLabel: "Position q (standardized)", yLabel: "Momentum p (unit mass)", series: [{ label: "Exact energy contour H=0.625", points: Array.from({ length: 181 }, (_, i) => [radius * Math.cos(i * Math.PI / 90), radius * Math.sin(i * Math.PI / 90)]) }, { label: "Ten leapfrog steps (before momentum flip)", points: numerical }], markers: [{ label: "Start q=1, p=0.5", point: [initialQ, initialP], hollow: true }, { label: "Numerical endpoint", point: [q, p] }, { label: "Exact endpoint at the same time", point: [exactQ, exactP], hollow: true }], summary: `Step size ε=${fmt(epsilon)} over 10 steps gives integration time ${fmt(duration)}. Energy error ΔH=${fmt(delta)}; the one-proposal acceptance probability is ${fmt(acceptance)}. The endpoint is q=${fmt(q)}, p=${fmt(p)} before the final momentum flip. This is one deterministic trajectory, not samples from a completed HMC chain.`, values: [value("Step size ε", epsilon), value("Leapfrog steps", steps), value("Integration time", duration), value("Initial Hamiltonian", initialEnergy), value("Final Hamiltonian", energy), value("Energy error ΔH", delta), value("Acceptance probability", acceptance), value("Proposed position", q), value("Exact position at same time", exactQ), value("Position error", Math.abs(q - exactQ)), value("Absolute position displacement", Math.abs(q - initialQ))] };
}
