import type { CalculationResult } from "./calculations.ts";
import { computationModels, isComputationModel, calculateComputation } from "./computation-models.ts";
import { algorithmStrategyModels, isAlgorithmStrategyModel, calculateAlgorithmStrategy } from "./algorithm-strategies.ts";

export const complexityFoundationModels = ["fibonacci-cost", "cover-reduction", ...computationModels, ...algorithmStrategyModels] as const;
export type ComplexityFoundationModel = typeof complexityFoundationModels[number];
export const isComplexityFoundationModel = (model: string): model is ComplexityFoundationModel => (complexityFoundationModels as readonly string[]).includes(model);
const value = (label: string, value: number, unit = "") => ({label,value,unit});

export function calculateComplexityFoundation(model: ComplexityFoundationModel, input: number): CalculationResult {
  if (isComputationModel(model)) return calculateComputation(model,input);
  if (isAlgorithmStrategyModel(model)) return calculateAlgorithmStrategy(model,input);
  if (!Number.isInteger(input) || input < 0 || input > (model === "fibonacci-cost" ? 20 : 31)) throw new Error(`Invalid ${model} input`);
  if (model === "fibonacci-cost") {
    const fibonacci = [0,1], additions = [0,0], calls = [1,1];
    for(let n=2;n<=21;n++) { fibonacci[n]=fibonacci[n-1]+fibonacci[n-2]; additions[n]=additions[n-1]+additions[n-2]+1; calls[n]=calls[n-1]+calls[n-2]+1; }
    const rows = Array.from({length:21},(_,n)=>[fibonacci[n],additions[n],Math.max(0,n-1),calls[n]]);
    return {kind:"lines",controlValue:`n=${input} · F(n)=${fibonacci[input]}`,
      series:[{label:"Naive recursion",style:"points",points:rows.map((r,n)=>[n,Math.log2(1+r[1])])},{label:"Rolling pair",style:"points",points:rows.map((r,n)=>[n,Math.log2(1+r[2])])}],
      xLabel:"Fibonacci index n (integer)",yLabel:"log₂(1 + additions)",xDomain:[0,20],yDomain:[0,14],xTicks:[0,5,10,15,20],selectedX:input,
      matrices:[{label:"Exact counts; not elapsed time. Calls refer only to naive recursion.",rowLabels:rows.map((_,n)=>`n=${n}`),columnLabels:["F(n)","naive +","rolling +","calls"],entries:rows}],
      summary:`Both evaluators return F(${input})=${fibonacci[input]}. Naive recursion performs ${additions[input]} additions across ${calls[input]} function ${calls[input]===1?"call":"calls"}; the rolling pair performs ${Math.max(0,input-1)} additions. The deepest naive call chain contains ${Math.max(1,input)} active ${input<=1?"frame":"frames"}. The iterative version carries two sequence values, plus a constant number of temporary/index variables. The chart compresses addition counts with log₂(1+count); raw counts are in the table. These are exact counts for the specified algorithms, not timing measurements.`,
      values:[value("F(n)",fibonacci[input]),value("Naive additions",additions[input]),value("Rolling-pair additions",Math.max(0,input-1)),value("Naive function calls",calls[input]),value("Peak naive active frames",Math.max(1,input)),value("Rolling sequence-value slots",2)]};
  }
  const labels=["A","B","C","D","E"],edges=[[0,1],[1,2],[2,3],[3,4],[4,0]];
  const selected=labels.map((_,i)=>Boolean(input&(1<<i))),inside=labels.filter((_,i)=>selected[i]),cover=labels.filter((_,i)=>!selected[i]);
  const violations=edges.filter(([a,b])=>selected[a]&&selected[b]);
  const coordinates=[[160,42],[275,142],[230,267],[90,267],[45,142]];
  const independentMasks=Array.from({length:32},(_,mask)=>mask).filter(mask=>edges.every(([a,b])=>!(mask&(1<<a))||!(mask&(1<<b))));
  const maximumIndependent=Math.max(...independentMasks.map(mask=>labels.filter((_,i)=>mask&(1<<i)).length));
  const sets=`I={${inside.join(", ")}}; C=V\\I={${cover.join(", ")}}`;
  return {kind:"matrix",series:[],xLabel:"",yLabel:"",xDomain:[0,1],yDomain:[0,1],controlValue:`Mask ${input} · |I|=${inside.length}, |C|=${cover.length}`,
    graph:{title:"The same edge witnesses both failures",height:325,maxWidth:420,
      nodes:labels.map((label,i)=>({id:label,label,x:coordinates[i][0],y:coordinates[i][1],observed:false,state:selected[i]?"in I":"in C",stateAbove:i===1||i===4})),
      edges:edges.map(([a,b])=>({from:labels[a],to:labels[b],directed:false,accent:selected[a]&&selected[b]})),
      summary:`${sets}. Solid cyan edges have an endpoint in C. Dashed coral edges lie entirely inside I and are therefore uncovered by C. ${violations.length?`Violating edges: ${violations.map(([a,b])=>labels[a]+labels[b]).join(", ")}.` : "There are no violating edges: I is independent and C covers every edge."}`},
    matrices:[{label:"Edge-by-edge certificate check (1=yes, 0=no)",rowLabels:edges.map(([a,b])=>labels[a]+labels[b]),columnLabels:["both in I","covered C"],entries:edges.map(([a,b])=>[Number(selected[a]&&selected[b]),Number(!selected[a]||!selected[b])])}],
    summary:`${sets}. I ${violations.length?"is not":"is"} an independent set; C ${violations.length?"is not":"is"} a vertex cover. Every edge with both endpoints in I is exactly an edge with neither endpoint in C. Thus the same ${violations.length} ${violations.length===1?"edge breaks":"edges break"} both properties. Enumerating this five-cycle gives maximum independent-set size ${maximumIndependent} and minimum vertex-cover size ${5-maximumIndependent}; they sum to five. This tiny enumeration is not a polynomial-time solver for arbitrary graphs.`,
    values:[value("Vertices in I",inside.length),value("Vertices in C",cover.length),value("Violating / uncovered edges",violations.length),value("Independent I (1 yes, 0 no)",Number(!violations.length)),value("Cover C (1 yes, 0 no)",Number(!violations.length)),value("Maximum independent size α",maximumIndependent),value("Minimum cover size τ",5-maximumIndependent)]};
}
