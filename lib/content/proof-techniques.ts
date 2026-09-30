import type { CalculationResult } from "./calculations.ts";

export const proofTechniqueModels = ["induction-square", "pigeonhole-capacity", "recurrence-levels"] as const;
export type ProofTechniqueModel = typeof proofTechniqueModels[number];
export const isProofTechniqueModel = (model: string): model is ProofTechniqueModel => (proofTechniqueModels as readonly string[]).includes(model);
const value = (label: string, value: number, unit = "") => ({ label, value, unit });

export function calculateProofTechnique(model: ProofTechniqueModel, input: number): CalculationResult {
  if (model === "recurrence-levels") {
    if (!Number.isInteger(input) || input < 0 || input > 8) throw new Error("Invalid recurrence depth");
    const n = 2 ** input;
    const levels = Array.from({length:input+1},(_,depth)=>{const calls=2**depth,size=n/calls;return [calls,size,depth===input?1:size,calls*(depth===input?1:size)];});
    let recursiveTotal = 1;
    for(let size=2;size<=n;size*=2) recursiveTotal=2*recursiveTotal+size;
    const levelTotal=levels.reduce((sum,row)=>sum+row[3],0);
    return {kind:"bars",controlValue:`k=${input} · n=${n} items`,
      series:[{label:"Total work at each depth (including leaves)",points:levels.map((row,depth)=>[depth,row[3]])}],
      xDomain:[-.5,input+.5],yDomain:[0,4*Math.ceil(n*1.25/4)],xLabel:"Recursion depth d",yLabel:"Work units per level",
      xTicks:[...new Set([0,Math.floor(input/2),input])],
      matrices:[{label:`Level accounting; depth ${input} is the base-case level`,rowLabels:levels.map((_,d)=>`d=${d}`),columnLabels:["calls","size","each","total"],entries:levels}],
      summary:`For n=${n}, there are ${input} internal levels and one leaf level. ${input===0?"The single leaf contributes one work unit; there is no internal-level work.":`Each internal level contributes ${n} work units, and ${n} leaves contribute one unit each.`} Summing the bars gives ${levelTotal}; evaluating T(1)=1 and T(n)=2T(n/2)+n gives ${recursiveTotal}. The formula n(log₂ n+1) also gives ${n*(input+1)}. ${input===0?"At n=1 there is only the base case, with no split or merge.":"More calls at deeper levels are offset by smaller per-call work."} These are model work units, not milliseconds or exact comparison counts.`,
      values:[value("Input items n",n),value("Internal levels",input),value("Leaves",n),value("Total calls",2*n-1),value("Internal work",n*input,"work units"),value("Leaf work",n,"work units"),value("Total from level sum",levelTotal,"work units"),value("Total from recurrence",recursiveTotal,"work units")]};
  }
  if (!Number.isInteger(input) || input < 1 || input > (model === "induction-square" ? 10 : 12)) throw new Error(`Invalid ${model} input`);
  const base: CalculationResult = { kind: "matrix", series: [], xDomain: [0, 1], yDomain: [0, 1], xLabel: "", yLabel: "", summary: "", values: [] };
  if (model === "induction-square") {
    const n = input, previous = (n-1)**2, added = 2*n-1, sum = Array.from({length:n},(_,i)=>2*i+1).reduce((a,b)=>a+b,0);
    return { ...base, controlValue: `n=${n} · ${n}×${n} square`,
      grid: { title: "An L-shaped border is the next odd number", columns: n, rows: n,
        cells: Array.from({length:n*n},(_,i)=>({row:Math.floor(i/n),column:i%n,label:"",accent:Math.floor(i/n)===n-1||i%n===n-1})),
        legend: [`Solid: previous square, (n−1)²=${previous}`, `Striped: added border, 2n−1=${added}`],
        summary: `${previous} old cells plus ${added} new cells make ${sum}=${n}² cells. The striped right column has ${n} cells and the striped bottom row contributes ${n-1} more; the corner is counted once. ${n===1?"This is the base case: an empty old square plus one new cell.":"This picture illustrates one step; the symbolic argument below covers every integer n≥1."}` },
      matrices: [{ label:"Finite arithmetic checks; the general induction argument is in the lesson", rowLabels:Array.from({length:n},(_,i)=>`n=${i+1}`),columnLabels:["odd", "sum", "n²"], entries:Array.from({length:n},(_,i)=>{const k=i+1;return [2*k-1,Array.from({length:k},(_,j)=>2*j+1).reduce((a,b)=>a+b,0),k*k];}) }],
      summary: `At n=${n}, the odd-number sum is ${Array.from({length:n},(_,i)=>2*i+1).join("+")}=${sum}. The previous square contributes ${previous}; the new border contributes ${added}, so ${previous}+${added}=${n*n}. Induction requires the base case and a valid symbolic step for an arbitrary integer—not just checking the ten available slider values.`,
      values: [value("Selected n",n),value("Previous square cells",previous),value("Added border cells",added),value("Explicit odd-number sum",sum),value("Square n²",n*n),value("Difference between sum and n²",sum-n*n)] };
  }
  const bins = [0,0,0,0], cells: NonNullable<CalculationResult["grid"]>["cells"] = [];
  for(let i=0;i<input;i++){const column=i%4,row=bins[column]++;cells.push({row,column,label:String(i+1),accent:row>0});}
  const max = Math.max(...bins), lower = Math.ceil(input/4), collisionPairs=bins.reduce((s,c)=>s+c*(c-1)/2,0);
  return { ...base, controlValue:`${input} ${input===1?"item":"items"} · 4 buckets`,
    grid:{title:"Four buckets cannot keep five items separate",columns:4,rows:3,columnLabels:["A","B","C","D"],cells,
      legend:["Solid: first item in a bucket", "Striped: an additional item in that bucket"],
      summary:`Numbered cells are distinct items placed round-robin into four buckets. Bucket counts: (${bins.join(", ")}). Empty outlines are unused display slots, not a capacity restriction. At n=${input}, ${input>4?"a collision is unavoidable for every possible assignment to four buckets.":input===1?"a single item cannot collide with another item.":"a collision-free assignment is possible, but other assignments could collide."} This is one arrangement, not enumeration of all assignments.`},
    matrices:[{label:"Actual bucket loads in the displayed round-robin arrangement",rowLabels:["A","B","C","D"],columnLabels:["items", "pairs"],entries:bins.map(c=>[c,c*(c-1)/2])}],
    summary:`There ${input===1?"is 1 item":`are ${input} items`} and four buckets. If every bucket held at most one item, the total would be at most four. ${input>4?`Since ${input}>4, that assumption contradicts the actual total: at least one bucket must contain two or more items.`:"Since the total does not exceed four, this capacity argument does not force a collision."} More generally, some bucket must have at least ceil(${input}/4)=${lower} ${lower===1?"item":"items"}. The balanced arrangement shown attains that lower bound with maximum load ${max}; it does not establish equal likelihood of assignments.`,
    values:[value("Items n",input),value("Buckets m",4),value("Maximum total under no-collision assumption",4),value("Unavoidable collision (1 yes, 0 no)",Number(input>4)),value("Universal lower bound on maximum load",lower),value("Actual maximum load",max),value("Actual colliding item pairs",collisionPairs)] };
}
