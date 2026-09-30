import type { CalculationResult } from "./calculations.ts";
export const searchRefinementModels=["search-bidirectional","search-beam","search-branch-bound"] as const;
export type SearchRefinementModel=typeof searchRefinementModels[number];
export const isSearchRefinementModel=(model:string):model is SearchRefinementModel=>(searchRefinementModels as readonly string[]).includes(model);
type Edge={from:string;to:string;cost:number};
const value=(label:string,value:number,unit="")=>({label,value,unit});
const base={kind:"matrix" as const,series:[],xLabel:"Stage",yLabel:"Count",xDomain:[0,5] as [number,number],yDomain:[0,10] as [number,number]};
function diagram(edges:Edge[],positions:[string,number,number][],path:string[],title:string,summary:string):NonNullable<CalculationResult["graph"]>{return {title,summary,height:350,maxWidth:440,nodes:positions.map(([id,x,y])=>({id,label:id,x,y,observed:false,state:""})),edges:edges.map(e=>({...e,directed:true,label:String(e.cost),accent:path.some((id,i)=>id===e.from&&path[i+1]===e.to)}))};}

export function calculateSearchRefinement(model:SearchRefinementModel,input:number):CalculationResult{
  if(!Number.isInteger(input)||input<(model==="search-beam"?1:0)||input>(model==="search-branch-bound"?4:3))throw new Error(`Invalid ${model} input`);
  if(model==="search-bidirectional"){
    const edges:Edge[]=[['S','A'],['S','B'],['A','C'],['A','D'],['B','E'],['B','F'],['C','G'],['F','G']].map(([from,to])=>({from,to,cost:1}));
    const df=new Map([['S',0]]),db=new Map([['G',0]]),pf=new Map<string,string>(),pb=new Map<string,string>();
    let ff=['S'],fb=['G'],expandedF=0,expandedB=0,meeting:string|undefined;
    const stages:{name:string;expanded:number;discovered:number}[]=[];
    for(let stage=0;stage<input&&!meeting;stage++){
      const forward=stage%2===0,front=forward?ff:fb,dist=forward?df:db,parent=forward?pf:pb,next:string[]=[];
      for(const node of front){
        if(forward)expandedF++;else expandedB++;
        const neighbors=edges.filter(e=>forward?e.from===node:e.to===node).map(e=>forward?e.to:e.from).sort();
        for(const child of neighbors)if(!dist.has(child)){dist.set(child,dist.get(node)!+1);parent.set(child,node);next.push(child);}
      }
      if(forward)ff=next;else fb=next;
      stages.push({name:forward?'Forward':'Backward',expanded:front.length,discovered:next.length});
      meeting=[...df.keys()].filter(id=>db.has(id)).sort((a,b)=>(df.get(a)!+db.get(a)!)-(df.get(b)!+db.get(b)!)||a.localeCompare(b))[0];
    }
    const path:string[]=[];
    if(meeting){let n:string|undefined=meeting;while(n){path.unshift(n);n=pf.get(n);}n=pb.get(meeting);while(n){path.push(n);n=pb.get(n);}}
    return {...base,controlValue:`${stages.length} complete layer expansions${meeting?` · meet at ${meeting}`:""}`,
      graph:diagram(edges,[["S",160,35],["A",80,125],["B",240,125],["C",40,215],["D",120,215],["E",200,215],["F",280,215],["G",160,315]],path,"Forward successors, backward predecessors","All edges point in the original action direction and cost one. Forward search starts at S. Backward search starts at G and follows incoming edges in reverse. Dashed coral marks the completed route only after a meeting is found."),
      matrices:[{label:"Discovery distances from each side (∞ means not yet discovered)",rowLabels:['S','A','B','C','D','E','F','G'],columnLabels:["from S","to G"],entries:['S','A','B','C','D','E','F','G'].map(id=>[df.get(id)??Infinity,db.get(id)??Infinity])},...(stages.length?[{label:"Whole-layer work",rowLabels:stages.map((s,i)=>`${i+1}. ${s.name}`),columnLabels:["expanded","new entries"],entries:stages.map(s=>[s.expanded,s.discovered])}]:[])],
      summary:`Forward frontier: ${ff.join(", ")||"empty"}. Backward frontier: ${fb.join(", ")||"empty"}. ${meeting?`Complete-layer intersection selects ${meeting}; d_forward+d_backward=${df.get(meeting)}+${db.get(meeting)}=${path.length-1}. Returned route: ${path.join(" → ")}. C and F both give a three-edge solution; the alphabetical meeting tie chooses C.`:"The discovered sets have no intersection yet."} Expanded ${expandedF} forward and ${expandedB} backward nodes. Two distance maps hold ${df.size+db.size} entries in total, counting a state twice when both searches discovered it.`,
      values:[value("Forward expansions",expandedF),value("Backward expansions",expandedB),value("Distance-map entries",df.size+db.size),value("Meeting found (1=yes)",Number(Boolean(meeting))),...(meeting?[value("Returned length",path.length-1,"edges")]:[])]};
  }
  if(model==="search-beam"){
    const edges:Edge[]=[{from:'S',to:'A',cost:1},{from:'S',to:'B',cost:1},{from:'S',to:'C',cost:1},{from:'A',to:'D',cost:1},{from:'B',to:'G',cost:8},{from:'C',to:'G',cost:1}],h:Record<string,number>={S:0,A:0,B:0,C:1,D:0,G:0};
    type Entry={id:string;g:number;path:string[]};let beam:Entry[]=[{id:'S',g:0,path:['S']}],solution:Entry|undefined;
    const stages:{kept:string[];discarded:string[];candidates:number}[]=[],expanded:string[]=[];
    while(beam.length&&!solution){
      const candidates=new Map<string,Entry>();
      for(const node of beam){expanded.push(node.id);for(const e of edges.filter(e=>e.from===node.id)){const child={id:e.to,g:node.g+e.cost,path:[...node.path,e.to]},old=candidates.get(e.to);if(!old||child.g<old.g)candidates.set(e.to,child);}}
      const ordered=[...candidates.values()].sort((a,b)=>h[a.id]-h[b.id]||a.id.localeCompare(b.id));
      beam=ordered.slice(0,input);stages.push({kept:beam.map(n=>n.id),discarded:ordered.slice(input).map(n=>n.id),candidates:ordered.length});solution=beam.find(n=>n.id==='G');
    }
    return {...base,controlValue:`Beam width ${input} · ${solution?`cost ${solution.g}`:"goal lost"}`,
      graph:diagram(edges,[["S",160,40],["A",45,145],["B",160,145],["C",275,145],["D",45,295],["G",230,295]],solution?.path??[],"Discarded alternatives do not wait on another frontier","All edges and costs remain visible. A→D is a dead end. S→B→G costs 9; S→C→G costs 2. Dashed coral marks the returned path, if one survives. The table records permanent beam discards."),
      matrices:[{label:"Each layer after same-state candidates are merged by lowest g",rowLabels:stages.map((s,i)=>`Layer ${i+1}: ${s.kept.join(',')||'empty'}`),columnLabels:["candidates","kept","discarded"],entries:stages.map(s=>[s.candidates,s.kept.length,s.discarded.length])},{label:"Fixed heuristic used to rank each layer",rowLabels:['S','A','B','C','D','G'],columnLabels:['h'],entries:['S','A','B','C','D','G'].map(id=>[h[id]])}],
      summary:`Width ${input}: ${stages.map((s,i)=>`layer ${i+1} keeps [${s.kept.join(', ')}] and discards [${s.discarded.join(', ')}]`).join('; ')}. ${solution?`Returns ${solution.path.join(' → ')} at cost ${solution.g}; the true optimum is 2.`:"A and then D survive, but neither leads to a goal. The empty beam ends this run despite two valid routes in the original graph."} The heuristic is admissible and consistent, including at dead ends whose true remaining cost is infinite. Losing alternatives, not an invalid heuristic, breaks the guarantee.`,
      values:[value("Beam width",input),value("Non-goal entries expanded",expanded.length),value("Entries discarded by width",stages.reduce((n,s)=>n+s.discarded.length,0)),value("Goal found (1=yes)",Number(Boolean(solution))),...(solution?[value("Returned cost",solution.g,"credits")]:[])]};
  }
  const weights=[4,3,2],profits=[7,5,3],initialMasks=[0,1,2,4,3],initialMask=initialMasks[input];
  const total=(mask:number,items:number[])=>items.reduce((n,v,i)=>n+((mask&(1<<(2-i)))?v:0),0);
  let best=total(initialMask,profits),bestMask=initialMask;
  const trace:{prefix:string;weight:number;profit:number;upper:number;incumbent:number;status:string}[]=[];
  function visit(prefix:string,weight:number,profit:number,mask:number){
    if(weight>5){trace.push({prefix,weight,profit,upper:Infinity,incumbent:best,status:'infeasible'});return;}
    if(profit>best){best=profit;bestMask=mask;}
    let remaining=5-weight,upper=profit;
    for(let i=prefix.length;i<3&&remaining>0;i++){const fraction=Math.min(1,remaining/weights[i]);upper+=fraction*profits[i];remaining-=fraction*weights[i];}
    const prune=upper<=best;
    trace.push({prefix:prefix||'∅',weight,profit,upper,incumbent:best,status:prune?'bound prune':'branch'});
    if(prune||prefix.length===3)return;
    const i=prefix.length;visit(prefix+'1',weight+weights[i],profit+profits[i],mask|(1<<(2-i)));visit(prefix+'0',weight,profit,mask);
  }
  visit('',0,0,0);
  const finite=trace.filter(r=>r.status!=='infeasible'),infeasible=trace.filter(r=>r.status==='infeasible');
  return {...base,controlValue:`Seed ${initialMask.toString(2).padStart(3,'0')} · initial profit ${total(initialMask,profits)}`,
    grid:{title:"Eight whole-item packings; bits mean A, B, C",summary:"A weighs 4 and earns 7; B weighs 3 and earns 5; C weighs 2 and earns 3. Capacity is 5. Stripes mark overweight assignments; the coral outline marks the returned optimal packing. This complete eight-case display is an explanatory oracle, not work the branch-and-bound search must enumerate.",rows:2,columns:4,legend:["Bits 1=include, 0=exclude","Striped: weight exceeds 5","Coral outline: returned optimum"],cells:Array.from({length:8},(_,mask)=>({row:Math.floor(mask/4),column:mask%4,label:mask.toString(2).padStart(3,'0'),accent:total(mask,weights)>5,selected:mask===bestMask}))},
    matrices:[{label:"All packings: feasibility is separate from profit",rowLabels:Array.from({length:8},(_,m)=>m.toString(2).padStart(3,'0')),columnLabels:['weight','profit','feasible (1=yes)'],entries:Array.from({length:8},(_,m)=>[total(m,weights),total(m,profits),Number(total(m,weights)<=5)])},{label:"Visited feasible prefixes: relaxed bound versus current incumbent",rowLabels:finite.map(r=>`${r.prefix}: ${r.status}`),columnLabels:['upper bound','incumbent'],entries:finite.map(r=>[r.upper,r.incumbent])}],
    summary:`Starting from feasible packing ${initialMask.toString(2).padStart(3,'0')} with profit ${total(initialMask,profits)}, include-first branch and bound visits ${trace.length} prefixes. ${infeasible.length} are overweight (${infeasible.map(r=>r.prefix).join(', ')}); ${finite.filter(r=>r.status==='bound prune').length} are pruned because their fractional upper bound cannot exceed the incumbent. The final packing ${bestMask.toString(2).padStart(3,'0')} has weight ${total(bestMask,weights)} and profit ${best}. The root relaxation earns 7+5/3=8⅔ by taking all A and one-third B, which is not a legal whole-item packing. Bounds are not rounded down in this demonstration.`,
    values:[value("Initial feasible profit",total(initialMask,profits)),value("Root relaxed upper bound",7+5/3),value("Returned feasible profit",best),value("Returned weight",total(bestMask,weights)),value("Visited prefixes",trace.length),value("Overweight prefixes",infeasible.length)]};
}
