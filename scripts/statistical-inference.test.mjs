import assert from "node:assert/strict";
import test from "node:test";
import {calculateInference as calculate,inferenceModels,relativeBernoulliLikelihood,betaBinomialMass,binomialUpperTail} from "../lib/content/statistical-inference.ts";
import {groupedBarBounds} from "../lib/content/plot-geometry.ts";
import {inferenceLessons} from "../content/editorial/statistical-inference.mjs";
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const value=(model,input,label)=>calculate(model,input).values.find(v=>v.label===label).value;
const total=points=>points.reduce((s,[,p])=>s+p,0);
const expectation=points=>points.reduce((s,[x,p])=>s+x*p,0);
const variance=points=>{const m=expectation(points);return points.reduce((s,[x,p])=>s+(x-m)**2*p,0);};
const factorial=n=>{let f=1;for(let k=2;k<=n;k++)f*=k;return f;};
// Independently enumerate binary sequences; do not use the production mass helper.
const sequences=(n,p)=>Array.from({length:2**n},(_,bits)=>{let k=0;for(let j=0;j<n;j++)k+=(bits>>j)&1;return[k,p**k*(1-p)**(n-k)];});

test("all inference topics own distinct models and reject out-of-range inputs",()=>{
  const labs=Object.values(inferenceLessons).map(l=>l.labs[0]);
  assert.equal(labs.length,inferenceModels.length);
  for(const model of inferenceModels){const matches=labs.filter(l=>l.model===model);assert.equal(matches.length,1);const p=matches[0].parameter;for(const x of [NaN,Infinity,p.min-1,p.max+1])assert.throws(()=>calculate(model,x));}
  for(const model of ["stat-mle","stat-conjugate","stat-predictive","stat-test","stat-bootstrap","stat-se","stat-multiple"])assert.throws(()=>calculate(model,1.5));
});
test("point-estimator sampling moments and risks match enumerated samples",()=>{
  for(const p of [0,0.1,0.6,0.8,1]){
    const outcomes=sequences(10,p).map(([k,m])=>[k/10,m]);
    near(expectation(outcomes),value("stat-point",p,"E[K/10]"));
    near(variance(outcomes),value("stat-point",p,"Variance and MSE"));
    near(total(calculate("stat-point",p).series[0].points),1);
  }
});
test("shrinkage decomposition agrees with direct squared-error averaging",()=>{
  for(const a of [0,0.25,0.8,1]){
    const points=sequences(10,0.8).map(([k,p])=>[a*k/10+(1-a)*0.5,p]);
    near(expectation(points)-0.8,value("stat-bias",a,"Bias"));
    near(variance(points),value("stat-bias",a,"Variance"));
    near(points.reduce((s,[x,p])=>s+(x-0.8)**2*p,0),value("stat-bias",a,"MSE"));
  }
  near(value("stat-bias",0.8,"MSE"),0.01384);
});
test("Bernoulli likelihood peaks at the MLE and handles all-success/failure boundaries",()=>{
  for(let k=0;k<=10;k++){
    const points=calculate("stat-mle",k).series[0].points;
    near(relativeBernoulliLikelihood(k/10,k,10-k),1);
    for(const [p,L]of points){assert.ok(L>=0&&L<=1+1e-12);near(L,(p**k*(1-p)**(10-k))/((k/10)**k*(1-k/10)**(10-k)));}
  }
  near(relativeBernoulliLikelihood(0,0,10),1);near(relativeBernoulliLikelihood(1,10,0),1);
  near(relativeBernoulliLikelihood(0,1,9),0);near(relativeBernoulliLikelihood(1,1,9),0);
});
test("MAP solves the posterior score and differs from the posterior mean",()=>{
  for(const c of [1,2,4.5,10]){
    const mode=value("stat-map",c,"MAP in p coordinates");
    near((c+7)/mode-(c+1)/(1-mode),0,1e-9);
    near(value("stat-map",c,"Posterior mean"),(c+8)/(2*c+10));
  }
  near(value("stat-map",2,"MAP in p coordinates"),0.75);
  near(value("stat-map",2,"Posterior mean"),5/7);
});
test("conjugate updates preserve normalized density and exact posterior moments",()=>{
  for(let k=0;k<=10;k++){
    const r=calculate("stat-conjugate",k),a=k+2,b=13-k;
    near(value("stat-conjugate",k,"Posterior mean"),(5*0.4+k)/15);
    near(value("stat-conjugate",k,"Posterior variance"),a*b/(15*15*16));
    for(const series of r.series){const points=series.points;const area=points.slice(1).reduce((s,[x,y],i)=>s+(x-points[i][0])*(y+points[i][1])/2,0);near(area,1,0.0005);}
  }
  near(value("stat-conjugate",7,"Posterior mean"),0.6);
});
test("beta-binomial masses match independent factorial formulas and predictive moments",()=>{
  for(let n=1;n<=20;n++){
    const points=betaBinomialMass(n,3,2);
    near(total(points),1);near(expectation(points),0.6*n);near(variance(points),0.24*n*(n+5)/6);
    for(const [k,p]of points){const choose=factorial(n)/(factorial(k)*factorial(n-k));const beta=factorial(k+2)*factorial(n-k+1)/factorial(n+4);near(p,choose*beta*12);}
  }
  const r=calculate("stat-predictive",1);for(let k=0;k<2;k++)near(r.series[0].points[k][1],r.series[1].points[k][1]);
  near(value("stat-predictive",5,"Predictive variance"),2);near(betaBinomialMass(5,3,2)[5][1],1/6);
});
test("exact rejection probabilities agree with all binary sequences and nominal size",()=>{
  for(let c=0;c<=11;c++)for(const p of [0.5,0.8])near(binomialUpperTail(10,p,c),sequences(10,p).filter(([k])=>k>=c).reduce((s,[,m])=>s+m,0));
  near(value("stat-test",8,"Actual Type I error"),56/1024);
  near(value("stat-test",9,"Actual Type I error"),11/1024);
  near(value("stat-test",9,"Power at p=0.8"),0.3758096384);
  near(value("stat-test",0,"Actual Type I error"),1);near(value("stat-test",11,"Power at p=0.8"),0);
});
test("observed p-value stays fixed while prospective power changes",()=>{
  const nullTail=[15,16,17,18,19,20].reduce((s,k)=>s+factorial(20)/(factorial(k)*factorial(20-k)),0)/2**20;
  for(const p of [0.5,0.7,0.9,1])near(value("stat-power",p,"One-sided observed p-value"),nullTail);
  near(value("stat-power",0.5,"Power at specified alternative"),nullTail);
  near(value("stat-power",1,"Power at specified alternative"),1);
  near(value("stat-power",0.7,"Power at specified alternative"),0.416370829447481,1e-12);
});
test("bootstrap enumeration has the empirical mean and conditional standard error",()=>{
  for(let k=0;k<=8;k++){
    const points=calculate("stat-bootstrap",k).series[0].points;
    near(total(points),1);near(expectation(points),k/8);
    near(variance(points),value("stat-bootstrap",k,"Bootstrap variance"));
    near(Math.sqrt(variance(points)),value("stat-bootstrap",k,"Bootstrap standard error"));
    const enumerated=sequences(8,k/8).map(([j,p])=>[j/8,p]);near(variance(points),variance(enumerated));
  }
  near(value("stat-bootstrap",3,"Bootstrap variance"),0.029296875);
  assert.match(calculate("stat-bootstrap",0).summary,/does not prove/);
});
test("standard error scales with independent sample count without changing population spread",()=>{
  for(let n=1;n<=100;n++){near(value("stat-se",n,"SE of mean")**2,100/n);near(value("stat-se",n,"Population SD"),10);}
  near(value("stat-se",25,"SE of mean"),2);near(value("stat-se",100,"SE of mean"),1);
});
test("multiple-testing curves agree with independent-event products and Bonferroni bound",()=>{
  for(let m=1;m<=100;m++){
    near(value("stat-multiple",m,"Unadjusted family-wise error"),1-0.95**m);
    const risk=value("stat-multiple",m,"Independent Bonferroni family-wise error");near(risk,1-(1-0.05/m)**m);assert.ok(risk<=0.05+1e-12);
  }
  near(value("stat-multiple",1,"Unadjusted family-wise error"),0.05);
});
test("comparison bar slots stay non-overlapping inside their shared category",()=>{
  for(const count of [1,2,3,6])for(const width of [1,5,30,90]){
    const bars=Array.from({length:count},(_,i)=>groupedBarBounds(100,width,i,count));
    assert.ok(bars[0].x>=100-width/2);assert.ok(bars.at(-1).x+bars.at(-1).width<=100+width/2);
    for(let i=1;i<count;i++)assert.ok(bars[i].x>bars[i-1].x+bars[i-1].width);
  }
});

test("every inference chart includes its full declared support within labeled domains",()=>{
  for(const lesson of Object.values(inferenceLessons)){
    const lab=lesson.labs[0],p=lab.parameter;
    for(let i=0;i<=Math.round((p.max-p.min)/p.step);i++){
      const input=Number((p.min+i*p.step).toFixed(8)),result=calculate(lab.model,input);
      for(const series of result.series)for(const [x,y]of series.points){
        assert.ok(x>=result.xDomain[0]-1e-12&&x<=result.xDomain[1]+1e-12,lab.model);
        assert.ok(y>=result.yDomain[0]-1e-12&&y<=result.yDomain[1]+1e-12,lab.model);
      }
    }
  }
});
