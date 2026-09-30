import type { CalculationResult } from "./calculations.ts";
export const graphicalFoundationModels = ["graph-conditional", "graph-bayes", "graph-dseparation"] as const;
export type GraphicalFoundationModel = typeof graphicalFoundationModels[number];
export const isGraphicalFoundationModel = (model: string): model is GraphicalFoundationModel => (graphicalFoundationModels as readonly string[]).includes(model);
type Point = [number, number];
type Joint = [number, number, number, number];
const fmt = (n: number) => Number(n.toFixed(6));
const value = (label: string, value: number, unit = "") => ({ label, value, unit });
const covariance = (p: Joint) => p[3] - (p[2] + p[3]) * (p[1] + p[3]);
const product = (p: Joint): Joint => { const x = p[2] + p[3], y = p[1] + p[3]; return [(1-x)*(1-y), (1-x)*y, x*(1-y), x*y]; };
const table = (label: string, p: Joint) => ({ label, rowLabels: ["X=0", "X=1"], columnLabels: ["Y=0", "Y=1"], entries: [p.slice(0,2),p.slice(2)] });
function graph(motif: "chain" | "fork" | "collider", observed: boolean, title: string, summary: string, labels = ["X", "Z", "Y"]): NonNullable<CalculationResult["graph"]> {
  const edges = motif === "chain" ? [[0,1],[1,2]] : motif === "fork" ? [[1,0],[1,2]] : [[0,1],[2,1]];
  return { title, summary, nodes: labels.map((label,i)=>({id:String(i),label,x:50+i*110,y:55,observed:i===1&&observed})), edges:edges.map(([from,to])=>({from:String(from),to:String(to)})) };
}
const alarm = (a:number,b:number) => 1-0.99*(a?0.1:1)*(b?0.2:1);
function posterior(bPrior:number) {
  let evidence = 0, numerator = 0;
  for(let a=0;a<2;a++) for(let b=0;b<2;b++) {
    const joint=(a?0.1:0.9)*(b?bPrior:1-bPrior)*alarm(a,b);
    evidence+=joint; if(a) numerator+=joint;
  }
  return {evidence,a:numerator/evidence,givenB:0.1*alarm(1,1)/(0.1*alarm(1,1)+0.9*alarm(0,1))};
}
export function calculateGraphicalFoundation(model:GraphicalFoundationModel,input:number):CalculationResult {
  const bounds:Record<GraphicalFoundationModel,[number,number]>={"graph-conditional":[0.5,0.95],"graph-bayes":[0.01,0.8],"graph-dseparation":[0,5]};
  if(!Number.isFinite(input)||input<bounds[model][0]||input>bounds[model][1]||(model==="graph-dseparation"&&!Number.isInteger(input))) throw new Error(`Invalid ${model} input`);
  const base:CalculationResult={kind:"lines",series:[],xDomain:[0,1],yDomain:[0,1],xLabel:"Parameter",yLabel:"Probability",summary:"",values:[]};
  if(model==="graph-conditional") {
    const r=input, same=(r*r+(1-r)**2)/2, cross=r*(1-r), joint:Joint=[same,cross,cross,same], conditional:Joint=[(1-r)**2,cross,cross,r*r];
    return {...base,xDomain:[0.5,0.95],yDomain:[0,0.24],xLabel:"Conditional agreement r",yLabel:"Covariance (binary units²)",selectedX:r,
      graph:graph("fork",true,"Shared regime, independent errors","Z points to X and Y. The highlighted Z is conditioned on for the conditional table; the marginal table averages over both Z values."),
      series:[{label:"Marginal covariance: (r−0.5)²",points:Array.from({length:91},(_,i):Point=>{const t=0.5+i*0.005;return[t,(t-0.5)**2];})},{label:"Conditional covariance given Z: zero",points:[[0.5,0],[0.95,0]]}],
      markers:[{label:"Marginal covariance at selected r",point:[r,covariance(joint)]}],
      matrices:[table("Marginal joint P(X,Y): regime hidden",joint),table("Conditional joint P(X,Y | Z=1)",conditional)],
      summary:`At r=${fmt(r)}, the marginal covariance is ${fmt(covariance(joint))}, but conditional covariance given either Z value is zero. P(X=1,Y=1)=${fmt(joint[3])}, compared with P(X=1)P(Y=1)=0.25. Given Z=1, the joint probability is r²=${fmt(r*r)}, exactly the product of its conditional marginals.`,
      values:[value("Marginal P(X=1)",0.5),value("Marginal P(Y=1)",0.5),value("Marginal P(X=1,Y=1)",joint[3]),value("Marginal covariance",covariance(joint)),value("P(X=1 | Z=1)",r),value("P(Y=1 | Z=1)",r),value("P(X=1,Y=1 | Z=1)",r*r),value("Conditional covariance",0)]};
  }
  if(model==="graph-bayes") {
    const p=posterior(input);
    return {...base,xDomain:[0.01,0.8],yDomain:[0,1],xLabel:"Prior probability of fault B",yLabel:"Probability of fault A",selectedX:input,
      graph:graph("collider",true,"Two possible faults, one alarm","Independent fault roots A and B both point to alarm C. C=1 is observed; observing B=1 additionally changes the posterior on A.",["A","C=1","B"]),
      series:[{label:"P(A=1 | C=1): alarm only",points:Array.from({length:80},(_,i):Point=>{const t=0.01+i*0.01;return[t,posterior(t).a];})},{label:"P(A=1 | C=1,B=1): B also observed",points:[[0.01,p.givenB],[0.8,p.givenB]]},{label:"P(A=1): prior",points:[[0.01,0.1],[0.8,0.1]]}],
      markers:[{label:"Alarm-only posterior",point:[input,p.a]}],
      matrices:[{label:"Alarm conditional probabilities P(C | A,B)",rowLabels:["A0 B0","A0 B1","A1 B0","A1 B1"],columnLabels:["C=0","C=1"],entries:[[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>[1-alarm(a,b),alarm(a,b)])}],
      summary:`With P(B=1)=${fmt(input)}, the alarm probability is ${fmt(p.evidence)}. Observing the alarm raises P(A=1) from 0.1 to ${fmt(p.a)}. If B=1 is also known, P(A=1 | C=1,B=1)=${fmt(p.givenB)}. This is probabilistic explaining away in the specified model, not evidence that the arrows establish causation.`,
      values:[value("Prior P(A=1)",0.1),value("Prior P(B=1)",input),value("Alarm probability P(C=1)",p.evidence),value("P(A=1 | C=1)",p.a),value("P(A=1 | C=1,B=1)",p.givenB)]};
  }
  const motif=(["chain","fork","collider"] as const)[Math.floor(input/2)], observed=input%2===1;
  const joint:Joint=[0,0,0,0]; let evidence=0;
  for(let x=0;x<2;x++) for(let z=0;z<2;z++) for(let y=0;y<2;y++) {
    const like=(u:number,v:number)=>u===v?0.9:0.1;
    const collider=[0.05,0.9,0.9,0.99][2*x+y];
    const mass=motif==="chain"?0.5*like(x,z)*like(z,y):motif==="fork"?0.5*like(z,x)*like(z,y):0.25*(z?collider:1-collider);
    if(!observed||z===1) {joint[2*x+y]+=mass;evidence+=mass;}
  }
  for(let i=0;i<4;i++) joint[i]/=evidence;
  const independent=product(joint), blocked=motif==="collider"?!observed:observed, label=`${motif[0].toUpperCase()+motif.slice(1)} · ${observed?"Z=1 observed":"Z unobserved"}`;
  return {...base,kind:"matrix",controlValue:`${input+1}/6 · ${label}`,
    graph:graph(motif,observed,label,`${blocked?"Blocked path: d-separated":"Active path: not d-separated"}. ${blocked?"Factorization guarantees independence of X and Y under this conditioning set.":"Dependence is possible; the displayed parameters produce it. An active path does not force dependence for every parameter choice."}`),
    matrices:[table(observed?"Conditional joint P(X,Y | Z=1)":"Marginal joint P(X,Y)",joint),table("Product of the displayed joint's marginals",independent)],
    summary:`Case ${input+1}: ${label}. The path is ${blocked?"blocked":"active"}. For these numerical parameters, covariance is ${fmt(covariance(joint))}, and the largest cell difference from the product of marginals is ${fmt(Math.max(...joint.map((p,i)=>Math.abs(p-independent[i]))))}. ${blocked?"The tables agree, as guaranteed by d-separation.":"The tables differ. This witnesses dependence in this example, not a universal consequence of d-connection."}`,
    values:[value("Conditioning event probability",evidence),value("P(X=1) in displayed distribution",joint[2]+joint[3]),value("P(Y=1) in displayed distribution",joint[1]+joint[3]),value("P(X=1,Y=1) in displayed distribution",joint[3]),value("Covariance in displayed distribution",covariance(joint))]};
}
