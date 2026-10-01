// Authored source: generation must not overwrite these reviewed explanations.
import { math, source, reviewed } from "./lesson-helpers.mjs";
import { linearAlgebraLessons } from "./linear-algebra.mjs";
import { distributionLessons } from "./distributions.mjs";
import { probabilityFoundationLessons } from "./probability-foundations.mjs";
import { inferenceLessons } from "./statistical-inference.mjs";
import { optimizationLessons } from "./optimization.mjs";
import { trainingLessons } from "./training-foundations.mjs";
import { calculusLessons } from "./calculus.mjs";
import { calculusApplicationLessons } from "./calculus-applications.mjs";
import { informationLessons } from "./information-theory.mjs";
import { samplingLessons } from "./sampling-processes.mjs";
import { mcmcLessons } from "./mcmc.mjs";
import { hiddenSequenceLessons } from "./hidden-sequences.mjs";
import { kalmanLessons } from "./kalman-models.mjs";
import { latentInferenceLessons } from "./latent-inference.mjs";
import { graphicalFoundationLessons } from "./graphical-foundations.mjs";
import { factorInferenceLessons } from "./factor-inference.mjs";
import { messagePassingLessons } from "./message-passing.mjs";
import { structuredLessons } from "./structured-models.mjs";
import { particleLessons } from "./particle-methods.mjs";
import { predictiveReliabilityLessons } from "./predictive-reliability.mjs";
import { dataQualityLessons } from "./data-quality.mjs";
import { optimizationDiagnosticLessons } from "./optimization-diagnostics.mjs";
import { discreteFoundationLessons } from "./discrete-foundations.mjs";
import { graphStructureLessons } from "./graph-structures.mjs";
import { proofTechniqueLessons } from "./proof-techniques.mjs";
import { complexityFoundationLessons } from "./complexity-foundations.mjs";
import { computationLessons } from "./computation-models.mjs";
import { algorithmStrategyLessons } from "./algorithm-strategies.mjs";
import { sectionOverviewLessons } from "./section-overviews.mjs";
import { foundationOverviewLessons } from "./foundation-overviews.mjs";
import { searchStrategyLessons } from "./search-strategies.mjs";
import { searchHeuristicLessons } from "./search-heuristics.mjs";
import { searchStateLessons } from "./search-state-memory.mjs";
import { searchRefinementLessons } from "./search-refinements.mjs";
import { classicalOverviewLessons } from "./classical-overview.mjs";
import { searchGuaranteeLessons } from "./search-guarantees.mjs";
import { constraintLessons } from "./constraint-satisfaction.mjs";
import { localSearchLessons } from "./local-search.mjs";
import { propositionalLessons } from "./propositional-inference.mjs";
import { predicateLessons } from "./predicate-logic.mjs";
import { definiteRuleLessons } from "./definite-rules.mjs";
const probabilityBook = source("Pishro-Nik: Introduction to Probability", "https://www.probabilitycourse.com/");
const informationBook = source("MacKay: Information Theory, Inference, and Learning Algorithms", "https://www.inference.org.uk/itila/book.html");
const scipy = (name) => source(`SciPy: ${name}`, `https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.${name}.html`);

export const lessonAliases = {
  [math("early-stopping")]: "deep-learning/topics/early-stopping",
  [math("markov-chains")]: "probabilistic-ai/topics/markov-chains",
  [math("multiple-testing-correction")]: math("multiple-testing"),
};

export const reviewedLessons = {
  ...definiteRuleLessons,
  ...predicateLessons,
  ...propositionalLessons,
  ...localSearchLessons,
  ...constraintLessons,
  ...searchStrategyLessons,
  ...searchHeuristicLessons,
  ...searchStateLessons,
  ...searchRefinementLessons,
  ...classicalOverviewLessons,
  ...searchGuaranteeLessons,
  ...linearAlgebraLessons,
  ...distributionLessons,
  ...probabilityFoundationLessons,
  ...inferenceLessons,
  ...optimizationLessons,
  ...trainingLessons,
  ...calculusLessons,
  ...calculusApplicationLessons,
  ...informationLessons,
  ...samplingLessons,
  ...mcmcLessons,
  ...hiddenSequenceLessons,
  ...kalmanLessons,
  ...latentInferenceLessons,
  ...graphicalFoundationLessons,
  ...factorInferenceLessons,
  ...messagePassingLessons,
  ...structuredLessons,
  ...particleLessons,
  ...predictiveReliabilityLessons,
  ...dataQualityLessons,
  ...optimizationDiagnosticLessons,
  ...discreteFoundationLessons,
  ...graphStructureLessons,
  ...proofTechniqueLessons,
  ...complexityFoundationLessons,
  ...computationLessons,
  ...algorithmStrategyLessons,
  ...sectionOverviewLessons,
  ...foundationOverviewLessons,
  [math("conditional-probability")]: reviewed({
    title: "Conditional probability", summary: "Conditional probability measures an event within a restricted population: P(A|B)=P(A∩B)/P(B), provided P(B)>0.",
    hook: "The event after the bar chooses the denominator.", model: "conditional", control: ["Cases in both A and B", 0, 40, 1, 20],
    equation: "P(A|B)=P(A∩B)/P(B); P(B|A)=P(A∩B)/P(A)",
    assumptions: "100 equally weighted cases, with 40 in A and 50 in B. The slider changes their overlap; the four disjoint cell counts remain nonnegative and total 100.",
    takeaway: "Both directions use the same intersection, but they normalize against different groups. P(A|B) and P(B|A) need not agree.",
    sources: [source("Pishro-Nik: conditional probability", "https://www.probabilitycourse.com/chapter1/1_4_0_conditional_probability.php"), probabilityBook],
    ideas: [["Conditioning is restriction", "First select the B cases; then ask which of those also satisfy A. Joint probability instead counts the intersection relative to the whole population."], ["Counts need equal weights", "The ratio of raw counts represents probability when the cases have equal sampling weights. A biased sampling scheme may need weighted counts."]],
    process: ["Name the event after the conditioning bar.", "Restrict the denominator to that event's probability or weighted count.", "Divide the overlap by that denominator and check the result lies between zero and one."],
    example: ["A shared intersection, two answers", "In 100 examples, A has 40 cases, B has 50, and their intersection has 20.", ["P(A∩B)=20/100=0.2.", "P(A|B)=20/50=0.4.", "P(B|A)=20/40=0.5."], "The probabilities differ because the reference populations have different sizes."],
    pitfalls: ["The elementary ratio is undefined if P(B)=0. Conditioning continuous variables at a point requires a conditional-density or more general construction.", "Conditioning on an observation is not the same operation as intervening on a cause."],
    implementation: ["Validate all four contingency-table cells and their marginals.", "When a conditioning group has no observations, report that absence rather than returning a confident empirical estimate."],
    outcomes: ["Compute joint and conditional probabilities from a contingency table.", "Choose the correct denominator and distinguish observation from intervention."],
  }),
  [math("confidence-intervals")]: reviewed({
    title: "Confidence intervals", summary: "A frequentist confidence interval is produced by a procedure calibrated to contain a fixed population parameter at a stated rate across repeated samples.",
    hook: "The procedure has the coverage rate; the realized interval either contains the fixed parameter or does not.", model: "confidence", control: ["Sample size n", 5, 200, 1, 25],
    equation: "CI₉₅ ≈ [x̄ − 1.96σ/√n, x̄ + 1.96σ/√n]",
    assumptions: "Independent observations from a normal population; population standard deviation σ=10 is known. The lab holds observed mean x̄=50 fixed while varying n to isolate the effect on width. 1.96 rounds the standard-normal 97.5th percentile.",
    takeaway: "In this model, four times as many observations halve the interval width. More data cannot by itself repair biased sampling or invalid independence assumptions.",
    sources: [source("NIST: confidence limits for the mean", "https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm"), probabilityBook],
    ideas: [["What varies across samples", "The parameter is fixed in this interpretation. Sample means, standard errors, and resulting intervals change when a fresh sample is drawn."], ["Known and estimated spread", "This example assumes known population σ. For independent normal observations with σ estimated by sample s, the usual exact mean interval instead uses a Student-t critical value with n−1 degrees of freedom."]],
    process: ["State the target parameter and the assumptions that justify its sampling distribution.", "Calculate the standard error of the estimate.", "Use an appropriate critical value and report both the interval and the sampling design."],
    example: ["Uncertainty in a population mean", "Take an observed mean of 50, known σ=10, and n=25 independent normal observations.", ["The standard error is 10/√25=2.", "The half-width is 1.96×2=3.92.", "The interval is [46.08,53.92]."], "With n=100 and the same mean and known spread, the interval becomes [48.04,51.96]."],
    pitfalls: ["A 95% confidence interval does not assign a 95% posterior probability to the fixed parameter after observing the data.", "Intervals for a mean do not describe the spread of individual future responses; prediction intervals answer that different question."],
    implementation: ["Use the sampling unit, not simply the number of rows, when clustered or repeated measurements are present.", "Record exclusions and any sequential monitoring; fixed-sample coverage need not survive repeated optional stopping."],
    outcomes: ["Calculate a normal-mean interval under an explicitly known spread.", "Distinguish confidence intervals, prediction intervals, and Bayesian credible intervals."],
  }),
  [math("eigenvalues-and-eigenvectors")]: reviewed({
    title: "Eigenvalues and eigenvectors", summary: "An eigenvector is a nonzero vector v for which a square matrix acts as scalar multiplication: Av=λv. The scalar λ is its eigenvalue.",
    hook: "Find a line the transformation leaves unchanged, then measure the scaling along it.", model: "eigen", control: ["Candidate vector direction", 0, 180, 1, 135, "°"],
    equation: "Av=λv, v≠0; A=[[2,1],[1,2]]",
    assumptions: "The displayed real symmetric matrix has eigenvalues 3 and 1 with directions 45° and 135°. The slider rotates a unit candidate vector; both coordinate axes use the same scale.",
    takeaway: "A candidate is an eigenvector when the output stays on its line. For a general matrix a negative eigenvalue reverses direction, while zero maps the vector to zero.",
    sources: [source("NumPy: eigenvalue definition and solver", "https://numpy.org/doc/stable/reference/generated/numpy.linalg.eig.html"), source("NumPy: symmetric and Hermitian eigensolver", "https://numpy.org/doc/stable/reference/generated/numpy.linalg.eigh.html")],
    ideas: [["A direction, not a unique vector", "Any nonzero scalar multiple of an eigenvector has the same eigenvalue. Normalizing its length is a convention, not part of the defining property."], ["Real versus complex", "A real matrix can lack a real eigenvector: a planar 90° rotation has complex eigenvalues. Symmetry gives the stronger guarantee of real eigenvalues and an orthonormal eigenbasis."]],
    process: ["Choose a nonzero candidate vector and calculate Av.", "Test whether Av equals one scalar times every coordinate of v.", "If it does, verify the residual Av−λv is small relative to the scale of the computation."],
    example: ["A vector that stays put", "Use v=(1,−1) and A=[[2,1],[1,2]].", ["Av=(2−1,1−2)=(1,−1).", "Both coordinates agree with λ=1.", "For w=(1,1), Aw=(3,3), so that different line has λ=3."], "The same matrix can scale different invariant directions by different amounts."],
    pitfalls: ["The zero vector satisfies Av=λv for every λ but is explicitly excluded from the definition.", "A single eigenpair does not prove diagonalizability; a full decomposition requires enough independent eigenvectors."],
    implementation: ["Test residual norms rather than comparing eigenvector coordinates exactly, because signs and phases can differ.", "For a repeated eigenvalue, compare the eigenspace; the solver may return a different basis for that same space."],
    outcomes: ["Verify an eigenpair by direct multiplication.", "Distinguish an invariant direction from a complete eigenbasis."],
  }),
  [math("bernoulli")]: reviewed({
    title: "Bernoulli", summary: "A Bernoulli variable records one binary outcome: 1 with probability p and 0 with probability 1 − p.",
    hook: "One trial, two bars, total probability one.", model: "bernoulli", control: ["Success probability p", 0, 1, 0.01, 0.3],
    equation: "P(X=1)=p; P(X=0)=1−p; E[X]=p; Var(X)=p(1−p)",
    assumptions: "One binary trial, with outcomes coded as 0 and 1 and 0 ≤ p ≤ 1. Heights are probability masses, not densities.",
    takeaway: "Increasing p moves mass from 0 to 1; uncertainty is largest halfway between the two certain outcomes.",
    sources: [scipy("bernoulli"), probabilityBook],
    ideas: [["Outcome versus probability", "A realized outcome is 0 or 1. A probability such as 0.3 describes uncertainty before the trial; it is not a fractional outcome."], ["Indicator variables", "An indicator turns an event into a number. Its expected value equals the probability of the event, which connects event counts to averages."]],
    process: ["Specify the event that counts as success.", "Assign p to outcome 1 and 1 − p to outcome 0.", "Check both masses are nonnegative and their sum is one."],
    example: ["A binary request outcome", "A request fails with probability 0.3. Set X=1 for failure.", ["The two masses are P(X=0)=0.7 and P(X=1)=0.3.", "E[X]=0.3 and Var(X)=0.3 × 0.7=0.21."], "The expected indicator is 0.3 even though no individual request has outcome 0.3."],
    pitfalls: ["Repeated requests need not be independent. A Bernoulli model for each request alone does not justify a binomial model for their sum.", "The meaning of 1 is a modelling choice: success need not mean a desirable outcome."],
    implementation: ["Represent observed outcomes as binary values and model probabilities separately.", "Handle p=0 and p=1 explicitly when evaluating log probabilities; impossible outcomes have log probability −∞."],
    outcomes: ["Calculate both masses, the mean, and the variance of a binary indicator.", "Separate one binary trial from assumptions about repeated trials."],
  }),
  [math("binomial")]: reviewed({
    title: "Binomial", summary: "The binomial distribution counts successes in a fixed number of independent Bernoulli trials with a shared success probability.",
    hook: "A Bernoulli variable is one switch; a binomial variable counts how many switches turn on.", model: "binomial", control: ["Success probability p", 0, 1, 0.01, 0.3],
    equation: "P(K=k)=C(n,k)pᵏ(1−p)ⁿ⁻ᵏ; E[K]=np; Var(K)=np(1−p)",
    assumptions: "The lab fixes n=10 independent trials with the same p. The horizontal axis counts successes; bar heights are exact probabilities.",
    takeaway: "Changing p shifts the count distribution; with n=10, its mean is 10p and its variance is 10p(1−p).",
    prerequisites: [math("bernoulli")], sources: [scipy("binom"), probabilityBook],
    ideas: [["The combinatorial factor", "C(n,k) counts which k positions are successes. Each particular arrangement has probability pᵏ(1−p)ⁿ⁻ᵏ."], ["Fixed versus varying probabilities", "The binomial model needs one common p. Independent trials with different probabilities instead give a Poisson-binomial count."]],
    process: ["Fix n and define success before collecting the trials.", "For each k from 0 through n, multiply the arrangement count by the probability of one arrangement.", "Sum the masses to check normalization; compare the mean with np."],
    example: ["Exactly three successes", "Use n=10 and p=0.3.", ["There are C(10,3)=120 arrangements with three successes.", "P(K=3)=120 × 0.3³ × 0.7⁷ ≈ 0.2668.", "The mean is 3 and the variance is 2.1."], "The expected count is three, but the probability of exactly three is only about 26.68%."],
    pitfalls: ["Shared outages make request failures dependent and can substantially change tail probabilities.", "Sampling without replacement from a small finite population generally calls for a hypergeometric model."],
    implementation: ["For large n, evaluate log combinations with log-gamma functions or use a library probability-mass function.", "For upper tails, prefer a survival-function routine to subtracting a nearly-one cumulative probability."],
    outcomes: ["Calculate a count probability with the combinatorial factor.", "Check independence, a fixed trial count, and a shared p before applying a binomial model."],
  }),
  [math("bayes-theorem")]: reviewed({
    title: "Bayes' theorem", summary: "Bayes' theorem reverses a conditional probability by combining likelihoods with prior probabilities and normalizing over the evidence.",
    hook: "Count both ways to trigger an alert before deciding what an alert means.", model: "bayes", control: ["Prior event probability", 0, 1, 0.01, 0.1],
    equation: "P(H|+)=sπ / [sπ + f(1−π)]",
    assumptions: "Binary event H. Sensitivity s=P(+|H)=0.9 and false-positive rate f=P(+|not H)=0.1 stay fixed. The slider changes prior π=P(H).",
    takeaway: "The posterior depends on the base rate as well as the detector: a high sensitivity alone does not make every alert reliable.",
    prerequisites: [math("conditional-probability")], sources: [source("Pishro-Nik: Bayes' rule", "https://www.probabilitycourse.com/chapter1/1_4_3_bayes_rule.php"), probabilityBook],
    ideas: [["Two directions", "P(+|H) asks how often an event triggers an alert. P(H|+) asks how often an alert corresponds to the event. The denominators are different."], ["Normalization", "The evidence probability includes alerts from H and from its complement. Leaving out either contribution gives a wrong posterior."]],
    process: ["Multiply the prior event probability by sensitivity.", "Multiply the complementary prior by the false-positive rate.", "Divide the first contribution by the sum of both contributions."],
    example: ["Alerts in 1,000 requests", "Suppose 10% of requests are anomalous, sensitivity is 90%, and the false-positive rate is 10%.", ["Expected true alerts: 1,000 × 0.1 × 0.9=90.", "Expected false alerts: 1,000 × 0.9 × 0.1=90.", "An alert corresponds to an anomaly with probability 90/(90+90)=0.5."], "A detector with 90% sensitivity gives only 50% precision under these assumptions."],
    pitfalls: ["The false-positive rate conditions on negatives; precision conditions on alerts.", "A new deployment population can change the prior and therefore the posterior even if the conditional detector rates stay fixed."],
    implementation: ["Document the population used to estimate each conditional rate.", "Normalize log weights with log-sum-exp when probabilities become too small to multiply safely."],
    outcomes: ["Compute a posterior from prior, sensitivity, and false-positive rate.", "Distinguish precision from sensitivity and explain the base-rate effect."],
  }),
  [math("entropy")]: reviewed({
    title: "Entropy", summary: "Discrete Shannon entropy is the expected surprise of an outcome under its own distribution. Logarithm base 2 measures it in bits.",
    hook: "A certain bit carries no surprise; a fair bit carries one bit on average.", model: "entropy", control: ["Probability p of outcome 1", 0, 1, 0.01, 0.5],
    equation: "H(p)=−p log₂ p−(1−p)log₂(1−p)",
    assumptions: "Binary discrete distribution (1−p,p), with 0 log₂ 0 defined by its limit as 0. The vertical axis is bits per outcome.",
    takeaway: "Binary entropy is zero at certainty and reaches one bit at p=0.5.", prerequisites: [math("bernoulli")], sources: [scipy("entropy"), informationBook],
    ideas: [["Surprise of one observation", "An outcome assigned probability r has surprise −log₂ r. Rare outcomes are more surprising when they occur."], ["An average over outcomes", "Entropy weights each outcome's surprise by its probability. It is a property of a distribution, not an individual sample."]],
    process: ["List all outcome probabilities.", "For each positive probability, compute −p log₂ p.", "Sum the contributions, using zero for an impossible outcome's contribution."],
    example: ["A biased binary source", "Let the two probabilities be 0.25 and 0.75.", ["The rare outcome contributes −0.25 log₂(0.25)=0.5 bits.", "The common outcome contributes −0.75 log₂(0.75)≈0.3113 bits."], "Entropy is about 0.8113 bits per outcome, below the fair source's one bit."],
    pitfalls: ["Differential entropy for continuous densities has different properties and can be negative.", "Entropy is not prediction accuracy; a confidently wrong predictive distribution can have low entropy."],
    implementation: ["Mask zero-probability terms before taking logarithms.", "State the logarithm base and normalize probabilities deliberately rather than silently mixing counts and probabilities."],
    outcomes: ["Calculate the expected surprise of a discrete source.", "Distinguish uncertainty in a distribution from correctness of predictions."],
  }),
  [math("cross-entropy")]: reviewed({
    title: "Cross-entropy", summary: "Cross-entropy averages the surprise assigned by a predictive distribution q to outcomes drawn from a target distribution p.",
    hook: "Use the target to weight outcomes and the prediction to price their surprise.", model: "cross-entropy", control: ["Predicted probability q of outcome 1", 0.01, 0.99, 0.01, 0.5],
    equation: "H(p,q)=−Σᵢ pᵢ log₂ qᵢ = H(p)+D_KL(p∥q)",
    assumptions: "The lab fixes P(Y=1)=0.7 and varies predicted q. Both distributions are binary. Values are bits per outcome; q stays strictly between 0 and 1.",
    takeaway: "For a fixed target distribution, cross-entropy is minimized when q matches p, but its minimum is H(p), not generally zero.",
    prerequisites: [math("entropy")], sources: [scipy("entropy"), informationBook],
    ideas: [["One observed label", "For an observed positive label, the loss is −log₂ q. For a negative label it is −log₂(1−q)."], ["Population versus sample", "The plot is an exact population expectation for p=0.7. A finite dataset estimates that expectation by averaging its observed losses."]],
    process: ["Choose which distribution generates labels and which predicts them.", "Compute each label's negative log predicted probability.", "Average using target probabilities or observed label frequencies."],
    example: ["A constant predictor", "The population is 70% positive and a model always predicts q=0.5.", ["Both label losses equal one bit, giving H(p,q)=1.", "Predicting q=0.7 instead gives H(p,p)≈0.8813 bits."], "Matching the true probability reduces expected loss without eliminating intrinsic label uncertainty."],
    pitfalls: ["Assigning q=0 to an event with positive target probability gives infinite loss.", "Framework cross-entropy APIs often expect logits; passing probabilities can apply an unintended second normalization."],
    implementation: ["Use a numerically stable fused log-softmax or binary loss with logits.", "Apply the intended reduction and padding mask before comparing sequence losses."],
    outcomes: ["Compute binary cross-entropy under a specified target distribution.", "Explain why calibrated uncertain predictions can have a nonzero optimal loss."],
  }),
  [math("kl-divergence")]: reviewed({
    title: "KL divergence", summary: "KL divergence measures expected extra log loss from using q instead of the data distribution p, in a specified direction.",
    hook: "KL is the excess bill: cross-entropy minus the source's own entropy.", model: "kl", control: ["Model probability q of outcome 1", 0.01, 0.99, 0.01, 0.5],
    equation: "D_KL(p∥q)=Σᵢ pᵢ log₂(pᵢ/qᵢ)",
    assumptions: "The binary target has p=0.7. Model q is strictly positive on both outcomes. Units are bits; the direction is target p to model q.",
    takeaway: "KL is nonnegative and is zero when the distributions agree, but swapping its arguments generally changes the result.", prerequisites: [math("cross-entropy")], sources: [scipy("entropy"), informationBook],
    ideas: [["Support matters", "If p assigns positive mass where q assigns zero, the divergence is infinite. Terms with p=0 contribute zero."], ["Direction matters", "The weighting distribution changes when arguments are swapped. KL is not a metric: it is asymmetric and need not satisfy the triangle inequality."]],
    process: ["Align the event ordering in p and q.", "Check that q covers every event with positive p.", "Weight each log probability ratio by p and sum."],
    example: ["The cost of a uniform forecast", "Let p=(0.3,0.7) and q=(0.5,0.5).", ["H(p,q)=1 bit and H(p)≈0.8813 bits.", "D_KL(p∥q)=1−0.8813≈0.1187 bits.", "The reverse divergence is about 0.1258 bits."], "The two directions are unequal even in a two-outcome example."],
    pitfalls: ["Individual summands can be negative even though their total is nonnegative.", "Adding a small constant to q changes the distribution and therefore changes the quantity being measured."],
    implementation: ["Use zero-aware relative-entropy functions or explicit support checks.", "When comparing implementations, verify argument order, event axis, normalization, and logarithm base."],
    outcomes: ["Compute directional excess log loss.", "Recognize support mismatch and asymmetry before using KL as a comparison."],
  }),
  [math("perplexity")]: reviewed({
    title: "Perplexity", summary: "Perplexity exponentiates average negative log likelihood. For a specified tokenization and evaluation protocol, lower values mean higher probability assigned to the observed sequence.",
    hook: "Average surprise becomes an equivalent branching factor when you exponentiate it.", model: "perplexity", control: ["Predicted probability q of token 1", 0.01, 0.99, 0.01, 0.5],
    equation: "PPL=exp(−(1/N)Σₜ ln q(xₜ|x<ₜ)) = 2ᴴ when H is in bits",
    assumptions: "Toy two-token source: independent tokens with P(token 1)=0.7. The curve is population perplexity 2 raised to binary cross-entropy, not a measured language-model benchmark.",
    takeaway: "A uniform two-token model has perplexity 2; a well-matched nonuniform model can have perplexity below 2.", prerequisites: [math("cross-entropy")], sources: [informationBook, source("Jurafsky and Martin: Speech and Language Processing", "https://web.stanford.edu/~jurafsky/slp3/")],
    ideas: [["Geometric average", "Perplexity is the reciprocal geometric mean of the model probabilities of observed tokens. Averaging probabilities first computes something different."], ["Comparable units", "A token may be a word, byte, or subword. Changing tokenization changes the units, so raw scores across different tokenizers are not directly comparable."]],
    process: ["Collect negative log probabilities of the evaluated, nonpadding tokens.", "Sum losses and divide by the total number of evaluated tokens.", "Exponentiate using the base that matches the logarithms."],
    example: ["Two held-out tokens", "A model assigns the actual tokens probabilities 0.5 and 0.25.", ["Their negative log₂ probabilities are 1 and 2 bits.", "Average loss is 1.5 bits; perplexity is 2^1.5≈2.828."], "The score is about 2.828, not the reciprocal of the arithmetic mean probability."],
    pitfalls: ["Average losses using token counts, rather than averaging per-batch perplexities.", "Context windows, masking, data contamination, and tokenization can change the score without reflecting better deployment performance."],
    implementation: ["Accumulate total negative log likelihood and token count before exponentiating once.", "Record tokenizer, corpus, context protocol, and loss logarithm base alongside the score."],
    outcomes: ["Convert mean log loss into perplexity using the correct base.", "Identify when two perplexity scores do not share an evaluation protocol."],
  }),
  [math("brier-score")]: reviewed({
    title: "Brier score", summary: "The binary Brier score is the mean squared difference between a predicted probability and a binary outcome. It evaluates probability forecasts without applying a classification threshold.",
    hook: "Measure how far the probability lands from the realized zero or one.", model: "brier", control: ["Forecast probability q", 0, 1, 0.01, 0.5],
    equation: "BS=(1/N)Σᵢ(qᵢ−yᵢ)²; E[BS]=(q−p)²+p(1−p)",
    assumptions: "Binary score convention on [0,1]. The toy population has event probability p=0.7, and every item receives the same forecast q. The curve is expected loss.",
    takeaway: "The expected binary Brier score is minimized at the true event probability. Calibration is only one part of forecast quality.", prerequisites: [math("bernoulli")],
    sources: [source("scikit-learn: Brier score loss", "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.brier_score_loss.html"), source("scikit-learn: probability calibration", "https://scikit-learn.org/stable/modules/calibration.html")],
    ideas: [["A proper probability score", "For Bernoulli outcomes with rate p, expected score equals (q−p)²+p(1−p). The first term penalizes a wrong probability; the second is irreducible under a constant forecast."], ["Calibration is not the whole score", "A score also reflects how predictions separate different risks. A lower Brier score alone does not prove better calibration."]],
    process: ["Keep probabilities instead of converting them into class labels.", "Square each probability error against its 0/1 outcome.", "Average across the evaluation sample and compare with an appropriate baseline."],
    example: ["Four probability forecasts", "Forecasts are (0.8,0.6,0.2,0.1), with outcomes (1,0,0,1).", ["Squared errors are (0.04,0.36,0.04,0.81).", "Their sum is 1.25, so the binary Brier score is 1.25/4=0.3125."], "The confidently wrong final forecast contributes the largest error."],
    pitfalls: ["Binary and multiclass score conventions can use different scaling; state the definition when comparing reports.", "A change in base rates changes the baseline score, making comparisons across populations harder."],
    implementation: ["Check probability bounds and the identity of the positive class.", "Pair the score with a reliability diagram and sample counts; do not infer calibration from this single number."],
    outcomes: ["Calculate a binary probability score without a threshold.", "Distinguish a proper scoring rule from a calibration-only diagnostic."],
  }),
  ["probabilistic-ai/topics/markov-chains"]: reviewed({
    title: "Markov chains", summary: "A discrete-time Markov chain describes a state sequence whose next-state distribution, conditional on the current state, does not depend on earlier states.",
    hook: "Move probability mass along outgoing transitions, then add the arrivals.", model: "markov", control: ["Number of transitions", 0, 20, 1, 2],
    equation: "πₜ₊₁=πₜP; P=[[0.8,0.2],[0.4,0.6]]",
    assumptions: "Two states A and B; row distributions; a fixed transition matrix with nonnegative rows summing to 1. The initial distribution is π₀=(1,0).",
    takeaway: "The row vector after t transitions is π₀Pᵗ. For this irreducible, aperiodic chain it approaches (2/3,1/3).",
    prerequisites: [math("conditional-probability")], sources: [source("Pishro-Nik: discrete-time Markov chains", "https://www.probabilitycourse.com/chapter11/11_2_1_introduction.php"), probabilityBook],
    ideas: [["State must retain relevant memory", "The Markov property is an assumption about a chosen state representation. Adding a missing state variable can change whether the assumption is reasonable."], ["Stationary versus limiting", "A stationary distribution satisfies πP=π. A finite chain has a stationary distribution, but uniqueness and convergence from every start require further conditions."]],
    process: ["Put transition probabilities from each current state in a row.", "Multiply the current row distribution by P.", "Repeat, checking that the entries stay nonnegative and sum to one."],
    example: ["Two days of transitions", "Start in A with probability 1.", ["After one transition, π₁=(0.8,0.2).", "After two: P(A)=0.8×0.8+0.2×0.4=0.72.", "P(B)=0.8×0.2+0.2×0.6=0.28."], "The distribution is (0.72,0.28); it describes many possible paths, not a single observed path."],
    pitfalls: ["A periodic chain can have a stationary distribution while its state probabilities oscillate.", "An ordinary observed-state Markov chain does not need the emission model used by a hidden Markov model."],
    implementation: ["Specify whether the implementation uses row or column probability vectors.", "Use sparse matrix-vector products for large state spaces and check row sums after constructing P."],
    outcomes: ["Propagate a distribution through a transition matrix.", "Separate stationarity, uniqueness, and convergence instead of assuming they are equivalent."],
  }),
  ["deep-learning/topics/early-stopping"]: reviewed({
    title: "Early stopping", summary: "Early stopping selects a training checkpoint using a validation metric and stops after a defined run of insufficient improvements.",
    hook: "Keep the best checkpoint, not merely the checkpoint where patience runs out.", model: "early-stopping", control: ["Patience in validation checks", 1, 5, 1, 2],
    equation: "improvement: lossₜ < best_loss − min_delta; stop when wait ≥ patience",
    assumptions: "Illustrative fixed validation losses [0.90,0.70,0.55,0.50,0.51,0.52,0.49,0.53,0.54,0.55]. Lower is better, min_delta=0, one check per epoch, and the best observed checkpoint is restored.",
    takeaway: "Patience changes which later improvements the run gets a chance to observe; the best available checkpoint can occur before the stopping epoch.",
    sources: [source("Keras: EarlyStopping", "https://keras.io/api/callbacks/early_stopping/"), source("Goodfellow et al.: regularization", "https://www.deeplearningbook.org/contents/regularization.html")],
    ideas: [["Checkpoint selection", "Validation loss chooses a model within a run. The untouched test set is reserved for evaluating the selected procedure, including the stopping rule."], ["Patience and minimum improvement", "Patience counts unsuccessful validation checks. A minimum improvement filters tiny changes; both choices affect the stopping time."]],
    process: ["Choose the monitored quantity, direction, frequency, and patience before the run.", "Save a checkpoint on a qualifying improvement and reset the waiting count.", "Otherwise increment the count; stop at the threshold and restore the saved checkpoint."],
    example: ["A delayed improvement", "The lab's first six validation losses are 0.90, 0.70, 0.55, 0.50, 0.51, 0.52.", ["With patience 2, epochs 5 and 6 consume the waiting window.", "Stop at epoch 6 and restore epoch 4, whose loss was 0.50.", "With patience 3, epoch 7 is observed; its loss 0.49 becomes the new best."], "Changing patience can change the selected model, not just the amount of computation."],
    pitfalls: ["Tuning stopping rules repeatedly against one small validation set can overfit that set.", "A library may not restore best weights by default; stopping and restoration are separate options."],
    implementation: ["Checkpoint the state needed by the intended next action: inference needs weights, resumed training also needs optimizer and scheduler state.", "Log the best epoch, stop epoch, metric direction, minimum change, and evaluation frequency."],
    outcomes: ["Simulate patience and identify the restored checkpoint.", "Keep final test data outside checkpoint selection and stopping-rule tuning."],
  }),
  [math("eigendecomposition")]: reviewed({
    title: "Eigendecomposition", summary: "A diagonalizable square matrix can be written A=VΛV⁻¹. Its eigenvectors form a coordinate system in which the transformation scales each coordinate independently.",
    hook: "Turn into the eigenbasis, scale each axis, then turn back.", model: "eigen", control: ["Input direction", 0, 180, 1, 45, "°"],
    equation: "A=[[2,1],[1,2]]=V diag(3,1)Vᵀ; Av=λv for eigenvectors",
    assumptions: "The lab uses the real symmetric 2×2 matrix [[2,1],[1,2]] and a unit input vector. Its orthonormal eigenvectors point at 45° and 135°; lengths and coordinates are dimensionless.",
    takeaway: "Only eigenvector directions stay on the same line under this matrix. General vectors combine the independently scaled directions.",
    prerequisites: [math("eigenvalues-and-eigenvectors")], sources: [source("NumPy: eigenvalues and right eigenvectors", "https://numpy.org/doc/stable/reference/generated/numpy.linalg.eig.html"), source("MIT OCW: Linear Algebra", "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/")],
    ideas: [["One eigenpair versus a decomposition", "Finding one nonzero v with Av=λv does not establish that a full eigenbasis exists. A decomposition needs enough independent eigenvectors."], ["The symmetric case", "A real symmetric matrix admits an orthonormal eigenbasis, so V⁻¹=Vᵀ. This useful guarantee does not apply to arbitrary square matrices."]],
    process: ["Find eigenvalues and corresponding nonzero eigenvectors.", "Check whether those eigenvectors form a basis.", "Assemble V and Λ, then verify AV≈VΛ with a scale-aware residual."],
    example: ["A stretch along a diagonal", "Let A=[[2,1],[1,2]].", ["A(1,1)=(3,3), giving eigenvalue 3 along (1,1).", "A(1,−1)=(1,−1), giving eigenvalue 1 along (1,−1).", "For input (1,0), the output is (2,1), which is not parallel to the input."], "A generic vector changes direction; the two eigenvector lines do not."],
    pitfalls: ["A defective matrix such as [[1,1],[0,1]] lacks a full eigenbasis.", "Real nonsymmetric matrices can have complex eigenvalues and nonorthogonal eigenvectors."],
    implementation: ["Use a symmetric/Hermitian eigensolver when its assumptions hold.", "Compare residuals rather than exact eigenvector signs; both v and −v describe the same real eigenvector line."],
    outcomes: ["Reconstruct a symmetric matrix from eigenvectors and eigenvalues.", "Check diagonalizability instead of assuming every square matrix has an eigenbasis."],
  }),
  [math("split-conformal-prediction")]: reviewed({
    title: "Split conformal prediction", summary: "Split conformal prediction uses held-out calibration errors to turn a fixed predictor into a prediction set with a finite-sample marginal coverage guarantee under exchangeability.",
    hook: "Reserve errors you did not train on, rank them, then use the required rank as a prediction radius.", model: "conformal", control: ["Miscoverage level α", 0.1, 0.5, 0.05, 0.1],
    equation: "k=ceil((n+1)(1−α)); C(x)=[f(x)−r₍ₖ₎, f(x)+r₍ₖ₎]",
    assumptions: "A predictor fixed before calibration; n=9 absolute residuals [0.2,0.3,0.4,0.5,0.7,0.9,1.1,1.4,2.0]. Calibration and future examples are exchangeable. Units are target units; the displayed new prediction is f(x)=5.",
    takeaway: "The corrected rank uses n+1, not n. The guarantee averages over exchangeable calibration and test examples; it is not a guarantee for every subgroup or every x.",
    prerequisites: [math("confidence-intervals")], sources: [source("Angelopoulos and Bates: A Gentle Introduction to Conformal Prediction", "https://arxiv.org/abs/2107.07511"), source("Authors' conformal prediction tutorial and notebooks", "https://github.com/aangelopoulos/conformal-prediction")],
    ideas: [["Calibration split", "Fit the model on training data, then calculate residuals on disjoint calibration data. Reusing those residuals to tune the predictor invalidates this simple split argument."], ["Prediction, not parameter estimation", "The interval targets a future response. It is not a confidence interval for a model parameter or for the conditional mean."]],
    process: ["Calculate absolute errors on calibration examples and sort them.", "Choose rank ceil((n+1)(1−α)). If it exceeds n, use an infinite radius rather than silently capping the rank.", "Add and subtract the selected residual from the fixed model's new prediction."],
    example: ["Nine calibration errors", "Use the nine residuals shown in the lab and α=0.1.", ["k=ceil(10×0.9)=9.", "The ninth residual is 2.0.", "For prediction 5, return [3,7]."], "This procedure has at least 90% marginal coverage under the stated assumptions; it does not assert a 90% conditional probability for this particular case."],
    pitfalls: ["Arbitrary time dependence or distribution shift can break exchangeability.", "A tiny calibration sample produces coarse quantiles; interpolated sample quantiles do not automatically implement the required rank."],
    implementation: ["Keep training, model selection, calibration, and final assessment roles explicit.", "Monitor interval widths and empirical coverage on meaningful groups, while distinguishing those diagnostics from the marginal theorem."],
    outcomes: ["Compute the finite-sample corrected rank and prediction interval.", "State the exchangeability assumption and distinguish marginal from conditional coverage."],
  }),
};
