import type { CalculationResult } from "./calculations.ts";
export const messagePassingModels = ["message-tree", "message-sum", "message-max", "message-loopy"] as const;
export type MessagePassingModel = typeof messagePassingModels[number];
export const isMessagePassingModel=(model:string):model is MessagePassingModel=>(messagePassingModels as readonly string[]).includes(model);
type Pair=[number,number];
const value=(label:string,value:number,unit="")=>({label,value,unit});
const fmt=(v:number)=>Number(v.toFixed(6));
const normalize=(p:Pair):Pair=>[p[0]/(p[0]+p[1]),p[1]/(p[0]+p[1])];
const names=["X","Y","Z"];
const pair=(a:number,b:number)=>a===b?3:1;
const node=(id:string,x:number,y:number,state="")=>({id,label:id,x,y,observed:false,state});
const edge=(from:string,to:string)=>({from,to,directed:false});
const chain=(title:string,summary:string,states=["","",""]):NonNullable<CalculationResult["graph"]>=>({title,summary,nodes:names.map((name,i)=>node(name,50+110*i,50,states[i])),edges:[edge("X","Y"),edge("Y","Z")]});
const binaryTable=(label:string,rowLabels:string[],entries:number[][])=>({label,rowLabels,columnLabels:["state 0","state 1"],entries});
function treeEnumeration(a:number) {
  const rows=Array.from({length:8},(_,i)=>{const states=[i>>2,(i>>1)&1,i&1];return {states,weight:(states[0]?a:1)*(states[2]?1:2)*pair(states[0],states[1])*pair(states[1],states[2])};});
  const z=rows.reduce((s,r)=>s+r.weight,0);
  return {rows,z,marginals:names.map((_,i):Pair=>[rows.filter(r=>r.states[i]===0).reduce((s,r)=>s+r.weight,0)/z,rows.filter(r=>r.states[i]===1).reduce((s,r)=>s+r.weight,0)/z])};
}
export function calculateMessagePassing(model:MessagePassingModel,input:number):CalculationResult {
  const bounds:Record<MessagePassingModel,Pair>={"message-tree":[0,4],"message-sum":[0.05,0.95],"message-max":[1,6],"message-loopy":[0,40]};
  if(!Number.isFinite(input)||input<bounds[model][0]||input>bounds[model][1]||((model==="message-tree"||model==="message-loopy")&&!Number.isInteger(input)))throw new Error(`Invalid ${model} input`);
  const base:CalculationResult={kind:"lines",series:[],xDomain:[0,1],yDomain:[0,1],xLabel:"Parameter",yLabel:"Probability",summary:"",values:[]};
  if(model==="message-tree") {
    const unary:Pair[]=[[1,3],[1,1],[2,1]],neighbors=[[1],[0,2],[1]],schedule=[[0,1],[2,1],[1,0],[1,2]],messages:Record<string,Pair>={};
    const history=schedule.slice(0,input).map(([from,to])=>{
      const message=[0,1].map(target=>[0,1].reduce((s,state)=>s+unary[from][state]*pair(state,target)*neighbors[from].filter(n=>n!==to).reduce((p,n)=>p*(messages[`${n}-${from}`]?.[state]??1),1),0)) as Pair;
      messages[`${from}-${to}`]=message;return {label:`${names[from]}→${names[to]}`,message};
    });
    const beliefs=names.map((_,i)=>normalize([0,1].map(state=>unary[i][state]*neighbors[i].reduce((p,n)=>p*(messages[`${n}-${i}`]?.[state]??1),1)) as Pair));
    const complete=neighbors.map((ns,i)=>ns.every(n=>messages[`${n}-${i}`]!==undefined)),exact=treeEnumeration(3);
    return {...base,kind:"matrix",controlValue:`${input}/4 messages · ${input?`last ${history[input-1].label}`:"local weights only"}`,
      graph:chain("Two edges, four directed messages",`Schedule: X→Y, Z→Y, Y→X, Y→Z. ${complete.filter(Boolean).length} of 3 node beliefs now include the whole tree. Lines show pair factors; labels indicate which beliefs are exact.`,complete.map(done=>done?"exact":"partial")),
      matrices:[binaryTable("Current normalized beliefs (partial until node marked exact)",names.map((n,i)=>`${n} ${complete[i]?"exact":"partial"}`),beliefs),binaryTable("Exact marginals from enumeration",names,exact.marginals),...(history.length?[binaryTable("Completed unnormalized messages, indexed by recipient state",history.map(h=>h.label),history.map(h=>h.message))]:[])],
      summary:`After ${input} messages, ${names.filter((_,i)=>complete[i]).join(", ")||"no nodes"} ${complete.filter(Boolean).length===1?"has":"have"} complete tree information. Current P(X=1)=${fmt(beliefs[0][1])}, P(Y=1)=${fmt(beliefs[1][1])}, P(Z=1)=${fmt(beliefs[2][1])}. Unsent messages are neutral factors 1, so unfinished beliefs are not claimed to be full-model marginals.`,
      values:[value("Completed messages",input),value("Nodes with complete incoming information",complete.filter(Boolean).length),value("Exact partition function",exact.z),...beliefs.map((p,i)=>value(`Current belief ${names[i]}=1`,p[1]))]};
  }
  if(model==="message-sum") {
    const p=input,message:Pair=[0.8*(1-p)+0.2*p,0.8*p+0.2*(1-p)],weighted:Pair=[0.4*message[0],0.6*message[1]],belief=normalize(weighted);
    const posterior=(t:number)=>0.6*(0.2+0.6*t)/(0.4*(0.8-0.6*t)+0.6*(0.2+0.6*t));
    return {...base,xDomain:[0.05,0.95],xLabel:"Unary probability P(Y=1)=p",yLabel:"P(Z=1 | even parity)",selectedX:p,
      graph:{title:"One parity factor gathers two incoming messages",height:195,summary:"The square f enforces X⊕Y⊕Z=0. Unary factors are listed in the table and omitted from this scope diagram. The message f→Z excludes Z's own unary weight; that weight is applied when forming its belief.",nodes:[node("X",50,45),node("Y",160,45),node("Z",270,45),{...node("f",160,140),kind:"factor"}],edges:[edge("X","f"),edge("Y","f"),edge("Z","f")]},
      series:[{label:"Exact sum-product posterior of Z",points:Array.from({length:91},(_,i):Pair=>{const t=0.05+i*.01;return[t,posterior(t)];})},{label:"Z unary probability before the parity constraint",points:[[0.05,0.6],[0.95,0.6]]}],markers:[{label:"Current constrained posterior",point:[p,belief[1]]}],
      matrices:[binaryTable("Unary probabilities before applying the constraint",["X","Y","Z"],[[0.8,0.2],[1-p,p],[0.4,0.6]]),{label:"Parity factor f(X,Y,Z)",rowLabels:["Z=0","Z=1"],columnLabels:["X0 Y0","X0 Y1","X1 Y0","X1 Y1"],entries:[[1,0,0,1],[0,1,1,0]]},binaryTable("Factor message, weighted result and normalized belief for Z",["f→Z","× unary Z","belief Z"],[message,weighted,belief])],
      summary:`At p=${fmt(p)}, f→Z=(${fmt(message[0])},${fmt(message[1])}). Multiplying by Z's unary weights (0.4,0.6) gives (${fmt(weighted[0])},${fmt(weighted[1])}), which sum to ${fmt(weighted[0]+weighted[1])}. Normalize to obtain P(Z=1 | even parity)=${fmt(belief[1])}.`,
      values:[value("Message to Z at state 0",message[0]),value("Message to Z at state 1",message[1]),value("Probability of even parity under independent unary model",weighted[0]+weighted[1]),value("P(Z=1 | even parity)",belief[1])]};
  }
  if(model==="message-max") {
    const a=input,unaryX=[1,a],unaryZ=[2,1];
    const xChoice=[0,1].map(y=>unaryX[0]*pair(0,y)>=unaryX[1]*pair(1,y)?0:1),zChoice=[0,1].map(y=>unaryZ[0]*pair(y,0)>=unaryZ[1]*pair(y,1)?0:1);
    const mx=[0,1].map(y=>unaryX[xChoice[y]]*pair(xChoice[y],y)),mz=[0,1].map(y=>unaryZ[zChoice[y]]*pair(y,zChoice[y])),score=mx.map((v,i)=>v*mz[i]);
    const y=score[0]>=score[1]?0:1,chosen=[xChoice[y],y,zChoice[y]],exact=treeEnumeration(a),max=Math.max(...exact.rows.map(r=>r.weight));
    const ties=exact.rows.filter(r=>r.weight===max).map(r=>r.states.join(""));
    return {...base,xDomain:[1,6],yDomain:[0,60],xLabel:"Unary weight a for X=1",yLabel:"Best unnormalized joint weight",selectedX:a,
      graph:chain("Trace back one compatible joint assignment",`Root at Y, maximize its combined score, then follow stored choices for X and Z. MAP assignment${ties.length>1?"s":""}: ${ties.join(" and ")}. Displayed traceback chooses state 0 on ties.`,chosen.map(s=>`MAP=${s}`)),
      series:[{label:"Best joint weight with Y=0",points:Array.from({length:101},(_,i):Pair=>{const t=1+i*.05;return[t,6*Math.max(3,t)];})},{label:"Best joint weight with Y=1",points:[[1,9],[6,54]]}],markers:[{label:"Chosen joint score",point:[a,max]}],
      matrices:[binaryTable("Max-product messages and root scores (not probabilities)",["X→Y","Z→Y","score Y"],[mx,mz,score]),{label:"Backpointers by root state",rowLabels:["Y=0","Y=1"],columnLabels:["chosen X","chosen Z"],entries:[[xChoice[0],zChoice[0]],[xChoice[1],zChoice[1]]]}],
      summary:`For a=${fmt(a)}, root scores are (${fmt(score[0])},${fmt(score[1])}). Traceback selects ${chosen.join("")} with joint weight ${fmt(max)}. Exact normalization gives its probability ${fmt(max/exact.z)}. Normalizing the two root max scores gives ${fmt(score[1]/(score[0]+score[1]))} for Y=1, but the actual marginal is ${fmt(exact.marginals[1][1])}; max scores are not marginal probabilities.`,
      values:[value("Maximum joint weight",max),value("Exact partition function",exact.z),value("Probability of selected joint MAP assignment",max/exact.z),value("Normalized Y=1 max score (not a marginal)",score[1]/(score[0]+score[1])),value("Exact marginal P(Y=1)",exact.marginals[1][1]),value("Number of joint MAP assignments",ties.length)]};
  }
  const coupling=0.8,field=0.3,spin=[-1,1],unary=spin.map(s=>Math.exp(field*s));
  let partition=0,numerator=0;
  for(const x of spin)for(const y of spin)for(const z of spin){const weight=Math.exp(coupling*(x*y+y*z+z*x)+field*(x+y+z));partition+=weight;if(x===1)numerator+=weight;}
  const exact=numerator/partition;
  const belief=(message:Pair)=>normalize([unary[0]*message[0]**2,unary[1]*message[1]**2])[1];
  let message:Pair=[0.5,0.5];const history=[{probability:belief(message),message,residual:0}];
  for(let t=1;t<=40;t++){
    const next=normalize(spin.map(target=>spin.reduce((s,state,i)=>s+Math.exp(coupling*state*target)*unary[i]*message[i],0)) as Pair);
    const residual=Math.max(Math.abs(next[0]-message[0]),Math.abs(next[1]-message[1]));message=next;history.push({probability:belief(message),message,residual});
  }
  const selected=history[input];
  return {...base,xDomain:[0,40],xTicks:[0,10,20,30,40],yDomain:[0.5,1],xLabel:"Synchronous message-update rounds",yLabel:"Single-spin probability of +1",selectedX:input,
    graph:{title:"A stable loop can still give the wrong marginal",height:205,summary:"Three spins on a triangle, each with field h=0.3 and each pair with coupling J=0.8. All six directed messages remain equal by symmetry. Every update excludes the recipient's incoming message; the node belief uses both incoming messages.",nodes:[node("X",160,40),node("Y",55,155),node("Z",265,155)],edges:[edge("X","Y"),edge("Y","Z"),edge("Z","X")]},
    series:[{label:"Loopy BP belief through selected round",points:history.slice(0,input+1).map((h,i):Pair=>[i,h.probability])},{label:"Exact marginal from all eight spin assignments",points:[[0,exact],[40,exact]]}],markers:[{label:"Current loopy belief",point:[input,selected.probability]}],
    matrices:[{label:"Each of six normalized directed messages",rowLabels:["message"],columnLabels:["recipient −1","recipient +1"],entries:[selected.message]}],
    summary:`After ${input} rounds, loopy BP gives P(+1)=${fmt(selected.probability)} while exact enumeration gives ${fmt(exact)}. Absolute error is ${fmt(Math.abs(selected.probability-exact))}. ${input?`Largest normalized-message change this round is ${selected.residual.toExponential(3)}.`:"No update has run, so a message-change convergence check is not yet available."} A small update residual measures stabilization, not accuracy.`,
    values:[value("Completed synchronous rounds",input),value("Loopy belief P(+1)",selected.probability),value("Exact P(+1)",exact),value("Absolute marginal error",Math.abs(selected.probability-exact)),...(input?[value("Maximum normalized-message change",selected.residual)]:[]),value("Exact partition function",partition)]};
}
