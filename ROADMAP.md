# AI Learning Roadmap

This roadmap tracks the learning process for artificial intelligence from fundamentals to applied systems.

## Phase 1: Foundations

- Programming fluency with Python.
- Linear algebra, probability, statistics, and calculus essentials.
- Data handling with notebooks, CSV files, APIs, and visualization.
- Problem framing: inputs, outputs, constraints, metrics, and baselines.

## Phase 2: Programming And Systems Foundations

- Python fluency, NumPy-style vectorization, PyTorch or JAX, and tensor programming.
- Data structures, algorithms, computational complexity, Git, Linux, shell scripting, SQL, APIs, and Docker.
- CPU versus GPU architecture, memory hierarchy, parallel computing, profiling, testing, and reproducibility.
- Implementation details: broadcasting, shapes, strides, batching, sparse computation, stable log-sum-exp, mixed precision, and quantization.

## Phase 3: Classical Artificial Intelligence

- Search algorithms: breadth-first, depth-first, uniform-cost, Dijkstra's algorithm, bidirectional search, A*, beam search, branch and bound, hill climbing, simulated annealing, tabu search, and local beam search.
- A* evaluation with `f(n) = g(n) + h(n)`, where `g(n)` is path cost so far and `h(n)` estimates remaining cost.
- Heuristics: admissible heuristics, consistent heuristics, completeness, optimality, and duplicate-state detection.
- Adversarial search and games: minimax, alpha-beta pruning, negamax, expectimax, Monte Carlo Tree Search, UCT, counterfactual regret minimization, and self-play.
- Constraint satisfaction and satisfiability: backtracking, forward checking, constraint propagation, AC-3, MRV, DPLL, CDCL, WalkSAT, integer programming, and mixed-integer programming.
- Logic and symbolic reasoning: propositional logic, first-order predicate logic, quantifiers, unification, resolution, chaining, Horn clauses, knowledge bases, ontologies, theorem proving, deduction, induction, abduction, analogy, and counterfactual reasoning.
- Planning: state-space planning, STRIPS, PDDL, forward and backward planning, partial-order planning, Graphplan, hierarchical task networks, contingent planning, planning under uncertainty, temporal planning, multi-agent planning, and receding-horizon planning.
- State-space representation, time complexity, memory complexity, transposition tables, and planning mechanisms used by modern agents.

## Phase 4: Probabilistic AI

- Probabilistic graphical models: Bayesian networks, Markov random fields, factor graphs, conditional random fields, conditional independence, d-separation, exact inference, and approximate inference.
- Inference algorithms: variable elimination, sum-product, max-product, belief propagation, junction trees, expectation-maximization, variational inference, Gibbs sampling, Metropolis-Hastings, Hamiltonian Monte Carlo, and sequential Monte Carlo.
- Sequential models and state estimation: Markov chains, hidden Markov models, forward-backward, Viterbi decoding, Kalman filters, particle filters, and dynamic Bayesian networks.
- Core formulas: HMM joint distributions and Kalman prediction updates for state mean and covariance.

## Phase 5: Classical Machine Learning

- Supervised learning: regression, classification, trees, ensembles, support vector machines, kernel methods, and probability calibration.
- Regression: ordinary least squares, polynomial regression, ridge, lasso, elastic net, generalized linear models, Poisson regression, quantile regression, robust regression, and Gaussian-process regression.
- Classification: logistic regression, multinomial logistic regression, perceptron, k-nearest neighbours, Naive Bayes, discriminant analysis, decision trees, random forests, AdaBoost, gradient boosting, XGBoost, LightGBM, and CatBoost.
- Core formulas: linear regression, mean squared error, ridge objective, sigmoid, softmax, binary cross-entropy, multiclass cross-entropy, and SVM objective.
- Unsupervised learning: k-means, k-medoids, Gaussian mixture models, expectation-maximization, hierarchical clustering, DBSCAN, HDBSCAN, OPTICS, spectral clustering, PCA, kernel PCA, ICA, NMF, random projections, MDS, Isomap, LLE, t-SNE, UMAP, autoencoders, topic modelling, matrix factorization, collaborative filtering, association rules, and anomaly detection.
- Model evaluation: train, validation and test splits, cross-validation, stratified sampling, data leakage, overfitting, underfitting, regularization, learning curves, hyperparameter optimization, precision, recall, F1, accuracy, balanced accuracy, specificity, ROC-AUC, PR-AUC, log loss, Brier score, expected calibration error, Matthews correlation coefficient, confusion matrices, cost-sensitive evaluation, regression metrics, and ranking or retrieval metrics.
- Feature engineering and data leakage prevention.

## Phase 6: Deep Learning

- Neural network fundamentals: layers, activations, loss functions, backpropagation, and optimization.
- Training workflows: batching, regularization, learning rates, checkpoints, and experiment tracking.
- Computer vision basics with convolutional networks.
- Sequence modeling and attention.

## Phase 7: Generative AI

- Transformers, tokenization, embeddings, and language model behavior.
- Prompt design, structured outputs, tool use, and retrieval-augmented generation.
- Evaluation for generated outputs: correctness, groundedness, consistency, and usefulness.
- Practical applications: assistants, summarizers, classifiers, search, and workflow automation.

## Phase 8: AI Systems

- Data pipelines, model serving, monitoring, and feedback loops.
- Agent design: planning, tool calling, memory, guardrails, and task decomposition.
- Safety and reliability: hallucination control, privacy, abuse prevention, and human review.
- Product thinking: user goals, interaction design, latency, cost, and measurable outcomes.

## Phase 9: Portfolio

- Build small focused projects for each phase.
- Write short project notes explaining the problem, approach, tradeoffs, and results.
- Keep reusable code, datasets, prompts, evaluations, and screenshots organized.
- Finish with one capstone AI product or research-style project.

## Suggested Project Folders

- `notes/`: concept notes and learning summaries.
- `experiments/`: notebooks, scripts, and prototypes.
- `projects/`: polished portfolio projects.
- `resources/`: papers, courses, datasets, and references.
- `reflections/`: progress logs and decision notes.
