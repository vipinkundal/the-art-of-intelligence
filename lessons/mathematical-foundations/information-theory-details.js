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
    "entropy": detail({
      idea: ["Entropy measures how uncertain a random outcome is before we see it. A predictable variable has low entropy; a variable with many equally plausible outcomes has high entropy.", "You can also read entropy as average surprise: rare outcomes are more surprising and therefore carry more information when they occur."],
      how: "List the possible outcomes and their probabilities. Convert each probability into self-information using -log p, then take the probability-weighted average. Using log base 2 measures information in bits.",
      concepts: [
        concept("Self-information", "The surprise attached to one outcome. Less likely outcomes carry more surprise.", "I(x)=-log_2 p(x)", "An outcome with probability 1/8 carries 3 bits."),
        concept("Entropy", "The average self-information across all possible outcomes.", "H(X)=E[I(X)]", "Average uncertainty before observing X."),
        concept("Maximum entropy", "For a fixed number of outcomes, entropy is largest when every outcome is equally likely.", "p(x)=1/|X|", "A fair die is more uncertain than a heavily biased die."),
        concept("Units", "The logarithm base chooses the information unit.", "base 2: bits; base e: nats", "Two fair binary choices contain 2 bits together.")
      ],
      formulas: [
        formula("Discrete entropy", "H(X)=-sum_x p(x) log_2 p(x)", "average surprise in bits"),
        formula("Binary entropy", "h(p)=-p log_2 p-(1-p)log_2(1-p)", "uncertainty of a yes/no outcome"),
        formula("Certain outcome", "p(x*)=1 implies H(X)=0", "no uncertainty remains")
      ],
      caption: "Entropy averages the surprise of every possible outcome, weighted by how often each outcome occurs.",
      flow: [node("Outcomes", "what can happen"), node("Probabilities", "how likely each is"), node("Surprise", "-log probability"), node("Entropy", "weighted average surprise")],
      learn: ["Calculate self-information and entropy.", "Explain why a uniform distribution has high entropy.", "Distinguish bits from nats.", "Interpret entropy as uncertainty and as compression length."],
      ai: "Entropy appears in classification losses, decision trees, exploration, generative modelling, uncertainty estimates, and the theoretical limit of lossless compression.",
      pitfalls: ["Entropy belongs to a probability distribution, not to one raw number.", "High entropy means uncertainty, not automatically bad data.", "Differential entropy for continuous variables can be negative and behaves differently from discrete entropy."],
      example: "A fair coin has H(X)=-0.5 log_2 0.5-0.5 log_2 0.5=1 bit. A coin that always lands heads has entropy 0 because the outcome is known in advance.",
      question: "Which has greater entropy: a fair coin or a coin that lands heads 90% of the time?",
      answer: "The fair coin. Its two outcomes are equally plausible, so uncertainty is maximal at 1 bit.",
      resources: [{ label: "Wikipedia: Entropy (information theory)", url: "https://en.wikipedia.org/wiki/Entropy_(information_theory)" }]
    }),

    "cross-entropy": detail({
      idea: "Cross-entropy measures the average surprise when data follows a true distribution p but we encode or predict it using another distribution q. It becomes large when q gives low probability to outcomes that actually occur.",
      how: "For each observed outcome, read the probability assigned by the model q, take its negative logarithm, and average. With one-hot class labels this is simply the negative log probability of the correct class.",
      concepts: [
        concept("True distribution", "The distribution that generates the outcomes.", "p(x)", "A label distribution represented by observed data."),
        concept("Model distribution", "The probabilities predicted by the model.", "q(x)", "Softmax probabilities from a classifier."),
        concept("Log loss", "The per-example penalty for the probability assigned to the observed outcome.", "-log q(y)", "Predicting 0.01 for the true class receives a large penalty."),
        concept("Proper scoring", "Expected cross-entropy is minimized when predicted probabilities match the true probabilities.", "q=p", "Honest calibrated probabilities are optimal in expectation.")
      ],
      formulas: [
        formula("Cross-entropy", "H(p,q)=-sum_x p(x) log q(x)", "expected code length or prediction loss using q"),
        formula("One-hot classification", "L=-log q(y)", "negative log probability of the true class"),
        formula("Relation to KL", "H(p,q)=H(p)+D_KL(p||q)", "irreducible uncertainty plus model mismatch")
      ],
      caption: "Cross-entropy compares what actually happens with the probabilities a model assigned beforehand.",
      flow: [node("True outcome", "sample from p"), node("Model probability", "read q(y)"), node("Log penalty", "-log q(y)"), node("Average loss", "cross-entropy")],
      learn: ["Compute categorical and binary cross-entropy.", "Connect cross-entropy to negative log-likelihood.", "Explain why confident wrong predictions are heavily penalized.", "Relate cross-entropy to entropy and KL divergence."],
      ai: "Cross-entropy is the standard training objective for classifiers and autoregressive language models because it directly rewards probability assigned to correct outcomes.",
      pitfalls: ["Cross-entropy is not classification accuracy; it also measures confidence.", "Probabilities of exactly zero make the logarithm undefined.", "A low training cross-entropy does not by itself prove good calibration or generalization."],
      example: "For the correct class, model A predicts 0.8 and gets loss -log 0.8 about 0.223 nats. Model B predicts 0.1 and gets about 2.303 nats, so the confident mistake is penalized much more.",
      question: "Why can two classifiers with the same accuracy have different cross-entropy?",
      answer: "They can assign different confidence to correct and incorrect predictions; cross-entropy uses the full probability, while accuracy only checks the largest class.",
      resources: [{ label: "Wikipedia: Cross-entropy", url: "https://en.wikipedia.org/wiki/Cross-entropy" }]
    }),

    "kl-divergence": detail({
      idea: "KL divergence measures how much extra information is needed when a distribution q is used in place of a reference distribution p. It is zero when they match and positive when they differ.",
      how: "For each outcome, compare p(x) with q(x) using the log ratio log(p/q), weight that value by p(x), and add the results. Outcomes common under p but rare under q receive especially large penalties.",
      concepts: [
        concept("Reference distribution", "The distribution whose expectations are used.", "p(x)", "Observed data or a posterior distribution."),
        concept("Approximation", "The distribution being compared with the reference.", "q(x)", "A model or variational approximation."),
        concept("Log density ratio", "Measures local difference between the two probability assignments.", "log(p(x)/q(x))", "Positive where p assigns relatively more mass."),
        concept("Asymmetry", "Changing the order changes both weighting and behavior.", "D_KL(p||q) != D_KL(q||p)", "One direction may cover multiple modes while the other selects one.")
      ],
      formulas: [
        formula("Discrete KL", "D_KL(p||q)=sum_x p(x) log(p(x)/q(x))", "expected log probability ratio under p"),
        formula("Cross-entropy relation", "D_KL(p||q)=H(p,q)-H(p)", "extra coding cost caused by q"),
        formula("Non-negativity", "D_KL(p||q)>=0", "equals zero only when p and q match almost everywhere")
      ],
      caption: "KL divergence accumulates distribution mismatch from the viewpoint of the reference distribution p.",
      flow: [node("Reference p", "where outcomes matter"), node("Approximation q", "proposed probabilities"), node("Log ratio", "local mismatch"), node("Expected mismatch", "KL divergence")],
      learn: ["Calculate KL divergence for discrete distributions.", "Explain its direction dependence.", "Connect KL to cross-entropy and likelihood.", "Recognize support mismatch and infinite KL."],
      ai: "KL divergence appears in variational inference, VAEs, knowledge distillation, policy optimization, distribution shift analysis, and regularization toward a reference model.",
      pitfalls: ["KL divergence is not a distance because it is not symmetric and does not satisfy the triangle inequality.", "If p(x)>0 while q(x)=0, D_KL(p||q) is infinite.", "A small KL in one direction does not guarantee a small KL in the other."],
      example: "Let p=(0.5,0.5) and q=(0.9,0.1). D_KL(p||q) averages both log ratios under p, strongly penalizing q for assigning only 0.1 to an outcome that p produces half the time.",
      question: "Why can D_KL(p||q) become infinite?",
      answer: "Because q may assign zero probability to an outcome that has positive probability under p, making log(p/q) unbounded.",
      resources: [{ label: "Wikipedia: Kullback-Leibler divergence", url: "https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence" }]
    }),

    "mutual-information": detail({
      idea: "Mutual information measures how much knowing one variable tells us about another. It is zero for independent variables and grows when their outcomes strongly predict each other.",
      how: "Compare the joint probability p(x,y) with the product p(x)p(y) that independence would imply. Average the log ratio over joint outcomes. Equivalent views measure how much knowing Y reduces the entropy of X.",
      concepts: [
        concept("Joint distribution", "Describes how two variables occur together.", "p(x,y)", "Weather and umbrella use."),
        concept("Independence baseline", "What the joint distribution would be if neither variable informed the other.", "p(x)p(y)", "Separate marginal probabilities."),
        concept("Information gain", "The reduction in uncertainty after another variable is observed.", "H(X)-H(X|Y)", "Knowing a label reduces uncertainty about a feature."),
        concept("Symmetry", "Information shared by X and Y is the same in either direction.", "I(X;Y)=I(Y;X)", "Unlike KL, swapping variables changes nothing.")
      ],
      formulas: [
        formula("Mutual information", "I(X;Y)=sum_x,y p(x,y) log[p(x,y)/(p(x)p(y))]", "departure from independence"),
        formula("Entropy reduction", "I(X;Y)=H(X)-H(X|Y)", "uncertainty removed by knowing Y"),
        formula("KL view", "I(X;Y)=D_KL(p(x,y)||p(x)p(y))", "joint distribution versus independence")
      ],
      caption: "Mutual information asks how different the real joint behavior is from independent behavior.",
      flow: [node("Observe X", "first variable"), node("Uncertainty about Y", "before X is known"), node("Condition on X", "update Y distribution"), node("Information gained", "entropy reduction")],
      learn: ["Compute mutual information from a joint table.", "Use entropy and KL forms of mutual information.", "Explain why independence gives zero mutual information.", "Distinguish dependence from linear correlation."],
      ai: "Mutual information helps with feature selection, representation learning, clustering, disentanglement, contrastive objectives, and measuring dependence beyond correlation.",
      pitfalls: ["Mutual information detects any dependence, not only causal influence.", "Estimating it in high dimensions can be difficult and biased.", "Continuous mutual information requires density estimation or specialized estimators."],
      example: "If Y is an exact copy of a fair binary X, then H(Y)=1 bit and H(Y|X)=0, so I(X;Y)=1 bit. Knowing X completely reveals Y.",
      question: "Can two variables have zero correlation but positive mutual information?",
      answer: "Yes. A nonlinear dependence can cancel linear correlation while still making one variable informative about the other.",
      resources: [{ label: "Wikipedia: Mutual information", url: "https://en.wikipedia.org/wiki/Mutual_information" }]
    }),

    "conditional-entropy": detail({
      idea: "Conditional entropy measures the uncertainty left in one variable after another variable is known. Useful side information lowers uncertainty when the variables are related.",
      how: "For each possible value y, compute the entropy of X under p(x|y), then average those entropies using p(y). This produces the expected uncertainty about X after observing Y.",
      concepts: [
        concept("Conditional distribution", "Updates probabilities for X after a value of Y is known.", "p(x|y)", "Chance of rain after seeing cloud cover."),
        concept("Remaining uncertainty", "The average ambiguity in X after Y is observed.", "H(X|Y)", "Label uncertainty after seeing features."),
        concept("Side information", "Another variable used to reduce uncertainty or coding length.", "Y", "Previous tokens when predicting the next token."),
        concept("Chain rule", "Splits joint uncertainty into uncertainty about Y and remaining uncertainty about X.", "H(X,Y)=H(Y)+H(X|Y)", "Encode Y first, then encode X using Y.")
      ],
      formulas: [
        formula("Conditional entropy", "H(X|Y)=-sum_x,y p(x,y) log p(x|y)", "average remaining surprise"),
        formula("Chain rule", "H(X,Y)=H(Y)+H(X|Y)", "joint information encoded in stages"),
        formula("Mutual information", "I(X;Y)=H(X)-H(X|Y)", "uncertainty removed by Y")
      ],
      caption: "Conditioning uses observed side information before measuring what uncertainty remains.",
      flow: [node("Prior uncertainty", "H(X)"), node("Observe Y", "receive side information"), node("Update beliefs", "p(x|y)"), node("Remaining uncertainty", "H(X|Y)")],
      learn: ["Compute conditional entropy from joint probabilities.", "Apply the entropy chain rule.", "Relate conditional entropy to mutual information.", "Interpret conditional entropy in prediction tasks."],
      ai: "Next-token prediction, supervised learning, sequence modelling, and conditional generation all measure uncertainty after inputs or context are known.",
      pitfalls: ["Conditioning reduces entropy on average, but one particular observation can appear more confusing.", "H(X|Y) and H(Y|X) are generally different.", "Conditional entropy does not imply that Y causes X."],
      example: "If X is a fair bit and Y=X, then H(X)=1 bit but H(X|Y)=0 because seeing Y reveals X. If X and Y are independent, H(X|Y)=H(X).",
      question: "When does H(X|Y)=H(X)?",
      answer: "When knowing Y provides no information about X, as with independent variables.",
      resources: [{ label: "Wikipedia: Conditional entropy", url: "https://en.wikipedia.org/wiki/Conditional_entropy" }]
    }),

    "jensen-shannon-divergence": detail({
      idea: "Jensen-Shannon divergence compares two distributions through their average distribution. Unlike KL divergence, it is symmetric and remains finite even when the distributions have non-overlapping support.",
      how: "Create the midpoint distribution m=(p+q)/2. Measure D_KL(p||m) and D_KL(q||m), then average the two values. Each original distribution is compared with a mixture that includes its own support.",
      concepts: [
        concept("Mixture distribution", "A midpoint that assigns probability from both distributions.", "m=(p+q)/2", "Average of model and data distributions."),
        concept("Two KL comparisons", "Each distribution is compared with the shared mixture.", "KL(p||m), KL(q||m)", "Both viewpoints contribute equally."),
        concept("Symmetry", "Swapping p and q gives the same result.", "JSD(p,q)=JSD(q,p)", "Useful for balanced comparison."),
        concept("Boundedness", "With base-2 logs, JSD lies between 0 and 1 bit for equal mixing.", "0<=JSD<=1", "Disjoint distributions reach the upper bound.")
      ],
      formulas: [
        formula("Mixture", "m=(p+q)/2", "shared comparison distribution"),
        formula("Jensen-Shannon divergence", "JSD(p,q)=0.5 D_KL(p||m)+0.5 D_KL(q||m)", "symmetric smoothed divergence"),
        formula("Distance form", "d_JS(p,q)=sqrt(JSD(p,q))", "a true metric under standard definitions")
      ],
      caption: "Both distributions are compared with the same midpoint, producing a balanced finite measure.",
      flow: [node("Distribution p", "first probability model"), node("Mixture m", "average p and q"), node("Distribution q", "second probability model"), node("Average KL", "Jensen-Shannon divergence")],
      learn: ["Construct the mixture distribution.", "Calculate JSD from two KL terms.", "Explain symmetry and boundedness.", "Compare JSD with KL divergence."],
      ai: "JSD is used to compare generated and real distributions, evaluate clustering or embeddings, and motivate the original GAN objective.",
      pitfalls: ["JSD can saturate when distributions barely overlap, giving weak learning signals.", "The numerical upper bound depends on the log base and mixture weights.", "JSD being symmetric does not make JSD itself a metric; its square root is the metric."],
      example: "For p=(1,0) and q=(0,1), the mixture is m=(0.5,0.5). Each KL term is 1 bit, so JSD=1 bit: the distributions are maximally separated under equal mixing.",
      question: "Why is JSD finite when p and q have disjoint support?",
      answer: "Each distribution is compared with the mixture m, which assigns positive mass wherever either p or q does.",
      resources: [{ label: "Wikipedia: Jensen-Shannon divergence", url: "https://en.wikipedia.org/wiki/Jensen%E2%80%93Shannon_divergence" }]
    }),

    "coding-theory": detail({
      idea: "Coding theory studies how to represent information efficiently and reliably. Source coding removes redundancy for compression; channel coding adds controlled redundancy so messages can survive noise.",
      how: "Model likely messages, assign shorter codewords to common messages, and add check information when transmission errors are possible. A decoder uses code structure to reconstruct or correct the received message.",
      concepts: [
        concept("Codeword", "A symbol sequence used to represent a message.", "x -> c(x)", "The bit string 10 may represent one source symbol."),
        concept("Source coding", "Compresses likely messages using fewer average bits.", "average length >= H(X)", "Huffman or arithmetic coding."),
        concept("Channel coding", "Adds redundancy to detect or correct errors from a noisy channel.", "message -> encoded block", "Repetition, Reed-Solomon, or LDPC codes."),
        concept("Channel capacity", "The largest reliable information rate supported by a channel.", "R<C", "Below capacity, suitable codes can make error very small.")
      ],
      formulas: [
        formula("Expected code length", "L=sum_x p(x) l(x)", "average number of symbols per message"),
        formula("Source coding bound", "H(X)<=L<H(X)+1", "optimal prefix codes approach entropy"),
        formula("Binary symmetric channel", "C=1-h_2(e)", "capacity with bit-flip probability e")
      ],
      caption: "Coding balances efficiency against robustness depending on whether storage or noisy transmission is the main problem.",
      flow: [node("Source message", "information to represent"), node("Encoder", "compress or add checks"), node("Storage or channel", "may introduce noise"), node("Decoder", "recover the message")],
      learn: ["Distinguish source coding from channel coding.", "Explain prefix-free codewords and expected length.", "Understand entropy as a compression limit.", "Interpret channel capacity and error correction."],
      ai: "Tokenization, model compression, learned codecs, distributed training communication, and robust storage all rely on coding ideas.",
      pitfalls: ["Compression removes redundancy while error correction deliberately adds it.", "A uniquely decodable code is not automatically optimal.", "Capacity is an asymptotic limit, not a guarantee for short finite messages."],
      example: "If A occurs 50% of the time while B and C each occur 25%, a prefix code can use A=0, B=10, C=11. The average length is 1.5 bits instead of a fixed 2 bits.",
      question: "Why are common source symbols assigned shorter codewords?",
      answer: "They contribute most often to average length, so shortening them reduces the expected number of bits.",
      resources: [{ label: "Wikipedia: Coding theory", url: "https://en.wikipedia.org/wiki/Coding_theory" }]
    }),

    "minimum-description-length": detail({
      idea: "Minimum description length chooses the explanation that gives the shortest total description of both the model and the data that the model fails to predict. It formalizes a preference for useful simplicity.",
      how: "Describe the model, then encode the data using that model. A complex model costs more bits to describe but may compress the data better. Choose the model with the smallest combined length.",
      concepts: [
        concept("Model description", "Bits needed to specify the model or hypothesis.", "L(M)", "Complex trees require more structure to encode."),
        concept("Data given model", "Bits needed to encode observations after the model is known.", "L(D|M)", "Prediction errors or residuals."),
        concept("Two-part code", "Adds model complexity and unexplained data.", "L(M)+L(D|M)", "Balance fit against simplicity."),
        concept("Overfitting", "A model memorizes details but pays a large complexity cost.", "very small L(D|M), large L(M)", "A lookup table for every sample.")
      ],
      formulas: [
        formula("MDL objective", "M*=argmin_M [L(M)+L(D|M)]", "shortest complete explanation"),
        formula("Probability as code length", "L(D|M)=-log_2 p(D|M)", "likely data needs fewer bits"),
        formula("Bayesian connection", "-log p(M|D) = -log p(D|M)-log p(M)+constant", "MAP resembles two-part description length")
      ],
      caption: "MDL rewards a model only when its added complexity saves even more bits while describing the data.",
      flow: [node("Candidate model", "choose an explanation"), node("Encode model", "complexity cost"), node("Encode residual data", "lack-of-fit cost"), node("Choose shortest total", "MDL model")],
      learn: ["Explain the two-part MDL code.", "Connect negative log probability to code length.", "Describe the fit-complexity tradeoff.", "Relate MDL to regularization and Bayesian selection."],
      ai: "MDL provides a principled view of generalization, regularization, model selection, pruning, representation learning, and compression-based evaluation.",
      pitfalls: ["Results depend on the chosen coding scheme or model class.", "The shortest training description is not always easiest to compute.", "MDL is not simply choosing the model with the fewest parameters."],
      example: "A polynomial of degree 20 may fit 10 points perfectly, but encoding its many coefficients can cost more than encoding a straight line plus small residual errors. MDL may prefer the line.",
      question: "How does MDL discourage overfitting?",
      answer: "Extra model complexity must reduce the data encoding length by more than the bits required to describe that complexity.",
      resources: [{ label: "Wikipedia: Minimum description length", url: "https://en.wikipedia.org/wiki/Minimum_description_length" }]
    }),

    "rate-distortion-theory": detail({
      idea: "Rate-distortion theory asks how much information must be stored or transmitted to reconstruct data within an acceptable error. Better quality usually needs more bits; stronger compression accepts more distortion.",
      how: "Choose a distortion measure, set an allowed average distortion D, and search over probabilistic encoders and decoders. The rate-distortion function gives the smallest mutual information, and therefore ideal rate, that can meet D.",
      concepts: [
        concept("Rate", "Average information used per source symbol.", "R bits/symbol", "Bits per pixel in an image codec."),
        concept("Distortion", "A numerical cost for reconstruction error.", "d(x,x_hat)", "Squared pixel error or perceptual difference."),
        concept("Rate-distortion function", "Minimum achievable rate for a chosen distortion level.", "R(D)", "The theoretical compression-quality boundary."),
        concept("Lossy compression", "Discards information while controlling reconstruction quality.", "x -> z -> x_hat", "JPEG, audio codecs, or learned latent codecs.")
      ],
      formulas: [
        formula("Average distortion", "E[d(X,X_hat)]<=D", "quality requirement"),
        formula("Rate-distortion function", "R(D)=min I(X;X_hat) subject to E[d]<=D", "least information needed for distortion D"),
        formula("Lagrangian form", "min [I(X;X_hat)+beta E[d(X,X_hat)]]", "trade rate against distortion")
      ],
      caption: "The rate-distortion curve marks the best possible compromise between compact representation and reconstruction quality.",
      flow: [node("Source X", "original data"), node("Compress", "limited-rate representation"), node("Reconstruct X_hat", "approximate data"), node("Measure distortion", "quality versus bit rate")],
      learn: ["Define rate and distortion.", "Interpret a rate-distortion curve.", "Explain why the distortion measure matters.", "Connect the Lagrangian objective to learned compression."],
      ai: "Rate-distortion ideas guide neural image and audio codecs, latent-variable models, representation compression, quantization, and resource-aware model design.",
      pitfalls: ["Mean squared error may not match human perceptual quality.", "A point below the theoretical R(D) curve is unattainable under the assumptions.", "Rate and model memory are related but not identical quantities."],
      example: "At high bit rates an image codec preserves fine texture. At lower rates it removes details to save bits. The distortion metric determines which errors the codec considers cheapest.",
      question: "What does moving toward lower rate usually do to distortion?",
      answer: "It increases the minimum achievable distortion because fewer bits are available to preserve source information.",
      resources: [{ label: "Wikipedia: Rate-distortion theory", url: "https://en.wikipedia.org/wiki/Rate%E2%80%93distortion_theory" }]
    }),

    "perplexity": detail({
      idea: "Perplexity converts average log loss into an intuitive effective number of plausible choices. Lower perplexity means the model assigns more probability to the observed sequence.",
      how: "Compute the negative average log probability of the observed tokens, then exponentiate. With natural logs use exp; with base-2 logs use 2 to the power. Perplexity is monotonic with cross-entropy.",
      concepts: [
        concept("Token probability", "Probability assigned to the next observed token given its context.", "p(x_t|x_<t)", "Probability of 'cat' after 'the black'."),
        concept("Average negative log-likelihood", "Mean surprise per predicted token.", "-(1/T)sum_t log p(x_t|x_<t)", "Token-level cross-entropy."),
        concept("Effective branching factor", "An interpretation of how many equally likely choices would create the same uncertainty.", "PPL", "Perplexity 10 resembles choosing among 10 equal options."),
        concept("Tokenization dependence", "Perplexity changes when text is split into different units.", "tokens != characters", "Word and subword perplexities are not directly comparable.")
      ],
      formulas: [
        formula("Perplexity", "PPL=exp[-(1/T)sum_t ln p(x_t|x_<t)]", "exponentiated average token loss"),
        formula("Base-2 form", "PPL=2^H", "effective choices from cross-entropy in bits"),
        formula("Uniform choices", "p=1/K implies PPL=K", "K equally likely outcomes")
      ],
      caption: "Perplexity turns average token surprise back from log space into an effective choice count.",
      flow: [node("Context", "previous tokens"), node("Predict distribution", "next-token probabilities"), node("Observe token", "read assigned probability"), node("Average and exponentiate", "perplexity")],
      learn: ["Calculate perplexity from token probabilities.", "Relate perplexity to cross-entropy.", "Interpret lower and higher values.", "Explain why tokenization and dataset must match for comparison."],
      ai: "Perplexity is a common intrinsic measure for language models, compression models, and probabilistic sequence predictors.",
      pitfalls: ["Perplexity values are not comparable across different tokenizations or evaluation corpora.", "Lower perplexity does not guarantee factuality, safety, or better user experience.", "Including padding or leaking future tokens makes the score misleading."],
      example: "If a model assigns probability 0.25 to every observed next token, the average negative log probability is -log 0.25 and perplexity is 4: effectively four equal choices each step.",
      question: "What does perplexity 1 mean?",
      answer: "The model assigned probability 1 to every observed next token, so there was no predictive uncertainty on that evaluation sequence.",
      resources: [{ label: "Hugging Face: Perplexity of fixed-length models", url: "https://huggingface.co/docs/transformers/perplexity" }]
    }),

    "information-bottleneck": detail({
      idea: "The information bottleneck seeks a compact representation Z of input X that discards irrelevant detail while preserving information useful for predicting target Y.",
      how: "An encoder maps X to Z. Training penalizes how much information Z retains about X while rewarding information Z keeps about Y. A tradeoff parameter controls compression versus prediction.",
      concepts: [
        concept("Input X", "The original observation containing useful signal and irrelevant detail.", "X", "An image with object identity, lighting, and background."),
        concept("Representation Z", "A compressed summary learned from X.", "p(z|x)", "A latent vector from an encoder."),
        concept("Relevant target Y", "The information the representation should preserve.", "Y", "The object class in an image."),
        concept("Sufficiency-compression tradeoff", "Z should predict Y while carrying as little unnecessary information about X as possible.", "I(Z;Y) high, I(X;Z) low", "Keep shape cues, drop background noise.")
      ],
      formulas: [
        formula("IB objective", "min [I(X;Z)-beta I(Z;Y)]", "compress X while preserving target information"),
        formula("Markov structure", "Y <- X -> Z", "Z is constructed from X"),
        formula("Variational form", "reconstruction or prediction loss + beta * KL(q(z|x)||p(z))", "tractable approximation used in models")
      ],
      caption: "A bottleneck filters the input into a smaller representation that keeps task-relevant signal.",
      flow: [node("Input X", "signal plus nuisance detail"), node("Encoder", "compress information"), node("Representation Z", "compact useful summary"), node("Predict Y", "retain relevant information")],
      learn: ["Describe the roles of X, Z, and Y.", "Interpret both mutual-information terms.", "Explain the beta tradeoff.", "Connect information bottleneck to representation learning and variational methods."],
      ai: "The information bottleneck gives a framework for representation learning, feature compression, robustness, disentanglement, and latent-variable objectives such as beta-VAEs.",
      pitfalls: ["Mutual information is difficult to estimate for high-dimensional neural representations.", "Too much compression removes task-relevant information.", "A compact representation is not automatically fair, causal, or robust."],
      example: "For recognizing handwritten digits, Z should retain stroke shape needed for the digit label while discarding exact pixel noise, paper texture, or scanner artifacts.",
      question: "What happens when the bottleneck is made too restrictive?",
      answer: "Z loses information needed to predict Y, so task performance falls even though the representation is highly compressed.",
      resources: [{ label: "Original paper: The Information Bottleneck Method", url: "https://arxiv.org/abs/physics/0004057" }]
    })
  };

  const expandedDetails = {
    "entropy": {
      prerequisites: ["Discrete probability distributions.", "Expected values and weighted averages.", "Logarithms and their bases."],
      notationGuide: [
        { symbol: "p(x)", latex: "p(x)", meaning: "Probability of outcome x." },
        { symbol: "I(x)", latex: "I(x)=-\\log_b p(x)", meaning: "Self-information, or surprise, of one outcome." },
        { symbol: "H(X)", latex: "H(X)", meaning: "Entropy of random variable X." },
        { symbol: "b", latex: "b", meaning: "Logarithm base; base 2 gives bits and base e gives nats." }
      ],
      formulaLatex: ["H(X)=-\\sum_x p(x)\\log_2 p(x)", "h_2(p)=-p\\log_2p-(1-p)\\log_2(1-p)", "p(x^*)=1\\Rightarrow H(X)=0"],
      derivation: { title: "Compute entropy from outcome surprise", steps: ["Write every possible outcome x and its probability p(x).", "Convert each probability into surprise I(x)=-log_2 p(x).", "Weight each surprise by how often that outcome occurs: p(x)I(x).", "Add the weighted surprises to obtain H(X), the average information per observation."] },
      workedExamples: [
        { title: "A fair four-sided die", setup: "Four outcomes each have probability 1/4.", steps: ["Each outcome carries -log_2(1/4)=2 bits.", "Every weighted contribution is (1/4)2=1/2 bit.", "Add four equal contributions."], result: "The entropy is 2 bits, matching two fair binary decisions." },
        { title: "A biased binary source", setup: "Let P(X=1)=0.75 and P(X=0)=0.25.", steps: ["The common outcome has surprise about 0.415 bits.", "The rare outcome has surprise 2 bits.", "Weight and add: 0.75(0.415)+0.25(2)."], result: "H(X) is about 0.811 bits, less than the fair coin's 1 bit." }
      ],
      exercises: [
        { level: "Beginner", question: "What is the self-information of an event with probability 1/16 in base 2?", answer: "Four bits, because -log_2(1/16)=4." },
        { level: "Intermediate", question: "Why does a uniform distribution maximize entropy over a fixed finite set?", answer: "Spreading probability evenly makes outcomes equally unpredictable; moving mass toward some outcomes makes those outcomes easier to anticipate and lowers average surprise." },
        { level: "Applied", question: "Why might high entropy in a classifier's output trigger human review?", answer: "The predicted class probabilities are spread across alternatives, so the model has substantial uncertainty about which class is correct." }
      ],
      takeaways: ["Entropy is expected surprise, not surprise from a single event.", "Predictable distributions have low entropy.", "The logarithm base determines the unit.", "Entropy sets a fundamental average limit for lossless source coding."]
    },
    "cross-entropy": {
      prerequisites: ["Entropy and logarithms.", "Categorical probability distributions.", "Maximum-likelihood estimation."],
      notationGuide: [
        { symbol: "p", latex: "p(x)", meaning: "Reference or data-generating distribution." },
        { symbol: "q", latex: "q(x)", meaning: "Model distribution used to predict or encode outcomes." },
        { symbol: "H(p,q)", latex: "H(p,q)", meaning: "Cross-entropy of q measured under p." },
        { symbol: "y", latex: "y", meaning: "Observed correct class in a one-hot classification example." }
      ],
      formulaLatex: ["H(p,q)=-\\sum_x p(x)\\log q(x)", "\\mathcal L(y,q)=-\\log q(y)", "H(p,q)=H(p)+D_{\\mathrm{KL}}(p\\|q)"],
      derivation: { title: "Reduce categorical cross-entropy to log loss", steps: ["Represent a correct class y by a one-hot target vector whose y entry is 1.", "Write categorical cross-entropy as -sum_k p_k log q_k.", "All terms with p_k=0 disappear.", "Only -log q_y remains, so training directly rewards probability assigned to the observed class."] },
      workedExamples: [
        { title: "Compare two predictions", setup: "The true class is cat; models assign it probabilities 0.9 and 0.3.", steps: ["Model A loss is -ln(0.9), about 0.105.", "Model B loss is -ln(0.3), about 1.204.", "Compare the penalties, not just the winning labels."], result: "Model A receives much lower cross-entropy because it supports the observed class more strongly." },
        { title: "Binary cross-entropy", setup: "The label is y=0 and the predicted positive probability is q=0.2.", steps: ["Use -[y ln q+(1-y)ln(1-q)].", "The first term vanishes because y=0.", "Evaluate -ln(0.8)."], result: "The loss is about 0.223 nats." }
      ],
      exercises: [
        { level: "Beginner", question: "What happens to -log q(y) as q(y) approaches 1?", answer: "It approaches zero because the model confidently assigns probability to the observed class." },
        { level: "Intermediate", question: "Why is clipping probabilities only a numerical safeguard rather than a conceptual change to the loss?", answer: "The mathematical loss diverges at zero; clipping approximates the same objective while preventing undefined logs in finite-precision computation." },
        { level: "Applied", question: "A model's accuracy stays fixed while cross-entropy worsens. What likely changed?", answer: "Its winning classes stayed the same, but its probabilities became less confident on correct cases or more confidently wrong on mistakes." }
      ],
      takeaways: ["Cross-entropy evaluates a model distribution against observed outcomes.", "For one-hot labels it is negative log probability of the correct class.", "Its gap above entropy is KL divergence.", "It measures probabilistic quality, not only classification accuracy."]
    },
    "kl-divergence": {
      prerequisites: ["Entropy and cross-entropy.", "Probability mass or density functions.", "Expectations and logarithmic ratios."],
      notationGuide: [
        { symbol: "p", latex: "p(x)", meaning: "Reference distribution that supplies the expectation." },
        { symbol: "q", latex: "q(x)", meaning: "Comparison or approximation distribution." },
        { symbol: "D_KL", latex: "D_{\\mathrm{KL}}(p\\|q)", meaning: "Directed divergence from q to p's point of view." },
        { symbol: "supp(p)", latex: "\\operatorname{supp}(p)", meaning: "Outcomes on which p has positive probability." }
      ],
      formulaLatex: ["D_{\\mathrm{KL}}(p\\|q)=\\sum_x p(x)\\log\\frac{p(x)}{q(x)}", "D_{\\mathrm{KL}}(p\\|q)=H(p,q)-H(p)", "D_{\\mathrm{KL}}(p\\|q)\\geq0"],
      derivation: { title: "Obtain KL divergence as extra coding cost", steps: ["The ideal expected code length for data from p is H(p)=-sum p log p.", "Encoding the same data with probabilities q costs H(p,q)=-sum p log q.", "Subtract the ideal cost from the q-based cost.", "Combine the logarithms to get sum p log(p/q)=D_KL(p||q)."] },
      workedExamples: [
        { title: "Small binary mismatch", setup: "Let p=(0.5,0.5) and q=(0.75,0.25), using base-2 logs.", steps: ["Compute 0.5 log_2(0.5/0.75).", "Compute 0.5 log_2(0.5/0.25).", "Add the positive and negative local contributions."], result: "The divergence is about 0.208 bits; the total cannot be negative." },
        { title: "Support failure", setup: "p assigns 0.1 to an outcome that q declares impossible.", steps: ["The relevant ratio is 0.1/0.", "Its logarithm diverges.", "Multiplying by positive p mass does not remove the divergence."], result: "D_KL(p||q) is infinite, revealing a catastrophic support mismatch." }
      ],
      exercises: [
        { level: "Beginner", question: "What is D_KL(p||p)?", answer: "Zero, because every probability ratio is one and log 1 is zero." },
        { level: "Intermediate", question: "Why is KL divergence asymmetric?", answer: "Reversing the arguments changes both the probability used for weighting and the direction of every log ratio." },
        { level: "Applied", question: "Why can forward and reverse KL produce different variational approximations to a multimodal distribution?", answer: "Forward KL heavily penalizes missing p-supported modes, while reverse KL can prefer concentrating q on one high-density mode to avoid placing mass in low-density regions." }
      ],
      takeaways: ["KL is a directed distribution mismatch, not a metric distance.", "It equals extra cross-entropy above irreducible entropy.", "Positive p mass where q is zero gives infinite divergence.", "The chosen direction changes optimization behavior."]
    },
    "mutual-information": {
      prerequisites: ["Joint and marginal distributions.", "Conditional entropy.", "KL divergence and independence."],
      notationGuide: [
        { symbol: "p(x,y)", latex: "p(x,y)", meaning: "Joint distribution of X and Y." },
        { symbol: "p(x)p(y)", latex: "p(x)p(y)", meaning: "Joint distribution expected under independence." },
        { symbol: "I(X;Y)", latex: "I(X;Y)", meaning: "Information shared between X and Y." },
        { symbol: "H(X|Y)", latex: "H(X\\mid Y)", meaning: "Uncertainty in X remaining after Y is observed." }
      ],
      formulaLatex: ["I(X;Y)=\\sum_{x,y}p(x,y)\\log\\frac{p(x,y)}{p(x)p(y)}", "I(X;Y)=H(X)-H(X\\mid Y)", "I(X;Y)=D_{\\mathrm{KL}}(p(x,y)\\|p(x)p(y))"],
      derivation: { title: "Derive mutual information as entropy reduction", steps: ["Start with uncertainty H(X) before observing Y.", "After Y is known, the average remaining uncertainty is H(X|Y).", "Subtract remaining uncertainty from original uncertainty.", "Expanding both entropy sums yields the joint log-ratio form comparing p(x,y) with p(x)p(y)."] },
      workedExamples: [
        { title: "Perfectly copied bit", setup: "X is a fair bit and Y=X.", steps: ["H(X)=1 bit.", "Knowing Y determines X, so H(X|Y)=0.", "Subtract conditional from marginal entropy."], result: "I(X;Y)=1 bit; the variables share all of X's information." },
        { title: "Independent coin flips", setup: "X and Y are separate fair coin flips.", steps: ["The joint probability is 1/4 for every pair.", "The product p(x)p(y) is also 1/4.", "Every log ratio is log 1=0."], result: "I(X;Y)=0 because neither flip tells us anything about the other." }
      ],
      exercises: [
        { level: "Beginner", question: "If Y is a deterministic copy of X, what is I(X;Y)?", answer: "It equals H(X), because observing Y removes all uncertainty about X." },
        { level: "Intermediate", question: "Why is mutual information always symmetric?", answer: "The joint-to-product ratio and summation treat x and y identically, and the entropy identities give H(X)-H(X|Y)=H(Y)-H(Y|X)." },
        { level: "Applied", question: "Why can selecting features by estimated mutual information overfit?", answer: "Finite-sample estimators can be noisy or biased, and searching many candidate features can select those with accidentally high estimates." }
      ],
      takeaways: ["Mutual information measures general dependence, not only linear association.", "It is the entropy removed by observing another variable.", "Independence gives zero mutual information.", "Dependence does not establish a causal direction."]
    },
    "conditional-entropy": {
      prerequisites: ["Marginal and conditional probability.", "Entropy and expectation.", "Joint probability tables."],
      notationGuide: [
        { symbol: "p(x|y)", latex: "p(x\\mid y)", meaning: "Distribution of X after observing Y=y." },
        { symbol: "H(X|Y)", latex: "H(X\\mid Y)", meaning: "Expected uncertainty in X after Y is known." },
        { symbol: "H(X,Y)", latex: "H(X,Y)", meaning: "Joint uncertainty of the variable pair." },
        { symbol: "I(X;Y)", latex: "I(X;Y)", meaning: "Reduction from H(X) to H(X|Y)." }
      ],
      formulaLatex: ["H(X\\mid Y)=-\\sum_{x,y}p(x,y)\\log p(x\\mid y)", "H(X,Y)=H(Y)+H(X\\mid Y)", "I(X;Y)=H(X)-H(X\\mid Y)"],
      derivation: { title: "Build the conditional entropy average", steps: ["Fix one observed value y and calculate entropy H(X|Y=y).", "Weight that conditional entropy by the chance p(y) of seeing y.", "Sum across every value of y.", "Substitute p(y)p(x|y)=p(x,y) to obtain the compact joint-sum formula."] },
      workedExamples: [
        { title: "Noisy copy", setup: "Y copies a fair bit X correctly 75% of the time.", steps: ["For either observed y, X matches it with probability 0.75.", "The remaining uncertainty is binary entropy h_2(0.25).", "Average over y; both cases are identical."], result: "H(X|Y) is about 0.811 bits rather than zero." },
        { title: "Perfect side information", setup: "A label Y uniquely identifies one of four equally likely values of X.", steps: ["Before Y, H(X)=2 bits.", "After Y, only one X value is possible.", "Every conditional entropy is zero."], result: "H(X|Y)=0 and the side information supplies 2 bits." }
      ],
      exercises: [
        { level: "Beginner", question: "What is H(X|Y) when X is a deterministic function of Y?", answer: "Zero, because Y leaves no uncertainty about X." },
        { level: "Intermediate", question: "How can a particular observation increase uncertainty even though conditioning reduces entropy on average?", answer: "One rare y can flatten the conditional distribution, while other y values reduce uncertainty enough that the p(y)-weighted average still does not exceed H(X)." },
        { level: "Applied", question: "What does high next-token conditional entropy indicate?", answer: "Even after the available context, many next tokens remain plausible, so the prediction task is intrinsically or contextually ambiguous." }
      ],
      takeaways: ["Conditional entropy averages uncertainty after side information.", "The order matters: H(X|Y) usually differs from H(Y|X).", "The entropy chain rule decomposes joint uncertainty.", "Mutual information is exactly the average reduction produced by conditioning."]
    },
    "jensen-shannon-divergence": {
      prerequisites: ["KL divergence.", "Mixture distributions.", "Logarithms and probability support."],
      notationGuide: [
        { symbol: "p,q", latex: "p,q", meaning: "Two distributions to compare." },
        { symbol: "m", latex: "m=\\tfrac12(p+q)", meaning: "Equal-weight mixture distribution." },
        { symbol: "JSD", latex: "\\operatorname{JSD}(p,q)", meaning: "Jensen-Shannon divergence." },
        { symbol: "d_JS", latex: "d_{JS}(p,q)", meaning: "Square-root Jensen-Shannon metric." }
      ],
      formulaLatex: ["m=\\frac{p+q}{2}", "\\operatorname{JSD}(p,q)=\\frac12D_{\\mathrm{KL}}(p\\|m)+\\frac12D_{\\mathrm{KL}}(q\\|m)", "d_{JS}(p,q)=\\sqrt{\\operatorname{JSD}(p,q)}"],
      derivation: { title: "Construct a finite symmetric comparison", steps: ["Average p and q to create m, which has support wherever either input has support.", "Measure KL(p||m), viewing the mixture from p's perspective.", "Measure KL(q||m) in the opposite perspective.", "Average the two terms; swapping p and q merely swaps the addends, proving symmetry."] },
      workedExamples: [
        { title: "Identical distributions", setup: "Let p=q.", steps: ["Their mixture m equals p and q.", "Both KL terms compare a distribution with itself.", "Each term is zero."], result: "JSD(p,q)=0." },
        { title: "Disjoint binary distributions", setup: "Let p=(1,0) and q=(0,1) with base-2 logs.", steps: ["The mixture is (0.5,0.5).", "KL(p||m)=1 bit and KL(q||m)=1 bit.", "Average the two values."], result: "JSD=1 bit, the equal-mixture maximum." }
      ],
      exercises: [
        { level: "Beginner", question: "Is JSD(p,q) equal to JSD(q,p)?", answer: "Yes. Both KL terms are averaged with equal weight, so swapping the inputs changes no value." },
        { level: "Intermediate", question: "Why does the mixture prevent infinite divergence for disjoint support?", answer: "Where p is positive, m includes half of p and is positive; the same is true for q, so neither KL denominator is zero on its reference support." },
        { level: "Applied", question: "Why can JSD still be a poor training signal for a generator with disjoint support?", answer: "It can saturate near its maximum, so large parameter changes may produce little gradient information until the supports begin to overlap." }
      ],
      takeaways: ["JSD smooths KL comparisons through a shared mixture.", "It is symmetric and finite for ordinary probability distributions.", "Its bound depends on log base and mixture weights.", "The square root, not JSD itself, is the metric distance."]
    },
    "coding-theory": {
      prerequisites: ["Entropy and expected value.", "Binary strings and probability models.", "Basic noisy-channel intuition."],
      notationGuide: [
        { symbol: "c(x)", latex: "c(x)", meaning: "Codeword assigned to source symbol x." },
        { symbol: "ell(x)", latex: "\\ell(x)", meaning: "Length of the codeword for x." },
        { symbol: "L", latex: "L=\\mathbb E[\\ell(X)]", meaning: "Expected source-code length." },
        { symbol: "C", latex: "C", meaning: "Channel capacity in information units per channel use." }
      ],
      formulaLatex: ["L=\\sum_xp(x)\\ell(x)", "H(X)\\leq L < H(X)+1", "C=1-h_2(\\varepsilon)"],
      derivation: { title: "Calculate the average length of a prefix code", steps: ["Assign each source symbol x a uniquely decodable codeword c(x).", "Count each codeword's length ell(x).", "Multiply each length by the symbol probability p(x).", "Add the contributions to obtain expected length L and compare it with entropy H(X)."] },
      workedExamples: [
        { title: "Three-symbol prefix code", setup: "P(A)=1/2 and P(B)=P(C)=1/4; use A=0, B=10, C=11.", steps: ["Lengths are 1, 2, and 2 bits.", "Weight them: (1/2)1+(1/4)2+(1/4)2.", "Add the terms."], result: "Average length is 1.5 bits, equal to this source's entropy." },
        { title: "Repetition for error resistance", setup: "Encode bit 1 as 111 and decode by majority vote.", steps: ["Transmit three copies instead of one.", "If one bit flips, two correct copies remain.", "Choose the majority value."], result: "One error is corrected, but the rate falls to one information bit per three channel uses." }
      ],
      exercises: [
        { level: "Beginner", question: "Why must no prefix-code word be the prefix of another?", answer: "It lets a decoder identify symbol boundaries immediately and decode a concatenated stream unambiguously." },
        { level: "Intermediate", question: "What is the difference between source and channel coding?", answer: "Source coding removes predictable redundancy for efficiency; channel coding adds structured redundancy for error detection and correction." },
        { level: "Applied", question: "What does operating below channel capacity mean?", answer: "In the asymptotic theory, codes exist whose reliable information rate is below C and whose error probability can be made arbitrarily small with sufficiently long blocks." }
      ],
      takeaways: ["Source coding and channel coding solve opposite redundancy problems.", "Entropy lower-bounds average lossless compression length.", "Channel capacity is a rate limit under a specified noise model.", "Finite block length introduces practical delay and error tradeoffs beyond asymptotic limits."]
    },
    "minimum-description-length": {
      prerequisites: ["Negative log-likelihood.", "Model selection and overfitting.", "Basic source-coding intuition."],
      notationGuide: [
        { symbol: "M", latex: "M", meaning: "Candidate model or hypothesis." },
        { symbol: "D", latex: "D", meaning: "Observed dataset." },
        { symbol: "L(M)", latex: "L(M)", meaning: "Description length of the model." },
        { symbol: "L(D|M)", latex: "L(D\\mid M)", meaning: "Length needed to encode data once the model is known." }
      ],
      formulaLatex: ["M^*=\\arg\\min_M\\bigl[L(M)+L(D\\mid M)\\bigr]", "L(D\\mid M)=-\\log_2p(D\\mid M)", "-\\log p(M\\mid D)=-\\log p(D\\mid M)-\\log p(M)+C"],
      derivation: { title: "Turn fit and complexity into one coding objective", steps: ["Choose a code that first communicates which model M is being used.", "Pay L(M) bits for that model description.", "Use M's probability assignments to encode the observations at cost -log_2 p(D|M).", "Select the candidate with the smallest total, so extra complexity is accepted only when it compresses the data enough."] },
      workedExamples: [
        { title: "Constant versus lookup table", setup: "A dataset contains 100 mostly identical labels with two exceptions.", steps: ["A constant model is cheap to describe but must encode exceptions.", "A lookup table predicts perfectly but must store 100 outputs.", "Compare model bits plus residual bits."], result: "MDL can prefer the short constant explanation when memorization costs more than encoding two errors." },
        { title: "Polynomial degree", setup: "Degrees 1, 5, and 20 are fitted to a small noisy dataset.", steps: ["Higher degree usually lowers residual cost.", "It also requires more coefficient precision and structural description.", "Add both costs for every degree."], result: "The selected degree minimizes total description rather than training error alone." }
      ],
      exercises: [
        { level: "Beginner", question: "What are the two terms in a two-part MDL code?", answer: "The length for describing the model and the length for encoding the data given that model." },
        { level: "Intermediate", question: "How does negative log probability become a code length?", answer: "Ideal information codes assign about -log_2 p bits to an event of probability p, so likely data under a model is cheaper to encode." },
        { level: "Applied", question: "Why must two model classes use a coherent coding convention for an MDL comparison?", answer: "Arbitrary changes to how models or parameters are encoded can change L(M), so the comparison is meaningful only under a justified common coding framework." }
      ],
      takeaways: ["MDL balances model description against unexplained data.", "Perfect training fit can lose when its explanation is expensive.", "Negative log-likelihood supplies the data-coding term.", "MDL formalizes simplicity relative to a model class and coding scheme."]
    },
    "rate-distortion-theory": {
      prerequisites: ["Mutual information.", "Expectations and constrained optimization.", "Lossy compression concepts."],
      notationGuide: [
        { symbol: "X", latex: "X", meaning: "Original source random variable." },
        { symbol: "X_hat", latex: "\\widehat X", meaning: "Reconstructed source variable." },
        { symbol: "d(x,x_hat)", latex: "d(x,\\widehat x)", meaning: "Distortion cost for one reconstruction." },
        { symbol: "R(D)", latex: "R(D)", meaning: "Minimum information rate achievable at average distortion D." }
      ],
      formulaLatex: ["\\mathbb E[d(X,\\widehat X)]\\leq D", "R(D)=\\min_{p(\\widehat x\\mid x):\\,\\mathbb E[d]\\leq D}I(X;\\widehat X)", "\\min_{p(\\widehat x\\mid x)} I(X;\\widehat X)+\\beta\\,\\mathbb E[d(X,\\widehat X)]"],
      derivation: { title: "Form the rate-distortion tradeoff", steps: ["Choose a distortion function that says which reconstruction errors matter.", "Consider encoders described by conditional distributions p(x_hat|x).", "Require their average distortion not to exceed D.", "Among feasible encoders, minimize I(X;X_hat), the source information that the reconstruction must retain."] },
      workedExamples: [
        { title: "Zero-distortion endpoint", setup: "A discrete source must be reconstructed exactly.", steps: ["Set D=0 under a distortion that is zero only for exact matches.", "The reconstruction must identify X.", "Thus H(X|X_hat)=0 and I(X;X_hat)=H(X)."], result: "R(0)=H(X) for an ordinary discrete memoryless source." },
        { title: "Learned image codec", setup: "A neural codec minimizes rate plus beta times pixel distortion.", steps: ["Estimate rate from latent code probabilities.", "Measure reconstruction distortion.", "Change beta to alter the relative penalty."], result: "Larger distortion weight preserves more detail but generally uses more bits." }
      ],
      exercises: [
        { level: "Beginner", question: "What normally happens to R(D) when allowed distortion D increases?", answer: "It decreases or stays unchanged because the encoder has a looser quality requirement and may retain less information." },
        { level: "Intermediate", question: "Why does changing the distortion function change the rate-distortion curve?", answer: "The function defines which reconstruction mistakes count and how costly they are, so it changes the feasible set of encoders at every D." },
        { level: "Applied", question: "Why might perceptual image quality improve while mean squared distortion worsens?", answer: "A perceptual objective can preserve semantic texture and visual realism that humans value while allowing pixel-level differences penalized by mean squared error." }
      ],
      takeaways: ["Rate-distortion theory describes the best possible quality-compression frontier.", "The distortion measure encodes the meaning of quality.", "Mutual information quantifies retained source information.", "A Lagrange multiplier converts the constrained frontier into practical training objectives."]
    },
    "perplexity": {
      prerequisites: ["Conditional probability for sequences.", "Cross-entropy and logarithms.", "Autoregressive factorization."],
      notationGuide: [
        { symbol: "x_t", latex: "x_t", meaning: "Observed token at sequence position t." },
        { symbol: "x_<t", latex: "x_{<t}", meaning: "Tokens before position t used as context." },
        { symbol: "T", latex: "T", meaning: "Number of evaluated prediction positions." },
        { symbol: "PPL", latex: "\\operatorname{PPL}", meaning: "Exponentiated average negative log-likelihood." }
      ],
      formulaLatex: ["\\operatorname{PPL}=\\exp\\left[-\\frac1T\\sum_{t=1}^T\\ln p(x_t\\mid x_{<t})\\right]", "\\operatorname{PPL}=2^H", "p(x_t\\mid x_{<t})=\\frac1K\\Rightarrow\\operatorname{PPL}=K"],
      derivation: { title: "Convert average token surprise into perplexity", steps: ["For each position, read the probability assigned to the observed next token.", "Take its negative logarithm to obtain token surprise.", "Average surprise across the T evaluated tokens.", "Exponentiate in the matching base to return from log units to an effective choice count."] },
      workedExamples: [
        { title: "Constant token probability", setup: "A model assigns every observed next token probability 0.2.", steps: ["Each token loss is -ln(0.2)=ln 5.", "The average is also ln 5.", "Exponentiate: exp(ln 5)."], result: "Perplexity is 5." },
        { title: "Two-token sequence", setup: "Observed token probabilities are 0.5 and 0.125.", steps: ["Multiply probabilities to get sequence likelihood 0.0625.", "Take the geometric mean probability sqrt(0.0625)=0.25.", "Invert the geometric mean."], result: "Perplexity is 4, equivalent to average loss ln 4." }
      ],
      exercises: [
        { level: "Beginner", question: "What perplexity corresponds to cross-entropy ln 10 nats per token?", answer: "10, because exp(ln 10)=10." },
        { level: "Intermediate", question: "Why use a geometric rather than arithmetic mean of token probabilities?", answer: "Sequence likelihood multiplies conditional probabilities; averaging their logarithms and exponentiating produces the geometric mean consistent with that product." },
        { level: "Applied", question: "What must match before comparing perplexity between language models?", answer: "At minimum the evaluation text, tokenization or a normalized unit, context handling, and scoring protocol must match." }
      ],
      takeaways: ["Perplexity is exponentiated average token cross-entropy.", "Lower is better only under a comparable evaluation setup.", "It can be read as an effective branching factor.", "It does not directly measure factuality, usefulness, or safety."]
    },
    "information-bottleneck": {
      prerequisites: ["Mutual information.", "Latent-variable encoders.", "Prediction objectives and regularization."],
      notationGuide: [
        { symbol: "X", latex: "X", meaning: "Input containing useful and nuisance information." },
        { symbol: "Z", latex: "Z", meaning: "Learned compressed representation." },
        { symbol: "Y", latex: "Y", meaning: "Prediction target whose relevant information should remain." },
        { symbol: "beta", latex: "\\beta", meaning: "Tradeoff controlling compression versus predictive sufficiency." }
      ],
      formulaLatex: ["\\min_{p(z\\mid x)} I(X;Z)-\\beta I(Z;Y)", "Y\\leftarrow X\\rightarrow Z", "\\mathcal L_{\\mathrm{task}}+\\beta D_{\\mathrm{KL}}(q(z\\mid x)\\|p(z))"],
      derivation: { title: "Read the bottleneck objective term by term", steps: ["Encode X into a possibly stochastic representation Z.", "Penalize I(X;Z) so Z does not retain every input detail.", "Reward I(Z;Y) so Z remains informative about the target.", "Adjust beta and the chosen sign convention to move between stronger compression and stronger task preservation."] },
      workedExamples: [
        { title: "Digit representation", setup: "Images contain digit shape, paper texture, and scanner noise.", steps: ["Let Y be the digit class.", "Compress pixels X into latent Z.", "Train Z to preserve class information while limiting information about exact pixels."], result: "A useful bottleneck may retain strokes and discard nuisance texture." },
        { title: "Over-compressed bottleneck", setup: "The representation Z is restricted to nearly the same value for every input.", steps: ["I(X;Z) becomes very small.", "Different target classes become indistinguishable in Z.", "Prediction loss and H(Y|Z) increase."], result: "Compression alone is not success; the representation must remain sufficient for the task." }
      ],
      exercises: [
        { level: "Beginner", question: "Which term encourages Z to forget details of X?", answer: "Minimizing I(X;Z) encourages compression of input information." },
        { level: "Intermediate", question: "Why is the exact information-bottleneck objective difficult for neural networks?", answer: "Mutual information involving high-dimensional continuous variables and implicit distributions is usually hard to compute or estimate reliably." },
        { level: "Applied", question: "How can a variational prior on Z create a practical bottleneck?", answer: "Penalizing KL(q(z|x)||p(z)) limits how much the input-dependent encoder can deviate from a shared prior, providing an upper-bound-style compression regularizer." }
      ],
      takeaways: ["A bottleneck should discard nuisance information while preserving target information.", "Compression and sufficiency compete.", "Mutual-information terms often require variational approximations.", "A compact representation is not automatically causal, fair, or robust."]
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
