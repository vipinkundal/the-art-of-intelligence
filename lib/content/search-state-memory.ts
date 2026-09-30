import type { CalculationResult } from "./calculations.ts";

export const searchStateModels=["search-key-state","search-duplicates","search-dijkstra","search-ida"] as const;
export type SearchStateModel=typeof searchStateModels[number];
export const isSearchStateModel=(model:string):model is SearchStateModel=>(searchStateModels as readonly string[]).includes(model);
const value=(label:string,value:number,unit="")=>({label,value,unit});
const base={kind:"matrix" as const,series:[],xLabel:"Step",yLabel:"Count",xDomain:[0,5] as [number,number],yDomain:[0,10] as [number,number]};
type Edge={from:string;to:string;cost:number};
function draw(edges:Edge[],positions:[string,number,number][],path:string[],title:string,summary:string,height=330):NonNullable<CalculationResult["graph"]>{return {title,summary,height,maxWidth:420,nodes:positions.map(([id,x,y])=>({id,label:id,x,y,observed:false,state:""})),edges:edges.map(e=>({...e,label:String(e.cost),directed:true,accent:path.some((id,i)=>id===e.from&&path[i+1]===e.to)}))};}

export function calculateSearchState(model:SearchStateModel,input:number):CalculationResult{
  const maximum=model==="search-key-state"?1:model==="search-duplicates"?10:model==="search-dijkstra"?4:5;
  if(!Number.isInteger(input)||input<(model==="search-ida"?1:0)||input>maximum)throw new Error(`Invalid ${model} input`);
  if(model==="search-key-state"){
    const transitions:Record<string,string[]>={H0:["K1"],K1:["H1"],H1:["K1","G1"],G1:[]};
    function solve(full:boolean){const queue:string[][]=[[input?"H1":"H0"]],seen=new Set([full?queue[0][0]:"H"]),order:string[]=[];while(queue.length){const path=queue.shift()!,node=path[path.length-1];order.push(node);if(node==="G1")return {path,order};for(const next of transitions[node]){const key=full?next:next[0];if(!seen.has(key)){seen.add(key);queue.push([...path,next]);}}}return {path:[] as string[],order};}
    const correct=solve(true),collapsed=solve(false),edges=[{from:"H0",to:"K1",directed:true},{from:"K1",to:"H1",directed:false},{from:"H1",to:"G1",directed:true}];
    return {...base,controlValue:input?"Start in H with the key":"Start in H without the key",graph:{title:"Same room, different available future",height:250,maxWidth:480,
      nodes:([['H0',45,55],['K1',160,55],['H1',275,55],['G1',275,205]] as [string,number,number][]).map(([id,x,y])=>({id,label:id,x,y,observed:false,state:""})),
      edges:edges.map(e=>({...e,label:e.directed?"1":"↔",accent:correct.path.some((id,i)=>id===e.from&&correct.path[i+1]===e.to)})),
      summary:"H=hall, K=key room, G=goal. Suffix 0/1 means no key/has key. Entering K automatically acquires the persistent key. K1↔H1 permits both directions, each costing one move. H1→G1 requires the key. Dashed coral shows the shortest valid plan from the selected start; H0 is unreachable when starting with the key."},
      matrices:[{label:"BFS with two candidate state keys",rowLabels:["(room, key)","room only"],columnLabels:["goal found (1=yes)","removals"],entries:[[1,correct.order.length],[Number(collapsed.path.length>0),collapsed.order.length]]},{label:"Correct returned plan",rowLabels:correct.path,columnLabels:["step","has key"],entries:correct.path.map((n,i)=>[i,Number(n[1])])}],
      summary:`Full-state BFS returns ${correct.path.join(" → ")} in ${correct.path.length-1} ${correct.path.length===2?"move":"moves"}. Position-only BFS ${collapsed.path.length?`also finds the goal because the key is already present at the start.`:`stops after ${collapsed.order.join(" → ")}: it discards H1 because H0 already used the key “H”. It incorrectly reports no route.`} The world has three room labels and two key values (six syntactic combinations), but only four states are reachable from H0. A smaller representation is useful only if merged histories have the same relevant futures.`,
      values:[value("Correct shortest plan",correct.path.length-1,"moves"),value("Position-only model finds a goal (1=yes)",Number(collapsed.path.length>0)),value("Syntactic room/key combinations",6),value("Reachable states from H0",4)]};
  }
  if(model==="search-duplicates"){
    const next:Record<string,string[]>={S:["A","B"],A:["C"],B:["C"],C:["S"]};
    const counts:number[][]=[[],[],[]];
    for(let policy=0;policy<3;policy++){
      let layer=[['S']];const seen=new Set(['S']);
      for(let depth=0;depth<=input;depth++){
        counts[policy].push(layer.length);const following:string[][]=[];
        for(const path of layer)for(const child of next[path[path.length-1]]){
          if(policy===1&&path.includes(child))continue;
          if(policy===2&&seen.has(child))continue;
          if(policy===2)seen.add(child);
          following.push([...path,child]);
        }
        layer=following;
      }
    }
    const totals=counts.map(row=>row.reduce((a,b)=>a+b,0)),names=["No pruning","Current-path cycles","Global discovered set"];
    return {...base,kind:"lines",controlValue:`Enumerate through depth ${input}`,series:counts.map((row,i)=>({label:names[i],points:row.map((n,d):[number,number]=>[d,n]),style:"points"})),xLabel:"Edge depth from S",yLabel:"Accepted path entries at this depth",xDomain:[0,Math.max(1,input)],yDomain:[0,Math.max(4,...counts.flat())],xTicks:Array.from({length:input+1},(_,i)=>i).filter((_,i)=>input<=5||i%2===0),
      matrices:[{label:"Per-depth entries in S→{A,B}→C→S",rowLabels:counts[0].map((_,i)=>`Depth ${i}`),columnLabels:["none","path set","global set"],entries:counts[0].map((_,i)=>counts.map(row=>row[i]))}],
      summary:`Through depth ${input}, no pruning accepts ${totals[0]} path ${totals[0]===1?"entry":"entries"}, current-path cycle checking accepts ${totals[1]}, and a global discovered set accepts ${totals[2]}. The graph has only four states: S→A, S→B, A→C, B→C, C→S. The two routes to C are distinct paths to the same state. A path set blocks a return to S but retains both C visits; a global set merges those visits too. Counts include the root and every accepted boundary entry, not just expansions. This compares reachability enumeration, not weighted shortest-path correctness.`,
      values:names.map((name,i)=>value(`${name}: cumulative entries`,totals[i]))};
  }
  if(model==="search-dijkstra"){
    const ids=['S','A','B','C','U'],edges:Edge[]=[{from:'S',to:'A',cost:4},{from:'S',to:'B',cost:0},{from:'B',to:'A',cost:2},{from:'A',to:'C',cost:1},{from:'B',to:'C',cost:5}];
    const distances:Record<string,number>={S:0,A:Infinity,B:Infinity,C:Infinity,U:Infinity},parents:Record<string,string>={},settled:string[]=[];
    for(let i=0;i<input;i++){
      const candidate=ids.filter(id=>!settled.includes(id)&&Number.isFinite(distances[id])).sort((a,b)=>distances[a]-distances[b]||a.localeCompare(b))[0];if(!candidate)break;
      settled.push(candidate);for(const e of edges.filter(e=>e.from===candidate)){const proposal=distances[candidate]+e.cost;if(proposal<distances[e.to]){distances[e.to]=proposal;parents[e.to]=candidate;}}
    }
    const done=settled.length===4,path:string[]=[];let current=settled[settled.length-1];while(current){path.unshift(current);current=parents[current];}
    const frontier=ids.filter(id=>!settled.includes(id)&&Number.isFinite(distances[id])).sort((a,b)=>distances[a]-distances[b]||a.localeCompare(b));
    return {...base,controlValue:`${settled.length} finalized vertices${done?" · reachable frontier exhausted":""}`,
      graph:draw(edges,[["S",45,45],["A",275,45],["B",45,225],["C",275,225],["U",160,315]],path,"Finalize distances, not first impressions","Dashed coral traces the shortest path to the most recently finalized vertex. S→B has zero cost. U is isolated. The table separates tentative values from finalized distances.",360),
      matrices:[{label:"Distance labels (∞ means no path discovered yet)",rowLabels:ids,columnLabels:["distance","finalized (1=yes)"],entries:ids.map(id=>[distances[id],Number(settled.includes(id))])}],
      summary:`Finalization order: ${settled.join(" → ")||"none"}. Frontier, next first: ${frontier.map(id=>`${id}(${distances[id]})`).join(", ")||"empty"}. ${done?"All reachable distances are now certified: S=0, B=0, A=2, C=3. U remains at infinity and is unreachable.":"Finite unsettled labels are candidate path costs and may still improve. Infinity alone at an intermediate step does not prove a vertex unreachable."} Zero-cost edges are allowed: nonnegative does not mean strictly positive.`,
      values:[value("Finalized vertices",settled.length),value("Distance label for A",distances.A,"credits"),value("Distance label for C",distances.C,"credits"),value("Unreachable vertices certified at completion",done?1:0)]};
  }
  const edges:Edge[]=[{from:'S',to:'A',cost:1},{from:'S',to:'B',cost:1},{from:'A',to:'C',cost:1},{from:'C',to:'D',cost:1},{from:'D',to:'G',cost:1},{from:'B',to:'G',cost:9}],h:Record<string,number>={S:2,A:1.5,B:4.5,C:1,D:.5,G:0};
  const runs:{bound:number;visits:number;expanded:number;cutoffs:number;next:number;path:string[]}[]=[];let bound=h.S;
  for(let iteration=0;iteration<input;iteration++){
    const row={bound,visits:0,expanded:0,cutoffs:0,next:Infinity,path:[] as string[]};
    function visit(id:string,g:number,path:string[]):boolean{
      row.visits++;const f=g+h[id];
      if(f>bound){row.cutoffs++;row.next=Math.min(row.next,f);return false;}
      if(id==='G'){row.path=path;return true;}
      row.expanded++;for(const e of edges.filter(e=>e.from===id))if(!path.includes(e.to)&&visit(e.to,g+e.cost,[...path,e.to]))return true;
      return false;
    }
    visit('S',0,['S']);runs.push(row);if(row.path.length)break;bound=row.next;
  }
  const last=runs[runs.length-1],total=runs.reduce((n,r)=>n+r.visits,0),found=last.path.length>0;
  return {...base,kind:"lines",controlValue:`Iteration ${runs.length} · f threshold ${last.bound}`,series:[{label:"f along the cost-four route",points:[[0,2],[1,2.5],[2,3],[3,3.5],[4,4]],style:"points"},{label:"Current allowed threshold",points:[[0,last.bound],[4,last.bound]]}],xLabel:"Edge depth along S→A→C→D→G",yLabel:"Estimated total cost f (credits)",xDomain:[0,4],yDomain:[0,6],xTicks:[0,1,2,3,4],markers:[{label:"Side branch B has f=5.5",point:[1,5.5],hollow:true}],
    matrices:[{label:"Completed threshold passes; visits include cutoffs and goals",rowLabels:runs.map((_,i)=>`Pass ${i+1}`),columnLabels:["threshold","visits","expanded","cutoffs"],entries:runs.map(r=>[r.bound,r.visits,r.expanded,r.cutoffs])}],
    summary:`Thresholds so far: ${runs.map(r=>r.bound).join(" → ")}. Total node visits: ${total}. ${found?`The final pass returns ${last.path.join(" → ")} at cost 4. It does not explore B after finding the goal.`:`This pass found no goal and cut off ${last.cutoffs} entries. The smallest exceeded f is ${last.next}, which becomes the next threshold—not the current threshold plus one.`} The hollow point is B's f=5.5, a different branch at depth one. All f values use fixed h equal to half the exact remaining cost. The plot shows possible prefix scores, not a claim that every point was visited in this pass.`,
    values:[value("Current f threshold",last.bound,"credits"),value("Total node visits",total),value("Current pass expansions",last.expanded),value("Goal found (1=yes)",Number(found)),...(!found?[value("Next threshold",last.next,"credits")]:[value("Returned cost",4,"credits")])]};
}
