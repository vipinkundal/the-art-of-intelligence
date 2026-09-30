import type { CalculationResult } from "./calculations.ts";
import { foundationOverviewModels, isFoundationOverviewModel, calculateFoundationOverview } from "./foundation-overviews.ts";
import { calculateClassicalOverview } from "./classical-overview.ts";

export const sectionOverviewModels = ["overview-schedule", "overview-shear", "overview-local-model", "overview-soft-threshold", "overview-noisy-channel", ...foundationOverviewModels] as const;
export type SectionOverviewModel = typeof sectionOverviewModels[number];
export const isSectionOverviewModel = (model:string):model is SectionOverviewModel => (sectionOverviewModels as readonly string[]).includes(model);
const value=(label:string,value:number,unit="")=>({label,value,unit});
const entropy=(p:number)=>p===0||p===1?0:-p*Math.log2(p)-(1-p)*Math.log2(1-p);
const clean=(n:number)=>Number(n.toFixed(6));

export function calculateSectionOverview(model:SectionOverviewModel,input:number):CalculationResult {
  if(model==="overview-schedule")return calculateClassicalOverview(input);
  if(isFoundationOverviewModel(model)) return calculateFoundationOverview(model,input);
  const bounds = model==="overview-shear"?[-2,2]:model==="overview-local-model"?[-1,1]:model==="overview-soft-threshold"?[0,5]:[0,.5];
  if(!Number.isFinite(input)||input<bounds[0]||input>bounds[1]) throw new Error(`Invalid ${model} input`);
  if(model==="overview-shear") {
    const square:[number,number][]=[[0,0],[1,0],[1,1],[0,1],[0,0]];
    const transformed=square.map(([x,y]):[number,number]=>[x+input*y,y]);
    const length=Math.hypot(input,1),angle=Math.acos(input/length)*180/Math.PI;
    return {kind:"lines",equalAspect:true,controlValue:`Shear s=${clean(input)}`,
      series:[{label:"Original unit square",points:square},{label:"Transformed parallelogram",points:transformed}],xLabel:"First coordinate",yLabel:"Second coordinate",xDomain:[(1+input)/2-1.75,(1+input)/2+1.75],yDomain:[-1.25,2.25],
      matrices:[{label:"Transformation S",entries:[[1,input],[0,1]]},{label:"Images of the basis vectors",rowLabels:["S e₁","S e₂"],columnLabels:["x","y"],entries:[[1,0],[input,1]]},{label:"Gram matrix SᵀS: records transformed inner products",entries:[[1,input],[input,1+input*input]]}],
      summary:`The square becomes a parallelogram of area 1 because det(S)=1. Its edges S e₁=(1,0) and S e₂=(${clean(input)},1) have lengths 1 and ${clean(length)}, with angle ${clean(angle)}°. Their dot product is ${clean(input)}. Rank stays 2 and the map is invertible for every displayed s. ${input===0?"At s=0 it is the identity and preserves Euclidean geometry.":"Area is preserved, but angles and lengths are not generally preserved."} Both axes use the same coordinate scale.`,
      values:[value("Signed area multiplier det(S)",1),value("Rank",2),value("Length of S e₂",length),value("Angle between mapped basis vectors",angle,"degrees"),value("Mapped inner product",input)]};
  }
  if(model==="overview-local-model") {
    const samples=Array.from({length:81},(_,i)=>-1+i/40),loss=1+4*input*input;
    return {kind:"lines",controlValue:`h=${clean(input)} · w=(${clean(1+input)}, ${clean(input)})`,
      series:[{label:"Actual loss along v",points:samples.map(h=>[h,1+4*h*h])},{label:"First-order local prediction",points:samples.map(h=>[h,1])}],xLabel:"Displacement h along v=(1,1)",yLabel:"Squared-error loss",xDomain:[-1,1],yDomain:[0,5.5],selectedX:input,
      matrices:[{label:"A",entries:[[1,1],[0,2]]},{label:"At the base point w₀=(1,0)",rowLabels:["residual Aw₀−b","gradient Aᵀr","direction v","forward Av"],columnLabels:["first","second"],entries:[[1,-1],[1,-1],[1,1],[2,2]]},{label:"Hessian AᵀA",entries:[[1,1],[1,5]]}],
      summary:`At w₀=(1,0), loss is 1 and gradient is (1,−1), which is not zero. Along v=(1,1), the first derivative is (1,−1)·(1,1)=0. Moving h=${clean(input)} gives true loss ${clean(loss)}; the first-order prediction remains 1, with exact remainder ${clean(4*input*input)}=4h². The directional curvature is vᵀHv=8. A flat tangent in one direction does not make w₀ a stationary point in the full plane.`,
      values:[value("Actual loss",loss),value("First-order prediction",1),value("Second-order remainder",4*input*input),value("Directional derivative at w₀",0),value("Directional curvature vᵀHv",8),value("Gradient norm at w₀",Math.SQRT2)]};
  }
  if(model==="overview-soft-threshold") {
    const optimum=Math.max(3-input,0),data=(w:number)=>.5*(w-3)**2,penalty=(w:number)=>input*Math.abs(w),samples=Array.from({length:101},(_,i)=>-1+i*.05);
    return {kind:"lines",controlValue:`λ=${clean(input)} · minimizer w*=${clean(optimum)}`,
      series:[{label:"Data fit ½(w−3)²",points:samples.map(w=>[w,data(w)])},{label:"Penalty λ|w|",points:samples.map(w=>[w,penalty(w)])},{label:"Total objective",points:samples.map(w=>[w,data(w)+penalty(w)])}],xLabel:"Decision variable w",yLabel:"Objective contribution",xDomain:[-1,4],yDomain:[0,Math.max(8+input,4*input+.5)+.5],selectedX:optimum,
      markers:[{label:"Exact minimizer of total objective",point:[optimum,data(optimum)+penalty(optimum)]}],
      summary:`With λ=${clean(input)}, the exact minimizer is w*=${clean(optimum)}. Data-fit cost is ${clean(data(optimum))}, penalty is ${clean(penalty(optimum))}, and total is ${clean(data(optimum)+penalty(optimum))}. ${input<3?"The optimum remains positive and solves w−3+λ=0.":"At zero, the subgradient interval [−3−λ,−3+λ] contains zero, certifying the optimum despite the kink."} The slider changes the problem, not an optimizer's step size. A lower training-fit error alone does not minimize the penalized objective.`,
      values:[value("Exact minimizer w*",optimum),value("Data fit at w*",data(optimum)),value("Penalty at w*",penalty(optimum)),value("Total at w*",data(optimum)+penalty(optimum)),value("Left derivative at zero",-3-input),value("Right derivative at zero",-3+input)]};
  }
  const p=.25,q=p+(1-2*p)*input,hy=entropy(q),noise=entropy(input),mi=hy-noise,samples=Array.from({length:101},(_,i)=>i/200);
  return {kind:"lines",controlValue:`Bit-flip probability ε=${clean(input)}`,
    series:[{label:"Output uncertainty H(Y)",points:samples.map(e=>[e,entropy(p+(1-2*p)*e)])},{label:"Noise uncertainty H(Y|X)",points:samples.map(e=>[e,entropy(e)])},{label:"Shared information I(X;Y)",points:samples.map(e=>[e,entropy(p+(1-2*p)*e)-entropy(e)])}],xLabel:"Independent bit-flip probability ε",yLabel:"Information (bits)",xDomain:[0,.5],yDomain:[0,1.05],selectedX:input,
    matrices:[{label:"Joint probability P(X,Y)",rowLabels:["X=0","X=1"],columnLabels:["Y=0","Y=1"],entries:[[(1-p)*(1-input),(1-p)*input],[p*input,p*(1-input)]]}],
    summary:`X is one with probability 0.25. After independent bit flips at ε=${clean(input)}, P(Y=1)=${clean(q)}. Output entropy is ${clean(hy)} bits, conditional noise entropy is ${clean(noise)} bits, and their difference is ${clean(mi)} bits of mutual information. ${input===.5?"The output is maximally uncertain but independent of X: one bit of output entropy, zero bits about the input.":"Adding noise can increase output uncertainty while reducing information about the input."} These are exact population quantities under the stated binary channel, not estimates from a dataset.`,
    values:[value("P(Y=1)",q),value("Input entropy H(X)",entropy(p),"bits"),value("Output entropy H(Y)",hy,"bits"),value("Conditional entropy H(Y|X)",noise,"bits"),value("Mutual information I(X;Y)",mi,"bits"),value("Channel capacity (optimized input)",1-noise,"bits/use")]};
}
