import type { CalculationResult } from "./calculations";

export const linearModels = ["la-shape", "la-span", "la-independence", "la-dot", "la-product", "la-norms", "la-similarity", "la-orthogonal", "la-projection", "la-rank", "la-trace-det", "la-psd", "la-svd", "la-low-rank", "la-sparse", "la-gradient", "la-jacobian", "la-kronecker", "la-einsum", "la-conditioning"] as const;
export type LinearModel = typeof linearModels[number];
export function isLinearModel(model: string): model is LinearModel { return (linearModels as readonly string[]).includes(model); }
type Point = [number, number];
const val = (label: string, value: number, unit = "") => ({ label, value, unit });
const matrix = (label: string, entries: number[][]) => ({ label, entries });
const series = (label: string, points: Point[]) => ({ label, points });
const vector = (label: string, endpoint: Point) => series(label, [[0, 0], endpoint]);
const tidy = (n: number) => Number(n.toFixed(5));

export function multiply(a: number[][], b: number[][]): number[][] {
  return a.map((row) => b[0].map((_, j) => row.reduce((sum, entry, k) => sum + entry * b[k][j], 0)));
}
export function kronecker(a: number[][], b: number[][]): number[][] {
  return a.flatMap((row) => b.map((bRow) => row.flatMap((entry) => bRow.map((v) => entry * v))));
}
export function calculateLinear(model: LinearModel, t: number): CalculationResult {
  const bounds: Record<LinearModel, [number, number, boolean?]> = {
    "la-shape": [1, 8, true], "la-span": [-2, 2], "la-independence": [-1, 1], "la-dot": [0, 180], "la-product": [-2, 3],
    "la-norms": [-4, 4], "la-similarity": [0.1, 3], "la-orthogonal": [0, 180], "la-projection": [0, 180], "la-rank": [-1, 1],
    "la-trace-det": [-2, 2], "la-psd": [-2, 2], "la-svd": [0, 360], "la-low-rank": [0, 3, true], "la-sparse": [0, 25, true],
    "la-gradient": [-1, 2], "la-jacobian": [-2, 2], "la-kronecker": [-2, 2], "la-einsum": [-2, 3], "la-conditioning": [0, 4],
  };
  const [min, max, integer] = bounds[model];
  if (!Number.isFinite(t) || t < min || t > max || (integer && !Number.isInteger(t))) throw new Error(`Invalid ${model} control value: ${t}`);
  const base: CalculationResult = { kind: "lines", series: [], xLabel: "First coordinate", yLabel: "Second coordinate", xDomain: [-3.5, 3.5], yDomain: [-3.5, 3.5], equalAspect: true, summary: "", values: [] };
  if (model === "la-shape") {
    return { ...base, kind: "matrix", matrices: Array.from({ length: t }, (_, i) => matrix(`Batch item ${i}: a 2 × 3 slice`, [[i * 6 + 1, i * 6 + 2, i * 6 + 3], [i * 6 + 4, i * 6 + 5, i * 6 + 6]])),
      summary: `Shape (${t},2,3) has three axes and ${6 * t} scalar entries. Contiguous float32 payload: ${24 * t} bytes. Each displayed table is one slice along the batch axis.`,
      values: [val("Number of axes (order)", 3), val("Batch size", t), val("Scalar entries", 6 * t), val("Float32 payload", 24 * t, "bytes")] };
  }
  if (model === "la-span") {
    const w: Point = [t + 1, 1];
    return { ...base, series: [vector("a·u, where u=(1,0)", [t, 0]), vector("v=(1,1)", [1, 1]), vector("a·u+v", w), series("Add v at the end of a·u", [[t, 0], w])],
      summary: `With a=${tidy(t)} and b=1, a(1,0)+b(1,1)=(${tidy(w[0])},1). This slider traces one line in the full two-dimensional span.`, values: [val("u coefficient a", t), val("v coefficient b", 1), val("Result x", w[0]), val("Result y", 1), val("Dimension of span(u,v)", 2)] };
  }
  if (model === "la-independence") {
    return { ...base, series: [vector("u=(1,1)", [1, 1]), vector("v=(1,1+ε)", [1, 1 + t]), series("Spanned parallelogram", [[0, 0], [1, 1], [2, 2 + t], [1, 1 + t], [0, 0]])],
      summary: `det([u v])=ε=${tidy(t)}. ${t === 0 ? "The columns coincide; their span is a line." : "The two columns are independent in exact arithmetic."} Area=${tidy(Math.abs(t))}.`,
      matrices: [matrix("Columns u and v", [[1, 1], [1, 1 + t]])], values: [val("Determinant", t), val("Parallelogram area", Math.abs(t)), val("Exact rank", t === 0 ? 1 : 2)] };
  }
  if (model === "la-dot" || model === "la-orthogonal") {
    const angle = t * Math.PI / 180, c = Math.cos(angle), s = Math.sin(angle);
    if (model === "la-dot") return { ...base, series: [vector("u=(2,0)", [2, 0]), vector("v=(cosθ,sinθ)", [c, s])],
      summary: `u·v=2cos(${t}°)=${tidy(2 * c)}. The sign distinguishes acute, right, and obtuse angles.`, values: [val("Dot product", 2 * c), val("Cosine similarity", c), val("Length of u", 2), val("Length of v", 1)] };
    const q1: Point = [c, s], q2: Point = [-s, c], z: Point = [2 * c + s, -2 * s + c];
    return { ...base, series: [vector("q₁", q1), vector("q₂", q2), vector("x=(2,1)", [2, 1])], matrices: [matrix("Q (columns are q₁,q₂)", [[c, -s], [s, c]]), matrix("Coordinates Qᵀx", [[z[0]], [z[1]]])],
      summary: `The rotated basis remains orthonormal: q₁·q₂=0 and both lengths are 1. Coordinates change to (${tidy(z[0])},${tidy(z[1])}); squared length stays 5.`,
      values: [val("q₁·q₂", c * -s + s * c), val("‖x‖²", 5), val("‖Qᵀx‖²", z[0] ** 2 + z[1] ** 2)] };
  }
  if (model === "la-product" || model === "la-einsum") {
    const a = [[1, 2], [0, 1]], b = [[t, 0], [1, 2]], ab = multiply(a, b), ba = multiply(b, a);
    return { ...base, kind: "matrix", matrices: [matrix("A", a), matrix("B", b), matrix(model === "la-einsum" ? "einsum('ik,kj->ij', A, B)" : "A × B", ab), matrix("B × A (different order)", ba)],
      summary: `C₀₀=A₀₀B₀₀+A₀₁B₁₀=1×${t}+2×1=${t + 2}. ${model === "la-einsum" ? "k is summed; i and j survive as output axes." : "Rows of A contract with columns of B."}`,
      values: [val("C₀₀ term k=0", t), val("C₀₀ term k=1", 2), val("C₀₀", t + 2), val("C₀₁", 4), val("C₁₀", 1), val("C₁₁", 2)] };
  }
  if (model === "la-norms") {
    const xs = Array.from({ length: 81 }, (_, i) => -4 + i / 10);
    return { ...base, equalAspect: false, xLabel: "First coordinate x in (x,3)", yLabel: "Vector norm", xDomain: [-4, 4], yDomain: [0, 8], selectedX: t,
      series: [series("L₁: |x|+3", xs.map((x) => [x, Math.abs(x) + 3])), series("L₂: √(x²+9)", xs.map((x) => [x, Math.hypot(x, 3)])), series("L∞: max(|x|,3)", xs.map((x) => [x, Math.max(Math.abs(x), 3)]))],
      summary: `For (${t},3): L₁=${tidy(Math.abs(t) + 3)}, L₂=${tidy(Math.hypot(t, 3))}, L∞=${tidy(Math.max(Math.abs(t), 3))}. These are different choices of size, not interchangeable units.`,
      values: [val("L₁", Math.abs(t) + 3), val("L₂", Math.hypot(t, 3)), val("L∞", Math.max(Math.abs(t), 3))] };
  }
  if (model === "la-similarity") {
    return { ...base, xDomain: [-0.5, 3.5], yDomain: [-0.5, 3.5], series: [vector("u=(1,1)", [1, 1]), vector("v=c·u", [t, t]), series("Displacement v−u", [[1, 1], [t, t]])],
      summary: `With positive scale c=${t}, cosine similarity stays 1 while Euclidean distance is √2|c−1|=${tidy(Math.SQRT2 * Math.abs(t - 1))}.`,
      values: [val("Cosine similarity", 1), val("Cosine distance 1−cos", 0), val("Euclidean distance", Math.SQRT2 * Math.abs(t - 1)), val("Dot product", 2 * t)] };
  }
  if (model === "la-projection") {
    const angle = t * Math.PI / 180, u: Point = [Math.cos(angle), Math.sin(angle)], coefficient = 2 * u[0] + u[1], p: Point = [coefficient * u[0], coefficient * u[1]], e: Point = [2 - p[0], 1 - p[1]];
    return { ...base, series: [vector("x=(2,1)", [2, 1]), vector("Projection p", p), series("Residual x−p", [p, [2, 1]]), series("Projection subspace", [[-3 * u[0], -3 * u[1]], [3 * u[0], 3 * u[1]]])],
      summary: `Project x onto the line at ${t}°. p=(${tidy(p[0])},${tidy(p[1])}); residual=(${tidy(e[0])},${tidy(e[1])}). The residual is perpendicular to the line.`,
      values: [val("Projection coefficient uᵀx", coefficient), val("‖p‖²", p[0] ** 2 + p[1] ** 2), val("‖x−p‖²", e[0] ** 2 + e[1] ** 2), val("uᵀ(x−p)", u[0] * e[0] + u[1] * e[1])] };
  }
  if (model === "la-rank") {
    const rank = t === 0 ? 1 : 2;
    return { ...base, kind: "matrix", matrices: [matrix("A: R³ → R²", [[1, 0, 0], [0, t, 0]]), matrix("Always-null direction e₃", [[0], [0], [1]])],
      summary: `A=diag(1,${t}) with an extra zero column has rank ${rank} and nullity ${3 - rank}. Every multiple of e₃ maps to zero${t === 0 ? ", and e₂ is also a null direction" : ""}.`,
      values: [val("Domain dimension", 3), val("Rank", rank), val("Nullity", 3 - rank), val("Rank + nullity", 3)] };
  }
  if (model === "la-trace-det") {
    return { ...base, xDomain: [-2.5, 2.5], yDomain: [-2.5, 2.5], series: [series("Original unit square", [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]), series("Image under diag(2,t)", [[0, 0], [2, 0], [2, t], [0, t], [0, 0]])],
      summary: `Trace=2+t=${tidy(2 + t)}; determinant=2t=${tidy(2 * t)}. Area scale is |2t|=${tidy(Math.abs(2 * t))}; ${t < 0 ? "orientation reverses" : t === 0 ? "the square collapses to a line" : "orientation is preserved"}.`, matrices: [matrix("A", [[2, 0], [0, t]])], values: [val("Trace", 2 + t), val("Determinant", 2 * t), val("Area scale", Math.abs(2 * t))] };
  }
  if (model === "la-psd") {
    const points: Point[] = Array.from({ length: 181 }, (_, i) => { const a = i * Math.PI / 180; return [i, Math.cos(a) ** 2 + t * Math.sin(a) ** 2]; });
    return { ...base, equalAspect: false, xDomain: [0, 180], yDomain: [-2.2, 2.2], xLabel: "Unit vector direction θ (degrees)", yLabel: "Quadratic form xᵀAx", series: [series("diag(1,t): cos²θ+t sin²θ", points)],
      summary: `Eigenvalues are 1 and ${t}. The minimum unit-vector quadratic form is ${Math.min(1, t)}: A is ${t > 0 ? "positive definite" : t === 0 ? "positive semidefinite and singular" : "indefinite"}.`,
      matrices: [matrix("Symmetric A", [[1, 0], [0, t]])], values: [val("Smallest eigenvalue", Math.min(1, t)), val("Largest eigenvalue", Math.max(1, t)), val("Quadratic form at (0,1)", t)] };
  }
  if (model === "la-svd") {
    const s = Math.SQRT1_2, angle = t * Math.PI / 180, v: Point = [Math.cos(angle), Math.sin(angle)];
    const transform = ([x, y]: Point): Point => [(3 * x - 2 * y) * s, (3 * x + 2 * y) * s];
    const circle: Point[] = Array.from({ length: 73 }, (_, i) => [Math.cos(i * Math.PI / 36), Math.sin(i * Math.PI / 36)]);
    const av = transform(v);
    return { ...base, series: [series("Unit input circle", circle), series("Output ellipse (third coordinate=0)", circle.map(transform)), vector("Selected input", v), vector("Selected output", av)],
      matrices: [matrix("A (3 × 2)", [[3 * s, -2 * s], [3 * s, 2 * s], [0, 0]]), matrix("Reduced U", [[s, -s], [s, s], [0, 0]]), matrix("Σ", [[3, 0], [0, 2]]), matrix("Vᵀ", [[1, 0], [0, 1]])],
      summary: `The rectangular map has singular values 3 and 2. At ${t}°, the output is (${tidy(av[0])},${tidy(av[1])},0); its norm is ${tidy(Math.hypot(...av))}. Only the first two output coordinates are plotted.`,
      values: [val("Largest singular value", 3), val("Smallest singular value", 2), val("Output length", Math.hypot(...av)), val("Third output coordinate", 0)] };
  }
  if (model === "la-low-rank") {
    const singular = [4, 2, 1], kept = singular.map((s, i) => i < t ? s : 0), residual = singular.map((s, i) => i >= t ? s : 0);
    const error = Math.hypot(...residual);
    return { ...base, kind: "matrix", matrices: [matrix("A", [[4, 0, 0], [0, 2, 0], [0, 0, 1]]), matrix(`Best rank-${t} approximation`, [[kept[0], 0, 0], [0, kept[1], 0], [0, 0, kept[2]]]), matrix("Residual A−Aₖ", [[residual[0], 0, 0], [0, residual[1], 0], [0, 0, residual[2]]])],
      summary: `Keeping ${t} singular directions gives Frobenius error ${tidy(error)} and spectral error ${Math.max(...residual)}. Retained squared Frobenius norm: ${tidy(100 * kept.reduce((s, v) => s + v * v, 0) / 21)}%.`,
      values: [val("Retained rank", t), val("Frobenius residual", error), val("Spectral residual", Math.max(...residual)), val("Retained squared norm fraction", kept.reduce((s, v) => s + v * v, 0) / 21)] };
  }
  if (model === "la-sparse") {
    const entries = Array.from({ length: 5 }, (_, row) => Array.from({ length: 5 }, (_, col) => row * 5 + col < t ? 1 : 0));
    return { ...base, equalAspect: false, xDomain: [0, 25], yDomain: [0, 350], selectedX: t, xLabel: "Stored nonzero entries", yLabel: "Payload bytes", series: [series("Dense float64", [[0, 200], [25, 200]]), series("CSR: float64 data + int32 indices", [[0, 24], [25, 324]])], matrices: [matrix("5 × 5 example (ones inserted by row)", entries)],
      summary: `${t} nonzeros: dense payload 200 bytes; CSR payload 24+12×${t}=${24 + 12 * t} bytes. Object overhead is excluded. Sparse storage ${24 + 12 * t < 200 ? "saves" : "does not save"} payload space here.`,
      values: [val("Nonzeros", t), val("Density", t / 25), val("Dense payload", 200, "bytes"), val("CSR payload", 24 + 12 * t, "bytes")] };
  }
  if (model === "la-gradient") {
    const loss = (w: number) => ((w + 1) ** 2 + 1) / 2;
    return { ...base, equalAspect: false, xDomain: [-1, 2], yDomain: [0, 5.5], selectedX: t, xLabel: "W₀₀=t, all other weights fixed", yLabel: "Squared-error loss L", series: [series("L=½[(t+1)²+1]", Array.from({ length: 61 }, (_, i) => { const w = -1 + i / 20; return [w, loss(w)]; }))],
      matrices: [matrix("W", [[t, 1], [0, 1]]), matrix("x", [[1], [2]]), matrix("Target y", [[1], [1]]), matrix("Gradient (Wx−y)xᵀ", [[t + 1, 2 * (t + 1)], [1, 2]])],
      summary: `Residual Wx−y=(${tidy(t + 1)},1); L=${tidy(loss(t))}. ∂L/∂W₀₀=${tidy(t + 1)} is the slope of this one-parameter slice. The full gradient has W's 2×2 shape.`,
      values: [val("Loss", loss(t)), val("∂L/∂W₀₀", t + 1), val("∂L/∂W₀₁", 2 * (t + 1)), val("∂L/∂W₁₀", 1), val("∂L/∂W₁₁", 2)] };
  }
  if (model === "la-jacobian") {
    return { ...base, kind: "matrix", matrices: [matrix("J_f for f(x,y)=(x²+y,xy) at (t,1)", [[2 * t, 1], [1, t]]), matrix("H_g for g(x,y)=x²+xy+2y²", [[2, 1], [1, 4]])],
      summary: `At (x,y)=(${t},1), J_f maps a small (dx,dy) to (2t·dx+dy, dx+t·dy). H_g is constant because g is quadratic. These matrices describe different functions and different derivative orders.`,
      values: [val("∂f₁/∂x", 2 * t), val("∂f₁/∂y", 1), val("∂f₂/∂x", 1), val("∂f₂/∂y", t), val("∂²g/∂x²", 2), val("∂²g/∂x∂y", 1), val("∂²g/∂y²", 4)] };
  }
  if (model === "la-kronecker") {
    const a = [[1, t], [0, 2]], b = [[1, 2], [3, 4]];
    return { ...base, kind: "matrix", matrices: [matrix("A", a), matrix("B", b), matrix("A ⊗ B (each A entry scales one B block)", kronecker(a, b))],
      summary: `Two 2×2 matrices produce a 4×4 Kronecker product. The top-right 2×2 block is ${t}B, while the bottom-left block is zero.`,
      values: [val("Output rows", 4), val("Output columns", 4), val("Top-right block, first entry", t), val("Top-right block, last entry", 4 * t)] };
  }
  const epsilon = 10 ** -t, inputError = 0.001, outputError = inputError / epsilon;
  return { ...base, equalAspect: false, xDomain: [0, 4], yDomain: [0, 10500], selectedX: t, xLabel: "Exponent s in ε=10⁻ˢ", yLabel: "Condition number κ₂", series: [series("κ₂(diag(1,10⁻ˢ))=10ˢ", Array.from({ length: 81 }, (_, i) => [i / 20, 10 ** (i / 20)]))],
    matrices: [matrix("A", [[1, 0], [0, epsilon]]), matrix("Original right-hand side b", [[1], [0]]), matrix("Perturbed solution", [[1], [outputError]])],
    summary: `ε=${epsilon.toPrecision(3)}, κ₂=${tidy(1 / epsilon)}. Adding 0.001 to b₂ changes x₂ by ${tidy(outputError)}; relative right-hand-side error 0.001 becomes relative solution error ${tidy(outputError)} in this example.`,
    values: [val("Small diagonal entry ε", epsilon), val("Condition number κ₂", 1 / epsilon), val("Relative b error", inputError), val("Relative x error", outputError)] };
}
