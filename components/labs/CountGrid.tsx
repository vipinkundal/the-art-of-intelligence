import type { CalculationResult } from "@/lib/content/calculations";

export function CountGrid({grid,id}:{grid:NonNullable<CalculationResult["grid"]>;id:string}) {
  const size=280/Math.max(grid.columns,grid.rows),left=(320-size*grid.columns)/2,top=grid.columnLabels?36:20,height=top+size*grid.rows+20;
  return <figure className="count-grid">
    <figcaption>{grid.title}</figcaption>
    <svg viewBox={`0 0 320 ${height}`} role="img" aria-labelledby={`${id}-count-title ${id}-count-description`}>
      <title id={`${id}-count-title`}>{grid.title}</title><desc id={`${id}-count-description`}>{grid.summary} {grid.legend.join(". ")}</desc>
      <defs><pattern id={`${id}-count-stripes`} width="7" height="7" patternUnits="userSpaceOnUse"><path d="M-1,1 L1,-1 M0,7 L7,0 M6,8 L8,6" stroke="var(--cyan)" strokeWidth="1" opacity="0.45" /></pattern></defs>
      {grid.columnLabels?.map((label,i)=><text key={label} x={left+(i+.5)*size} y="21" textAnchor="middle" className="count-column-label">{label}</text>)}
      {Array.from({length:grid.rows*grid.columns},(_,i)=>{const row=Math.floor(i/grid.columns),column=i%grid.columns,cell=grid.cells.find(c=>c.row===row&&c.column===column),x=left+column*size+2,y=top+row*size+2;
        return <g key={i}><rect x={x} y={y} width={size-4} height={size-4} fill={cell?"var(--cyan-soft)":"none"} stroke={cell?.selected?"var(--coral)":cell?"var(--cyan)":"var(--line-strong)"} strokeWidth={cell?.selected?4:cell?.accent?2:1} />{cell?.accent&&<rect x={x} y={y} width={size-4} height={size-4} fill={`url(#${id}-count-stripes)`} />}{cell?.label&&<text x={x+(size-4)/2} y={y+(size-4)/2+5} textAnchor="middle" className="count-item-label">{cell.label}</text>}</g>;
      })}
    </svg>
    <ul className="count-key">{grid.legend.map(label=><li key={label}>{label}</li>)}</ul>
    <p>{grid.summary}</p>
  </figure>;
}
