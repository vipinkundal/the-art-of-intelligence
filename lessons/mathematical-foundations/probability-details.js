(function () {
  const concept = (title, explanation, notation, example) => ({ title, explanation, notation, example });
  const formula = (label, expression, meaning) => ({ label, expression, meaning });
  const node = (label, detail) => ({ label, detail });

  function makeDetail(config) {
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
    "sample-spaces-and-events": makeDetail({
      idea: ["Probability starts by listing what could happen. The sample space contains every possible outcome, while an event collects the outcomes that answer a question we care about.", "Clear sample spaces prevent missing or double-counting possibilities."],
      how: "Define the experiment, list mutually exclusive outcomes, then describe events as subsets. Assign probabilities so every value is nonnegative and the whole sample space has probability one.",
      concepts: [
        concept("Outcome", "One complete result of an uncertain experiment.", "omega", "A single die roll produces outcome 4."),
        concept("Sample space", "The set of every outcome the experiment allows.", "Omega = {1,2,3,4,5,6}", "For one die roll, the sample space contains six outcomes."),
        concept("Event", "A subset of outcomes sharing a property.", "A subset of Omega", "The event 'even' is {2,4,6}."),
        concept("Event operations", "Union means either event, intersection means both, and complement means not the event.", "A union B; A intersection B; A^c", "Even or greater than four is {2,4,5,6}.")
      ],
      formulas: [formula("Certain event", "P(Omega)=1", "something in the sample space must happen"), formula("Complement", "P(A^c)=1-P(A)", "probability that A does not happen"), formula("Union", "P(A union B)=P(A)+P(B)-P(A intersection B)", "avoid double-counting overlap")],
      caption: "A probability question moves from possible outcomes to the event being measured.",
      flow: [node("Experiment", "define what happens"), node("Sample space", "list all outcomes"), node("Event", "select relevant outcomes"), node("Probability", "measure the event")],
      learn: ["Distinguish outcomes, sample spaces, and events.", "Build a complete sample space for a simple experiment.", "Use union, intersection, and complement.", "Check that assigned probabilities sum to one."],
      ai: "Classification labels form a sample space, prediction questions define events, and probability outputs assign mass to those events.",
      pitfalls: ["Do not leave out possible outcomes.", "Outcomes should not overlap when they are treated as separate elementary cases.", "An event can contain one, many, all, or no outcomes."],
      example: "For two coin flips, Omega={HH,HT,TH,TT}. The event 'exactly one head' is {HT,TH}, so with fair coins its probability is 2/4=1/2.",
      question: "For one die roll, what event represents a result greater than 4?",
      answer: "{5,6}. With a fair die its probability is 2/6=1/3.",
      resources: [{ label: "Wikipedia: Sample space", url: "https://en.wikipedia.org/wiki/Sample_space" }]
    }),
    "conditional-probability": makeDetail({
      idea: "Conditional probability updates the chance of A after learning that B happened. It narrows attention to the part of the sample space inside B.",
      how: "Keep only outcomes in B, then ask what fraction of that remaining probability also lies in A. Divide the overlap by the probability of B.",
      concepts: [
        concept("Condition", "Known information that restricts the possible outcomes.", "given B", "Knowing a drawn card is a face card changes the chance it is a king."),
        concept("Conditional probability", "Probability of A inside the reduced world where B is true.", "P(A|B)", "Among face cards, four of twelve are kings."),
        concept("Intersection", "The outcomes where A and B occur together.", "A intersection B", "A card that is both a king and a face card."),
        concept("Multiplication rule", "Rearranges conditional probability to compute a joint event.", "P(A intersection B)=P(A|B)P(B)", "Probability of rain and traffic equals traffic given rain times rain.")
      ],
      formulas: [formula("Conditional probability", "P(A|B)=P(A intersection B)/P(B)", "fraction of B that also belongs to A"), formula("Joint rule", "P(A intersection B)=P(A|B)P(B)", "build a joint probability in sequence")],
      caption: "Conditioning filters the sample space before probability is measured.",
      flow: [node("Original space", "all outcomes"), node("Observe B", "discard outcomes outside B"), node("Find A within B", "measure overlap"), node("P(A|B)", "updated chance")],
      learn: ["Interpret the vertical bar as 'given'.", "Compute a conditional probability from counts.", "Use the multiplication rule.", "Notice that P(A|B) generally differs from P(B|A)."],
      ai: "Models condition predictions on inputs: a language model estimates the next token given prior tokens, and a classifier estimates a label given features.",
      pitfalls: ["Do not reverse A and B.", "P(B) must be positive.", "Conditioning can raise, lower, or leave a probability unchanged."],
      example: "In 100 emails, 30 contain the word 'offer' and 24 of those are spam. Then P(spam|offer)=24/30=0.8.",
      question: "If 40 users are mobile and 10 of those purchase, what is P(purchase|mobile)?",
      answer: "10/40=0.25.",
      resources: [{ label: "Wikipedia: Conditional probability", url: "https://en.wikipedia.org/wiki/Conditional_probability" }]
    }),
    "independence-and-conditional-independence": makeDetail({
      idea: "Two events are independent when learning one does not change the probability of the other. Conditional independence means they become independent after a third variable is known.",
      how: "Compare P(A|B) with P(A), or compare the joint probability with the product of marginals. For conditional independence, repeat the comparison inside every relevant value of C.",
      concepts: [
        concept("Independence", "B provides no probability information about A.", "P(A|B)=P(A)", "Separate fair coin flips are independent."),
        concept("Product test", "Independent events have a joint probability equal to the product of their probabilities.", "P(A,B)=P(A)P(B)", "Two heads has probability 1/2*1/2=1/4."),
        concept("Conditional independence", "A and B give no extra information about each other after C is known.", "P(A,B|C)=P(A|C)P(B|C)", "Two symptoms may become independent after the disease is known."),
        concept("Common cause", "A hidden variable can create an apparent association between otherwise unrelated observations.", "C -> A and C -> B", "Weather influences both umbrella use and wet roads.")
      ],
      formulas: [formula("Independence", "P(A,B)=P(A)P(B)", "joint factorizes into marginals"), formula("Conditional independence", "P(A,B|C)=P(A|C)P(B|C)", "factorization holds after conditioning on C")],
      caption: "A shared cause can explain dependence; conditioning on it can separate the effects.",
      flow: [node("Observe A and B", "they appear associated"), node("Find common cause C", "shared explanation"), node("Condition on C", "compare within each group"), node("A independent of B | C", "no remaining link")],
      learn: ["Test independence using probabilities.", "Distinguish independence from mutually exclusive events.", "Explain conditional independence with a common cause.", "Read simple graphical-model factorization."],
      ai: "Conditional independence assumptions make Bayesian networks, naive Bayes, hidden-state models, and probabilistic inference computationally manageable.",
      pitfalls: ["Mutually exclusive nonzero-probability events are not independent.", "Zero correlation does not generally imply independence.", "Conditioning can create dependence as well as remove it."],
      example: "Umbrella use U and wet roads W are associated. Given weather R, they may be approximately conditionally independent: P(U,W|R)=P(U|R)P(W|R).",
      question: "If P(A)=0.5, P(B)=0.2, and P(A,B)=0.1, are A and B independent?",
      answer: "Yes, because 0.5*0.2=0.1.",
      resources: [{ label: "Wikipedia: Conditional independence", url: "https://en.wikipedia.org/wiki/Conditional_independence" }]
    }),
    "random-variables": makeDetail({
      idea: "A random variable converts uncertain outcomes into values we can calculate with. The randomness is in which outcome occurs; the variable is the rule assigning a value to it.",
      how: "Define a function X from outcomes to numbers or categories, list its possible values, then assign probabilities through the underlying experiment.",
      concepts: [
        concept("Random variable", "A function applied to outcomes, not a mysterious changing number.", "X: Omega -> values", "X can count heads in two coin flips."),
        concept("Discrete variable", "Takes values in a finite or countable set.", "X in {0,1,2,...}", "Number of clicks in a session."),
        concept("Continuous variable", "Can take values over an interval or region.", "X in R", "Response time in seconds."),
        concept("Support", "The set of values with possible probability or positive density.", "support(X)", "A Bernoulli variable has support {0,1}.")
      ],
      formulas: [formula("Mapping", "X(omega)=x", "outcome omega is represented by value x"), formula("Distribution", "P(X in A)", "probability that X lands in set A")],
      caption: "A random variable adds a useful numerical view to raw outcomes.",
      flow: [node("Outcome omega", "raw uncertain result"), node("Apply X", "measurement rule"), node("Value x", "number or category"), node("Distribution", "probabilities over values")],
      learn: ["Explain a random variable as a function.", "Identify discrete and continuous variables.", "State a variable's support.", "Derive values from a simple sample space."],
      ai: "Labels, token choices, latent variables, rewards, noise, and model outputs are represented as random variables in probabilistic models.",
      pitfalls: ["Do not confuse the variable with one observed value.", "Continuous variables assign probability to ranges, not usually to exact points.", "A categorical random variable does not need numeric magnitude."],
      example: "For two coin flips, let X count heads. X(HH)=2, X(HT)=1, X(TH)=1, and X(TT)=0, giving probabilities 1/4, 1/2, and 1/4.",
      question: "Is the number of tokens in a message discrete or continuous?",
      answer: "Discrete, because it takes nonnegative integer values.",
      resources: [{ label: "Wikipedia: Random variable", url: "https://en.wikipedia.org/wiki/Random_variable" }]
    }),
    "probability-mass-and-density-functions": makeDetail({
      idea: "A probability mass function assigns probability directly to discrete values. A probability density function describes how continuous probability is spread; probability comes from area under the density curve.",
      how: "For a PMF, add probabilities of requested values. For a PDF, integrate density over the requested interval. Both must be nonnegative and normalize to one.",
      concepts: [
        concept("PMF", "Direct probability for each value of a discrete variable.", "p(x)=P(X=x)", "A fair die has p(x)=1/6 for x=1,...,6."),
        concept("PDF", "Relative concentration of continuous probability around a value.", "p(x)>=0", "A taller density region is more likely per unit width."),
        concept("Probability from area", "Continuous probability is the integral over an interval.", "P(a<=X<=b)=integral_a^b p(x)dx", "The area under the full curve is one."),
        concept("Normalization", "Total mass or total area must equal one.", "sum_x p(x)=1 or integral p(x)dx=1", "Normalization converts nonnegative scores into a distribution.")
      ],
      formulas: [formula("Discrete probability", "P(X in A)=sum_(x in A) p(x)", "add probability masses"), formula("Continuous probability", "P(a<=X<=b)=integral_a^b p(x)dx", "area under the density"), formula("Normalization", "sum p(x)=1; integral p(x)dx=1", "total probability is one")],
      caption: "Discrete probability adds bars; continuous probability measures area.",
      flow: [node("Choose variable", "discrete or continuous"), node("PMF", "probability at values"), node("PDF", "density over ranges"), node("Normalize", "total equals one")],
      learn: ["Distinguish PMFs from PDFs.", "Compute discrete probabilities by summing.", "Compute continuous probabilities as areas.", "Check nonnegativity and normalization."],
      ai: "Softmax produces a PMF over classes or tokens, while continuous generative models define densities over vectors, images, or latent representations.",
      pitfalls: ["A PDF value can exceed one; only integrated probability must stay at most one.", "For continuous X, P(X=x)=0 even where density is high.", "Never add raw density values as if they were discrete probabilities."],
      example: "If p(x)=2x on 0<=x<=1, it is normalized because integral_0^1 2x dx=1. P(X<=0.5)=integral_0^0.5 2x dx=0.25.",
      question: "Can a valid continuous density equal 2 on an interval?",
      answer: "Yes, if the total area remains one; for example density 2 on an interval of width 0.5.",
      resources: [{ label: "Wikipedia: Probability density function", url: "https://en.wikipedia.org/wiki/Probability_density_function" }]
    }),
    "cumulative-distributions": makeDetail({
      idea: "A cumulative distribution function gives the probability that a random variable is at or below a threshold. It packages an entire distribution into one nondecreasing curve.",
      how: "For discrete variables, add all masses up to x. For continuous variables, integrate the density from negative infinity to x. Differences of CDF values give interval probabilities.",
      concepts: [
        concept("CDF", "Accumulated probability up to threshold x.", "F(x)=P(X<=x)", "F(10)=0.8 means 80% of values are at most 10."),
        concept("Discrete CDF", "A step function that jumps by the PMF at each possible value.", "F(x)=sum_(t<=x)p(t)", "A die CDF jumps by 1/6 at every integer."),
        concept("Continuous CDF", "The integral of the PDF and therefore a smooth curve when the density is smooth.", "F(x)=integral_(-infinity)^x p(t)dt", "Its derivative is p(x) where differentiable."),
        concept("Quantile", "A threshold whose CDF reaches a chosen probability.", "q_p=F^-1(p)", "The median is a 0.5 quantile.")
      ],
      formulas: [formula("CDF", "F(x)=P(X<=x)", "probability accumulated through x"), formula("Interval", "P(a<X<=b)=F(b)-F(a)", "subtract accumulated areas"), formula("Density relation", "p(x)=F'(x)", "for differentiable continuous CDFs")],
      caption: "The CDF accumulates probability from left to right.",
      flow: [node("Start at -infinity", "probability 0"), node("Move threshold x", "include more outcomes"), node("Accumulate mass", "F(x) never decreases"), node("Reach infinity", "probability 1")],
      learn: ["Read probabilities from a CDF.", "Compute interval probability by subtraction.", "Relate PMF/PDF to CDF.", "Interpret quantiles."],
      ai: "CDFs support calibration, quantile prediction, threshold selection, inverse-transform sampling, and tail-risk measurement.",
      pitfalls: ["A CDF is nondecreasing and bounded between zero and one.", "For strict versus non-strict inequalities, discrete point masses matter.", "An inverse CDF may be generalized when flat sections or jumps exist."],
      example: "For a fair die, F(3)=P(X<=3)=3/6=0.5. P(2<X<=5)=F(5)-F(2)=5/6-2/6=1/2.",
      question: "If F(4)=0.7 and F(1)=0.2, what is P(1<X<=4)?",
      answer: "0.7-0.2=0.5.",
      resources: [{ label: "Wikipedia: Cumulative distribution function", url: "https://en.wikipedia.org/wiki/Cumulative_distribution_function" }]
    }),
    "joint-marginal-and-conditional-distributions": makeDetail({
      idea: "A joint distribution describes variables together. A marginal ignores variables you do not need, and a conditional focuses on one variable after another has been observed.",
      how: "Start with p(x,y). Sum or integrate over y to get p(x). Divide the joint by the relevant marginal to get p(x|y). These three views describe the same probabilistic system at different levels.",
      concepts: [
        concept("Joint distribution", "Assigns probability to combinations of values.", "p(x,y)", "Probability of a class and a feature value together."),
        concept("Marginal distribution", "Distribution of one variable after summing or integrating out others.", "p(x)=sum_y p(x,y)", "Overall class frequency regardless of feature."),
        concept("Conditional distribution", "Distribution of X inside a fixed value of Y.", "p(x|y)=p(x,y)/p(y)", "Class probabilities for users from one region."),
        concept("Factorization", "A joint can be written as a marginal times a conditional.", "p(x,y)=p(x|y)p(y)", "Generate y first, then x given y.")
      ],
      formulas: [formula("Marginalization", "p(x)=sum_y p(x,y)", "remove discrete variable y"), formula("Conditioning", "p(x|y)=p(x,y)/p(y)", "renormalize a joint slice"), formula("Chain rule", "p(x,y)=p(x|y)p(y)", "factor a joint distribution")],
      caption: "One joint table supports marginal and conditional views.",
      flow: [node("Joint p(x,y)", "variables together"), node("Sum over y", "remove y"), node("Marginal p(x)", "x alone"), node("Fix y and normalize", "conditional p(x|y)")],
      learn: ["Read a joint probability table.", "Marginalize a variable.", "Build a conditional distribution.", "Factor a joint distribution in either order."],
      ai: "Latent-variable models marginalize hidden variables, classifiers model conditional labels, and generative models represent joint or factorized distributions.",
      pitfalls: ["A marginal is not a conditional.", "Conditional slices must be renormalized.", "Marginalizing many latent variables can be computationally expensive."],
      example: "Suppose p(X=1,Y=0)=0.2 and p(X=1,Y=1)=0.3. Then p(X=1)=0.5. If p(Y=1)=0.4, p(X=1|Y=1)=0.3/0.4=0.75.",
      question: "If p(x,y) is known, how do you obtain p(y) for discrete x?",
      answer: "Sum p(x,y) over every possible x.",
      resources: [{ label: "Wikipedia: Joint probability distribution", url: "https://en.wikipedia.org/wiki/Joint_probability_distribution" }]
    }),
    "expectation": makeDetail({
      idea: "Expectation is the probability-weighted average value of a random variable. It describes the center you would approach over many repeated samples, not necessarily a value you will observe.",
      how: "Multiply each possible value by its probability and add for a discrete variable, or integrate value times density for a continuous variable. Functions of a random variable can be averaged the same way.",
      concepts: [
        concept("Expected value", "Long-run probability-weighted center.", "E[X]", "A fair die has expectation 3.5, though 3.5 cannot be rolled."),
        concept("Expectation of a function", "Average a transformed value without first finding its full distribution.", "E[g(X)]", "Expected squared error uses g(x)=x^2."),
        concept("Linearity", "Expectations add and scalars factor out, even without independence.", "E[aX+bY]=aE[X]+bE[Y]", "Expected total reward is the sum of expected rewards."),
        concept("Sample mean", "An empirical estimate of expectation from observed samples.", "X_bar=(1/n)sum_i X_i", "Average validation loss estimates expected loss.")
      ],
      formulas: [formula("Discrete", "E[X]=sum_x x p(x)", "weighted sum"), formula("Continuous", "E[X]=integral x p(x)dx", "weighted integral"), formula("Linearity", "E[aX+b]=aE[X]+b", "constants move through expectation")],
      caption: "Expectation balances possible values by how likely they are.",
      flow: [node("Possible values", "what X can be"), node("Probabilities", "how likely each is"), node("Value x probability", "weighted contribution"), node("Add", "expected value")],
      learn: ["Compute discrete expectations.", "Interpret expectation as a long-run average.", "Use linearity of expectation.", "Estimate expectation with a sample mean."],
      ai: "Training objectives minimize expected loss, reinforcement learning maximizes expected return, and probabilistic predictions support expected-cost decisions.",
      pitfalls: ["Expectation need not be a possible outcome.", "A distribution can lack a finite expectation.", "The average of a nonlinear transformation is generally not the transformation of the average."],
      example: "A model action earns 10 with probability 0.2 and loses 1 with probability 0.8. Expected reward is 10*0.2+(-1)*0.8=1.2.",
      question: "What is E[X] for X=0 with probability 0.7 and X=5 with probability 0.3?",
      answer: "0*0.7+5*0.3=1.5.",
      resources: [{ label: "Wikipedia: Expected value", url: "https://en.wikipedia.org/wiki/Expected_value" }]
    }),
    "variance-and-covariance": makeDetail({
      idea: "Variance measures how far one variable tends to spread from its mean. Covariance measures whether two variables tend to move above and below their means together.",
      how: "Center values by subtracting their means. Square one centered variable for variance, or multiply two centered variables for covariance, then take the expectation.",
      concepts: [
        concept("Variance", "Average squared distance from the mean.", "Var(X)=E[(X-mu)^2]", "Large variance means values are widely spread."),
        concept("Standard deviation", "Square root of variance, returning to the original units.", "sigma=sqrt(Var(X))", "A standard deviation of 2 uses the same units as X."),
        concept("Covariance", "Signed measure of how two variables vary together.", "Cov(X,Y)=E[(X-mu_X)(Y-mu_Y)]", "Positive covariance means above-average values tend to coincide."),
        concept("Covariance matrix", "Stores variances on the diagonal and pairwise covariances off diagonal.", "Sigma_ij=Cov(X_i,X_j)", "It describes spread and orientation of vector data.")
      ],
      formulas: [formula("Variance", "Var(X)=E[X^2]-E[X]^2", "equivalent computational form"), formula("Covariance", "Cov(X,Y)=E[XY]-E[X]E[Y]", "joint movement after removing means"), formula("Variance of sum", "Var(X+Y)=Var(X)+Var(Y)+2Cov(X,Y)", "dependence changes total spread")],
      caption: "Centering reveals individual spread and shared movement.",
      flow: [node("Subtract means", "center variables"), node("Square X", "variance"), node("Multiply X and Y", "covariance"), node("Average", "spread statistics")],
      learn: ["Compute variance and standard deviation.", "Interpret covariance sign.", "Read a covariance matrix.", "Relate covariance to variance of a sum."],
      ai: "Variance quantifies prediction and sampling noise; covariance shapes Gaussian models, PCA, whitening, uncertainty estimates, and portfolio-like decision risk.",
      pitfalls: ["Covariance depends on units and scale.", "Zero covariance does not generally imply independence.", "Sample estimates need consistent n versus n-1 conventions."],
      example: "For X values {1,3} equally likely, mean is 2 and variance is [(1-2)^2+(3-2)^2]/2=1. If Y=2X, covariance is 2Var(X)=2.",
      question: "What is the standard deviation when variance is 9?",
      answer: "3, the nonnegative square root of 9.",
      resources: [{ label: "Wikipedia: Covariance", url: "https://en.wikipedia.org/wiki/Covariance" }]
    }),
    "correlation": makeDetail({
      idea: "Correlation rescales covariance into a unit-free number between -1 and 1. It summarizes the strength and direction of a linear relationship.",
      how: "Compute covariance, then divide by both standard deviations. The normalization removes measurement units and makes different pairs easier to compare.",
      concepts: [
        concept("Positive correlation", "Large values of one variable tend to accompany large values of the other.", "rho>0", "Height and weight may be positively correlated."),
        concept("Negative correlation", "Large values of one tend to accompany small values of the other.", "rho<0", "Error may fall as training data grows."),
        concept("Zero correlation", "No linear association, though nonlinear dependence may remain.", "rho=0", "X and X^2 can be uncorrelated for symmetric X but dependent."),
        concept("Scale invariance", "Positive rescaling and shifting do not change correlation.", "Corr(aX+b,cY+d)=sign(ac)Corr(X,Y)", "Meters versus centimeters gives the same correlation.")
      ],
      formulas: [formula("Correlation", "Corr(X,Y)=Cov(X,Y)/(sigma_X sigma_Y)", "normalized linear association"), formula("Range", "-1 <= Corr(X,Y) <= 1", "bounded and unit-free")],
      caption: "Normalization turns covariance into a comparable linear-association score.",
      flow: [node("Center X and Y", "remove means"), node("Covariance", "shared movement"), node("Divide by scales", "standardize"), node("Correlation", "between -1 and 1")],
      learn: ["Compute correlation from covariance and standard deviations.", "Interpret sign and magnitude.", "Distinguish zero correlation from independence.", "Inspect scatterplots for nonlinear patterns and outliers."],
      ai: "Correlation helps explore features, detect redundancy, diagnose leakage, and understand model residuals, though predictive relationships may be nonlinear or causal in neither direction.",
      pitfalls: ["Correlation does not imply causation.", "Outliers can dominate the value.", "Pearson correlation measures linear association, not every kind of dependence."],
      example: "If Cov(X,Y)=6, sigma_X=2, and sigma_Y=4, correlation is 6/(2*4)=0.75, a fairly strong positive linear association.",
      question: "Can two variables have correlation zero and still be dependent?",
      answer: "Yes. A symmetric X and Y=X^2 are a common example.",
      resources: [{ label: "Wikipedia: Correlation", url: "https://en.wikipedia.org/wiki/Correlation" }]
    }),
    "law-of-total-probability": makeDetail({
      idea: "The law of total probability calculates an overall chance by splitting the world into complete, non-overlapping cases and adding each case's weighted contribution.",
      how: "Choose a partition B1,...,Bk. Within each case compute P(A|Bi), weight it by P(Bi), and sum. Every path into A is counted exactly once.",
      concepts: [
        concept("Partition", "Events that do not overlap and together cover the sample space.", "Bi disjoint; union Bi=Omega", "Users divided by device type."),
        concept("Case probability", "Chance of A inside one case.", "P(A|Bi)", "Purchase rate among mobile users."),
        concept("Weighted contribution", "Case rate multiplied by how common the case is.", "P(A|Bi)P(Bi)", "Mobile purchase contribution to overall purchases."),
        concept("Marginal probability", "The overall probability after the case variable is summed out.", "P(A)=sum_i P(A|Bi)P(Bi)", "Overall purchase rate across devices.")
      ],
      formulas: [formula("Total probability", "P(A)=sum_i P(A|B_i)P(B_i)", "weighted sum across a partition"), formula("Two cases", "P(A)=P(A|B)P(B)+P(A|B^c)P(B^c)", "split by B and not B")],
      caption: "Separate routes into A are weighted and recombined.",
      flow: [node("Partition cases", "B1 through Bk"), node("Rate within case", "P(A|Bi)"), node("Weight by case size", "times P(Bi)"), node("Add", "overall P(A)")],
      learn: ["Recognize a valid partition.", "Apply the two-case formula.", "Compute a marginal from conditional rates.", "Use the result as Bayes' theorem evidence."],
      ai: "Mixture models, latent classes, demographic evaluation, and missing-variable inference all combine case-specific probabilities this way.",
      pitfalls: ["Cases must cover every possibility without overlap.", "Do not average conditional rates equally unless cases are equally likely.", "Use probabilities from the same population."],
      example: "60% of users are mobile with 10% purchase rate; 40% are desktop with 20% rate. Overall P(purchase)=0.6*0.1+0.4*0.2=0.14.",
      question: "A test is used in groups with weights 0.7 and 0.3 and positive rates 0.1 and 0.4. What is the overall positive rate?",
      answer: "0.7*0.1+0.3*0.4=0.19.",
      resources: [{ label: "Wikipedia: Law of total probability", url: "https://en.wikipedia.org/wiki/Law_of_total_probability" }]
    }),
    "bayes-theorem": makeDetail({
      idea: "Bayes' theorem updates a belief about a hidden cause after seeing evidence. It balances how plausible the cause was before the evidence with how well that cause predicts the evidence.",
      how: "Multiply the prior P(H) by likelihood P(E|H), then divide by overall evidence probability P(E). The denominator normalizes competing hypotheses so their posterior probabilities sum to one.",
      concepts: [
        concept("Prior", "Belief about a hypothesis before new evidence.", "P(H)", "Base rate of a disease."),
        concept("Likelihood", "How probable the observed evidence is if the hypothesis is true.", "P(E|H)", "Test sensitivity under disease."),
        concept("Evidence", "Overall probability of the observation across all hypotheses.", "P(E)", "Total positive-test rate."),
        concept("Posterior", "Updated belief after observing evidence.", "P(H|E)", "Probability of disease after a positive test.")
      ],
      formulas: [formula("Bayes", "P(H|E)=P(E|H)P(H)/P(E)", "posterior equals likelihood times prior, normalized"), formula("Evidence", "P(E)=sum_h P(E|h)P(h)", "total probability across hypotheses"), formula("Odds form", "posterior odds = likelihood ratio * prior odds", "evidence multiplies odds")],
      caption: "Bayesian updating combines old belief with new evidence.",
      flow: [node("Prior", "belief before data"), node("Likelihood", "evidence under hypothesis"), node("Normalize", "compare all hypotheses"), node("Posterior", "updated belief")],
      learn: ["Name prior, likelihood, evidence, and posterior.", "Compute a two-hypothesis update.", "Use base rates correctly.", "Explain repeated Bayesian updating."],
      ai: "Bayesian models update uncertain parameters, combine prior knowledge with data, compare hypotheses, and quantify posterior predictive uncertainty.",
      pitfalls: ["P(E|H) is not P(H|E).", "Ignoring a rare base rate can produce misleading conclusions.", "The likelihood is a function of the hypothesis for fixed observed data, not a posterior by itself."],
      example: "Disease prevalence is 1%, sensitivity 90%, false-positive rate 5%. P(positive)=0.9*0.01+0.05*0.99=0.0585. Posterior disease probability is 0.009/0.0585 about 15.4%, not 90%.",
      question: "Why can a highly accurate test still have a modest positive predictive value for a rare disease?",
      answer: "Because false positives from the large healthy population can outnumber true positives; the prior base rate matters.",
      resources: [{ label: "Wikipedia: Bayes' theorem", url: "https://en.wikipedia.org/wiki/Bayes%27_theorem" }]
    }),
    "law-of-large-numbers": makeDetail({
      idea: "The law of large numbers says that an average from many independent, similarly distributed observations settles near the true expected value.",
      how: "Collect samples, compute their running mean, and increase sample size. Random high and low deviations increasingly cancel, so the mean becomes stable under suitable assumptions.",
      concepts: [
        concept("Sample mean", "Average of observed values.", "X_bar_n=(1/n)sum_i X_i", "Average loss over a batch."),
        concept("Population expectation", "The fixed theoretical value the sample mean estimates.", "mu=E[X]", "True average reward under a policy."),
        concept("Convergence", "Probability of a large discrepancy shrinks as n grows.", "X_bar_n -> mu", "Running coin-head frequency approaches p."),
        concept("Sampling variability", "Finite samples still fluctuate even when the law applies.", "standard error roughly sigma/sqrt(n)", "Four times more samples roughly halves typical mean error.")
      ],
      formulas: [formula("Sample mean", "X_bar_n=(1/n)sum_i X_i", "empirical average"), formula("Convergence", "X_bar_n -> E[X] as n->infinity", "average approaches expectation"), formula("Mean variance", "Var(X_bar_n)=sigma^2/n", "for independent equal-variance samples")],
      caption: "More samples stabilize an empirical average around its expectation.",
      flow: [node("Draw samples", "independent observations"), node("Compute mean", "average current values"), node("Increase n", "cancel random variation"), node("Approach E[X]", "stable estimate")],
      learn: ["Distinguish sample mean from expectation.", "State the convergence idea.", "Relate sample size to mean variance.", "Recognize when dependence or heavy tails cause trouble."],
      ai: "Mini-batch losses, Monte Carlo estimates, offline evaluation, and empirical risks rely on averages becoming representative as data grows.",
      pitfalls: ["The law does not say a small sample is close.", "It does not make individual observations less variable.", "Strong dependence or undefined expectation can invalidate standard forms."],
      example: "A fair coin's running head frequency may be 0.7 after 10 flips, 0.54 after 100, and 0.501 after 10,000. The exact path varies, but the long-run average approaches 0.5.",
      question: "If independent observations have variance 16, what is the variance of their mean for n=100?",
      answer: "16/100=0.16.",
      resources: [{ label: "Wikipedia: Law of large numbers", url: "https://en.wikipedia.org/wiki/Law_of_large_numbers" }]
    }),
    "central-limit-theorem": makeDetail({
      idea: "The central limit theorem says that sums or averages of many independent contributions often have an approximately Gaussian shape, even when individual observations are not Gaussian.",
      how: "Center the sample mean at the population mean and scale it by its standard error. As sample size grows, the standardized distribution approaches a standard normal under broad conditions.",
      concepts: [
        concept("Sampling distribution", "Distribution of a statistic across repeated datasets.", "distribution of X_bar", "Different samples produce different means."),
        concept("Standard error", "Typical spread of the sample mean.", "sigma/sqrt(n)", "Larger n makes the mean more precise."),
        concept("Standardization", "Subtract the expected center and divide by scale.", "Z=(X_bar-mu)/(sigma/sqrt(n))", "Puts different mean problems on a common scale."),
        concept("Gaussian approximation", "The standardized sum approaches N(0,1).", "Z approximately N(0,1)", "Supports approximate intervals and tests.")
      ],
      formulas: [formula("Standardized mean", "Z=(X_bar-mu)/(sigma/sqrt(n))", "center and scale the sample mean"), formula("Approximate mean law", "X_bar approximately N(mu,sigma^2/n)", "for sufficiently large n")],
      caption: "Repeated averaging produces a narrower, more Gaussian sampling distribution.",
      flow: [node("Non-Gaussian data", "individual observations"), node("Take samples", "size n"), node("Compute means", "repeat many times"), node("Gaussian shape", "center mu, spread sigma/sqrt(n)")],
      learn: ["Distinguish data distribution from sampling distribution.", "Compute standard error.", "Standardize a sample mean.", "State the assumptions and approximation nature."],
      ai: "The CLT motivates uncertainty estimates for average losses and metrics, but modern dependent or heavy-tailed data may require more careful methods.",
      pitfalls: ["It does not say the original data become Gaussian.", "Required sample size depends on skew and tail behavior.", "Dependence can change or invalidate the standard result."],
      example: "A Bernoulli variable with p=0.3 is not Gaussian. For n=100, the sample proportion is approximately normal with mean 0.3 and standard error sqrt(0.3*0.7/100) about 0.0458.",
      question: "What happens to standard error when sample size grows from 100 to 400?",
      answer: "It halves because standard error scales as 1/sqrt(n).",
      resources: [{ label: "Wikipedia: Central limit theorem", url: "https://en.wikipedia.org/wiki/Central_limit_theorem" }]
    }),
    "markov-chains": makeDetail({
      idea: "A Markov chain moves among discrete states one step at a time. The next-state distribution depends on the current state, not the full path used to reach it.",
      how: "Store one row of transition probabilities for each current state. Multiply the current state distribution by the transition matrix to get the distribution one step later.",
      concepts: [
        concept("State", "A complete description needed to predict the next step under the Markov assumption.", "S_t", "Weather can be sunny, cloudy, or rainy."),
        concept("Markov property", "Future and past are conditionally independent given the present.", "P(S_(t+1)|S_t,...)=P(S_(t+1)|S_t)", "Tomorrow's state uses today's state."),
        concept("Transition matrix", "Rows contain probabilities of moving from one state to every next state.", "T_ij=P(S_(t+1)=j|S_t=i)", "Each row sums to one."),
        concept("Stationary distribution", "A state distribution unchanged by one transition.", "pi=pi T", "Long-run visit frequencies may approach pi.")
      ],
      formulas: [formula("Transition", "T_ij=P(S_(t+1)=j|S_t=i)", "one-step movement probability"), formula("Distribution update", "p_(t+1)=p_t T", "advance all state probabilities"), formula("Stationary", "pi=pi T", "unchanged long-run distribution")],
      caption: "A transition matrix repeatedly advances a distribution through states.",
      flow: [node("Current state", "S_t"), node("Transition row", "probabilities from S_t"), node("Sample next state", "S_(t+1)"), node("Repeat", "form a chain")],
      learn: ["State the Markov property.", "Read and validate a transition matrix.", "Compute one distribution update.", "Interpret a stationary distribution."],
      ai: "Markov chains support language and sequence models, MCMC sampling, reinforcement learning, ranking algorithms, and hidden Markov models.",
      pitfalls: ["Memorylessness depends on how the state is defined.", "A stationary distribution may not be unique or reachable from every state.", "Transition rows must sum to one."],
      example: "With states S,R and T=[[0.8,0.2],[0.4,0.6]], a currently sunny day gives 0.8 probability of sun and 0.2 of rain tomorrow.",
      question: "What must every row of a transition matrix sum to?",
      answer: "One, because it is a conditional distribution over next states.",
      resources: [{ label: "Wikipedia: Markov chain", url: "https://en.wikipedia.org/wiki/Markov_chain" }]
    }),
    "markov-processes": makeDetail({
      idea: "A Markov process is the broader memoryless idea: once the present state is known, earlier history adds no information about the future. Time and state may be discrete or continuous.",
      how: "Choose a state that contains all relevant present information, define how transition probabilities evolve over elapsed time, and use those transitions to predict or sample future paths.",
      concepts: [
        concept("Markov property", "The present separates past from future.", "P(X_future | X_present, X_past) = P(X_future | X_present)", "A sufficient current state summarizes history."),
        concept("Discrete-time process", "State changes are considered at numbered steps.", "X_0,X_1,...", "A Markov chain is the standard example."),
        concept("Continuous-time process", "State evolves at every real-valued time.", "X_t, t>=0", "Continuous-time jump processes and diffusion processes."),
        concept("Transition kernel", "Maps a current state and time gap to a distribution over future states.", "P_t(x,A)", "Probability of entering region A after time t from x.")
      ],
      formulas: [formula("Markov property", "P(X_(t+s) in A | history to t)=P(X_(t+s) in A | X_t)", "present state is sufficient"), formula("Composition", "P_(t+s)=P_t P_s", "transitions over intervals compose")],
      caption: "A well-chosen present state is the bridge between past and future.",
      flow: [node("Past history", "earlier states"), node("Present X_t", "sufficient summary"), node("Transition rule", "depends on elapsed time"), node("Future", "distribution of later states")],
      learn: ["Explain the Markov property.", "Distinguish discrete and continuous time.", "Describe a transition kernel.", "Recognize when a state definition is incomplete."],
      ai: "Diffusion models, continuous-time latent models, queueing, control, and reinforcement learning use Markov processes to describe evolving uncertain states.",
      pitfalls: ["Real data may not be Markov under an observed state.", "A process can be continuous in time but discrete in state, or vice versa.", "Markov does not mean successive states are independent."],
      example: "A queue length can be Markov if the state includes the current number waiting and arrival/service rules are memoryless. The future does not need the order of previous arrivals.",
      question: "Does the Markov property say X_(t+1) is independent of X_t?",
      answer: "No. The next state usually depends strongly on the current state; it is independent of earlier history given the current state.",
      resources: [{ label: "Wikipedia: Markov process", url: "https://en.wikipedia.org/wiki/Markov_property" }]
    }),
    "monte-carlo-estimation": makeDetail({
      idea: "Monte Carlo estimation replaces a difficult sum or integral with an average of random samples. More samples usually improve precision at a predictable square-root rate.",
      how: "Draw independent samples from the distribution, evaluate the quantity of interest on each sample, and average. The law of large numbers gives convergence to the expectation.",
      concepts: [
        concept("Target expectation", "The exact average we want but cannot easily integrate.", "mu=E_p[f(X)]", "Expected reward under a stochastic policy."),
        concept("Monte Carlo estimator", "Sample average of function values.", "mu_hat=(1/N)sum_i f(X_i)", "Average loss on simulated outcomes."),
        concept("Standard error", "Typical estimator uncertainty decreases as 1/sqrt(N).", "SE approximately s/sqrt(N)", "Four times more samples gives about half the error."),
        concept("Randomness and reproducibility", "Different runs produce different estimates; seeds reproduce one random sequence.", "random seed", "Report error bars, not only one estimate.")
      ],
      formulas: [formula("Estimator", "mu_hat_N=(1/N)sum_i f(X_i)", "sample average"), formula("Unbiasedness", "E[mu_hat_N]=mu", "for direct independent sampling"), formula("Standard error", "SE approximately sigma_f/sqrt(N)", "uncertainty shrinks slowly")],
      caption: "Sampling converts an intractable expectation into an ordinary average.",
      flow: [node("Target p(x)", "distribution"), node("Draw N samples", "X_1...X_N"), node("Evaluate f", "sample contributions"), node("Average", "estimate E[f(X)]")],
      learn: ["Construct a Monte Carlo estimator.", "Explain unbiasedness and sampling error.", "Relate error to sample count.", "Use seeds and uncertainty summaries responsibly."],
      ai: "Monte Carlo methods estimate gradients, likelihoods, expected returns, Bayesian predictions, and evaluation metrics when exact computation is unavailable.",
      pitfalls: ["More samples reduce random error but not model bias.", "Correlated samples reduce effective information.", "Rare influential events can create very high variance."],
      example: "Estimate pi by sampling points uniformly in a unit square. The fraction inside the quarter circle estimates pi/4, so pi_hat=4*(inside/N).",
      question: "Roughly how many times more samples are needed to reduce standard error by a factor of 10?",
      answer: "100 times more, because error scales as 1/sqrt(N).",
      resources: [{ label: "Wikipedia: Monte Carlo method", url: "https://en.wikipedia.org/wiki/Monte_Carlo_method" }]
    }),
    "importance-sampling": makeDetail({
      idea: "Importance sampling estimates an expectation under a difficult target distribution by sampling from an easier proposal and correcting each sample with a probability ratio.",
      how: "Draw X from q rather than p. Weight its contribution by w(X)=p(X)/q(X). A good proposal places samples wherever the target's important contributions are large.",
      concepts: [
        concept("Target distribution", "The distribution whose expectation is desired.", "p(x)", "A complex posterior."),
        concept("Proposal distribution", "An easier distribution used to generate samples.", "q(x)", "A wider Gaussian covering the target."),
        concept("Importance weight", "Corrects the mismatch between target and proposal.", "w(x)=p(x)/q(x)", "Target-likely samples receive larger weights."),
        concept("Effective sample size", "A diagnostic for weight concentration.", "ESS approximately (sum w)^2/sum w^2", "One dominant weight means low effective information.")
      ],
      formulas: [formula("Identity", "E_p[f(X)]=E_q[f(X)p(X)/q(X)]", "rewrite target expectation under proposal"), formula("Estimator", "mu_hat=(1/N)sum_i w_i f(X_i)", "weighted proposal average"), formula("Self-normalized", "mu_hat=sum_i w_i f_i / sum_i w_i", "used when p is known only up to scale")],
      caption: "Proposal samples are reweighted to behave like target samples.",
      flow: [node("Choose q", "easy proposal"), node("Sample X_i", "draw from q"), node("Weight p/q", "correct mismatch"), node("Weighted average", "estimate target")],
      learn: ["Derive the p/q weight.", "Check proposal support.", "Compute a weighted estimate.", "Diagnose weight degeneracy with ESS."],
      ai: "Importance sampling supports off-policy evaluation, Bayesian inference, rare-event estimation, and corrections between training and deployment distributions.",
      pitfalls: ["q must be positive wherever p contributes.", "A poor proposal produces extreme weights and unstable estimates.", "Self-normalization introduces some bias but can reduce practical difficulties."],
      example: "To estimate an expectation under p using samples x_i from q, suppose weights are [1,1,8] and f values [0,1,1]. The self-normalized estimate is (0+1+8)/(1+1+8)=0.9.",
      question: "What happens if q(x)=0 in a region where p(x)>0?",
      answer: "The proposal can never sample that target region, weights are undefined there, and the estimator can miss probability mass.",
      resources: [{ label: "Wikipedia: Importance sampling", url: "https://en.wikipedia.org/wiki/Importance_sampling" }]
    }),
    "rejection-sampling": makeDetail({
      idea: "Rejection sampling generates exact target samples by proposing candidates from an easier distribution and randomly accepting them according to how well they fit under the target curve.",
      how: "Find M such that unnormalized target p_tilde(x)<=M q(x). Draw x from q and u uniformly from 0 to 1. Accept when u<=p_tilde(x)/(M q(x)); otherwise try again.",
      concepts: [
        concept("Proposal", "Easy distribution that covers the target everywhere.", "q(x)", "A broad uniform or Gaussian."),
        concept("Envelope", "Scaled proposal that stays above the unnormalized target.", "M q(x)>=p_tilde(x)", "M controls acceptance efficiency."),
        concept("Acceptance probability", "Candidate-specific chance of being kept.", "p_tilde(x)/(M q(x))", "Candidates near target peaks are more likely accepted."),
        concept("Exact accepted samples", "After acceptance, retained samples follow the target distribution.", "X_accept ~ p", "No importance weights remain.")
      ],
      formulas: [formula("Envelope", "p_tilde(x)<=M q(x)", "proposal must dominate target"), formula("Accept", "u<=p_tilde(x)/(M q(x))", "random acceptance rule"), formula("Efficiency", "average acceptance approximately Z/M", "for target normalizer Z")],
      caption: "Candidates under the target portion of the proposal envelope are kept.",
      flow: [node("Draw x~q", "proposal candidate"), node("Draw u~Uniform", "vertical random test"), node("Compare ratio", "target over envelope"), node("Accept or retry", "kept samples follow p")],
      learn: ["Choose a proposal with full target support.", "Understand the envelope constant M.", "Apply the acceptance test.", "Relate proposal fit to efficiency."],
      ai: "Rejection sampling is useful for simple probabilistic programs, constrained sampling, and as a conceptual foundation for more advanced sampling methods.",
      pitfalls: ["If the proposal misses target support, sampling is invalid.", "A loose envelope causes many rejections.", "Efficiency often collapses in high dimensions."],
      example: "If the acceptance ratio for a candidate is 0.3 and u=0.2, accept it. If u=0.7, reject and draw another candidate.",
      question: "Does rejecting many samples bias the retained samples?",
      answer: "No, if the envelope and acceptance rule are valid; it only reduces efficiency.",
      resources: [{ label: "Wikipedia: Rejection sampling", url: "https://en.wikipedia.org/wiki/Rejection_sampling" }]
    })
  };

  function distributionDetail(config) {
    return makeDetail({
      idea: config.idea,
      how: config.how,
      concepts: config.concepts,
      formulas: config.formulas,
      caption: config.caption || `The ${config.name} distribution connects parameters to uncertain outcomes.`,
      flow: config.flow || [node("Choose parameters", config.parameterHint), node("Define support", config.support), node("Draw or score", "use PMF or PDF"), node("Interpret", config.use)],
      learn: config.learn || ["State the support and parameters.", "Read the PMF or PDF.", "Compute or interpret mean and variance.", "Recognize when this distribution is appropriate."],
      ai: config.ai,
      pitfalls: config.pitfalls,
      example: config.example,
      question: config.question,
      answer: config.answer,
      resources: config.resources,
    });
  }

  Object.assign(details, {
    bernoulli: distributionDetail({
      name: "Bernoulli", idea: "A Bernoulli variable represents one trial with two outcomes, commonly encoded 1 for success and 0 for failure.", how: "Choose success probability p. The variable equals 1 with probability p and 0 with probability 1-p.", parameterHint: "success probability p", support: "{0,1}", use: "one binary outcome",
      concepts: [concept("Binary support", "Only zero and one are possible.", "X in {0,1}", "No click or click."), concept("Success probability", "Parameter p controls chance of one.", "P(X=1)=p", "A calibrated p=0.8 predicts 80% positives over similar cases."), concept("Indicator variable", "A Bernoulli can indicate whether an event occurred.", "X=1_A", "Expected indicator equals event probability.")],
      formulas: [formula("PMF", "P(X=x)=p^x(1-p)^(1-x)", "one formula for x=0 or 1"), formula("Mean", "E[X]=p", "average success rate"), formula("Variance", "Var(X)=p(1-p)", "largest at p=0.5")],
      ai: "Binary classification outputs, dropout masks, click models, and binary latent variables use Bernoulli distributions.", pitfalls: ["Bernoulli is one trial; binomial counts many trials.", "A probability score is a parameter, not the observed binary outcome.", "Variance is smallest near deterministic p=0 or 1."],
      example: "For p=0.7, P(X=1)=0.7, P(X=0)=0.3, mean is 0.7, and variance is 0.21.", question: "What is the variance of Bernoulli(0.5)?", answer: "0.5*0.5=0.25.", resources: [{ label: "Wikipedia: Bernoulli distribution", url: "https://en.wikipedia.org/wiki/Bernoulli_distribution" }]
    }),
    binomial: distributionDetail({
      name: "Binomial", idea: "A binomial variable counts successes in a fixed number of independent Bernoulli trials with the same success probability.", how: "Choose n and p, run n independent trials, and count how many produce success.", parameterHint: "trial count n and probability p", support: "{0,...,n}", use: "count successes",
      concepts: [concept("Fixed trials", "The number n is decided before observing results.", "n", "100 independent ad impressions."), concept("Success count", "X records how many trials equal one.", "X=sum_i B_i", "Number of clicks."), concept("Combination count", "There are choose(n,k) arrangements with k successes.", "C(n,k)", "Success order does not matter.")],
      formulas: [formula("PMF", "P(X=k)=C(n,k)p^k(1-p)^(n-k)", "probability of k successes"), formula("Mean", "E[X]=np", "expected success count"), formula("Variance", "Var(X)=np(1-p)", "spread of the count")],
      ai: "Binomial models aggregate binary outcomes and supports conversion-rate uncertainty and count-based evaluation.", pitfalls: ["Trials should have the same p and suitable independence.", "The support cannot exceed n.", "Use Bernoulli for one outcome and multinomial for several categories."],
      example: "For n=10,p=0.2, expected successes are 2 and variance is 1.6.", question: "What is the expected count for n=50 and p=0.1?", answer: "np=5.", resources: [{ label: "Wikipedia: Binomial distribution", url: "https://en.wikipedia.org/wiki/Binomial_distribution" }]
    }),
    categorical: distributionDetail({
      name: "Categorical", idea: "A categorical variable represents one choice among K named classes, each with its own probability.", how: "Choose a probability vector that is nonnegative and sums to one, then draw exactly one class.", parameterHint: "class probabilities pi", support: "K category labels", use: "one multiclass outcome",
      concepts: [concept("Classes", "Outcomes are categories without required numeric distance.", "X in {1,...,K}", "Cat, dog, or bird."), concept("Probability vector", "One probability per class, summing to one.", "pi_k>=0; sum pi_k=1", "Softmax produces pi."), concept("One-hot encoding", "A class can be represented by a vector with one 1.", "y_k in {0,1}; sum y_k=1", "Useful in cross-entropy loss.")],
      formulas: [formula("PMF", "P(X=k)=pi_k", "probability of class k"), formula("One-hot likelihood", "P(y)=product_k pi_k^y_k", "selects the observed class probability"), formula("Mean of indicator", "E[1(X=k)]=pi_k", "class frequency approaches probability")],
      ai: "Multiclass classifiers and language models output categorical distributions over labels or tokens.", pitfalls: ["Class labels encoded as integers do not imply order or distance.", "Probabilities must sum to one.", "Categorical is one draw; multinomial counts repeated draws."],
      example: "For pi=[0.1,0.7,0.2], class 2 is drawn with probability 0.7 and has one-hot vector [0,1,0].", question: "What constraint must [0.2,0.3,0.5] satisfy?", answer: "Nonnegative entries summing to one, which it does.", resources: [{ label: "Wikipedia: Categorical distribution", url: "https://en.wikipedia.org/wiki/Categorical_distribution" }]
    }),
    multinomial: distributionDetail({
      name: "Multinomial", idea: "A multinomial variable counts how many times each of K categories appears across n independent categorical trials.", how: "Choose n and class probabilities pi, repeat a categorical draw n times, and return the count vector whose entries sum to n.", parameterHint: "n and class probabilities pi", support: "count vectors summing to n", use: "counts across categories",
      concepts: [concept("Count vector", "One nonnegative integer count per category.", "x_1+...+x_K=n", "Word counts across a vocabulary."), concept("Shared trial budget", "Increasing one category count leaves fewer trials for others.", "sum X_k=n", "Counts are negatively related."), concept("Repeated categorical trials", "Each trial uses the same probability vector.", "X from n draws", "Survey responses across choices.")],
      formulas: [formula("PMF", "P(X=x)=n!/(product x_k!) product pi_k^x_k", "probability of a count vector"), formula("Mean", "E[X_k]=n pi_k", "expected count in class k"), formula("Variance", "Var(X_k)=n pi_k(1-pi_k)", "spread of each count")],
      ai: "Bag-of-words models, class-count data, topic models, and grouped categorical observations use multinomial distributions.", pitfalls: ["Counts must sum exactly to n.", "Categories should be mutually exclusive per trial.", "Independent Poisson counts do not impose a fixed total like multinomial counts."],
      example: "With n=100 and pi=[0.2,0.3,0.5], expected counts are [20,30,50].", question: "Can [2,4,5] be an outcome when n=10?", answer: "No, because the counts sum to 11 rather than 10.", resources: [{ label: "Wikipedia: Multinomial distribution", url: "https://en.wikipedia.org/wiki/Multinomial_distribution" }]
    }),
    uniform: distributionDetail({
      name: "Uniform", idea: "A uniform distribution treats all allowed outcomes equally: equal mass for a finite set or constant density over an interval.", how: "Specify the support. For a continuous interval [a,b], use constant density 1/(b-a); probabilities are interval-length fractions.", parameterHint: "bounds or finite set", support: "specified set or [a,b]", use: "equal preference",
      concepts: [concept("Discrete uniform", "Every value in a finite set has equal mass.", "P(X=x)=1/K", "A fair die."), concept("Continuous uniform", "Density is constant between a and b.", "p(x)=1/(b-a)", "Random point in an interval."), concept("Translation by length", "Interval probability depends only on overlap length.", "P(c<=X<=d)=(d-c)/(b-a)", "For subintervals inside [a,b].")],
      formulas: [formula("PDF", "p(x)=1/(b-a), a<=x<=b", "constant density"), formula("Mean", "E[X]=(a+b)/2", "interval midpoint"), formula("Variance", "Var(X)=(b-a)^2/12", "spread depends on interval width")],
      ai: "Uniform distributions support initialization, randomized search, simulation, data augmentation, and baseline priors over bounded ranges.", pitfalls: ["Equal density does not mean positive probability at each exact continuous value.", "Uniform in one coordinate system may not remain uniform after transformation.", "Bounds must be explicit."],
      example: "For X uniform on [2,6], density is 1/4 and P(3<=X<=5)=2/4=0.5.", question: "What is the mean of Uniform(0,10)?", answer: "5.", resources: [{ label: "Wikipedia: Continuous uniform distribution", url: "https://en.wikipedia.org/wiki/Continuous_uniform_distribution" }]
    }),
    gaussian: distributionDetail({
      name: "Gaussian", idea: "A Gaussian distribution is a symmetric bell-shaped distribution controlled by a center and a spread. Values near the mean are most likely, with smoothly decreasing tails.", how: "Choose mean mu and variance sigma^2. Standardize values with z=(x-mu)/sigma to compare them on the standard normal scale.", parameterHint: "mean mu and variance sigma^2", support: "all real numbers", use: "symmetric continuous noise",
      concepts: [concept("Mean", "Sets the center and symmetry point.", "mu", "Changing mu shifts the bell."), concept("Variance", "Controls squared spread around the mean.", "sigma^2", "Larger sigma makes a wider, lower curve."), concept("Standard normal", "Gaussian with mean zero and variance one.", "Z~N(0,1)", "Standardization converts X to Z."), concept("Tail behavior", "Extreme values are possible but become rapidly less likely.", "about 68% within one sigma", "Useful as a rough scale rule.")],
      formulas: [formula("PDF", "p(x)=1/(sigma sqrt(2pi)) exp(-(x-mu)^2/(2sigma^2))", "bell-shaped density"), formula("Mean", "E[X]=mu", "center"), formula("Variance", "Var(X)=sigma^2", "spread"), formula("Standardize", "Z=(X-mu)/sigma", "convert to N(0,1)")],
      ai: "Gaussian noise, regression likelihoods, latent variables, initialization theory, and approximate Bayesian inference use normal distributions.", pitfalls: ["Real data may be skewed, bounded, multimodal, or heavy-tailed.", "Variance is sigma squared, while standard deviation is sigma.", "A Gaussian assigns some probability to every real value."],
      example: "If X~N(10,4), mean is 10 and standard deviation is 2. X=14 has z=(14-10)/2=2.", question: "For N(5,9), what are mean and standard deviation?", answer: "Mean 5 and standard deviation 3.", resources: [{ label: "Wikipedia: Normal distribution", url: "https://en.wikipedia.org/wiki/Normal_distribution" }]
    }),
    "multivariate-gaussian": distributionDetail({
      name: "Multivariate Gaussian", idea: "A multivariate Gaussian extends the bell curve to vectors. A mean vector sets the center and a covariance matrix controls spread, orientation, and relationships between dimensions.", how: "Choose mu and a positive-semidefinite covariance Sigma. Equal-density surfaces form ellipses or ellipsoids aligned with covariance eigenvectors.", parameterHint: "mean vector mu and covariance Sigma", support: "R^d", use: "correlated continuous vectors",
      concepts: [concept("Mean vector", "One center value per dimension.", "mu in R^d", "Average embedding location."), concept("Covariance matrix", "Variances on the diagonal and cross-dimension covariances off diagonal.", "Sigma", "Controls ellipse shape."), concept("Mahalanobis distance", "Distance scaled by covariance geometry.", "(x-mu)^T Sigma^-1 (x-mu)", "Accounts for correlated and differently scaled dimensions."), concept("Marginals and conditionals", "Subvectors and conditional slices remain Gaussian.", "Gaussian closure", "Enables tractable inference.")],
      formulas: [formula("PDF core", "p(x) proportional to exp(-1/2 (x-mu)^T Sigma^-1(x-mu))", "elliptical density"), formula("Mean", "E[X]=mu", "center vector"), formula("Covariance", "Cov(X)=Sigma", "spread and dependence")],
      ai: "Gaussian processes, Kalman filters, latent-variable models, uncertainty ellipses, and classical discriminant analysis use multivariate Gaussians.", pitfalls: ["Sigma must be symmetric positive semidefinite.", "Zero covariance implies independence only within a jointly Gaussian model.", "High-dimensional covariance estimation needs substantial data or regularization."],
      example: "For mu=[0,0] and diagonal Sigma=diag(4,1), the distribution is wider along x than y. Nonzero off-diagonal covariance rotates the ellipse.", question: "What does a zero off-diagonal covariance mean in a multivariate Gaussian?", answer: "Those two dimensions are uncorrelated and, specifically for a joint Gaussian, independent.", resources: [{ label: "Wikipedia: Multivariate normal distribution", url: "https://en.wikipedia.org/wiki/Multivariate_normal_distribution" }]
    }),
    poisson: distributionDetail({
      name: "Poisson", idea: "A Poisson variable counts events in a fixed interval when events occur independently at a roughly constant average rate.", how: "Choose expected count lambda. The distribution assigns probabilities to 0,1,2,... events, with both mean and variance equal to lambda.", parameterHint: "rate lambda", support: "nonnegative integers", use: "event counts per interval",
      concepts: [concept("Count support", "Outcomes are 0,1,2,... with no fixed upper bound.", "X in {0,1,...}", "Requests per second."), concept("Rate", "Lambda is the expected event count in the chosen interval.", "lambda>0", "Changing interval length changes lambda."), concept("Independent increments", "Counts in non-overlapping intervals are independent in a Poisson process.", "N(t+s)-N(t)", "Separate time windows."), concept("Equidispersion", "Mean and variance both equal lambda.", "E[X]=Var(X)=lambda", "Extra spread suggests a different model.")],
      formulas: [formula("PMF", "P(X=k)=exp(-lambda) lambda^k/k!", "probability of k events"), formula("Mean", "E[X]=lambda", "expected count"), formula("Variance", "Var(X)=lambda", "count spread")],
      ai: "Poisson likelihoods model event counts, word occurrences, traffic, defects, and rate-based neural outputs.", pitfalls: ["The interval and units of lambda must match.", "Burstiness or dependence can cause overdispersion.", "Use exponential for waiting times, Poisson for counts."],
      example: "If lambda=3 emails per hour, P(X=0)=exp(-3) about 0.0498 and the expected count is 3.", question: "For Poisson(lambda=7), what are mean and variance?", answer: "Both are 7.", resources: [{ label: "Wikipedia: Poisson distribution", url: "https://en.wikipedia.org/wiki/Poisson_distribution" }]
    }),
    exponential: distributionDetail({
      name: "Exponential", idea: "An exponential variable models waiting time until the next event in a constant-rate Poisson process.", how: "Choose rate lambda. Short waits are most common, and the survival probability decays exponentially with time.", parameterHint: "event rate lambda", support: "x>=0", use: "time until next event",
      concepts: [concept("Waiting time", "A positive continuous duration.", "X>=0", "Seconds until the next request."), concept("Rate", "Lambda controls how frequently events arrive.", "lambda>0", "Higher rate means shorter waits."), concept("Memorylessness", "After waiting s, the remaining wait distribution is unchanged.", "P(X>s+t|X>s)=P(X>t)", "Past waiting provides no age effect."), concept("Survival function", "Probability the wait exceeds x.", "S(x)=exp(-lambda x)", "Tail probability is simple.")],
      formulas: [formula("PDF", "p(x)=lambda exp(-lambda x), x>=0", "waiting-time density"), formula("Mean", "E[X]=1/lambda", "average wait"), formula("Variance", "Var(X)=1/lambda^2", "spread of wait")],
      ai: "Exponential models time-to-event baselines, queueing, survival analysis, and continuous-time event simulations.", pitfalls: ["Memorylessness is a strong assumption.", "Rate is inverse time, not average time itself.", "Waiting times with changing hazards need richer distributions."],
      example: "At lambda=2 events per minute, average wait is 1/2 minute and P(wait>1)=exp(-2) about 0.135.", question: "If average waiting time is 4 seconds under an exponential model, what is lambda?", answer: "1/4 per second.", resources: [{ label: "Wikipedia: Exponential distribution", url: "https://en.wikipedia.org/wiki/Exponential_distribution" }]
    }),
    beta: distributionDetail({
      name: "Beta", idea: "A Beta distribution represents uncertainty about a probability between zero and one. Two positive shape parameters behave like accumulated success and failure evidence.", how: "Choose alpha and beta. Their relative sizes set the center, while their total controls concentration. Updating with Bernoulli data adds successes to alpha and failures to beta.", parameterHint: "shape parameters alpha and beta", support: "0<=p<=1", use: "uncertain probability",
      concepts: [concept("Bounded support", "The random value itself is a probability.", "p in [0,1]", "Unknown click-through rate."), concept("Shape parameters", "Alpha favors evidence near one and beta favors evidence near zero.", "alpha,beta>0", "Both above one often give an interior peak."), concept("Concentration", "Alpha+beta controls certainty around the mean.", "alpha+beta", "Larger totals create tighter distributions."), concept("Bernoulli conjugacy", "Beta prior plus binary observations gives a Beta posterior.", "Beta(alpha+s,beta+f)", "Simple Bayesian updating.")],
      formulas: [formula("Mean", "E[P]=alpha/(alpha+beta)", "center probability"), formula("Update", "alpha'=alpha+successes; beta'=beta+failures", "posterior parameters"), formula("Variance", "alpha beta / [(alpha+beta)^2(alpha+beta+1)]", "uncertainty about p")],
      ai: "Beta distributions model uncertain conversion rates, Bernoulli probabilities, calibration, bandits, and Bayesian A/B tests.", pitfalls: ["The Beta random variable is a probability, not the binary observation.", "Same mean can have very different concentration.", "Alpha and beta need not be integer counts."],
      example: "Beta(2,2) has mean 0.5. After 8 successes and 2 failures, the posterior is Beta(10,4) with mean 10/14 about 0.714.", question: "What is the mean of Beta(3,1)?", answer: "3/(3+1)=0.75.", resources: [{ label: "Wikipedia: Beta distribution", url: "https://en.wikipedia.org/wiki/Beta_distribution" }]
    }),
    gamma: distributionDetail({
      name: "Gamma", idea: "A Gamma distribution models positive continuous quantities and can represent waiting time until several Poisson events or uncertainty about a positive rate.", how: "Choose shape alpha and rate beta (or scale theta=1/beta). The shape controls skew and the rate controls the time or magnitude scale.", parameterHint: "shape alpha and rate beta", support: "x>0", use: "positive durations or rates",
      concepts: [concept("Positive support", "Only positive values are possible.", "X>0", "Waiting time or intensity."), concept("Shape", "Controls whether density is strongly skewed or more bell-like.", "alpha>0", "Large alpha is less relatively skewed."), concept("Rate versus scale", "Two parameterizations use reciprocal quantities.", "theta=1/beta", "Always check library convention."), concept("Waiting for events", "For integer shape, Gamma can sum exponential waiting times.", "X=sum of alpha exponentials", "Time until the alpha-th event.")],
      formulas: [formula("Mean with rate", "E[X]=alpha/beta", "average positive value"), formula("Variance with rate", "Var(X)=alpha/beta^2", "spread"), formula("Scale form", "E[X]=alpha theta", "when theta=1/beta")],
      ai: "Gamma priors model rates and precisions; Gamma likelihoods model positive skewed durations and magnitudes.", pitfalls: ["Rate and scale parameterizations are easy to confuse.", "Gamma is continuous, while Poisson is a count distribution.", "It does not allow zero or negative values in the usual form."],
      example: "Gamma with shape 3 and rate 2 has mean 1.5 and variance 0.75.", question: "For shape 4 and rate 2, what is the mean?", answer: "4/2=2.", resources: [{ label: "Wikipedia: Gamma distribution", url: "https://en.wikipedia.org/wiki/Gamma_distribution" }]
    }),
    dirichlet: distributionDetail({
      name: "Dirichlet", idea: "A Dirichlet distribution represents uncertainty over a whole probability vector whose nonnegative entries sum to one. It generalizes the Beta distribution from two categories to many.", how: "Choose one positive concentration alpha_k per category. Their ratios determine the mean probabilities, and their total determines how concentrated samples are.", parameterHint: "concentrations alpha_1...alpha_K", support: "probability simplex", use: "uncertain class proportions",
      concepts: [concept("Simplex support", "Each sample is a probability vector.", "pi_k>=0; sum pi_k=1", "Topic proportions."), concept("Concentration vector", "One positive parameter per category.", "alpha", "Larger alpha_k favors category k."), concept("Total concentration", "Sum alpha_0 controls confidence around the mean.", "alpha_0=sum_k alpha_k", "Small totals create sparse corner-like samples."), concept("Categorical conjugacy", "Observed category counts add to alpha.", "alpha'_k=alpha_k+n_k", "Posterior update for class proportions.")],
      formulas: [formula("Mean", "E[pi_k]=alpha_k/alpha_0", "average category probability"), formula("Update", "alpha'_k=alpha_k+n_k", "add observed counts"), formula("Simplex", "sum_k pi_k=1", "probability-vector constraint")],
      ai: "Dirichlet distributions appear in topic models, mixture weights, uncertain class frequencies, Bayesian smoothing, and compositional data.", pitfalls: ["Dirichlet components are dependent because they must sum to one.", "Large equal alpha gives near-uniform samples; small equal alpha gives sparse samples.", "It cannot express every kind of multimodal dependency over the simplex."],
      example: "Dirichlet([2,3,5]) has mean [0.2,0.3,0.5]. Observing counts [1,0,4] gives posterior parameters [3,3,9].", question: "What is the mean of Dirichlet([1,1,2])?", answer: "[0.25,0.25,0.5].", resources: [{ label: "Wikipedia: Dirichlet distribution", url: "https://en.wikipedia.org/wiki/Dirichlet_distribution" }]
    }),
    "student-s-t": distributionDetail({
      name: "Student's t", idea: "Student's t is a symmetric bell-shaped distribution with heavier tails than a Gaussian. It allows more probability for extreme values, especially with few degrees of freedom.", how: "Choose location, scale, and degrees of freedom nu. As nu increases, the tails become lighter and the distribution approaches a Gaussian.", parameterHint: "location, scale, degrees of freedom nu", support: "all real numbers", use: "robust heavy-tailed uncertainty",
      concepts: [concept("Heavy tails", "Extreme values receive more probability than under a Gaussian.", "tail thickness controlled by nu", "More robust to occasional outliers."), concept("Degrees of freedom", "Controls tail weight.", "nu>0", "Small nu means heavier tails."), concept("Gaussian limit", "The distribution approaches normal as nu grows.", "nu->infinity", "Large-sample t intervals resemble z intervals."), concept("Scale mixture", "A t distribution can be viewed as a Gaussian with uncertain variance.", "normal-inverse-gamma mixture", "Explains adaptive tail width.")],
      formulas: [formula("Standard t core", "p(x) proportional to (1+x^2/nu)^(-(nu+1)/2)", "heavy-tailed density"), formula("Mean", "E[X]=0 for nu>1", "standard centered form"), formula("Variance", "Var(X)=nu/(nu-2) for nu>2", "infinite or undefined for smaller nu")],
      ai: "Student's t likelihoods provide robust regression and uncertainty models when data contain outliers or variance is uncertain.", pitfalls: ["Variance does not exist for nu<=2.", "Heavy tails reduce outlier influence but change calibration.", "Do not confuse the t distribution with the t statistic's specific sampling setup."],
      example: "A t distribution with nu=3 assigns substantially more mass far from zero than N(0,1); with nu=100 it is very close to Gaussian.", question: "What happens to Student's t as degrees of freedom becomes very large?", answer: "It approaches a Gaussian distribution.", resources: [{ label: "Wikipedia: Student's t-distribution", url: "https://en.wikipedia.org/wiki/Student%27s_t-distribution" }]
    }),
    "log-normal": distributionDetail({
      name: "Log-normal", idea: "A positive variable is log-normal when its logarithm is Gaussian. The result is right-skewed: many moderate values and a few very large ones.", how: "Sample Z from a Gaussian and transform X=exp(Z). Multiplication in X-space becomes addition in log-space.", parameterHint: "log-mean mu and log-variance sigma^2", support: "x>0", use: "positive multiplicative quantities",
      concepts: [concept("Log transform", "Taking log converts X into a Gaussian variable.", "log X~N(mu,sigma^2)", "Analyze positive skew on a symmetric scale."), concept("Multiplicative growth", "Products of many positive factors naturally lead to log-normal behavior.", "log product=sum logs", "File sizes or incomes."), concept("Right skew", "The distribution has a long upper tail.", "mean>median", "Rare large values pull the mean upward."), concept("Parameter meaning", "Mu and sigma describe log X, not X directly.", "median=exp(mu)", "Back-transform carefully.")],
      formulas: [formula("Construction", "X=exp(Z), Z~N(mu,sigma^2)", "exponentiate a Gaussian"), formula("Mean", "E[X]=exp(mu+sigma^2/2)", "larger than median"), formula("Median", "median(X)=exp(mu)", "50th percentile")],
      ai: "Log-normal models positive scales, runtimes, file sizes, multiplicative noise, and positive latent parameters.", pitfalls: ["Mu is not the mean of X.", "Taking logs requires strictly positive values.", "The long tail can make sample averages unstable."],
      example: "If log X~N(0,1), median X is 1 while mean is exp(0.5) about 1.65.", question: "If log X has mean mu=2, what is the median of X?", answer: "exp(2).", resources: [{ label: "Wikipedia: Log-normal distribution", url: "https://en.wikipedia.org/wiki/Log-normal_distribution" }]
    }),
    gumbel: distributionDetail({
      name: "Gumbel", idea: "The Gumbel distribution models extreme values such as maxima. It also enables the Gumbel-max trick for sampling categorical choices from unnormalized scores.", how: "Choose location mu and scale beta. For categorical sampling, add independent standard Gumbel noise to each log-probability and take the largest result.", parameterHint: "location mu and scale beta", support: "all real numbers", use: "extremes or categorical sampling",
      concepts: [concept("Extreme-value model", "Describes normalized maxima from many light-tailed observations.", "maximum limit law", "Largest load or score."), concept("Location and scale", "Mu shifts the curve and beta>0 controls spread.", "mu,beta", "Larger beta creates broader extremes."), concept("Gumbel-max trick", "Turns categorical probabilities into an argmax with random noise.", "argmax_k(log pi_k+g_k)", "Produces an exact categorical sample."), concept("Gumbel-softmax", "Replaces hard argmax with temperature-controlled softmax for differentiable approximation.", "softmax((log pi+g)/tau)", "Lower tau approaches one-hot output.")],
      formulas: [formula("CDF", "F(x)=exp(-exp(-(x-mu)/beta))", "probability maximum is at most x"), formula("Gumbel-max", "sample=argmax_k(log pi_k+g_k)", "categorical draw"), formula("Soft relaxation", "y=softmax((log pi+g)/tau)", "differentiable approximate sample")],
      ai: "Gumbel noise supports discrete latent-variable relaxations, differentiable architecture choices, ranking, and categorical sampling.", pitfalls: ["Gumbel-softmax is a relaxation whose bias depends on temperature.", "Very low temperature can cause unstable gradients.", "Gumbel models a particular class of extremes, not every heavy-tail process."],
      example: "Given class probabilities pi, draw one Gumbel value per class and choose the largest log(pi_k)+g_k. Repeating this produces categorical frequencies matching pi.", question: "What happens to Gumbel-softmax samples as temperature approaches zero?", answer: "They become increasingly one-hot and resemble hard argmax samples, while gradients can become less stable.", resources: [{ label: "Wikipedia: Gumbel distribution", url: "https://en.wikipedia.org/wiki/Gumbel_distribution" }, { label: "Categorical Reparameterization with Gumbel-Softmax", url: "https://arxiv.org/abs/1611.01144" }]
    })
  });

  const expandedDetails = {
    "sample-spaces-and-events": {
      prerequisites: ["Sets, unions, intersections, and complements.", "Fractions and proportions.", "The idea of an uncertain experiment."],
      notationGuide: [{ symbol: "Omega", latex: "\\Omega", meaning: "Sample space containing every possible outcome." }, { symbol: "omega", latex: "\\omega", meaning: "One outcome in the sample space." }, { symbol: "A subset Omega", latex: "A\\subseteq\\Omega", meaning: "An event: a set of outcomes." }, { symbol: "A^c", latex: "A^c", meaning: "Complement event: A does not occur." }],
      formulaLatex: ["P(\\Omega)=1", "P(A^c)=1-P(A)", "P(A\\cup B)=P(A)+P(B)-P(A\\cap B)"],
      derivation: { title: "Derive the addition rule", steps: ["Count probability in A and probability in B.", "Outcomes in A intersect B were counted once in each term.", "Subtract their probability once to remove the duplicate.", "The remaining total equals the probability that A or B or both occur."] },
      workedExamples: [{ title: "Roll one die", setup: "Let Omega={1,2,3,4,5,6}; A is even and B is greater than 4.", steps: ["A={2,4,6} and B={5,6}.", "A intersect B={6}.", "Use 3/6+2/6-1/6."], result: "P(A union B)=4/6=2/3." }, { title: "Use a complement", setup: "Three independent attempts each fail with probability 0.2.", steps: ["The event 'at least one succeeds' is the complement of 'all fail'.", "All fail has probability 0.2^3=0.008.", "Subtract from one."], result: "At least one succeeds with probability 0.992." }],
      exercises: [{ level: "Beginner", question: "For a coin toss, write the sample space and event 'heads'.", answer: "Omega={H,T} and A={H}." }, { level: "Intermediate", question: "If P(A)=0.6, P(B)=0.5, and P(A intersect B)=0.3, find P(A union B).", answer: "0.6+0.5-0.3=0.8." }, { level: "Applied", question: "Why must a model's label outcomes be mutually exclusive before softmax probabilities can be added directly?", answer: "Direct addition assumes events do not overlap; overlapping labels would double-count shared outcomes." }],
      takeaways: ["A sample space defines what can happen.", "Events are subsets, not single outcomes only.", "Probability is additive for disjoint events.", "Complements and inclusion-exclusion avoid difficult direct counting."]
    },
    "conditional-probability": {
      prerequisites: ["Events and intersections.", "Ratios and fractions.", "Reading probability tables."],
      notationGuide: [{ symbol: "P(A|B)", latex: "P(A\\mid B)", meaning: "Probability of A after learning B occurred." }, { symbol: "A intersect B", latex: "A\\cap B", meaning: "Both A and B occur." }, { symbol: "P(B)>0", latex: "P(B)>0", meaning: "Conditioning event must have positive probability in the elementary formula." }],
      formulaLatex: ["P(A\\mid B)=\\frac{P(A\\cap B)}{P(B)}", "P(A\\cap B)=P(A\\mid B)P(B)"],
      derivation: { title: "Restrict the sample space", steps: ["Before observing B, total probability mass is spread over Omega.", "After observing B, outcomes outside B are impossible.", "A can now occur only through A intersect B.", "Renormalize by total remaining mass P(B), giving P(A intersect B)/P(B)."] },
      workedExamples: [{ title: "Cards without replacement", setup: "Draw one card from a deck. Given it is a face card, find probability it is a king.", steps: ["There are 12 face cards.", "Four of those are kings.", "Conditioning restricts the denominator to 12."], result: "P(king|face)=4/12=1/3." }, { title: "Read a confusion table", setup: "Of 100 cases, 20 are positive and 16 of those were detected.", steps: ["Condition on actually positive cases.", "The intersection of positive and detected has count 16.", "Divide 16 by 20."], result: "P(detected|positive)=0.8, the recall." }],
      exercises: [{ level: "Beginner", question: "If P(A intersect B)=0.2 and P(B)=0.5, find P(A|B).", answer: "0.4." }, { level: "Intermediate", question: "If P(A|B)=0.7 and P(B)=0.3, find P(A intersect B).", answer: "0.21." }, { level: "Applied", question: "Why is P(disease|positive test) not the same as P(positive test|disease)?", answer: "They condition on different populations; the first also depends strongly on disease prevalence." }],
      takeaways: ["Conditioning restricts and renormalizes the possible outcomes.", "The order around the conditioning bar matters.", "The multiplication rule is the conditional formula rearranged.", "Conditional probabilities are the building blocks of Bayes' theorem and graphical models."]
    },
    "independence-and-conditional-independence": {
      prerequisites: ["Conditional probability.", "Joint events.", "Basic causal-versus-statistical reasoning."],
      notationGuide: [{ symbol: "A independent B", latex: "A\\perp B", meaning: "Knowing one does not change probability of the other." }, { symbol: "A independent B | C", latex: "A\\perp B\\mid C", meaning: "A and B become independent after C is known." }, { symbol: "P(A,B)", latex: "P(A\\cap B)", meaning: "Joint probability of both events." }],
      formulaLatex: ["P(A\\cap B)=P(A)P(B)", "P(A\\cap B\\mid C)=P(A\\mid C)P(B\\mid C)"],
      derivation: { title: "Connect independence to conditioning", steps: ["Start from P(A|B)=P(A intersect B)/P(B).", "Independence says learning B leaves P(A) unchanged.", "Set P(A|B)=P(A).", "Multiply by P(B) to obtain P(A intersect B)=P(A)P(B)."] },
      workedExamples: [{ title: "Independent coin tosses", setup: "Toss a fair coin twice; A is first toss heads and B is second toss heads.", steps: ["P(A)=P(B)=1/2.", "P(A and B)=1/4.", "The product also equals 1/4."], result: "A and B are independent." }, { title: "Dependence removed by a group", setup: "Shoe size and reading level are associated across a mixed sample of children and adults.", steps: ["Age affects both variables.", "Within one narrow age group, the association may vanish.", "Conditioning on age blocks the shared explanation."], result: "The variables can be conditionally independent given age without being marginally independent." }],
      exercises: [{ level: "Beginner", question: "If independent events have probabilities 0.2 and 0.5, find their joint probability.", answer: "0.1." }, { level: "Intermediate", question: "Can mutually exclusive events with positive probabilities be independent?", answer: "No. Their joint probability is zero, but the product of positive marginals is positive." }, { level: "Applied", question: "Why is conditional independence useful in probabilistic graphical models?", answer: "It permits a joint distribution to factor into smaller local terms, reducing representation and inference cost." }],
      takeaways: ["Independence is a precise factorization property.", "Zero correlation is weaker than independence in general.", "Conditional independence can appear or disappear after controlling for another variable.", "Independence does not establish absence of causal influence without assumptions."]
    },
    "random-variables": {
      prerequisites: ["Sample spaces and events.", "Functions and mappings.", "Discrete versus continuous quantities."],
      notationGuide: [{ symbol: "X", latex: "X", meaning: "Random variable as a function on outcomes." }, { symbol: "X(omega)", latex: "X(\\omega)", meaning: "Numeric or categorical value assigned to outcome omega." }, { symbol: "{X in A}", latex: "\\{X\\in A\\}", meaning: "Event that X lands in set A." }, { symbol: "x", latex: "x", meaning: "A realized value, not the random variable itself." }],
      formulaLatex: ["X(\\omega)=x", "P(X\\in A)"],
      derivation: { title: "Create a distribution from outcomes", steps: ["Define the sample space and probabilities of elementary outcomes.", "Choose a function X that maps each outcome to a value.", "Group all outcomes mapping to the same value x.", "Add their probabilities to obtain the distribution of X."] },
      workedExamples: [{ title: "Count heads", setup: "Toss two coins and let X be the number of heads.", steps: ["HH maps to 2.", "HT and TH map to 1.", "TT maps to 0."], result: "P(X=0)=1/4, P(X=1)=1/2, and P(X=2)=1/4." }, { title: "Indicator variable", setup: "Let I_A=1 if event A occurs and 0 otherwise.", steps: ["Every outcome maps to zero or one.", "P(I_A=1)=P(A).", "The average value equals the event probability."], result: "Indicators turn event counting into algebra and expectation." }],
      exercises: [{ level: "Beginner", question: "For one die, define X as parity. What values can X take?", answer: "For example X in {even, odd}; a random variable may be categorical." }, { level: "Intermediate", question: "For two dice, let S be their sum. How many elementary outcomes map to S=7?", answer: "Six: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1)." }, { level: "Applied", question: "Why distinguish a random variable X from an observed value x?", answer: "X describes uncertainty before observation; x is one realized data value used after sampling." }],
      takeaways: ["A random variable is a function, not a mysterious changing number.", "It transfers probability from outcomes to useful values.", "Different outcomes may map to the same value.", "Indicator variables connect events, counts, and expectations."]
    },
    "probability-mass-and-density-functions": {
      prerequisites: ["Random variables.", "Sums and basic integration.", "Discrete versus continuous supports."],
      notationGuide: [{ symbol: "p_X(x)", latex: "p_X(x)", meaning: "PMF or density value for X at x." }, { symbol: "P(X=x)", latex: "P(X=x)", meaning: "Point probability, meaningful directly for discrete X." }, { symbol: "support", latex: "\\mathcal X", meaning: "Values where the distribution can place mass or density." }, { symbol: "dx", latex: "dx", meaning: "Infinitesimal interval width in a continuous integral." }],
      formulaLatex: ["P(X\\in A)=\\sum_{x\\in A}p_X(x)", "P(a\\leq X\\leq b)=\\int_a^b p_X(x)\\,dx", "\\sum_xp_X(x)=1,\\qquad\\int p_X(x)\\,dx=1"],
      derivation: { title: "Why continuous density is not point probability", steps: ["Probability over [x,x+Delta x] is approximately p(x)Delta x.", "As Delta x shrinks, interval probability shrinks with its width.", "At a single point the width is zero, so probability is zero for a regular continuous density.", "Density may exceed one; only integrated area must stay between zero and one."] },
      workedExamples: [{ title: "Use a PMF", setup: "Let p(0)=0.2, p(1)=0.5, p(2)=0.3.", steps: ["Check values are nonnegative.", "Their sum is one.", "For event X>=1, add p(1)+p(2)."], result: "P(X>=1)=0.8." }, { title: "Use a density", setup: "Let p(x)=2x on 0<=x<=1.", steps: ["Normalize: integral_0^1 2x dx=1.", "For X<=0.5 integrate from 0 to 0.5.", "Evaluate x^2 at the bounds."], result: "P(X<=0.5)=0.25." }],
      exercises: [{ level: "Beginner", question: "Can a valid PMF assign p(x)=1.2?", answer: "No. A discrete point probability cannot exceed one." }, { level: "Intermediate", question: "For density p(x)=1/2 on [0,2], find P(0.5<=X<=1.5).", answer: "Interval length 1 times density 1/2 gives 0.5." }, { level: "Applied", question: "Why does a neural density model output log density instead of point probability?", answer: "For continuous data a point has zero probability; density describes relative concentration and log density is numerically stable." }],
      takeaways: ["PMFs assign probability mass to discrete values.", "Densities assign probability per unit and must be integrated.", "Both are nonnegative and normalize to one.", "Support determines which values are possible."]
    },
    "cumulative-distributions": {
      prerequisites: ["PMFs and densities.", "Ordering on the real line.", "Sums, integrals, and derivatives."],
      notationGuide: [{ symbol: "F_X(x)", latex: "F_X(x)", meaning: "CDF: probability that X is at most x." }, { symbol: "F(x-)", latex: "F(x^-)", meaning: "CDF value immediately before x." }, { symbol: "F^-1(q)", latex: "F^{-1}(q)", meaning: "Quantile at cumulative probability q." }],
      formulaLatex: ["F_X(x)=P(X\\leq x)", "P(a<X\\leq b)=F_X(b)-F_X(a)", "p_X(x)=F_X'(x)"],
      derivation: { title: "Recover probabilities from a CDF", steps: ["F(b) includes all probability at or below b.", "F(a) includes all probability at or below a.", "Subtracting removes the portion up to a.", "The remainder is probability in (a,b], with endpoint details handled by jumps for discrete variables."] },
      workedExamples: [{ title: "CDF of a fair die", setup: "Let X be a fair die roll.", steps: ["F(2)=P(X<=2)=2/6.", "F(5)=5/6.", "The CDF jumps by 1/6 at each integer."], result: "P(2<X<=5)=F(5)-F(2)=3/6." }, { title: "Invert a uniform CDF", setup: "X is uniform on [0,1], so F(x)=x inside the interval.", steps: ["Set F(x)=q.", "Solve x=q.", "For q=0.9, x=0.9."], result: "The 90th percentile is 0.9." }],
      exercises: [{ level: "Beginner", question: "What are the limiting CDF values as x goes to negative and positive infinity?", answer: "Zero and one, respectively." }, { level: "Intermediate", question: "If F(3)=0.8 and F(1)=0.25, find P(1<X<=3).", answer: "0.55." }, { level: "Applied", question: "How can inverse-CDF sampling generate X from a uniform U?", answer: "Set X=F^-1(U); the transformation produces the target cumulative probabilities." }],
      takeaways: ["Every distribution has a CDF.", "CDFs are nondecreasing, right-continuous, and bounded from zero to one.", "Differences of CDF values give interval probabilities.", "Quantiles invert cumulative probability."]
    },
    "joint-marginal-and-conditional-distributions": {
      prerequisites: ["Random variables and conditional probability.", "PMFs or densities.", "Summation and integration."],
      notationGuide: [{ symbol: "p(x,y)", latex: "p(x,y)", meaning: "Joint distribution of X and Y." }, { symbol: "p_X(x)", latex: "p_X(x)", meaning: "Marginal distribution of X." }, { symbol: "p(x|y)", latex: "p(x\\mid y)", meaning: "Conditional distribution after observing Y=y." }, { symbol: "integrate out", latex: "\\int p(x,y)\\,dy", meaning: "Remove Y by summing or integrating over it." }],
      formulaLatex: ["p_X(x)=\\sum_y p(x,y)", "p(x\\mid y)=\\frac{p(x,y)}{p_Y(y)}", "p(x,y)=p(x\\mid y)p_Y(y)"],
      derivation: { title: "Move among joint, marginal, and conditional views", steps: ["Begin with joint mass p(x,y), which describes pairs.", "Sum over every y to obtain marginal p_X(x).", "For a fixed y, divide joint values by p_Y(y) to renormalize the slice.", "Multiplying the conditional slice by p_Y(y) reconstructs the joint distribution."] },
      workedExamples: [{ title: "Marginalize a table", setup: "Joint rows for X=0 are 0.1 and 0.2; rows for X=1 are 0.3 and 0.4 across two Y values.", steps: ["Add across Y for X=0 to get 0.3.", "Add across Y for X=1 to get 0.7.", "Totals sum to one."], result: "The marginal of X is (0.3,0.7)." }, { title: "Condition one slice", setup: "Using the same table, condition on the second Y column whose total is 0.6.", steps: ["Joint masses are 0.2 and 0.4.", "Divide each by 0.6.", "The conditional values sum to one."], result: "P(X=0|Y=2)=1/3 and P(X=1|Y=2)=2/3." }],
      exercises: [{ level: "Beginner", question: "How do you get p(y) from p(x,y)?", answer: "Sum or integrate the joint distribution over every x." }, { level: "Intermediate", question: "If p(x,y)=p(x)p(y) everywhere, what relationship holds?", answer: "X and Y are independent." }, { level: "Applied", question: "Why do generative models often factor a joint sequence distribution into conditionals?", answer: "The chain rule converts a huge joint table into learnable next-step conditional distributions." }],
      takeaways: ["A joint distribution preserves relationships between variables.", "Marginalization removes variables by summing or integrating.", "Conditioning selects and renormalizes a slice.", "Joint distributions can be factorized into marginals and conditionals."]
    },
    "expectation": {
      prerequisites: ["PMFs and densities.", "Weighted averages.", "Sums and integrals."],
      notationGuide: [{ symbol: "E[X]", latex: "\\mathbb E[X]", meaning: "Expected or long-run average value." }, { symbol: "mu", latex: "\\mu", meaning: "Common symbol for a distribution mean." }, { symbol: "E[g(X)]", latex: "\\mathbb E[g(X)]", meaning: "Average of a transformed random variable." }, { symbol: "indicator I_A", latex: "\\mathbf 1_A", meaning: "One when A occurs and zero otherwise." }],
      formulaLatex: ["\\mathbb E[X]=\\sum_x x p(x)", "\\mathbb E[X]=\\int x p(x)\\,dx", "\\mathbb E[aX+b]=a\\mathbb E[X]+b"],
      derivation: { title: "Derive linearity of expectation", steps: ["Write E[aX+b] as sum_x (ax+b)p(x).", "Distribute the sum into a sum_x x p(x)+b sum_x p(x).", "Recognize the first sum as E[X].", "Use normalization sum_x p(x)=1 to obtain aE[X]+b."] },
      workedExamples: [{ title: "Fair die mean", setup: "X is a fair die roll.", steps: ["Weight each value 1 through 6 by 1/6.", "Add 1+2+3+4+5+6=21.", "Divide by 6."], result: "E[X]=3.5, even though 3.5 is not a possible roll." }, { title: "Indicator counting", setup: "Let C=sum_i I_i count successes across trials.", steps: ["Linearity gives E[C]=sum_i E[I_i].", "Each indicator mean is its success probability p_i.", "Independence is not required for this expectation step."], result: "E[C]=sum_i p_i." }],
      exercises: [{ level: "Beginner", question: "For X in {0,1} with P(X=1)=0.3, find E[X].", answer: "0.3." }, { level: "Intermediate", question: "If E[X]=4, find E[3X-2].", answer: "3*4-2=10." }, { level: "Applied", question: "Why is minimizing empirical mean loss related to expectation?", answer: "The sample average estimates expected loss under the data distribution." }],
      takeaways: ["Expectation is a probability-weighted average.", "It need not be a possible observed value.", "Linearity holds without independence.", "Expectations turn random outcomes into optimization objectives and performance summaries."]
    },
    "variance-and-covariance": {
      prerequisites: ["Expectation.", "Squared deviations.", "Two-variable joint distributions."],
      notationGuide: [{ symbol: "Var(X)", latex: "\\operatorname{Var}(X)", meaning: "Expected squared distance from the mean." }, { symbol: "sigma^2", latex: "\\sigma^2", meaning: "Common variance notation." }, { symbol: "Cov(X,Y)", latex: "\\operatorname{Cov}(X,Y)", meaning: "Average paired deviation of X and Y." }, { symbol: "Sigma", latex: "\\Sigma", meaning: "Covariance matrix for a random vector." }],
      formulaLatex: ["\\operatorname{Var}(X)=\\mathbb E[X^2]-\\mathbb E[X]^2", "\\operatorname{Cov}(X,Y)=\\mathbb E[XY]-\\mathbb E[X]\\mathbb E[Y]", "\\operatorname{Var}(X+Y)=\\operatorname{Var}(X)+\\operatorname{Var}(Y)+2\\operatorname{Cov}(X,Y)"],
      derivation: { title: "Derive the computational variance identity", steps: ["Start with E[(X-mu)^2].", "Expand the square to X^2-2mu X+mu^2.", "Take expectations and use E[X]=mu.", "Simplify E[X^2]-2mu^2+mu^2 to E[X^2]-mu^2."] },
      workedExamples: [{ title: "Variance of a Bernoulli", setup: "X is zero or one with P(X=1)=p.", steps: ["E[X]=p.", "Because X^2=X, E[X^2]=p.", "Subtract p^2."], result: "Var(X)=p(1-p)." }, { title: "Variance of a sum", setup: "X and Y each have variance 1 and covariance 0.5.", steps: ["Add individual variances: 2.", "Add twice covariance: 1.", "Total the terms."], result: "Var(X+Y)=3." }],
      exercises: [{ level: "Beginner", question: "If X is constant, what is its variance?", answer: "Zero, because every deviation from its mean is zero." }, { level: "Intermediate", question: "If X and Y are independent with variances 2 and 5, find Var(X+Y).", answer: "7 because independence gives zero covariance." }, { level: "Applied", question: "What does a large covariance-matrix eigenvalue indicate?", answer: "Data varies strongly along the corresponding eigenvector direction." }],
      takeaways: ["Variance measures squared spread around the mean.", "Covariance measures whether deviations move together.", "Independence implies zero covariance when moments exist, but not conversely.", "Covariance matrices encode multivariate scale and orientation."]
    },
    "correlation": {
      prerequisites: ["Variance, covariance, and standard deviation.", "Linear relationships.", "Scatterplot interpretation."],
      notationGuide: [{ symbol: "rho_XY", latex: "\\rho_{XY}", meaning: "Population correlation." }, { symbol: "sigma_X", latex: "\\sigma_X", meaning: "Standard deviation of X." }, { symbol: "Corr(X,Y)", latex: "\\operatorname{Corr}(X,Y)", meaning: "Standardized covariance." }],
      formulaLatex: ["\\operatorname{Corr}(X,Y)=\\frac{\\operatorname{Cov}(X,Y)}{\\sigma_X\\sigma_Y}", "-1\\leq\\operatorname{Corr}(X,Y)\\leq1"],
      derivation: { title: "Standardize covariance", steps: ["Covariance changes when either variable is rescaled.", "Divide X deviations by sigma_X and Y deviations by sigma_Y.", "Their covariance becomes Cov(X,Y)/(sigma_X sigma_Y).", "Cauchy-Schwarz bounds this dimensionless value between -1 and 1."] },
      workedExamples: [{ title: "Perfect positive relation", setup: "Let Y=3X+2 with nonzero variance in X.", steps: ["Centering removes the +2.", "Positive scaling multiplies covariance and standard deviation consistently.", "The standardized ratio is one."], result: "Corr(X,Y)=1." }, { title: "Nonlinear dependence", setup: "Let X be symmetric around zero and Y=X^2.", steps: ["Positive and negative X values produce the same Y.", "Linear positive and negative contributions can cancel.", "Yet Y is completely determined by X."], result: "Correlation can be zero despite strong nonlinear dependence." }],
      exercises: [{ level: "Beginner", question: "What are the units of correlation?", answer: "None; standardization makes it dimensionless." }, { level: "Intermediate", question: "What happens to correlation if X is multiplied by -2?", answer: "Its sign flips while magnitude stays the same, assuming nonzero variance." }, { level: "Applied", question: "Why does high feature-label correlation not prove a useful causal feature?", answer: "Confounding, leakage, or reverse causation can create association without a stable causal effect." }],
      takeaways: ["Correlation is standardized linear association.", "It lies between -1 and 1 when variances are nonzero.", "It is invariant to positive shifts and scales.", "Correlation does not capture every dependence and does not imply causation."]
    },
    "law-of-total-probability": {
      prerequisites: ["Conditional probability.", "Disjoint events and partitions.", "Weighted averages."],
      notationGuide: [{ symbol: "{B_i}", latex: "\\{B_i\\}", meaning: "A disjoint exhaustive partition of the sample space." }, { symbol: "P(A|B_i)", latex: "P(A\\mid B_i)", meaning: "Probability of A inside partition group i." }, { symbol: "sum_i", latex: "\\sum_i", meaning: "Combine contributions from all groups." }],
      formulaLatex: ["P(A)=\\sum_i P(A\\mid B_i)P(B_i)", "P(A)=P(A\\mid B)P(B)+P(A\\mid B^c)P(B^c)"],
      derivation: { title: "Decompose an event across a partition", steps: ["The pieces A intersect B_i are disjoint because the B_i are disjoint.", "Their union equals A because the partition covers every outcome.", "Add their probabilities.", "Replace each joint term with P(A|B_i)P(B_i)."] },
      workedExamples: [{ title: "Factory defect rate", setup: "Factory 1 makes 70% of items with 1% defects; factory 2 makes 30% with 4% defects.", steps: ["Weight first defect rate: 0.7*0.01.", "Weight second: 0.3*0.04.", "Add the contributions."], result: "Overall defect probability is 0.019, or 1.9%." }, { title: "Model error by subgroup", setup: "Two groups have frequencies 0.6 and 0.4 with error rates 0.1 and 0.2.", steps: ["Multiply each conditional error by group frequency.", "Obtain 0.06 and 0.08.", "Add them."], result: "Overall error is 0.14." }],
      exercises: [{ level: "Beginner", question: "If P(B)=0.25, P(A|B)=0.8, and P(A|B^c)=0.2, find P(A).", answer: "0.8*0.25+0.2*0.75=0.35." }, { level: "Intermediate", question: "Why must partition events cover Omega?", answer: "Otherwise some ways for A to occur would be omitted from the total." }, { level: "Applied", question: "How can changing subgroup proportions shift aggregate model accuracy without subgroup performance changing?", answer: "Overall accuracy is a total-probability weighted average, so changing weights changes the aggregate." }],
      takeaways: ["A partition splits an event into disjoint routes.", "Total probability is a weighted average of conditional probabilities.", "Weights are group prevalences and must sum to one.", "The law provides the denominator in Bayes' theorem."]
    },
    "bayes-theorem": {
      prerequisites: ["Conditional probability.", "Law of total probability.", "Ratios and odds."],
      notationGuide: [{ symbol: "P(H)", latex: "P(H)", meaning: "Prior belief in hypothesis H." }, { symbol: "P(E|H)", latex: "P(E\\mid H)", meaning: "Likelihood of evidence E under H." }, { symbol: "P(H|E)", latex: "P(H\\mid E)", meaning: "Posterior belief after observing E." }, { symbol: "P(E)", latex: "P(E)", meaning: "Evidence probability or normalizing constant." }],
      formulaLatex: ["P(H\\mid E)=\\frac{P(E\\mid H)P(H)}{P(E)}", "P(E)=\\sum_hP(E\\mid h)P(h)", "\\text{posterior odds}=\\text{likelihood ratio}\\times\\text{prior odds}"],
      derivation: { title: "Derive Bayes' theorem from the joint event", steps: ["Write P(H intersect E)=P(E|H)P(H).", "Also write the same joint probability as P(H|E)P(E).", "Set the two expressions equal.", "Divide by P(E) to solve for P(H|E)."] },
      workedExamples: [{ title: "Medical test", setup: "Prevalence is 1%, sensitivity 90%, and false-positive rate 5%.", steps: ["True-positive mass is 0.01*0.90=0.009.", "False-positive mass is 0.99*0.05=0.0495.", "Divide 0.009 by total positive mass 0.0585."], result: "P(disease|positive) is about 15.4%, not 90%." }, { title: "Update model hypotheses", setup: "Two models have priors 0.6 and 0.4; observed data likelihoods are 0.2 and 0.5.", steps: ["Unnormalized posterior weights are 0.12 and 0.20.", "Their sum is 0.32.", "Normalize each weight."], result: "Posteriors are 0.375 and 0.625." }],
      exercises: [{ level: "Beginner", question: "If prior=0.5 and equal evidence likelihood holds under two hypotheses, does the posterior change?", answer: "No. Equal likelihoods provide no preference, so posterior remains the prior." }, { level: "Intermediate", question: "Prior odds are 1:9 and likelihood ratio is 18. What are posterior odds?", answer: "18:9=2:1." }, { level: "Applied", question: "Why is calibration important when interpreting model outputs as Bayesian-like evidence?", answer: "If predicted probabilities do not match observed frequencies, updates based on them become systematically over- or under-confident." }],
      takeaways: ["Bayes reverses a conditional using the joint probability identity.", "Posterior combines prior and likelihood.", "Base rates can dominate seemingly accurate evidence.", "Normalization compares the evidence across all competing hypotheses."]
    },
    "law-of-large-numbers": {
      prerequisites: ["Expectation and variance.", "Independent repeated sampling.", "Sample means and limits."],
      notationGuide: [{ symbol: "X_bar_n", latex: "\\bar X_n", meaning: "Mean of the first n observations." }, { symbol: "mu", latex: "\\mu", meaning: "Population expectation E[X]." }, { symbol: "->P", latex: "\\xrightarrow{P}", meaning: "Convergence in probability." }, { symbol: "n", latex: "n", meaning: "Sample size." }],
      formulaLatex: ["\\bar X_n=\\frac1n\\sum_{i=1}^nX_i", "\\bar X_n\\to\\mathbb E[X]\\quad\\text{as }n\\to\\infty", "\\operatorname{Var}(\\bar X_n)=\\frac{\\sigma^2}{n}"],
      derivation: { title: "Why averaging stabilizes independent noise", steps: ["For independent samples, expectation of the mean remains mu by linearity.", "Variance of a sum is the sum of variances, giving n sigma^2.", "Dividing the sum by n divides variance by n^2.", "Thus Var(X_bar)=sigma^2/n, and concentration around mu improves as n grows."] },
      workedExamples: [{ title: "Repeated coin tosses", setup: "Let X_i indicate heads for a coin with p=0.6.", steps: ["Each E[X_i]=0.6.", "The sample mean is the observed head fraction.", "As tosses grow, large deviations become less common."], result: "The head fraction converges toward 0.6, though it still fluctuates at finite n." }, { title: "Average estimator variance", setup: "Measurements have variance 25 and are independent.", steps: ["For n=100, mean variance is 25/100.", "Take the square root for standard error.", "Compare with individual standard deviation 5."], result: "Mean standard error is 0.5, ten times smaller than an individual measurement's spread." }],
      exercises: [{ level: "Beginner", question: "If observation variance is 9, what is variance of the mean of 36 independent observations?", answer: "9/36=0.25." }, { level: "Intermediate", question: "Does the law say the next observation becomes less random as n grows?", answer: "No. It says the average stabilizes; individual observations keep the same distribution." }, { level: "Applied", question: "Why may correlated training examples weaken the usual averaging benefit?", answer: "Positive dependence prevents variance terms from canceling as 1/n; the effective sample size is smaller." }],
      takeaways: ["Sample averages converge to expectations under suitable conditions.", "The law is asymptotic, not a promise of monotonic improvement.", "Independent finite-variance averages have variance sigma^2/n.", "Dependence and heavy tails can alter convergence behavior."]
    },
    "central-limit-theorem": {
      prerequisites: ["Law of large numbers.", "Means, variances, and standardization.", "Gaussian distribution intuition."],
      notationGuide: [{ symbol: "Z_n", latex: "Z_n", meaning: "Standardized sample mean or sum." }, { symbol: "sqrt(n)", latex: "\\sqrt n", meaning: "Rate controlling standard-error shrinkage." }, { symbol: "N(0,1)", latex: "\\mathcal N(0,1)", meaning: "Standard Gaussian limit." }, { symbol: "approx", latex: "\\approx", meaning: "Finite-sample approximation, not exact equality." }],
      formulaLatex: ["Z_n=\\frac{\\bar X_n-\\mu}{\\sigma/\\sqrt n}", "\\bar X_n\\approx\\mathcal N\\left(\\mu,\\frac{\\sigma^2}{n}\\right)"],
      derivation: { title: "Standardize the sample mean", steps: ["The sample mean has expectation mu.", "For independent samples its standard deviation is sigma/sqrt(n).", "Subtract mu to center it and divide by this standard error to give unit scale.", "Under CLT conditions, the resulting distribution approaches N(0,1) as n grows."] },
      workedExamples: [{ title: "Approximate a sample mean", setup: "A population has mean 10 and standard deviation 4; average n=64 samples.", steps: ["Mean of X_bar is 10.", "Standard error is 4/8=0.5.", "Approximate X_bar by N(10,0.25)."], result: "About 95% of means lie roughly between 9 and 11 using the two-standard-error rule." }, { title: "Approximate a binomial", setup: "X counts 100 fair coin heads.", steps: ["Mean is np=50.", "Variance is np(1-p)=25.", "Standard deviation is 5."], result: "X is approximately Gaussian around 50 when a continuity correction is used for discrete probabilities." }],
      exercises: [{ level: "Beginner", question: "If sigma=12 and n=144, what is the standard error?", answer: "12/sqrt(144)=1." }, { level: "Intermediate", question: "How does CLT differ from LLN?", answer: "LLN states the mean converges to mu; CLT describes the scaled shape of its remaining fluctuations." }, { level: "Applied", question: "Why can CLT approximations be poor for highly skewed heavy-tailed data at moderate n?", answer: "Convergence can be slow, and infinite variance can invalidate the classical theorem entirely." }],
      takeaways: ["The CLT describes distributions of standardized sums and means.", "Standard error shrinks as 1/sqrt(n).", "The source distribution need not be Gaussian under common conditions.", "Finite-sample accuracy depends on skew, tails, dependence, and sample size."]
    },
    "markov-chains": {
      prerequisites: ["Conditional probability.", "Matrix multiplication.", "Discrete states and time steps."],
      notationGuide: [{ symbol: "S_t", latex: "S_t", meaning: "State at discrete time t." }, { symbol: "T_ij", latex: "T_{ij}", meaning: "One-step probability from state i to j." }, { symbol: "p_t", latex: "p_t", meaning: "Row vector of state probabilities at time t." }, { symbol: "pi", latex: "\\pi", meaning: "Stationary distribution." }],
      formulaLatex: ["T_{ij}=P(S_{t+1}=j\\mid S_t=i)", "p_{t+1}=p_tT", "\\pi=\\pi T"],
      derivation: { title: "Propagate a state distribution", steps: ["Condition on the current state i.", "Probability of next state j contributed by i is p_t(i)T_ij.", "Sum over every possible current state.", "This is exactly component j of matrix product p_t T."] },
      workedExamples: [{ title: "Two-state weather", setup: "States are sunny and rainy with T=[[0.8,0.2],[0.4,0.6]]; today is certainly sunny.", steps: ["Initial p0=(1,0).", "Multiply p0T.", "Read the resulting probabilities."], result: "Tomorrow is sunny with probability 0.8 and rainy with 0.2." }, { title: "Check stationarity", setup: "Try pi=(2/3,1/3) for the same chain.", steps: ["Multiply pi by T.", "Sunny mass becomes (2/3)0.8+(1/3)0.4=2/3.", "Rainy mass remains 1/3."], result: "pi is stationary because piT=pi." }],
      exercises: [{ level: "Beginner", question: "What must each row of a row-stochastic transition matrix sum to?", answer: "One." }, { level: "Intermediate", question: "If p0=(0,1), compute p1 for T=[[0.8,0.2],[0.4,0.6]].", answer: "(0.4,0.6)." }, { level: "Applied", question: "Why does the state definition matter for the Markov property?", answer: "A state must contain enough information that earlier history adds no predictive information about the next step." }],
      takeaways: ["A Markov chain predicts the next state from the current state.", "Transition matrices encode one-step conditional probabilities.", "Matrix powers describe multi-step movement.", "Stationarity and convergence require structural conditions such as recurrence and aperiodicity."]
    },
    "markov-processes": {
      prerequisites: ["Markov chains.", "Conditional distributions.", "Continuous time or continuous state spaces."],
      notationGuide: [{ symbol: "X_t", latex: "X_t", meaning: "Process state at time t." }, { symbol: "P_t", latex: "P_t", meaning: "Transition operator over duration t." }, { symbol: "history F_t", latex: "\\mathcal F_t", meaning: "Information observed through time t." }, { symbol: "generator L", latex: "\\mathcal L", meaning: "Infinitesimal operator for continuous-time evolution." }],
      formulaLatex: ["P(X_{t+s}\\in A\\mid\\mathcal F_t)=P(X_{t+s}\\in A\\mid X_t)", "P_{t+s}=P_tP_s"],
      derivation: { title: "Understand the semigroup property", steps: ["To move from time 0 to t+s, introduce the intermediate state at time t.", "Use the Markov property so the second segment depends only on that state.", "Integrate or sum over all intermediate states.", "The composition of transition operators is P_t P_s, so P_(t+s)=P_tP_s."] },
      workedExamples: [{ title: "Poisson counting process", setup: "N_t counts arrivals at rate lambda.", steps: ["Future arrivals after t depend on interval length, not earlier arrival times.", "Increment N_(t+s)-N_t is Poisson(lambda s).", "It is independent of past increments."], result: "The count process is Markov because current count plus future increments determines future count." }, { title: "State augmentation", setup: "Position alone in a moving system depends on previous velocity.", steps: ["Position is not sufficient to predict the next position.", "Add velocity to the state.", "Future evolution can then depend only on current position and velocity."], result: "An apparently non-Markov process can become Markov with a richer state." }],
      exercises: [{ level: "Beginner", question: "Does Markov mean future states are independent of the current state?", answer: "No. They may depend strongly on current state; they are conditionally independent of earlier history given it." }, { level: "Intermediate", question: "Why do continuous-time transition operators form a semigroup rather than always a group?", answer: "Backward evolution may not exist or be unique, so inverse operators are not guaranteed." }, { level: "Applied", question: "Why are diffusion-model forward processes designed to be Markov?", answer: "Each noising step then depends only on the current sample, making transitions and reverse-time learning tractable." }],
      takeaways: ["The Markov property is conditional memorylessness.", "State design determines whether the property holds.", "Transition operators compose across time intervals.", "Markov processes include discrete chains, continuous-time jumps, and diffusions."]
    },
    "monte-carlo-estimation": {
      prerequisites: ["Expectation and variance.", "Independent sampling.", "Law of large numbers and CLT."],
      notationGuide: [{ symbol: "mu", latex: "\\mu", meaning: "Target expectation E[f(X)]." }, { symbol: "mu_hat_N", latex: "\\hat\\mu_N", meaning: "Monte Carlo sample-average estimate." }, { symbol: "SE", latex: "\\operatorname{SE}", meaning: "Standard error of the estimator." }, { symbol: "N", latex: "N", meaning: "Number of simulated samples." }],
      formulaLatex: ["\\hat\\mu_N=\\frac1N\\sum_{i=1}^N f(X_i)", "\\mathbb E[\\hat\\mu_N]=\\mu", "\\operatorname{SE}(\\hat\\mu_N)\\approx\\frac{\\sigma_f}{\\sqrt N}"],
      derivation: { title: "Establish estimator mean and variance", steps: ["Take expectation of the sample average and use linearity.", "Every term has expectation mu, so the estimate is unbiased.", "For independent samples, add N copies of variance sigma_f^2 and divide by N^2.", "Variance is sigma_f^2/N, giving standard error sigma_f/sqrt(N)."] },
      workedExamples: [{ title: "Estimate pi", setup: "Sample points uniformly in the unit square and count those inside the quarter circle.", steps: ["Indicator I=1 when x^2+y^2<=1.", "Its expectation equals quarter-circle area pi/4.", "Average indicators and multiply by 4."], result: "4 times the hit fraction estimates pi." }, { title: "Estimate model risk", setup: "Draw 1,000 scenarios and compute loss in each.", steps: ["Average the losses for estimated expected risk.", "Compute sample standard deviation s.", "Estimate standard error as s/sqrt(1000)."], result: "The estimate includes both a point value and simulation uncertainty." }],
      exercises: [{ level: "Beginner", question: "If estimator standard error is 0.2 at N=100, what is it near N=400?", answer: "About 0.1, because quadrupling samples halves standard error." }, { level: "Intermediate", question: "Why does ten times smaller Monte Carlo error require about 100 times more samples?", answer: "Error scales as 1/sqrt(N)." }, { level: "Applied", question: "What can reduce variance without simply increasing N?", answer: "Control variates, antithetic samples, stratification, quasi-Monte Carlo, or a better proposal distribution." }],
      takeaways: ["Monte Carlo converts expectations into sample averages.", "Its basic convergence rate is dimension-insensitive but slow at 1/sqrt(N).", "Standard error quantifies simulation uncertainty.", "Variance reduction can be more valuable than raw sample growth."]
    },
    "importance-sampling": {
      prerequisites: ["Monte Carlo estimation.", "Probability densities and support.", "Expectation under different distributions."],
      notationGuide: [{ symbol: "p(x)", latex: "p(x)", meaning: "Target distribution." }, { symbol: "q(x)", latex: "q(x)", meaning: "Proposal used for sampling." }, { symbol: "w(x)", latex: "w(x)=p(x)/q(x)", meaning: "Importance weight correcting the proposal." }, { symbol: "ESS", latex: "\\operatorname{ESS}", meaning: "Effective sample size after unequal weighting." }],
      formulaLatex: ["\\mathbb E_p[f(X)]=\\mathbb E_q\\left[f(X)\\frac{p(X)}{q(X)}\\right]", "\\hat\\mu=\\frac1N\\sum_i w_i f(X_i)", "\\hat\\mu_{SN}=\\frac{\\sum_iw_if_i}{\\sum_iw_i}"],
      derivation: { title: "Change the sampling distribution", steps: ["Write target expectation as integral f(x)p(x)dx.", "Multiply and divide the integrand by q(x), where q is positive wherever needed.", "Regroup as integral [f(x)p(x)/q(x)]q(x)dx.", "Recognize an expectation under q with weight p/q."] },
      workedExamples: [{ title: "Estimate a rare tail", setup: "Target p rarely produces large X, but f focuses on X>10.", steps: ["Choose q that samples the tail more often.", "Weight each sample by p(x)/q(x).", "Average weighted indicators."], result: "More samples inform the rare event while weights preserve the target expectation." }, { title: "Diagnose weight collapse", setup: "One normalized weight is 0.95 and all others share 0.05.", steps: ["Most samples contribute almost nothing.", "The estimate depends on one draw.", "Effective sample size is near one."], result: "The proposal poorly overlaps the important target region, producing high variance." }],
      exercises: [{ level: "Beginner", question: "What weight is used when q=p?", answer: "One for every sample, reducing to ordinary Monte Carlo." }, { level: "Intermediate", question: "Why must q(x)>0 wherever p(x)f(x) is nonzero?", answer: "Otherwise important target regions can never be sampled and p/q is undefined, causing bias or failure." }, { level: "Applied", question: "What makes a good proposal?", answer: "It covers all relevant target support and places extra mass where |f(x)|p(x) contributes most, without creating extreme weights." }],
      takeaways: ["Importance sampling changes where samples come from and corrects with density ratios.", "Support coverage is mandatory.", "Weight variance determines estimator quality.", "Self-normalization handles unknown constants but introduces finite-sample bias."]
    },
    "rejection-sampling": {
      prerequisites: ["Probability densities.", "Uniform random sampling.", "Proposal distributions and unnormalized targets."],
      notationGuide: [{ symbol: "p_tilde(x)", latex: "\\tilde p(x)", meaning: "Possibly unnormalized target density." }, { symbol: "q(x)", latex: "q(x)", meaning: "Easy proposal density." }, { symbol: "M", latex: "M", meaning: "Envelope constant with p_tilde<=Mq." }, { symbol: "u", latex: "u\\sim\\operatorname{Uniform}(0,1)", meaning: "Random acceptance threshold." }],
      formulaLatex: ["\\tilde p(x)\\leq Mq(x)", "u\\leq\\frac{\\tilde p(x)}{Mq(x)}", "\\operatorname{acceptance\\ rate}\\approx\\frac ZM"],
      derivation: { title: "Show accepted samples follow the target", steps: ["Sample x from q and u uniformly.", "Acceptance probability at x is p_tilde(x)/(Mq(x)).", "Joint chance of proposing and accepting x is q(x)*p_tilde(x)/(Mq(x))=p_tilde(x)/M.", "Conditioning on acceptance normalizes this expression, leaving target density p(x)."] },
      workedExamples: [{ title: "Uniform envelope", setup: "Target p_tilde(x)=2x on [0,1], proposal q(x)=1, and M=2.", steps: ["Envelope condition 2x<=2 holds.", "Accept with probability x.", "Large x values are retained more often."], result: "Accepted samples have density 2x." }, { title: "Poor envelope", setup: "Suppose Z=1 and M=100.", steps: ["Average acceptance is about 1/100.", "Roughly 99 proposals are rejected per accepted draw.", "Sampling cost becomes high."], result: "A proposal closer to the target could drastically improve efficiency." }],
      exercises: [{ level: "Beginner", question: "Why can acceptance probability never exceed one?", answer: "The envelope condition ensures p_tilde(x)/(Mq(x))<=1." }, { level: "Intermediate", question: "If average acceptance is 0.25, how many proposals are expected per accepted sample?", answer: "About four." }, { level: "Applied", question: "Why does rejection sampling struggle in high dimensions?", answer: "A simple proposal envelope often wastes most volume, making M huge and acceptance exponentially small." }],
      takeaways: ["Rejection sampling produces exact independent target samples under a valid envelope.", "The target normalization constant is not needed.", "Proposal support and envelope validity are essential.", "Efficiency depends on how tightly Mq covers the target."]
    },
    "bernoulli": {
      prerequisites: ["Binary events and probability.", "Expectation and variance.", "Indicator variables."],
      notationGuide: [{ symbol: "X~Bern(p)", latex: "X\\sim\\operatorname{Bernoulli}(p)", meaning: "Binary random variable with success probability p." }, { symbol: "p", latex: "p\\in[0,1]", meaning: "Probability that X=1." }, { symbol: "1-p", latex: "1-p", meaning: "Probability that X=0." }],
      formulaLatex: ["P(X=x)=p^x(1-p)^{1-x},\\quad x\\in\\{0,1\\}", "\\mathbb E[X]=p", "\\operatorname{Var}(X)=p(1-p)"],
      derivation: { title: "Derive Bernoulli mean and variance", steps: ["Expectation is 0*(1-p)+1*p=p.", "Because X is zero or one, X^2=X.", "Use Var(X)=E[X^2]-E[X]^2.", "Substitute p-p^2=p(1-p)."] },
      workedExamples: [{ title: "Classifier correctness", setup: "Let X=1 when a prediction is correct with probability 0.8.", steps: ["P(X=1)=0.8.", "Expected correctness indicator is 0.8.", "Variance is 0.8*0.2."], result: "Mean accuracy is 0.8 and indicator variance is 0.16." }, { title: "Maximum uncertainty", setup: "Compare p=0.5 with p=0.99.", steps: ["Variance at 0.5 is 0.25.", "Variance at 0.99 is 0.0099.", "Balanced outcomes are harder to predict."], result: "Bernoulli variance is largest at p=0.5." }],
      exercises: [{ level: "Beginner", question: "For p=0.3, find P(X=0).", answer: "0.7." }, { level: "Intermediate", question: "At what p is Bernoulli variance maximal?", answer: "p=0.5." }, { level: "Applied", question: "Why is binary cross-entropy a natural Bernoulli negative log-likelihood?", answer: "The Bernoulli PMF gives log likelihood y log p+(1-y)log(1-p); negating it yields binary cross-entropy." }],
      takeaways: ["Bernoulli models one binary trial.", "Its parameter is both success probability and mean.", "Variance is largest for uncertain balanced outcomes.", "Counts of repeated independent Bernoulli trials lead to the binomial distribution."]
    },
    "binomial": {
      prerequisites: ["Bernoulli trials.", "Combinations.", "Independence and sums."],
      notationGuide: [{ symbol: "X~Bin(n,p)", latex: "X\\sim\\operatorname{Binomial}(n,p)", meaning: "Count of successes in n independent equal-probability trials." }, { symbol: "n choose k", latex: "\\binom nk", meaning: "Ways to place k successes among n trials." }, { symbol: "k", latex: "k\\in\\{0,\\ldots,n\\}", meaning: "Observed success count." }],
      formulaLatex: ["P(X=k)=\\binom nkp^k(1-p)^{n-k}", "\\mathbb E[X]=np", "\\operatorname{Var}(X)=np(1-p)"],
      derivation: { title: "Construct the binomial PMF", steps: ["Any particular sequence with k successes has probability p^k(1-p)^(n-k).", "There are n choose k positions for those successes.", "These sequences are mutually exclusive.", "Multiply sequence probability by the number of sequences."] },
      workedExamples: [{ title: "Exactly two successes", setup: "Run n=5 independent trials with p=0.4.", steps: ["Choose success positions in C(5,2)=10 ways.", "Each pattern has probability 0.4^2*0.6^3.", "Multiply."], result: "P(X=2)=10*0.16*0.216=0.3456." }, { title: "Mean and spread", setup: "For n=100 and p=0.1.", steps: ["Mean is np=10.", "Variance is 100*0.1*0.9=9.", "Standard deviation is 3."], result: "Counts typically fluctuate by a few around 10." }],
      exercises: [{ level: "Beginner", question: "Find E[X] for Binomial(20,0.25).", answer: "5." }, { level: "Intermediate", question: "Find P(X=0) for n=4, p=0.2.", answer: "0.8^4=0.4096." }, { level: "Applied", question: "When is a binomial model inappropriate for click counts?", answer: "When trial probabilities differ, outcomes are dependent, or the number of opportunities is not fixed." }],
      takeaways: ["Binomial counts successes across fixed independent Bernoulli trials.", "The combination factor counts success arrangements.", "Mean and variance scale with n.", "Check fixed n, common p, binary outcomes, and independence before using it."]
    },
    "categorical": {
      prerequisites: ["Discrete PMFs.", "Probability vectors.", "One-hot encoding."],
      notationGuide: [{ symbol: "X~Cat(pi)", latex: "X\\sim\\operatorname{Categorical}(\\pi)", meaning: "One draw among K categories." }, { symbol: "pi_k", latex: "\\pi_k", meaning: "Probability of category k." }, { symbol: "y", latex: "y\\in\\{0,1\\}^K", meaning: "One-hot encoded outcome." }, { symbol: "sum pi_k=1", latex: "\\sum_k\\pi_k=1", meaning: "Probability vector normalization." }],
      formulaLatex: ["P(X=k)=\\pi_k", "P(y)=\\prod_k\\pi_k^{y_k}", "\\mathbb E[\\mathbf1\\{X=k\\}]=\\pi_k"],
      derivation: { title: "Write one-hot likelihood", steps: ["Represent chosen category c with y_c=1 and all other y_k=0.", "Raise each pi_k to y_k.", "Terms with exponent zero become one.", "Only pi_c remains, so the product equals the chosen category probability."] },
      workedExamples: [{ title: "Sample three classes", setup: "Let pi=(0.2,0.5,0.3).", steps: ["Class 1 has probability 0.2.", "Class 2 has largest probability 0.5.", "Probabilities sum to one."], result: "A draw returns one class; the most likely is class 2 but is not guaranteed." }, { title: "Compute log loss", setup: "True class is 3 and model pi=(0.1,0.6,0.3).", steps: ["One-hot likelihood selects pi_3=0.3.", "Take negative natural log.", "-log(0.3) is about 1.204."], result: "Categorical negative log-likelihood equals multiclass cross-entropy." }],
      exercises: [{ level: "Beginner", question: "Is (0.2,0.2,0.5) a valid categorical parameter?", answer: "No. It sums to 0.9, not one." }, { level: "Intermediate", question: "For true one-hot y=(0,1,0), what likelihood does the product formula return?", answer: "pi_2." }, { level: "Applied", question: "Why does softmax suit categorical output?", answer: "It converts arbitrary logits into positive probabilities summing to one." }],
      takeaways: ["Categorical models one choice among K classes.", "Its parameter lies on the probability simplex.", "One-hot notation makes likelihood compact.", "Repeated category counts follow a multinomial distribution."]
    },
    "multinomial": {
      prerequisites: ["Categorical distribution.", "Factorials and combinations.", "Count vectors."],
      notationGuide: [{ symbol: "X~Mult(n,pi)", latex: "X\\sim\\operatorname{Multinomial}(n,\\pi)", meaning: "Category counts from n independent categorical trials." }, { symbol: "x_k", latex: "x_k", meaning: "Count assigned to category k." }, { symbol: "sum x_k=n", latex: "\\sum_kx_k=n", meaning: "Counts exhaust all trials." }, { symbol: "alpha?", latex: "\\pi", meaning: "Shared category probability vector." }],
      formulaLatex: ["P(X=x)=\\frac{n!}{\\prod_kx_k!}\\prod_k\\pi_k^{x_k}", "\\mathbb E[X_k]=n\\pi_k", "\\operatorname{Var}(X_k)=n\\pi_k(1-\\pi_k)"],
      derivation: { title: "Count category sequences", steps: ["Any sequence with counts x_k has probability product_k pi_k^x_k.", "There are n! total orderings of trial positions.", "Permuting positions within the same category does not create a new sequence, so divide by product x_k!.", "Multiply sequence count by probability per sequence."] },
      workedExamples: [{ title: "Three-way counts", setup: "For n=4, pi=(0.5,0.3,0.2), find probability of counts (2,1,1).", steps: ["Coefficient is 4!/(2!1!1!)=12.", "Probability factor is 0.5^2*0.3*0.2.", "Multiply."], result: "Probability is 0.18." }, { title: "Negative count covariance", setup: "One extra count in category i leaves one fewer trial for others.", steps: ["Total count is fixed at n.", "Categories compete for the same trials.", "For i!=j, covariance is -n pi_i pi_j."], result: "Multinomial category counts are negatively correlated." }],
      exercises: [{ level: "Beginner", question: "What is E[X_2] when n=50 and pi_2=0.3?", answer: "15." }, { level: "Intermediate", question: "How many sequences have counts (2,2,1)?", answer: "5!/(2!2!1!)=30." }, { level: "Applied", question: "Why might text word counts be overdispersed relative to a multinomial model?", answer: "Topics and context create dependence and varying probabilities across documents, violating identical independent trials." }],
      takeaways: ["Multinomial generalizes binomial counts to K categories.", "Counts sum to fixed n and therefore interact.", "The coefficient counts category orderings.", "Its assumptions include independent trials with one shared probability vector."]
    },
    "uniform": {
      prerequisites: ["Continuous densities and intervals.", "Integration.", "Expectation and variance."],
      notationGuide: [{ symbol: "X~U(a,b)", latex: "X\\sim\\operatorname{Uniform}(a,b)", meaning: "Constant density between a and b." }, { symbol: "a,b", latex: "a<b", meaning: "Lower and upper support bounds." }, { symbol: "1/(b-a)", latex: "1/(b-a)", meaning: "Density height needed for total area one." }],
      formulaLatex: ["p(x)=\\frac1{b-a},\\quad a\\leq x\\leq b", "\\mathbb E[X]=\\frac{a+b}{2}", "\\operatorname{Var}(X)=\\frac{(b-a)^2}{12}"],
      derivation: { title: "Normalize a constant density", steps: ["Assume density is constant c on [a,b].", "Total area is c(b-a).", "Set this area equal to one.", "Solve c=1/(b-a)."] },
      workedExamples: [{ title: "Interval probability", setup: "Let X~Uniform(0,10).", steps: ["Density is 0.1.", "Interval [2,5] has length 3.", "Multiply length by density."], result: "P(2<=X<=5)=0.3." }, { title: "Sample by scaling", setup: "Let U~Uniform(0,1) and X=a+(b-a)U.", steps: ["U=0 maps to a.", "U=1 maps to b.", "Linear scaling preserves equal probability per equal-length interval."], result: "X~Uniform(a,b)." }],
      exercises: [{ level: "Beginner", question: "Find mean of Uniform(2,8).", answer: "5." }, { level: "Intermediate", question: "Find variance of Uniform(-1,1).", answer: "(2)^2/12=1/3." }, { level: "Applied", question: "Why is a uniform prior not automatically non-informative after reparameterization?", answer: "A nonlinear change of variables transforms density with a Jacobian, so uniformity depends on the chosen coordinate." }],
      takeaways: ["Uniform density is constant over bounded support.", "Probability is proportional to interval length.", "The mean is the midpoint.", "Uniformity expresses equal density in a chosen parameterization, not universal ignorance."]
    },
    "gaussian": {
      prerequisites: ["Continuous densities.", "Mean, variance, and standardization.", "Exponential functions."],
      notationGuide: [{ symbol: "X~N(mu,sigma^2)", latex: "X\\sim\\mathcal N(\\mu,\\sigma^2)", meaning: "Gaussian with mean mu and variance sigma squared." }, { symbol: "sigma", latex: "\\sigma>0", meaning: "Standard deviation controlling spread." }, { symbol: "Z", latex: "Z", meaning: "Standardized Gaussian variable." }, { symbol: "phi", latex: "\\phi", meaning: "Standard normal density." }],
      formulaLatex: ["p(x)=\\frac1{\\sigma\\sqrt{2\\pi}}\\exp\\left[-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right]", "\\mathbb E[X]=\\mu", "\\operatorname{Var}(X)=\\sigma^2", "Z=\\frac{X-\\mu}{\\sigma}"],
      derivation: { title: "Standardize a Gaussian", steps: ["Subtract mu to center the variable at zero.", "Divide by sigma to express displacement in standard-deviation units.", "A linear transformation of a Gaussian remains Gaussian.", "The resulting mean is zero and variance is one, so Z~N(0,1)."] },
      workedExamples: [{ title: "Compute a z-score", setup: "X has mean 70 and standard deviation 10; observe x=85.", steps: ["Subtract the mean: 15.", "Divide by 10.", "Interpret in standard units."], result: "z=1.5, so the value is 1.5 standard deviations above the mean." }, { title: "Add independent Gaussians", setup: "X~N(2,4) and Y~N(3,9) independently.", steps: ["Means add to 5.", "Independent variances add to 13.", "The sum remains Gaussian."], result: "X+Y~N(5,13)." }],
      exercises: [{ level: "Beginner", question: "Standardize x=12 for mu=10, sigma=2.", answer: "z=1." }, { level: "Intermediate", question: "What distribution has 2X+1 if X~N(3,4)?", answer: "N(7,16)." }, { level: "Applied", question: "Why can Gaussian likelihood be sensitive to outliers?", answer: "Its negative log likelihood penalizes squared residuals, so large deviations receive rapidly growing influence." }],
      takeaways: ["Gaussian shape is determined by location and scale.", "Standardization maps every univariate Gaussian to N(0,1).", "Independent Gaussian sums remain Gaussian.", "The model is convenient but can underestimate skew and heavy tails."]
    },
    "multivariate-gaussian": {
      prerequisites: ["Univariate Gaussian distribution.", "Vectors, covariance matrices, and PSD matrices.", "Quadratic forms and determinants."],
      notationGuide: [{ symbol: "X~N(mu,Sigma)", latex: "X\\sim\\mathcal N(\\mu,\\Sigma)", meaning: "Gaussian random vector." }, { symbol: "mu", latex: "\\mu\\in\\mathbb R^d", meaning: "Mean vector." }, { symbol: "Sigma", latex: "\\Sigma\\succeq0", meaning: "Covariance matrix." }, { symbol: "Mahalanobis", latex: "(x-\\mu)^\\top\\Sigma^{-1}(x-\\mu)", meaning: "Squared covariance-aware distance." }],
      formulaLatex: ["p(x)\\propto\\exp\\left[-\\tfrac12(x-\\mu)^\\top\\Sigma^{-1}(x-\\mu)\\right]", "\\mathbb E[X]=\\mu", "\\operatorname{Cov}(X)=\\Sigma"],
      derivation: { title: "Generate a correlated Gaussian", steps: ["Sample z~N(0,I) with independent standard coordinates.", "Choose L such that LL^T=Sigma, for example a Cholesky factor.", "Transform x=mu+Lz.", "Then E[x]=mu and Cov(x)=LIL^T=Sigma."] },
      workedExamples: [{ title: "Read covariance geometry", setup: "Sigma has eigenvalues 9 and 1 with orthonormal eigenvectors.", steps: ["Standard deviations along eigenvectors are 3 and 1.", "Equal-density contours are ellipses.", "The long axis follows the eigenvector for eigenvalue 9."], result: "Covariance eigenvectors set orientation and eigenvalues set squared axis scales." }, { title: "Independent coordinates", setup: "Sigma is diagonal.", steps: ["Off-diagonal covariances are zero.", "For a multivariate Gaussian, zero covariance implies independence.", "The joint density factors across coordinates."], result: "Diagonal covariance gives independent Gaussian components." }],
      exercises: [{ level: "Beginner", question: "What shape is Sigma for a 5-dimensional Gaussian?", answer: "5 x 5." }, { level: "Intermediate", question: "If X~N(mu,Sigma), what are mean and covariance of AX+b?", answer: "Mean A mu+b and covariance A Sigma A^T." }, { level: "Applied", question: "Why can full covariance be impractical in high dimensions?", answer: "It needs O(d^2) storage and stable estimation/inversion, motivating diagonal, low-rank, or structured forms." }],
      takeaways: ["The multivariate Gaussian combines a mean vector and PSD covariance.", "Covariance defines ellipsoidal geometry.", "Linear transformations preserve Gaussianity.", "Zero covariance implies independence specifically for jointly Gaussian variables."]
    },
    "poisson": {
      prerequisites: ["Discrete count variables.", "Factorials and exponentials.", "Rates over intervals."],
      notationGuide: [{ symbol: "X~Pois(lambda)", latex: "X\\sim\\operatorname{Poisson}(\\lambda)", meaning: "Count with expected rate lambda over the chosen exposure." }, { symbol: "lambda", latex: "\\lambda>0", meaning: "Mean count and variance." }, { symbol: "k!", latex: "k!", meaning: "Factorial count normalization." }],
      formulaLatex: ["P(X=k)=e^{-\\lambda}\\frac{\\lambda^k}{k!}", "\\mathbb E[X]=\\lambda", "\\operatorname{Var}(X)=\\lambda"],
      derivation: { title: "Obtain Poisson as a rare-event limit", steps: ["Start with Binomial(n,p) while holding np=lambda.", "Set p=lambda/n and let n grow.", "The combination and powers approach lambda^k/k! and e^-lambda.", "The limiting PMF is e^-lambda lambda^k/k!."] },
      workedExamples: [{ title: "No arrivals", setup: "Calls arrive with mean lambda=3 per minute.", steps: ["Set k=0 in the PMF.", "lambda^0/0!=1.", "Probability is e^-3."], result: "P(no calls) is about 0.0498." }, { title: "Combine independent counts", setup: "X~Pois(2) and Y~Pois(5) independently.", steps: ["Poisson rates add for independent counts.", "Combined expected count is 7.", "Variance also becomes 7."], result: "X+Y~Pois(7)." }],
      exercises: [{ level: "Beginner", question: "For lambda=4, what are mean and variance?", answer: "Both are 4." }, { level: "Intermediate", question: "Find P(X=1) for lambda=2.", answer: "2e^-2, about 0.2707." }, { level: "Applied", question: "What signals that a basic Poisson model may be inadequate?", answer: "Observed variance far above the mean, clustering, changing rates, or dependent arrivals indicate overdispersion or nonstationarity." }],
      takeaways: ["Poisson models counts over fixed exposure.", "Its parameter is both mean and variance.", "Independent Poisson counts add by adding rates.", "Constant-rate independent-event assumptions should be checked."]
    },
    "exponential": {
      prerequisites: ["Continuous densities.", "Poisson processes.", "Survival probabilities."],
      notationGuide: [{ symbol: "X~Exp(lambda)", latex: "X\\sim\\operatorname{Exponential}(\\lambda)", meaning: "Waiting time with rate lambda." }, { symbol: "lambda", latex: "\\lambda>0", meaning: "Event rate per unit time." }, { symbol: "S(t)", latex: "S(t)=P(X>t)", meaning: "Survival probability beyond time t." }, { symbol: "hazard", latex: "h(t)", meaning: "Instantaneous event rate given survival." }],
      formulaLatex: ["p(x)=\\lambda e^{-\\lambda x},\\quad x\\geq0", "\\mathbb E[X]=\\frac1\\lambda", "\\operatorname{Var}(X)=\\frac1{\\lambda^2}"],
      derivation: { title: "Derive waiting time from a Poisson process", steps: ["No event by time t means the Poisson count N_t equals zero.", "For mean lambda t, P(N_t=0)=e^(-lambda t).", "Thus survival S(t)=P(X>t)=e^(-lambda t).", "Differentiate 1-S(t) to obtain density lambda e^(-lambda t)."] },
      workedExamples: [{ title: "Wait beyond a threshold", setup: "Mean arrival rate is lambda=0.5 per minute.", steps: ["Survival beyond 4 minutes is e^(-0.5*4).", "Compute e^-2.", "Mean wait is 1/0.5."], result: "P(X>4) about 0.1353 and mean wait is 2 minutes." }, { title: "Memorylessness", setup: "Given no event in first 3 minutes, ask probability of waiting 2 more.", steps: ["Use P(X>5|X>3).", "Exponential survival ratio is e^-5lambda/e^-3lambda.", "Simplify to e^-2lambda."], result: "The additional wait distribution is unchanged by elapsed time." }],
      exercises: [{ level: "Beginner", question: "For lambda=4 per hour, what is mean wait?", answer: "1/4 hour, or 15 minutes." }, { level: "Intermediate", question: "Find P(X<=t) for an exponential variable.", answer: "1-e^(-lambda t) for t>=0." }, { level: "Applied", question: "Why may exponential be poor for human lifetimes?", answer: "Its constant hazard assumes age does not affect instantaneous risk, which is unrealistic." }],
      takeaways: ["Exponential models positive waiting times under a constant event rate.", "It is the continuous waiting-time partner of the Poisson count model.", "Mean is inverse rate.", "It is memoryless, an unusually strong assumption."]
    },
    "beta": {
      prerequisites: ["Continuous distributions on [0,1].", "Bayesian updating.", "Bernoulli and binomial likelihoods."],
      notationGuide: [{ symbol: "P~Beta(alpha,beta)", latex: "P\\sim\\operatorname{Beta}(\\alpha,\\beta)", meaning: "Random probability P between zero and one." }, { symbol: "alpha", latex: "\\alpha>0", meaning: "First shape parameter, often prior success mass." }, { symbol: "beta", latex: "\\beta>0", meaning: "Second shape parameter, often prior failure mass." }, { symbol: "B(alpha,beta)", latex: "B(\\alpha,\\beta)", meaning: "Beta-function normalizer." }],
      formulaLatex: ["\\mathbb E[P]=\\frac\\alpha{\\alpha+\\beta}", "\\alpha'=\\alpha+s,\\qquad\\beta'=\\beta+f", "\\operatorname{Var}(P)=\\frac{\\alpha\\beta}{(\\alpha+\\beta)^2(\\alpha+\\beta+1)}"],
      derivation: { title: "Update a beta prior with Bernoulli data", steps: ["Beta prior kernel is p^(alpha-1)(1-p)^(beta-1).", "Bernoulli data with s successes and f failures contributes p^s(1-p)^f.", "Multiply prior and likelihood by adding exponents.", "Recognize Beta(alpha+s,beta+f) as the posterior."] },
      workedExamples: [{ title: "Update conversion probability", setup: "Start Beta(2,2), then observe 8 successes and 2 failures.", steps: ["Add successes to alpha: 10.", "Add failures to beta: 4.", "Posterior mean is 10/14."], result: "Posterior is Beta(10,4) with mean about 0.714." }, { title: "Interpret concentration", setup: "Compare Beta(2,2) and Beta(20,20).", steps: ["Both means are 0.5.", "Second has much larger alpha+beta.", "Its variance is much smaller."], result: "Concentration controls confidence separately from the mean." }],
      exercises: [{ level: "Beginner", question: "Find mean of Beta(3,1).", answer: "3/4." }, { level: "Intermediate", question: "Update Beta(1,1) with 4 successes and 6 failures.", answer: "Beta(5,7)." }, { level: "Applied", question: "Why is beta useful for calibration uncertainty?", answer: "It represents uncertainty over an unknown binary probability and updates analytically with observed counts." }],
      takeaways: ["Beta is a flexible distribution over probabilities.", "Alpha and beta control mean and concentration.", "It is conjugate to Bernoulli/binomial likelihoods.", "Parameters are pseudo-count-like but their interpretation depends on modelling choices."]
    },
    "gamma": {
      prerequisites: ["Positive continuous variables.", "Exponential distribution.", "Bayesian rate parameters."],
      notationGuide: [{ symbol: "X~Gamma(alpha,beta)", latex: "X\\sim\\operatorname{Gamma}(\\alpha,\\beta)", meaning: "Gamma variable using shape alpha and rate beta here." }, { symbol: "alpha", latex: "\\alpha>0", meaning: "Shape parameter." }, { symbol: "beta", latex: "\\beta>0", meaning: "Rate parameter in this convention." }, { symbol: "theta", latex: "\\theta=1/\\beta", meaning: "Scale under the alternative parameterization." }],
      formulaLatex: ["\\mathbb E[X]=\\frac\\alpha\\beta", "\\operatorname{Var}(X)=\\frac\\alpha{\\beta^2}", "\\mathbb E[X]=\\alpha\\theta"],
      derivation: { title: "Connect gamma waiting times to exponential arrivals", steps: ["An exponential variable is time to one Poisson-process event.", "Sum alpha independent exponential waits when alpha is a positive integer.", "The sum is time to the alpha-th event.", "That waiting time has Gamma(shape alpha, rate beta) distribution."] },
      workedExamples: [{ title: "Compute moments", setup: "Let X~Gamma(shape 3, rate 2).", steps: ["Mean is 3/2.", "Variance is 3/2^2.", "Standard deviation is sqrt(0.75)."], result: "Mean=1.5 and variance=0.75." }, { title: "Avoid convention errors", setup: "A library reports Gamma(shape 3, scale 2).", steps: ["Scale theta=2 corresponds to rate beta=1/2.", "Mean under scale convention is alpha theta.", "Compute 3*2."], result: "Mean is 6, not 1.5; parameterization must be checked." }],
      exercises: [{ level: "Beginner", question: "For shape 4 and rate 2, find mean.", answer: "2." }, { level: "Intermediate", question: "What gamma distribution equals an exponential with rate lambda?", answer: "Gamma(shape 1, rate lambda)." }, { level: "Applied", question: "Why is gamma often used as a prior for Poisson rate?", answer: "It has positive support and is conjugate, producing another gamma posterior after count data." }],
      takeaways: ["Gamma models positive skewed quantities and waiting times.", "Shape and rate/scale determine its form.", "Rate and scale conventions are reciprocals and must not be mixed.", "Gamma is conjugate for several positive rate models."]
    },
    "dirichlet": {
      prerequisites: ["Categorical and multinomial distributions.", "Probability simplex.", "Beta distribution and Bayesian updating."],
      notationGuide: [{ symbol: "pi~Dir(alpha)", latex: "\\pi\\sim\\operatorname{Dirichlet}(\\alpha)", meaning: "Random categorical probability vector." }, { symbol: "alpha_k", latex: "\\alpha_k>0", meaning: "Concentration for category k." }, { symbol: "alpha_0", latex: "\\alpha_0=\\sum_k\\alpha_k", meaning: "Total concentration." }, { symbol: "simplex", latex: "\\sum_k\\pi_k=1", meaning: "Nonnegative category probabilities summing to one." }],
      formulaLatex: ["\\mathbb E[\\pi_k]=\\frac{\\alpha_k}{\\alpha_0}", "\\alpha_k'=\\alpha_k+n_k", "\\sum_k\\pi_k=1"],
      derivation: { title: "Update a Dirichlet prior", steps: ["Dirichlet prior kernel is product_k pi_k^(alpha_k-1).", "Multinomial counts contribute product_k pi_k^n_k.", "Multiply terms by adding exponents category by category.", "Posterior is Dirichlet(alpha_1+n_1,...,alpha_K+n_K)."] },
      workedExamples: [{ title: "Update class probabilities", setup: "Start Dirichlet(1,1,1) and observe counts (4,2,1).", steps: ["Add each count to its alpha.", "Posterior parameters become (5,3,2).", "Total concentration is 10."], result: "Posterior mean probabilities are (0.5,0.3,0.2)." }, { title: "Concentration effect", setup: "Compare Dirichlet(1,1,1) with Dirichlet(100,100,100).", steps: ["Both means are uniform.", "The first spreads broadly over the simplex.", "The second concentrates near (1/3,1/3,1/3)."], result: "Total concentration controls certainty while proportions control the mean." }],
      exercises: [{ level: "Beginner", question: "Find mean of component 2 for Dirichlet(2,3,5).", answer: "3/10." }, { level: "Intermediate", question: "Update Dirichlet(1,2) after counts (3,4).", answer: "Dirichlet(4,6)." }, { level: "Applied", question: "How can a symmetric alpha below one affect samples?", answer: "It favors sparse probability vectors near simplex corners, with a few categories dominating." }],
      takeaways: ["Dirichlet generalizes beta to K-category probability vectors.", "Parameter proportions determine the mean.", "Total concentration determines how tightly samples cluster.", "It is conjugate to categorical and multinomial likelihoods."]
    },
    "student-s-t": {
      prerequisites: ["Gaussian distribution.", "Sample means and variance estimation.", "Degrees of freedom."],
      notationGuide: [{ symbol: "T~t_nu", latex: "T\\sim t_\\nu", meaning: "Student t variable with nu degrees of freedom." }, { symbol: "nu", latex: "\\nu", meaning: "Degrees of freedom controlling tail weight." }, { symbol: "s", latex: "s", meaning: "Estimated sample standard deviation." }, { symbol: "t statistic", latex: "(\\bar X-\\mu)/(s/\\sqrt n)", meaning: "Standardized mean with estimated scale." }],
      formulaLatex: ["p(x)\\propto\\left(1+\\frac{x^2}{\\nu}\\right)^{-(\\nu+1)/2}", "\\mathbb E[X]=0\\quad(\\nu>1)", "\\operatorname{Var}(X)=\\frac\\nu{\\nu-2}\\quad(\\nu>2)"],
      derivation: { title: "Why estimating variance creates heavier tails", steps: ["A standardized Gaussian mean would divide by known sigma/sqrt(n).", "In practice replace sigma with random sample standard deviation s.", "Occasionally s underestimates true scale, producing unusually large standardized values.", "This extra denominator uncertainty yields a t distribution with heavier tails."] },
      workedExamples: [{ title: "Small-sample interval", setup: "Estimate a mean from n=10 roughly Gaussian observations with unknown variance.", steps: ["Degrees of freedom are 9.", "Use t_9 critical value rather than Gaussian z.", "The t critical value is larger."], result: "The interval is wider to reflect uncertainty in estimated variance." }, { title: "Robust likelihood", setup: "Compare Gaussian and t likelihood for one large residual.", steps: ["Gaussian log penalty grows quadratically.", "t density decays polynomially.", "The outlier receives less extreme penalty under t."], result: "A t likelihood can make regression more robust to occasional large errors." }],
      exercises: [{ level: "Beginner", question: "What happens to t_nu as nu grows very large?", answer: "It approaches the standard Gaussian." }, { level: "Intermediate", question: "Does t_2 have finite variance?", answer: "No. Variance exists only for nu>2." }, { level: "Applied", question: "Why should heavy tails not be treated as permission to ignore data errors?", answer: "A robust model limits influence but cannot distinguish valid extremes from corrupt measurements without additional checks." }],
      takeaways: ["Student t resembles a Gaussian with heavier tails.", "Degrees of freedom control tail thickness.", "It naturally arises when standard deviation is estimated.", "Low degrees of freedom can provide robust error models."]
    },
    "log-normal": {
      prerequisites: ["Gaussian distribution.", "Logarithms and exponentials.", "Products of positive quantities."],
      notationGuide: [{ symbol: "X~LogNormal(mu,sigma^2)", latex: "X\\sim\\operatorname{LogNormal}(\\mu,\\sigma^2)", meaning: "log X is Gaussian." }, { symbol: "log X", latex: "\\log X", meaning: "Gaussian variable on the log scale." }, { symbol: "mu", latex: "\\mu", meaning: "Mean of log X, not mean of X." }, { symbol: "sigma", latex: "\\sigma", meaning: "Standard deviation of log X." }],
      formulaLatex: ["X=e^Z,\\qquad Z\\sim\\mathcal N(\\mu,\\sigma^2)", "\\mathbb E[X]=e^{\\mu+\\sigma^2/2}", "\\operatorname{median}(X)=e^\\mu"],
      derivation: { title: "Explain why products become log-normal", steps: ["Suppose X is a product of many positive independent factors Y_i.", "Taking logs gives log X=sum_i log Y_i.", "Under CLT-like conditions, this sum is approximately Gaussian.", "Exponentiating makes X approximately log-normal."] },
      workedExamples: [{ title: "Mean versus median", setup: "Let log X~N(0,1).", steps: ["Median is e^0=1.", "Mean is e^(0+1/2).", "Compute about 1.6487."], result: "The right tail pulls mean above median." }, { title: "Convert a multiplicative interval", setup: "On log scale, values within one sigma are mu-sigma to mu+sigma.", steps: ["Exponentiate both endpoints.", "Obtain e^(mu-sigma) to e^(mu+sigma).", "The interval is multiplicative, not symmetric in original units."], result: "Log-scale symmetry becomes right skew in X-space." }],
      exercises: [{ level: "Beginner", question: "If mu=ln 5, what is median X?", answer: "5." }, { level: "Intermediate", question: "If X is log-normal, what distribution does log X follow?", answer: "Gaussian with parameters mu and sigma^2." }, { level: "Applied", question: "Why can ordinary squared error be awkward for highly log-normal targets?", answer: "Large values dominate errors; modelling log targets or using a log-normal likelihood better matches multiplicative variation." }],
      takeaways: ["Log-normal variables are strictly positive and right-skewed.", "Their logarithms are Gaussian.", "Parameters describe log scale, not original scale.", "Products and multiplicative growth often motivate this model."]
    },
    "gumbel": {
      prerequisites: ["CDFs and inverse-transform sampling.", "Categorical distributions and logits.", "Softmax and temperature."],
      notationGuide: [{ symbol: "G~Gumbel(mu,beta)", latex: "G\\sim\\operatorname{Gumbel}(\\mu,\\beta)", meaning: "Extreme-value variable with location and scale." }, { symbol: "beta", latex: "\\beta>0", meaning: "Scale controlling spread." }, { symbol: "g_k", latex: "g_k", meaning: "Independent standard Gumbel noise for category k." }, { symbol: "tau", latex: "\\tau>0", meaning: "Gumbel-softmax temperature." }],
      formulaLatex: ["F(x)=\\exp\\left[-\\exp\\left(-\\frac{x-\\mu}{\\beta}\\right)\\right]", "k^*=\\arg\\max_k(\\log\\pi_k+g_k)", "y=\\operatorname{softmax}((\\log\\pi+g)/\\tau)"],
      derivation: { title: "Sample a standard Gumbel from a uniform", steps: ["Draw U uniformly from (0,1).", "Set U=F(G)=exp(-exp(-G)) for standard location zero and scale one.", "Take logs twice and solve for G.", "Obtain G=-log(-log U)."] },
      workedExamples: [{ title: "Gumbel-max categorical draw", setup: "Categories have probabilities pi_k.", steps: ["Draw one independent Gumbel g_k per category.", "Add g_k to log pi_k.", "Select the largest perturbed log score."], result: "The selected index is an exact categorical sample with probabilities pi." }, { title: "Temperature relaxation", setup: "Compare tau=2 with tau=0.1 in Gumbel-softmax.", steps: ["Large tau flattens perturbed logits.", "Small tau magnifies their differences.", "Outputs approach a one-hot vector as tau decreases."], result: "Temperature trades smooth gradients against closeness to hard categorical samples." }],
      exercises: [{ level: "Beginner", question: "What support does the Gumbel distribution have?", answer: "All real numbers." }, { level: "Intermediate", question: "Write the inverse-transform formula for standard Gumbel noise.", answer: "G=-log(-log U) for U~Uniform(0,1)." }, { level: "Applied", question: "Why can very low Gumbel-softmax temperature destabilize training?", answer: "Softmax becomes extremely sharp, causing high-variance or vanishing gradients and numerical sensitivity." }],
      takeaways: ["Gumbel models a class of maxima and extreme values.", "Gumbel-max converts categorical sampling into noisy argmax.", "Gumbel-softmax provides a differentiable relaxation, not an exact hard sample.", "Temperature must balance bias, discreteness, and gradient quality."]
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
