import type { CalculationResult } from "./calculations.ts";
import { heuristicModels, isHeuristicModel, calculateHeuristic } from "./search-heuristics.ts";
import { searchStateModels, isSearchStateModel, calculateSearchState } from "./search-state-memory.ts";
import { searchRefinementModels, isSearchRefinementModel, calculateSearchRefinement } from "./search-refinements.ts";
import { searchGuaranteeModels, isSearchGuaranteeModel, calculateSearchGuarantee } from "./search-guarantees.ts";

export const searchModels=["search-bfs","search-dfs","search-ucs","search-dls","search-ids","search-astar",...heuristicModels,...searchStateModels,...searchRefinementModels,...searchGuaranteeModels] as const;
export type SearchModel=typeof searchModels[number];
export const isSearchModel=(model:string):model is SearchModel=>(searchModels as readonly string[]).includes(model);
type Node={id:string;g:number;path:string[]};
const edges=[{from:"S",to:"A",cost:1},{from:"S",to:"B",cost:1},{from:"A",to:"C",cost:1},{from:"C",to:"D",cost:1},{from:"D",to:"G",cost:1},{from:"B",to:"G",cost:9}];
const h:Record<string,number>={S:4,A:3,B:9,C:2,D:1,G:0};
const positions:[string,number,number][]=[["S",45,45],["A",160,45],["C",275,45],["D",275,165],["G",275,285],["B",45,285]];
const value=(label:string,value:number,unit="")=>({label,value,unit});
const base={kind:"matrix" as const,series:[],xLabel:"Search step",yLabel:"Path cost",xDomain:[0,6] as [number,number],yDomain:[0,10] as [number,number]};
function graph(path:string[],summary:string):NonNullable<CalculationResult["graph"]>{
  return {title:"Two routes to G: fewer edges or lower cost?",height:330,maxWidth:420,summary,
    nodes:positions.map(([id,x,y])=>({id,label:id,x,y,observed:false,state:""})),
    edges:edges.map(e=>({...e,directed:true,label:String(e.cost),accent:path.some((id,i)=>id===e.from&&path[i+1]===e.to)}))};
}
function limited(limit:number){
  const visits:Node[]=[],cutoffs:string[]=[];let solution:Node|undefined;
  function visit(node:Node):"found"|"cutoff"|"failure"{
    visits.push(node);
    if(node.id==="G"){solution=node;return "found";}
    if(node.path.length-1===limit){cutoffs.push(node.id);return "cutoff";}
    let cut=false;
    for(const e of edges.filter(e=>e.from===node.id)){
      if(node.path.includes(e.to))continue;
      const result=visit({id:e.to,g:node.g+e.cost,path:[...node.path,e.to]});
      if(result==="found")return result;
      cut ||= result==="cutoff";
    }
    return cut?"cutoff":"failure";
  }
  const status=visit({id:"S",g:0,path:["S"]});
  return {visits,cutoffs,solution,status};
}
export function calculateSearch(model:SearchModel,input:number):CalculationResult{
  if(isSearchGuaranteeModel(model))return calculateSearchGuarantee(model,input);
  if(isHeuristicModel(model))return calculateHeuristic(model,input);
  if(isSearchStateModel(model))return calculateSearchState(model,input);
  if(isSearchRefinementModel(model))return calculateSearchRefinement(model,input);
  const maximum=model==="search-ucs"?6:model==="search-dls"||model==="search-ids"?4:5;
  if(!Number.isInteger(input)||input<0||input>maximum)throw new Error(`Invalid ${model} input`);
  if(model==="search-dls"||model==="search-ids"){
    const runs:ReturnType<typeof limited>[]=[];
    if(model==="search-dls")runs.push(limited(input));
    else for(let depth=0;depth<=input;depth++){const run=limited(depth);runs.push(run);if(run.status!=="cutoff")break;}
    const last=runs[runs.length-1],solution=last.solution,total=runs.reduce((n,r)=>n+r.visits.length,0),actual=model==="search-dls"?input:runs.length-1;
    const path=solution?.path??last.visits[last.visits.length-1].path;
    const status=solution?`Found ${solution.path.join(" → ")} at depth ${solution.path.length-1}, cost ${solution.g}.`:`Cutoff: no goal found within limit ${actual}. This is not a proof that the unrestricted problem has no solution.`;
    return {...base,controlValue:model==="search-dls"?`Depth limit ${input}`:`Maximum limit ${input} · last run ${actual}`,
      graph:graph(path,`${status} Dashed coral marks ${solution?"the returned path":"the path to the last visited node"}. Edge labels are costs, not depths.`),
      matrices:[{label:model==="search-dls"?"Depth-first visit order (goal tested before cutoff)":"Work by completed depth limit; repeated visits count again",rowLabels:model==="search-dls"?last.visits.map((n,i)=>`${i+1}. ${n.id}`):runs.map((_,i)=>`Limit ${i}`),columnLabels:model==="search-dls"?["depth","cost g"]:["visits","cutoffs","found (1=yes)"],entries:model==="search-dls"?last.visits.map(n=>[n.path.length-1,n.g]):runs.map(r=>[r.visits.length,r.cutoffs.length,Number(Boolean(r.solution))])}],
      summary:`${status} ${model==="search-ids"?`Completed runs: ${runs.length}; total node visits: ${total}. Only the last run's search memory is needed. ${solution&&input>actual?"The algorithm stops on success; raising the maximum does not rerun deeper limits.":""}`:`Visit order: ${last.visits.map(n=>n.id).join(", ")}. ${last.cutoffs.length?`Cutoff nodes encountered: ${last.cutoffs.join(", ")}.`:"No cutoff was encountered before the goal."}`} Alphabetical successors are used. A shallowest solution is not necessarily cheapest when edge costs differ.`,
      values:[value("Total node visits",total),value("Last depth limit",actual),value("Goal found (1=yes)",Number(Boolean(solution))),...(solution?[value("Solution depth",solution.path.length-1,"edges"),value("Solution cost",solution.g,"credits")]:[])]};
  }
  const frontier:Node[]=[{id:"S",g:0,path:["S"]}],discovered=new Set(["S"]),best=new Map([["S",0]]),popped:Node[]=[];
  const priority=(n:Node)=>n.g+(model==="search-astar"?h[n.id]:0);
  let solution:Node|undefined;
  for(let step=0;step<input&&frontier.length;step++){
    const node=frontier.shift()!;popped.push(node);
    if(node.id==="G"){solution=node;break;}
    const children:Node[]=[];
    for(const e of edges.filter(e=>e.from===node.id)){
      const child={id:e.to,g:node.g+e.cost,path:[...node.path,e.to]};
      if(model==="search-ucs"||model==="search-astar"){
        if(child.g>=(best.get(child.id)??Infinity))continue;
        best.set(child.id,child.g);
        const old=frontier.findIndex(n=>n.id===child.id);if(old>=0)frontier.splice(old,1);
        children.push(child);
      }else if(!discovered.has(child.id)){discovered.add(child.id);children.push(child);}
    }
    if(model==="search-dfs")frontier.unshift(...children);else frontier.push(...children);
    if(model==="search-ucs"||model==="search-astar")frontier.sort((a,b)=>priority(a)-priority(b)||a.id.localeCompare(b.id));
  }
  const last=popped[popped.length-1],path=last?.path??["S"],queue=frontier.map(n=>`${n.id}(g=${n.g}${model==="search-astar"?`, h=${h[n.id]}, f=${priority(n)}`:""})`).join(" → ")||"empty";
  const matrices:NonNullable<CalculationResult["matrices"]>=[];
  if(frontier.length)matrices.push({label:solution?"Frontier left unused after success":"Frontier: next removal first",rowLabels:frontier.map(n=>n.id),columnLabels:model==="search-astar"?["g","h","f"]:["depth","cost g"],entries:frontier.map(n=>model==="search-astar"?[n.g,h[n.id],priority(n)]:[n.path.length-1,n.g])});
  if(popped.length)matrices.push({label:"Removal order (goal is removed, not expanded)",rowLabels:popped.map((n,i)=>`${i+1}. ${n.id}`),columnLabels:["depth","cost g"],entries:popped.map(n=>[n.path.length-1,n.g])});
  if(model==="search-astar")matrices.push({label:"Fixed, consistent heuristic h",rowLabels:positions.map(([id])=>id),columnLabels:["remaining cost h"],entries:positions.map(([id])=>[h[id]])});
  const result=solution?`Goal returned: ${path.join(" → ")}; ${path.length-1} edges, cost ${solution.g}.`:`${last?`Last removed: ${last.id}.`:"Nothing removed yet."} No solution has been returned.`;
  return {...base,controlValue:`${popped.length} removals${solution?" · goal found":""}`,graph:graph(path,`${result} Dashed coral follows the ${solution?"returned":"last removed node's"} path. All edges cost one credit except B→G, which costs nine.`),matrices,
    summary:`${result} Removal order: ${popped.map(n=>n.id).join(" → ")||"none"}. Frontier, next first: ${queue}. ${model==="search-ucs"?"G may be discovered at cost 10, then improved to 4 before removal. Discovery is not finalization.":model==="search-bfs"?"The queue orders by depth, ignoring edge costs. Its two-edge answer costs 10, while the four-edge route costs 4.":model==="search-dfs"?"A is explored before B. Finding the cheap route here is a consequence of that order, not a DFS optimality guarantee.":"h gives exact remaining costs in this deliberately small example. A* can leave B on the frontier because its f=10 exceeds the optimal goal cost 4."}`,
    values:[value("Nodes removed",popped.length),value("Nodes expanded",popped.filter(n=>n.id!=="G").length),value("Frontier entries",frontier.length),...(solution?[value("Returned path depth",path.length-1,"edges"),value("Returned path cost",solution.g,"credits")]:[])]};
}
