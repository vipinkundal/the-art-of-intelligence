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
    "populations-and-samples": detail({
      idea: ["A population is the complete group or process you want to understand. A sample is the smaller set of observations you actually collect.", "Statistics uses the sample to make careful statements about the population, while accounting for how the sample was selected."],
      how: "Define the target population, decide how observations will be sampled, measure variables consistently, and judge whether the sample represents the population well enough for the intended conclusion.",
      concepts: [
        concept("Population", "Every unit, event, or future case covered by the question.", "population distribution P", "All future users of a deployed model."),
        concept("Sample", "The observed subset used for analysis.", "x_1,...,x_n", "Ten thousand recorded user sessions."),
        concept("Parameter", "A fixed but usually unknown population quantity.", "mu, sigma, or theta", "True population conversion rate."),
        concept("Statistic", "A quantity computed from the sample.", "X_bar or p_hat", "Observed sample conversion rate.")
      ],
      formulas: [formula("Sample mean", "X_bar=(1/n)sum_i X_i", "sample estimate of population mean"), formula("Sample proportion", "p_hat=successes/n", "sample estimate of population probability"), formula("Standard error", "SE(X_bar) approximately s/sqrt(n)", "sampling variability of the mean")],
      caption: "Inference connects a limited sample to a clearly defined target population.",
      flow: [node("Target population", "who or what matters"), node("Sampling process", "how data are selected"), node("Observed sample", "measured data"), node("Inference", "estimate population properties")],
      learn: ["Distinguish populations, samples, parameters, and statistics.", "Define a target population precisely.", "Identify sampling and coverage bias.", "Explain why sample size cannot fix a biased sampling process."],
      ai: "Training and test data are samples from a hoped-for deployment population. Poor alignment causes misleading evaluations and deployment failures.",
      pitfalls: ["A large convenience sample can still be unrepresentative.", "The target population may change over time.", "Do not generalize beyond groups the sampling design can support."],
      example: "An app wants average latency for all global users, but samples only employees on fast office networks. The sample mean may be precise for employees and badly biased for the target population.",
      question: "In a survey of 500 customers, what is the sample and what is the population?",
      answer: "The 500 respondents are the sample. The population is the full customer group the survey intends to describe.",
      resources: [{ label: "OpenStax: Sampling and data", url: "https://openstax.org/books/introductory-statistics/pages/1-2-data-sampling-and-variation-in-data-and-sampling" }]
    }),
    "bias-and-variance": detail({
      idea: "Bias is systematic error that persists across repeated datasets. Variance is sensitivity to which particular sample was used. Good models balance both sources of error.",
      how: "Imagine repeatedly drawing training sets and fitting the same method. Compare the average prediction with truth to see bias, and compare predictions across fitted models to see variance.",
      concepts: [
        concept("Bias", "Difference between the average estimator or model prediction and the true target.", "Bias(theta_hat)=E[theta_hat]-theta", "An overly simple model consistently underfits."),
        concept("Variance", "Spread of estimates across different samples.", "Var(theta_hat)", "A deep tree changes greatly with small data changes."),
        concept("Irreducible noise", "Outcome randomness that available features cannot predict.", "sigma_epsilon^2", "Measurement noise or genuinely random outcomes."),
        concept("Tradeoff", "Increasing flexibility often lowers bias while raising variance.", "test error balance", "Regularization can reduce variance at some bias cost.")
      ],
      formulas: [formula("Estimator bias", "E[theta_hat]-theta", "systematic estimation offset"), formula("Prediction decomposition", "expected error = Bias^2 + Variance + Noise", "three contributors to squared error"), formula("Bagging effect", "Var(average) decreases with diverse models", "averaging can reduce variance")],
      caption: "Repeated datasets separate persistent error from sample-sensitive error.",
      flow: [node("Draw many datasets", "same population"), node("Fit many models", "same method"), node("Average predictions", "reveals bias"), node("Measure spread", "reveals variance")],
      learn: ["Define statistical and model bias.", "Interpret variance across fitted models.", "Use the bias-variance decomposition.", "Connect regularization, data size, and ensembling to the tradeoff."],
      ai: "Bias-variance reasoning explains underfitting, overfitting, validation behavior, model complexity, regularization, and why ensembles often help.",
      pitfalls: ["Statistical bias differs from social or fairness bias, though both matter.", "Low training error does not imply low bias on the true target.", "More data mainly reduces variance; it does not automatically remove systematic sampling bias."],
      example: "A linear model fitted to a strongly curved relationship gives similar but wrong predictions across samples: high bias. A very deep tree follows each sample's noise: high variance.",
      question: "Which component does averaging many diverse fitted models usually reduce most directly?",
      answer: "Variance, because independent or weakly correlated fluctuations cancel.",
      resources: [{ label: "Wikipedia: Bias-variance tradeoff", url: "https://en.wikipedia.org/wiki/Bias%E2%80%93variance_tradeoff" }]
    }),
    "point-estimation": detail({
      idea: "A point estimator turns sample data into one best guess for an unknown population parameter. Its quality is judged across repeated samples, not from one answer alone.",
      how: "Choose a statistic whose behavior matches the target parameter, compute it from data, then study its bias, variance, consistency, robustness, and sampling distribution.",
      concepts: [
        concept("Estimator", "A rule applied to any possible sample.", "theta_hat=T(X_1,...,X_n)", "The sample mean estimates mu."),
        concept("Estimate", "The numerical value produced for the observed sample.", "theta_hat=2.7", "This dataset's average is 2.7."),
        concept("Consistency", "The estimator approaches the true parameter as sample size grows.", "theta_hat_n -> theta", "Sample mean under standard conditions."),
        concept("Robustness", "Resistance to outliers or small assumption violations.", "influence of observations", "Median is more robust than mean to extreme values.")
      ],
      formulas: [formula("Sample mean", "mu_hat=(1/n)sum_i x_i", "point estimate of a mean"), formula("Sample variance", "s^2=(1/(n-1))sum_i(x_i-X_bar)^2", "unbiased variance estimate under iid sampling"), formula("Mean squared error", "MSE(theta_hat)=Bias^2+Variance", "overall estimator quality")],
      caption: "A point estimate is one output of an estimator whose repeated-sample behavior matters.",
      flow: [node("Unknown parameter", "theta"), node("Observe sample", "x_1...x_n"), node("Apply estimator", "T(data)"), node("Point estimate", "theta_hat")],
      learn: ["Distinguish estimator from estimate.", "Compute common point estimates.", "Explain bias, consistency, efficiency, and robustness.", "Compare estimators using mean squared error."],
      ai: "Learned model weights, class rates, feature means, and evaluation metrics are point estimates from finite data.",
      pitfalls: ["A precise-looking number does not communicate uncertainty.", "An unbiased estimator can have high variance.", "The best estimator depends on assumptions and the loss attached to errors."],
      example: "For values [1,2,100], the mean estimate is 34.3 while the median is 2. The mean uses all magnitudes efficiently under Gaussian assumptions; the median is more robust to the outlier.",
      question: "What is the difference between theta_hat as an estimator and the value 0.42?",
      answer: "Theta_hat is the rule before seeing data; 0.42 is the estimate produced for one observed sample.",
      resources: [{ label: "Wikipedia: Point estimation", url: "https://en.wikipedia.org/wiki/Point_estimation" }]
    }),
    "maximum-likelihood-estimation": detail({
      idea: "Maximum likelihood estimation chooses parameter values under which the observed data would be most probable or have the highest density.",
      how: "Write the model probability for every observation, multiply them under an independence assumption, take logs to turn products into sums, and optimize over the parameters.",
      concepts: [
        concept("Likelihood", "The data are fixed while parameters vary.", "L(theta;x)=p_theta(x)", "Compare which coin probability best explains observed flips."),
        concept("Log-likelihood", "A numerically safer sum of log probabilities.", "ell(theta)=sum_i log p_theta(x_i)", "Avoids products of tiny numbers."),
        concept("MLE", "Parameter value maximizing likelihood.", "theta_hat=argmax_theta ell(theta)", "Bernoulli MLE is observed success rate."),
        concept("Negative log-likelihood", "A minimization objective equivalent to maximizing likelihood.", "NLL=-ell(theta)", "Cross-entropy is categorical NLL.")
      ],
      formulas: [formula("Likelihood", "L(theta)=product_i p_theta(x_i)", "joint data probability under iid assumptions"), formula("Log-likelihood", "ell(theta)=sum_i log p_theta(x_i)", "additive optimization form"), formula("MLE", "theta_hat_MLE=argmax_theta ell(theta)", "best-fitting parameter")],
      caption: "MLE converts a probabilistic model into a data-fitting objective.",
      flow: [node("Choose model", "p_theta(x)"), node("Observe data", "fixed sample"), node("Build log-likelihood", "score each theta"), node("Maximize", "theta_hat_MLE")],
      learn: ["Distinguish probability from likelihood.", "Construct an iid log-likelihood.", "Connect NLL to familiar losses.", "Recognize identifiability and overfitting issues."],
      ai: "Most supervised learning losses are negative log-likelihoods: squared error for Gaussian regression and cross-entropy for categorical prediction.",
      pitfalls: ["Likelihood is not a probability distribution over theta unless combined with a prior and normalized.", "MLE can overfit flexible models.", "A misspecified model can produce confident but misleading estimates."],
      example: "For 8 successes in 10 Bernoulli trials, ell(p)=8log p+2log(1-p). Maximizing gives p_hat=8/10=0.8.",
      question: "Why is log-likelihood usually optimized instead of raw likelihood?",
      answer: "It turns products into sums, preserves the maximizing parameter, and avoids numerical underflow.",
      resources: [{ label: "Wikipedia: Maximum likelihood estimation", url: "https://en.wikipedia.org/wiki/Maximum_likelihood_estimation" }]
    }),
    "maximum-a-posteriori-estimation": detail({
      idea: "Maximum a posteriori estimation chooses the most probable parameter after combining observed-data likelihood with a prior preference.",
      how: "Use Bayes' rule, drop the evidence term that does not depend on theta, and maximize log likelihood plus log prior. The prior often appears as a regularization penalty.",
      concepts: [
        concept("Prior", "Belief or preference over parameters before this dataset.", "p(theta)", "Gaussian prior favors smaller weights."),
        concept("Posterior", "Updated parameter distribution after seeing data.", "p(theta|D) proportional to p(D|theta)p(theta)", "Combines evidence and prior."),
        concept("MAP estimate", "Posterior mode: the parameter with highest posterior density.", "theta_hat_MAP=argmax p(theta|D)", "One summary of posterior uncertainty."),
        concept("Regularization link", "Negative log prior becomes a penalty in the objective.", "-log p(theta)", "Gaussian prior gives L2 penalty; Laplace gives L1.")
      ],
      formulas: [formula("Posterior", "p(theta|D) proportional to p(D|theta)p(theta)", "likelihood times prior"), formula("MAP", "argmax_theta [log p(D|theta)+log p(theta)]", "posterior mode"), formula("Gaussian prior", "-log p(theta) proportional to ||theta||_2^2", "L2 regularization connection")],
      caption: "MAP balances data fit with prior parameter plausibility.",
      flow: [node("Prior", "parameter preference"), node("Likelihood", "fit to observed data"), node("Posterior", "combine and normalize"), node("Mode", "MAP estimate")],
      learn: ["Derive MAP from Bayes' rule.", "Compare MLE and MAP.", "Connect priors to regularization.", "Understand that MAP is a point summary, not full Bayesian inference."],
      ai: "MAP explains common regularized training objectives and is useful when data are limited or domain knowledge constrains plausible parameters.",
      pitfalls: ["MAP depends on parameterization because density modes can move under transformation.", "A strong poor prior can dominate limited data.", "MAP discards posterior spread and multimodality."],
      example: "A Gaussian likelihood with a Gaussian zero-centered prior gives squared-error data loss plus lambda||theta||^2. The MAP estimate is ridge regression.",
      question: "When does MAP approach MLE?",
      answer: "When the prior is effectively flat over plausible parameters or the dataset is large enough for likelihood to dominate.",
      resources: [{ label: "Wikipedia: Maximum a posteriori estimation", url: "https://en.wikipedia.org/wiki/Maximum_a_posteriori_estimation" }]
    }),
    "confidence-intervals": detail({
      idea: "A confidence interval is a data-dependent range produced by a method designed to cover the true parameter at a stated rate over repeated samples.",
      how: "Choose an estimator, determine or approximate its standard error, select a confidence level, and add and subtract a critical-value-scaled standard error.",
      concepts: [
        concept("Interval estimate", "A range of plausible parameter values generated from sample data.", "[lower,upper]", "Mean estimate plus or minus a margin."),
        concept("Coverage", "Long-run fraction of intervals from repeated samples that contain the fixed true parameter.", "P_theta(theta in CI(D))=1-alpha", "95% procedure covers about 95% under assumptions."),
        concept("Standard error", "Estimated sampling spread of the point estimator.", "SE(theta_hat)", "Larger samples usually reduce it."),
        concept("Margin of error", "Critical value multiplied by standard error.", "critical * SE", "Determines half-width for symmetric intervals.")
      ],
      formulas: [formula("Wald-style interval", "estimate +/- critical_value * SE", "common approximate interval"), formula("Mean with known sigma", "X_bar +/- z_(1-alpha/2) sigma/sqrt(n)", "normal-theory mean interval"), formula("Approximate width", "width proportional to 1/sqrt(n)", "four times data roughly halves width")],
      caption: "Confidence belongs to the repeated-sampling procedure, not a probability assigned to a fixed parameter after calculation.",
      flow: [node("Repeat sampling", "many possible datasets"), node("Build interval", "same method each time"), node("Check coverage", "does interval contain theta?"), node("Long-run rate", "for example 95%")],
      learn: ["Interpret confidence through repeated coverage.", "Compute a simple interval.", "Relate sample size to width.", "Check assumptions behind normal or bootstrap intervals."],
      ai: "Intervals communicate uncertainty in model metrics, differences between systems, subgroup performance, and deployment monitoring.",
      pitfalls: ["A computed 95% frequentist interval does not literally give a 95% probability that the fixed theta is inside.", "Narrow intervals can still be biased.", "Repeated test-set reuse invalidates naive uncertainty calculations."],
      example: "A mean estimate is 10 with SE 2. An approximate 95% interval is 10 +/- 1.96*2=[6.08,13.92].",
      question: "How much more data is roughly needed to halve interval width?",
      answer: "Four times as much under the usual 1/sqrt(n) scaling.",
      resources: [{ label: "Wikipedia: Confidence interval", url: "https://en.wikipedia.org/wiki/Confidence_interval" }]
    }),
    "hypothesis-testing": detail({
      idea: "Hypothesis testing asks whether observed data would be unusually inconsistent with a baseline claim called the null hypothesis.",
      how: "State null and alternative hypotheses before inspecting results, choose a test statistic, calculate its null distribution or approximation, and compare the observation with a decision threshold.",
      concepts: [
        concept("Null hypothesis", "Baseline model used to measure surprise.", "H0", "No difference between model variants."),
        concept("Alternative hypothesis", "The effect or difference considered if H0 is rejected.", "H1", "Variant B changes conversion."),
        concept("Test statistic", "Data summary whose null behavior is known or simulated.", "T(D)", "Standardized difference in means."),
        concept("Decision errors", "Type I rejects a true null; Type II fails to reject a false null.", "alpha and beta", "False alarm versus missed effect.")
      ],
      formulas: [formula("Type I error", "alpha=P(reject H0 | H0 true)", "false-positive test rate"), formula("Type II error", "beta=P(fail to reject H0 | H1 true)", "miss rate"), formula("Power", "1-beta", "chance of detecting the specified effect")],
      caption: "A test turns a predeclared question and error tolerance into a decision rule.",
      flow: [node("State H0 and H1", "before results"), node("Choose statistic", "measure discrepancy"), node("Null reference", "expected variation under H0"), node("Decision", "reject or retain uncertainty")],
      learn: ["Write clear null and alternative hypotheses.", "Explain Type I and Type II errors.", "Choose one- or two-sided tests appropriately.", "Separate statistical evidence from practical importance."],
      ai: "Tests support controlled experiments, model comparisons, regression diagnostics, fairness analyses, and monitoring alerts.",
      pitfalls: ["Failing to reject H0 does not prove it true.", "Choosing hypotheses after seeing results inflates false positives.", "Assumption violations can invalidate reference distributions."],
      example: "An A/B test sets H0:p_A=p_B and H1:p_A!=p_B. A statistic compares observed proportions relative to expected sampling noise under equal rates.",
      question: "What is a Type I error in a model A/B test?",
      answer: "Concluding the models differ when their true performance is equal under the stated setup.",
      resources: [{ label: "Wikipedia: Statistical hypothesis test", url: "https://en.wikipedia.org/wiki/Statistical_hypothesis_test" }]
    }),
    "p-values-and-statistical-power": detail({
      idea: "A p-value measures how extreme the observed statistic or something more extreme would be if the null hypothesis were true. Power is the chance that a test detects a real effect of a specified size.",
      how: "Calculate the observed statistic, compare it with its distribution under H0 to obtain the p-value, and separately plan power using effect size, noise, sample size, and significance threshold.",
      concepts: [
        concept("p-value", "Tail probability under the null model, conditional on assumptions.", "P(T at least as extreme as observed | H0)", "Small p means data are unusual under H0."),
        concept("Significance level", "Preselected false-positive threshold.", "alpha", "Often 0.05, but context should determine it."),
        concept("Power", "Probability of rejecting H0 when a chosen alternative is true.", "1-beta", "Higher for larger effects and samples."),
        concept("Minimum detectable effect", "Smallest effect a design has adequate power to detect.", "MDE", "Product decision threshold for an experiment.")
      ],
      formulas: [formula("p-value", "P_H0(T >= T_observed) for a one-sided upper test", "null-tail probability"), formula("Power", "1-beta", "true-positive probability for a specified effect"), formula("Mean signal-to-noise", "effect / (sigma/sqrt(n))", "larger n raises detectability")],
      caption: "Evidence after an experiment and sensitivity before an experiment answer different questions.",
      flow: [node("Choose alpha and effect", "design stage"), node("Plan sample size", "target power"), node("Collect data", "compute statistic"), node("Report p and effect", "evidence plus magnitude")],
      learn: ["Interpret a p-value correctly.", "Relate alpha, beta, and power.", "Explain how sample size and effect size affect power.", "Plan around a meaningful minimum effect."],
      ai: "Model experiments need enough power to detect useful improvements and careful p-value interpretation to avoid shipping noise.",
      pitfalls: ["A p-value is not P(H0 is true).", "A tiny effect can be significant with huge data.", "Low-powered studies produce unstable estimates and miss real effects."],
      example: "A p-value of 0.03 means that under H0 and the test assumptions, results at least this extreme occur about 3% of the time. It does not mean H0 has 3% probability.",
      question: "What usually happens to power when sample size increases while everything else stays fixed?",
      answer: "Power increases because the estimator's standard error decreases.",
      resources: [{ label: "ASA: Statement on statistical significance and p-values", url: "https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf" }]
    }),
    bootstrap: detail({
      idea: "The bootstrap estimates sampling uncertainty by repeatedly resampling the observed dataset with replacement and recomputing the statistic.",
      how: "Treat the empirical dataset as a stand-in population. Draw many same-size bootstrap samples with replacement, calculate the statistic for each, and summarize the resulting bootstrap distribution.",
      concepts: [
        concept("Resampling with replacement", "Each observed row may appear zero, one, or several times in one bootstrap sample.", "sample n from n with replacement", "Preserves sample size while perturbing composition."),
        concept("Bootstrap distribution", "Distribution of replicated statistics across resamples.", "theta_hat*", "Approximates the estimator's sampling distribution."),
        concept("Bootstrap standard error", "Standard deviation of bootstrap estimates.", "sd(theta_hat*_1,...,theta_hat*_B)", "Uncertainty estimate without a closed formula."),
        concept("Bootstrap interval", "Uses bootstrap quantiles or adjusted methods to form a range.", "percentile or BCa", "Different methods handle bias and skew differently.")
      ],
      formulas: [formula("Replicate", "theta_hat*_b=T(D*_b)", "statistic on bootstrap sample b"), formula("Bootstrap SE", "sqrt(sum_b(theta_hat*_b-mean*)^2/(B-1))", "spread of replicates"), formula("Percentile interval", "[quantile_(alpha/2), quantile_(1-alpha/2)]", "simple bootstrap interval")],
      caption: "Resampling the observed rows simulates how a statistic changes under repeated datasets.",
      flow: [node("Observed sample", "n rows"), node("Resample with replacement", "create D*"), node("Recompute statistic", "theta_hat*"), node("Repeat and summarize", "SE or interval")],
      learn: ["Construct a bootstrap sample.", "Generate a bootstrap distribution.", "Estimate standard error and intervals.", "Recognize dependent-data and small-sample limitations."],
      ai: "Bootstrap methods quantify uncertainty for complex metrics, model comparisons, feature importance, and ensemble procedures such as bagging.",
      pitfalls: ["Bootstrap cannot repair an unrepresentative original sample.", "Rows are not exchangeable in time series, groups, or spatial data; use structured resampling.", "Very small samples may poorly approximate the population."],
      example: "For data [1,2,8], one bootstrap sample might be [2,2,8] and another [1,8,8]. Repeating thousands of times reveals uncertainty in the sample median or mean.",
      question: "Why can the same observed row appear several times in a bootstrap sample?",
      answer: "Because sampling is with replacement, which mimics draws from the empirical distribution.",
      resources: [{ label: "Wikipedia: Bootstrapping", url: "https://en.wikipedia.org/wiki/Bootstrapping_(statistics)" }]
    }),
    "bayesian-inference": detail({
      idea: "Bayesian inference represents uncertainty about parameters with probability distributions and updates those distributions after observing data.",
      how: "Specify a prior p(theta), write likelihood p(D|theta), multiply them, and normalize to obtain posterior p(theta|D). Use the posterior for summaries, predictions, and decisions.",
      concepts: [
        concept("Prior", "Parameter uncertainty before the current data.", "p(theta)", "Domain-informed or weakly regularizing belief."),
        concept("Likelihood", "How the model scores observed data for each parameter.", "p(D|theta)", "Connects assumptions to observations."),
        concept("Posterior", "Updated uncertainty after combining prior and likelihood.", "p(theta|D)", "A distribution, not only one estimate."),
        concept("Credible interval", "Posterior range containing a chosen probability mass.", "P(theta in C|D)=0.95", "Direct probability statement conditional on model and data.")
      ],
      formulas: [formula("Bayes", "p(theta|D)=p(D|theta)p(theta)/p(D)", "posterior update"), formula("Evidence", "p(D)=integral p(D|theta)p(theta)dtheta", "normalizing probability of data"), formula("Posterior expectation", "E[g(theta)|D]=integral g(theta)p(theta|D)dtheta", "average posterior quantity")],
      caption: "Bayesian inference updates a complete uncertainty distribution rather than only choosing one parameter.",
      flow: [node("Prior", "belief before D"), node("Likelihood", "data model"), node("Posterior", "updated uncertainty"), node("Prediction or decision", "integrate over theta")],
      learn: ["Construct the Bayesian update conceptually.", "Distinguish likelihood from posterior.", "Interpret credible intervals.", "Explain how priors and data trade influence."],
      ai: "Bayesian methods support uncertainty-aware predictions, online updating, hierarchical models, data-efficient learning, and principled decisions.",
      pitfalls: ["Posterior validity depends on model and prior assumptions.", "An overly restrictive prior can dominate small datasets.", "Exact normalization is often intractable, requiring sampling or approximation."],
      example: "A Beta(2,2) prior for click probability combined with 8 clicks and 2 non-clicks gives Beta(10,4) posterior, representing both a shifted mean and remaining uncertainty.",
      question: "What is the main difference between a posterior distribution and a MAP estimate?",
      answer: "The posterior retains uncertainty over all parameter values; MAP keeps only its highest-density point.",
      resources: [{ label: "Stanford Encyclopedia: Bayesian epistemology", url: "https://plato.stanford.edu/entries/epistemology-bayesian/" }]
    }),
    "conjugate-priors": detail({
      idea: "A conjugate prior is chosen so that multiplying it by the likelihood produces a posterior in the same distribution family. This makes Bayesian updating algebraically simple.",
      how: "Match a likelihood family with its conjugate prior, express data through sufficient statistics, and update prior hyperparameters by adding those statistics.",
      concepts: [
        concept("Conjugacy", "Prior and posterior share a named family.", "prior family -> same posterior family", "Beta prior with Bernoulli likelihood."),
        concept("Hyperparameters", "Numbers controlling the prior distribution.", "alpha,beta", "They often act like prior counts."),
        concept("Sufficient statistics", "Compressed data quantities needed for the posterior update.", "successes and failures", "Raw order of coin flips is unnecessary."),
        concept("Sequential updating", "Today's posterior becomes tomorrow's prior.", "p(theta|D_1,D_2)", "Update batches without storing all old data when the model allows.")
      ],
      formulas: [formula("Beta-Bernoulli", "Beta(alpha,beta)+s successes,f failures -> Beta(alpha+s,beta+f)", "add binary counts"), formula("Dirichlet-categorical", "alpha'_k=alpha_k+n_k", "add category counts"), formula("Posterior proportionality", "posterior proportional to likelihood * prior", "conjugacy closes the algebra")],
      caption: "Conjugacy turns Bayesian updating into simple hyperparameter bookkeeping.",
      flow: [node("Conjugate prior", "known family"), node("Observe sufficient statistics", "compressed data"), node("Update hyperparameters", "often add counts"), node("Same posterior family", "easy next update")],
      learn: ["Define conjugacy.", "Perform Beta-Bernoulli and Dirichlet-categorical updates.", "Identify sufficient statistics.", "Explain convenience versus modelling flexibility."],
      ai: "Conjugate models provide interpretable baselines, online updates, Bayesian smoothing, and building blocks for larger probabilistic systems.",
      pitfalls: ["Convenience does not guarantee the prior family fits domain knowledge.", "Hyperparameters are not always literal observations.", "Modern complex likelihoods often lack useful conjugate priors."],
      example: "Start Beta(1,1), observe 7 successes and 3 failures, and obtain Beta(8,4). A later batch of 2 successes and 1 failure updates it to Beta(10,5).",
      question: "What statistics from Bernoulli data are needed for a Beta posterior?",
      answer: "Only the counts of successes and failures.",
      resources: [{ label: "Wikipedia: Conjugate prior", url: "https://en.wikipedia.org/wiki/Conjugate_prior" }]
    }),
    "posterior-predictive-distributions": detail({
      idea: "A posterior predictive distribution describes future observations by averaging predictions over posterior uncertainty in the model parameters.",
      how: "For each plausible theta, calculate p(x_new|theta), weight it by p(theta|D), and integrate or average. This includes both outcome noise and uncertainty about theta.",
      concepts: [
        concept("Parameter uncertainty", "Many parameter values remain plausible after finite data.", "p(theta|D)", "Posterior spread."),
        concept("Conditional prediction", "Future-outcome model at one fixed parameter.", "p(x_new|theta)", "Bernoulli outcome for a chosen p."),
        concept("Posterior predictive", "Mixture of conditional predictions over the posterior.", "p(x_new|D)", "Accounts for uncertain p."),
        concept("Predictive check", "Compare simulated replicated data with observed patterns.", "x_rep~p(x|D)", "Detect model mismatch.")
      ],
      formulas: [formula("Posterior predictive", "p(x_new|D)=integral p(x_new|theta)p(theta|D)dtheta", "average predictions over posterior"), formula("Monte Carlo", "p(x_new|D) approximately (1/S)sum_s p(x_new|theta_s)", "posterior-sample approximation"), formula("Predictive mean", "E[X_new|D]=E_theta[E[X_new|theta]|D]", "law of iterated expectation")],
      caption: "Prediction carries parameter uncertainty forward into future-outcome uncertainty.",
      flow: [node("Posterior p(theta|D)", "parameter uncertainty"), node("Draw theta", "plausible model"), node("Draw future x", "outcome uncertainty"), node("Aggregate", "posterior predictive")],
      learn: ["Distinguish posterior parameter uncertainty from predictive uncertainty.", "Write the predictive integral.", "Approximate predictions using posterior samples.", "Use posterior predictive checks."],
      ai: "Bayesian forecasting, uncertainty intervals, anomaly detection, model criticism, and risk-aware decisions rely on posterior predictive distributions.",
      pitfalls: ["Plugging in one point estimate understates parameter uncertainty.", "A well-calculated predictive distribution can still be wrong under model misspecification.", "Checks should target features relevant to the application."],
      example: "With posterior p~Beta(10,4), the predictive probability of success on the next Bernoulli trial is E[p|D]=10/14 about 0.714.",
      question: "Why is posterior predictive uncertainty usually wider than prediction at a fixed parameter?",
      answer: "It includes variation in both the future observation and the uncertain parameter.",
      resources: [{ label: "Wikipedia: Posterior predictive distribution", url: "https://en.wikipedia.org/wiki/Posterior_predictive_distribution" }]
    }),
    "missing-data-mechanisms": detail({
      idea: "Missing-data mechanisms describe how the chance of a value being missing relates to observed and unobserved information. That relationship determines which analyses are trustworthy.",
      how: "Create a missingness indicator R, ask which variables predict R, and classify the assumption as MCAR, MAR, or MNAR before choosing deletion, imputation, weighting, or sensitivity analysis.",
      concepts: [
        concept("MCAR", "Missingness is unrelated to observed or missing values.", "R independent of data", "Random sensor packet loss unrelated to readings."),
        concept("MAR", "Missingness may depend on observed data but not the missing value after conditioning.", "R independent of X_mis | X_obs", "Response depends on known age group."),
        concept("MNAR", "Missingness still depends on the unseen value after observed data are considered.", "R depends on X_mis", "Very high incomes are less likely to be reported."),
        concept("Imputation", "Fill missing values while preserving uncertainty and relationships as well as possible.", "single or multiple imputation", "Model-based draws rather than one fixed mean.")
      ],
      formulas: [formula("Missingness indicator", "R_i=1 if observed, 0 if missing", "model whether values are present"), formula("Inverse probability weight", "w_i=1/P(R_i=1|X_obs)", "reweight observed cases under assumptions"), formula("Multiple imputation", "total variance = within + between imputation variance", "include imputation uncertainty")],
      caption: "The reason data are missing matters more than the blank cell itself.",
      flow: [node("Observe missing values", "create indicators"), node("Study predictors of missingness", "observed patterns"), node("State MCAR/MAR/MNAR assumption", "cannot always verify"), node("Analyze and test sensitivity", "avoid false certainty")],
      learn: ["Distinguish MCAR, MAR, and MNAR.", "Use missingness indicators diagnostically.", "Explain deletion and imputation assumptions.", "Plan sensitivity analysis for MNAR uncertainty."],
      ai: "Missing features affect training, evaluation, fairness, and live inference. Models can learn missingness patterns that change across environments.",
      pitfalls: ["Mean imputation shrinks variance and distorts relationships.", "Dropping incomplete rows is safe only under restrictive conditions.", "MNAR cannot generally be resolved from observed data alone."],
      example: "If lab tests are ordered more often for older patients and age is observed, missingness may be MAR given age. If severe unseen symptoms directly cause tests, the mechanism may be MNAR.",
      question: "Which mechanism says missingness is unrelated to both observed and unobserved values?",
      answer: "MCAR: missing completely at random.",
      resources: [{ label: "Wikipedia: Missing data", url: "https://en.wikipedia.org/wiki/Missing_data" }]
    }),
    "experimental-design": detail({
      idea: "Experimental design plans how units receive treatments and how outcomes are measured so differences can be interpreted causally rather than confused with pre-existing differences.",
      how: "Define the estimand, choose eligible units, randomize treatment, control measurement and analysis decisions, estimate required sample size, and monitor without compromising validity.",
      concepts: [
        concept("Treatment and control", "Groups that differ in the intervention of interest.", "T=1 versus T=0", "New ranking model versus current model."),
        concept("Randomization", "Assigns treatment by chance to balance known and unknown confounders on average.", "T independent of potential outcomes", "User-level random assignment."),
        concept("Blocking and stratification", "Randomize within important subgroups to improve balance and precision.", "blocks", "Separate assignment within country."),
        concept("Pre-registration", "Declare hypotheses, metrics, exclusions, and analysis before outcomes are known.", "analysis plan", "Reduces researcher degrees of freedom.")
      ],
      formulas: [formula("Difference in means", "effect_hat=Y_bar_treatment-Y_bar_control", "basic randomized effect estimate"), formula("Standard error", "SE(diff)=sqrt(s_T^2/n_T+s_C^2/n_C)", "sampling uncertainty under independent groups"), formula("Power drivers", "power increases with effect and n, decreases with noise", "plan adequate sample size")],
      caption: "Good design creates comparable groups before statistical analysis begins.",
      flow: [node("Define estimand", "what effect matters"), node("Randomize", "create comparable groups"), node("Measure consistently", "avoid differential bias"), node("Analyze as planned", "estimate effect and uncertainty")],
      learn: ["Define treatment, control, outcome, and estimand.", "Explain why randomization supports causal inference.", "Use blocking and power planning.", "Recognize interference, attrition, and noncompliance."],
      ai: "Online experiments evaluate product and model changes, while offline benchmark design determines whether comparisons are fair and reproducible.",
      pitfalls: ["Randomization does not fix biased outcome measurement.", "Peeking and stopping on significance inflates false positives.", "User interference and repeated exposure can violate independence."],
      example: "Randomly assign users to old or new recommender, predefine retention as the primary outcome, stratify by country, and analyze every assigned user under intention-to-treat.",
      question: "What is the main causal benefit of random assignment?",
      answer: "It makes treatment independent of potential outcomes on average, reducing confounding between groups.",
      resources: [{ label: "Wikipedia: Design of experiments", url: "https://en.wikipedia.org/wiki/Design_of_experiments" }]
    }),
    "multiple-testing-correction": detail({
      idea: "When many hypotheses are tested, some small p-values appear by chance. Multiple-testing corrections adjust decision rules to control the overall error burden.",
      how: "Define the family of tests, choose whether to control any false positive or the expected fraction among discoveries, then apply a procedure such as Bonferroni or Benjamini-Hochberg.",
      concepts: [
        concept("Family-wise error rate", "Probability of at least one false rejection in a family.", "FWER", "Strict control for high-consequence claims."),
        concept("False discovery rate", "Expected fraction of false positives among rejected hypotheses.", "FDR", "Useful when screening many candidates."),
        concept("Bonferroni", "Test each of m hypotheses at alpha/m.", "p_i<=alpha/m", "Simple FWER control, often conservative."),
        concept("Benjamini-Hochberg", "Ranks p-values and controls FDR under suitable conditions.", "p_(k)<=k alpha/m", "More power for discovery settings.")
      ],
      formulas: [formula("No-correction risk", "P(at least one false positive)=1-(1-alpha)^m", "under independent true null tests"), formula("Bonferroni", "alpha_each=alpha/m", "control FWER by stricter threshold"), formula("BH threshold", "p_(k)<=k q/m", "largest accepted ranked p-value")],
      caption: "More tests require a policy for how false discoveries accumulate.",
      flow: [node("Define test family", "which claims belong together"), node("Choose FWER or FDR", "error objective"), node("Adjust thresholds", "Bonferroni or BH"), node("Report discoveries", "with corrected evidence")],
      learn: ["Explain why uncorrected testing inflates errors.", "Distinguish FWER from FDR.", "Apply Bonferroni.", "Describe the Benjamini-Hochberg ranking idea."],
      ai: "Feature screening, subgroup analysis, benchmark comparisons, monitoring dashboards, and large experiment programs create many simultaneous claims.",
      pitfalls: ["The test family must be defined honestly.", "Correction does not repair selective reporting.", "Dependence among tests affects some procedures and their power."],
      example: "With 20 independent true null tests at alpha=0.05, the chance of at least one false positive is about 1-0.95^20=0.642. Bonferroni uses 0.0025 per test.",
      question: "What threshold does Bonferroni use for 10 tests and family alpha=0.05?",
      answer: "0.05/10=0.005 per test.",
      resources: [{ label: "Wikipedia: Multiple comparisons problem", url: "https://en.wikipedia.org/wiki/Multiple_comparisons_problem" }]
    }),
    "effect-size": detail({
      idea: "Effect size measures how large a difference or relationship is. Statistical significance asks whether an effect is distinguishable from noise, while effect size asks whether it matters.",
      how: "Choose a scale suited to the question: raw difference, standardized difference, risk ratio, odds ratio, correlation, or another domain-relevant measure. Report uncertainty around it.",
      concepts: [
        concept("Raw effect", "Difference in original outcome units.", "Delta=mu_1-mu_0", "Two percentage-point conversion increase."),
        concept("Standardized effect", "Difference relative to within-group spread.", "Cohen's d=(mean_1-mean_0)/s_pooled", "Comparable across similarly interpreted outcomes."),
        concept("Relative effect", "Ratio or relative change between groups.", "risk ratio=p_1/p_0", "A 20% relative increase can be small in absolute terms."),
        concept("Practical significance", "Whether magnitude justifies cost, risk, or action.", "decision threshold", "Latency improvement large enough for users to notice.")
      ],
      formulas: [formula("Mean difference", "Delta=Y_bar_1-Y_bar_0", "effect in original units"), formula("Cohen's d", "d=(Y_bar_1-Y_bar_0)/s_pooled", "standardized mean difference"), formula("Risk ratio", "RR=p_1/p_0", "relative event probability")],
      caption: "Evidence strength and effect magnitude are separate inputs to a decision.",
      flow: [node("Estimate difference", "raw magnitude"), node("Choose scale", "absolute or standardized"), node("Add uncertainty", "interval"), node("Compare with decision threshold", "practical importance")],
      learn: ["Separate effect size from p-value.", "Compute raw and standardized effects.", "Compare absolute and relative changes.", "Use domain thresholds and uncertainty in decisions."],
      ai: "Model changes should be judged by meaningful metric improvements, subgroup impacts, cost, and risk, not merely by statistical detectability.",
      pitfalls: ["Standardized effects can hide important original units.", "Relative changes can exaggerate tiny baselines.", "A large uncertain estimate and a small precise estimate require different decisions."],
      example: "Conversion rises from 1.0% to 1.2%. Absolute effect is 0.2 percentage points; relative increase is 20%. Both descriptions are true but support different intuition.",
      question: "Can an effect be statistically significant but practically unimportant?",
      answer: "Yes. With enough data, a very small effect can be estimated precisely and produce a tiny p-value.",
      resources: [{ label: "Wikipedia: Effect size", url: "https://en.wikipedia.org/wiki/Effect_size" }]
    }),
    calibration: detail({
      idea: "A probabilistic model is calibrated when predictions made with confidence p are correct about p of the time among comparable cases.",
      how: "Group predictions by score, compare average predicted probability with observed frequency in each group, summarize the gap, and recalibrate on representative validation data when needed.",
      concepts: [
        concept("Reliability", "Agreement between predicted probabilities and empirical frequencies.", "P(Y=1|score=p)=p", "Among 0.8 predictions, about 80% are positive."),
        concept("Reliability diagram", "Plots observed frequency against mean confidence by bins.", "frequency versus confidence", "Perfect calibration follows the diagonal."),
        concept("Brier score", "Mean squared error of probability predictions.", "(1/n)sum_i(p_i-y_i)^2", "Combines calibration and refinement."),
        concept("Recalibration", "Learns a mapping from raw scores to improved probabilities.", "temperature, Platt, isotonic", "Fit on held-out representative data.")
      ],
      formulas: [formula("Calibration condition", "P(Y=1|P_hat=p)=p", "predicted and observed rates agree"), formula("Brier score", "BS=(1/n)sum_i(p_i-y_i)^2", "proper score for binary probabilities"), formula("Expected calibration error", "ECE=sum_b (n_b/n)|accuracy_b-confidence_b|", "binned summary with limitations")],
      caption: "Calibration compares what the model says will happen with what actually happens.",
      flow: [node("Collect probabilities", "model confidence"), node("Group comparable scores", "bins or smooth estimate"), node("Measure outcomes", "empirical frequency"), node("Compare and recalibrate", "close reliability gap")],
      learn: ["State the calibration condition.", "Read a reliability diagram.", "Compute a simple Brier score.", "Distinguish calibration from discrimination and accuracy."],
      ai: "Reliable probabilities matter for medical triage, fraud thresholds, human review, expected-cost decisions, abstention, and uncertainty communication.",
      pitfalls: ["A model can be calibrated but uninformative by always predicting the base rate.", "Bin-based ECE depends heavily on bin choices.", "Calibration can fail after distribution shift."],
      example: "If 100 predictions near 0.7 contain 50 positives, that region is overconfident. A calibrated system would show about 70 positives.",
      question: "Can a model with high classification accuracy still be poorly calibrated?",
      answer: "Yes. It may rank and classify correctly while its probability values are systematically too high or too low.",
      resources: [{ label: "scikit-learn: Probability calibration", url: "https://scikit-learn.org/stable/modules/calibration.html" }]
    }),
    "distribution-shift": detail({
      idea: "Distribution shift occurs when the data-generating conditions at deployment differ from those used for training or validation. Past performance may then stop predicting future performance.",
      how: "Identify which part changed: inputs, labels given inputs, class proportions, or measurement process. Monitor both data and outcomes, evaluate on recent representative slices, and adapt only with causal and operational context.",
      concepts: [
        concept("Covariate shift", "Input distribution changes while P(Y|X) is assumed stable.", "P_train(X)!=P_test(X)", "Different user demographics."),
        concept("Label shift", "Class proportions change while P(X|Y) is assumed stable.", "P_train(Y)!=P_test(Y)", "Fraud prevalence rises."),
        concept("Concept shift", "Relationship between inputs and labels changes.", "P_train(Y|X)!=P_test(Y|X)", "User behavior changes after a product redesign."),
        concept("Monitoring", "Track feature, prediction, outcome, and performance distributions over time.", "drift metrics and delayed labels", "Alerts require investigation, not automatic conclusions.")
      ],
      formulas: [formula("Covariate importance weight", "w(x)=p_test(x)/p_train(x)", "reweight training examples under assumptions"), formula("Population risk", "R_test=E_test[loss(f(X),Y)]", "deployment performance target"), formula("Drift divergence", "D(P_test || P_train)", "one family of distribution difference measures")],
      caption: "Shift breaks the assumption that validation and deployment come from the same process.",
      flow: [node("Training distribution", "past data"), node("Deployment process changes", "users, policies, sensors"), node("Detect shift", "features, scores, labels"), node("Diagnose and respond", "reweight, retrain, redesign")],
      learn: ["Distinguish covariate, label, and concept shift.", "Define deployment risk.", "Use representative temporal and subgroup evaluation.", "Connect monitoring signals to response plans."],
      ai: "Distribution shift is a central reason production models decay, become miscalibrated, or harm newly underrepresented groups.",
      pitfalls: ["A feature-distribution change does not prove performance changed.", "No feature drift does not guarantee stable P(Y|X).", "Blind retraining can learn feedback loops or corrupted labels."],
      example: "A fraud model trained when fraud prevalence was 1% is deployed during an attack at 5%. Scores and calibration change even if class-conditional behavior remains similar: a label-shift scenario.",
      question: "Which type of shift changes P(Y|X)?",
      answer: "Concept shift, also called conditional or concept drift in many contexts.",
      resources: [{ label: "Google Research: Dataset shift in machine learning", url: "https://research.google/pubs/dataset-shift-in-machine-learning/" }]
    })
  };

  const expandedDetails = {
    "populations-and-samples": {
      prerequisites: ["Random variables and distributions.", "Means and proportions.", "The distinction between observation and target."],
      notationGuide: [{ symbol: "N", latex: "N", meaning: "Population size when finite." }, { symbol: "n", latex: "n", meaning: "Sample size." }, { symbol: "mu", latex: "\\mu", meaning: "Population mean parameter." }, { symbol: "X_bar", latex: "\\bar X", meaning: "Sample mean statistic." }],
      formulaLatex: ["\\bar X=\\frac1n\\sum_{i=1}^nX_i", "\\hat p=\\frac{\\text{successes}}n", "\\operatorname{SE}(\\bar X)\\approx\\frac{s}{\\sqrt n}"],
      derivation: { title: "Why sampling quality matters", steps: ["Define the population and the quantity you want to estimate.", "Specify how units enter the sample.", "A random or representative mechanism makes sample statistics reflect population variation.", "A large biased sample reduces random noise but does not remove systematic selection error."] },
      workedExamples: [{ title: "Estimate a mean", setup: "A random sample of 100 response times has mean 240 ms and standard deviation 50 ms.", steps: ["The sample mean estimates population mean.", "Estimated standard error is 50/sqrt(100).", "Report estimate with its sampling uncertainty."], result: "Estimated mean is 240 ms with standard error 5 ms." }, { title: "Selection bias", setup: "A satisfaction survey is shown only to users who completed checkout.", steps: ["The target may be all site visitors.", "Abandoning users cannot enter the sample.", "Their satisfaction may systematically differ."], result: "Even millions of responses would not represent all visitors without addressing selection." }],
      exercises: [{ level: "Beginner", question: "Identify population and sample when 500 voters are polled to estimate all city voters' preferences.", answer: "Population is all eligible city voters; sample is the 500 respondents." }, { level: "Intermediate", question: "If sample standard deviation is 20 at n=400, estimate mean standard error.", answer: "20/sqrt(400)=1." }, { level: "Applied", question: "Why can logged product data be an unrepresentative sample of intended users?", answer: "Only users who access, consent to, and interact with the product appear; deployment and logging mechanisms select observations." }],
      takeaways: ["A population is the inferential target; a sample is observed evidence.", "Sampling design determines what can generalize.", "Larger n reduces random error at about 1/sqrt(n).", "Systematic bias does not disappear merely by collecting more similarly selected data."]
    },
    "bias-and-variance": {
      prerequisites: ["Expectation and variance.", "Estimators and repeated samples.", "Prediction error."],
      notationGuide: [{ symbol: "theta_hat", latex: "\\hat\\theta", meaning: "Estimator computed from data." }, { symbol: "Bias", latex: "\\operatorname{Bias}(\\hat\\theta)", meaning: "Difference between expected estimate and true parameter." }, { symbol: "Var(theta_hat)", latex: "\\operatorname{Var}(\\hat\\theta)", meaning: "Sampling variability of the estimator." }, { symbol: "MSE", latex: "\\operatorname{MSE}", meaning: "Expected squared estimation error." }],
      formulaLatex: ["\\operatorname{Bias}(\\hat\\theta)=\\mathbb E[\\hat\\theta]-\\theta", "\\mathbb E[(\\hat f-f)^2]=\\operatorname{Bias}^2+\\operatorname{Variance}+\\operatorname{Noise}", "\\operatorname{Var}(\\text{average})\\downarrow\\text{ when errors are diverse}"],
      derivation: { title: "Decompose estimator mean squared error", steps: ["Write theta_hat-theta=(theta_hat-E theta_hat)+(E theta_hat-theta).", "Square both terms and expand.", "The cross term has expectation zero because theta_hat-E theta_hat is centered.", "The remaining terms are variance plus squared bias."] },
      workedExamples: [{ title: "Biased stable estimator", setup: "Estimator A always returns theta+1.", steps: ["Its bias is 1.", "Its variance is zero.", "MSE is 1 squared plus zero."], result: "A is perfectly stable but systematically wrong, with MSE 1." }, { title: "Averaging models", setup: "Several models have noisy, imperfectly correlated prediction errors.", steps: ["Averaging retains shared bias.", "Unshared fluctuations partly cancel.", "Variance reduction depends on error diversity."], result: "Ensembles often reduce variance without eliminating systematic bias." }],
      exercises: [{ level: "Beginner", question: "An estimator has expected value 12 for true theta=10. What is its bias?", answer: "2." }, { level: "Intermediate", question: "If bias=1.5 and variance=4, what is estimator MSE?", answer: "1.5^2+4=6.25." }, { level: "Applied", question: "How can stronger regularization change bias and variance?", answer: "It usually raises bias by restricting fit but lowers variance by reducing sensitivity to the sample." }],
      takeaways: ["Bias measures systematic error across repeated datasets.", "Variance measures sensitivity to the particular sample.", "Low training error does not imply low bias or variance on new data.", "Good modelling balances these components for the deployment target."]
    },
    "point-estimation": {
      prerequisites: ["Populations, samples, and statistics.", "Expectation and variance.", "Loss functions."],
      notationGuide: [{ symbol: "theta", latex: "\\theta", meaning: "Unknown population parameter." }, { symbol: "theta_hat", latex: "\\hat\\theta=T(D)", meaning: "Point estimate computed from dataset D." }, { symbol: "s^2", latex: "s^2", meaning: "Sample variance estimate." }, { symbol: "MSE", latex: "\\operatorname{MSE}(\\hat\\theta)", meaning: "Expected squared distance from theta." }],
      formulaLatex: ["\\hat\\mu=\\frac1n\\sum_i x_i", "s^2=\\frac1{n-1}\\sum_i(x_i-\\bar X)^2", "\\operatorname{MSE}(\\hat\\theta)=\\operatorname{Bias}^2+\\operatorname{Variance}"],
      derivation: { title: "Why sample variance uses n minus one", steps: ["Residuals x_i-X_bar always sum to zero.", "After estimating the mean, only n-1 residuals can vary independently.", "Dividing by n would underestimate population variance on average.", "Dividing by n-1 corrects that bias under independent identical sampling."] },
      workedExamples: [{ title: "Estimate a Bernoulli probability", setup: "Observe 37 successes in 50 trials.", steps: ["Use sample proportion successes/n.", "Compute 37/50.", "Recognize this is one estimate, not the exact parameter."], result: "p_hat=0.74." }, { title: "Compare estimators", setup: "One estimator has bias 0 and variance 9; another bias 1 and variance 2.", steps: ["First MSE is 9.", "Second MSE is 1^2+2=3.", "Unbiasedness alone does not choose the best squared-error estimator."], result: "The biased second estimator has lower MSE." }],
      exercises: [{ level: "Beginner", question: "Find sample mean of 2,4,9.", answer: "5." }, { level: "Intermediate", question: "Why is a point estimate incomplete without uncertainty?", answer: "Different samples would give different values; a point alone does not show precision or plausible variation." }, { level: "Applied", question: "What should define a good estimator besides bias?", answer: "Variance, MSE, robustness, computational cost, assumptions, and relevance to the intended estimand." }],
      takeaways: ["A point estimator maps a dataset to one parameter guess.", "Estimator quality is a repeated-sampling property.", "Unbiased is not synonymous with best.", "Point estimates should normally be accompanied by uncertainty and assumptions."]
    },
    "maximum-likelihood-estimation": {
      prerequisites: ["Probability models and densities.", "Independent samples.", "Logarithms and optimization."],
      notationGuide: [{ symbol: "L(theta)", latex: "L(\\theta)", meaning: "Likelihood viewed as a function of parameters." }, { symbol: "ell(theta)", latex: "\\ell(\\theta)", meaning: "Log-likelihood." }, { symbol: "theta_hat_MLE", latex: "\\hat\\theta_{\\mathrm{MLE}}", meaning: "Parameter maximizing likelihood." }, { symbol: "D", latex: "D", meaning: "Observed dataset treated as fixed during estimation." }],
      formulaLatex: ["L(\\theta)=\\prod_i p_\\theta(x_i)", "\\ell(\\theta)=\\sum_i\\log p_\\theta(x_i)", "\\hat\\theta_{\\mathrm{MLE}}=\\arg\\max_\\theta\\ell(\\theta)"],
      derivation: { title: "Find the Bernoulli MLE", steps: ["For s successes and f failures, likelihood is p^s(1-p)^f.", "Log likelihood is s log p+f log(1-p).", "Differentiate and set s/p-f/(1-p)=0.", "Solve p=s/(s+f), the sample success proportion."] },
      workedExamples: [{ title: "Gaussian mean MLE", setup: "Assume x_i~N(mu,sigma^2) with known sigma.", steps: ["Drop constants from log likelihood.", "Maximizing is minimizing sum_i(x_i-mu)^2.", "Differentiate and solve."], result: "mu_hat_MLE is the sample mean." }, { title: "Log-space stability", setup: "Multiply 1,000 probabilities near 0.01.", steps: ["The raw product underflows toward zero.", "Logs turn products into sums.", "Argmax is unchanged because log is increasing."], result: "Optimize summed log-likelihood for numerical stability." }],
      exercises: [{ level: "Beginner", question: "Why may likelihood exceed one for continuous data?", answer: "It is built from density values, which can exceed one; likelihood is not a probability distribution over theta unless normalized separately." }, { level: "Intermediate", question: "What is MLE p after 8 successes and 2 failures?", answer: "0.8." }, { level: "Applied", question: "Why can a flexible model's MLE overfit?", answer: "It maximizes fit to observed data without automatically penalizing complexity or accounting for future-data uncertainty." }],
      takeaways: ["Likelihood asks which parameter makes observed data most plausible under the model.", "Log-likelihood is equivalent for optimization and more stable.", "MLE depends on model assumptions.", "Large-sample strengths do not prevent finite-sample bias or overfitting."]
    },
    "maximum-a-posteriori-estimation": {
      prerequisites: ["Bayes' theorem.", "Maximum likelihood.", "Prior distributions and regularization."],
      notationGuide: [{ symbol: "p(theta)", latex: "p(\\theta)", meaning: "Prior density over parameters." }, { symbol: "p(theta|D)", latex: "p(\\theta\\mid D)", meaning: "Posterior density after data." }, { symbol: "theta_hat_MAP", latex: "\\hat\\theta_{\\mathrm{MAP}}", meaning: "Posterior mode." }, { symbol: "lambda", latex: "\\lambda", meaning: "Regularization strength related to prior scale." }],
      formulaLatex: ["p(\\theta\\mid D)\\propto p(D\\mid\\theta)p(\\theta)", "\\hat\\theta_{\\mathrm{MAP}}=\\arg\\max_\\theta[\\log p(D\\mid\\theta)+\\log p(\\theta)]", "-\\log p(\\theta)\\propto\\lVert\\theta\\rVert_2^2"],
      derivation: { title: "Connect a Gaussian prior to L2 regularization", steps: ["Assume theta~N(0,tau^2 I).", "Its log prior equals a constant minus ||theta||^2/(2tau^2).", "MAP maximizes log likelihood plus this log prior.", "Equivalently minimize negative log likelihood plus lambda||theta||^2 with lambda tied to 1/(2tau^2)."] },
      workedExamples: [{ title: "Shrink a noisy estimate", setup: "A small dataset suggests a large parameter, but prior centers near zero.", steps: ["Likelihood pulls toward the data estimate.", "Prior pulls toward zero.", "Posterior mode balances their relative precision."], result: "MAP is shrunk toward zero compared with MLE." }, { title: "MAP versus posterior mean", setup: "A posterior is strongly skewed.", steps: ["MAP chooses its highest-density point.", "Posterior mean averages all parameter values.", "The two summaries need not coincide."], result: "MAP is one optimization-based summary, not full Bayesian uncertainty." }],
      exercises: [{ level: "Beginner", question: "What happens to MAP when the prior is constant over the feasible region?", answer: "It matches MLE." }, { level: "Intermediate", question: "What regularizer corresponds to an independent Laplace prior?", answer: "An L1 penalty, up to scale constants." }, { level: "Applied", question: "Why is MAP sensitive to parameterization?", answer: "A density mode changes under nonlinear transformations because density includes coordinate-volume effects." }],
      takeaways: ["MAP combines likelihood with a prior preference.", "Many regularizers have prior interpretations.", "MAP returns a mode, not a posterior distribution.", "Prior scale controls shrinkage and should be justified or tuned carefully."]
    },
    "confidence-intervals": {
      prerequisites: ["Sampling distributions and standard errors.", "Normal and t distributions.", "Point estimation."],
      notationGuide: [{ symbol: "1-alpha", latex: "1-\\alpha", meaning: "Long-run coverage level." }, { symbol: "SE", latex: "\\operatorname{SE}", meaning: "Estimator standard error." }, { symbol: "z_(1-alpha/2)", latex: "z_{1-\\alpha/2}", meaning: "Standard-normal critical quantile." }, { symbol: "CI", latex: "[L(D),U(D)]", meaning: "Data-dependent interval procedure." }],
      formulaLatex: ["\\text{estimate}\\pm\\text{critical value}\\times\\operatorname{SE}", "\\bar X\\pm z_{1-\\alpha/2}\\frac\\sigma{\\sqrt n}", "\\text{width}\\propto\\frac1{\\sqrt n}"],
      derivation: { title: "Construct a normal-theory mean interval", steps: ["Under the model, (X_bar-mu)/(sigma/sqrt n) is standard normal.", "The central 1-alpha probability lies between -z and z.", "Multiply through by sigma/sqrt n.", "Rearrange inequalities to isolate mu around observed X_bar."] },
      workedExamples: [{ title: "Known-scale interval", setup: "X_bar=100, sigma=15, n=100, and use 95% z=1.96.", steps: ["SE=15/10=1.5.", "Margin is 1.96*1.5=2.94.", "Add and subtract from 100."], result: "The 95% interval is approximately [97.06,102.94]." }, { title: "Coverage interpretation", setup: "Repeat sampling and interval construction many times at 95% level.", steps: ["Each dataset produces different endpoints.", "The fixed true parameter is either covered or not.", "Under assumptions, about 95% of generated intervals cover it."], result: "Frequentist confidence describes procedure coverage, not a 95% random probability for a fixed parameter after observation." }],
      exercises: [{ level: "Beginner", question: "If estimate=20 and margin=3, give the interval.", answer: "[17,23]." }, { level: "Intermediate", question: "Roughly how much must n increase to halve interval width?", answer: "Fourfold, because width scales as 1/sqrt(n)." }, { level: "Applied", question: "What can invalidate a textbook confidence interval?", answer: "Biased sampling, dependence, wrong standard errors, heavy tails at small n, model misspecification, or post-selection can break coverage." }],
      takeaways: ["Confidence intervals quantify sampling uncertainty through a procedure.", "Coverage relies on assumptions and repeated-sample calibration.", "Larger samples narrow intervals at a square-root rate.", "A narrow biased interval can be precisely wrong."]
    },
    "hypothesis-testing": {
      prerequisites: ["Sampling distributions.", "Null and alternative hypotheses.", "Conditional probability and decision errors."],
      notationGuide: [{ symbol: "H0", latex: "H_0", meaning: "Null hypothesis used to calibrate the test." }, { symbol: "H1", latex: "H_1", meaning: "Alternative hypothesis." }, { symbol: "alpha", latex: "\\alpha", meaning: "Type I error rate." }, { symbol: "beta", latex: "\\beta", meaning: "Type II error rate at a specified alternative." }],
      formulaLatex: ["\\alpha=P(\\text{reject }H_0\\mid H_0\\text{ true})", "\\beta=P(\\text{fail to reject }H_0\\mid H_1\\text{ true})", "\\operatorname{power}=1-\\beta"],
      derivation: { title: "Design a rejection rule", steps: ["Choose a statistic whose distribution is known under H0.", "Select a rejection region with H0 probability alpha.", "Compute the statistic from observed data.", "Reject H0 only if the observation falls in that predeclared region."] },
      workedExamples: [{ title: "Two-sided z test", setup: "Under H0, z is standard normal; observed z=2.3 at alpha=0.05.", steps: ["Two-sided critical values are about +/-1.96.", "Absolute observed z exceeds 1.96.", "The result enters the rejection region."], result: "Reject H0 at the 5% level, subject to assumptions." }, { title: "Decision errors", setup: "A safety alarm tests H0: system is safe.", steps: ["Type I error raises a false alarm.", "Type II error misses a real hazard.", "Their practical costs differ."], result: "Alpha should be chosen with consequences, not by ritual alone." }],
      exercises: [{ level: "Beginner", question: "What is a Type I error?", answer: "Rejecting H0 when H0 is true." }, { level: "Intermediate", question: "Does failing to reject H0 prove it true?", answer: "No. Data may be insufficiently informative or the test underpowered." }, { level: "Applied", question: "Why should hypotheses and analysis be specified before examining results?", answer: "Data-dependent choices alter error rates and can turn random patterns into apparently significant findings." }],
      takeaways: ["A test controls a decision error under H0.", "Reject and fail-to-reject are asymmetric conclusions.", "Power depends on a specified alternative and design.", "Scientific relevance requires effect size, assumptions, and context beyond the binary decision."]
    },
    "p-values-and-statistical-power": {
      prerequisites: ["Hypothesis testing.", "Test statistics and tail probabilities.", "Effect size and standard error."],
      notationGuide: [{ symbol: "p-value", latex: "p", meaning: "Null probability of a result at least as extreme as observed." }, { symbol: "power", latex: "1-\\beta", meaning: "Probability of rejection under a specified alternative." }, { symbol: "delta", latex: "\\delta", meaning: "Effect size under the alternative." }, { symbol: "alpha", latex: "\\alpha", meaning: "Preselected rejection threshold." }],
      formulaLatex: ["p=P_{H_0}(T\\geq T_{obs})", "\\operatorname{power}=1-\\beta", "\\text{signal-to-noise}\\propto\\frac{\\text{effect}}{\\sigma/\\sqrt n}"],
      derivation: { title: "Connect power to sample size", steps: ["Under an alternative, the statistic shifts away from its H0 distribution by effect size.", "Its standard error often shrinks as sigma/sqrt(n).", "The standardized separation therefore grows like effect*sqrt(n)/sigma.", "More separation puts more alternative probability beyond the rejection threshold, increasing power."] },
      workedExamples: [{ title: "Interpret a p-value", setup: "A test reports p=0.03.", steps: ["Assume H0 and all test assumptions.", "Results at least this extreme occur 3% of the time under that reference process.", "This is not P(H0|data)."], result: "The data are relatively unusual under H0, but the p-value does not provide the posterior probability of H0." }, { title: "Underpowered study", setup: "A real small effect is studied with noisy measurements and n=10.", steps: ["Standard error is large.", "Alternative and null statistic distributions overlap heavily.", "Failure to reject is common."], result: "A nonsignificant result may reflect low power rather than absence of effect." }],
      exercises: [{ level: "Beginner", question: "Is p=0.04 the probability H0 is true?", answer: "No." }, { level: "Intermediate", question: "Name three ways to increase power.", answer: "Increase sample size, reduce noise, or target a larger true effect; design and balanced allocation can also help." }, { level: "Applied", question: "Why can enormous datasets make trivial effects statistically significant?", answer: "Very small standard errors make tiny departures from H0 produce large test statistics, even when practical impact is negligible." }],
      takeaways: ["A p-value is calibrated under H0, not a hypothesis probability.", "Power is defined under an alternative.", "Sample size affects detectability, not effect magnitude itself.", "Report uncertainty and effect size alongside p-values."]
    },
    "bootstrap": {
      prerequisites: ["Samples and estimators.", "Sampling distributions.", "Random resampling with replacement."],
      notationGuide: [{ symbol: "D*_b", latex: "D_b^*", meaning: "b-th bootstrap resample." }, { symbol: "theta_hat*_b", latex: "\\hat\\theta_b^*", meaning: "Statistic computed on resample b." }, { symbol: "B", latex: "B", meaning: "Number of bootstrap replications." }, { symbol: "SE_boot", latex: "\\operatorname{SE}_{boot}", meaning: "Spread of bootstrap estimates." }],
      formulaLatex: ["\\hat\\theta_b^*=T(D_b^*)", "\\operatorname{SE}_{boot}=\\sqrt{\\frac1{B-1}\\sum_b(\\hat\\theta_b^*-\\bar\\theta^*)^2}", "[q_{\\alpha/2}^*,q_{1-\\alpha/2}^*]"],
      derivation: { title: "Approximate repeated sampling from one dataset", steps: ["Treat the empirical distribution that puts mass 1/n on each observed row as an estimate of the population.", "Draw n observations with replacement from it.", "Recompute the statistic to mimic how it changes across samples.", "Repeat B times; the distribution of bootstrap statistics estimates sampling uncertainty."] },
      workedExamples: [{ title: "Bootstrap a median", setup: "An analytic standard-error formula for a skewed sample median is inconvenient.", steps: ["Resample rows with replacement.", "Compute the median for each resample.", "Use their standard deviation and quantiles."], result: "The bootstrap approximates median uncertainty without deriving a closed form." }, { title: "Respect clustered data", setup: "Measurements contain many rows per user.", steps: ["Row-wise resampling breaks within-user dependence.", "Resample users as whole clusters instead.", "Keep each selected user's rows together."], result: "Cluster bootstrap better matches the actual sampling unit." }],
      exercises: [{ level: "Beginner", question: "Does a bootstrap resample contain exactly the original distinct observations?", answer: "No. It has the same number of draws, but replacement creates duplicates and omits some rows." }, { level: "Intermediate", question: "What does increasing B mainly reduce?", answer: "Monte Carlo error in the bootstrap approximation, not bias in the original sampling design." }, { level: "Applied", question: "When can ordinary bootstrap fail?", answer: "With strong dependence, extreme tails, boundary parameters, nonsmooth statistics, tiny samples, or biased sampling unless a suitable variant is used." }],
      takeaways: ["Bootstrap resamples the empirical distribution.", "It approximates an estimator's sampling distribution.", "The resampling unit must match dependence and study design.", "It cannot repair an unrepresentative original sample."]
    },
    "bayesian-inference": {
      prerequisites: ["Bayes' theorem.", "Likelihood and prior distributions.", "Integration and expectation."],
      notationGuide: [{ symbol: "theta", latex: "\\theta", meaning: "Unknown parameter or latent quantity." }, { symbol: "p(theta)", latex: "p(\\theta)", meaning: "Prior distribution." }, { symbol: "p(D|theta)", latex: "p(D\\mid\\theta)", meaning: "Likelihood of data under theta." }, { symbol: "p(theta|D)", latex: "p(\\theta\\mid D)", meaning: "Posterior distribution." }],
      formulaLatex: ["p(\\theta\\mid D)=\\frac{p(D\\mid\\theta)p(\\theta)}{p(D)}", "p(D)=\\int p(D\\mid\\theta)p(\\theta)\\,d\\theta", "\\mathbb E[g(\\theta)\\mid D]=\\int g(\\theta)p(\\theta\\mid D)\\,d\\theta"],
      derivation: { title: "Form a posterior distribution", steps: ["Specify a prior p(theta) before using the current data.", "Write the data likelihood p(D|theta).", "Multiply prior and likelihood to obtain an unnormalized posterior.", "Integrate over theta for p(D), then divide so posterior density sums or integrates to one."] },
      workedExamples: [{ title: "Beta-Bernoulli update", setup: "Prior p~Beta(2,2); observe 7 successes and 3 failures.", steps: ["Likelihood contributes p^7(1-p)^3.", "Add exponents to prior shapes.", "Posterior becomes Beta(9,5)."], result: "Posterior mean is 9/14 about 0.643, with uncertainty represented by the full beta curve." }, { title: "Posterior decision", setup: "A deployment action has loss depending on unknown theta.", steps: ["Average action loss over posterior p(theta|D).", "Compare posterior expected loss for each action.", "Choose the lowest under stated utilities."], result: "Bayesian inference separates uncertainty updating from decision consequences." }],
      exercises: [{ level: "Beginner", question: "What two terms multiply to form an unnormalized posterior?", answer: "Likelihood and prior." }, { level: "Intermediate", question: "What does p(D) do in Bayes' rule?", answer: "It normalizes the posterior and is also the marginal likelihood used for model comparison." }, { level: "Applied", question: "Why should prior sensitivity be checked?", answer: "With limited or weakly identifying data, reasonable prior choices may materially change posterior conclusions." }],
      takeaways: ["Bayesian inference updates distributions over unknowns.", "The posterior combines prior information and data likelihood.", "Credible uncertainty follows from integrating the posterior, not only locating its mode.", "Conclusions depend on model, likelihood, prior, and computation quality."]
    },
    "conjugate-priors": {
      prerequisites: ["Bayesian inference.", "Common probability distributions.", "Likelihood kernels."],
      notationGuide: [{ symbol: "prior family", latex: "p(\\theta\\mid\\alpha)", meaning: "Distribution family selected before data." }, { symbol: "posterior family", latex: "p(\\theta\\mid\\alpha')", meaning: "Same family with updated parameters." }, { symbol: "s,f", latex: "s,f", meaning: "Success and failure sufficient statistics." }, { symbol: "n_k", latex: "n_k", meaning: "Observed count in category k." }],
      formulaLatex: ["\\operatorname{Beta}(\\alpha,\\beta)+s,f\\longrightarrow\\operatorname{Beta}(\\alpha+s,\\beta+f)", "\\alpha_k'=\\alpha_k+n_k", "p(\\theta\\mid D)\\propto p(D\\mid\\theta)p(\\theta)"],
      derivation: { title: "Recognize conjugacy from exponents", steps: ["Ignore normalizing constants and write the prior kernel in theta.", "Write the likelihood kernel using sufficient statistics.", "Multiply kernels, which adds matching exponents or natural parameters.", "If the result has the prior family's form, read off updated hyperparameters."] },
      workedExamples: [{ title: "Beta-binomial", setup: "Prior Beta(3,4), then s=5 successes and f=2 failures.", steps: ["Update alpha to 8.", "Update beta to 6.", "Keep beta family."], result: "Posterior is Beta(8,6)." }, { title: "Dirichlet-categorical", setup: "Prior alpha=(1,1,1), observed counts (2,0,3).", steps: ["Add counts componentwise.", "Obtain alpha'=(3,1,4).", "Normalize for posterior mean if desired."], result: "Conjugacy turns the update into simple count addition." }],
      exercises: [{ level: "Beginner", question: "Update Beta(1,1) after one success.", answer: "Beta(2,1)." }, { level: "Intermediate", question: "What practical quantity often drives conjugate updates?", answer: "A low-dimensional sufficient statistic such as counts, sums, or sums of squares." }, { level: "Applied", question: "Why not always use conjugate priors?", answer: "They may be chosen for convenience rather than realism and can be too restrictive for hierarchical or complex models." }],
      takeaways: ["Conjugacy keeps posterior and prior in one distribution family.", "Updates often reduce to sufficient-statistic arithmetic.", "It enables exact fast inference and intuition.", "Computational convenience should not override modelling suitability."]
    },
    "posterior-predictive-distributions": {
      prerequisites: ["Posterior distributions.", "Conditional probability.", "Monte Carlo averaging."],
      notationGuide: [{ symbol: "x_new", latex: "x_{new}", meaning: "Future or unobserved outcome." }, { symbol: "p(theta|D)", latex: "p(\\theta\\mid D)", meaning: "Posterior parameter uncertainty." }, { symbol: "p(x_new|theta)", latex: "p(x_{new}\\mid\\theta)", meaning: "Sampling model at fixed theta." }, { symbol: "S", latex: "S", meaning: "Number of posterior draws used for approximation." }],
      formulaLatex: ["p(x_{new}\\mid D)=\\int p(x_{new}\\mid\\theta)p(\\theta\\mid D)\\,d\\theta", "p(x_{new}\\mid D)\\approx\\frac1S\\sum_{s=1}^Sp(x_{new}\\mid\\theta_s)", "\\mathbb E[X_{new}\\mid D]=\\mathbb E_\\theta[\\mathbb E[X_{new}\\mid\\theta]\\mid D]"],
      derivation: { title: "Average predictions over parameter uncertainty", steps: ["Condition future data on a fixed parameter theta.", "The parameter is unknown but has posterior p(theta|D).", "Apply the law of total probability by integrating fixed-theta predictions over the posterior.", "The resulting mixture includes both outcome noise and parameter uncertainty."] },
      workedExamples: [{ title: "Future Bernoulli outcome", setup: "Posterior p~Beta(alpha',beta').", steps: ["At fixed p, next success probability is p.", "Average p over the beta posterior.", "Use beta mean alpha'/(alpha'+beta')."], result: "Posterior predictive success probability equals the posterior mean of p." }, { title: "Prediction versus parameter interval", setup: "Estimate a Gaussian mean from finite data.", steps: ["Posterior for mean represents uncertainty in mu.", "Future observation also contains observation variance.", "Mixing both makes prediction wider."], result: "A predictive interval is typically wider than a credible interval for the mean." }],
      exercises: [{ level: "Beginner", question: "What is integrated out in posterior prediction?", answer: "The unknown parameter theta." }, { level: "Intermediate", question: "How can posterior samples approximate a predictive density?", answer: "Evaluate or sample p(x_new|theta_s) for many posterior draws and average." }, { level: "Applied", question: "Why are posterior predictive checks useful?", answer: "They compare replicated data from the fitted model with observed patterns to reveal model mismatch." }],
      takeaways: ["Posterior prediction averages over parameter uncertainty.", "It combines parameter uncertainty and future observation variability.", "Monte Carlo posterior draws make the integral practical.", "Predictive checks assess whether the model can reproduce relevant data features."]
    },
    "missing-data-mechanisms": {
      prerequisites: ["Conditional probability.", "Sampling bias.", "Regression and weighting intuition."],
      notationGuide: [{ symbol: "R_i", latex: "R_i", meaning: "Indicator that value i is observed." }, { symbol: "MCAR", latex: "\\mathrm{MCAR}", meaning: "Missingness independent of observed and unobserved data." }, { symbol: "MAR", latex: "\\mathrm{MAR}", meaning: "Missingness explained by observed data." }, { symbol: "MNAR", latex: "\\mathrm{MNAR}", meaning: "Missingness depends on unseen values even after observed controls." }],
      formulaLatex: ["R_i=\\mathbf1\\{\\text{value }i\\text{ observed}\\}", "w_i=\\frac1{P(R_i=1\\mid X_{obs})}", "T_{var}=W+(1+1/M)B"],
      derivation: { title: "Understand inverse-probability weighting", steps: ["Model each unit's observation probability pi_i from observed information under MAR assumptions.", "Observed units with low pi_i represent many similar units likely to be missing.", "Weight each observed unit by 1/pi_i.", "The weighted sample reconstructs the target distribution if the observation model and positivity assumptions hold."] },
      workedExamples: [{ title: "Missing completely at random", setup: "A sensor drops readings due to independent random packet loss.", steps: ["Dropout does not depend on temperature or other variables.", "Observed readings remain representative in expectation.", "Precision decreases because n is smaller."], result: "Complete-case estimates may remain unbiased under MCAR, though less precise." }, { title: "Not missing at random", setup: "People with very high income are less likely to report income, even after recorded demographics.", steps: ["Missingness depends on the unseen income itself.", "Observed-data adjustment cannot fully identify this relationship.", "Sensitivity assumptions are needed."], result: "This is MNAR and cannot be solved automatically by ordinary imputation." }],
      exercises: [{ level: "Beginner", question: "Which mechanism assumes missingness depends only on observed variables?", answer: "MAR." }, { level: "Intermediate", question: "Why is mean imputation usually problematic?", answer: "It understates variance, distorts relationships, and treats imputed values as certain." }, { level: "Applied", question: "What should be reported for plausible MNAR data?", answer: "Mechanism assumptions and sensitivity analyses showing how conclusions change under different unseen missingness patterns." }],
      takeaways: ["Missingness is a data-generating process, not just blank cells.", "MCAR, MAR, and MNAR support different identification claims.", "Imputation should preserve uncertainty and relationships.", "No method recovers information absent without assumptions."]
    },
    "experimental-design": {
      prerequisites: ["Populations and sampling.", "Potential confounding.", "Means, variance, and hypothesis tests."],
      notationGuide: [{ symbol: "T_i", latex: "T_i\\in\\{0,1\\}", meaning: "Treatment assignment indicator." }, { symbol: "Y_i(1),Y_i(0)", latex: "Y_i(1),Y_i(0)", meaning: "Potential outcomes under treatment and control." }, { symbol: "ATE", latex: "\\mathbb E[Y(1)-Y(0)]", meaning: "Average treatment effect." }, { symbol: "SE(diff)", latex: "\\operatorname{SE}(\\bar Y_T-\\bar Y_C)", meaning: "Uncertainty of mean difference." }],
      formulaLatex: ["\\widehat{\\mathrm{effect}}=\\bar Y_T-\\bar Y_C", "\\operatorname{SE}(\\bar Y_T-\\bar Y_C)=\\sqrt{\\frac{s_T^2}{n_T}+\\frac{s_C^2}{n_C}}", "\\operatorname{power}\\uparrow\\text{ with effect and }n,\\quad\\downarrow\\text{ with noise}"],
      derivation: { title: "Why random assignment identifies an effect", steps: ["Each unit has two potential outcomes but only one can be observed.", "Random assignment makes treatment independent of pre-treatment characteristics in expectation.", "Control outcomes estimate what treated units would have experienced without treatment, and vice versa.", "The difference in group means therefore estimates the average causal effect under design assumptions."] },
      workedExamples: [{ title: "Balanced A/B test", setup: "Randomly assign 1,000 users equally; conversion is 12% treatment and 10% control.", steps: ["Estimate effect as 0.12-0.10.", "Use binomial standard errors for uncertainty.", "Interpret both statistical and practical magnitude."], result: "Estimated absolute lift is 2 percentage points, requiring an interval before a decision." }, { title: "Blocking", setup: "Outcome differs greatly by device type.", steps: ["Separate mobile and desktop users into blocks.", "Randomize treatment within each block.", "Combine block-specific effects with planned weights."], result: "Blocking improves balance and can reduce variance from device differences." }],
      exercises: [{ level: "Beginner", question: "What is the estimated effect if treatment mean is 8 and control mean is 6.5?", answer: "1.5." }, { level: "Intermediate", question: "Why does random sampling differ from random assignment?", answer: "Sampling supports generalization to a population; assignment supports causal comparison within the study." }, { level: "Applied", question: "What is interference?", answer: "One unit's treatment affects another unit's outcome, violating the no-interference assumption used by simple analyses." }],
      takeaways: ["Design determines which causal questions data can answer.", "Random assignment balances confounders in expectation.", "Blocking, stratification, and power planning improve efficiency.", "Noncompliance, attrition, interference, and repeated peeking require planned handling."]
    },
    "multiple-testing-correction": {
      prerequisites: ["Hypothesis tests and p-values.", "Type I error.", "Ordered lists and proportions."],
      notationGuide: [{ symbol: "m", latex: "m", meaning: "Number of tested hypotheses." }, { symbol: "FWER", latex: "\\mathrm{FWER}", meaning: "Probability of at least one false rejection." }, { symbol: "FDR", latex: "\\mathrm{FDR}", meaning: "Expected false discovery proportion." }, { symbol: "q", latex: "q", meaning: "Target FDR level." }],
      formulaLatex: ["P(\\text{at least one false positive})=1-(1-\\alpha)^m", "\\alpha_{each}=\\frac\\alpha m", "p_{(k)}\\leq\\frac{kq}{m}"],
      derivation: { title: "Derive the independent-test family error", steps: ["Under m independent true nulls, one test avoids a false positive with probability 1-alpha.", "All m avoid false positives with probability (1-alpha)^m.", "Take the complement.", "The chance of at least one false positive is 1-(1-alpha)^m."] },
      workedExamples: [{ title: "Uncorrected screening", setup: "Run 20 independent null tests at alpha=0.05.", steps: ["No-false-positive probability is 0.95^20.", "Take one minus this quantity.", "Compute about 0.642."], result: "There is roughly a 64% chance of at least one false positive." }, { title: "Bonferroni", setup: "Control FWER at 0.05 for 20 tests.", steps: ["Divide 0.05 by 20.", "Use threshold 0.0025 for each p-value.", "Union bound controls family error regardless of dependence."], result: "Bonferroni is simple and conservative." }],
      exercises: [{ level: "Beginner", question: "What Bonferroni threshold controls alpha=0.05 across 100 tests?", answer: "0.0005." }, { level: "Intermediate", question: "How does FDR differ from FWER?", answer: "FDR controls expected false proportion among discoveries; FWER controls probability of any false rejection." }, { level: "Applied", question: "Why must hyperparameter searches affect reported validation claims?", answer: "Trying many configurations selects lucky noise; evaluation should account for selection or use untouched test data." }],
      takeaways: ["More tests create more opportunities for false discoveries.", "Correction should match the family of claims.", "Bonferroni controls FWER; Benjamini-Hochberg targets FDR under conditions.", "Pre-registration and independent confirmation reduce hidden multiplicity."]
    },
    "effect-size": {
      prerequisites: ["Means, proportions, and standard deviations.", "Confidence intervals.", "Practical versus statistical significance."],
      notationGuide: [{ symbol: "Delta", latex: "\\Delta", meaning: "Absolute difference in outcome scale." }, { symbol: "d", latex: "d", meaning: "Standardized mean difference." }, { symbol: "RR", latex: "\\mathrm{RR}", meaning: "Risk ratio." }, { symbol: "s_pooled", latex: "s_{pooled}", meaning: "Combined within-group standard deviation." }],
      formulaLatex: ["\\Delta=\\bar Y_1-\\bar Y_0", "d=\\frac{\\bar Y_1-\\bar Y_0}{s_{pooled}}", "\\mathrm{RR}=\\frac{p_1}{p_0}"],
      derivation: { title: "Standardize a mean difference", steps: ["Compute treatment-control difference in original units.", "Estimate typical within-group spread using a pooled standard deviation when appropriate.", "Divide difference by that spread.", "The result expresses separation in standard-deviation units, enabling limited cross-scale comparison."] },
      workedExamples: [{ title: "Absolute and relative effects", setup: "Risk falls from 10% to 8%.", steps: ["Absolute change is 0.08-0.10=-0.02.", "Risk ratio is 0.08/0.10=0.8.", "Relative reduction is 20%."], result: "Report both 2 percentage points absolute and 20% relative to avoid framing ambiguity." }, { title: "Cohen-style d", setup: "Group means differ by 6 points with pooled SD 12.", steps: ["Subtract means to obtain 6.", "Divide by 12.", "Retain context of the measurement."], result: "Standardized difference d=0.5." }],
      exercises: [{ level: "Beginner", question: "Find absolute difference between 15 and 11.", answer: "4." }, { level: "Intermediate", question: "If p1=0.06 and p0=0.04, find risk ratio.", answer: "1.5." }, { level: "Applied", question: "Why can a standardized effect still be hard to compare across domains?", answer: "Standard deviations reflect population heterogeneity, measurement reliability, and design, not only substantive importance." }],
      takeaways: ["Effect size quantifies magnitude, while p-values quantify null-relative evidence.", "Absolute, relative, and standardized scales answer different questions.", "Intervals communicate precision around the effect.", "Practical importance requires domain costs, benefits, and baselines."]
    },
    "calibration": {
      prerequisites: ["Predicted probabilities.", "Conditional frequencies.", "Proper scoring rules and binning."],
      notationGuide: [{ symbol: "p_hat", latex: "\\hat p", meaning: "Predicted probability." }, { symbol: "Y", latex: "Y\\in\\{0,1\\}", meaning: "Observed binary outcome." }, { symbol: "Brier score", latex: "\\mathrm{BS}", meaning: "Mean squared probability error." }, { symbol: "ECE", latex: "\\mathrm{ECE}", meaning: "Binned expected calibration error summary." }],
      formulaLatex: ["P(Y=1\\mid\\hat P=p)=p", "\\mathrm{BS}=\\frac1n\\sum_i(p_i-y_i)^2", "\\mathrm{ECE}=\\sum_b\\frac{n_b}{n}|\\operatorname{acc}(b)-\\operatorname{conf}(b)|"],
      derivation: { title: "Build a reliability diagram", steps: ["Group predictions into probability bins.", "For each bin, compute average predicted probability.", "Compute observed positive frequency in the same bin.", "Plot frequency against confidence; a calibrated model follows the diagonal, subject to sampling uncertainty."] },
      workedExamples: [{ title: "Check one probability group", setup: "Among 200 predictions near 0.7, 130 outcomes are positive.", steps: ["Observed frequency is 130/200=0.65.", "Average confidence is about 0.70.", "Difference is -0.05."], result: "The model is overconfident by about 5 percentage points in this group." }, { title: "Accuracy versus calibration", setup: "A classifier predicts 0.51 for every item and labels by threshold 0.5.", steps: ["It may achieve reasonable accuracy if positives dominate.", "Its probability resolution is poor.", "Observed frequencies may not match 0.51 across subgroups."], result: "Accuracy alone cannot establish useful probability calibration." }],
      exercises: [{ level: "Beginner", question: "If 80 of 100 cases predicted at 0.8 are positive, is that group calibrated?", answer: "Yes at that bin resolution: observed frequency equals predicted probability." }, { level: "Intermediate", question: "Why can ECE hide miscalibration?", answer: "It depends on bins and averages; opposite errors can cancel and sparse subgroups can be obscured." }, { level: "Applied", question: "When should calibration be rechecked?", answer: "After distribution, prevalence, model, policy, or population changes, and separately for consequential subgroups." }],
      takeaways: ["Calibration aligns predicted probabilities with observed frequencies.", "It differs from discrimination and accuracy.", "Reliability estimates require uncertainty and careful binning.", "Calibration can degrade under shift and vary across groups."]
    },
    "distribution-shift": {
      prerequisites: ["Joint and conditional distributions.", "Model risk and calibration.", "Train, validation, and deployment splits."],
      notationGuide: [{ symbol: "P_train", latex: "P_{train}", meaning: "Training data distribution." }, { symbol: "P_test", latex: "P_{test}", meaning: "Deployment or evaluation distribution." }, { symbol: "w(x)", latex: "w(x)", meaning: "Density ratio for covariate reweighting." }, { symbol: "R_test", latex: "R_{test}", meaning: "Expected deployment loss." }],
      formulaLatex: ["w(x)=\\frac{p_{test}(x)}{p_{train}(x)}", "R_{test}=\\mathbb E_{test}[\\ell(f(X),Y)]", "D(P_{test}\\Vert P_{train})"],
      derivation: { title: "Reweight risk under covariate shift", steps: ["Assume p_test(y|x)=p_train(y|x) while input marginals differ.", "Write test risk as integral loss*p(y|x)*p_test(x).", "Multiply and divide by p_train(x).", "Recognize a training expectation weighted by p_test(x)/p_train(x), provided support overlaps."] },
      workedExamples: [{ title: "Label prevalence shift", setup: "Fraud prevalence rises from 1% to 5% while class-conditional feature distributions stay similar.", steps: ["The prior class probability changes.", "Score-to-probability calibration changes.", "A fixed threshold may produce different precision."], result: "This is label shift and requires prior-aware recalibration or threshold review." }, { title: "Concept shift", setup: "A recommendation policy changes what users see, altering response to the same features.", steps: ["P(Y|X) changes after intervention.", "Feature-only drift metrics may remain small.", "Past labels no longer describe the new decision environment."], result: "Concept shift requires fresh outcomes, causal diagnosis, and possibly model redesign." }],
      exercises: [{ level: "Beginner", question: "Which shift changes P(X) while assuming P(Y|X) is stable?", answer: "Covariate shift." }, { level: "Intermediate", question: "Why does a large drift metric not prove performance degradation?", answer: "Shift may occur in irrelevant directions; performance depends on how changed regions affect the prediction-label relationship." }, { level: "Applied", question: "What should a production shift response include besides retraining?", answer: "Diagnosis, subgroup evaluation, label-quality checks, threshold/calibration review, rollback criteria, and monitoring for feedback loops." }],
      takeaways: ["Deployment data rarely remain identical to development data.", "Covariate, label, and concept shifts require different assumptions and responses.", "Detection is not diagnosis.", "Robust monitoring joins features, predictions, labels, calibration, and real outcomes."]
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
