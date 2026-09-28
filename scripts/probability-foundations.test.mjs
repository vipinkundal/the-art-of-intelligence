import assert from "node:assert/strict";
import test from "node:test";
import { calculateProbability as calculate, probabilityModels, standardNormalCDF, standardizedBinomial } from "../lib/content/probability-foundations.ts";
import { probabilityFoundationLessons } from "../content/editorial/probability-foundations.mjs";

const near = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual-expected)<tolerance, `${actual} != ${expected}`);
const get = (model,input,label) => calculate(model,input).values.find(v=>v.label===label).value;
const mean = xs => xs.reduce((s,x)=>s+x,0)/xs.length;
const variance = xs => { const m=mean(xs); return mean(xs.map(x=>(x-m)**2)); };
const covariance = (xs,ys) => { const mx=mean(xs),my=mean(ys);return mean(xs.map((x,i)=>(x-mx)*(ys[i]-my))); };

test("each probability-foundation topic owns a distinct model with valid control bounds",()=>{
  const labs=Object.values(probabilityFoundationLessons).map(l=>l.labs[0]);
  for(const model of probabilityModels){
    assert.equal(labs.filter(l=>l.model===model).length,1);
    const p=labs.find(l=>l.model===model).parameter;
    for(const x of [NaN,Infinity,p.min-1,p.max+1])assert.throws(()=>calculate(model,x));
  }
  assert.throws(()=>calculate("prob-clt",1.5));
});

test("event union and intersection agree with enumerated outcomes",()=>{
  for(let n=1;n<=6;n++){
    const faces=[1,2,3,4,5,6];
    near(get("prob-events",n,"P(A∩B)"),faces.filter(x=>x%2===0&&x<=n).length/6);
    near(get("prob-events",n,"P(A∪B)"),faces.filter(x=>x%2===0||x<=n).length/6);
    near(calculate("prob-events",n).series[0].points.reduce((s,[,p])=>s+p,0),n/6);
  }
});

test("random-variable pushforward adds the two one-head outcomes",()=>{
  for(const p of [0,0.3,0.5,1]){
    const r=calculate("prob-variable",p),rows=r.matrices[0].entries;
    for(const [k,mass]of r.series[0].points)near(rows.filter(row=>row[0]===k).reduce((s,row)=>s+row[1],0),mass);
    near(rows.reduce((s,row)=>s+row[1],0),1);
  }
  near(get("prob-variable",0.3,"P(X=1)"),0.42);
});

test("joint table preserves marginals throughout feasible dependence range",()=>{
  for(let i=0;i<=20;i++){
    const q=i/50,r=calculate("prob-joint",q),j=r.matrices[0].entries;
    assert.ok(j.flat().every(p=>p>=-1e-12));
    near(j[0][0]+j[0][1],0.6); near(j[1][0]+j[1][1],0.4);
    near(j[0][0]+j[1][0],0.5); near(j[0][1]+j[1][1],0.5);
    near(r.series[0].points[1][1],j[1][1]/0.5);
  }
  near(get("prob-joint",0.3,"P(X=1|Y=1)"),0.6);
});

test("marginal dependence of conditional-independent mixtures matches full joint enumeration",()=>{
  for(const w of [0,0.25,0.5,1]){
    const table=calculate("prob-independence",w).matrices[0].entries;
    const px=table[1][0]+table[1][1],py=table[0][1]+table[1][1];
    near(table.flat().reduce((s,p)=>s+p,0),1);
    near(table[1][1]-px*py,get("prob-independence",w,"Marginal covariance"));
  }
  near(get("prob-independence",0.5,"P(X=1,Y=1)"),0.34);
  near(get("prob-independence",0.5,"Marginal covariance"),0.09);
});

test("total probability uses weighted branches and handles absent groups",()=>{
  near(get("prob-total",0.25,"P(E)"),0.25);
  near(get("prob-total",0,"P(E)"),0.1);
  near(get("prob-total",1,"P(E)"),0.7);
  for(const w of [0,0.25,0.5,1])near(calculate("prob-total",w).series[0].points.reduce((s,[,p])=>s+p,0),get("prob-total",w,"P(E)"));
});

test("expectation and second moment agree with independent weighted sums",()=>{
  for(const p of [0,1/6,0.2,1]){
    const points=calculate("prob-expectation",p).series[0].points;
    near(points.reduce((s,[x,p])=>s+x*p,0),get("prob-expectation",p,"E[X]"));
    near(points.reduce((s,[x,p])=>s+x*x*p,0),get("prob-expectation",p,"E[X²]"));
  }
  near(get("prob-expectation",1/6,"E[X]"),3.5);
  near(get("prob-expectation",1/6,"E[X²]"),91/6);
});

test("scatter support realizes the declared covariance and variance of sums",()=>{
  for(const a of [-2,-1,0,1,2]){
    const r=calculate("prob-covariance",a),xs=r.series[0].points.map(p=>p[0]),ys=r.series[0].points.map(p=>p[1]);
    assert.equal(r.kind,"scatter");
    near(variance(xs),get("prob-covariance",a,"Var(X)"));
    near(variance(ys),get("prob-covariance",a,"Var(Y)"));
    near(covariance(xs,ys),get("prob-covariance",a,"Cov(X,Y)"));
    near(variance(xs.map((x,i)=>x+ys[i])),get("prob-covariance",a,"Var(X+Y)"));
  }
});

test("correlation is zero for the nonlinear dependent example and matches centered products",()=>{
  for(const a of [-2,-1,0,1,2]){
    const points=calculate("prob-correlation",a).series[0].points,xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
    near(covariance(xs,ys)/Math.sqrt(variance(xs)*variance(ys)),get("prob-correlation",a,"Pearson correlation"));
  }
  near(get("prob-correlation",0,"Pearson correlation"),0);
  assert.deepEqual(calculate("prob-correlation",0).series[0].points,[[-2,4],[-1,1],[0,0],[1,1],[2,4]]);
});

test("LLN exact mean distributions have correct mass and moments and respect Chebyshev",()=>{
  for(let n=1;n<=100;n++){
    const r=calculate("prob-lln",n),points=r.series[0].points;
    near(points.reduce((s,[,p])=>s+p,0),1);
    near(points.reduce((s,[x,p])=>s+x*p,0),0.3);
    near(points.reduce((s,[x,p])=>s+(x-0.3)**2*p,0),0.21/n);
    assert.ok(get("prob-lln",n,"Exact deviation probability")<=get("prob-lln",n,"Chebyshev upper bound")+1e-10);
  }
  near(get("prob-lln",100,"Chebyshev upper bound"),0.0525);
});

test("normal CDF approximation matches reference quantiles and symmetry",()=>{
  for(const [z,cdf]of [[0,0.5],[1,0.841344746068543],[1.96,0.97500210485178],[3,0.99865010196837],[-4,0.000031671241833]])near(standardNormalCDF(z),cdf,7.5e-8);
  for(const z of [0.1,1,2,4])near(standardNormalCDF(z)+standardNormalCDF(-z),1);
});

test("CLT staircases are monotone and preserve both sides of every in-window jump",()=>{
  for(let n=1;n<=100;n++){
    const {points,jumps}=standardizedBinomial(n);
    for(let i=1;i<points.length;i++){
      assert.ok(points[i][0]>=points[i-1][0]); assert.ok(points[i][1]>=points[i-1][1]-1e-12);
      // Every segment is horizontal or vertical; never interpolate across a jump.
      assert.ok(Math.abs(points[i][0]-points[i-1][0])<1e-12 || Math.abs(points[i][1]-points[i-1][1])<1e-12);
    }
    near(jumps.reduce((s,j)=>s+j.mass*j.z,0),0);
    near(jumps.reduce((s,j)=>s+j.mass*j.z*j.z,0),1);
  }
  assert.ok(standardizedBinomial(100).distance<standardizedBinomial(1).distance);
});

test("change of variables conserves the selected interval probability",()=>{
  for(const t of [0,0.25,0.5,1]){
    const r=calculate("prob-transform",t),p=r.shaded;
    const triangleArea=Math.abs(p[1][0]*p[2][1]-p[2][0]*p[1][1])/2;
    near(triangleArea,t*t); near(get("prob-transform",t,"P(Y≤y)"),t*t);
  }
});

test("tower expectation and total variance match full enumerated populations",()=>{
  for(const w of [0.1,0.25,0.5,0.9]){
    const points=calculate("prob-conditional-mean",w).series[0].points;
    near(points.reduce((s,[y,p])=>s+y*p,0),get("prob-conditional-mean",w,"E[E[Y|Z]]"));
  }
  for(const delta of [0,1,2,4,6]){
    const ys=[-1,1,delta-1,delta+1];
    near(variance(ys),get("prob-total-variance",delta,"Var(Y)"));
    near(get("prob-total-variance",delta,"E[Var(Y|Z)]")+get("prob-total-variance",delta,"Var(E[Y|Z])"),variance(ys));
  }
});
