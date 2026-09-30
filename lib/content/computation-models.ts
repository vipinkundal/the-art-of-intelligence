import type { CalculationResult } from "./calculations.ts";
export const computationModels = ["sat-certificate", "parity-automaton", "bounded-execution"] as const;
export type ComputationModel = typeof computationModels[number];
export const isComputationModel = (model:string):model is ComputationModel => (computationModels as readonly string[]).includes(model);
const value=(label:string,value:number,unit="")=>({label,value,unit});
const base:CalculationResult={kind:"matrix",series:[],xDomain:[0,1],yDomain:[0,1],xLabel:"",yLabel:"",summary:"",values:[]};

export function calculateComputation(model:ComputationModel,input:number):CalculationResult {
  const max=model==="sat-certificate"?7:model==="parity-automaton"?6:12;
  if(!Number.isInteger(input)||input<0||input>max) throw new Error(`Invalid ${model} input`);
  if(model==="sat-certificate") {
    const assignments=Array.from({length:8},(_,mask)=>{const a=Boolean(mask&4),b=Boolean(mask&2),c=Boolean(mask&1),clauses=[a||b,!a||c,!b||!c];return {bits:`${+a}${+b}${+c}`,clauses,valid:clauses.every(Boolean)};});
    const current=assignments[input],validCount=assignments.filter(a=>a.valid).length;
    return {...base,controlValue:`${current.bits} · ${current.valid?"valid witness":"not a witness"}`,
      grid:{title:"One certificate versus eight candidates",rows:2,columns:4,
        cells:assignments.map((a,i)=>({row:Math.floor(i/4),column:i%4,label:a.bits,accent:a.valid,selected:i===input})),
        legend:["Bits are (a,b,c): 1=true, 0=false", "Striped: satisfies all three clauses", "Thick coral border: selected certificate"],
        summary:`Selected assignment ${current.bits} gives clause truth values (${current.clauses.map(Number).join(", ")}). ${current.valid?"It certifies that this formula is satisfiable.":"It fails at least one clause; this rejects the certificate, not the formula."} The two satisfying assignments are 010 and 101.`},
      matrices:[{label:"Complete finite check: C₁=(a∨b), C₂=(¬a∨c), C₃=(¬b∨¬c)",rowLabels:assignments.map(a=>a.bits),columnLabels:["C₁","C₂","C₃","all"],entries:assignments.map(a=>[...a.clauses.map(Number),Number(a.valid)])}],
      summary:`The selected certificate has three bits and ${current.clauses.filter(Boolean).length} of three clauses true. A full non-short-circuit check reads six literal occurrences. Exhaustively checking all eight assignments that same way reads 48. This fixed formula is 2-CNF and belongs to a tractable SAT subclass; it illustrates verification, not NP-hardness. General Boolean SAT is NP-complete, and this finite example does not prove any lower bound or settle P versus NP.`,
      values:[value("Certificate bits",3),value("True clauses for selected certificate",current.clauses.filter(Boolean).length),value("Literal reads per complete verification",6),value("All candidate assignments",8),value("Satisfying assignments",validCount),value("Literal reads for exhaustive full checks",48)]};
  }
  if(model==="parity-automaton") {
    const word="101101",prefix=word.slice(0,input),ones=[...prefix].filter(x=>x==="1").length,state=ones%2===0?"E":"O";
    const trace=[0];for(const symbol of word)trace.push(trace[trace.length-1]^Number(symbol));
    return {...base,controlValue:`${input}/6 symbols · state ${state}`,
      automaton:{word,consumed:input,state},
      matrices:[{label:"Prefix trace; state 0=E (even), 1=O (odd). The initial row reads no symbol.",rowLabels:Array.from({length:7},(_,i)=>i===0?"ε":word.slice(0,i)),columnLabels:["length","ones","state","accept"],entries:trace.map((s,i)=>[i,[...word.slice(0,i)].filter(x=>x==="1").length,s,Number(s===0)])}],
      summary:`After ${input} transitions, the consumed prefix is ${prefix||"ε (empty)"}. It contains ${ones} ${ones===1?"one":"ones"}, so the machine is in ${state}, its ${state==="E"?"accepting":"non-accepting"} state. ${input===6?"The entire word has been consumed: 101101 is accepted.":`If input ended here, this prefix would be ${state==="E"?"accepted":"rejected"}; ${6-input} symbols remain in the displayed word.`} Reading 0 preserves parity; reading 1 flips it.`,
      values:[value("Consumed symbols",input),value("Remaining symbols",6-input),value("Ones in prefix",ones),value("State code (E=0, O=1)",ones%2),value("Prefix accepted if ended here",Number(state==="E")),value("Number of machine states",2)]};
  }
  const traces=[{label:"A · countdown from 3",steps:Math.min(input,3),halted:input>=3,status:input>=3?"Halted after transition 3":`Budget exhausted; counter=${3-input}. Eventual halting not yet observed.`},{label:"B · countdown from 9",steps:Math.min(input,9),halted:input>=9,status:input>=9?"Halted after transition 9":`Budget exhausted; counter=${9-input}. Eventual halting not yet observed.`},{label:"C · toggle 0 ↔ 1 forever",steps:input,halted:false,status:`Budget exhausted; state=${input%2}. No halt observed. Its explicit rule separately proves a cycle.`}];
  return {...base,controlValue:`Budget ${input} transitions per program`,execution:{budget:input,maximum:12,traces},
    matrices:[{label:"Bounded observation only: 1=halt observed, 0=no halt observed (not a nontermination verdict)",rowLabels:["A","B","C"],columnLabels:["steps","state","halt seen"],entries:[[Math.min(input,3),Math.max(0,3-input),Number(input>=3)],[Math.min(input,9),Math.max(0,9-input),Number(input>=9)],[input,input%2,0]]}],
    summary:`With a budget of ${input} transitions per program, halting has been observed for ${traces.filter(t=>t.halted).length} of the three programs. An open circle marks a stopped observation, not a proven infinite run. B eventually halts at step 9 even when a smaller budget cannot see that. C's source rule has no halting branch and repeats its entire state after two transitions, so this particular loop can be proved nonterminating separately. No universal halting decision procedure is being simulated.`,
    values:[value("Budget per program",input,"transitions"),value("Observed halts",traces.filter(t=>t.halted).length),value("Unresolved by this bounded observation",traces.filter(t=>!t.halted).length)]};
}
