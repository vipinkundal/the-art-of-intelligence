import type { CalculationResult } from "@/lib/content/calculations";

export function ParityAutomaton({data,id}:{data:NonNullable<CalculationResult["automaton"]>;id:string}) {
  return <figure className="computation-diagram automaton-diagram">
    <figcaption>Two states remember one bit of history</figcaption>
    <svg viewBox="0 0 320 240" role="img" aria-labelledby={`${id}-automaton-title ${id}-automaton-desc`}>
      <title id={`${id}-automaton-title`}>Even-parity deterministic finite automaton</title>
      <desc id={`${id}-automaton-desc`}>{`Start in E. E is accepting, O is non-accepting. From either state, 0 stays in place and 1 moves to the other state. Current state: ${data.state}. ${data.consumed} of ${data.word.length} symbols have been read.`}</desc>
      <defs><marker id={`${id}-dfa-arrow`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--cyan)" /></marker></defs>
      <g fill="none" stroke="var(--cyan)" strokeWidth="1.7" markerEnd={`url(#${id}-dfa-arrow)`}>
        <path d="M12,125 L55,125" />
        <path d="M113,103 Q160,50 207,103" />
        <path d="M207,147 Q160,202 113,147" />
        <path d="M70,96 C22,20 158,20 105,96" />
        <path d="M215,96 C162,20 298,20 250,96" />
      </g>
      <g className="machine-label"><text x="22" y="112">start</text><text x="160" y="75" textAnchor="middle">1</text><text x="160" y="190" textAnchor="middle">1</text><text x="87" y="35" textAnchor="middle">0</text><text x="233" y="35" textAnchor="middle">0</text></g>
      {(["E","O"] as const).map((state,i)=><g key={state}>
        <circle cx={i===0?87:233} cy="125" r="32" fill={data.state===state?"var(--cyan-soft)":"var(--panel)"} stroke={data.state===state?"var(--cyan)":"var(--muted-strong)"} strokeWidth={data.state===state?4:1.5} />
        {state==="E"&&<circle cx="87" cy="125" r="26" fill="none" stroke="var(--muted-strong)" />}
        <text x={i===0?87:233} y="131" textAnchor="middle" className="machine-state">{state}</text>
        <text x={i===0?87:233} y="224" textAnchor="middle" className="machine-label">{state==="E"?"even · accepts":"odd · rejects"}</text>
      </g>)}
    </svg>
    <ol className="machine-tape" aria-label="Input tape; check marks indicate consumed symbols">{[...data.word].map((symbol,i)=><li key={i} data-read={i<data.consumed}><span>{symbol}</span><small>{i<data.consumed?"✓ read":"unread"}</small></li>)}</ol>
    <p>Current state: <strong>{data.state}</strong>. The double circle marks an accepting state, not an instruction to stop early. Acceptance is decided when the chosen input ends.</p>
  </figure>;
}

export function ExecutionTimeline({data,id}:{data:NonNullable<CalculationResult["execution"]>;id:string}) {
  return <figure className="computation-diagram execution-diagram">
    <figcaption>A timeout is an observation boundary</figcaption>
    <p>Shared budget: {data.budget} transitions. A square marks a witnessed halt; an open circle marks a run whose observation stopped at the budget.</p>
    {data.traces.map((trace,i)=><div className="execution-row" key={trace.label}>
      <h3>{trace.label}</h3>
      <svg viewBox="0 0 320 58" role="img" aria-labelledby={`${id}-run-${i}`}>
        <title id={`${id}-run-${i}`}>{`${trace.label}: ${trace.steps} transitions observed. ${trace.status}`}</title>
        <line x1="12" x2="308" y1="20" y2="20" stroke="var(--line-strong)" strokeDasharray="4 4" />
        <line x1="12" x2={12+296*trace.steps/data.maximum} y1="20" y2="20" stroke="var(--cyan)" strokeWidth="3" />
        <line x1={12+296*data.budget/data.maximum} x2={12+296*data.budget/data.maximum} y1="4" y2="33" stroke="var(--coral)" strokeDasharray="3 3" />
        {trace.halted?<rect x={7+296*trace.steps/data.maximum} y="15" width="10" height="10" fill="var(--cyan)" />:<circle cx={12+296*trace.steps/data.maximum} cy="20" r="5" fill="var(--panel)" stroke="var(--cyan)" strokeWidth="2" />}
        {[0,3,6,9,12].map(t=><text key={t} x={12+296*t/data.maximum} y="50" textAnchor="middle" className="machine-label">{t}</text>)}
      </svg>
      <p>{trace.status}</p>
    </div>)}
  </figure>;
}
