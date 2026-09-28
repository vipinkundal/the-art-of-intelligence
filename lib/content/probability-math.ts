/** Exact finite Bernoulli-count masses for the bounded educational models. */
export function binomialMass(n: number, p: number): [number, number][] {
  let choose = 1;
  return Array.from({ length: n + 1 }, (_, k) => {
    if (k > 0) choose *= (n - k + 1) / k;
    return [k, choose * p ** k * (1 - p) ** (n - k)];
  });
}
