"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { LabSpec } from "@/lib/content/schema";
import { calculate } from "@/lib/content/calculations";
import { groupedBarBounds } from "@/lib/content/plot-geometry";
import { DependencyDiagram } from "./DependencyDiagram";
import { CountGrid } from "./CountGrid";
import { ParityAutomaton, ExecutionTimeline } from "./ComputationDiagrams";

export function CalculatedLab({ spec }: { spec: Extract<LabSpec, { engine: "calculation" }> }) {
  const id = useId();
  const [input, setInput] = useState(spec.parameter.initial);
  const result = calculate(spec.model, input);
  const plot = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(740);
  useEffect(() => {
    if (!plot.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(1, entry.contentRect.width)));
    observer.observe(plot.current);
    return () => observer.disconnect();
  }, []);
  // Equal coordinate scales preserve angles, circles, and projection geometry.
  const vector = spec.model === "eigen" || result.equalAspect;
  const height = width < 500 ? (vector ? width + 30 : 300) : 400;
  const side = Math.min(width - 80, height - 100);
  const yTickPrecision = Math.max(2, Math.min(6, Math.ceil(-Math.log10((result.yDomain[1] - result.yDomain[0]) / 4)) + 1));
  const yTickLabel = (v: number) => v !== 0 && Math.abs(v) < 0.000001 ? v.toExponential(2) : String(Number(v.toFixed(yTickPrecision)));
  const yTicks = Array.from({ length: 5 }, (_, i) => result.yDomain[0] + i / 4 * (result.yDomain[1] - result.yDomain[0]));
  // Leave room between long density tick labels and the vertical axis title.
  const tickGutter = Math.max(60, Math.max(...yTicks.map(tick => yTickLabel(tick).length)) * 7.5 + 38);
  const xMin = vector ? 55 + (width - 80 - side) / 2 : tickGutter;
  const xMax = vector ? xMin + side : width - 25;
  const yMax = vector ? 35 + side : height - 65;
  const xTickCount = xMax - xMin < 260 ? 3 : 5;
  // Browser and server trig implementations can differ at machine precision.
  const x = (v: number) => Number((xMin + (v - result.xDomain[0]) / (result.xDomain[1] - result.xDomain[0]) * (xMax - xMin)).toFixed(3));
  const y = (v: number) => Number((yMax - (v - result.yDomain[0]) / (result.yDomain[1] - result.yDomain[0]) * (yMax - 35)).toFixed(3));
  const label = (v: number) => Number.isInteger(v) ? String(v) : v.toFixed(2);
  const numericValue = (v: number) => !Number.isFinite(v) ? "∞" : v !== 0 && Math.abs(v) < 0.0001 ? v.toExponential(3) : Number(v.toFixed(6));
  const plotPositions = [...new Set(result.series.flatMap((series) => series.points.map(([px]) => x(px))))].sort((a,b) => a-b);
  const categorySpacing = plotPositions.length > 1 ? Math.min(...plotPositions.slice(1).map((px,i) => px-plotPositions[i])) : xMax-xMin;
  const edgeRoom = plotPositions.length ? 2*Math.min(plotPositions[0]-xMin,xMax-plotPositions[plotPositions.length-1]) : 90;
  const groupWidth = Math.max(0,Math.min(90,categorySpacing*0.72,edgeRoom));
  const matrices = result.matrices && <div className="matrix-gallery">{result.matrices.map((matrix) => <div className={`matrix-card${matrix.rowLabels ? " named-matrix" : ""}`} key={matrix.label}><table>
    <caption>{matrix.label}<span>{matrix.entries.length} rows × {matrix.entries[0].length} columns</span></caption>
    <thead><tr><th scope="col"><span className="sr-only">Row</span></th>{matrix.entries[0].map((_, col) => <th scope="col" key={col}>{matrix.columnLabels?.[col] ?? `c${col}`}</th>)}</tr></thead>
    <tbody>{matrix.entries.map((row, r) => <tr key={r}><th scope="row">{matrix.rowLabels?.[r] ?? `r${r}`}</th>{row.map((value, c) => <td key={c} data-sign={Math.abs(value) < 1e-10 ? "zero" : value < 0 ? "negative" : "positive"}>{Number.isFinite(value) ? Number(value.toFixed(4)) : value < 0 ? "−∞" : "∞"}</td>)}</tr>)}</tbody>
  </table></div>)}</div>;
  const graphControls = (result.graph || result.grid || result.automaton || result.execution) && result.kind === "matrix";
  const controls = <div className="lab-controls"><div className="control-label"><label htmlFor={`${id}-input`}>{spec.parameter.label}</label><output htmlFor={`${id}-input`} data-description={result.controlValue ? "true" : undefined}>{result.controlValue ?? `${Number(input.toFixed(4))}${spec.parameter.unit}`}</output></div><input id={`${id}-input`} type="range" aria-valuetext={result.controlValue} min={spec.parameter.min} max={spec.parameter.max} step={spec.parameter.step} value={input} onChange={(event) => setInput(Number(event.target.value))} /><button type="button" onClick={() => setInput(spec.parameter.initial)}>Reset example</button></div>;
  return <section className="visual-lab calculated-lab" aria-labelledby={`${id}-title`}>
    <div className="lab-header"><div><span className="section-kicker">Calculated example</span><h2 id={`${id}-title`}>{spec.title}</h2><p>{spec.summary}</p></div><code>{spec.equation}</code></div>
    <details className="lab-assumptions model-assumptions"><summary>Model and assumptions</summary><p>{spec.assumptions}</p></details>
    {result.graph && <DependencyDiagram graph={result.graph} id={id} />}
    {result.grid && <CountGrid grid={result.grid} id={id} />}
    {result.automaton && <ParityAutomaton data={result.automaton} id={id} />}
    {result.execution && <ExecutionTimeline data={result.execution} id={id} />}
    {graphControls && <div className="graph-controls">{controls}</div>}
    {result.kind !== "matrix" && <div className="calculated-plot" ref={plot}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-svg-title ${id}-description`}>
        <title id={`${id}-svg-title`}>{spec.title}</title><desc id={`${id}-description`}>{`${result.summary} ${spec.accessibilitySummary}`}</desc>
        {yTicks.map((tick, i) => {
          return <g key={i}><line className="calc-grid" x1={xMin} x2={xMax} y1={y(tick)} y2={y(tick)} /><text x={xMin - 10} y={y(tick) + 4} textAnchor="end">{yTickLabel(tick)}</text></g>;
        })}
        {(result.xTicks ?? (result.kind === "bars" ? result.series[0].points.filter((_, i) => i % Math.ceil(result.series[0].points.length / Math.max(3, Math.floor((xMax - xMin) / 48))) === 0).map(([px]) => px) : Array.from({ length: xTickCount }, (_, i) => result.xDomain[0] + i / (xTickCount - 1) * (result.xDomain[1] - result.xDomain[0])))).map((tick, i) => {
          return <text key={i} x={x(tick)} y={yMax + 25} textAnchor="middle">{result.xTickLabels?.[i] ?? label(tick)}</text>;
        })}
        <text className="calc-axis-label" x={width / 2} y={height - 15} textAnchor="middle">{result.xLabel}</text><text className="calc-axis-label" x="16" y={height / 2} textAnchor="middle" transform={`rotate(-90 16 ${height / 2})`}>{result.yLabel}</text>
        {result.yDomain[0] < 0 && <line className="calc-zero" x1={xMin} x2={xMax} y1={y(0)} y2={y(0)} />}
        {vector && <line className="calc-zero" x1={x(0)} x2={x(0)} y1="35" y2={yMax} />}
        {result.shaded && <polygon fill="var(--cyan-soft)" points={result.shaded.map(([px, py]) => `${x(px)},${y(py)}`).join(" ")} />}
        {result.series.map((series, index) => <g key={series.label} className={`calc-series calc-series-${index}`}>
          {result.kind === "scatter" || series.style === "points" ? series.points.map(([px, py], i) => <circle key={i} cx={x(px)} cy={y(py)} r={series.style === "points" ? 3 : 6} strokeDasharray="none"><title>{`${series.label}: (${label(px)}, ${label(py)})`}</title></circle>) : result.kind === "bars" ? series.points.map(([px, py]) => <rect key={px} {...groupedBarBounds(x(px),groupWidth,index,result.series.length)} y={y(py)} height={y(0) - y(py)}><title>{`${series.label}, ${px}: ${py.toFixed(4)}`}</title></rect>) : <><polyline fill="none" points={series.points.map(([px, py]) => `${x(px)},${y(py)}`).join(" ")} />{vector && series.points.length === 2 && series.points[0].every((v) => v === 0) && <circle cx={x(series.points[1][0])} cy={y(series.points[1][1])} r="5" />}</>}
        </g>)}
        {result.selectedX !== undefined && result.selectedX <= result.xDomain[1] && <line className="calc-marker" x1={x(result.selectedX)} x2={x(result.selectedX)} y1="35" y2={yMax} />}
        {result.markers?.map((marker) => <circle key={marker.label} cx={x(marker.point[0])} cy={y(marker.point[1])} r="6" fill={marker.hollow ? "var(--panel)" : "var(--text)"} stroke={marker.hollow ? "var(--text)" : "var(--panel)"} strokeWidth="2"><title>{`${marker.label}: (${label(marker.point[0])}, ${label(marker.point[1])})`}</title></circle>)}
      </svg>
      <p className="calc-mobile-axes">Horizontal: {result.xLabel}<br />Vertical: {result.yLabel}</p>
      <ul className="calc-legend">{result.series.map((s, i) => <li key={s.label} className={`legend-${i}`}>{s.label}</li>)}</ul>
    </div>}
    {result.kind === "matrix" && matrices}
    <div className={`lab-console${graphControls ? " graph-readout" : ""}`}><div className="insight-readout"><span>Calculated result</span><p aria-live="polite" aria-atomic="true">{result.summary}</p></div>{!graphControls && controls}</div>
    {result.kind !== "matrix" && matrices && <details className="matrix-details"><summary>Inspect the matrices</summary>{matrices}</details>}
    <details className="calc-data"><summary>Show numeric values</summary><table><caption>Values at the selected control setting</caption><thead><tr><th scope="col">Quantity</th><th scope="col">Value</th></tr></thead><tbody>{result.values.map((item) => <tr key={item.label}><th scope="row">{item.label}</th><td>{numericValue(item.value)} {item.unit}</td></tr>)}</tbody></table></details>
    <p className="lab-assumptions">{spec.takeaway}</p>
  </section>;
}
