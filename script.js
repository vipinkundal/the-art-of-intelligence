const terms = [
  {
    term: "Linear Algebra",
    category: "mathematical-foundations",
    label: "Mathematical Foundations",
    definition: "The math of vectors, matrices, tensors, and transformations used to represent and move information through AI models.",
    example: "Embeddings are vectors, neural network weights are matrices, and similarity search often uses dot products.",
    lessonHref: "lessons/mathematical-foundations/linear-algebra/index.html"
  },
  {
    term: "Calculus",
    category: "mathematical-foundations",
    label: "Mathematical Foundations",
    definition: "The math of change, including derivatives, gradients, and approximations used to understand how outputs respond to inputs or parameters.",
    example: "Gradient descent uses derivatives to decide how model weights should change to reduce loss.",
    lessonHref: "lessons/mathematical-foundations/calculus-and-matrix-calculus/index.html"
  },
  {
    term: "Probability",
    category: "mathematical-foundations",
    label: "Mathematical Foundations",
    definition: "The math of uncertainty, including events, random variables, distributions, expectation, variance, and Bayesian reasoning.",
    example: "A classifier can output probabilities for several labels instead of only one fixed answer.",
    lessonHref: "lessons/mathematical-foundations/probability/index.html"
  },
  {
    term: "Statistics",
    category: "mathematical-foundations",
    label: "Mathematical Foundations",
    definition: "The practice of learning from data using estimation, uncertainty, tests, intervals, experimental design, and model diagnostics.",
    example: "A model evaluation report can use confidence intervals and calibration checks to decide whether a result is reliable.",
    lessonHref: "lessons/mathematical-foundations/statistics/index.html"
  },
  {
    term: "Optimization",
    category: "mathematical-foundations",
    label: "Mathematical Foundations",
    definition: "The process of choosing parameters or decisions that minimize loss, maximize reward, or satisfy constraints.",
    example: "Training a neural network uses optimization to adjust weights so prediction error decreases.",
    lessonHref: "lessons/mathematical-foundations/optimization/index.html"
  },
  {
    term: "Information Theory",
    category: "mathematical-foundations",
    label: "Mathematical Foundations",
    definition: "The math of uncertainty, surprise, compression, and information flow between variables or distributions.",
    example: "Cross-entropy loss trains a classifier by comparing the predicted probability distribution with the correct label distribution.",
    lessonHref: "lessons/mathematical-foundations/information-theory/index.html"
  },
  {
    term: "Discrete Mathematics",
    category: "mathematical-foundations",
    label: "Mathematical Foundations",
    definition: "The study of countable structures such as sets, graphs, trees, logic, proofs, automata, and algorithms.",
    example: "Search, planning, graph reasoning, and complexity analysis all rely on discrete mathematics.",
    lessonHref: "lessons/mathematical-foundations/discrete-mathematics-theoretical-computer-science/index.html"
  },
  {
    term: "Artificial Intelligence",
    category: "foundations",
    label: "Foundations",
    definition: "Software that performs tasks that usually require human judgment, such as understanding language, recognizing patterns, or making decisions.",
    example: "A support assistant that reads a question and suggests a useful answer is using AI.",
    lessonHref: "lessons/foundations/what-is-ai/index.html"
  },
  {
    term: "Data",
    category: "foundations",
    label: "Foundations",
    definition: "The examples, measurements, text, images, or records an AI system learns from or uses to make a decision.",
    example: "A house-price model may learn from past sale prices, locations, sizes, and room counts."
  },
  {
    term: "Dataset",
    category: "foundations",
    label: "Foundations",
    definition: "A structured collection of data used for training, testing, or evaluating a model.",
    example: "A spreadsheet of customer messages with labels like billing, technical, or cancellation is a dataset."
  },
  {
    term: "Model",
    category: "machine-learning",
    label: "Machine Learning",
    definition: "A system that has learned patterns from data and can use those patterns to make predictions or generate outputs.",
    example: "A model can learn from past emails and predict whether a new email is spam."
  },
  {
    term: "Training",
    category: "machine-learning",
    label: "Machine Learning",
    definition: "The process of showing a model examples so it can adjust itself and improve at a task.",
    example: "Training a vision model means showing it many images and the correct labels.",
    lessonHref: "lessons/machine-learning/training-a-model/index.html"
  },
  {
    term: "Inference",
    category: "machine-learning",
    label: "Machine Learning",
    definition: "The moment when a trained model is used to produce an answer, prediction, classification, or generated result.",
    example: "When you ask a chatbot a question and it replies, that reply is produced during inference."
  },
  {
    term: "Feature",
    category: "machine-learning",
    label: "Machine Learning",
    definition: "A piece of input information that helps a model learn or make a prediction.",
    example: "For predicting delivery time, distance, traffic, and weather can be features."
  },
  {
    term: "Label",
    category: "machine-learning",
    label: "Machine Learning",
    definition: "The answer or category attached to an example so the model can learn what correct output looks like.",
    example: "In a dataset of dog and cat photos, each photo's label says dog or cat."
  },
  {
    term: "Overfitting",
    category: "machine-learning",
    label: "Machine Learning",
    definition: "When a model memorizes training examples too closely and performs poorly on new examples.",
    example: "A student who memorizes practice questions but fails changed questions is overfitting."
  },
  {
    term: "Neural Network",
    category: "machine-learning",
    label: "Machine Learning",
    definition: "A model made of connected layers that transform inputs step by step to learn complex patterns.",
    example: "Neural networks are commonly used for image recognition and language models.",
    lessonHref: "lessons/deep-learning/neural-networks/index.html"
  },
  {
    term: "Transformer",
    category: "generative-ai",
    label: "Generative AI",
    definition: "A neural network design that is especially good at working with sequences like text, code, audio, and image patches.",
    example: "Modern language models use transformers to understand which words relate to each other.",
    lessonHref: "lessons/generative-ai/transformers/index.html"
  },
  {
    term: "Token",
    category: "generative-ai",
    label: "Generative AI",
    definition: "A small chunk of text that a language model reads or writes, often a word, part of a word, punctuation, or symbol.",
    example: "The sentence 'AI is useful' may be split into several tokens before the model reads it."
  },
  {
    term: "Embedding",
    category: "generative-ai",
    label: "Generative AI",
    definition: "A numeric representation of meaning that lets software compare text, images, or other data by similarity.",
    example: "Search can use embeddings to find articles that mean the same thing even if they use different words."
  },
  {
    term: "Prompt",
    category: "generative-ai",
    label: "Generative AI",
    definition: "The instruction, question, context, or examples given to a generative AI model before it responds.",
    example: "Asking 'summarize this article in five bullets' is a prompt."
  },
  {
    term: "RAG",
    category: "generative-ai",
    label: "Generative AI",
    definition: "Retrieval-augmented generation: a pattern where an AI system first finds relevant information, then uses it to answer.",
    example: "A company chatbot can search policy documents before answering an employee question."
  },
  {
    term: "Agent",
    category: "systems",
    label: "AI Systems",
    definition: "An AI system that can choose steps, use tools, inspect results, and continue working toward a goal.",
    example: "An agent might search files, edit code, run tests, and report what changed.",
    lessonHref: "lessons/ai-systems/agents-and-tools/index.html"
  },
  {
    term: "Tool Use",
    category: "systems",
    label: "AI Systems",
    definition: "When an AI system calls external functions, apps, APIs, databases, or commands to complete a task.",
    example: "A travel assistant may call a flight API instead of guessing ticket prices."
  },
  {
    term: "Evaluation",
    category: "systems",
    label: "AI Systems",
    definition: "The process of checking whether an AI system is correct, reliable, useful, and safe for its intended task.",
    example: "A summarizer can be evaluated by checking accuracy, missing facts, and unsupported claims."
  }
];

const termsGrid = document.querySelector("#terms-grid");
const searchInput = document.querySelector("#term-search");
const filterButtons = document.querySelectorAll(".filter-button");
const termCount = document.querySelector("#term-count");

let activeCategory = "all";

function renderTerms() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleTerms = terms.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const searchableText = `${item.term} ${item.label} ${item.definition} ${item.example}`.toLowerCase();
    return matchesCategory && searchableText.includes(query);
  });

  termsGrid.innerHTML = visibleTerms
    .map((item) => {
      const lessonLink = item.lessonHref
        ? `<a class="term-lesson-link" href="${item.lessonHref}">Open lesson</a>`
        : "";

      return `
        <article class="term-card">
          <span class="term-tag">${item.label}</span>
          <h3>${item.term}</h3>
          <p>${item.definition}</p>
          <div class="term-example"><strong>Example:</strong> ${item.example}</div>
          ${lessonLink}
        </article>
      `;
    })
    .join("");

  const termWord = visibleTerms.length === 1 ? "term" : "terms";
  termCount.textContent = `${visibleTerms.length} ${termWord} shown`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    renderTerms();
  });
});

searchInput.addEventListener("input", renderTerms);

renderTerms();
