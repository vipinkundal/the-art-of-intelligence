(function () {
  const concept = (title, explanation, notation, example) => ({ title, explanation, notation, example });
  const formula = (label, expression, meaning) => ({ label, expression, meaning });
  const node = (label, detail) => ({ label, detail });

  function detail(config) {
    return {
      simpleIdea: Array.isArray(config.idea) ? config.idea : [config.idea],
      howItWorks: Array.isArray(config.how) ? config.how : [config.how],
      concepts: config.concepts,
      formulas: config.formulas,
      diagram: { caption: config.caption, nodes: config.flow },
      whatToLearn: config.learn,
      whyItMatters: Array.isArray(config.ai) ? config.ai : [config.ai],
      pitfalls: config.pitfalls,
      example: Array.isArray(config.example) ? config.example : [config.example],
      practice: { question: config.question, answer: config.answer },
      resources: config.resources,
    };
  }

  const details = {
    "objectives-losses-and-cost-functions": detail({
      idea: ["An objective tells an optimizer what 'better' means. A loss measures error for one example or prediction, while a cost often combines losses across data and may include extra penalties.", "The names are sometimes used interchangeably, so the mathematical definition matters more than the label."],
      how: "Choose behavior to reward or error to penalize, translate it into a scalar function of model parameters, aggregate over data, and add constraints or regularization that represent practical requirements.",
      concepts: [
        concept("Objective function", "The scalar quantity being minimized or maximized.", "min_theta J(theta) or max_theta R(theta)", "Minimize validation-like training risk."),
        concept("Loss function", "Measures mismatch for one example or one prediction.", "ell(y,f_theta(x))", "Squared error or cross-entropy."),
        concept("Cost or empirical risk", "Aggregates losses over a dataset or batch.", "J(theta)=(1/n)sum_i ell_i", "Mean training loss."),
        concept("Multi-objective tradeoff", "Combines competing goals using weights or constraints.", "J=loss+lambda cost", "Balance accuracy with latency or fairness.")
      ],
      formulas: [formula("Empirical risk", "J(theta)=(1/n)sum_i ell(y_i,f_theta(x_i))", "average sample loss"), formula("Regularized objective", "J_reg(theta)=J(theta)+lambda R(theta)", "data fit plus parameter preference"), formula("Max-to-min conversion", "max R(theta) is min -R(theta)", "either direction can be rewritten")],
      caption: "Optimization begins by translating desired behavior into one measurable target.",
      flow: [node("Desired behavior", "what should improve"), node("Per-example loss", "measure local error"), node("Aggregate cost", "combine data"), node("Objective", "optimize with penalties or constraints")],
      learn: ["Distinguish objective, loss, and cost conventions.", "Construct an empirical-risk objective.", "Explain weighted multi-objective tradeoffs.", "Check whether a surrogate loss matches the real deployment goal."],
      ai: "Training follows the objective, so a poorly chosen loss can produce technically optimized but undesirable model behavior.",
      pitfalls: ["A lower training objective does not guarantee better deployment performance.", "Combining terms with incompatible scales can make one dominate.", "A differentiable surrogate may not perfectly match the business or safety metric."],
      example: "A classifier may minimize mean cross-entropy plus lambda||theta||^2. Cross-entropy rewards calibrated class probabilities; the penalty discourages excessively large weights.",
      question: "What is the difference between per-example loss and empirical cost?",
      answer: "Loss evaluates one prediction; empirical cost aggregates those losses across a sample or batch.",
      resources: [{ label: "Deep Learning book: Numerical computation", url: "https://www.deeplearningbook.org/contents/numerical.html" }]
    }),
    "parameters-and-decision-variables": detail({
      idea: "Decision variables are the values an optimizer is allowed to choose. In machine learning they are usually model parameters such as weights and biases, while hyperparameters are selected outside the inner training optimization.",
      how: "List every adjustable quantity, give it a shape and feasible domain, distinguish fixed data from chosen variables, and write the objective and constraints as functions of those variables.",
      concepts: [
        concept("Decision variable", "Any quantity chosen by the optimization procedure.", "theta", "A model's weight vector."),
        concept("Parameter", "A learned value controlling model behavior.", "W,b", "Neural network matrices and biases."),
        concept("Hyperparameter", "A setting controlling training or model structure, usually chosen by an outer process.", "eta, lambda, depth", "Learning rate or regularization strength."),
        concept("Feasible domain", "The set of values a variable is allowed to take.", "theta in C", "Probabilities must lie in [0,1].")
      ],
      formulas: [formula("Optimization variable", "theta*=argmin_(theta in C) J(theta)", "choose feasible theta with best objective"), formula("Model mapping", "y_hat=f_theta(x)", "parameters control predictions"), formula("Bilevel view", "lambda*=argmin_lambda Validation(theta*(lambda))", "outer hyperparameter selection")],
      caption: "Optimization separates what is fixed from what may change.",
      flow: [node("Fixed inputs", "data and environment"), node("Decision variables", "adjustable values"), node("Model and objective", "evaluate choices"), node("Optimal parameters", "best feasible decision")],
      learn: ["Identify decision variables in a problem.", "Distinguish parameters from hyperparameters.", "Specify variable shapes and domains.", "Recognize discrete versus continuous decisions."],
      ai: "Clear variable definitions prevent accidental optimization over data, labels, or evaluation settings and make model-training equations interpretable.",
      pitfalls: ["Parameters are not always probabilities or interpretable quantities.", "Hyperparameters can also be optimized, but usually in an outer loop.", "Ignoring variable domains can produce invalid solutions."],
      example: "In linear regression y_hat=Xw+b, w and b are decision variables. X and y are fixed training data. The learning rate is a hyperparameter controlling how the optimizer updates w and b.",
      question: "In ridge regression, is lambda normally a model parameter or a hyperparameter?",
      answer: "A hyperparameter, commonly selected using validation data or an outer optimization procedure.",
      resources: [{ label: "Wikipedia: Mathematical optimization", url: "https://en.wikipedia.org/wiki/Mathematical_optimization" }]
    }),
    "unconstrained-and-constrained-optimization": detail({
      idea: "Unconstrained optimization allows any value in the variable's domain. Constrained optimization restricts solutions with equalities, inequalities, or structural rules.",
      how: "Write the objective f(theta), list constraints g_i(theta)<=0 and h_j(theta)=0, define the feasible set, then choose a method that either stays feasible or penalizes violations.",
      concepts: [
        concept("Unconstrained problem", "Searches the full variable space.", "min_theta f(theta)", "Ordinary least squares without parameter bounds."),
        concept("Equality constraint", "Requires an expression to equal a fixed value.", "h(theta)=0", "Portfolio weights sum to one."),
        concept("Inequality constraint", "Places an upper or lower limit.", "g(theta)<=0", "Memory use stays below a budget."),
        concept("Feasible set", "All variable values satisfying every constraint.", "C={theta:g<=0,h=0}", "Optimization may only choose points in C.")
      ],
      formulas: [formula("Unconstrained", "min_theta f(theta)", "no explicit feasibility rules"), formula("Constrained", "min_theta f(theta) subject to g(theta)<=0, h(theta)=0", "objective inside a feasible set"), formula("Penalty method", "min_theta f(theta)+rho * violation(theta)", "discourage infeasible points")],
      caption: "Constraints carve a feasible region out of the full search space.",
      flow: [node("All candidate values", "unconstrained space"), node("Apply rules", "equalities and inequalities"), node("Feasible region", "allowed candidates"), node("Optimize inside", "best feasible solution")],
      learn: ["Write unconstrained and constrained problems.", "Distinguish equality and inequality constraints.", "Identify active constraints.", "Compare projection, penalty, and Lagrangian approaches."],
      ai: "Constraints encode safety limits, fairness requirements, resource budgets, probability normalization, and physically valid model behavior.",
      pitfalls: ["A penalty does not guarantee exact feasibility unless designed and solved carefully.", "The unconstrained optimum may be impossible under constraints.", "An empty feasible set means the requirements conflict."],
      example: "Minimize (x-3)^2 without constraints gives x=3. Adding x<=1 makes the best feasible point x=1 because every allowed point lies left of the unconstrained minimum.",
      question: "What is an active inequality constraint?",
      answer: "A constraint that holds with equality at the solution and directly limits further movement.",
      resources: [{ label: "Wikipedia: Constrained optimization", url: "https://en.wikipedia.org/wiki/Constrained_optimization" }]
    }),
    "convex-and-non-convex-optimization": detail({
      idea: "A convex problem has a bowl-like global structure: every local minimum is global. Non-convex problems may contain several basins, flat regions, and saddle points.",
      how: "Check that the feasible set is convex and that the objective lies below every chord between two points. For differentiable convex functions, first-order conditions provide global guarantees.",
      concepts: [
        concept("Convex set", "Every line segment between two feasible points stays feasible.", "tx+(1-t)y in C", "A box or ball is convex."),
        concept("Convex function", "The function value between points is no greater than the straight-line interpolation.", "f(tx+(1-t)y)<=tf(x)+(1-t)f(y)", "Quadratic with PSD curvature."),
        concept("Global guarantee", "Any local minimum of a convex problem is global.", "grad f(x*)=0 implies global minimum", "When unconstrained and differentiable."),
        concept("Non-convex landscape", "Can include multiple minima, saddles, plateaus, and symmetries.", "neural-network loss", "Initialization and optimization path matter.")
      ],
      formulas: [formula("Convexity", "f(tx+(1-t)y)<=t f(x)+(1-t)f(y)", "function lies below chords"), formula("First-order condition", "f(y)>=f(x)+grad f(x)^T(y-x)", "supporting hyperplane for convex f"), formula("Second-order test", "H_f(x) positive semidefinite", "sufficient convexity for twice-differentiable f")],
      caption: "Convex geometry gives global structure; non-convex geometry offers only local information.",
      flow: [node("Inspect feasible set", "is it convex?"), node("Inspect objective", "curvature or definition"), node("Convex", "local equals global"), node("Non-convex", "path and initialization matter")],
      learn: ["Recognize convex sets and functions.", "Use first- and second-order convexity tests.", "Explain local-to-global guarantees.", "Describe why neural-network objectives are non-convex."],
      ai: "Convex subproblems offer reliable solutions, while deep-learning training relies on practical behavior of large non-convex landscapes rather than global guarantees.",
      pitfalls: ["A convex objective with a non-convex feasible set is not a convex optimization problem.", "Strict convexity gives uniqueness; ordinary convexity may not.", "Non-convex does not automatically mean impossible to optimize well."],
      example: "f(x)=x^2 is convex because f''(x)=2>0. f(x)=x^4-x^2 is non-convex near zero and has two symmetric minima.",
      question: "Why is every local minimum global for a convex function on a convex set?",
      answer: "A lower point elsewhere would make the line segment immediately descend from the supposed local minimum, contradicting local optimality.",
      resources: [{ label: "Stanford: Convex Optimization", url: "https://web.stanford.edu/~boyd/cvxbook/" }]
    }),
    "local-minima-global-minima-and-saddle-points": detail({
      idea: "A local minimum is best only among nearby points, a global minimum is best everywhere feasible, and a saddle point rises in some directions while falling in others.",
      how: "Find stationary points where the gradient is zero or constrained movement stops, then inspect nearby objective values or Hessian eigenvalues to classify local geometry.",
      concepts: [
        concept("Local minimum", "No sufficiently nearby feasible point has lower objective.", "f(x*)<=f(x) nearby", "One basin in a multi-basin landscape."),
        concept("Global minimum", "No feasible point anywhere has lower objective.", "f(x*)<=f(x) for all feasible x", "The best achievable value."),
        concept("Saddle point", "Stationary point with decreasing and increasing directions.", "mixed Hessian eigenvalue signs", "Mountain pass geometry."),
        concept("Flat region", "Gradient and curvature may be tiny over a broad area.", "near-zero eigenvalues", "Optimization moves slowly and solutions may be non-unique.")
      ],
      formulas: [formula("Stationary condition", "grad f(x*)=0", "candidate for unconstrained smooth optimum"), formula("Local minimum curvature", "H(x*) positive semidefinite", "necessary under regular smooth conditions"), formula("Saddle signature", "H has positive and negative eigenvalues", "upward and downward directions")],
      caption: "Zero gradient does not identify the type of stationary point.",
      flow: [node("Find grad f=0", "stationary candidate"), node("Inspect Hessian", "curvature directions"), node("All positive / mixed", "minimum / saddle"), node("Compare globally", "only then identify global minimum")],
      learn: ["Define local and global minima.", "Recognize saddle geometry.", "Use gradient and Hessian conditions.", "Understand flat directions and parameter symmetries."],
      ai: "Deep networks have many saddles, flat directions, and equivalent parameter solutions. Training quality depends more on generalizing solutions than proving global optimality.",
      pitfalls: ["Gradient zero is necessary in many smooth interiors but not sufficient for a minimum.", "Boundary optima may have nonzero unconstrained gradients.", "A lower training minimum may generalize worse."],
      example: "For f(x,y)=x^2-y^2, grad f=[2x,-2y] is zero at (0,0). Moving along x raises f; moving along y lowers it, so the point is a saddle.",
      question: "What does a Hessian with all strictly positive eigenvalues imply at a stationary point?",
      answer: "A strict local minimum under standard twice-differentiable conditions.",
      resources: [{ label: "Wikipedia: Critical point", url: "https://en.wikipedia.org/wiki/Critical_point_(mathematics)" }]
    }),
    "gradient-descent": detail({
      idea: "Gradient descent repeatedly moves parameters opposite the gradient because the negative gradient is the direction of steepest local decrease under Euclidean geometry.",
      how: "Compute the objective gradient at current parameters, multiply it by a learning rate, subtract the result, and repeat until progress or a stopping condition is reached.",
      concepts: [
        concept("Gradient", "Vector of local objective slopes.", "g_t=grad J(theta_t)", "One component per parameter."),
        concept("Descent direction", "A direction whose dot product with the gradient is negative.", "g^T d<0", "d=-g is the basic choice."),
        concept("Learning rate", "Controls update length.", "eta>0", "Too large can diverge; too small is slow."),
        concept("Convergence", "Approach toward a stationary or optimal point under assumptions.", "||grad J|| -> 0", "Rate depends on smoothness and conditioning.")
      ],
      formulas: [formula("Update", "theta_(t+1)=theta_t-eta grad J(theta_t)", "take a negative-gradient step"), formula("First-order change", "J(theta+Delta) approximately J(theta)+grad J^T Delta", "why negative gradient lowers J locally"), formula("Quadratic stability", "0<eta<2/L", "basic bound for L-smooth convex quadratics")],
      caption: "Gradient descent alternates measuring local slope and taking a controlled downhill step.",
      flow: [node("Current theta", "evaluate objective"), node("Compute gradient", "local uphill direction"), node("Subtract eta gradient", "move downhill"), node("Repeat", "until stopping rule")],
      learn: ["Perform gradient-descent steps by hand.", "Explain why negative gradient is a descent direction.", "Relate learning rate to stability.", "Recognize convergence diagnostics."],
      ai: "Gradient-based optimization trains differentiable models from linear regression to large neural networks.",
      pitfalls: ["The gradient is local and does not reveal distant obstacles.", "Feature scaling and conditioning strongly affect speed.", "A decreasing training loss can still accompany worsening validation performance."],
      example: "For J(theta)=(theta-3)^2, gradient is 2(theta-3). Starting theta=0 with eta=0.1 gives theta_1=0-0.1(-6)=0.6, moving toward 3.",
      question: "For gradient g=[3,-4] and eta=0.1, what update Delta theta is used?",
      answer: "-eta g=[-0.3,0.4].",
      resources: [{ label: "Wikipedia: Gradient descent", url: "https://en.wikipedia.org/wiki/Gradient_descent" }]
    }),
    "stochastic-gradient-descent": detail({
      idea: "Stochastic gradient descent uses a random example or small random batch to estimate the full-data gradient. Updates are noisy but much cheaper and more frequent.",
      how: "Shuffle data, sample an example or batch, compute its gradient estimate, update parameters, and repeat across epochs. Under unbiased sampling, the estimate points correctly on average.",
      concepts: [
        concept("Full gradient", "Average gradient over the complete training set.", "g=(1/n)sum_i grad ell_i", "Accurate but expensive for large n."),
        concept("Stochastic gradient", "Random estimate from one example or subset.", "g_hat_t", "Varies from step to step."),
        concept("Unbiased estimate", "Expected stochastic gradient equals the full gradient under suitable sampling.", "E[g_hat]=g", "Noise cancels over repeated steps."),
        concept("Epoch", "One approximate pass through the training dataset.", "n examples processed", "Updates per epoch depend on batch size.")
      ],
      formulas: [formula("Stochastic update", "theta_(t+1)=theta_t-eta_t g_hat_t", "update with random gradient"), formula("Unbiasedness", "E[g_hat_t|theta_t]=grad J(theta_t)", "correct direction on average"), formula("Noise variance", "E[||g_hat-g||^2]", "controls update variability")],
      caption: "SGD trades exact gradients for cheap noisy steps that scale to large data.",
      flow: [node("Shuffle/sample", "random data"), node("Estimate gradient", "one example or batch"), node("Update immediately", "cheap step"), node("Repeat over epochs", "noise averages out")],
      learn: ["Compare full-batch and stochastic gradients.", "Explain unbiased gradient noise.", "Define iterations and epochs.", "Relate learning-rate decay to stochastic convergence."],
      ai: "SGD makes modern deep learning computationally feasible and its noise can help exploration and generalization.",
      pitfalls: ["Biased sampling changes the optimized objective unless corrected.", "A constant large learning rate may prevent convergence.", "Data order and correlated batches can create harmful gradient patterns."],
      example: "If individual gradients are [2,0], [4,2], and [0,4], the full gradient is [2,2]. One SGD step may use any one, but the expected sampled gradient is [2,2].",
      question: "Why can training loss briefly increase during SGD?",
      answer: "A noisy batch gradient may not descend on the full objective even though it is correct on average.",
      resources: [{ label: "Wikipedia: Stochastic gradient descent", url: "https://en.wikipedia.org/wiki/Stochastic_gradient_descent" }]
    }),
    "mini-batch-optimization": detail({
      idea: "Mini-batch optimization computes each update from a small group of examples, balancing the noise of single-example SGD with the efficiency and stability of full-batch gradients.",
      how: "Partition or sample shuffled data into batches, average the per-example losses and gradients inside each batch, perform one update, and continue until the epoch is complete.",
      concepts: [
        concept("Batch size", "Number of examples contributing to one update.", "B", "Common powers of two are implementation choices, not mathematical requirements."),
        concept("Batch gradient", "Average gradient over selected examples.", "g_B=(1/B)sum_(i in B) grad ell_i", "Variance falls as batch size grows."),
        concept("Hardware utilization", "Vectorized batches use accelerators efficiently.", "throughput", "Very small batches may underuse compute."),
        concept("Gradient accumulation", "Sum gradients from several micro-batches before updating.", "effective batch", "Fits large effective batches in limited memory.")
      ],
      formulas: [formula("Batch loss", "J_B=(1/B)sum_(i in B) ell_i", "mean loss for selected examples"), formula("Batch gradient", "g_B=(1/B)sum_(i in B) grad ell_i", "update estimate"), formula("Steps per epoch", "approximately ceil(n/B)", "number of updates per data pass")],
      caption: "Batch size connects statistical noise, update frequency, memory, and hardware throughput.",
      flow: [node("Shuffle dataset", "reduce ordering bias"), node("Form B examples", "mini-batch"), node("Average gradients", "stable estimate"), node("Update", "repeat for next batch")],
      learn: ["Compute mini-batch losses and gradients.", "Relate batch size to gradient variance.", "Understand update count and effective batch size.", "Balance memory, throughput, and generalization."],
      ai: "Nearly all neural-network training uses mini-batches because they map well to accelerators and offer controllable gradient noise.",
      pitfalls: ["Changing batch size can require learning-rate adjustment.", "The final smaller batch and normalization choices can alter updates.", "Examples within a batch should reflect the intended sampling distribution."],
      example: "With n=1,000 and B=100, one epoch has 10 updates. Using B=20 gives 50 noisier updates and lower memory use.",
      question: "What happens to the number of updates per epoch when batch size doubles?",
      answer: "It roughly halves, assuming dataset size stays fixed.",
      resources: [{ label: "Deep Learning book: Optimization", url: "https://www.deeplearningbook.org/contents/optimization.html" }]
    }),
    "learning-rates-and-schedules": detail({
      idea: "The learning rate controls how far parameters move on each update. A schedule changes that step size during training to combine fast early progress with stable late refinement.",
      how: "Choose an initial rate, monitor loss and gradient behavior, reduce it according to time or validation plateaus, and coordinate changes with batch size, optimizer, and warmup.",
      concepts: [
        concept("Learning rate", "Multiplier converting gradient into parameter movement.", "eta_t", "Central training hyperparameter."),
        concept("Warmup", "Gradually increases the rate at the start.", "eta_t rises for early steps", "Protects unstable early training."),
        concept("Decay", "Reduces the rate over time.", "step, exponential, cosine", "Allows finer convergence later."),
        concept("Restart or cycle", "Periodically raises the rate to explore or repeat training phases.", "cyclical schedule", "Cosine restarts.")
      ],
      formulas: [formula("Update", "theta_(t+1)=theta_t-eta_t g_t", "time-varying step size"), formula("Exponential decay", "eta_t=eta_0 gamma^t", "multiply rate by gamma<1"), formula("Cosine decay", "eta_t=eta_min+0.5(eta_max-eta_min)(1+cos(pi t/T))", "smooth decay over horizon T")],
      caption: "A schedule uses large exploratory steps early and smaller refining steps later.",
      flow: [node("Initialize", "possibly warm up"), node("Fast learning", "larger steps"), node("Decay", "reduce oscillation"), node("Refine", "small late steps")],
      learn: ["Interpret learning-rate effects.", "Recognize warmup and common decay schedules.", "Diagnose rates that are too high or low.", "Coordinate rate with batch and optimizer changes."],
      ai: "Learning-rate choice often determines whether a large model diverges, learns slowly, or reaches strong performance within a compute budget.",
      pitfalls: ["A schedule cannot rescue a fundamentally unsuitable objective or broken gradients.", "Copying a rate without matching batch size and optimizer is unreliable.", "Validation plateaus can be noisy, so reactive schedules need patience."],
      example: "A rate of 1 may overshoot a narrow quadratic minimum, while 0.000001 barely moves. Warmup to 0.001 followed by cosine decay can provide stable early and precise late updates.",
      question: "Why are smaller learning rates often useful late in training?",
      answer: "They reduce oscillation and permit finer adjustments near a good solution.",
      resources: [{ label: "PyTorch: Learning-rate schedulers", url: "https://pytorch.org/docs/stable/optim.html#how-to-adjust-learning-rate" }]
    }),
    "momentum-and-adaptive-methods": detail({
      idea: "Momentum smooths gradients into a running direction, while adaptive methods rescale updates using recent gradient magnitudes. Both help when gradients are noisy or differently scaled across coordinates.",
      how: "Maintain optimizer state alongside parameters. Momentum averages directions over time; adaptive methods track squared gradients and divide by their root to normalize coordinate-wise steps.",
      concepts: [
        concept("Momentum", "Accumulates a velocity from past gradients.", "v_t=beta v_(t-1)+g_t", "Builds speed in consistent directions."),
        concept("Damping", "Beta controls memory and smoothing.", "0<=beta<1", "High beta remembers longer."),
        concept("Adaptive scaling", "Coordinates with consistently large gradients receive smaller effective steps.", "g/sqrt(s)", "Useful for sparse or uneven gradients."),
        concept("Optimizer state", "Extra moving averages stored for each parameter.", "v_t,s_t", "Consumes memory beyond model weights.")
      ],
      formulas: [formula("Momentum", "v_t=beta v_(t-1)+(1-beta)g_t", "smoothed gradient"), formula("Momentum update", "theta_(t+1)=theta_t-eta v_t", "step using velocity"), formula("Adaptive scale", "theta<-theta-eta g/(sqrt(s)+epsilon)", "normalize by recent squared magnitude")],
      caption: "Optimizer state turns a sequence of noisy gradients into smoother, better-scaled updates.",
      flow: [node("Current gradient", "new signal"), node("Update moving averages", "direction and scale"), node("Normalize or smooth", "condition update"), node("Move parameters", "stateful step")],
      learn: ["Explain momentum as a moving average.", "Interpret beta as memory length.", "Describe adaptive coordinate scaling.", "Compare memory and generalization tradeoffs."],
      ai: "Momentum, RMSProp, Adam, and related methods are standard tools for accelerating and stabilizing neural-network training.",
      pitfalls: ["Adaptive methods still need a global learning rate.", "Optimizer state increases memory significantly.", "Fast training loss reduction does not guarantee the best final generalization."],
      example: "If gradients repeatedly point right with small up/down noise, momentum reinforces rightward movement while canceling alternating vertical components.",
      question: "What does increasing momentum beta generally do?",
      answer: "It gives past gradients more influence, creating smoother updates with longer memory.",
      resources: [{ label: "Distill: Why Momentum Really Works", url: "https://distill.pub/2017/momentum/" }]
    }),
    "adam-and-rmsprop": detail({
      idea: "RMSProp rescales gradients using a moving average of squared gradients. Adam combines that scaling with a moving average of the gradients themselves and bias corrections.",
      how: "Update first and/or second moment estimates, correct their early bias when required, divide the direction estimate by root mean square magnitude plus epsilon, and apply the learning rate.",
      concepts: [
        concept("RMSProp second moment", "Tracks recent squared gradients.", "v_t=beta_2 v_(t-1)+(1-beta_2)g_t^2", "Large-gradient coordinates get smaller steps."),
        concept("Adam first moment", "Tracks a momentum-like gradient average.", "m_t=beta_1 m_(t-1)+(1-beta_1)g_t", "Smoothed direction."),
        concept("Bias correction", "Compensates moving averages initialized at zero.", "m_hat=m_t/(1-beta_1^t)", "Important during early steps."),
        concept("Epsilon", "Small positive value preventing division by zero.", "epsilon", "Also influences behavior for tiny gradients.")
      ],
      formulas: [formula("Adam moments", "m_t=beta_1 m_(t-1)+(1-beta_1)g_t; v_t=beta_2 v_(t-1)+(1-beta_2)g_t^2", "direction and scale estimates"), formula("Bias correction", "m_hat=m_t/(1-beta_1^t); v_hat=v_t/(1-beta_2^t)", "remove initialization bias"), formula("Adam update", "theta<-theta-eta m_hat/(sqrt(v_hat)+epsilon)", "adaptive momentum step")],
      caption: "Adam combines smoothed direction with coordinate-wise gradient scale.",
      flow: [node("Gradient g_t", "current batch"), node("First moment m", "smoothed direction"), node("Second moment v", "squared scale"), node("Correct and update", "Adam step")],
      learn: ["State the roles of first and second moments.", "Explain bias correction.", "Compare RMSProp with Adam.", "Recognize decoupled weight decay in AdamW."],
      ai: "Adam is a common default for transformers and many deep models because it handles sparse, noisy, and uneven gradients well.",
      pitfalls: ["Adam's parameter defaults are not universal.", "L2 penalty and decoupled weight decay behave differently under adaptive scaling.", "Very small epsilon or mixed precision can create instability."],
      example: "A coordinate with consistently large gradients develops large v_hat, reducing its effective step; a sparse coordinate with small v_hat can receive a relatively larger normalized step.",
      question: "Why does Adam use bias correction early in training?",
      answer: "Moving averages start at zero, so without correction they underestimate moments during early steps.",
      resources: [{ label: "Adam paper", url: "https://arxiv.org/abs/1412.6980" }]
    }),
    "line-search": detail({
      idea: "Line search chooses how far to move along an already selected direction by evaluating or bounding the objective along that one-dimensional path.",
      how: "Choose a descent direction d, define phi(alpha)=f(x+alpha d), try candidate step sizes, and accept one satisfying sufficient decrease and sometimes curvature conditions.",
      concepts: [
        concept("Search direction", "Direction chosen before step length.", "d", "Negative gradient or Newton direction."),
        concept("Step length", "Scalar distance along d.", "alpha>0", "Controls movement size."),
        concept("Backtracking", "Start large and repeatedly shrink until sufficient decrease holds.", "alpha<-rho alpha", "Simple robust procedure."),
        concept("Wolfe conditions", "Balance sufficient decrease with a condition on new slope.", "Armijo + curvature", "Avoid steps that are too short or long.")
      ],
      formulas: [formula("Line function", "phi(alpha)=f(x+alpha d)", "one-dimensional objective along d"), formula("Armijo condition", "f(x+alpha d)<=f(x)+c alpha grad f(x)^T d", "sufficient objective decrease"), formula("Backtracking", "alpha_k=rho^k alpha_0", "geometrically shrink candidate")],
      caption: "Line search separates choosing a promising direction from choosing a safe distance.",
      flow: [node("Choose direction d", "descent path"), node("Try alpha", "candidate distance"), node("Check decrease", "Armijo or Wolfe"), node("Accept or shrink", "update x")],
      learn: ["Define the line objective phi(alpha).", "Perform basic backtracking.", "Interpret sufficient-decrease conditions.", "Compare line search with fixed schedules."],
      ai: "Line searches are common in classical optimization and smaller differentiable systems, though expensive repeated evaluations make them less common in noisy large-batch deep learning.",
      pitfalls: ["The direction must usually be a descent direction.", "Noisy mini-batch objectives make acceptance tests unreliable.", "Exact line minimization is often unnecessary and costly."],
      example: "Starting alpha=1 with rho=0.5, test 1, then 0.5, then 0.25 until the Armijo condition holds. The first accepted value becomes the step length.",
      question: "What does backtracking do when the candidate step does not decrease the objective enough?",
      answer: "It multiplies the step length by a factor rho between zero and one and tests again.",
      resources: [{ label: "Wikipedia: Line search", url: "https://en.wikipedia.org/wiki/Line_search" }]
    }),
    "newton-and-quasi-newton-methods": detail({
      idea: "Newton's method uses both gradient and curvature to jump toward the minimum of a local quadratic approximation. Quasi-Newton methods approximate curvature from successive gradients instead of forming the full Hessian.",
      how: "Build or approximate a quadratic local model, solve for a curvature-scaled direction, choose a step length or trust region, and update the approximation using new gradient information.",
      concepts: [
        concept("Newton step", "Solves the stationary point of the second-order Taylor model.", "d=-H^-1 g", "Automatically rescales steep and flat directions."),
        concept("Hessian", "Matrix of local second derivatives.", "H", "Expensive O(n^2) storage for n parameters."),
        concept("Quasi-Newton", "Builds an inverse-Hessian approximation from gradient changes.", "BFGS", "Avoids exact second derivatives."),
        concept("Limited-memory BFGS", "Stores a short history of vectors rather than a dense matrix.", "L-BFGS", "Useful for large but deterministic problems.")
      ],
      formulas: [formula("Newton direction", "d=-H(x)^-1 grad f(x)", "curvature-scaled descent near a minimum"), formula("Newton update", "x_new=x+d", "full local quadratic step"), formula("Secant condition", "B_(k+1)s_k=y_k", "quasi-Newton matches observed gradient change")],
      caption: "Second-order methods use curvature to convert gradient into a better-scaled direction.",
      flow: [node("Gradient g", "slope"), node("Hessian or approximation", "curvature"), node("Solve Bd=-g", "scaled direction"), node("Globalize step", "line search or trust region")],
      learn: ["Derive the Newton direction from a quadratic model.", "Explain curvature scaling.", "Compare Newton, BFGS, and L-BFGS.", "Recognize Hessian cost and indefiniteness."],
      ai: "Second-order ideas appear in classical ML, small model fitting, natural gradients, curvature approximations, and influence analysis.",
      pitfalls: ["An indefinite Hessian can produce a non-descent direction.", "Computing or inverting a full Hessian is impractical for huge models.", "Newton steps need damping far from a suitable minimum."],
      example: "For f(x)=5x^2, g=10x and H=10. Newton gives d=-(10x)/10=-x, reaching x=0 in one step because the function is exactly quadratic.",
      question: "Why is L-BFGS called limited-memory?",
      answer: "It stores only a small history of parameter and gradient differences instead of a full dense Hessian approximation.",
      resources: [{ label: "Wikipedia: Quasi-Newton method", url: "https://en.wikipedia.org/wiki/Quasi-Newton_method" }]
    }),
    "lagrange-multipliers": detail({
      idea: "Lagrange multipliers solve equality-constrained problems by balancing the objective gradient against constraint gradients. At a constrained optimum, no feasible tangent movement can improve the objective.",
      how: "Form the Lagrangian by adding each equality constraint times a multiplier, then solve for stationarity in both original variables and multipliers together with the constraints.",
      concepts: [
        concept("Equality constraint", "A rule h(x)=0 defining a surface.", "h(x)=0", "Probabilities sum to one."),
        concept("Lagrangian", "Combines objective and constraints into one expression.", "L(x,lambda)=f(x)+lambda h(x)", "Multiplier enforces the rule."),
        concept("Gradient balance", "Objective gradient lies in the span of constraint gradients.", "grad f=-lambda grad h", "No feasible tangent descent remains."),
        concept("Shadow price", "Multiplier measures optimal-value sensitivity to relaxing the constraint.", "lambda*", "Marginal value of more budget.")
      ],
      formulas: [formula("Lagrangian", "L(x,lambda)=f(x)+lambda h(x)", "objective plus equality constraint"), formula("Stationarity", "grad_x L=0", "balanced objective and constraint gradients"), formula("Feasibility", "h(x)=0", "solution obeys the original rule")],
      caption: "At the optimum, objective contours touch the constraint surface without a feasible downhill direction.",
      flow: [node("Objective f", "desired decrease"), node("Constraint h=0", "allowed surface"), node("Build Lagrangian", "introduce lambda"), node("Solve balance + feasibility", "constrained optimum")],
      learn: ["Form a Lagrangian.", "Write stationarity and feasibility equations.", "Interpret gradient alignment geometrically.", "Explain multiplier sensitivity."],
      ai: "Lagrange multipliers enforce normalization, resource budgets, fairness constraints, and appear in dual optimization and maximum-entropy models.",
      pitfalls: ["Stationary equations produce candidates, not always global optima.", "Constraint gradients must satisfy regularity conditions.", "Sign conventions for multipliers vary."],
      example: "Minimize x^2+y^2 subject to x+y=1. L=x^2+y^2+lambda(x+y-1). Stationarity gives 2x+lambda=0 and 2y+lambda=0, so x=y=0.5.",
      question: "At a regular equality-constrained optimum, how are grad f and grad h related?",
      answer: "They are parallel up to the multiplier, so the objective has no component along feasible tangent directions.",
      resources: [{ label: "Wikipedia: Lagrange multiplier", url: "https://en.wikipedia.org/wiki/Lagrange_multiplier" }]
    }),
    "kkt-conditions": detail({
      idea: "Karush-Kuhn-Tucker conditions extend Lagrange-multiplier reasoning to inequality constraints. They describe feasibility, gradient balance, multiplier signs, and which constraints are active.",
      how: "Write the Lagrangian with nonnegative multipliers for inequalities, then enforce primal feasibility, dual feasibility, stationarity, and complementary slackness.",
      concepts: [
        concept("Primal feasibility", "The original variable satisfies every constraint.", "g_i(x)<=0; h_j(x)=0", "Candidate is allowed."),
        concept("Dual feasibility", "Inequality multipliers have the required sign.", "lambda_i>=0", "No negative penalty force under the standard convention."),
        concept("Complementary slackness", "A multiplier is zero unless its constraint is active.", "lambda_i g_i(x)=0", "Inactive limits exert no force."),
        concept("Stationarity", "Objective and active constraint gradients balance.", "grad_x L=0", "No first-order feasible improvement.")
      ],
      formulas: [formula("Lagrangian", "L=f+sum_i lambda_i g_i+sum_j nu_j h_j", "combine objective and constraints"), formula("Complementary slackness", "lambda_i g_i(x)=0", "active constraint or zero multiplier"), formula("KKT system", "primal + dual feasibility + stationarity + slackness", "four condition groups")],
      caption: "KKT conditions reveal which constraints shape the optimum and how strongly.",
      flow: [node("Feasible candidate", "primal rules"), node("Assign multipliers", "dual signs"), node("Check active constraints", "complementary slackness"), node("Balance gradients", "stationarity")],
      learn: ["List the four KKT condition groups.", "Identify active and inactive inequalities.", "Solve a simple one-variable KKT problem.", "Know when KKT conditions are necessary or sufficient."],
      ai: "KKT conditions underpin support vector machines, constrained learning, dual methods, optimal transport, and many resource-allocation formulations.",
      pitfalls: ["KKT is not automatically sufficient in non-convex problems.", "Constraint qualification assumptions matter for necessity.", "Multiplier signs depend on writing inequalities consistently."],
      example: "Minimize (x-2)^2 subject to x<=1. The optimum x=1 has active constraint. With g=x-1, stationarity 2(x-2)+lambda=0 gives lambda=2, satisfying lambda>=0 and lambda g=0.",
      question: "What does complementary slackness imply for a strictly inactive constraint g_i(x)<0?",
      answer: "Its multiplier lambda_i must be zero.",
      resources: [{ label: "Wikipedia: Karush-Kuhn-Tucker conditions", url: "https://en.wikipedia.org/wiki/Karush%E2%80%93Kuhn%E2%80%93Tucker_conditions" }]
    }),
    "regularization-and-penalties": detail({
      idea: "Regularization changes the training objective to prefer solutions with useful properties such as smaller weights, sparsity, smoothness, or constraint compliance.",
      how: "Choose a penalty R(theta), multiply it by strength lambda, add it to the data loss, and tune lambda using validation data or a principled prior interpretation.",
      concepts: [
        concept("L2 regularization", "Penalizes squared weight magnitude and smoothly shrinks parameters.", "R(theta)=||theta||_2^2", "Ridge regression and weight decay."),
        concept("L1 regularization", "Penalizes absolute weight magnitude and can produce exact zeros.", "R(theta)=||theta||_1", "Sparse feature selection."),
        concept("Penalty strength", "Controls fit-versus-preference tradeoff.", "lambda>=0", "Zero gives unregularized training."),
        concept("Soft constraint", "A penalty discourages violation rather than forbidding it outright.", "rho * violation", "Approximate fairness or budget target.")
      ],
      formulas: [formula("Regularized objective", "J_reg(theta)=J_data(theta)+lambda R(theta)", "fit plus complexity penalty"), formula("L2", "R(theta)=sum_j theta_j^2", "quadratic shrinkage"), formula("L1", "R(theta)=sum_j |theta_j|", "sparsity-promoting penalty")],
      caption: "Regularization trades a small amount of data fit for a preferred solution structure.",
      flow: [node("Data loss", "fit observations"), node("Choose preference", "small, sparse, smooth"), node("Add lambda penalty", "balance goals"), node("Validate", "select useful strength")],
      learn: ["Compare L1 and L2 penalties.", "Interpret lambda.", "Connect regularization to priors and soft constraints.", "Tune regularization without test-set leakage."],
      ai: "Regularization controls overfitting, improves stability, encodes structure, and can make models smaller or easier to interpret.",
      pitfalls: ["Penalizing biases or normalization parameters may be undesirable.", "Too much regularization underfits.", "Weight decay and L2 penalty are not identical for every adaptive optimizer."],
      example: "For loss 4 at theta with ||theta||^2=10 and lambda=0.1, regularized objective is 5. A lower-data-loss solution with huge weights may no longer be preferred.",
      question: "Which common penalty is more likely to produce exact zero coefficients?",
      answer: "L1 regularization.",
      resources: [{ label: "Wikipedia: Regularization", url: "https://en.wikipedia.org/wiki/Regularization_(mathematics)" }]
    }),
    "early-stopping": detail({
      idea: "Early stopping ends training when held-out validation performance stops improving, preventing further fitting of training noise and saving computation.",
      how: "Evaluate a fixed validation metric periodically, save the best checkpoint, wait for a patience window without meaningful improvement, then stop and restore the best checkpoint.",
      concepts: [
        concept("Validation metric", "Held-out signal used to judge generalization during training.", "J_val(t)", "Validation loss or task metric."),
        concept("Patience", "Number of evaluations allowed without improvement.", "p", "Avoid stopping on one noisy measurement."),
        concept("Minimum delta", "Smallest change considered a real improvement.", "delta", "Filters insignificant fluctuations."),
        concept("Best checkpoint", "Parameters from the best validation step, not necessarily the final step.", "theta_best", "Restore after stopping.")
      ],
      formulas: [formula("Best step", "t*=argmin_t J_val(theta_t)", "checkpoint with lowest validation loss"), formula("Stop rule", "stop after p checks with improvement < delta", "patience-based criterion"), formula("Generalization gap", "J_val-J_train", "one sign of overfitting")],
      caption: "Training can keep improving its data fit after generalization begins to worsen.",
      flow: [node("Train checkpoint", "update parameters"), node("Evaluate validation", "held-out metric"), node("Save if best", "record theta_best"), node("Stop after patience", "restore best")],
      learn: ["Implement patience and minimum delta.", "Restore the best checkpoint.", "Choose a validation metric aligned with deployment.", "Avoid leakage from repeated test-set use."],
      ai: "Early stopping is a practical regularizer and compute-control mechanism for neural networks and boosting methods.",
      pitfalls: ["The test set must not drive stopping.", "A noisy validation set can stop too early or too late.", "Changing validation evaluation frequency changes the meaning of patience."],
      example: "Validation losses by epoch are [0.9,0.7,0.62,0.63,0.65]. With patience 2, stop after epoch 5 and restore epoch 3, where validation loss was best.",
      question: "Why restore the best checkpoint instead of using the final trained parameters?",
      answer: "The final parameters may already have moved past the point of best validation performance.",
      resources: [{ label: "Wikipedia: Early stopping", url: "https://en.wikipedia.org/wiki/Early_stopping" }]
    }),
    "numerical-stability": detail({
      idea: "Numerical stability keeps an algorithm reliable when computers represent numbers with finite precision. Algebraically equivalent formulas can behave very differently near overflow, underflow, or cancellation.",
      how: "Track numeric ranges, avoid subtracting nearly equal large values, use stable identities such as log-sum-exp, scale data, accumulate carefully, and test with extreme inputs and reduced precision.",
      concepts: [
        concept("Overflow", "A value exceeds the largest representable magnitude.", "exp(large)->infinity", "Exponentiating large logits."),
        concept("Underflow", "A tiny value rounds to zero.", "product of probabilities -> 0", "Long sequence likelihood."),
        concept("Catastrophic cancellation", "Subtracting nearly equal values loses significant digits.", "a-b with a approximately b", "Variance from E[X^2]-E[X]^2."),
        concept("Stable reformulation", "Equivalent expression designed for safer numerical range.", "log-sum-exp", "Subtract maximum logit before exponentiation.")
      ],
      formulas: [formula("Log-sum-exp", "LSE(x)=m+log sum_i exp(x_i-m), m=max_i x_i", "prevents exponential overflow"), formula("Stable softmax", "softmax_i=exp(x_i-m)/sum_j exp(x_j-m)", "same probabilities after shifting logits"), formula("Log products", "log product_i p_i=sum_i log p_i", "avoid probability underflow")],
      caption: "Stable algorithms keep intermediate values in representable ranges without changing the mathematical result.",
      flow: [node("Inspect range", "large, tiny, or close values"), node("Choose stable identity", "shift, log, factor"), node("Compute in suitable precision", "mixed or higher precision"), node("Test extremes", "finite outputs and gradients")],
      learn: ["Recognize overflow, underflow, and cancellation.", "Derive log-sum-exp and stable softmax.", "Use log probabilities.", "Separate mathematical conditioning from algorithmic stability."],
      ai: "Stable computation is essential for softmax, likelihoods, mixed-precision training, normalization, gradient accumulation, and reliable deployment.",
      pitfalls: ["Adding epsilon changes the expression and should reflect scale.", "NaN often propagates far from its original source.", "Higher precision helps but does not replace stable algorithms."],
      example: "For logits [1000,1001], direct exp overflows. Subtract m=1001 to get [-1,0], whose exponentials are safe and produce the same softmax probabilities.",
      question: "Why does subtracting the maximum logit not change softmax?",
      answer: "Multiplying every numerator and denominator by the same exp(-m) factor cancels in the ratio.",
      resources: [{ label: "Wikipedia: Numerical stability", url: "https://en.wikipedia.org/wiki/Numerical_stability" }]
    })
  };

  const expandedDetails = {
    "objectives-losses-and-cost-functions": {
      prerequisites: ["Functions and scalar outputs.", "Supervised-learning predictions and labels.", "Averages and regularization intuition."],
      notationGuide: [{ symbol: "ell_i", latex: "\\ell_i", meaning: "Loss for one example." }, { symbol: "J(theta)", latex: "J(\\theta)", meaning: "Aggregate objective optimized over parameters." }, { symbol: "R(theta)", latex: "R(\\theta)", meaning: "Regularization or penalty term." }, { symbol: "lambda", latex: "\\lambda", meaning: "Weight balancing competing objective terms." }],
      formulaLatex: ["J(\\theta)=\\frac1n\\sum_{i=1}^n\\ell(y_i,f_\\theta(x_i))", "J_{reg}(\\theta)=J(\\theta)+\\lambda R(\\theta)", "\\max_\\theta U(\\theta)\\equiv\\min_\\theta[-U(\\theta)]"],
      derivation: { title: "Build an empirical training objective", steps: ["Define the per-example behavior to reward or error to penalize.", "Compute that loss for each training pair.", "Average losses so objective scale is comparable across dataset sizes.", "Add penalties or constraints for complexity, fairness, latency, or other requirements with carefully chosen units and weights."] },
      workedExamples: [{ title: "Regression objective", setup: "Predict y with f_theta(x) and discourage large weights.", steps: ["Use squared loss (y-f)^2 per example.", "Average over n observations.", "Add lambda||theta||^2."], result: "The objective balances data fit with smooth weight shrinkage." }, { title: "Misaligned metric", setup: "A fraud model minimizes overall error on 1% positive data.", steps: ["Always predicting negative achieves 99% accuracy.", "The objective ignores asymmetric missed-fraud cost.", "Use weighted loss or a constrained operating metric."], result: "Optimization succeeds mathematically but fails operationally when the objective encodes the wrong goal." }],
      exercises: [{ level: "Beginner", question: "What is empirical risk?", answer: "The average per-example loss over an observed dataset." }, { level: "Intermediate", question: "Why can two objective terms require normalization before weighting?", answer: "Different numerical scales can make one dominate regardless of intended importance." }, { level: "Applied", question: "Design an objective for accuracy with a latency budget.", answer: "For example minimize prediction loss subject to latency<=budget, or use loss+lambda*latency penalty after validating the tradeoff." }],
      takeaways: ["An optimizer follows the objective, not unstated intent.", "Loss is often per example; cost or risk aggregates it.", "Surrogates should be checked against deployment outcomes.", "Multi-objective weights encode value judgments and units."]
    },
    "parameters-and-decision-variables": {
      prerequisites: ["Functions with adjustable inputs.", "Model parameters and hyperparameters.", "Sets and constraints."],
      notationGuide: [{ symbol: "theta", latex: "\\theta", meaning: "Decision variable or learned parameter vector." }, { symbol: "C", latex: "\\mathcal C", meaning: "Feasible set of allowed decisions." }, { symbol: "theta*", latex: "\\theta^*", meaning: "An optimal feasible decision." }, { symbol: "lambda", latex: "\\lambda", meaning: "Hyperparameter selected outside the inner optimization." }],
      formulaLatex: ["\\theta^*=\\arg\\min_{\\theta\\in\\mathcal C}J(\\theta)", "\\hat y=f_\\theta(x)", "\\lambda^*=\\arg\\min_\\lambda J_{val}(\\theta^*(\\lambda))"],
      derivation: { title: "Separate an optimization problem's roles", steps: ["List fixed inputs such as training data and environment settings.", "Identify quantities the inner optimizer may change; these are decision variables.", "Specify their domains, shapes, and constraints.", "Place hyperparameter choices in an outer validation process when they alter the inner problem rather than being learned directly."] },
      workedExamples: [{ title: "Linear model roles", setup: "Use y_hat=Xw+b with ridge strength lambda.", steps: ["X and y are fixed training data.", "w and b are inner decision variables.", "lambda controls the objective and is selected by validation."], result: "Parameters and hyperparameters participate in different optimization levels." }, { title: "Probability variable", setup: "Choose allocation p across three actions.", steps: ["Decision vector is p in R^3.", "Require p_k>=0.", "Require sum p_k=1."], result: "The feasible domain is the probability simplex, not all R^3." }],
      exercises: [{ level: "Beginner", question: "In neural-network training, are weights usually fixed inputs or decision variables?", answer: "Decision variables." }, { level: "Intermediate", question: "Why must variable shape be stated?", answer: "It determines valid operations, gradients, and constraints and prevents ambiguous formulations." }, { level: "Applied", question: "When can a threshold be optimized as a decision variable?", answer: "When its operational cost is included and it is selected using appropriate validation data rather than the final test set." }],
      takeaways: ["Decision variables are exactly what the optimizer controls.", "Domains are part of the problem definition.", "Parameters and hyperparameters often belong to inner and outer loops.", "Clear role separation prevents leakage and invalid optimization."]
    },
    "unconstrained-and-constrained-optimization": {
      prerequisites: ["Objectives and decision variables.", "Equalities and inequalities.", "Geometry of feasible sets."],
      notationGuide: [{ symbol: "f(theta)", latex: "f(\\theta)", meaning: "Objective function." }, { symbol: "g_i(theta)<=0", latex: "g_i(\\theta)\\leq0", meaning: "Inequality constraint." }, { symbol: "h_j(theta)=0", latex: "h_j(\\theta)=0", meaning: "Equality constraint." }, { symbol: "C", latex: "\\mathcal C", meaning: "All points satisfying every constraint." }],
      formulaLatex: ["\\min_\\theta f(\\theta)", "\\min_\\theta f(\\theta)\\quad\\text{s.t. }g(\\theta)\\leq0,\\ h(\\theta)=0", "\\min_\\theta f(\\theta)+\\rho\\,\\operatorname{violation}(\\theta)"],
      derivation: { title: "Turn a simple bound into a constrained solution", steps: ["Minimize f(x)=(x-3)^2 without constraints; stationary point is x=3.", "Add requirement x<=1, making feasible set (-infinity,1].", "The unconstrained solution is infeasible.", "The closest feasible point to 3 is boundary x=1, so the constraint is active at optimum."] },
      workedExamples: [{ title: "Probability normalization", setup: "Choose class probabilities minimizing a score.", steps: ["Require each p_k>=0.", "Require sum p_k=1.", "Optimize only over the simplex."], result: "Constraints ensure outputs remain valid probabilities." }, { title: "Penalty versus projection", setup: "Require ||theta||<=R.", steps: ["Penalty method discourages violation in the objective.", "Projection method takes a step then maps back into the ball.", "Penalty may remain slightly infeasible; projection enforces feasibility each step."], result: "Method choice depends on constraint structure and required exactness." }],
      exercises: [{ level: "Beginner", question: "What is a feasible point?", answer: "A decision satisfying every equality and inequality constraint." }, { level: "Intermediate", question: "What is an active inequality?", answer: "One that holds with equality at the candidate solution." }, { level: "Applied", question: "Why may a soft penalty be insufficient for a safety limit?", answer: "Finite penalty weight may still permit violations; consequential limits often need hard feasibility checks or constrained methods." }],
      takeaways: ["Constraints define which solutions are allowed.", "An unconstrained optimum may be infeasible.", "Active constraints shape the solution boundary.", "Penalties, projections, barriers, and Lagrangians enforce constraints differently."]
    },
    "convex-and-non-convex-optimization": {
      prerequisites: ["Functions, gradients, and Hessians.", "Line segments and sets.", "Local versus global optima."],
      notationGuide: [{ symbol: "t", latex: "t\\in[0,1]", meaning: "Mixing position along a line segment." }, { symbol: "convex f", latex: "f(tx+(1-t)y)\\leq tf(x)+(1-t)f(y)", meaning: "Function lies below each chord." }, { symbol: "H>=0", latex: "\\nabla^2f(x)\\succeq0", meaning: "Second-order convexity condition for smooth f." }],
      formulaLatex: ["f(tx+(1-t)y)\\leq tf(x)+(1-t)f(y)", "f(y)\\geq f(x)+\\nabla f(x)^\\top(y-x)", "\\nabla^2f(x)\\succeq0"],
      derivation: { title: "Why a local minimum is global for convex f", steps: ["At a differentiable local minimum x*, gradient is zero.", "Convexity gives f(y)>=f(x*)+grad f(x*)^T(y-x*) for every y.", "The gradient term vanishes.", "Therefore f(y)>=f(x*) everywhere, so x* is global."] },
      workedExamples: [{ title: "Convex quadratic", setup: "Let f(x)=0.5x^TAx-b^Tx with A positive definite.", steps: ["Hessian is A everywhere.", "Positive definiteness gives strict convexity.", "Solve Ax=b for the unique stationary point."], result: "The stationary point is the unique global minimum." }, { title: "Non-convex neural loss", setup: "Hidden-layer parameters can be permuted without changing the network function.", steps: ["Equivalent parameter settings create many minima.", "Saddles and flat regions also arise.", "Local geometry depends on initialization and path."], result: "Non-convex does not mean impossible, but global guarantees weaken." }],
      exercises: [{ level: "Beginner", question: "Is f(x)=x^2 convex?", answer: "Yes; f''(x)=2>=0." }, { level: "Intermediate", question: "Is every stationary point of a convex differentiable function globally minimizing?", answer: "Yes, if it is feasible in the unconstrained domain; zero gradient plus convexity gives global minimality." }, { level: "Applied", question: "Why can overparameterized non-convex models still train well?", answer: "Their landscapes may contain many connected low-loss solutions and optimization biases that avoid the worst regions despite lacking general convexity." }],
      takeaways: ["Convexity is a global shape property.", "Convex local minima are global.", "Positive-semidefinite Hessians characterize smooth convexity on convex domains.", "Non-convex optimization relies more on initialization, heuristics, and empirical validation."]
    },
    "local-minima-global-minima-and-saddle-points": {
      prerequisites: ["Gradients and Hessians.", "Neighborhoods and feasible domains.", "Eigenvalue signs."],
      notationGuide: [{ symbol: "x*", latex: "x^*", meaning: "Candidate optimum." }, { symbol: "grad f=0", latex: "\\nabla f(x^*)=0", meaning: "First-order stationary condition." }, { symbol: "H", latex: "H=\\nabla^2f(x^*)", meaning: "Local curvature matrix." }, { symbol: "saddle", latex: "\\lambda_{min}(H)<0<\\lambda_{max}(H)", meaning: "Curvature has rising and falling directions." }],
      formulaLatex: ["\\nabla f(x^*)=0", "\\nabla^2f(x^*)\\succeq0", "\\lambda_{min}(H)<0<\\lambda_{max}(H)"],
      derivation: { title: "Classify a stationary point with curvature", steps: ["Solve grad f(x*)=0 to locate stationary candidates.", "Compute Hessian at each candidate.", "All positive eigenvalues imply a strict local minimum; all negative imply a strict local maximum.", "Mixed signs imply a saddle; zero eigenvalues require higher-order or neighborhood analysis."] },
      workedExamples: [{ title: "Saddle at the origin", setup: "Let f(x,y)=x^2-y^2.", steps: ["Gradient is (2x,-2y), zero at origin.", "Hessian is diag(2,-2).", "Eigenvalue signs are mixed."], result: "Origin is a saddle: f rises along x and falls along y." }, { title: "Local but not global", setup: "A wavy one-dimensional objective has valleys of different depth.", steps: ["Derivative vanishes at each valley bottom.", "Second derivative can be positive at both.", "Compare objective values globally."], result: "Both are local minima, but only the lowest is global." }],
      exercises: [{ level: "Beginner", question: "Classify x=0 for f(x)=x^2.", answer: "Strict local and global minimum." }, { level: "Intermediate", question: "Can grad f=0 alone prove a minimum?", answer: "No; it can also indicate a maximum, saddle, or flat point." }, { level: "Applied", question: "Why are saddle points common in high-dimensional losses?", answer: "Many curvature directions make mixed positive and negative eigenvalues statistically and structurally common." }],
      takeaways: ["Stationarity is necessary in smooth unconstrained interiors but not sufficient.", "Local and global optimality are different claims.", "Hessian eigenvalues classify nondegenerate stationary points.", "Boundaries and flat directions need constraint-aware or higher-order analysis."]
    },
    "gradient-descent": {
      prerequisites: ["Gradients and local linear approximation.", "Learning rates.", "Smoothness intuition."],
      notationGuide: [{ symbol: "theta_t", latex: "\\theta_t", meaning: "Parameter vector at iteration t." }, { symbol: "eta", latex: "\\eta", meaning: "Step size." }, { symbol: "grad J", latex: "\\nabla J(\\theta_t)", meaning: "Steepest local increase direction." }, { symbol: "L", latex: "L", meaning: "Gradient Lipschitz or smoothness constant." }],
      formulaLatex: ["\\theta_{t+1}=\\theta_t-\\eta\\nabla J(\\theta_t)", "J(\\theta+\\Delta)\\approx J(\\theta)+\\nabla J(\\theta)^\\top\\Delta", "0<\\eta<\\frac2L"],
      derivation: { title: "Choose the steepest local descent direction", steps: ["Linearize objective: J(theta+Delta) about J(theta)+g^TDelta.", "Restrict movement to fixed Euclidean length ||Delta||=r.", "Cauchy-Schwarz makes g^TDelta smallest when Delta points opposite g.", "Set Delta=-eta g, with eta controlling how far to trust the local model."] },
      workedExamples: [{ title: "Quadratic update", setup: "Minimize J(theta)=0.5 theta^2 with eta=0.2 and theta0=5.", steps: ["Gradient equals theta.", "Update theta1=5-0.2*5=4.", "Each step multiplies theta by 0.8."], result: "Parameters converge geometrically toward zero." }, { title: "Overshoot", setup: "Use same objective with eta=2.5.", steps: ["Update multiplier is 1-eta=-1.5.", "Magnitude grows by 1.5 each step.", "Signs alternate."], result: "The method diverges because step exceeds the stable range for this curvature." }],
      exercises: [{ level: "Beginner", question: "Take one step from theta=3 with gradient 4 and eta=0.1.", answer: "theta_new=2.6." }, { level: "Intermediate", question: "Why does feature scaling affect gradient descent?", answer: "Unequal curvature across coordinates creates narrow valleys, forcing small global steps and slow zig-zag progress." }, { level: "Applied", question: "What should be monitored besides training loss?", answer: "Gradient norms, validation metrics, parameter/activation scales, numerical finiteness, and constraints or operational metrics." }],
      takeaways: ["Gradient descent follows negative local slope.", "Step size determines stability and speed.", "Conditioning controls how efficiently one step size serves all directions.", "Convergence guarantees require assumptions that real neural losses may not satisfy globally."]
    },
    "stochastic-gradient-descent": {
      prerequisites: ["Gradient descent.", "Sampling and unbiased estimators.", "Variance and learning-rate schedules."],
      notationGuide: [{ symbol: "g_hat_t", latex: "\\hat g_t", meaning: "Random gradient estimate." }, { symbol: "eta_t", latex: "\\eta_t", meaning: "Possibly changing step size." }, { symbol: "xi_t", latex: "\\xi_t", meaning: "Sample or random mini-batch at iteration t." }, { symbol: "gradient noise", latex: "\\hat g_t-\\nabla J", meaning: "Difference between estimate and full gradient." }],
      formulaLatex: ["\\theta_{t+1}=\\theta_t-\\eta_t\\hat g_t", "\\mathbb E[\\hat g_t\\mid\\theta_t]=\\nabla J(\\theta_t)", "\\mathbb E[\\lVert\\hat g-g\\rVert^2]"],
      derivation: { title: "Show a sampled gradient can be unbiased", steps: ["Write finite objective J=(1/n)sum_i ell_i.", "Sample index I uniformly from 1,...,n.", "Use estimator g_hat=grad ell_I.", "Taking expectation over I averages all example gradients, recovering grad J."] },
      workedExamples: [{ title: "Single-example update", setup: "Two examples have gradients 2 and 6 at current theta.", steps: ["Full gradient average is 4.", "A random SGD step uses either 2 or 6.", "Across uniform draws its expectation is 4."], result: "Each step is noisy but unbiased in this simple setting." }, { title: "Noise near optimum", setup: "Individual example gradients remain nonzero even when their average is zero.", steps: ["Full gradient vanishes.", "Sample gradients still push in different directions.", "Constant learning rate causes a stationary cloud around optimum."], result: "Decay, averaging, or larger batches reduce late-stage fluctuations." }],
      exercises: [{ level: "Beginner", question: "What makes SGD stochastic?", answer: "It uses randomly sampled data or batches to estimate the full gradient." }, { level: "Intermediate", question: "Can a biased gradient estimator still be useful?", answer: "Yes in some methods, but standard unbiased convergence arguments change and bias must be understood." }, { level: "Applied", question: "Why can SGD noise aid non-convex training?", answer: "Noise can help leave sharp saddles or narrow basins and may bias training toward flatter regions, though it is not guaranteed beneficial." }],
      takeaways: ["SGD trades exact gradients for cheaper noisy updates.", "Sampling design determines bias and variance.", "Learning-rate decay balances exploration and convergence.", "Data order, batch composition, and distributed sampling affect the optimization path."]
    },
    "mini-batch-optimization": {
      prerequisites: ["Stochastic gradients.", "Sample averages and variance reduction.", "Hardware parallelism."],
      notationGuide: [{ symbol: "B", latex: "B", meaning: "Mini-batch size." }, { symbol: "mathcal B", latex: "\\mathcal B", meaning: "Set of examples in one batch." }, { symbol: "g_B", latex: "g_{\\mathcal B}", meaning: "Average gradient over the batch." }, { symbol: "epoch", latex: "\\lceil n/B\\rceil", meaning: "Rough number of updates per full data pass." }],
      formulaLatex: ["J_{\\mathcal B}=\\frac1B\\sum_{i\\in\\mathcal B}\\ell_i", "g_{\\mathcal B}=\\frac1B\\sum_{i\\in\\mathcal B}\\nabla\\ell_i", "\\text{steps per epoch}\\approx\\left\\lceil\\frac nB\\right\\rceil"],
      derivation: { title: "Understand the batch-size variance tradeoff", steps: ["Assume independent example gradients with variance sigma_g^2.", "A batch gradient averages B such terms.", "Variance of the average is approximately sigma_g^2/B.", "Larger B reduces noise but costs more computation per update and eventually underuses the benefit of additional parallelism."] },
      workedExamples: [{ title: "Count updates", setup: "Dataset has 10,000 examples and batch size 128.", steps: ["Divide 10,000 by 128 to get 78.125.", "Round up for the final partial batch.", "Each full epoch therefore has 79 updates."], result: "Batch-size changes both gradient noise and updates per epoch." }, { title: "Effective batch under accumulation", setup: "Device fits batch 32 but gradients are accumulated across four micro-batches.", steps: ["Compute four batch-32 gradients without stepping.", "Sum or average them consistently.", "Update once."], result: "Effective batch is 128, though batch-normalization behavior may still use micro-batch statistics." }],
      exercises: [{ level: "Beginner", question: "How many full-size updates fit in 1,024 examples with batch 256?", answer: "Four." }, { level: "Intermediate", question: "Why may doubling B not halve wall-clock training time?", answer: "Hardware saturation, fewer updates, communication, memory traffic, and changed learning dynamics limit scaling." }, { level: "Applied", question: "What can make a mini-batch unrepresentative?", answer: "Sorted data, grouped classes, temporal correlation, duplicates, or distributed sharding can bias or increase gradient noise." }],
      takeaways: ["Mini-batches average stochastic gradients.", "Larger batches reduce variance but reduce update frequency for fixed epochs.", "Batch size is a statistical and systems parameter.", "Learning rate often needs adjustment when effective batch changes."]
    },
    "learning-rates-and-schedules": {
      prerequisites: ["Gradient-based updates.", "Optimization curvature.", "Training steps and epochs."],
      notationGuide: [{ symbol: "eta_t", latex: "\\eta_t", meaning: "Learning rate at step t." }, { symbol: "eta_0", latex: "\\eta_0", meaning: "Initial learning rate." }, { symbol: "gamma", latex: "\\gamma", meaning: "Exponential decay factor." }, { symbol: "T", latex: "T", meaning: "Schedule horizon or cycle length." }],
      formulaLatex: ["\\theta_{t+1}=\\theta_t-\\eta_tg_t", "\\eta_t=\\eta_0\\gamma^t", "\\eta_t=\\eta_{min}+\\tfrac12(\\eta_{max}-\\eta_{min})(1+\\cos(\\pi t/T))"],
      derivation: { title: "Why decay supports convergence", steps: ["Early training benefits from larger steps that traverse broad regions quickly.", "Near a solution, stochastic gradient noise can dominate the small true gradient.", "Reducing eta shrinks noise-driven parameter motion.", "Classical stochastic approximation uses schedules whose steps persist long enough to move but squared steps have finite total noise under assumptions."] },
      workedExamples: [{ title: "Exponential decay", setup: "eta0=0.1, gamma=0.9 per epoch.", steps: ["After one epoch eta=0.09.", "After ten epochs eta=0.1*0.9^10.", "Compute about 0.0349."], result: "The rate falls quickly and may become too small if decay is overly aggressive." }, { title: "Warmup", setup: "A transformer is unstable with a large target rate at initialization.", steps: ["Begin with a small eta.", "Increase gradually over initial steps.", "Then follow decay schedule."], result: "Warmup limits early updates while activations and adaptive moments stabilize." }],
      exercises: [{ level: "Beginner", question: "What usually happens when eta is far too large?", answer: "Loss oscillates, diverges, or becomes non-finite." }, { level: "Intermediate", question: "What is cosine schedule value at t=T ignoring eta_min?", answer: "eta_min because cos(pi)=-1." }, { level: "Applied", question: "Why compare schedules by update count rather than epoch count across batch sizes?", answer: "Batch size changes updates per epoch, so equal epochs may expose optimizers to different numbers of parameter steps." }],
      takeaways: ["Learning rate controls how far each gradient estimate moves parameters.", "Schedules separate early exploration from late refinement.", "Warmup, decay, and restarts serve different purposes.", "Tune schedules jointly with batch size, optimizer, normalization, and training horizon."]
    },
    "momentum-and-adaptive-methods": {
      prerequisites: ["Gradient descent and stochastic gradients.", "Exponential moving averages.", "Coordinate-wise scaling."],
      notationGuide: [{ symbol: "v_t", latex: "v_t", meaning: "Momentum or smoothed gradient state." }, { symbol: "beta", latex: "\\beta\\in[0,1)", meaning: "Memory coefficient." }, { symbol: "s_t", latex: "s_t", meaning: "Moving second-moment estimate." }, { symbol: "epsilon", latex: "\\varepsilon", meaning: "Small denominator stabilizer." }],
      formulaLatex: ["v_t=\\beta v_{t-1}+(1-\\beta)g_t", "\\theta_{t+1}=\\theta_t-\\eta v_t", "\\theta\\leftarrow\\theta-\\eta\\frac{g}{\\sqrt s+\\varepsilon}"],
      derivation: { title: "Interpret momentum as a weighted gradient history", steps: ["Expand v_t recursively into current gradient plus beta times earlier states.", "Continue expansion to obtain weights (1-beta), (1-beta)beta, and so on.", "Consistent gradient directions accumulate while alternating noise partly cancels.", "The update therefore gains speed along persistent directions and smooths oscillation."] },
      workedExamples: [{ title: "Momentum through a valley", setup: "Gradients alternate sign across a narrow direction but point consistently forward along another.", steps: ["Alternating components cancel in the moving average.", "Consistent components accumulate.", "Trajectory zig-zags less."], result: "Momentum can move faster down an elongated valley than plain gradient descent." }, { title: "Adaptive coordinate scaling", setup: "One parameter receives gradients near 100 and another near 0.01.", steps: ["Second moments reflect each coordinate's scale.", "Divide gradients by root second moment.", "Effective step sizes become more comparable."], result: "Adaptive scaling helps heterogeneous gradient magnitudes, though it changes optimization bias." }],
      exercises: [{ level: "Beginner", question: "What does larger beta generally do?", answer: "It lengthens memory and smooths updates more, but responds more slowly to changes." }, { level: "Intermediate", question: "Why does epsilon belong inside an adaptive update denominator?", answer: "It prevents division by zero and limits huge steps when second-moment estimates are tiny." }, { level: "Applied", question: "Why can momentum require learning-rate retuning?", answer: "Accumulated velocity changes effective step magnitude and dynamics compared with plain gradient descent." }],
      takeaways: ["Momentum smooths and accumulates gradient direction.", "Adaptive methods rescale coordinates using gradient history.", "State initialization creates early-transient behavior.", "Faster optimization does not guarantee better generalization."]
    },
    "adam-and-rmsprop": {
      prerequisites: ["Momentum and adaptive scaling.", "Exponential moving averages.", "Elementwise vector operations."],
      notationGuide: [{ symbol: "m_t", latex: "m_t", meaning: "Adam first-moment estimate." }, { symbol: "v_t", latex: "v_t", meaning: "Second raw moment of gradients." }, { symbol: "beta_1,beta_2", latex: "\\beta_1,\\beta_2", meaning: "Decay factors for moment estimates." }, { symbol: "m_hat,v_hat", latex: "\\hat m_t,\\hat v_t", meaning: "Bias-corrected moments." }],
      formulaLatex: ["m_t=\\beta_1m_{t-1}+(1-\\beta_1)g_t,\\quad v_t=\\beta_2v_{t-1}+(1-\\beta_2)g_t^2", "\\hat m_t=\\frac{m_t}{1-\\beta_1^t},\\quad\\hat v_t=\\frac{v_t}{1-\\beta_2^t}", "\\theta\\leftarrow\\theta-\\eta\\frac{\\hat m_t}{\\sqrt{\\hat v_t}+\\varepsilon}"],
      derivation: { title: "Why Adam corrects early bias", steps: ["Initialize moving average m_0=0.", "After one constant gradient g, m_1=(1-beta_1)g, smaller than g.", "More generally the missing mass after t steps is beta_1^t.", "Divide by 1-beta_1^t to remove zero-initialization bias; apply the same reasoning to v_t."] },
      workedExamples: [{ title: "First Adam step", setup: "Use scalar g=2, beta1=0.9, beta2=0.99.", steps: ["m1=0.2 and v1=0.04.", "Bias correction gives m_hat=2 and v_hat=4.", "Ratio is approximately 1 before epsilon."], result: "The first normalized update magnitude is about eta." }, { title: "RMSProp distinction", setup: "RMSProp tracks second moment but not Adam's first-moment state in its basic form.", steps: ["Square gradients and smooth them.", "Divide current gradient by root average.", "Adam additionally smooths numerator and bias-corrects moments."], result: "Both adapt scales, but their state and transient behavior differ." }],
      exercises: [{ level: "Beginner", question: "What do squared gradients in v_t measure?", answer: "Recent gradient magnitude by coordinate." }, { level: "Intermediate", question: "Why is AdamW different from adding L2 gradient directly to Adam?", answer: "AdamW decouples weight decay from adaptive gradient normalization, producing a cleaner multiplicative shrinkage." }, { level: "Applied", question: "What should be logged when Adam training becomes unstable?", answer: "Loss, gradient norms, parameter/update norms, moment scales, learning rate, epsilon effects, clipping, and non-finite values." }],
      takeaways: ["Adam combines momentum with adaptive second moments.", "Bias correction matters early because states start at zero.", "Adam and RMSProp are related but not identical.", "Learning rate, betas, epsilon, and weight decay interact."]
    },
    "line-search": {
      prerequisites: ["Descent directions and gradients.", "One-dimensional functions.", "Smoothness and sufficient decrease."],
      notationGuide: [{ symbol: "d", latex: "d", meaning: "Chosen search direction." }, { symbol: "alpha", latex: "\\alpha>0", meaning: "Step length along d." }, { symbol: "phi(alpha)", latex: "\\phi(\\alpha)", meaning: "Objective restricted to the search line." }, { symbol: "c,rho", latex: "c,\\rho\\in(0,1)", meaning: "Sufficient-decrease and backtracking constants." }],
      formulaLatex: ["\\phi(\\alpha)=f(x+\\alpha d)", "f(x+\\alpha d)\\leq f(x)+c\\alpha\\nabla f(x)^\\top d", "\\alpha_k=\\rho^k\\alpha_0"],
      derivation: { title: "Run backtracking Armijo search", steps: ["Choose descent direction d with gradient dot d<0 and initial alpha_0.", "Test the Armijo sufficient-decrease inequality.", "If it fails, multiply alpha by rho<1.", "Repeat until accepted, then update x+alpha d."] },
      workedExamples: [{ title: "Shrink an unsafe step", setup: "Start alpha=1, rho=0.5; first two tests fail and third passes.", steps: ["Test 1.", "Shrink to 0.5 and test.", "Shrink to 0.25 and accept."], result: "The accepted step length is 0.25." }, { title: "Direction versus step", setup: "Newton direction is promising but too aggressive far from optimum.", steps: ["Compute Newton direction from curvature.", "Use line search rather than taking full step.", "Accept a shorter distance satisfying decrease."], result: "Globalization combines a sophisticated direction with controlled progress." }],
      exercises: [{ level: "Beginner", question: "What scalar function does line search optimize?", answer: "phi(alpha)=f(x+alpha d)." }, { level: "Intermediate", question: "Why must d be a descent direction for standard Armijo search?", answer: "The right-side linear prediction must decrease, requiring grad f dot d<0." }, { level: "Applied", question: "Why is exact line minimization often wasteful?", answer: "Function/gradient evaluations can be expensive, and an approximate sufficient step usually supports convergence." }],
      takeaways: ["Line search separates direction from distance.", "Backtracking is simple and robust for smooth objectives.", "Armijo controls sufficient decrease, not exact minimization.", "Evaluation cost and stochastic noise can make line search difficult in large-scale training."]
    },
    "newton-and-quasi-newton-methods": {
      prerequisites: ["Gradients, Hessians, and Taylor models.", "Linear systems.", "Positive-definite curvature."],
      notationGuide: [{ symbol: "H", latex: "H=\\nabla^2f(x)", meaning: "Hessian curvature matrix." }, { symbol: "d_N", latex: "d_N", meaning: "Newton direction." }, { symbol: "B_k", latex: "B_k", meaning: "Quasi-Newton Hessian approximation." }, { symbol: "s_k,y_k", latex: "s_k,y_k", meaning: "Parameter and gradient differences." }],
      formulaLatex: ["d_N=-H(x)^{-1}\\nabla f(x)", "x_{new}=x+d_N", "B_{k+1}s_k=y_k"],
      derivation: { title: "Derive Newton's direction", steps: ["Build quadratic Taylor model m(d)=f+g^Td+0.5d^THd.", "Differentiate m with respect to d.", "Set g+Hd=0.", "Solve linear system Hd=-g rather than explicitly computing H^-1."] },
      workedExamples: [{ title: "One-step quadratic solution", setup: "Minimize f(x)=0.5 ax^2-bx with a>0.", steps: ["Gradient is ax-b and Hessian a.", "Newton direction is -(ax-b)/a.", "Add it to x."], result: "x_new=b/a, the exact minimizer in one step." }, { title: "BFGS information", setup: "After step s_k, gradient changes by y_k.", steps: ["For a quadratic, y=Hs.", "Enforce B_new s=y.", "Update B while preserving symmetry and positive definiteness under conditions."], result: "BFGS learns curvature from gradients without forming exact Hessians." }],
      exercises: [{ level: "Beginner", question: "For gradient 6 and Hessian 3 in one dimension, what is Newton direction?", answer: "-2." }, { level: "Intermediate", question: "Why can Newton direction fail to descend?", answer: "An indefinite Hessian can point toward negative-curvature stationary behavior rather than a local minimum." }, { level: "Applied", question: "Why is L-BFGS useful for large parameter vectors?", answer: "It stores a limited history of vector pairs instead of a dense n x n curvature matrix." }],
      takeaways: ["Newton minimizes a local quadratic model.", "Solve a linear system; do not form an explicit inverse.", "Quasi-Newton methods infer curvature from successive gradients.", "Damping, trust regions, or line search handle poor curvature far from a solution."]
    },
    "lagrange-multipliers": {
      prerequisites: ["Equality-constrained optimization.", "Gradients and level sets.", "Linear combinations of vectors."],
      notationGuide: [{ symbol: "h(x)=0", latex: "h(x)=0", meaning: "Equality constraint." }, { symbol: "lambda", latex: "\\lambda", meaning: "Lagrange multiplier or shadow value." }, { symbol: "L(x,lambda)", latex: "\\mathcal L(x,\\lambda)", meaning: "Lagrangian combining objective and constraint." }, { symbol: "grad h", latex: "\\nabla h(x)", meaning: "Normal vector to the constraint surface." }],
      formulaLatex: ["\\mathcal L(x,\\lambda)=f(x)+\\lambda h(x)", "\\nabla_x\\mathcal L=0", "h(x)=0"],
      derivation: { title: "Why gradients align at a constrained optimum", steps: ["Feasible infinitesimal directions lie tangent to h(x)=0 and are orthogonal to grad h.", "At a constrained optimum, directional derivative of f along every feasible tangent is zero.", "Therefore grad f is also normal to the surface.", "With one regular constraint, grad f=-lambda grad h, equivalent to stationarity of the Lagrangian."] },
      workedExamples: [{ title: "Closest point on a line", setup: "Minimize x^2+y^2 subject to x+y=1.", steps: ["L=x^2+y^2+lambda(x+y-1).", "Stationarity gives 2x+lambda=0 and 2y+lambda=0, so x=y.", "Constraint gives 2x=1."], result: "Optimum is (1/2,1/2)." }, { title: "Shadow price", setup: "Constraint h(x)=b is relaxed slightly.", steps: ["Solve for optimal value as a function of b.", "Multiplier measures local sensitivity under sign convention.", "Large magnitude means the resource bound strongly affects objective."], result: "Lagrange multipliers can quantify marginal value of constraint relaxation." }],
      exercises: [{ level: "Beginner", question: "What equations are solved for one equality constraint?", answer: "Stationarity grad_x L=0 together with feasibility h(x)=0." }, { level: "Intermediate", question: "Why can the method miss points where grad h=0?", answer: "Regularity fails; gradient-alignment reasoning no longer characterizes all constrained extrema." }, { level: "Applied", question: "Where does a normalization multiplier appear in probability optimization?", answer: "When optimizing over probabilities subject to sum p_k=1, a multiplier enforces total mass." }],
      takeaways: ["Equality constraints restrict feasible directions.", "At regular optima, objective gradient lies in the constraint-normal span.", "The Lagrangian turns geometry into equations.", "Multipliers often have sensitivity interpretations."]
    },
    "kkt-conditions": {
      prerequisites: ["Lagrange multipliers.", "Inequality constraints.", "Convexity and constraint qualifications."],
      notationGuide: [{ symbol: "g_i(x)<=0", latex: "g_i(x)\\leq0", meaning: "Inequality constraint." }, { symbol: "lambda_i>=0", latex: "\\lambda_i\\geq0", meaning: "Dual multiplier for inequality i." }, { symbol: "nu_j", latex: "\\nu_j", meaning: "Unrestricted equality multiplier." }, { symbol: "lambda_i g_i=0", latex: "\\lambda_i g_i(x)=0", meaning: "Complementary slackness." }],
      formulaLatex: ["\\mathcal L=f+\\sum_i\\lambda_i g_i+\\sum_j\\nu_j h_j", "\\lambda_i g_i(x)=0", "\\text{primal feasibility + dual feasibility + stationarity + complementary slackness}"],
      derivation: { title: "Interpret complementary slackness", steps: ["If constraint g_i(x)<0 has slack, it does not locally block motion.", "Its multiplier must be zero so it exerts no stationarity force.", "If multiplier lambda_i>0, product lambda_i g_i=0 forces g_i(x)=0.", "Thus only active inequalities can have positive shadow prices."] },
      workedExamples: [{ title: "Bounded scalar minimum", setup: "Minimize (x-3)^2 subject to x<=1, written g=x-1<=0.", steps: ["Unconstrained optimum 3 is infeasible.", "Feasible optimum is x=1.", "Stationarity 2(x-3)+lambda=0 gives lambda=4."], result: "Constraint is active and multiplier positive, satisfying KKT." }, { title: "Inactive bound", setup: "Minimize x^2 subject to x<=1.", steps: ["Unconstrained optimum x=0 is feasible with slack.", "Set lambda=0.", "Stationarity 2x+lambda=0 holds."], result: "Inactive constraint has zero multiplier." }],
      exercises: [{ level: "Beginner", question: "List the four KKT condition groups.", answer: "Primal feasibility, dual feasibility, stationarity, and complementary slackness." }, { level: "Intermediate", question: "Can an active constraint have zero multiplier?", answer: "Yes; active does not always imply influential, especially in degenerate cases." }, { level: "Applied", question: "When are KKT conditions sufficient for global optimality?", answer: "For convex differentiable problems with suitable constraint structure and regularity, KKT solutions are globally optimal." }],
      takeaways: ["KKT extends Lagrange conditions to inequalities.", "Complementary slackness links activity and multiplier force.", "Constraint qualifications matter for necessity.", "Convexity can turn KKT from candidate conditions into global certificates."]
    },
    "regularization-and-penalties": {
      prerequisites: ["Empirical objectives.", "Norms and model complexity.", "Bias-variance tradeoff."],
      notationGuide: [{ symbol: "J_data", latex: "J_{data}", meaning: "Data-fit objective." }, { symbol: "R(theta)", latex: "R(\\theta)", meaning: "Regularization function." }, { symbol: "lambda", latex: "\\lambda\\geq0", meaning: "Regularization strength." }, { symbol: "weight decay", latex: "\\theta\\leftarrow(1-\\eta\\lambda)\\theta", meaning: "Multiplicative parameter shrinkage." }],
      formulaLatex: ["J_{reg}(\\theta)=J_{data}(\\theta)+\\lambda R(\\theta)", "R_2(\\theta)=\\sum_j\\theta_j^2", "R_1(\\theta)=\\sum_j|\\theta_j|"],
      derivation: { title: "Connect L2 penalty to shrinkage", steps: ["Use objective J_data+lambda/2 ||theta||^2.", "Its gradient is grad J_data+lambda theta.", "A gradient step subtracts eta grad J_data and eta lambda theta.", "Regroup the parameter term as (1-eta lambda)theta before the data-gradient update."] },
      workedExamples: [{ title: "Ridge stabilization", setup: "Regression features are strongly correlated.", steps: ["Unregularized coefficients vary greatly across samples.", "Add lambda||w||^2.", "Normal matrix gains lambda I, protecting weak directions."], result: "Variance and conditioning improve at the cost of shrinkage bias." }, { title: "L1 sparsity", setup: "Many features may be irrelevant.", steps: ["L1 penalty has a corner at zero.", "Soft-threshold-like updates can set coefficients exactly to zero.", "Selected set depends on scaling and correlated alternatives."], result: "L1 can produce sparse models but is not a causal feature selector." }],
      exercises: [{ level: "Beginner", question: "What happens at lambda=0?", answer: "The regularized objective reduces to the data objective." }, { level: "Intermediate", question: "Why standardize features before L1/L2 regression?", answer: "Otherwise the same coefficient magnitude represents different predictor scales, creating uneven penalties." }, { level: "Applied", question: "Why should regularization be selected without final test data?", answer: "Using test performance to tune lambda leaks evaluation information and biases the reported generalization estimate." }],
      takeaways: ["Regularization encodes preferences beyond training fit.", "L2 shrinks smoothly; L1 can create exact zeros.", "Lambda controls bias, variance, and conditioning.", "Penalties, priors, and decoupled weight decay are related but not always identical under adaptive optimizers."]
    },
    "early-stopping": {
      prerequisites: ["Training and validation splits.", "Overfitting and generalization.", "Iterative optimization checkpoints."],
      notationGuide: [{ symbol: "J_train(t)", latex: "J_{train}(t)", meaning: "Training metric at step or epoch t." }, { symbol: "J_val(t)", latex: "J_{val}(t)", meaning: "Validation metric used for stopping." }, { symbol: "patience p", latex: "p", meaning: "Checks allowed without sufficient improvement." }, { symbol: "delta", latex: "\\delta", meaning: "Minimum meaningful improvement." }],
      formulaLatex: ["t^*=\\arg\\min_t J_{val}(\\theta_t)", "\\text{stop after }p\\text{ checks with improvement}<\\delta", "\\text{generalization gap}=J_{val}-J_{train}"],
      derivation: { title: "Treat training time as a model choice", steps: ["Every checkpoint theta_t defines a different fitted model.", "Evaluate checkpoints on validation data unavailable to gradient updates.", "Track the best validation objective rather than only the latest one.", "Stop after patience and restore the best checkpoint, making t* a validation-selected complexity level."] },
      workedExamples: [{ title: "Restore best checkpoint", setup: "Validation losses by epoch are 0.50,0.42,0.39,0.40,0.43 with patience 2.", steps: ["Best value 0.39 occurs at epoch 3.", "Epochs 4 and 5 do not improve.", "Stop and restore epoch 3."], result: "Final model is not the last trained checkpoint." }, { title: "Noisy validation", setup: "Small validation set makes metric jump each epoch.", steps: ["Single-step decreases may be noise.", "Use patience and minimum delta.", "Consider confidence, smoothing for display, or repeated validation only without contaminating selection."], result: "Stopping policy should reflect metric variance and evaluation frequency." }],
      exercises: [{ level: "Beginner", question: "Which split should drive early stopping?", answer: "Validation, not training or final test data." }, { level: "Intermediate", question: "Why can frequent validation checks increase selection bias?", answer: "More checkpoint comparisons create more opportunities to choose a lucky validation fluctuation." }, { level: "Applied", question: "How does early stopping act like regularization?", answer: "It limits how far optimization fits increasingly fine training-data patterns, reducing effective model complexity." }],
      takeaways: ["Early stopping selects a checkpoint by validation performance.", "Always save and restore the best checkpoint.", "Patience and delta manage noise but are hyperparameters.", "The final test set must remain untouched by stopping decisions."]
    },
    "numerical-stability": {
      prerequisites: ["Floating-point representation.", "Exponentials and logarithms.", "Softmax and probability products."],
      notationGuide: [{ symbol: "m=max x_i", latex: "m=\\max_i x_i", meaning: "Shift used in log-sum-exp and softmax." }, { symbol: "LSE", latex: "\\operatorname{LSE}(x)", meaning: "Log of a sum of exponentials." }, { symbol: "epsilon_machine", latex: "\\varepsilon_{mach}", meaning: "Relative floating-point precision scale." }, { symbol: "NaN/Inf", latex: "\\mathrm{NaN},\\infty", meaning: "Non-finite values signaling invalid or overflowed arithmetic." }],
      formulaLatex: ["\\operatorname{LSE}(x)=m+\\log\\sum_i e^{x_i-m},\\quad m=\\max_i x_i", "\\operatorname{softmax}_i(x)=\\frac{e^{x_i-m}}{\\sum_je^{x_j-m}}", "\\log\\prod_ip_i=\\sum_i\\log p_i"],
      derivation: { title: "Why max-shifted softmax is equivalent", steps: ["Multiply every exponential e^x_i by common factor e^-m.", "Numerator becomes e^(x_i-m).", "Denominator receives the same common factor in every term.", "The factor cancels in the ratio, while all shifted exponents are <=0 and avoid positive overflow."] },
      workedExamples: [{ title: "Stable softmax", setup: "Logits are [1000,1001].", steps: ["Direct exponentials overflow typical floating point.", "Subtract maximum 1001 to get [-1,0].", "Exponentials are [e^-1,1] and normalize safely."], result: "Probabilities are unchanged mathematically and finite numerically." }, { title: "Avoid probability underflow", setup: "Sequence likelihood multiplies 1,000 probabilities near 0.01.", steps: ["Raw product is below representable range.", "Take logs and add about 1,000 log(0.01).", "Compare models in log space."], result: "Log likelihood stays finite and preserves ordering." }],
      exercises: [{ level: "Beginner", question: "Why subtract the maximum rather than an arbitrary huge number?", answer: "It guarantees the largest shifted logit is zero and all others nonpositive without needlessly making every exponential underflow." }, { level: "Intermediate", question: "What is catastrophic cancellation?", answer: "Loss of significant digits when subtracting nearly equal floating-point numbers." }, { level: "Applied", question: "What should a mixed-precision training stability checklist include?", answer: "Loss scaling, finite-value checks, stable kernels, accumulation precision, gradient norms/clipping, and tests on extreme inputs." }],
      takeaways: ["Equivalent formulas can have very different floating-point behavior.", "Use log space for products and max shifts for exponentials.", "Conditioning and algorithmic stability are distinct.", "Test extreme ranges and trace the first non-finite operation rather than masking it blindly."]
    }
  };

  const topics = window.mathematicalFoundationTopics || [];
  topics.forEach((topic) => {
    if (details[topic.id]) {
      Object.assign(topic, details[topic.id]);
    }
    if (expandedDetails[topic.id]) {
      const expansion = expandedDetails[topic.id];
      Object.assign(topic, expansion);
      if (Array.isArray(expansion.formulaLatex) && Array.isArray(topic.formulas)) {
        topic.formulas.forEach((item, index) => {
          item.latex = expansion.formulaLatex[index] || "";
        });
      }
    }
  });
})();
