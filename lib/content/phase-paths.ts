type LearningPath = { title: string; description: string; slugs: string[] };
const probabilistic = (names: string[]) => names.map(name => `probabilistic-ai/topics/${name}`);
const classical = (names:string[]) => names.map(name=>`classical-artificial-intelligence/topics/${name}`);
const math = (name:string) => `mathematical-foundations/topics/${name}`;
const mathPath = (overview:string,names:string[]) => [`mathematical-foundations/${overview}`,...names.map(math)];

export const phasePathOrientation:Record<string,{intro:string;startLabel:string}>={
  "classical-artificial-intelligence":{intro:"Start with representation and search, then choose the guarantee or problem structure you need. These are suggested routes, not a complete prerequisite graph. Search and the constraint foundations below are reviewed; check each lesson's status as the remaining logic, planning and games review progresses.",startLabel:"Start with state representation"},
  "probabilistic-ai":{intro:"New to this section? Start with representation, then exact inference. The remaining paths branch by task. Links within each path give a suggested reading order; check each lesson’s explicit prerequisites.",startLabel:"Start with representation"},
  "mathematical-foundations":{intro:"Choose a subject overview, then try its starting labs. Linear algebra supports calculus and optimization; probability supports statistics and information theory. These are suggested entry routes, not a complete prerequisite graph. Every lesson states its own prerequisites.",startLabel:"Start with linear algebra"},
};

// Authored orientation, not inferred prerequisite edges. Titles and URLs resolve
// through the same lesson registry used by the library and individual lessons.
export const phaseLearningPaths: Record<string, LearningPath[]> = {
  "classical-artificial-intelligence":[
    {title:"Represent and explore",description:"What is a state, and which frontier rule matches the question?",slugs:classical(["state-space-representation","breadth-first-search","depth-first-search","uniform-cost-search","duplicate-state-detection"])},
    {title:"Use heuristic guarantees",description:"Separate a promising estimate from a proof of cost quality.",slugs:classical(["a-star","admissible-heuristics","consistent-heuristics","greedy-best-first-search","weighted-a-star"])},
    {title:"Work within memory limits",description:"Compare cutoffs, repeated passes and permanently discarded alternatives.",slugs:classical(["depth-limited-search","iterative-deepening","iterative-deepening-a-star","beam-search"])},
    {title:"Exploit bounds and direction",description:"Certify distances, meet from two sides, or eliminate non-improving regions. Then check guarantees and resource costs.",slugs:classical(["dijkstras-algorithm","bidirectional-search","branch-and-bound","completeness","optimality","time-and-memory-complexity"])},
    {title:"Check Boolean claims",description:"Evaluate truth assignments, validate witnesses, construct refutations and trace a complete search.",slugs:classical(["propositional-logic","boolean-satisfiability","resolution","dpll"])},
    {title:"Name objects and bind variables",description:"Specify an interpretation, then distinguish a witness per object from one shared witness.",slugs:classical(["first-order-predicate-logic","quantifiers"])},
    {title:"Derive from definite rules",description:"Identify joint antecedents, compute a least closure, then search only the evidence needed for a query.",slugs:classical(["horn-clauses","forward-chaining","backward-chaining"])},
    {title:"Find legal assignments",description:"Model domains, reject bad prefixes and follow support deletions. Then choose variables and values deliberately.",slugs:classical(["constraint-satisfaction-problems","backtracking","forward-checking","arc-consistency","ac-3","constraint-propagation","minimum-remaining-values","degree-heuristic","least-constraining-value"])},
    {title:"Improve complete configurations",description:"Understand local traps, independent restarts, temperature, short-term memory and pooled alternatives.",slugs:classical(["hill-climbing","random-restart-hill-climbing","simulated-annealing","tabu-search","local-beam-search","min-conflicts"])},
    {title:"Plan actions over time",description:"Search complete states, inspect effects, regress requirements, read grounded PDDL and protect causal links.",slugs:classical(["state-space-planning","strips","forward-and-backward-planning","pddl","partial-order-planning"])},
    {title:"Reason against another player",description:"Compare exact values, safe cutoffs, player-relative scores and chance expectations.",slugs:classical(["minimax","alpha-beta-pruning","negamax","expectimax"])},
    {title:"Allocate sampled lookahead",description:"Separate maintained tree evidence, simulated returns, exploration scores and stopped-search recommendations.",slugs:classical(["monte-carlo-tree-search","uct"])},
  ],
  "mathematical-foundations":[
    {title:"Represent and transform",description:"Linear algebra: dimensions, geometry and what a matrix preserves or discards.",slugs:mathPath("linear-algebra",["scalars-vectors-matrices-and-tensors","matrix-multiplication-and-tensor-contraction","rank-and-null-space"])},
    {title:"Measure local change",description:"Calculus: sensitivity, derivative products and the limits of a local approximation.",slugs:mathPath("calculus-and-matrix-calculus",["derivatives-and-partial-derivatives","gradients","jacobians"])},
    {title:"Choose and improve",description:"Optimization: define the target before choosing how to move toward it.",slugs:mathPath("optimization",["objectives-losses-and-cost-functions","gradient-descent","unconstrained-and-constrained-optimization"])},
    {title:"Model uncertainty",description:"Probability: construct a joint model before conditioning, averaging or sampling.",slugs:mathPath("probability",["sample-spaces-and-events","random-variables","joint-marginal-and-conditional-distributions"])},
    {title:"Learn from observations",description:"Statistics: connect a sampling design to estimates, intervals and predictions.",slugs:mathPath("statistics",["populations-and-samples","point-estimation","confidence-intervals"])},
    {title:"Quantify information",description:"Information theory: uncertainty, dependence, compression and communication limits.",slugs:mathPath("information-theory",["entropy","conditional-entropy","mutual-information"])},
    {title:"Prove and compute",description:"Discrete mathematics: structures, correctness arguments and computational limits.",slugs:mathPath("discrete-mathematics-theoretical-computer-science",["sets-relations-and-functions","mathematical-induction","time-and-space-complexity"])},
  ],
  "probabilistic-ai": [
    { title: "Represent uncertainty", description: "Understand what a graph asserts before choosing an inference algorithm.", slugs: probabilistic(["conditional-independence", "bayesian-networks", "d-separation", "markov-random-fields", "factor-graphs", "conditional-random-fields"]) },
    { title: "Compute exact answers", description: "Distinguish marginal and MAP queries, then reuse local computations.", slugs: probabilistic(["exact-inference", "variable-elimination", "belief-propagation", "sum-product-algorithm", "max-product-algorithm", "junction-tree-algorithm"]) },
    { title: "Approximate and learn", description: "Study approximation error and latent-variable parameter estimation as different tasks.", slugs: probabilistic(["approximate-inference", "loopy-belief-propagation", "variational-inference", "expectation-maximization"]) },
    { title: "Sample a fixed target", description: "Use MCMC transitions, then assess mixing and Monte Carlo error.", slugs: probabilistic(["metropolis-hastings", "gibbs-sampling", "hamiltonian-monte-carlo"]) },
    { title: "Model sequences", description: "Move from Markov transitions to hidden states, smoothing and path decoding.", slugs: probabilistic(["markov-chains", "hidden-markov-models", "forward-backward-algorithm", "viterbi-decoding", "dynamic-bayesian-networks"]) },
    { title: "Filter evolving beliefs", description: "Compare Gaussian structure, nonlinear approximations and particle methods.", slugs: probabilistic(["kalman-filter", "extended-kalman-filter", "unscented-kalman-filter", "sequential-monte-carlo", "particle-filter"]) },
  ],
};
