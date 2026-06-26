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

## Phase 6: Deep Learning Foundations

- Neural networks: perceptrons, multilayer perceptrons, computational graphs, backpropagation, activation functions, weight initialization, normalization, residual connections, regularization, universal approximation, and representation learning.
- Activations and stabilization: ReLU, GELU, SiLU, layer normalization, batch normalization, RMSNorm, dropout, weight decay, early stopping, data augmentation, gradient clipping, label smoothing, and knowledge distillation.
- Convolutional neural networks: discrete convolution, cross-correlation, padding, stride, dilation, pooling, receptive fields, translation equivariance, depthwise and separable convolutions, residual networks, encoder-decoder networks, U-Net architectures, LeNet, AlexNet, VGG, Inception, ResNet, DenseNet, EfficientNet, and MobileNet.
- Recurrent and sequence models: RNNs, backpropagation through time, vanishing and exploding gradients, LSTM, GRU, bidirectional RNNs, sequence-to-sequence models, encoder-decoder models, attention, and connectionist temporal classification.

## Phase 7: Transformers And Foundation Models

- Transformer fundamentals: token embeddings, positional encoding, sinusoidal positions, RoPE, ALiBi, queries, keys, values, self-attention, cross-attention, multi-head attention, masked causal attention, feed-forward networks, residual streams, pre-norm, post-norm, and encoder-only, decoder-only, and encoder-decoder models.
- Language-model math: scaled dot-product attention, multi-head attention, autoregressive factorization, and perplexity.
- Tokenization: character, word, byte-pair encoding, WordPiece, unigram language-model tokenization, byte-level tokenization, vocabulary construction, Unicode normalization, special tokens, token fertility, multilingual tokenization, and tokenizer security.
- Efficient and alternative attention: multi-query attention, grouped-query attention, sparse attention, sliding-window attention, block-sparse attention, linear attention, local-global attention, FlashAttention, paged attention, KV-cache management, attention sinks, long-context methods, and context parallelism.
- Pretraining: causal language modelling, masked language modelling, prefix language modelling, span corruption, denoising objectives, next-sentence and sentence-order objectives, data mixtures, filtering, deduplication, contamination, curriculum ordering, synthetic data, scaling laws, compute-optimal training, and checkpoint recovery.
- Post-training: continued pretraining, domain adaptation, supervised fine-tuning, instruction tuning, rejection-sampling fine-tuning, reward modelling, preference modelling, RLHF, RLAIF, PPO-based post-training, DPO, IPO, KTO, ORPO, GRPO, reinforcement learning with verifiable rewards, process reward models, outcome reward models, constitutional approaches, distillation, and online versus offline preference learning.
- Parameter-efficient adaptation and inference: adapters, LoRA, QLoRA, prefix tuning, prompt tuning, P-tuning, low-rank and sparse updates, partial fine-tuning, quantization-aware adaptation, greedy decoding, beam search, temperature sampling, top-k, top-p, typical sampling, contrastive decoding, constrained decoding, speculative decoding, best-of-N, reranking, self-consistency, and verifier-guided search.

## Phase 8: Retrieval, Search And RAG

- Classical information retrieval: inverted indexes, term frequency, inverse document frequency, TF-IDF, BM25, Boolean retrieval, tokenization, stemming, fielded search, query expansion, and learning to rank.
- Neural retrieval: embedding models, bi-encoders, cross-encoders, late-interaction models, dense passage retrieval, contrastive retriever training, hard-negative mining, reranking, hybrid sparse-dense retrieval, reciprocal-rank fusion, metadata filtering, and multivector retrieval.
- Approximate nearest-neighbour search: locality-sensitive hashing, product quantization, inverted file indexes, hierarchical navigable small worlds, and ScaNN-style partitioning and scoring.
- RAG architecture: ingestion, parsing, chunking, metadata extraction, embedding, indexing, query rewriting, retrieval, reranking, context packing, generation, citation or provenance generation, faithfulness evaluation, and cache or index refresh.
- RAG patterns: naive RAG, hybrid RAG, multi-query retrieval, query decomposition, parent-child retrieval, Graph RAG, agentic retrieval, iterative retrieval, corrective RAG, retrieval routing, context compression, and lost-in-the-middle effects.

## Phase 9: AI Systems

- Data pipelines, model serving, monitoring, and feedback loops.
- Agent design: planning, tool calling, memory, guardrails, and task decomposition.
- Safety and reliability: hallucination control, privacy, abuse prevention, and human review.
- Product thinking: user goals, interaction design, latency, cost, and measurable outcomes.

## Phase 10: Portfolio

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
