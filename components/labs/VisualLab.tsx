"use client";

import { ArrowCounterClockwise, Pause, Play } from "@phosphor-icons/react";
import { curveMonotoneX, line as d3Line, scaleLinear } from "d3";
import { useEffect, useId, useMemo, useState } from "react";
import type { LabSpec } from "@/lib/content/schema";
import { CalculatedLab } from "./CalculatedLab";

const width = 980;
const height = 500;

function pathFor(points: Array<[number, number]>) {
  return d3Line<[number, number]>().x((point) => point[0]).y((point) => point[1]).curve(curveMonotoneX)(points) || "";
}

function seeded(seed: number, index: number) {
  const value = Math.sin(seed * 0.0001 + index * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function Plot({ spec, value, markerId }: { spec: Exclude<LabSpec, { engine: "calculation" }>; value: number; markerId: string }) {
  const t = (value - spec.parameter.min) / (spec.parameter.max - spec.parameter.min);
  const arrow = `url(#${markerId})`;

  if (spec.engine === "geometry") {
    const angle = t * Math.PI * 0.42;
    const points = Array.from({ length: 24 }, (_, index) => {
      const a = (index / 24) * Math.PI * 2;
      const radius = 80 + seeded(spec.seed, index) * 86;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      return [Number((490 + x * (1 + t * 0.65) + y * t * 0.22).toFixed(4)), Number((250 + y * (1 - t * 0.32)).toFixed(4))] as const;
    });
    return <>
      <g className="lab-grid">{Array.from({ length: 19 }, (_, index) => <line key={`v${index}`} x1={40 + index * 50} x2={40 + index * 50} y1="28" y2="472" />)}{Array.from({ length: 9 }, (_, index) => <line key={`h${index}`} x1="40" x2="940" y1={50 + index * 50} y2={50 + index * 50} />)}</g>
      <circle className="orbit orbit-a" cx="490" cy="250" r={125 + t * 48} transform={`rotate(${angle * 30} 490 250)`} />
      <circle className="orbit orbit-b" cx="490" cy="250" r={84 + t * 30} />
      {points.map((point, index) => <circle className={index === Math.floor(t * 23) ? "data-point selected" : "data-point"} key={index} cx={point[0]} cy={point[1]} r={index === Math.floor(t * 23) ? 7 : 3.5} />)}
      <line className="eigen-line cyan" x1="490" y1="250" x2={490 + Math.cos(angle) * 300} y2={250 - Math.sin(angle) * 190} markerEnd={arrow} />
      <line className="eigen-line violet" x1="490" y1="250" x2={490 - Math.sin(angle) * 190} y2={250 - Math.cos(angle) * 250} markerEnd={arrow} />
      <text x="786" y="158">v₁ · stable axis</text><text x="258" y="82">v₂ · compressed axis</text>
      <circle className="origin" cx="490" cy="250" r="5" />
    </>;
  }

  if (spec.engine === "probability") {
    const x = scaleLinear().domain([0, 1]).range([80, 900]);
    const y = scaleLinear().domain([0, 4]).range([420, 75]);
    const points = Array.from({ length: 101 }, (_, index) => {
      const p = index / 100;
      const density = spec.modes.reduce((sum, mode, modeIndex) => sum + Math.exp(-((p - mode - (modeIndex ? -t * 0.05 : t * 0.05)) ** 2) / (2 * spec.spread ** 2)) * (modeIndex ? 1.25 - t * 0.5 : 0.75 + t * 0.5), 0);
      return [x(p), y(density)] as [number, number];
    });
    return <><g className="lab-grid">{Array.from({ length: 9 }, (_, index) => <line key={index} x1="80" x2="900" y1={100 + index * 40} y2={100 + index * 40} />)}</g><path className="area-line cyan" d={pathFor(points)} /><path className="area-fill" d={`${pathFor(points)} L 900 420 L 80 420 Z`} /><line className="threshold-line" x1={x(t)} x2={x(t)} y1="70" y2="420"/><text x={Math.min(820, x(t)+10)} y="92">decision threshold</text><text x="82" y="454">low belief</text><text x="814" y="454">high belief</text></>;
  }

  if (spec.engine === "optimization") {
    const x = scaleLinear().domain([0, 1]).range([80, 900]);
    const y = scaleLinear().domain([0, 1.4]).range([420, 72]);
    const loss = (p: number) => 0.18 + Math.min((p - spec.minima[0]) ** 2 * 4.8, (p - spec.minima[1]) ** 2 * 3.6 + 0.08) + Math.sin(p * 18) * 0.035;
    const points = Array.from({ length: 101 }, (_, index) => [x(index / 100), y(loss(index / 100))] as [number, number]);
    return <><g className="lab-grid">{Array.from({ length: 9 }, (_, index) => <line key={index} x1="80" x2="900" y1={100 + index * 40} y2={100 + index * 40} />)}</g><path className="area-line violet" d={pathFor(points)} />{Array.from({ length: 7 }, (_, index) => { const p = Math.max(0, Math.min(1, t + (index - 3) * 0.045)); return <circle key={index} className={index === 3 ? "optimizer-point selected" : "optimizer-point"} cx={x(p)} cy={y(loss(p))} r={index === 3 ? 8 : 3} />; })}<line className="gradient-arrow" x1={x(t)} y1={y(loss(t))-14} x2={x(Math.max(0,t-0.09))} y2={y(loss(Math.max(0,t-0.09)))-14} markerEnd={arrow}/><text x="82" y="454">parameter space θ</text><text x="82" y="92">loss L(θ)</text></>;
  }

  if (spec.engine === "sequence") {
    const gap = 780 / Math.max(1, spec.tokens.length - 1);
    return <>{spec.tokens.map((token, index) => { const x = 100 + index * gap; const strength = Math.max(0.08, 1 - Math.abs(index / (spec.tokens.length - 1) - t)); return <g key={token + index}><rect className={strength > .74 ? "token active" : "token"} x={x-46} y="330" width="92" height="52" rx="8"/><text className="token-label" textAnchor="middle" x={x} y="361">{token.slice(0, 11)}</text>{index < spec.tokens.length - 1 && <path className="attention-arc" style={{opacity:strength}} d={`M ${x} 328 Q ${x + gap/2} ${100 + index%2*55} ${x+gap} 328`} />}</g>;})}<line className="sequence-axis" x1="80" x2="900" y1="410" y2="410" markerEnd={arrow}/><text x="82" y="450">causal position</text></>;
  }

  if (spec.engine === "retrieval") {
    const qx = 180 + t * 320, qy = 250 - t * 90;
    const docs = [[720,110],[790,225],[690,350],[850,405]];
    return <><g className="lab-grid">{Array.from({length:12},(_,i)=><line key={i} x1={70+i*75} x2={70+i*75} y1="55" y2="445" />)}</g><circle className="query-ring" cx={qx} cy={qy} r={50+40*t}/><circle className="query-node" cx={qx} cy={qy} r="10"/><text x={qx-44} y={qy-68}>query vector</text>{docs.map((doc,index)=><g key={index}><line className={index===Math.floor(t*3.99)?"retrieval-link active":"retrieval-link"} x1={qx} y1={qy} x2={doc[0]} y2={doc[1]}/><circle className={index===Math.floor(t*3.99)?"doc-node selected":"doc-node"} cx={doc[0]} cy={doc[1]} r={index===Math.floor(t*3.99)?12:7}/><text x={doc[0]+18} y={doc[1]+5}>{spec.documents[index]}</text></g>)}</>;
  }

  if (spec.engine === "transport") {
    return <>{Array.from({length:spec.particles},(_,index)=>{const sx=90+seeded(spec.seed,index)*310, sy=70+seeded(spec.seed+7,index)*360; const a=(index/spec.particles)*Math.PI*2; const tx=730+Math.cos(a)*(90+25*Math.sin(a*3+spec.targetShape)), ty=250+Math.sin(a)*(125+18*Math.cos(a*2)); return <circle className={index%7===0?"particle highlight":"particle"} key={index} cx={sx+(tx-sx)*t} cy={sy+(ty-sy)*t} r={index%7===0?5:3}/>;})}<path className="flow-arrow" d="M 420 250 C 490 160, 555 340, 625 250" markerEnd={arrow}/><text x="104" y="458">base density</text><text x="762" y="458">learned density</text></>;
  }

  if (spec.engine === "signal") {
    const points = Array.from({length:121},(_,index)=>{const p=index/120; const mixed=Math.sin(p*Math.PI*2*spec.frequency)*(1-t)+Math.sin(p*Math.PI*2*Math.max(1,spec.frequency-2))*t*.9; return [70+p*840,245-mixed*105] as [number,number];});
    return <><g className="lab-grid">{Array.from({length:9},(_,i)=><line key={i} x1="70" x2="910" y1={90+i*40} y2={90+i*40}/>)}</g><path className="area-line cyan" d={pathFor(points)}/>{spec.kernel.map((weight,index)=><rect key={index} className="kernel-bar" x={370+index*50} y={450-weight*100} width="30" height={weight*100}/>) }<text x="70" y="65">signal response</text><text x="380" y="477">filter kernel</text></>;
  }

  if (spec.engine === "reinforcement") {
    const gap=740/(spec.states-1); const active=Math.round(t*(spec.states-1)); return <>{Array.from({length:spec.states},(_,index)=>{const x=120+index*gap;return <g key={index}>{index<spec.states-1&&<line className="state-link" x1={x+24} y1="250" x2={x+gap-24} y2="250" markerEnd={arrow}/>}<circle className={index===active?"state-node selected":index===spec.rewardAt?"state-node reward":"state-node"} cx={x} cy="250" r="24"/><text className="state-label" x={x} y="256" textAnchor="middle">s{index}</text>{index===spec.rewardAt&&<text x={x-22} y="205">+1 reward</text>}</g>})}<path className="policy-line" d={`M 120 350 C 330 ${390-t*80}, 650 ${310+t*70}, 860 350`}/><text x="120" y="400">policy probability across the state chain</text></>;
  }

  if (spec.engine === "systems") {
    const gap=155; return <>{spec.stages.map((stage,index)=>{const load=Math.max(.2, seeded(spec.seed,index)*(1-t)+t*(index===spec.bottleneck?1:.35));return <g key={stage}><rect className={index===spec.bottleneck?"system-stage bottleneck":"system-stage"} x={82+index*gap} y={205-load*90} width="112" height={92+load*90} rx="10"/><text className="stage-label" x={138+index*gap} y="258" textAnchor="middle">{stage}</text><text x={115+index*gap} y={330-load*90}>{Math.round(load*100)}%</text>{index<spec.stages.length-1&&<line className="system-link" x1={194+index*gap} y1="250" x2={222+index*gap} y2="250" markerEnd={arrow}/>}</g>})}<line className="throughput-line" x1="80" x2="900" y1={420-t*110} y2={420-t*110}/><text x="82" y={405-t*110}>throughput envelope</text></>;
  }

  if (spec.engine === "evaluation") {
    const threshold=100+t*760; return <><rect className="evaluation-zone safe" x="80" y="70" width={threshold-80} height="350"/><rect className="evaluation-zone risk" x={threshold} y="70" width={900-threshold} height="350"/>{Array.from({length:44},(_,index)=>{const x=100+seeded(spec.seed,index)*780,y=90+seeded(spec.seed+8,index)*310;const positive=seeded(spec.seed+3,index)>spec.baseRate;return <circle className={positive?"eval-point positive":"eval-point"} key={index} cx={x} cy={y} r="4"/>})}<line className="threshold-line" x1={threshold} x2={threshold} y1="55" y2="435"/><text x={Math.min(threshold+10,820)} y="92">operating threshold</text><text x="82" y="460">accept</text><text x="842" y="460">escalate</text></>;
  }

  if (spec.engine === "timeline") {
    const min=Math.min(...spec.events),max=Math.max(...spec.events);const sx=scaleLinear().domain([min,max]).range([110,870]);return <><line className="timeline-axis" x1="100" x2="890" y1="250" y2="250" markerEnd={arrow}/>{spec.events.map((event,index)=><g key={event}><circle className={index/spec.events.length<=t?"timeline-node active":"timeline-node"} cx={sx(event)} cy="250" r={index/spec.events.length<=t?11:6}/><line className="timeline-tick" x1={sx(event)} x2={sx(event)} y1="210" y2="290"/><text x={sx(event)} y={index%2?"330":"188"} textAnchor="middle">{event}</text></g>)}</>;
  }

  const center=[490,250]; const nodes=Array.from({length:spec.nodeCount},(_,index)=>{const a=(index/spec.nodeCount)*Math.PI*2+t*.8; const r=130+(index%3)*42;return [center[0]+Math.cos(a)*r,center[1]+Math.sin(a)*r] as [number,number];});
  return <>{nodes.flatMap((node,index)=>nodes.slice(index+1).map((target,targetIndex)=>seeded(spec.seed,index*20+targetIndex)<spec.density?<line className="graph-edge" key={`${index}-${targetIndex}`} x1={node[0]} y1={node[1]} x2={target[0]} y2={target[1]}/>:null))}{nodes.map((node,index)=><g key={index}><circle className={index===Math.floor(t*(nodes.length-1))?"graph-node selected":"graph-node"} cx={node[0]} cy={node[1]} r={index===Math.floor(t*(nodes.length-1))?14:8}/><text x={node[0]+16} y={node[1]+4}>n{index+1}</text></g>)}<circle className="graph-halo" cx={center[0]} cy={center[1]} r={70+t*60}/></>;
}

export function VisualLab({ spec }: { spec: LabSpec }) {
  if (spec.engine === "calculation") return <CalculatedLab key={`${spec.model}:${spec.title}`} spec={spec} />;
  return <IllustrativeLab spec={spec} />;
}

function IllustrativeLab({ spec }: { spec: Exclude<LabSpec, { engine: "calculation" }> }) {
  const [value, setValue] = useState(spec.parameter.initial);
  const [playing, setPlaying] = useState(false);
  const id = useId().replaceAll(":", "");
  const formatted = useMemo(() => `${value.toFixed(2)}${spec.parameter.unit}`, [spec.parameter.unit, value]);

  useEffect(() => {
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setValue((current) => current >= spec.parameter.max ? spec.parameter.min : Math.min(spec.parameter.max, current + spec.parameter.step * 4)), 80);
    return () => window.clearInterval(timer);
  }, [playing, spec.parameter.max, spec.parameter.min, spec.parameter.step]);

  return (
    <section className="visual-lab" aria-labelledby={`${id}-title`}>
      <div className="lab-header">
        <div><span className="section-kicker">Illustrative diagram · {spec.engine}</span><h2 id={`${id}-title`}>{spec.title}</h2><p>{spec.summary}</p></div>
        {spec.equation && <code>{spec.equation}</code>}
      </div>
      <div className="lab-stage">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-svg-title ${id}-svg-desc`}>
          <title id={`${id}-svg-title`}>{spec.title}</title><desc id={`${id}-svg-desc`}>{spec.accessibilitySummary}</desc>
          <defs><marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" className="arrow-head" /></marker></defs>
          <Plot spec={spec} value={value} markerId={`${id}-arrow`} />
        </svg>
        <div className="lab-corner-label">schematic · {spec.engine}</div>
      </div>
      <div className="lab-console">
        <div className="insight-readout"><span>Selected insight</span><strong>{spec.takeaway}</strong></div>
        <div className="lab-controls">
          <div className="control-label"><label htmlFor={`${id}-range`}>{spec.parameter.label}</label><output htmlFor={`${id}-range`}>{formatted}</output></div>
          <input id={`${id}-range`} type="range" min={spec.parameter.min} max={spec.parameter.max} step={spec.parameter.step} value={value} onChange={(event) => setValue(Number(event.target.value))} />
          <div className="control-actions">
            <button type="button" onClick={() => setPlaying((current) => !current)} aria-pressed={playing}>{playing ? <Pause size={14} /> : <Play size={14} />} {playing ? "Pause" : "Inspect"}</button>
            <button type="button" onClick={() => setValue(spec.parameter.initial)}><ArrowCounterClockwise size={14} /> Reset</button>
          </div>
        </div>
      </div>
    </section>
  );
}
