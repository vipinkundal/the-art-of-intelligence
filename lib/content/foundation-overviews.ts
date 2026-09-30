import type { CalculationResult } from "./calculations.ts";
export const foundationOverviewModels=["overview-joint","overview-intervals","overview-walks","overview-training-step"] as const;
export type FoundationOverviewModel=typeof foundationOverviewModels[number];
export const isFoundationOverviewModel=(model:string):model is FoundationOverviewModel=>(foundationOverviewModels as readonly string[]).includes(model);
const value=(label:string,value:number,unit="")=>({label,value,unit});
const f=(n:number)=>Number(n.toFixed(6));

export function calculateFoundationOverview(model:FoundationOverviewModel,input:number):CalculationResult {
  const bounds=model==="overview-joint"?[0,.5]:model==="overview-intervals"?[1,100]:model==="overview-walks"?[0,8]:[0,1];
  if(!Number.isFinite(input)||input<bounds[0]||input>bounds[1]||((model==="overview-intervals"||model==="overview-walks")&&!Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  if(model==="overview-joint") {
    const masses=[input,1-2*input,input];
    return {kind:"bars",controlValue:`q=P(X=1,Y=1)=${f(input)}`,
      series:[{label:"Actual sum distribution",points:masses.map((p,s)=>[s,p])},{label:"Independent-pair reference",points:[[0,.25],[1,.5],[2,.25]]}],xLabel:"Total S=X+Y",yLabel:"Probability mass",xDomain:[-.5,2.5],yDomain:[0,1],xTicks:[0,1,2],
      matrices:[{label:"Joint P(X,Y); every row and column sums to 0.5",rowLabels:["X=0","X=1"],columnLabels:["Y=0","Y=1"],entries:[[input,.5-input],[.5-input,input]]}],
      summary:`Each variable is individually a fair binary variable: P(X=1)=P(Y=1)=0.5. The sum has probabilities (${masses.map(f).join(", ")}) at 0, 1 and 2, with mean 1 and variance ${f(2*input)}. Correlation is ${f(4*input-1)}. ${input===.25?"At q=0.25 the joint factors and the pair is independent.":input===0?"At q=0, exactly one variable is one, so the sum is always one.":input===.5?"At q=0.5 the variables always agree, so the sum is either zero or two.":"The marginals stay fair, but the pair is dependent."} Multiplying marginals would silently replace the stated model by the independent reference.`,
      values:[value("P(X=1)",.5),value("P(Y=1)",.5),value("E[S]",1),value("Var(S)",2*input),value("Cov(X,Y)",input-.25),value("Correlation",4*input-1),value("P(S=1)",1-2*input)]};
  }
  if(model==="overview-intervals") {
    const sigma=2,z=1.96,mean=3,ci=(n:number)=>z*sigma/Math.sqrt(n),pi=(n:number)=>z*sigma*Math.sqrt(1+1/n),counts=Array.from({length:100},(_,i)=>i+1);
    return {kind:"lines",controlValue:`n=${input} independent observations`,
      series:[{label:"Mean confidence half-width",style:"points",points:counts.map(n=>[n,ci(n)])},{label:"One-observation prediction half-width",style:"points",points:counts.map(n=>[n,pi(n)])}],xLabel:"Sample size n",yLabel:"Interval half-width (units)",xDomain:[1,100],yDomain:[0,6],xTicks:[1,25,50,75,100],selectedX:input,
      matrices:[{label:"Intervals centered at the displayed sample mean 3",rowLabels:["Population mean μ","One new observation"],columnLabels:["lower","upper"],entries:[[mean-ci(input),mean+ci(input)],[mean-pi(input),mean+pi(input)]]}],
      summary:`At n=${input}, the interval for the population mean is [${f(mean-ci(input))}, ${f(mean+ci(input))}], while the interval for one independent future observation is [${f(mean-pi(input))}, ${f(mean+pi(input))}]. Both procedures have approximately 95% repeated-sampling coverage under the known-σ normal model. More data shrinks uncertainty about the mean, but the prediction half-width approaches 3.92 units because individual observations still vary. The sample mean is held at 3 to isolate width changes; these are not posterior intervals or simulated samples.`,
      values:[value("Known observation σ",sigma,"units"),value("Standard error of mean",sigma/Math.sqrt(input),"units"),value("Mean interval half-width",ci(input),"units"),value("Prediction interval half-width",pi(input),"units"),value("Prediction half-width limit",z*sigma,"units")]};
  }
  if(model==="overview-walks") {
    const labels=["A","B","C","D"],edges=[[0,1],[0,2],[1,2],[2,3],[3,0]],rows:number[][]=[[1,0,0,0]];
    for(let k=1;k<=8;k++){const next=[0,0,0,0];for(const [a,b] of edges)next[b]+=rows[k-1][a];rows.push(next);}
    const coordinates=[[55,55],[265,55],[265,220],[55,220]],total=rows[input].reduce((a,b)=>a+b,0);
    return {kind:"matrix",series:[],xLabel:"",yLabel:"",xDomain:[0,1],yDomain:[0,1],controlValue:`Exactly ${input} ${input===1?"edge":"edges"} from A`,
      graph:{title:"Count walks by their final vertex",height:290,maxWidth:430,
        nodes:labels.map((label,i)=>({id:label,label,x:coordinates[i][0],y:coordinates[i][1],observed:false,state:`count ${rows[input][i]}`,stateAbove:i<2})),
        edges:edges.map(([a,b])=>({from:labels[a],to:labels[b],directed:true})),
        summary:`Start at A. After exactly ${input} edges, counts at (A,B,C,D) are (${rows[input].join(", ")}). A walk may revisit a vertex or edge; these are not simple-path counts or probabilities.`},
      matrices:[{label:"Dynamic-programming rows: cₖ=cₖ₋₁M",rowLabels:rows.map((_,k)=>`k=${k}`),columnLabels:labels,entries:rows},{label:"Adjacency M: row=source, column=destination",rowLabels:labels,columnLabels:labels,entries:labels.map((_,a)=>labels.map((_,b)=>Number(edges.some(([u,v])=>u===a&&v===b))))}],
      summary:`There ${total===1?"is":"are"} ${total} directed ${total===1?"walk":"walks"} of length ${input} starting at A; ${rows[input][2]} ${rows[input][2]===1?"ends":"end"} at C. Each new count sums the previous counts of incoming neighbors. The initial row (1,0,0,0) represents the single empty walk at A. A simple edge-scan update uses one addition per edge per round; matrix powers encode the same recurrence. The cycles permit revisits, so do not interpret these numbers as counts of simple paths.`,
      values:[value("Walk length",input,"edges"),...labels.map((label,i)=>value(`Walks ending at ${label}`,rows[input][i])),value("Total walks",total),value("Edge-scan additions for k rounds",5*input)]};
  }
  const rate=input,w=3.5*rate,loss=(weight:number)=>((weight-1)**2+(2*weight-3)**2)/4,steps=Array.from({length:101},(_,i)=>i/100);
  return {kind:"lines",controlValue:`η=${f(rate)} · one update gives w=${f(w)}`,
    series:[{label:"Loss after one update",points:steps.map(eta=>[eta,loss(3.5*eta)])},{label:"Loss before update",points:steps.map(eta=>[eta,2.5])}],xLabel:"Learning rate η",yLabel:"Training objective L",xDomain:[0,1],yDomain:[0,6],selectedX:rate,
    markers:[{label:"Exact one-step optimum at η=0.4",point:[.4,.05]}],
    matrices:[{label:"Two observations after the update",rowLabels:["observation 1","observation 2"],columnLabels:["x","target y","prediction","residual"],entries:[[1,1,w,w-1],[2,3,2*w,2*w-3]]}],
    summary:`From w₀=0, the gradient is −3.5. One update w₁=w₀−η∇L gives w₁=${f(w)} and training loss ${f(loss(w))}, compared with 2.5 initially. ${rate===0?"A zero rate makes no update.":rate<.8?"This positive rate decreases the stated training objective.":rate===.8?"At η=0.8 the loss returns to its initial value after overshooting.":"This rate overshoots far enough to increase the loss."} The exact minimizer is w*=1.4 with loss 0.05, reached in one step at η=0.4. This calculation says nothing by itself about performance on new observations.`,
    values:[value("Initial gradient",-3.5),value("Updated coefficient",w),value("Training loss after update",loss(w)),value("Initial training loss",2.5),value("Exact minimizing coefficient",1.4),value("Minimum training loss",.05)]};
}
