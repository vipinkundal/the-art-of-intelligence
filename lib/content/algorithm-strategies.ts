import type { CalculationResult } from "./calculations.ts";

export const algorithmStrategyModels = ["matching-cover", "freivalds-amplification", "ski-rental"] as const;
export type AlgorithmStrategyModel = typeof algorithmStrategyModels[number];
export const isAlgorithmStrategyModel = (model: string): model is AlgorithmStrategyModel => (algorithmStrategyModels as readonly string[]).includes(model);
const value = (label: string, value: number, unit = "") => ({ label, value, unit });

export function calculateAlgorithmStrategy(model: AlgorithmStrategyModel, input: number): CalculationResult {
  const min = model === "ski-rental" ? 1 : 0;
  const max = model === "matching-cover" ? 2 : model === "ski-rental" ? 16 : 12;
  if (!Number.isInteger(input) || input < min || input > max) throw new Error(`Invalid ${model} input`);
  if (model === "matching-cover") {
    const labels = ["A", "B", "C", "D"], edges = [[0,1], [1,2], [2,3]];
    const order = [input, ...[0,1,2].filter(i => i !== input)], matching: number[] = [], cover = new Set<number>();
    for (const i of order) if (edges[i].every(v => !cover.has(v))) {
      matching.push(i); edges[i].forEach(v => cover.add(v));
    }
    const opt = Math.min(...Array.from({length:16}, (_,mask) => mask)
      .filter(mask => edges.every(([a,b]) => (mask & (1<<a)) || (mask & (1<<b))))
      .map(mask => labels.filter((_,i) => mask & (1<<i)).length));
    const names = (indices: number[]) => indices.map(i => labels[edges[i][0]] + labels[edges[i][1]]).join(", ");
    return {kind:"matrix",series:[],xLabel:"",yLabel:"",xDomain:[0,1],yDomain:[0,1],
      controlValue:`First edge ${names([input])}`,
      graph:{title:"One matching, two endpoints per chosen edge",height:125,maxWidth:500,
        nodes:labels.map((label,i) => ({id:label,label,x:40+80*i,y:48,observed:false,state:cover.has(i)?"in C":"out"})),
        edges:edges.map(([a,b],i) => ({from:labels[a],to:labels[b],directed:false,accent:matching.includes(i)})),
        summary:`Scan order: ${names(order)}. Dashed coral edges are the matching M={${names(matching)}}; solid cyan edges are not in M. C contains both endpoints of every matching edge. Every graph edge touches C.`},
      matrices:[{label:"Matching and coverage (1=yes, 0=no)",rowLabels:edges.map(([a,b])=>labels[a]+labels[b]),columnLabels:["in M","covered"],entries:edges.map(([a,b],i)=>[Number(matching.includes(i)),Number(cover.has(a)||cover.has(b))])}],
      summary:`Starting with ${names([input])} gives ${matching.length} disjoint matching ${matching.length===1?"edge":"edges"} and cover C={${labels.filter((_,i)=>cover.has(i)).join(", ")}} of size ${cover.size}. The exact optimum on this path is ${opt}; the observed ratio is ${cover.size/opt}. The certificate bound is |M|=${matching.length} ≤ OPT=${opt} ≤ |C|=${cover.size}=2|M|. Edge order changes the answer, but not the factor-two guarantee for unweighted graphs.`,
      values:[value("Matching lower bound |M|",matching.length),value("Returned cover |C|",cover.size),value("Exact optimum (toy graph)",opt),value("Observed approximation ratio",cover.size/opt),value("Guaranteed factor",2)]};
  }
  if (model === "freivalds-amplification") {
    const vectors = [[0,0],[0,1],[1,0],[1,1]], rounds = Array.from({length:13},(_,k)=>k);
    const A=[[1,2],[3,4]], B=[[2,0],[1,2]], C=[[5,3],[10,8]];
    const mv = (m:number[][],v:number[]) => m.map(row=>row.reduce((sum,x,j)=>sum+x*v[j],0));
    const checks=vectors.map(r=>{const left=mv(A,mv(B,r)),right=mv(C,r);return [...left,...right,Number(left.every((x,i)=>x===right[i]))];});
    const onePass=checks.filter(r=>r[4]===1).length/vectors.length, independent=onePass**input, reused=input===0?1:onePass;
    return {kind:"lines",controlValue:`${input} independent ${input===1?"round":"rounds"}`,
      series:[{label:"Fresh independent vector",style:"points",points:rounds.map(k=>[k,onePass**k])},{label:"Reuse the first vector",style:"points",points:rounds.map(k=>[k,k===0?1:onePass])}],
      xLabel:"Number of checks k",yLabel:"False-pass probability",xDomain:[0,12],yDomain:[0,1],xTicks:[0,3,6,9,12],selectedX:input,
      matrices:[{label:"A",entries:A},{label:"B",entries:B},{label:"Wrong claimed product C",entries:C},
        {label:"All four equally likely vectors; pass=1 means this wrong C escapes detection",rowLabels:vectors.map(r=>`r=(${r.join(",")})`),columnLabels:["ABr₁","ABr₂","Cr₁","Cr₂","pass"],entries:checks}],
      summary:`The claimed product is wrong: AB=[[4,4],[10,8]], not C=[[5,3],[10,8]]. Exactly two of the four binary vectors miss this error. With ${input} fresh independent checks, the probability of accepting this fixed wrong product is ${independent} (${(100*independent).toFixed(4)}%). Reusing one vector gives ${reused} instead. ${input===0?"Zero checks accept without gathering evidence.":"Independently drawn vectors may happen to repeat; deliberately reusing the same draw is the problem."} These are exact probabilities from enumeration, not a random simulation or a posterior probability that C is correct.`,
      values:[value("Missed errors / four vectors",2),value("Independent false-pass probability",independent),value("Reused-vector false-pass probability",reused),value("Checks k",input),value("Matrix-vector products (no early exit)",3*input)]};
  }
  const buy=8, horizons=Array.from({length:24},(_,i)=>i+1), cost=(t:number)=>t<input?t:input-1+buy;
  const worst=(input-1+buy)/Math.min(input,buy);
  return {kind:"lines",controlValue:`Buy on day ${input} if the season lasts that long`,
    series:[{label:"Online threshold policy",style:"points",points:horizons.map(t=>[t,cost(t)])},{label:"Offline optimum",style:"points",points:horizons.map(t=>[t,Math.min(t,buy)])}],
    xLabel:"Actual season length T (days)",yLabel:"Total cost (credits)",xDomain:[1,24],yDomain:[0,24],xTicks:[1,8,16,24],selectedX:input,
    matrices:[{label:"Exact costs at every displayed integer horizon",rowLabels:horizons.map(t=>`T=${t}`),columnLabels:["online","offline","ratio"],entries:horizons.map(t=>[cost(t),Math.min(t,buy),cost(t)/Math.min(t,buy)])}],
    summary:`Renting costs 1 credit/day; buying costs 8 credits. This policy rents for up to ${input-1} days and buys on day ${input} only if that day arrives. Its worst ratio over all positive integer season lengths is ${worst}, attained when the season ends on day ${input}: online cost ${cost(input)}, offline cost ${Math.min(input,buy)}. ${input===8?"Buying on day eight is the best deterministic threshold here: 15/8=1.875.":"Try day eight to minimize the worst-case ratio."} The horizontal axis reveals possible futures to you, not to the online policy. Beyond day 24 both costs stay constant.`,
    values:[value("Buy day",input,"days"),value("Prior rental cost",input-1,"credits"),value("Cost if purchase occurs",cost(input),"credits"),value("Worst-case ratio",worst),value("Best deterministic ratio",15/8)]};
}
