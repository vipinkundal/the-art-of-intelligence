import type { CalculationResult } from "./calculations.ts";
export const factorInferenceModels = ["factor-graph", "factor-mrf", "factor-exact", "factor-elimination"] as const;
export type FactorInferenceModel = typeof factorInferenceModels[number];
export const isFactorInferenceModel = (model:string):model is FactorInferenceModel => (factorInferenceModels as readonly string[]).includes(model);
type Point=[number,number];
type Factor={scope:string[];data:number[]};
const value=(label:string,value:number,unit="")=>({label,value,unit});
const fmt=(v:number)=>Number(v.toFixed(6));
const node=(id:string,x:number,y:number)=>({id,label:id,x,y,observed:false,state:""});
const edge=(from:string,to:string)=>({from,to,directed:false});
const bits=(n:number,length:number)=>Array.from({length},(_,i)=>(n>>(length-i-1))&1);
const factorAt=(f:Factor,assignment:Record<string,number>)=>f.data[f.scope.reduce((index,key)=>index*2+assignment[key],0)];
function eliminate(factors:Factor[],variable:string) {
  const bucket=factors.filter(f=>f.scope.includes(variable));
  const scope=[...new Set(bucket.flatMap(f=>f.scope))], remaining=scope.filter(v=>v!==variable);
  const result:Factor={scope:remaining,data:Array(2**remaining.length).fill(0)};
  for(let i=0;i<2**scope.length;i++) {
    const assignment=Object.fromEntries(scope.map((v,j)=>[v,bits(i,scope.length)[j]]));
    const index=remaining.reduce((n,v)=>n*2+assignment[v],0);
    result.data[index]+=bucket.reduce((p,f)=>p*factorAt(f,assignment),1);
  }
  return {factors:[...factors.filter(f=>!f.scope.includes(variable)),result],result,productCells:2**scope.length};
}
function eliminationRun(order:string[]) {
  let factors:Factor[]=[{scope:["H"],data:[1,1]},{scope:["A"],data:[1,2]},{scope:["B"],data:[2,1]},{scope:["C"],data:[1,3]},...["A","B","C","Q"].map(v=>({scope:["H",v],data:[3,1,1,3]}))];
  const steps=order.map(variable=>{const step=eliminate(factors,variable);factors=step.factors;return {variable,...step};});
  const weights=[0,1].map(Q=>factors.reduce((p,f)=>p*factorAt(f,{Q}),1));
  return {steps,weights,normalizer:weights[0]+weights[1]};
}
export function calculateFactorInference(model:FactorInferenceModel,input:number):CalculationResult {
  const bounds:Record<FactorInferenceModel,[number,number]>={"factor-graph":[0.25,4],"factor-mrf":[-1,1],"factor-exact":[1,60],"factor-elimination":[0,1]};
  if(!Number.isFinite(input)||input<bounds[model][0]||input>bounds[model][1]||((model==="factor-elimination"||model==="factor-exact")&&!Number.isInteger(input)))throw new Error(`Invalid ${model} input`);
  const base:CalculationResult={kind:"lines",series:[],xDomain:[0,1],yDomain:[0,1],xLabel:"Parameter",yLabel:"Probability",summary:"",values:[]};
  if(model==="factor-graph") {
    const a=input, marginal=(t:number)=>[t/(1+t),(1+3*t)/(4*(1+t)),(5+7*t)/(12*(1+t))];
    const m=marginal(a);
    return {...base,xDomain:[0.25,4],xLabel:"Unary weight ratio a on X",yLabel:"Marginal probability of value 1",selectedX:a,
      graph:{title:"Circles are variables; squares are factors",height:180,summary:"f touches only X; g touches X and Y; h touches Y and Z. Edges indicate factor scope, not causal direction or a message schedule.",nodes:[node("X",40,50),node("Y",160,50),node("Z",280,50),{...node("f",40,135),kind:"factor"},{...node("g",100,50),kind:"factor"},{...node("h",220,50),kind:"factor"}],edges:[edge("f","X"),edge("g","X"),edge("g","Y"),edge("h","Y"),edge("h","Z")]},
      series:["X","Y","Z"].map((v,j)=>({label:`P(${v}=1)`,points:Array.from({length:76},(_,i):Point=>{const t=0.25+i*0.05;return[t,marginal(t)[j]];})})),
      matrices:[{label:"Unary factor f(X)",rowLabels:["weight"],columnLabels:["X=0","X=1"],entries:[[1,a]]},{label:"Pair factor g(X,Y)",rowLabels:["X=0","X=1"],columnLabels:["Y=0","Y=1"],entries:[[3,1],[1,3]]},{label:"Pair factor h(Y,Z)",rowLabels:["Y=0","Y=1"],columnLabels:["Z=0","Z=1"],entries:[[2,1],[1,2]]}],
      summary:`At unary ratio a=${fmt(a)}, the partition function is 12(1+a)=${fmt(12*(1+a))}. Marginals are P(X=1)=${fmt(m[0])}, P(Y=1)=${fmt(m[1])}, and P(Z=1)=${fmt(m[2])}. The factors are unnormalized weights; multiplying them and normalizing defines the joint.`,
      values:[value("Partition function",12*(1+a)),...m.map((p,i)=>value(`P(${["X","Y","Z"][i]}=1)`,p))]};
  }
  if(model==="factor-mrf") {
    const j=input,z=2*Math.exp(3*j)+6*Math.exp(-j),same=2*Math.exp(3*j)/z,pair=(4*same-1)/3;
    return {...base,xDomain:[-1,1],xLabel:"Interaction strength J (dimensionless)",yLabel:"Probability all three spins agree",selectedX:j,
      graph:{title:"A triangle cannot disagree on every edge",height:205,summary:"Each undirected edge contributes exp(J·sᵢsⱼ), with spins s∈{−1,+1}. Positive J rewards agreement; negative J rewards disagreement. The model has no external field.",nodes:[node("X",160,40),node("Y",55,155),node("Z",265,155)],edges:[edge("X","Y"),edge("Y","Z"),edge("Z","X")]},
      series:[{label:"P(all equal): exact enumeration of 8 states",points:Array.from({length:101},(_,i):Point=>{const t=-1+i*.02;return[t,1/(1+3*Math.exp(-4*t))];})}],markers:[{label:"Current all-equal probability",point:[j,same]}],
      matrices:[{label:"Two state classes (weight is per assignment)",rowLabels:["all equal","one differs"],columnLabels:["count","weight","total P"],entries:[[2,Math.exp(3*j),same],[6,Math.exp(-j),1-same]]}],
      summary:`At J=${fmt(j)}, Z=${fmt(z)} and P(all equal)=${fmt(same)}. Every single-spin marginal remains P(sᵢ=+1)=0.5 by global sign symmetry, while E[sᵢsⱼ]=${fmt(pair)}. For J<0, the triangle is frustrated: at least one edge must agree in every assignment.`,
      values:[value("Partition function",z),value("P(all equal)",same),value("Single-spin P(+1)",0.5),value("Pair spin product E[sᵢsⱼ]",pair),value("Expected number of disagreeing edges",2*(1-same))]};
  }
  if(model==="factor-exact") {
    const weights=[35,34,1,input],z=70+input,p=weights.map(w=>w/z),x=p[2]+p[3],y=p[1]+p[3];
    const modes=weights.flatMap((w,i)=>w===Math.max(...weights)?[bits(i,2).join("")]:[]);
    const xm=x>0.5?1:0,ym=y>0.5?1:0,chosen=2*xm+ym;
    return {...base,kind:"bars",xDomain:[-0.5,3.5],xTicks:[0,1,2,3],xTickLabels:["00","01","10","11"],yDomain:[0,0.6],xLabel:"Joint assignment (X,Y)",yLabel:"Normalized joint probability",
      series:[{label:"P(X,Y): all four assignments",points:p.map((v,i):Point=>[i,v])}],
      matrices:[{label:"Joint P(X,Y)",rowLabels:["X=0","X=1"],columnLabels:["Y=0","Y=1"],entries:[p.slice(0,2),p.slice(2)]}],
      summary:`Weights (35,34,1,${input}) sum to ${z}. The joint MAP assignment${modes.length>1?"s are":" is"} ${modes.join(" and ")}. Choosing marginal modes separately gives ${xm}${ym}, with joint probability ${fmt(p[chosen])}; P(X=1)=${fmt(x)} and P(Y=1)=${fmt(y)}. ${x===0.5||y===0.5?"At a marginal tie this display chooses 0.":"Marginal decisions and the most probable joint assignment answer different questions."}`,
      values:[value("Normalizer",z),value("P(X=1)",x),value("P(Y=1)",y),value("Highest joint probability",Math.max(...p)),value("Joint probability of separate marginal modes",p[chosen]),value("P(X=1 | Y=1)",input/(34+input))]};
  }
  const order=input===0?["A","B","C","H"]:["H","A","B","C"],run=eliminationRun(order),first=run.steps[0].result;
  const split=Math.floor(first.scope.length/2),rowVars=first.scope.slice(0,split),colVars=first.scope.slice(split),cols=2**colVars.length;
  const label=(vars:string[],i:number)=>vars.map((v,j)=>`${v}${bits(i,vars.length)[j]}`).join(" ")||"weight";
  return {...base,kind:"matrix",controlValue:input===0?"Leaves first: A → B → C → H":"Center first: H → A → B → C",
    graph:{title:"Same model and query; different elimination order",height:240,summary:`Original interaction graph; Q is retained as the query. Selected order: ${order.join(" → ")}. Lines denote pair-factor scopes, not causal arrows.`,nodes:[node("H",160,115),node("A",50,45),node("B",270,45),node("C",50,195),node("Q",270,195)],edges:[edge("H","A"),edge("H","B"),edge("H","C"),edge("H","Q")]},
    matrices:[{label:"Dense bucket table sizes at each elimination",rowLabels:run.steps.map(s=>s.variable),columnLabels:["product cells","output cells"],entries:run.steps.map(s=>[s.productCells,s.result.data.length])},{label:`First output factor: sum out ${order[0]}, retain ${first.scope.join(",")}`,rowLabels:Array.from({length:2**rowVars.length},(_,i)=>label(rowVars,i)),columnLabels:Array.from({length:cols},(_,i)=>label(colVars,i)),entries:Array.from({length:2**rowVars.length},(_,i)=>first.data.slice(i*cols,(i+1)*cols))},{label:"Final unnormalized query factor",rowLabels:["weight"],columnLabels:["Q=0","Q=1"],entries:[run.weights]}],
    summary:`Order ${order.join(" → ")} creates a largest dense bucket product with ${Math.max(...run.steps.map(s=>s.productCells))} cells. Final query weights are (${run.weights.join(", ")}), normalized by ${run.normalizer}, so P(Q=1)=${fmt(run.weights[1]/run.normalizer)}. Both orders compute the same marginal; table sizes describe this dense elimination implementation, not a measured runtime.`,
    values:[value("Peak bucket product cells",Math.max(...run.steps.map(s=>s.productCells))),value("Peak output factor cells",Math.max(...run.steps.map(s=>s.result.data.length))),value("Normalizer",run.normalizer),value("P(Q=1)",run.weights[1]/run.normalizer)]};
}
