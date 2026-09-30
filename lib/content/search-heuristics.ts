import type { CalculationResult } from "./calculations.ts";

export const heuristicModels=["heuristic-admissibility","heuristic-consistency","search-greedy","search-weighted"] as const;
export type HeuristicModel=typeof heuristicModels[number];
export const isHeuristicModel=(model:string):model is HeuristicModel=>(heuristicModels as readonly string[]).includes(model);
type Edge={from:string;to:string;cost:number};
type Entry={id:string;g:number;path:string[]};
const routeEdges:Edge[]=[{from:"S",to:"A",cost:1},{from:"S",to:"B",cost:1},{from:"A",to:"C",cost:1},{from:"C",to:"D",cost:1},{from:"D",to:"G",cost:1},{from:"B",to:"G",cost:9}];
const routePositions:[string,number,number][]=[["S",45,45],["A",160,45],["C",275,45],["D",275,165],["G",275,285],["B",45,285]];
const exact:Record<string,number>={S:4,A:3,B:9,C:2,D:1,G:0};
const value=(label:string,value:number,unit="")=>({label,value,unit});
const base={kind:"matrix" as const,series:[],xLabel:"State",yLabel:"Cost",xDomain:[0,6] as [number,number],yDomain:[0,12] as [number,number]};

function run(edges:Edge[],heuristic:Record<string,number>,weight=1,greedy=false,reopen=true){
  const frontier:Entry[]=[{id:"S",g:0,path:["S"]}],best=new Map([["S",0]]),closed=new Set<string>(),trace:Entry[]=[];
  let reopenings=0;
  const score=(n:Entry)=>greedy?heuristic[n.id]:n.g+weight*heuristic[n.id];
  while(frontier.length){
    frontier.sort((a,b)=>score(a)-score(b)||a.id.localeCompare(b.id));
    const node=frontier.shift()!;trace.push(node);
    if(node.id==="G")return {solution:node,trace,reopenings};
    closed.add(node.id);
    for(const e of edges.filter(e=>e.from===node.id)){
      const g=node.g+e.cost;
      if((!reopen&&closed.has(e.to))||g>=(best.get(e.to)??Infinity))continue;
      if(closed.delete(e.to))reopenings++;
      best.set(e.to,g);
      const old=frontier.findIndex(n=>n.id===e.to);if(old>=0)frontier.splice(old,1);
      frontier.push({id:e.to,g,path:[...node.path,e.to]});
    }
  }
  throw new Error("Teaching graph has no reachable goal");
}
function diagram(edges:Edge[],positions:[string,number,number][],path:string[],summary:string):NonNullable<CalculationResult["graph"]>{
  return {title:"The returned path and its actual costs",height:330,maxWidth:420,summary,nodes:positions.map(([id,x,y])=>({id,label:id,x,y,observed:false,state:""})),edges:edges.map(e=>({...e,label:String(e.cost),directed:true,accent:path.some((id,i)=>id===e.from&&path[i+1]===e.to)}))};
}

export function calculateHeuristic(model:HeuristicModel,input:number):CalculationResult{
  const maximum=model==="heuristic-admissibility"?12:model==="search-greedy"?9:4;
  if(!Number.isFinite(input)||input<(model==="search-weighted"?1:0)||input>maximum||(model!=="search-weighted"&&!Number.isInteger(input)))throw new Error(`Invalid ${model} input`);
  if(model==="heuristic-consistency"){
    const edges:Edge[]=[{from:"S",to:"A",cost:3},{from:"S",to:"B",cost:1},{from:"B",to:"A",cost:1},{from:"A",to:"G",cost:3},{from:"B",to:"G",cost:8}];
    const heuristic={S:0,A:0,B:input,G:0},yes=run(edges,heuristic),no=run(edges,heuristic,1,false,false);
    const slack=edges.map(e=>e.cost+heuristic[e.to as keyof typeof heuristic]-heuristic[e.from as keyof typeof heuristic]);
    return {...base,controlValue:`h(B)=${input} · ${input<=1?"consistent":"admissible, inconsistent"}`,
      graph:diagram(edges,[["S",45,165],["A",160,45],["B",160,285],["G",275,165]],yes.solution.path,"Dashed coral shows A* with reopening. Edge numbers are costs. S→B→A→G costs 5; S→A→G costs 6. The comparison below changes only the closed-state policy."),
      matrices:[{label:"Heuristic versus exact remaining cost",rowLabels:["S","A","B","G"],columnLabels:["h","true h*"],entries:[[0,5],[0,3],[input,4],[0,0]]},{label:"Consistency slack: negative means a broken edge inequality",rowLabels:edges.map(e=>`${e.from}→${e.to}`),columnLabels:["c+h(v)−h(u)"],entries:slack.map(s=>[s])},{label:"Same heuristic, different duplicate policy",rowLabels:["Allow reopening","Never reopen"],columnLabels:["cost","removals","reopens"],entries:[[yes.solution.g,yes.trace.length,yes.reopenings],[no.solution.g,no.trace.length,no.reopenings]]}],
      summary:`h(B)=${input} never exceeds its true remaining cost 4, so this heuristic is admissible throughout the slider. Consistency at B→A requires h(B)≤1+h(A)=1. With reopening: ${yes.trace.map(n=>n.id).join(" → ")}, returned cost ${yes.solution.g}. Without reopening: ${no.trace.map(n=>n.id).join(" → ")}, cost ${no.solution.g}. ${input>1?"A is closed at g=3 before B reveals g(A)=2. Reopening A propagates that improvement to G; the no-reopen variant loses the optimal route.":"B is processed early enough that A's cheaper route is known before A closes. No reopening is needed."}`,
      values:[value("Admissible (1=yes)",1),value("Consistent (1=yes)",Number(input<=1)),value("Minimum consistency slack",Math.min(...slack)),value("Reopening solution cost",yes.solution.g),value("No-reopening solution cost",no.solution.g),value("Reopenings",yes.reopenings)]};
  }
  const heuristic:Record<string,number>=model==="heuristic-admissibility"?{S:0,A:input,B:0,C:0,D:0,G:0}:model==="search-greedy"?{S:0,A:3,B:input,C:2,D:1,G:0}:{S:0,A:3,B:0,C:2,D:1,G:0};
  const weight=model==="search-weighted"?input:1,greedy=model==="search-greedy",result=run(routeEdges,heuristic,weight,greedy),cost=result.solution.g;
  const over=Object.keys(exact).filter(id=>heuristic[id]>exact[id]),slack=routeEdges.map(e=>e.cost+heuristic[e.to]-heuristic[e.from]),consistent=slack.every(s=>s>=0);
  const explanation=model==="heuristic-admissibility"?`h(A)=${input}, while its exact remaining cost is 3. ${input<=3?"The heuristic is admissible.":"It overestimates at A, so the general A* optimality guarantee is unavailable."} ${input>3&&cost===4?"This particular run still succeeds optimally; violating a sufficient condition does not force every instance to fail.":cost>4?"The inflated estimate delays A until the cost-ten goal is removed, missing the cost-four route.":"The returned path attains the true optimum four."}`:greedy?`Greedy priority is h alone. At h(B)=${input}, ${input<3?"B is chosen before A, then G with h=0 immediately wins. Its cheap-looking finish produces cost ten.":"A wins the first comparison (alphabetically when h(B)=3), then C,D,G produce cost four."} Every displayed heuristic is admissible and consistent, yet greedy search can still return the expensive route because it ignores g.`:`Weight w=${input} prioritizes g+w·h. Base h is admissible and consistent; the inflated w·h need not be. Returned cost ${cost}, exact optimum 4, observed ratio ${cost/4}, promised upper factor ${input} under the stated reopening policy. ${input<=3?"This run remains optimal, including w=3 where A and the expensive G tie at priority ten and A wins alphabetically.":"G at cost ten now beats A's priority 1+3w. Fewer removals buy a worse answer."}`;
  return {...base,controlValue:model==="search-weighted"?`w=${input} · cost ${cost}`:model==="search-greedy"?`h(B)=${input} · cost ${cost}`:`h(A)=${input} · ${over.length?"overestimate":"admissible"}`,
    graph:diagram(routeEdges,routePositions,result.solution.path,`Dashed coral is the returned path ${result.solution.path.join(" → ")}, costing ${cost} credits. Numeric labels are edge costs; positions are schematic.`),
    matrices:[{label:"Heuristic values and exact costs on this tiny graph",rowLabels:routePositions.map(([id])=>id),columnLabels:["base h","true h*"],entries:routePositions.map(([id])=>[heuristic[id],exact[id]])},{label:"Actual removal trace",rowLabels:result.trace.map((n,i)=>`${i+1}. ${n.id}`),columnLabels:["g","h",greedy?"priority h":"priority g+wh"],entries:result.trace.map(n=>[n.g,heuristic[n.id],greedy?heuristic[n.id]:n.g+weight*heuristic[n.id]])}],
    summary:explanation,values:[value("Returned cost",cost,"credits"),value("Optimal cost",4,"credits"),value("Cost ratio",cost/4),value("Non-goal expansions",result.trace.length-1),value("Base h admissible (1=yes)",Number(!over.length)),value("Base h consistent (1=yes)",Number(consistent)),...(model==="search-weighted"?[value("Theoretical upper cost wC*",4*input,"credits")]:[])]};
}
