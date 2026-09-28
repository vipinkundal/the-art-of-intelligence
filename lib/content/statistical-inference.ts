import type { CalculationResult } from "./calculations";
import { binomialMass } from "./probability-math.ts";
import { betaPDF, logGamma } from "./distributions.ts";

export const inferenceModels = ["stat-point", "stat-bias", "stat-mle", "stat-map", "stat-conjugate", "stat-predictive", "stat-test", "stat-power", "stat-bootstrap", "stat-se", "stat-multiple"] as const;
export type InferenceModel = typeof inferenceModels[number];
export const isInferenceModel = (model: string): model is InferenceModel => (inferenceModels as readonly string[]).includes(model);
type Point = [number, number];
const v = (label: string, value: number, unit = "") => ({label,value,unit});
const fmt = (value: number) => Number(value.toFixed(6));
const curve = (lo: number, hi: number, fn: (x: number) => number): Point[] => Array.from({length:201},(_,i)=>{const x=lo+(hi-lo)*i/200;return [x,fn(x)];});
export const binomialUpperTail = (n: number, p: number, cutoff: number) => binomialMass(n,p).filter(([k])=>k>=cutoff).reduce((sum,[,mass])=>sum+mass,0);
export function relativeBernoulliLikelihood(p: number, successes: number, failures: number): number {
  const total=successes+failures, mode=successes/total;
  if ((p===0&&successes>0)||(p===1&&failures>0)) return 0;
  const term=(count:number,prob:number)=>count===0?0:count*Math.log(prob);
  return Math.exp(term(successes,p)+term(failures,1-p)-term(successes,mode)-term(failures,1-mode));
}
export function betaBinomialMass(n: number, a: number, b: number): Point[] {
  const lb=(x:number,y:number)=>logGamma(x)+logGamma(y)-logGamma(x+y);
  return Array.from({length:n+1},(_,k)=>[k,Math.exp(logGamma(n+1)-logGamma(k+1)-logGamma(n-k+1)+lb(a+k,b+n-k)-lb(a,b))]);
}

export function calculateInference(model: InferenceModel, input: number): CalculationResult {
  const bounds: Record<InferenceModel,[number,number,boolean?]> = {"stat-point":[0,1],"stat-bias":[0,1],"stat-mle":[0,10,true],"stat-map":[1,10],"stat-conjugate":[0,10,true],"stat-predictive":[1,20,true],"stat-test":[0,11,true],"stat-power":[0.5,1],"stat-bootstrap":[0,8,true],"stat-se":[1,100,true],"stat-multiple":[1,100,true]};
  const [lo,hi,integer]=bounds[model];
  if(!Number.isFinite(input)||input<lo||input>hi||(integer&&!Number.isInteger(input)))throw new Error(`Invalid ${model} input`);
  const base:CalculationResult={kind:"lines",series:[],xDomain:[0,1],yDomain:[0,1.05],xLabel:"Probability p",yLabel:"Probability",summary:"",values:[]};
  if(model==="stat-point"){
    const p=input;
    return {...base,kind:"bars",xDomain:[-0.06,1.06],xLabel:"Estimator K/10",yLabel:"Sampling probability mass",selectedX:p,series:[{label:"Exact sampling distribution of the sample proportion",points:binomialMass(10,p).map(([k,m])=>[k/10,m])}],summary:`At true p=${p}, the estimator K/10 has expectation ${p} and MSE ${fmt(p*(1-p)/10)}. A particular sample with k=7 gives estimate 0.7; changing the unknown truth changes the sampling distribution, not that observed estimate.`,values:[v("True p",p),v("Observed estimate for k=7",0.7),v("E[K/10]",p),v("Bias",0),v("Variance and MSE",p*(1-p)/10)]};
  }
  if(model==="stat-bias"){
    const a=input,bias=0.3*(a-1),variance=0.016*a*a;
    return {...base,yDomain:[0,0.1],xLabel:"Weight a on sample proportion",yLabel:"Squared probability units",selectedX:a,series:[{label:"Squared bias",points:curve(0,1,x=>0.09*(1-x)**2)},{label:"Variance",points:curve(0,1,x=>0.016*x*x)},{label:"Mean squared error",points:curve(0,1,x=>0.09*(1-x)**2+0.016*x*x)}],summary:`Estimate a(K/10)+(1−a)0.5 with true p=0.8. At a=${a}, bias=${fmt(bias)}, variance=${fmt(variance)}, and MSE=${fmt(bias*bias+variance)}. A small bias can buy a larger reduction in variance; the best weight depends on the unknown truth.`,values:[v("Estimator expectation",0.5+0.3*a),v("Bias",bias),v("Squared bias",bias*bias),v("Variance",variance),v("MSE",bias*bias+variance),v("Unshrunk MSE",0.016)]};
  }
  if(model==="stat-mle"){
    const k=input;
    return {...base,yLabel:"Likelihood / maximum likelihood",selectedX:k/10,series:[{label:"Relative likelihood; not a parameter density",points:curve(0,1,p=>relativeBernoulliLikelihood(p,k,10-k))}],summary:`For k=${k} successes in 10 trials, the Bernoulli MLE is p̂=${k/10}. The curve varies the parameter while holding these data fixed. It is scaled to peak at 1, not normalized to integrate to 1.`,values:[v("Successes",k),v("Failures",10-k),v("MLE",k/10),v("Relative likelihood at p=0.5",relativeBernoulliLikelihood(0.5,k,10-k))]};
  }
  if(model==="stat-map"){
    const c=input,mode=(c+7)/(2*c+8),mean=(c+8)/(2*c+10);
    return {...base,yLabel:"Density relative to its own maximum",selectedX:mode,series:[{label:"Likelihood shape (peak normalized)",points:curve(0,1,p=>relativeBernoulliLikelihood(p,8,2))},{label:"Posterior shape (peak normalized)",points:curve(0,1,p=>relativeBernoulliLikelihood(p,c+7,c+1))}],summary:`Eight successes in ten trials with Beta(${c},${c}) prior give posterior Beta(${c+8},${c+2}). In p coordinates, MAP=${fmt(mode)}, posterior mean=${fmt(mean)}, and MLE=0.8. MAP is a density mode, not the most probable exact continuous value.`,values:[v("Prior shape c",c),v("Posterior alpha",c+8),v("Posterior beta",c+2),v("MAP in p coordinates",mode),v("Posterior mean",mean),v("MLE",0.8)]};
  }
  if(model==="stat-conjugate"){
    const k=input,a=2+k,b=13-k,prior=curve(0,1,p=>betaPDF(p,2,3)),posterior=curve(0,1,p=>betaPDF(p,a,b));
    return {...base,yDomain:[0,1.1*Math.max(...prior.map(p=>p[1]),...posterior.map(p=>p[1]))],yLabel:"Density per unit p",series:[{label:"Prior Beta(2,3)",points:prior},{label:`Posterior Beta(${a},${b})`,points:posterior}],summary:`k=${k} of 10 updates Beta(2,3) to Beta(${a},${b}). Posterior mean=${fmt(a/15)}=(5/15)×0.4+(10/15)×${k/10}. The graph's vertical scale follows the peak; both curves integrate to 1.`,values:[v("Prior mean",0.4),v("Observed proportion",k/10),v("Posterior alpha",a),v("Posterior beta",b),v("Posterior mean",a/15),v("Posterior variance",a*b/(15*15*16))]};
  }
  if(model==="stat-predictive"){
    const m=input,variance=m*0.24*(m+5)/6,plugin=m*0.24;
    const predictive=betaBinomialMass(m,3,2),plugIn=binomialMass(m,0.6);
    return {...base,kind:"bars",xDomain:[-0.7,m+0.7],yDomain:[0,Math.ceil(11*Math.max(...predictive.map(p=>p[1]),...plugIn.map(p=>p[1])))/10],xLabel:"Successes in the next m trials",yLabel:"Predictive probability mass",series:[{label:"Left: beta-binomial posterior predictive",points:predictive},{label:"Right: binomial plug-in at posterior mean 0.6",points:plugIn}],summary:`With p|data ~ Beta(3,2), ${m} future trials have mean ${fmt(0.6*m)} and variance ${fmt(variance)}. Plugging in p=0.6 gives variance ${fmt(plugin)}. The distributions agree for one trial, but shared parameter uncertainty increases count variance when m>1.`,values:[v("Future trials",m),v("Predictive mean",0.6*m,"successes"),v("Predictive variance",variance,"successes²"),v("Plug-in variance",plugin,"successes²"),v("Variance inflation factor",(m+5)/6),...predictive.flatMap(([k,p],i)=>[v(`Predictive P(K=${k})`,p),v(`Plug-in P(K=${k})`,plugIn[i][1])])]};
  }
  if(model==="stat-test"){
    const c=input,alpha=binomialUpperTail(10,0.5,c),power=binomialUpperTail(10,0.8,c);
    const nullMass=binomialMass(10,0.5),alternativeMass=binomialMass(10,0.8);
    return {...base,kind:"bars",xDomain:[-0.7,11.5],yDomain:[0,0.4],xLabel:"Success count K (reject if K ≥ c)",yLabel:"Probability mass",selectedX:c,series:[{label:"Left: null p=0.5",points:nullMass},{label:"Right: specified alternative p=0.8",points:alternativeMass}],summary:`Reject when K≥${c}: actual null rejection rate=${fmt(alpha)}, power at p=0.8=${fmt(power)}, and Type II error=${fmt(1-power)}. A nominal 5% upper-tail test uses c=9 here; discreteness makes its actual size about 1.07%.`,values:[v("Rejection cutoff",c),v("Actual Type I error",alpha),v("Power at p=0.8",power),v("Type II error at p=0.8",1-power),...nullMass.flatMap(([k,p],i)=>[v(`Null P(K=${k})`,p),v(`Alternative P(K=${k})`,alternativeMass[i][1])])]};
  }
  if(model==="stat-power"){
    const p=input,pvalue=binomialUpperTail(20,0.5,15),power=binomialUpperTail(20,p,15);
    return {...base,xLabel:"Assumed true success probability p",selectedX:p,series:[{label:"Power: Pp(K≥15), n=20",points:curve(0,1,p=>binomialUpperTail(20,p,15))},{label:"Null rejection rate",points:[[0,pvalue],[1,pvalue]]}],summary:`Observed k=15 of 20 gives one-sided p-value ${fmt(pvalue)} under p₀=0.5. For the prechosen rejection rule K≥15, power at true p=${p} is ${fmt(power)}. Changing the alternative changes power, not the observed p-value.`,values:[v("Observed successes",15),v("One-sided observed p-value",pvalue),v("Null rejection rate",pvalue),v("Specified alternative p",p),v("Power at specified alternative",power)]};
  }
  if(model==="stat-bootstrap"){
    const k=input,p=k/8,variance=p*(1-p)/8;
    return {...base,kind:"bars",xDomain:[-0.07,1.07],xLabel:"Bootstrap sample proportion K*/8",yLabel:"Conditional bootstrap probability",series:[{label:"Exact bootstrap distribution given the eight observations",points:binomialMass(8,p).map(([j,m])=>[j/8,m])}],selectedX:p,summary:`The observed data contain ${k} ones and ${8-k} zeros. Resampling eight rows with replacement gives K*~Binomial(8,${p}), bootstrap mean ${p}, and bootstrap SE ${fmt(Math.sqrt(variance))}. ${k===0||k===8?"This degenerate bootstrap does not prove the population has no uncertainty.":"Enumeration eliminates Monte Carlo noise, not error from estimating the population with eight rows."}`,values:[v("Observed successes",k),v("Observed sample size",8),v("Observed proportion",p),v("Bootstrap expectation",p),v("Bootstrap variance",variance),v("Bootstrap standard error",Math.sqrt(variance))]};
  }
  if(model==="stat-se"){
    const n=input;
    return {...base,xDomain:[1,100],yDomain:[0,11],xLabel:"Independent observations n",yLabel:"Standard deviation (units)",selectedX:n,series:[{label:"Population SD = 10",points:[[1,10],[100,10]]},{label:"SE of sample mean = 10/√n",points:curve(1,100,n=>10/Math.sqrt(n))}],summary:`For ${n} independent normal observations with population SD 10, the sample mean has SE=${fmt(10/Math.sqrt(n))}. Individual observations still have SD 10. Four times the sample size halves SE; it does not halve the population spread.`,values:[v("n",n),v("Population SD",10,"units"),v("SE of mean",10/Math.sqrt(n),"units"),v("Variance of mean",100/n,"units²")]};
  }
  const m=input,uncorrected=(n:number)=>-Math.expm1(n*Math.log1p(-0.05)),corrected=(n:number)=>-Math.expm1(n*Math.log1p(-0.05/n));
  return {...base,xDomain:[1,100],xLabel:"Number of tests m",yLabel:"Probability of ≥1 false rejection",selectedX:m,series:[{label:"Unadjusted 0.05 per test",points:Array.from({length:100},(_,i)=>[i+1,uncorrected(i+1)])},{label:"Bonferroni 0.05/m per test",points:Array.from({length:100},(_,i)=>[i+1,corrected(i+1)])}],summary:`For ${m} independent true nulls with uniform p-values, testing each at 0.05 gives family-wise error ${fmt(uncorrected(m))}. Bonferroni threshold ${fmt(0.05/m)} gives ${fmt(corrected(m))} here and controls family-wise error at ≤0.05 even under dependence when p-values are valid.`,values:[v("Tests",m),v("Unadjusted family-wise error",uncorrected(m)),v("Bonferroni threshold",0.05/m),v("Independent Bonferroni family-wise error",corrected(m)),v("General Bonferroni upper bound",0.05)]};
}
