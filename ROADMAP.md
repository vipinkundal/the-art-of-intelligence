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

## Phase 9: Reasoning Models And Inference-Time Computation

- Reasoning methods: chain-of-thought prompting, scratchpad computation, self-consistency, least-to-most prompting, decomposition, Tree of Thoughts, Graph of Thoughts, beam search over reasoning traces, best-of-N sampling, and majority voting.
- Supervision and verification: process supervision, outcome supervision, step-level verification, program-aided reasoning, tool-assisted reasoning, code execution, search over latent or textual reasoning, test-time adaptation, adaptive computation, and inference-time scaling.
- Reference systems: DeepSeek-R1 as an example for reinforcement-learning-driven reasoning behaviour and the role of verification, reflection, and post-training.
- Critical distinctions: fluency is not reasoning, long output is not necessarily better reasoning, self-explanation is not proof of internal correctness, benchmark accuracy does not guarantee robustness, and verifiers can be as important as generators.

## Phase 10: Agents And Tool-Using Systems

- Agent patterns: ReAct, planner-executor, router-specialist, generate-critique-revise, generate-rank-verify, reflection loops, state-machine agents, workflow graphs, hierarchical agents, multi-agent debate, blackboard architectures, event-driven agents, human-in-the-loop systems, long-term and episodic memory, tool routing, structured output, and recovery or retry policies.
- Tool-use foundations: reasoning traces with actions and observations, self-supervised tool use, tool schemas, tool-result validation, and structured integration with external systems.
- Production concerns: idempotent tools, permission boundaries, sandboxing, timeouts, retries and backoff, state persistence, durable execution, context management, trace logging, budget limits, human approval points, transaction management, rollback, and compensation.
- Agent security: prompt injection, indirect prompt injection, exfiltration attacks, confused-deputy problems, permission design, and validation before acting on tool outputs.
- Integration layer: Model Context Protocol as an engineering standard for connecting AI applications to tools, data sources, and external systems.

## Phase 11: Representation Learning And Self-Supervision

- Word representations: distributed word representations, Word2vec, skip-gram, continuous bag of words, negative sampling, GloVe, and FastText.
- Metric and contrastive learning: metric learning, Siamese networks, triplet loss, contrastive learning, InfoNCE, SimCLR, MoCo, and CLIP.
- Self-supervised architectures: BYOL, DINO, masked autoencoders, masked language modelling, predictive coding, and joint-embedding predictive architectures.
- Core objectives: InfoNCE for contrastive classification and triplet loss for margin-based metric learning.

## Phase 12: Generative Modelling

- Autoregressive models: autoregressive language models, PixelRNN, PixelCNN, WaveNet, teacher forcing, exposure bias, causal masking, and sequence likelihood.
- Autoencoders and VAEs: autoencoders, denoising autoencoders, sparse autoencoders, contractive autoencoders, variational autoencoders, beta-VAE, vector-quantized VAE, latent-variable models, the ELBO, and reparameterization.
- GANs: GAN, conditional GAN, DCGAN, Wasserstein GAN, gradient penalty, StyleGAN, CycleGAN, mode collapse, and training instability.
- Normalizing flows: change-of-variables formula, coupling layers, NICE, RealNVP, Glow, autoregressive flows, and continuous normalizing flows.
- Diffusion and score models: denoising diffusion probabilistic models, noise schedules, variance-preserving and variance-exploding diffusion, score matching, denoising score matching, score-based SDEs, classifier guidance, classifier-free guidance, latent diffusion, diffusion transformers, consistency models, distillation, fast sampling, and diffusion language models.
- Flow matching: probability paths, conditional flow matching, rectified flow, neural ordinary differential equations, optimal-transport paths, ODE solvers, and distillation to fewer steps.

## Phase 13: State-Space Models And Alternative Sequence Architectures

- State-space foundations: linear dynamical systems, state-space models, structured state spaces, and the basic hidden-state update and output projection.
- Modern SSMs: S4, Mamba, selective state-space models, and transformer-SSM hybrids.
- Alternative sequence architectures: gated convolutions, Hyena-style long convolutions, and retention mechanisms.
- Context: learn these after transformers as efficient long-sequence architectures and attention alternatives, not as replacements for the transformer fundamentals.

## Phase 14: Mixture-Of-Experts Models

- Sparse MoE foundations: sparse mixture-of-experts, expert routing, top-k gating, and the generic MoE layer.
- Scaling mechanics: load balancing, expert capacity, expert parallelism, shared experts, fine-grained experts, and expert specialization.
- Training and serving risks: router instability, auxiliary routing loss, communication overhead, and load-balancing challenges.
- Core intuition: MoE models grow total parameter count without activating every parameter for every token.

## Phase 15: Computer Vision

- Classical vision: image formation, colour spaces, histograms, convolution and filtering, Gaussian blur, median filtering, edge detection, Canny detector, Hough transform, morphological operations, Fourier transforms, wavelets, image pyramids, Harris corners, SIFT, SURF, ORB, HOG, RANSAC, optical flow, epipolar geometry, camera calibration, homographies, stereo vision, and structure from motion.
- Deep vision tasks: image classification, object detection, semantic segmentation, instance segmentation, panoptic segmentation, keypoint detection, pose estimation, tracking, depth estimation, optical flow, image restoration, super-resolution, and image generation.
- Important deep vision families: R-CNN, Fast R-CNN, Faster R-CNN, YOLO, SSD, RetinaNet, DETR, FCN, U-Net, Mask R-CNN, Vision Transformer, Swin Transformer, segment-anything-style models, and masked autoencoders.
- Three-dimensional vision and generation: point clouds, voxel methods, meshes, signed distance functions, neural radiance fields, 3D Gaussian splatting, novel-view synthesis, multiview geometry, neural rendering, 3D reconstruction, text-to-3D, video generation, and world simulation.

## Phase 16: Speech, Audio And Time-Series AI

- Signal processing foundations: sampling theory, Fourier transform, fast Fourier transform, short-time Fourier transform, spectrograms, Mel scale, MFCCs, digital filtering, and autocorrelation.
- Time-series modelling: time-series decomposition, AR, MA, ARIMA, exponential smoothing, state-space forecasting, temporal CNNs, recurrent forecasting, and transformer forecasting.
- Speech architectures: HMM-GMM speech recognition, connectionist temporal classification, RNN Transducer, attention-based encoder-decoder, Conformer, and self-supervised speech representation.
- Audio systems: neural vocoders, WaveNet, diffusion and flow-based audio generation, speaker recognition, voice activity detection, and source separation.

## Phase 17: Multimodal AI

- Multimodal foundations: contrastive vision-language learning, image-text alignment, vision encoders, projection layers, cross-attention fusion, and early, intermediate, and late fusion.
- Multimodal interfaces: multimodal tokenization, image and video instruction tuning, visual question answering, image captioning, document understanding, speech-language models, and audio-language models.
- Generation and retrieval: text-to-image generation, text-to-video generation, multimodal retrieval, vision-language-action models, and multimodal agents.
- Design questions: how modalities are tokenized, where they are fused, whether encoders are frozen or trained jointly, how temporal information is represented, how grounding and hallucination are evaluated, and whether words connect to identifiable regions, sounds, or actions.

## Phase 18: Reinforcement Learning

- Foundations: multi-armed bandits, Markov decision processes, partially observable MDPs, states, actions, rewards, transitions, policies, returns, discounting, value functions, advantage functions, Bellman equations, and exploration versus exploitation.
- Bandits: epsilon-greedy, upper-confidence bound, Thompson sampling, contextual bandits, Bayesian bandits, and regret analysis.
- Tabular RL: dynamic programming, policy evaluation, policy iteration, value iteration, Monte Carlo prediction and control, temporal-difference learning, TD(0), TD(lambda), SARSA, Q-learning, and eligibility traces.
- Deep RL: DQN, Double DQN, Dueling DQN, prioritized replay, distributional RL, Rainbow, REINFORCE, natural policy gradient, TRPO, PPO, A2C, A3C, DDPG, TD3, and SAC.
- Advanced RL: model-based RL, Dyna, learned world models, model-predictive control, offline RL, Conservative Q-learning, Implicit Q-learning, advantage-weighted actor-critic, imitation learning, behaviour cloning, DAgger, inverse RL, GAIL, hierarchical RL, options, meta-RL, multi-agent RL, QMIX, MADDPG, self-play, curriculum learning, safe RL, and constrained MDPs.

## Phase 19: Portfolio

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
