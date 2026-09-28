import type { CalculationResult } from "./calculations";
import { binomialMass } from "./probability-math.ts";

export const probabilityModels = ["prob-events", "prob-variable", "prob-joint", "prob-independence", "prob-total", "prob-expectation", "prob-covariance", "prob-correlation", "prob-lln", "prob-clt", "prob-transform", "prob-conditional-mean", "prob-total-variance"] as const;
export type ProbabilityModel = typeof probabilityModels[number];
export const isProbabilityModel = (model: string): model is ProbabilityModel => (probabilityModels as readonly string[]).includes(model);
type Point = [number, number];
const v = (label: string, value: number, unit = "") => ({ label, value, unit });
const fmt = (x: number) => Number(x.toFixed(5));
const curve = (lo: number, hi: number, fn: (x: number) => number): Point[] => Array.from({ length: 121 }, (_, i) => { const x = lo + (hi-lo)*i/120; return [x, fn(x)]; });

// Normal CDF approximation (absolute error below 7.5e-8), not a simulation.
export function standardNormalCDF(x: number): number {
  if (x === 0) return 0.5;
  const a = Math.abs(x), t = 1/(1+0.2316419*a);
  const tail = Math.exp(-a*a/2)/Math.sqrt(2*Math.PI)*t*(0.319381530+t*(-0.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));
  return x > 0 ? 1-tail : tail;
}

export function standardizedBinomial(n: number, p = 0.3) {
  const sd = Math.sqrt(n*p*(1-p));
  let cumulative = 0, distance = 0;
  const jumps = binomialMass(n,p).map(([k,mass]) => {
    const z = (k-n*p)/sd, left = cumulative;
    cumulative += mass;
    distance = Math.max(distance, Math.abs(left-standardNormalCDF(z)), Math.abs(cumulative-standardNormalCDF(z)));
    return {z, left, right:cumulative, mass};
  });
  const atLeft = jumps.filter(j => j.z <= -4).reduce((s,j) => s+j.mass,0);
  const points: Point[] = [[-4,atLeft]];
  for (const j of jumps) if (j.z > -4 && j.z <= 4) points.push([j.z,j.left],[j.z,j.right]);
  points.push([4,jumps.filter(j => j.z <= 4).reduce((s,j)=>s+j.mass,0)]);
  return { points, distance, jumps };
}

export function calculateProbability(model: ProbabilityModel, input: number): CalculationResult {
  const bounds: Record<ProbabilityModel,[number,number,boolean?]> = {
    "prob-events":[1,6,true], "prob-variable":[0,1], "prob-joint":[0,0.4], "prob-independence":[0,1], "prob-total":[0,1], "prob-expectation":[0,1], "prob-covariance":[-2,2], "prob-correlation":[-2,2], "prob-lln":[1,100,true], "prob-clt":[1,100,true], "prob-transform":[0,1], "prob-conditional-mean":[0.1,0.9], "prob-total-variance":[0,6],
  };
  const [lo,hi,integer] = bounds[model];
  if (!Number.isFinite(input) || input<lo || input>hi || (integer && !Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = {kind:"bars",series:[],xDomain:[-0.5,1.5],yDomain:[0,1],xLabel:"Outcome",yLabel:"Probability mass",summary:"",values:[]};
  if (model === "prob-events") {
    const n=input, intersection=Math.floor(n/2)/6, union=0.5+n/6-intersection;
    return {...base,xDomain:[0.5,6.5],xLabel:"Fair die face",series:[{label:`Event B: face ≤ ${n}; unselected faces omitted`,points:Array.from({length:6},(_,i)=>[i+1,i+1<=n?1/6:0])}],summary:`A={2,4,6}, B={1,…,${n}}. P(A∩B)=${fmt(intersection)}; P(A∪B)=${fmt(union)}. Subtract the overlap once. Bars show only outcomes in B, not a renormalized conditional distribution.`,values:[v("P(A)",0.5),v("P(B)",n/6),v("P(A∩B)",intersection),v("P(A∪B)",union),v("P(Bᶜ)",1-n/6)]};
  }
  if (model === "prob-variable") {
    const p=input;
    return {...base,xDomain:[-0.5,2.5],xLabel:"Number of heads X",series:[{label:"Pushforward probabilities of X",points:binomialMass(2,p)}],matrices:[{label:"Rows TT, TH, HT, HH; columns head count, probability",entries:[[0,(1-p)**2],[1,p*(1-p)],[1,p*(1-p)],[2,p*p]]}],summary:`Two independent flips with P(H)=${p}. Both TH and HT map to X=1, so P(X=1)=2p(1−p)=${fmt(2*p*(1-p))}. Outcomes and variable values are different objects.`,values:[v("P(X=0)",(1-p)**2),v("P(X=1)",2*p*(1-p)),v("P(X=2)",p*p),v("E[X]",2*p)]};
  }
  if (model === "prob-joint") {
    const q=input, joint=[[0.1+q,0.5-q],[0.4-q,q]];
    return {...base,xLabel:"X conditional on Y=1",series:[{label:"P(X=x | Y=1)",points:[[0,1-2*q],[1,2*q]]}],matrices:[{label:"Joint PMF: rows X=0,1; columns Y=0,1",entries:joint},{label:"Marginal PMFs: row X then Y; columns value 0,1",entries:[[0.6,0.4],[0.5,0.5]]}],summary:`P(X=1,Y=1)=${q}. Marginals stay P(X=1)=0.4 and P(Y=1)=0.5; conditioning divides the Y=1 column by 0.5, giving P(X=1|Y=1)=${fmt(2*q)}. Independence occurs only at q=0.2.`,values:[v("Joint P(1,1)",q),v("P(X=1)",0.4),v("P(Y=1)",0.5),v("P(X=1|Y=1)",2*q),v("Cov(X,Y)",q-0.2)]};
  }
  if (model === "prob-independence") {
    const w=input, marginal=0.2+0.6*w, both=0.04+0.6*w, covariance=0.36*w*(1-w);
    return {...base,kind:"lines",xDomain:[0,1],yDomain:[0,0.1],xLabel:"Mixture weight w=P(Z=1)",yLabel:"Marginal covariance",selectedX:w,series:[{label:"Cov(X,Y) after hiding Z",points:curve(0,1,w=>0.36*w*(1-w))},{label:"Cov(X,Y | Z=z)=0 in either group",points:[[0,0],[1,0]]}],matrices:[{label:"Marginal joint PMF: rows X=0,1; columns Y=0,1",entries:[[0.64-0.6*w,0.16],[0.16,both]]}],summary:`Given Z, X and Y are independent Bernoulli(.2) in group 0 and Bernoulli(.8) in group 1. At w=${w}, P(X=1,Y=1)=${fmt(both)} versus P(X=1)P(Y=1)=${fmt(marginal*marginal)}. Hiding Z produces covariance ${fmt(covariance)}.`,values:[v("Group-1 weight",w),v("P(X=1)",marginal),v("P(X=1,Y=1)",both),v("Product of marginals",marginal*marginal),v("Marginal covariance",covariance),v("Within-group covariance",0)]};
  }
  if (model === "prob-total") {
    const w=input,a=(1-w)*0.1,b=w*0.7;
    return {...base,xLabel:"Group code: 0=A, 1=B",yLabel:"Joint contribution to event E",series:[{label:"P(E | group) × P(group)",points:[[0,a],[1,b]]}],summary:`P(B)=${w}: group A contributes ${fmt(a)}, group B contributes ${fmt(b)}. P(E)=${fmt(a+b)} is their sum, not the unweighted average of rates 0.1 and 0.7.`,values:[v("P(A)",1-w),v("P(B)",w),v("P(E∩A)",a),v("P(E∩B)",b),v("P(E)",a+b)]};
  }
  if (model === "prob-expectation") {
    const p=input,mean=3+3*p,second=11+25*p;
    return {...base,xDomain:[0.5,6.5],xLabel:"Outcome value X",selectedX:mean,series:[{label:"Outcome probabilities; vertical marker is E[X]",points:Array.from({length:6},(_,i)=>[i+1,i===5?p:(1-p)/5])}],summary:`P(X=6)=${p}; values 1…5 share the rest equally. E[X]=${fmt(mean)} while E[X²]=${fmt(second)} and (E[X])²=${fmt(mean*mean)}. The mean need not be a possible outcome.`,values:[v("E[X]",mean),v("E[X²]",second),v("(E[X])²",mean*mean),v("Variance",second-mean*mean)]};
  }
  if (model === "prob-covariance") {
    const a=input,points:Point[]=[[-1,-a-1],[-1,-a+1],[1,a-1],[1,a+1]];
    return {...base,kind:"scatter",xDomain:[-1.5,1.5],yDomain:[-3.5,3.5],xLabel:"X (units)",yLabel:"Y=aX+ε (units)",series:[{label:"Four equally likely (X,Y) pairs",points}],summary:`X and ε are independent fair ±1 variables; Y=${a}X+ε. Cov(X,Y)=${a}; Var(Y)=${fmt(a*a+1)}. Var(X+Y)=${fmt((1+a)**2+1)} includes the covariance term 2a.`,values:[v("Var(X)",1,"units²"),v("Var(Y)",a*a+1,"units²"),v("Cov(X,Y)",a,"units²"),v("Var(X+Y)",(1+a)**2+1,"units²"),v("Var(X)+Var(Y)",a*a+2,"units²"),...points.map(([x,y],i)=>v(`Outcome ${i+1}: Y at X=${x}`,y,"units"))]};
  }
  if (model === "prob-correlation") {
    const a=input,variance=2.8+2*a*a,rho=2*a/Math.sqrt(2*variance);
    return {...base,kind:"scatter",xDomain:[-2.5,2.5],yDomain:[-1.5,8.5],xLabel:"X, equally likely in {−2,−1,0,1,2}",yLabel:"Y=X²+aX",series:[{label:"Deterministic nonlinear dependence",points:[-2,-1,0,1,2].map(x=>[x,x*x+a*x])}],summary:`a=${a}: Pearson ρ=${fmt(rho)}. Every Y is determined by X; at a=0 the correlation is zero despite complete deterministic dependence. Pearson correlation measures linear association, not all dependence.`,values:[v("E[X]",0),v("E[Y]",2),v("Var(X)",2),v("Var(Y)",variance),v("Cov(X,Y)",2*a),v("Pearson correlation",rho)]};
  }
  if (model === "prob-lln") {
    const n=input,mass=binomialMass(n,0.3),tail=mass.filter(([k])=>Math.abs(k/n-0.3)>=0.2-1e-12).reduce((s,[,p])=>s+p,0);
    return {...base,xDomain:[-0.03,1.03],yDomain:[0,Math.max(...mass.map(([,p])=>p))*1.1],xLabel:"Sample mean K/n",selectedX:0.3,series:[{label:"Exact distribution of average Bernoulli(.3) trials",points:mass.map(([k,p])=>[k/n,p])}],summary:`n=${n}: Var(mean)=0.21/n=${fmt(0.21/n)}. Exact P(|mean−0.3|≥0.2)=${fmt(tail)}; Chebyshev upper bound=${fmt(Math.min(1,0.21/(n*0.04)))}. This is an exact finite-sample distribution, not a guaranteed path of convergence.`,values:[v("n",n),v("E[mean]",0.3),v("Var(mean)",0.21/n),v("SD(mean)",Math.sqrt(0.21/n)),v("Exact deviation probability",tail),v("Chebyshev upper bound",Math.min(1,0.21/(n*0.04)))]};
  }
  if (model === "prob-clt") {
    const n=input,{points,distance}=standardizedBinomial(n);
    return {...base,kind:"lines",xDomain:[-4,4],xLabel:"z=(K−0.3n)/√(0.21n)",yLabel:"Cumulative probability",series:[{label:"Exact standardized binomial CDF",points},{label:"Standard normal CDF (numerical approximation)",points:curve(-4,4,standardNormalCDF)}],summary:`n=${n}: the standardized sum has mean 0 and variance 1. Its discrete CDF approaches the normal CDF; the largest CDF gap over all jumps is approximately ${fmt(distance)}. The original Bernoulli observations do not become Gaussian.`,values:[v("n",n),v("Standardized mean",0),v("Standardized variance",1),v("Skewness",0.4/Math.sqrt(0.21*n)),v("Maximum CDF gap (approximate)",distance)]};
  }
  if (model === "prob-transform") {
    const t=input;
    return {...base,kind:"lines",xDomain:[0,1],yDomain:[0,2.1],xLabel:"Transformed value y=√x",yLabel:"Density fY(y)",selectedX:t,series:[{label:"fY(y)=2y on [0,1]",points:[[0,0],[1,2]]}],shaded:[[0,0],[t,2*t],[t,0]],summary:`Y=√X with X~Uniform(0,1). P(Y≤${t})=P(X≤${fmt(t*t)})=${fmt(t*t)}. The inverse derivative dx/dy=2y converts uniform density into an increasing density; Y is not uniform.`,values:[v("Threshold y",t),v("Preimage threshold x",t*t),v("P(Y≤y)",t*t),v("Density at y",2*t),v("E[Y]",2/3)]};
  }
  if (model === "prob-conditional-mean") {
    const w=input,mean=1+4*w;
    return {...base,xDomain:[-0.5,6.5],xLabel:"Outcome Y",selectedX:mean,series:[{label:"Marginal PMF; marker is unconditional mean",points:[[0,(1-w)/2],[2,(1-w)/2],[4,w/2],[6,w/2]]}],matrices:[{label:"Rows Z=0,1; columns P(Z), E[Y|Z], Var(Y|Z)",entries:[[1-w,1,1],[w,5,1]]}],summary:`P(Z=1)=${w}. E[Y|Z] takes value 1 or 5; it is a random variable before Z is observed. E[E[Y|Z]]=(1−w)·1+w·5=${fmt(mean)}=E[Y].`,values:[v("P(Z=1)",w),v("E[Y|Z=0]",1),v("E[Y|Z=1]",5),v("E[E[Y|Z]]",mean),v("E[Y]",mean)]};
  }
  const d=input,between=d*d/4;
  return {...base,kind:"lines",xDomain:[0,6],yDomain:[0,10.5],xLabel:"Separation δ between group means (units)",yLabel:"Variance (units²)",selectedX:d,series:[{label:"Total: 1+δ²/4",points:curve(0,6,x=>1+x*x/4)},{label:"Between-group: δ²/4",points:curve(0,6,x=>x*x/4)},{label:"Within-group: 1",points:[[0,1],[6,1]]}],summary:`Two equally weighted groups have means 0 and δ=${d}, each with variance 1. Total variance=${fmt(1+between)} = within-group 1 + between-group ${fmt(between)}. Averaging the two variances alone misses the separation.`,values:[v("E[Var(Y|Z)]",1,"units²"),v("Var(E[Y|Z])",between,"units²"),v("Var(Y)",1+between,"units²"),v("E[Y]",d/2,"units")]};
}
