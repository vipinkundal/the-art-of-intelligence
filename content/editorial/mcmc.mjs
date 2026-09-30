import { math, source, reviewed } from "./lesson-helpers.mjs";
const prob = (name) => `probabilistic-ai/topics/${name}`;
const owen = source("Art Owen: Markov chain Monte Carlo and Gibbs sampling", "https://artowen.su.domains/mc/Ch-MCMC.pdf");
const cs228 = source("Stanford CS228: sampling methods", "https://ermongroup.github.io/cs228-notes/inference/sampling/");

export const mcmcLessons = {
  [prob("metropolis-hastings")]: reviewed({
    title: "Metropolis-Hastings", labTitle: "Correct the proposal, preserve the target",
    summary: "Metropolis–Hastings constructs a transition kernel that preserves a target distribution by correcting proposed moves with an acceptance probability. The correction depends on both target density and forward/reverse proposal probabilities. Preserving the target is not the same as having reached it from an arbitrary initial state.",
    hook: "A proposal is an invitation, not a vote for the target distribution.", model: "mcmc-mh", control: ["Proposal mass q(0)", 0.1, 0.8, 0.01, 0.6],
    equation: "α(x,y)=min(1, π(y)q(x|y)/(π(x)q(y|x))); π(x)P(x,y)=π(y)P(y,x)",
    assumptions: "Three states have target masses π=(0.2,0.3,0.5). The independent proposal has q=(r,(1−r)/2,(1−r)/2), identical from every current state. All masses are positive. Bars compare exact invariant laws of the corrected and deliberately incorrect transition rules, not simulated histograms or convergence rates. Matrix rows are current states; columns are next states.",
    takeaway: "A state-independent proposal is not necessarily symmetric. The reverse/forward proposal ratio cancels only when those probabilities agree.",
    prerequisites: [prob("markov-chains"), math("conditional-probability")], sources: [owen, cs228],
    ideas: [
      ["Balance probability flow, not acceptance percentages", "For distinct states, P(x,y)=q(y|x)α(x,y). Multiplying by π(x) gives the smaller of the forward proposed flow π(x)q(y|x) and its reverse. Both directions therefore agree. The diagonal includes rejected proposals and proposals that select the current state."],
      ["An independence proposal still needs correction", "Here q(y|x)=q(y), but q(x|y)=q(x). Unless q(x)=q(y), independence from the current state does not make the proposal symmetric. Removing the proposal ratio produces a different invariant law: π̃(i)=π(i)q(i)/Σⱼπ(j)q(j). The third bar in each group shows that exact wrong law."],
      ["Invariant is not independent", "For this positive finite-state example, all states communicate and self-transitions remove periodicity, so the distribution converges to its invariant law. Consecutive states are nevertheless dependent. A short run initialized at one state is not an IID sample, even with a mathematically valid kernel."]
    ],
    process: ["Evaluate the target up to a shared normalizing constant and specify a proposal with adequate reachability.", "Draw a proposal, compute the forward/reverse correction and accept with that probability.", "If rejected, record the current state again; inspect exploration and Monte Carlo uncertainty across the resulting chain."],
    example: ["An asymmetric invitation from state 2", "Set r=0.6, so q=(0.6,0.2,0.2).", ["For 2→0, the ratio is (0.2·0.2)/(0.5·0.6)=2/15; P₂₀=0.6·2/15=0.08.", "For 0→2, acceptance is 1, so P₀₂=0.2. Both stationary flows equal 0.04.", "Without proposal correction, the invariant weights are (0.12,0.06,0.10), normalized by 0.28: approximately (0.428571,0.214286,0.357143)."], "The incorrect chain can appear stable while sampling the wrong distribution."],
    pitfalls: ["Keeping only accepted moves generally changes the sampled distribution; repeated states carry information and must not simply be discarded.", "High acceptance does not establish good exploration: tiny local proposals may be accepted frequently while barely moving."],
    implementation: ["Compare log U with min(0, log π(y)−log π(x)+log q(x|y)−log q(y|x)) to avoid unnecessary exponentiation.", "Check the actual proposal near boundaries; clipping or truncation can destroy a symmetry assumed by the acceptance rule."],
    outcomes: ["Calculate a corrected transition and verify detailed balance.", "Distinguish proposal independence, proposal symmetry and independent output draws."],
  }),
  [prob("gibbs-sampling")]: reviewed({
    title: "Gibbs sampling", labTitle: "Always valid updates can still move slowly",
    summary: "Gibbs sampling repeatedly redraws a coordinate or block from its full conditional distribution while holding the other coordinates fixed. Each such update preserves the joint target. Strong dependence or disconnected conditional support can still prevent useful exploration; an update needing no rejection step is not a guarantee of fast mixing.",
    hook: "One bit can change easily only when the other bit lets it.", model: "mcmc-gibbs", control: ["Coupling c", 0, 0.98, 0.02, 0.8],
    equation: "π(00)=π(11)=(1+c)/4; π(01)=π(10)=(1−c)/4; P(match | other bit)=(1+c)/2",
    assumptions: "Two binary variables; 0≤c<1. Every update selects X or Y with probability 1/2 and redraws that bit from its exact full conditional. Both curves start at 00. The graph propagates exact probability vectors for 40 single-coordinate updates and measures total variation to each curve's own target. It is not a random trajectory, an empirical convergence diagnostic or a count of complete sweeps.",
    takeaway: "Full conditional updates preserve the target without rejection, yet strong coupling can make transitions between high-probability regions rare.",
    prerequisites: [prob("markov-chains"), math("conditional-probability"), math("joint-marginal-and-conditional-distributions")], sources: [owen, cs228],
    ideas: [
      ["Read a conditional from the joint table", "Each bit has marginal probability 1/2. Given Y=0, P(X=0|Y=0)=((1+c)/4)/(1/2)=(1+c)/2. The same match probability applies to either selected bit. The graph's transition matrix includes the half-probability of selecting that coordinate."],
      ["A local bridge becomes rare", "From 00, either one-bit flip has probability (1−c)/4 per update, while staying has probability (1+c)/2. Getting to 11 requires visiting 01 or 10. At c=0.98 those bridge states together hold only 1% of target mass. This is a simple version of a narrow passage between likely regions."],
      ["Measure a distributional gap exactly here", "Total variation is half the sum of absolute state-mass differences. This tiny example can compute it because the full target and transition matrix are known. The random-scan kernel has eigenvalues 1, (1+c)/2, (1−c)/2 and 0, giving spectral gap (1−c)/2. That shrinking gap explains slow relaxation; it is not something generally known for a large posterior."]
    ],
    process: ["Derive each full conditional from a single consistent joint distribution.", "Select a coordinate or block according to the stated scan rule and redraw it conditionally.", "Retain the resulting state, including unchanged states; assess exploration rather than treating every redraw as independent information."],
    example: ["A conditional redraw is not necessarily a move", "Use c=0.8 and start at 00.", ["The target masses are (0.45,0.05,0.05,0.45). The conditional match probability is 0.9.", "One random-scan update stays at 00 with probability 0.9, goes to 01 with probability 0.05 or to 10 with probability 0.05, and cannot reach 11 directly.", "Its spectral gap is 0.1, compared with 0.5 for c=0. A much slower relaxation is possible even though every conditional draw is valid."], "No rejection step does not mean no repeated states or no autocorrelation."],
    pitfalls: ["At c=1, the only supported states are 00 and 11. Single-bit Gibbs cannot move between them; the control excludes this reducible boundary.", "Redrawing all coordinates simultaneously from conditionals based on the old state is not the same as ordinary sequential or random-scan Gibbs and need not preserve the target."],
    implementation: ["Specify whether one iteration means a coordinate update or a complete sweep when reporting speed and diagnostics.", "Blocking strongly dependent coordinates can help, but requires a correct joint conditional sampler for the block."],
    outcomes: ["Derive a Gibbs transition matrix from a small joint distribution.", "Explain why target invariance and rejection-free updates do not certify fast mixing."],
  }),
  [prob("hamiltonian-monte-carlo")]: reviewed({
    title: "Hamiltonian Monte Carlo", labTitle: "Follow an energy contour, then correct the error",
    summary: "Hamiltonian Monte Carlo augments continuous parameters with momentum and uses gradients to propose moves through phase space. Numerical integration approximately preserves a Hamiltonian; a Metropolis correction accounts for integration error. Useful movement depends on geometry, step size and trajectory length, not acceptance probability alone.",
    hook: "Momentum travels along the landscape instead of taking a blind local step.", model: "mcmc-hmc", control: ["Leapfrog step size ε", 0.05, 1.9, 0.05, 0.3],
    equation: "H(q,p)=(q²+p²)/2; p½=p−εq/2; q′=q+εp½; p′=p½−εq′/2; α=min(1,exp(−ΔH))",
    assumptions: "Standard-normal position target, unit momentum mass, initial position q=1 and illustrative momentum p=0.5. Ten leapfrog steps are shown in equally scaled position/momentum coordinates, before the final momentum flip. The hollow reference endpoint uses exact harmonic dynamics at time 10ε. Changing ε changes both integration error and trajectory duration. This is a single proposal, not a complete HMC chain; a real chain refreshes momentum with Gaussian draws.",
    takeaway: "Small energy error supports acceptance, but does not ensure a useful displacement or representative posterior exploration.",
    prerequisites: [prob("metropolis-hastings"), math("gradients"), math("ordinary-differential-equations")], sources: [source("Stan reference manual: HMC and leapfrog integration", "https://mc-stan.org/docs/reference-manual/mcmc.html"), source("Radford Neal: MCMC using Hamiltonian dynamics", "https://arxiv.org/abs/1206.1901")],
    ideas: [
      ["A solvable orbit supplies a reference", "For this Gaussian example, Hamilton's equations are q̇=p and ṗ=−q. Starting at (1,0.5), the exact solution is q(t)=cos(t)+0.5sin(t) and p(t)=0.5cos(t)−sin(t). Hence q²+p² stays at 1.25 and H=0.625. The cyan circle is this energy contour, not a probability-density contour for q alone."],
      ["Leapfrog is a composition of three shears", "Each step performs a half momentum update, a full position update and a final half momentum update. Plotting only completed steps produces the polygonal trace. Intermediate half-step momenta are not plotted. Exact dynamics stays on the circle; the numerical endpoints generally deviate from it."],
      ["Correct a numerical proposal without pretending it is exact", "For a reversible, volume-preserving leapfrog proposal with momentum reversal, the acceptance probability is min(1,exp(−ΔH)). A negative ΔH gives acceptance one, not proof of perfect integration. An exact trajectory can also return near its start, giving little movement despite zero energy error. This is why the table shows position displacement separately."]
    ],
    process: ["Define potential energy from minus the log target and choose a momentum distribution and mass matrix.", "Refresh momentum and integrate the coupled position/momentum equations using a reversible, volume-preserving scheme.", "Apply the appropriate proposal correction and inspect both numerical behavior and posterior exploration."],
    example: ["One leapfrog step by hand", "Start q=1, p=0.5 and use ε=0.5. This arithmetic covers one step; the interactive lab performs ten.", ["The half momentum is 0.5−0.25·1=0.25; the new position is 1+0.5·0.25=1.125.", "The completed momentum is 0.25−0.25·1.125=−0.03125.", "Final H=(1.125²+0.03125²)/2=0.63330078125. Therefore ΔH=0.00830078125 and α≈0.991734."], "The Metropolis correction addresses a small but nonzero integration error."],
    pitfalls: ["The harmonic oscillator's leapfrog stability range is 0<ε<2; this special threshold is not a universal tuning rule for arbitrary targets.", "A smooth-looking trajectory or high acceptance does not rule out missed modes, poor geometry or strongly correlated output."],
    implementation: ["Compute potential energies and gradients consistently, including Jacobian adjustments when transforming constrained variables.", "The displayed fixed-length algorithm is not NUTS. Production samplers may adapt a mass matrix and step size during warmup and use different trajectory-selection schemes."],
    outcomes: ["Calculate a leapfrog step and its Hamiltonian error.", "Separate numerical accuracy, acceptance and movement through the target."],
  }),
};
for (const lesson of Object.values(mcmcLessons)) lesson.updatedAt = "2026-09-29";
