import type { CalculationResult } from "./calculations.ts";

export function calculateClassicalOverview(workers:number):CalculationResult {
  if(!Number.isInteger(workers)||workers<1||workers>3)throw new Error("Invalid scheduling capacity");
  const schedules:{starts:number[];finish:number;load:number[]}[]=[];
  for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let c=0;c<3;c++){
    const starts=[a,b,c],load=[0,1,2].map(t=>starts.filter(s=>s===t).length);
    if(a+1<=c&&b!==c&&Math.max(...load)<=workers)schedules.push({starts,load,finish:Math.max(...starts)+1});
  }
  schedules.sort((a,b)=>a.finish-b.finish||a.starts[0]-b.starts[0]||a.starts[1]-b.starts[1]||a.starts[2]-b.starts[2]);
  const best=schedules[0],lower=Math.max(Math.ceil(3/workers),2),names=["A","B","C"];
  return {kind:"matrix",series:[],xLabel:"Time",yLabel:"Task",xDomain:[0,3],yDomain:[0,3],controlValue:`${workers} ${workers===1?"worker":"workers"} · finish at t=${best.finish}`,
    grid:{title:"One optimal schedule: rows A, B, C; columns are time intervals",summary:`A must finish before C starts. B and C cannot overlap. Each task takes one time unit and one worker. Striped labeled cells show work; empty cells are idle time for that task. The selected schedule starts (A,B,C) at (${best.starts.join(', ')}).`,rows:3,columns:3,columnLabels:["0–1","1–2","2–3"],legend:["Rows from top: A, B, C","Striped labeled cell: task runs","A finishes before C; B cannot overlap C"],cells:best.starts.map((column,row)=>({row,column,label:names[row],accent:true}))},
    matrices:[{label:"Chosen plan and its checkable finish times",rowLabels:names,columnLabels:["start","finish"],entries:best.starts.map(t=>[t,t+1])},{label:"Resource use in each interval",rowLabels:["0–1","1–2","2–3"],columnLabels:["busy workers","capacity"],entries:best.load.map(n=>[n,workers])},{label:"All feasible schedules in the bounded model",rowLabels:schedules.map((_,i)=>`Plan ${i+1}`),columnLabels:["A start","B start","C start","finish"],entries:schedules.map(s=>[...s.starts,s.finish])}],
    summary:`Of 27 assignments of three start times from {0,1,2}, ${schedules.length} satisfy all constraints with ${workers} ${workers===1?'worker':'workers'}. The best finish time is ${best.finish}; ${schedules.filter(s=>s.finish===best.finish).length} ${schedules.filter(s=>s.finish===best.finish).length===1?'schedule attains':'schedules attain'} it. A workload lower bound is ceil(3/${workers})=${Math.ceil(3/workers)} and the A→C chain requires at least 2 time units. Their maximum is ${lower}, matching the displayed feasible schedule and certifying optimality. ${workers===1?'One worker serializes all three tasks.':'A and B run together, then C. A third worker cannot shorten the two-task precedence chain.'} Enumeration is the teaching solver, not a claim that large scheduling problems require brute force.`,
    values:[{label:"Assignments examined",value:27,unit:""},{label:"Feasible schedules",value:schedules.length,unit:""},{label:"Optimal finish",value:best.finish,unit:"time units"},{label:"Proved lower bound",value:lower,unit:"time units"},{label:"Optimality gap",value:best.finish-lower,unit:"time units"}]};
}
