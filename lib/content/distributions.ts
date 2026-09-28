import type { CalculationResult } from "./calculations";
export const distributionModels = ["dist-categorical", "dist-multinomial", "dist-uniform", "dist-normal", "dist-mvn", "dist-poisson", "dist-exponential", "dist-gamma", "dist-beta", "dist-dirichlet", "dist-lognormal", "dist-student", "dist-gumbel", "dist-density", "dist-cdf", "dist-geometric"] as const;
export type DistributionModel = typeof distributionModels[number];
export const isDistributionModel = (s: string): s is DistributionModel => (distributionModels as readonly string[]).includes(s);
type Point = [number, number];
const v = (label: string, value: number, unit = "") => ({ label, value, unit });
const f = (x: number) => x !== 0 && Math.abs(x) < 0.00001 ? x.toExponential(3) : Number(x.toFixed(5));
const curve = (lo: number, hi: number, fn: (x: number) => number, n = 240): Point[] => Array.from({ length: n + 1 }, (_, i) => { const x = lo + (hi - lo) * i / n; return [x, fn(x)]; });

// Lanczos approximation for positive arguments in bounded teaching examples.
export function logGamma(z: number): number {
  if (!(z > 0)) throw new Error("Gamma argument must be positive");
  const cs = [676.5203681218851,-1259.1392167224028,771.3234287776531,-176.6150291621406,12.507343278686905,-0.13857109526572012,9.984369578019572e-6,1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  z -= 1;
  let sum = 0.99999999999980993;
  cs.forEach((c, i) => { sum += c / (z + i + 1); });
  const t = z + 7.5;
  return Math.log(2 * Math.PI) / 2 + (z + 0.5) * Math.log(t) - t + Math.log(sum);
}
export const normalPDF = (x: number, sigma = 1) => Math.exp(-0.5 * (x / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
export const lognormalPDF = (x: number, sigma: number) => x <= 0 ? 0 : normalPDF(Math.log(x), sigma) / x;
export const studentPDF = (x: number, nu: number) => Math.exp(logGamma((nu + 1) / 2) - logGamma(nu / 2) - Math.log(nu * Math.PI) / 2 - (nu + 1) / 2 * Math.log1p(x * x / nu));
export function betaPDF(x: number, a: number, b: number): number {
  if (x < 0 || x > 1) return 0;
  if (x === 0) return a === 1 ? b : a > 1 ? 0 : Infinity;
  if (x === 1) return b === 1 ? a : b > 1 ? 0 : Infinity;
  return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log1p(-x) + logGamma(a + b) - logGamma(a) - logGamma(b));
}
export function gammaPDF(x: number, shape: number, rate = 1): number {
  if (x < 0) return 0;
  if (x === 0) return shape === 1 ? rate : shape > 1 ? 0 : Infinity;
  return Math.exp(shape * Math.log(rate) + (shape - 1) * Math.log(x) - rate * x - logGamma(shape));
}
export function poissonMass(lambda: number, max = 40): Point[] {
  let p = Math.exp(-lambda);
  return Array.from({ length: max + 1 }, (_, k) => { if (k) p *= lambda / k; return [k, p]; });
}
export function calculateDistribution(model: DistributionModel, input: number): CalculationResult {
  const bounds: Record<DistributionModel, [number, number, boolean?]> = {
    "dist-geometric": [0.1,1],
    "dist-categorical": [0,1], "dist-multinomial": [1,12,true], "dist-uniform": [0.5,4], "dist-normal": [0.5,2], "dist-mvn": [-0.9,0.9], "dist-poisson": [0,10], "dist-exponential": [0.25,3], "dist-gamma": [1,6,true], "dist-beta": [1,8], "dist-dirichlet": [1,8], "dist-lognormal": [0.25,1.25], "dist-student": [1,30,true], "dist-gumbel": [0.5,2], "dist-density": [0.25,2], "dist-cdf": [-0.5,1.5],
  };
  const [min,max,integer] = bounds[model];
  if (!Number.isFinite(input) || input < min || input > max || (integer && !Number.isInteger(input))) throw new Error(`Invalid ${model} parameter`);
  const base: CalculationResult = {kind:"lines",series:[],xDomain:[0,1],yDomain:[0,1],xLabel:"Value x",yLabel:"Density (per x-unit)",summary:"",values:[]};
  if (model === "dist-categorical") {
    const p = [input,0.4*(1-input),0.6*(1-input)];
    return {...base,kind:"bars",xDomain:[-0.5,2.5],xLabel:"Category codes: 0=A, 1=B, 2=C",yLabel:"Probability mass",series:[{label:"One mutually exclusive outcome",points:p.map((p,i)=>[i,p])}],summary:`P(A)=${f(p[0])}, P(B)=${f(p[1])}, P(C)=${f(p[2])}. Total probability is 1. Category codes do not imply a meaningful numerical average.`,values:p.map((p,i)=>v(`P(${["A","B","C"][i]})`,p))};
  }
  if (model === "dist-multinomial") {
    const n=input,p=[0.2,0.3,0.5]; let choose=1;
    const points:Point[]=Array.from({length:n+1},(_,k)=>{if(k)choose*=(n-k+1)/k;return[k,choose*0.2**k*0.8**(n-k)];});
    return {...base,kind:"bars",xDomain:[-0.5,n+0.5],xLabel:"Count Nₐ out of n trials",yLabel:"Marginal probability mass",series:[{label:"Nₐ ~ Binomial(n,0.2), not the joint PMF",points}],matrices:[{label:"Covariance of counts (A,B,C)",entries:p.map((a,i)=>p.map((b,j)=>n*((i===j?a:0)-a*b)))}],summary:`n=${n}: expected counts (${f(n*0.2)},${f(n*0.3)},${f(n*0.5)}). Only category A's marginal is plotted. Counts always sum to ${n}; Cov(Nₐ,Nᵦ)=${f(-n*0.06)}.`,values:[v("Trials",n),...p.map((p,i)=>v(`Expected count ${["A","B","C"][i]}`,n*p)),v("Cov(Nₐ,Nᵦ)",-n*0.06),...points.map(([k,p])=>v(`P(Nₐ=${k})`,p))]};
  }
  if (model === "dist-uniform" || model === "dist-density") {
    const b=input,end=model==="dist-density"?b/2:Math.min(1,b),upper=model==="dist-density"?2.2:4.2;
    return {...base,xDomain:[-0.2,upper],yDomain:[0,model==="dist-density"?4.4:2.2],xLabel:"Position x (length units)",yLabel:"Density (inverse length)",series:[{label:"Uniform density on [0,b]",points:[[-0.2,0],[0,0],[0,1/b],[b,1/b],[b,0],[upper,0]]}],shaded:[[0,0],[0,1/b],[end,1/b],[end,0]],summary:`b=${b}; density height=${f(1/b)}. Shaded interval [0,${f(end)}] has probability width×height=${f(end/b)}. Any individual point has probability zero.`,values:[v("Density height",1/b,"inverse length"),v("Shaded width",end,"length"),v("Shaded probability",end/b),v("Mean",b/2,"length"),v("Variance",b*b/12,"length²")]};
  }
  if (model === "dist-cdf") {
    const cdf=Math.max(0,Math.min(1,input));
    return {...base,xDomain:[-0.5,1.5],xLabel:"Threshold t",yLabel:"Cumulative probability F(t)",series:[{label:"CDF of Uniform(0,1)",points:[[-0.5,0],[0,0],[1,1],[1.5,1]]}],selectedX:input,summary:`F(${input})=P(X≤${input})=${f(cdf)} for X~Uniform(0,1). Below the support F is 0; above it F is 1. The height is accumulated probability, not density.`,values:[v("Threshold",input),v("P(X≤t)",cdf),v("P(X>t)",1-cdf),v("P(X=t)",0)]};
  }
  if (model === "dist-normal") {
    const sigma=input;
    return {...base,xDomain:[-6,6],yDomain:[0,0.85],xLabel:"Deviation x (measurement units)",yLabel:"Density (per measurement unit)",series:[{label:`Normal(0,σ²), σ=${sigma}`,points:curve(-6,6,x=>normalPDF(x,sigma))}],shaded:[[-sigma,0],...curve(-sigma,sigma,x=>normalPDF(x,sigma),80),[sigma,0]],summary:`σ=${sigma}; variance=${f(sigma*sigma)}. The shaded ±σ interval always contains about 68.27% probability. The fixed plot window [-6,6] omits the continuing tails.`,values:[v("Mean",0),v("Standard deviation",sigma),v("Variance",sigma*sigma),v("Peak density",normalPDF(0,sigma)),v("P(|X|≤σ), approximate",0.682689492137)]};
  }
  if (model === "dist-mvn") {
    const rho=input,s=Math.sqrt(1-rho*rho);
    const ellipse=(r:number):Point[]=>Array.from({length:161},(_,i)=>{const a=2*Math.PI*i/160;return[r*Math.cos(a),r*(rho*Math.cos(a)+s*Math.sin(a))];});
    return {...base,equalAspect:true,xDomain:[-3,3],yDomain:[-3,3],xLabel:"X (standardized units)",yLabel:"Y (standardized units)",series:[{label:"Mahalanobis radius 1: 39.35% inside",points:ellipse(1)},{label:"Mahalanobis radius 2: 86.47% inside",points:ellipse(2)}],matrices:[{label:"Covariance Σ",entries:[[1,rho],[rho,1]]}],summary:`ρ=${rho}; det(Σ)=${f(1-rho*rho)}. Both marginal variances remain 1. These are equal-density contours, not samples; radius-1 coverage in two dimensions is 1−exp(−½)≈39.35%, not 68%.`,values:[v("Correlation",rho),v("Determinant",1-rho*rho),v("Radius-1 coverage",1-Math.exp(-0.5)),v("Radius-2 coverage",1-Math.exp(-2))]};
  }
  if (model === "dist-poisson") {
    // Sum the small tail directly: 1 - sum(shown) loses tiny probabilities.
    // With λ≤10, the remaining tail beyond 100 is negligible at this precision.
    const mass=poissonMass(input,100),points=mass.slice(0,31),tail=mass.slice(31).reduce((s,[,p])=>s+p,0);
    return {...base,kind:"bars",xDomain:[-0.5,30.5],yDomain:[0,Math.max(...points.map(([,p])=>p))*1.1],xLabel:"Event count k in one interval",yLabel:"Probability mass",series:[{label:"Poisson probabilities (k=0…30)",points}],summary:`Expected count λ=${input}. Mean and variance both equal λ; P(K=0)=${f(Math.exp(-input))}. Probability above 30 is approximately ${tail.toExponential(2)}; displayed bars are not renormalized.`,values:[v("Mean",input,"events"),v("Variance",input,"events²"),v("Omitted upper-tail probability",tail),...points.map(([k,p])=>v(`P(K=${k})`,p))]};
  }
  if (model === "dist-geometric") {
    const p=input,points:Point[]=Array.from({length:40},(_,i)=>[i+1,p*(1-p)**i]);
    return {...base,kind:"bars",xDomain:[0.5,40.5],xLabel:"Trial number of first success K",yLabel:"Probability mass",series:[{label:"Geometric trials-to-first-success PMF",points}],summary:`Success chance p=${p}: mean first-success trial=${f(1/p)}, P(K>40)=${f((1-p)**40)}. The tail is omitted, not renormalized. This convention starts at trial 1, not zero failures.`,values:[v("Success probability",p),v("Mean trial",1/p),v("Variance",(1-p)/p**2),v("P(K>40)",(1-p)**40),...points.map(([k,p])=>v(`P(K=${k})`,p))]};
  }
  if (model === "dist-exponential") {
    const rate=input,pdf=(t:number)=>rate*Math.exp(-rate*t);
    return {...base,xDomain:[0,12],yDomain:[0,3.2],xLabel:"Waiting time t (seconds)",yLabel:"Density (per second)",series:[{label:`Exponential wait, rate ${rate}/s`,points:curve(0,12,pdf)}],shaded:[[0,0],...curve(0,1,pdf,40),[1,0]],summary:`Rate=${rate}/s; mean wait=${f(1/rate)}s. P(T≤1s)=${f(1-Math.exp(-rate))}. P(T>12s)=${f(Math.exp(-12*rate))} lies outside the window.`,values:[v("Rate",rate,"per second"),v("Mean wait",1/rate,"seconds"),v("Variance",1/rate**2,"seconds²"),v("P(T≤1)",1-Math.exp(-rate)),v("P(T>12)",Math.exp(-12*rate))]};
  }
  if (model === "dist-gamma") {
    const k=input;
    return {...base,xDomain:[0,18],yDomain:[0,1.05],xLabel:"Waiting time t (seconds)",yLabel:"Density (per second)",series:[{label:`Wait for arrival ${k}, rate 1/s`,points:curve(0,18,x=>gammaPDF(x,k))}],summary:`Shape k=${k}, rate=1/s: mean=${k}s, variance=${k}s², mode=${k-1}s. This integer-shape Erlang example sums ${k} independent rate-1 exponential waits. The tail continues beyond 18s.`,values:[v("Shape",k),v("Rate",1,"per second"),v("Mean",k,"seconds"),v("Variance",k,"seconds²"),v("Mode",k-1,"seconds")]};
  }
  if (model === "dist-beta" || model === "dist-dirichlet") {
    const a=input,b=model==="dist-beta"?2:2*input,points=curve(0,1,x=>betaPDF(x,a,b));
    const mean=a/(a+b),variance=a*b/((a+b)**2*(a+b+1));
    return {...base,yDomain:[0,Math.max(...points.map(([,y])=>y))*1.12],xLabel:model==="dist-beta"?"Probability parameter p":"First simplex component p₁",yLabel:"Density (per unit probability)",series:[{label:model==="dist-beta"?`Beta(${a},2)`:`Marginal p₁ ~ Beta(${a},${b}); not joint density`,points}],summary:model==="dist-beta"?`α=${a}, β=2: mean=${f(mean)}, variance=${f(variance)}. Density height is not the chance of that exact parameter value.`:`Dirichlet(${a},${a},${a}) keeps each mean at 1/3. The plotted marginal variance is ${f(variance)}. Higher concentration narrows uncertainty; p₁+p₂+p₃=1 still holds.`,values:[v("α",a),v("Marginal β",b),v("Mean",mean),v("Variance",variance),...(model==="dist-dirichlet"?[v("Total concentration",3*a),v("Cov(p₁,p₂)",-1/(9*(3*a+1)))]:[])]};
  }
  if (model === "dist-lognormal") {
    const sigma=input;
    return {...base,xDomain:[0,12],yDomain:[0,1.8],xLabel:"Positive multiplicative factor x",yLabel:"Density (per factor unit)",series:[{label:`exp(Z), Z~Normal(0,${f(sigma*sigma)})`,points:curve(0,12,x=>lognormalPDF(x,sigma),480)}],summary:`Log-space σ=${sigma}: median=1, mean=${f(Math.exp(sigma*sigma/2))}, mode=${f(Math.exp(-sigma*sigma))}. The right tail extends beyond x=12.`,values:[v("Log-space mean",0),v("Log-space standard deviation",sigma),v("Median",1),v("Mean",Math.exp(sigma*sigma/2)),v("Mode",Math.exp(-sigma*sigma)),v("Variance",Math.expm1(sigma*sigma)*Math.exp(sigma*sigma))]};
  }
  if (model === "dist-student") {
    const nu=input;
    return {...base,xDomain:[-6,6],yDomain:[0,0.45],xLabel:"Standard t variate (dimensionless)",yLabel:"Density",series:[{label:`Student t, ν=${nu} (scale 1)`,points:curve(-6,6,x=>studentPDF(x,nu))},{label:"Standard normal reference",points:curve(-6,6,x=>normalPDF(x))}],summary:`ν=${nu}. ${nu===1?"The mean is undefined (Cauchy case).":"The mean is 0."} ${nu<=2?"No finite variance exists.":`Variance=${f(nu/(nu-2))}, not 1.`} Both curves have continuing tails; they share scale, not variance.`,values:[v("Degrees of freedom",nu),v("Scale",1),v("Density at zero",studentPDF(0,nu)),...(nu>1?[v("Mean",0)]:[]),...(nu>2?[v("Variance",nu/(nu-2))]:[])]};
  }
  const scale=input,euler=0.5772156649015329;
  return {...base,xDomain:[-6,12],yDomain:[0,0.8],xLabel:"Value x (measurement units)",yLabel:"Density (per measurement unit)",series:[{label:"Right-skewed Gumbel for maxima, location 0",points:curve(-6,12,x=>{const z=x/scale;return Math.exp(-z-Math.exp(-z))/scale;})}],summary:`Scale β=${scale}, location=mode=0. Mean=${f(euler*scale)} and median=${f(-scale*Math.log(Math.log(2)))} differ from the mode. Support is all real numbers; both tails continue outside the plot.`,values:[v("Scale β",scale),v("Mode",0),v("Mean",euler*scale),v("Median",-scale*Math.log(Math.log(2))),v("Variance",Math.PI**2*scale*scale/6)]};
}
