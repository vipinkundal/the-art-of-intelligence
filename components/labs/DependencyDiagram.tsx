import type { CalculationResult } from "@/lib/content/calculations";

export function DependencyDiagram({ graph, id }: { graph: NonNullable<CalculationResult["graph"]>; id: string }) {
  return <figure className="dependency-diagram">
    <figcaption>{graph.title}</figcaption>
    <svg viewBox={`0 0 320 ${graph.height ?? 125}`} style={graph.maxWidth ? { maxWidth: graph.maxWidth } : undefined} role="img" aria-labelledby={`${id}-graph-title ${id}-graph-description`}>
      <title id={`${id}-graph-title`}>{graph.title}</title><desc id={`${id}-graph-description`}>{`${graph.summary} ${graph.edges.map(edge => `${graph.nodes.find(n=>n.id===edge.from)?.label} ${edge.directed===false?"connects to":"points to"} ${graph.nodes.find(n=>n.id===edge.to)?.label}${edge.label?`, edge label ${edge.label}`:""}.`).join(" ")}`}</desc>
      <defs><marker id={`${id}-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--cyan)" /></marker></defs>
      {graph.edges.map((edge,i)=>{
        const from=graph.nodes.find(n=>n.id===edge.from)!,to=graph.nodes.find(n=>n.id===edge.to)!;
        const distance=Math.hypot(to.x-from.x,to.y-from.y),dx=(to.x-from.x)/distance,dy=(to.y-from.y)/distance;
        const start=from.kind==="factor"?18/Math.max(Math.abs(dx),Math.abs(dy))+2:28;
        const end=to.kind==="factor"?18/Math.max(Math.abs(dx),Math.abs(dy))+2:edge.directed===false?28:30;
        const mx=(from.x+to.x)/2,my=(from.y+to.y)/2,labelWidth=Math.max(26,(edge.label?.length??0)*11+8);
        return <g key={i}><line x1={from.x+start*dx} y1={from.y+start*dy} x2={to.x-end*dx} y2={to.y-end*dy} stroke={edge.accent?"var(--coral)":"var(--cyan)"} strokeDasharray={edge.accent?"6 4":undefined} strokeWidth="2" markerEnd={edge.directed===false?undefined:`url(#${id}-arrow)`} />{edge.label&&<g><rect x={mx-labelWidth/2} y={my-12} width={labelWidth} height="24" rx="4" fill="var(--panel)"/><text x={mx} y={my+5} textAnchor="middle" className="dependency-node-label">{edge.label}</text></g>}</g>;
      })}
      {graph.nodes.map(node=><g key={node.id}>{node.kind==="factor"?<rect x={node.x-18} y={node.y-18} width="36" height="36" fill="var(--cyan-soft)" stroke="var(--cyan)" strokeWidth="1.5" />:<circle cx={node.x} cy={node.y} r="25" fill={node.observed?"var(--cyan-soft)":"var(--panel)"} stroke={node.observed?"var(--cyan)":"var(--muted-strong)"} strokeWidth={node.observed?3:1.5} />}{node.observed&&<circle cx={node.x} cy={node.y} r="21" fill="none" stroke="var(--cyan)" />}<text x={node.x} y={node.y+5} textAnchor="middle" className="dependency-node-label">{node.label}</text>{node.state!==""&&<text x={node.x} y={node.y+(node.stateAbove?-40:49)} textAnchor="middle" className="dependency-node-state">{node.state??(node.observed?"conditioned":"unobserved")}</text>}</g>)}
    </svg>
    <p>{graph.summary}</p>
  </figure>;
}
