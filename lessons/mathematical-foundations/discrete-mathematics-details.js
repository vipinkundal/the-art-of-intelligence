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
    "sets-relations-and-functions": detail({
      idea: ["A set groups distinct objects. A relation records which objects are connected. A function is a special relation that assigns exactly one output to every allowed input.", "These ideas provide a precise language for data collections, database links, state transitions, and mappings inside models."],
      how: "Define the objects in each set, state which ordered pairs belong to a relation, and check whether every input has exactly one assigned output before calling a relation a function.",
      concepts: [
        concept("Set", "An unordered collection of distinct elements.", "A={1,2,3}", "The set of labels in a classifier."),
        concept("Subset and set operations", "A subset uses only elements from another set; union, intersection, and difference combine sets.", "A subseteq B; A union B; A intersect B", "Items present in both search results form an intersection."),
        concept("Relation", "A set of ordered pairs describing which elements are connected.", "R subseteq A x B", "The relation 'user follows account'."),
        concept("Function", "A relation assigning each input in its domain exactly one output.", "f:A->B", "A tokenizer maps each token to one integer ID.")
      ],
      formulas: [
        formula("Cartesian product", "A x B={(a,b): a in A, b in B}", "all possible ordered pairs"),
        formula("Function rule", "for every a in A, there exists exactly one b in B with f(a)=b", "one output per input"),
        formula("Composition", "(g o f)(x)=g(f(x))", "apply f first, then g")
      ],
      caption: "Sets define objects, relations connect them, and functions make single-valued mappings between sets.",
      flow: [node("Set A", "possible inputs"), node("Ordered pairs", "relationships"), node("Function rule", "one output per input"), node("Set B", "possible outputs")],
      learn: ["Use membership, subset, union, intersection, and complement notation.", "Build Cartesian products and relations.", "Distinguish a general relation from a function.", "Recognize injective, surjective, and bijective functions."],
      ai: "Sets organize vocabularies and state spaces, relations power graphs and databases, and functions describe every deterministic transformation in an AI pipeline.",
      pitfalls: ["A set ignores order and repeated elements.", "A function may map many inputs to one output, but not one input to several outputs.", "The codomain can contain values that the function never produces."],
      example: "Let A={1,2,3} and B={even,odd}. The pairs (1,odd), (2,even), and (3,odd) form a function A->B. Adding (1,even) would break the function rule because input 1 would have two outputs.",
      question: "Is R={(1,a),(1,b),(2,a)} a function from {1,2} to {a,b}?",
      answer: "No. Input 1 is paired with two different outputs.",
      resources: [{ label: "Book of Proof: Sets and functions", url: "https://www.people.vcu.edu/~rhammack/BookOfProof/" }]
    }),

    "boolean-algebra": detail({
      idea: "Boolean algebra works with two truth values, usually true and false or 1 and 0. Operations such as AND, OR, and NOT combine conditions into logical expressions.",
      how: "Assign truth values to variables, evaluate each operator using its truth table, and simplify expressions with identities such as De Morgan's laws.",
      concepts: [
        concept("AND", "True only when both inputs are true.", "A AND B", "A user is active AND verified."),
        concept("OR", "True when at least one input is true.", "A OR B", "Use cached data OR fetch new data."),
        concept("NOT", "Reverses a truth value.", "NOT A", "NOT valid means invalid."),
        concept("Implication and equivalence", "Implication rules out a true premise with a false conclusion; equivalence requires matching truth values.", "A=>B; A<=>B", "If token is padding, then ignore it.")
      ],
      formulas: [
        formula("De Morgan", "NOT(A AND B)=(NOT A) OR (NOT B)", "negating a conjunction"),
        formula("Second De Morgan law", "NOT(A OR B)=(NOT A) AND (NOT B)", "negating a disjunction"),
        formula("Implication", "A=>B is equivalent to (NOT A) OR B", "rewrite implication with basic operators")
      ],
      caption: "Complex logical rules are evaluated and simplified by combining a few Boolean operations.",
      flow: [node("Truth values", "true or false inputs"), node("Operators", "AND, OR, NOT"), node("Expression", "combined condition"), node("Result", "true or false")],
      learn: ["Construct and read truth tables.", "Apply Boolean identities and De Morgan's laws.", "Translate plain-language rules into logic.", "Distinguish implication from equivalence."],
      ai: "Boolean logic appears in rule systems, search filters, feature masks, circuit design, constraint solving, and symbolic reasoning.",
      pitfalls: ["Everyday 'or' is sometimes exclusive, while Boolean OR is normally inclusive.", "A false premise makes an implication true in classical logic.", "NOT must apply to the intended whole expression, so parentheses matter."],
      example: "To accept a request only when it is signed and not blocked, write signed AND (NOT blocked). The request is rejected for every row of the truth table except signed=true, blocked=false.",
      question: "Simplify NOT(A OR B).",
      answer: "(NOT A) AND (NOT B), by De Morgan's law.",
      resources: [{ label: "Wikipedia: Boolean algebra", url: "https://en.wikipedia.org/wiki/Boolean_algebra" }]
    }),

    "combinatorics": detail({
      idea: "Combinatorics counts possible arrangements and selections without listing every case. The key question is whether order matters and whether repetition is allowed.",
      how: "Break a construction into choices, use multiplication for successive independent stages, addition for disjoint alternatives, and then choose permutations or combinations based on whether order matters.",
      concepts: [
        concept("Product rule", "Multiply counts for consecutive choices.", "m*n", "3 shirts and 2 trousers give 6 outfits."),
        concept("Permutation", "An ordered arrangement of distinct objects.", "P(n,k)=n!/(n-k)!", "Choose and rank 3 search results."),
        concept("Combination", "An unordered selection of objects.", "C(n,k)=n!/[k!(n-k)!]", "Choose 3 training examples from 10."),
        concept("Pigeonhole principle", "If more objects than containers are assigned, some container receives at least two.", "n+1 objects into n boxes", "Two records must share a bucket.")
      ],
      formulas: [
        formula("Factorial", "n!=n(n-1)...1", "arrangements of n distinct items"),
        formula("Combinations", "C(n,k)=n!/[k!(n-k)!]", "choose k when order does not matter"),
        formula("Binomial theorem", "(a+b)^n=sum_k C(n,k)a^(n-k)b^k", "combination counts appear in expansions")
      ],
      caption: "First identify the choices and whether order matters; then apply the matching counting rule.",
      flow: [node("Describe choices", "what is selected"), node("Order?", "sequence or group"), node("Repetition?", "allowed or forbidden"), node("Count", "rule or formula")],
      learn: ["Apply sum and product rules.", "Distinguish permutations from combinations.", "Count with and without replacement.", "Use inclusion-exclusion and the pigeonhole principle."],
      ai: "Combinatorics reveals the size of search spaces, possible feature subsets, model structures, assignments, and discrete probability events.",
      pitfalls: ["Using permutations when order does not matter overcounts.", "Repeated objects require adjusted formulas.", "Cases added with the sum rule must not overlap unless overlap is corrected."],
      example: "Choosing 2 features from 5 gives C(5,2)=10 subsets. Ordering two processing steps from the same five gives P(5,2)=20 because AB and BA are different.",
      question: "How many unordered pairs can be chosen from 6 items?",
      answer: "C(6,2)=6!/(2!4!)=15.",
      resources: [{ label: "Wikipedia: Combinatorics", url: "https://en.wikipedia.org/wiki/Combinatorics" }]
    }),

    "graph-theory": detail({
      idea: "A graph represents objects as vertices and relationships as edges. Graphs can be directed or undirected, weighted or unweighted, and can describe networks that do not fit neatly into rows or grids.",
      how: "Choose what each vertex and edge means, store adjacency information, then traverse or optimize over the graph to answer questions about paths, connectivity, neighborhoods, or structure.",
      concepts: [
        concept("Vertex and edge", "A vertex is an entity; an edge connects two entities.", "G=(V,E)", "Users are vertices and friendships are edges."),
        concept("Directed and undirected graph", "Directed edges have an orientation; undirected edges represent symmetric links.", "u->v versus {u,v}", "Following versus friendship."),
        concept("Path and connectivity", "A path is a sequence of adjacent vertices; connectivity asks what can reach what.", "v_0,...,v_k", "A route through a network."),
        concept("Degree and neighborhood", "Degree counts incident edges; a neighborhood lists directly connected vertices.", "deg(v), N(v)", "Immediate citations of a paper.")
      ],
      formulas: [
        formula("Graph", "G=(V,E)", "vertices plus edges"),
        formula("Handshake lemma", "sum_v deg(v)=2|E|", "each undirected edge contributes twice"),
        formula("Path cost", "cost(P)=sum_(e in P) w(e)", "total weight along a path")
      ],
      caption: "Graph algorithms move through relationships to discover reachable entities, useful paths, and structural patterns.",
      flow: [node("Entities", "create vertices"), node("Relationships", "add edges"), node("Graph structure", "adjacency and weights"), node("Algorithm", "traverse, rank, or cluster")],
      learn: ["Model a problem as vertices and edges.", "Use adjacency lists and matrices.", "Understand paths, cycles, components, and degrees.", "Compare breadth-first and depth-first search."],
      ai: "Knowledge graphs, graph neural networks, recommendation systems, dependency analysis, planning, and retrieval all operate on graph structure.",
      pitfalls: ["Edge direction changes reachability.", "A shortest path by edge count may not be shortest by weight.", "Dense adjacency matrices waste memory on sparse graphs."],
      example: "In an unweighted social graph, breadth-first search from Alice finds all users one friendship away, then two away, and therefore gives shortest hop counts.",
      question: "Why does an undirected graph's degree sum equal twice its number of edges?",
      answer: "Every edge touches two endpoints and contributes one degree to each endpoint.",
      resources: [{ label: "Open Data Structures: Graphs", url: "https://opendatastructures.org/ods-python/12_Graphs.html" }]
    }),

    "trees-and-directed-acyclic-graphs": detail({
      idea: "A tree is a connected graph with no cycles and exactly one simple path between any two vertices. A directed acyclic graph, or DAG, has directed edges but no directed cycle and can represent more general dependencies.",
      how: "Use a root and parent-child edges for a hierarchy. Use a DAG when an item may depend on several earlier items. A topological order places every prerequisite before the item that needs it.",
      concepts: [
        concept("Tree", "A connected acyclic undirected graph.", "|E|=|V|-1", "A file-system hierarchy."),
        concept("Rooted tree", "A tree with one chosen root, giving parent, child, ancestor, and depth relationships.", "root r", "A decision tree."),
        concept("DAG", "A directed graph with no directed cycle.", "u->...->u is impossible", "A neural computation graph."),
        concept("Topological order", "A linear order where every edge points from an earlier vertex to a later one.", "u->v implies order(u)<order(v)", "Schedule prerequisites before dependent tasks.")
      ],
      formulas: [
        formula("Tree edge count", "|E|=|V|-1", "characteristic of finite trees"),
        formula("Binary tree capacity", "level d has at most 2^d nodes", "maximum width by depth"),
        formula("DAG ordering", "for every (u,v) in E, pos(u)<pos(v)", "definition of topological order")
      ],
      caption: "Trees express single-parent hierarchy; DAGs express multi-parent dependency while preserving an acyclic order.",
      flow: [node("Dependencies", "what relies on what"), node("Choose structure", "tree or DAG"), node("Check for cycles", "must be absent"), node("Topological order", "safe evaluation sequence")],
      learn: ["Distinguish trees from general DAGs.", "Use parent, ancestor, depth, and leaf terminology.", "Detect cycles and produce topological orders.", "Recognize computation and dependency graphs."],
      ai: "Decision trees, parse trees, probabilistic graphical models, build pipelines, autograd graphs, and task planners rely on tree or DAG structure.",
      pitfalls: ["A DAG need not be a tree because a vertex may have several parents.", "An undirected tree does not have edge direction until it is rooted.", "Topological order is usually not unique."],
      example: "If task C needs both A and B, edges A->C and B->C form a DAG. Valid orders include A,B,C and B,A,C, but C cannot appear before either prerequisite.",
      question: "Can a DAG contain an undirected-looking triangle if all arrows do not form a directed cycle?",
      answer: "Yes. A DAG forbids directed cycles; three connected vertices can still be acyclic if their arrows follow one order.",
      resources: [{ label: "Wikipedia: Directed acyclic graph", url: "https://en.wikipedia.org/wiki/Directed_acyclic_graph" }]
    }),

    "recurrence-relations": detail({
      idea: "A recurrence relation defines a value using earlier values. Base cases start the sequence, and the recurrence explains how to build later cases.",
      how: "State base values, write the rule for n beyond the base, expand a few terms, then solve or bound the recurrence using substitution, recursion trees, characteristic equations, or the Master theorem.",
      concepts: [
        concept("Base case", "An explicitly known starting value.", "T(1)=c", "The cost for one input item."),
        concept("Recursive rule", "Defines a later value from smaller indices.", "a_n=f(a_(n-1),...)", "F_n=F_(n-1)+F_(n-2)."),
        concept("Closed form", "An expression computed directly without earlier terms.", "a_n=g(n)", "Fibonacci's formula or a growth bound."),
        concept("Recursion tree", "Expands recursive calls as a tree to sum work by level.", "T(n)=aT(n/b)+f(n)", "Analyze divide-and-conquer algorithms.")
      ],
      formulas: [
        formula("Arithmetic recurrence", "a_n=a_(n-1)+d", "constant increment"),
        formula("Geometric recurrence", "a_n=r a_(n-1)", "constant multiplication"),
        formula("Divide and conquer", "T(n)=aT(n/b)+f(n)", "subproblems plus local work")
      ],
      caption: "Base cases anchor a recurrence; repeated application of the rule generates or analyzes all later cases.",
      flow: [node("Base cases", "known starting values"), node("Recurrence", "depend on smaller cases"), node("Expand", "see repeated structure"), node("Solve or bound", "closed form or complexity")],
      learn: ["Write valid base cases and recurrence rules.", "Generate sequence terms.", "Solve simple linear recurrences.", "Analyze divide-and-conquer recurrences."],
      ai: "Recurrences describe recursive search, dynamic programming, tree algorithms, sequence models, and the runtime of divide-and-conquer procedures.",
      pitfalls: ["A recurrence without enough base cases is incomplete.", "Naive recursive evaluation can repeat the same subproblem exponentially.", "A closed form must satisfy both the rule and base cases."],
      example: "Merge sort splits into two half-size problems and merges in linear time: T(n)=2T(n/2)+n. Each recursion level costs about n and there are log_2 n levels, so T(n)=Theta(n log n).",
      question: "Why are base cases necessary?",
      answer: "They stop the backward chain and uniquely anchor the values generated by the recurrence.",
      resources: [{ label: "MIT Mathematics for Computer Science: Recurrences", url: "https://courses.csail.mit.edu/6.042/spring18/mcs.pdf" }]
    }),

    "mathematical-induction": detail({
      idea: "Mathematical induction proves a statement for every integer from a starting point. Prove the first case, then prove that any valid case forces the next one to be valid.",
      how: "State P(n), verify the base case, assume P(k) as the induction hypothesis, use that assumption to prove P(k+1), and conclude that every case from the base onward holds.",
      concepts: [
        concept("Proposition P(n)", "The precise statement to prove for each integer n.", "P(n)", "1+...+n=n(n+1)/2."),
        concept("Base case", "Verifies the first value in the claimed range.", "P(n_0)", "Check the sum formula at n=1."),
        concept("Induction hypothesis", "Temporarily assumes one case P(k) is true.", "assume P(k)", "Use the formula for the first k integers."),
        concept("Inductive step", "Proves the next case from the assumed case.", "P(k)=>P(k+1)", "Add k+1 and simplify.")
      ],
      formulas: [
        formula("Induction principle", "P(n_0) AND for all k>=n_0 [P(k)=>P(k+1)]", "proves P(n) for all n>=n_0"),
        formula("Sum identity", "sum_(i=1)^n i=n(n+1)/2", "classic induction example"),
        formula("Strong induction", "P(n_0)...P(k) => P(k+1)", "may use all earlier cases")
      ],
      caption: "The base case starts a chain, and the inductive step guarantees that truth passes to every next case.",
      flow: [node("State P(n)", "precise claim"), node("Base case", "start chain"), node("Assume P(k)", "induction hypothesis"), node("Prove P(k+1)", "continue forever")],
      learn: ["Write a complete induction proof.", "Use the induction hypothesis only inside the step.", "Choose appropriate base cases.", "Recognize when strong induction is easier."],
      ai: "Induction proves algorithm correctness, loop invariants, recursive data-structure properties, and bounds that hold for every input size.",
      pitfalls: ["Checking several examples is not a proof for all n.", "Assuming P(k+1) would be circular reasoning.", "Some recurrences require multiple base cases or strong induction."],
      example: "Assume 1+...+k=k(k+1)/2. Then adding k+1 gives k(k+1)/2+(k+1)=(k+1)(k+2)/2, exactly the formula for k+1.",
      question: "What two obligations must an induction proof establish?",
      answer: "A valid base case and an inductive implication from the assumed case to the next case.",
      resources: [{ label: "Book of Proof: Mathematical induction", url: "https://www.people.vcu.edu/~rhammack/BookOfProof/" }]
    }),

    "proof-by-contradiction": detail({
      idea: "Proof by contradiction establishes a claim by assuming its negation and showing that this assumption leads to an impossibility. Therefore the negation cannot be true.",
      how: "State the claim P, assume NOT P, derive consequences using valid rules and known facts, reach a contradiction such as Q AND NOT Q, then conclude P.",
      concepts: [
        concept("Claim", "The statement we want to establish.", "P", "There is no largest prime."),
        concept("Negated assumption", "The logical opposite assumed temporarily.", "NOT P", "Assume there is a largest prime."),
        concept("Contradiction", "An impossible conclusion or conflict with a known fact.", "Q AND NOT Q", "Construct a larger prime-related number."),
        concept("Conclusion", "Because the negation is impossible, the original claim holds.", "NOT(NOT P), therefore P", "Reject the temporary assumption.")
      ],
      formulas: [
        formula("Contradiction pattern", "(NOT P => false) => P", "impossible negation proves the claim"),
        formula("Logical conflict", "Q AND NOT Q=false", "a direct contradiction"),
        formula("Irrational square root setup", "sqrt(2)=a/b with gcd(a,b)=1", "assumption leads to both a and b even")
      ],
      caption: "Assume the opposite, follow its unavoidable consequences, and reject it when those consequences cannot all be true.",
      flow: [node("Claim P", "what to prove"), node("Assume NOT P", "temporary opposite"), node("Derive consequences", "valid reasoning"), node("Contradiction", "conclude P")],
      learn: ["Negate claims correctly.", "Identify a genuine contradiction.", "Separate temporary assumptions from conclusions.", "Choose between direct proof, contrapositive, and contradiction."],
      ai: "Contradiction supports formal verification, theorem proving, consistency checking, satisfiability solving, and reasoning about impossible algorithm behavior.",
      pitfalls: ["A surprising result is not necessarily a contradiction.", "The contradiction must follow from the negated assumption plus accepted facts.", "Failing to find a contradiction does not make the claim false."],
      example: "To prove sqrt(2) is irrational, assume sqrt(2)=a/b in lowest terms. Algebra shows a must be even, then b must also be even, contradicting that a/b was in lowest terms.",
      question: "What exactly is rejected at the end of a contradiction proof?",
      answer: "The temporary assumption that the original claim is false.",
      resources: [{ label: "Wikipedia: Proof by contradiction", url: "https://en.wikipedia.org/wiki/Proof_by_contradiction" }]
    }),

    "automata-and-formal-languages": detail({
      idea: "A formal language is a set of symbol strings. An automaton is an abstract machine that reads a string and decides whether the string belongs to a language.",
      how: "Define an alphabet and grammar or acceptance rule. The machine starts in an initial state, reads one symbol at a time, follows transitions, and accepts if it finishes in an accepting state.",
      concepts: [
        concept("Alphabet and string", "An alphabet is a finite set of symbols; a string is a finite sequence of them.", "Sigma; w in Sigma*", "Binary strings use alphabet {0,1}."),
        concept("Formal language", "Any set of strings over an alphabet.", "L subseteq Sigma*", "All binary strings ending in 01."),
        concept("Finite automaton", "A machine with finitely many states and symbol-driven transitions.", "M=(Q,Sigma,delta,q0,F)", "Recognize a simple token pattern."),
        concept("Grammar", "Rules that generate valid strings or parse structures.", "S -> productions", "Programming-language syntax.")
      ],
      formulas: [
        formula("DFA transition", "delta: Q x Sigma -> Q", "one next state for each state-symbol pair"),
        formula("Language recognized", "L(M)={w: delta*(q0,w) in F}", "strings that finish in accepting states"),
        formula("Kleene star", "Sigma*=union_(n>=0) Sigma^n", "all finite strings including empty string")
      ],
      caption: "Symbols form strings, language rules define validity, and an automaton recognizes valid strings through state transitions.",
      flow: [node("Alphabet", "allowed symbols"), node("Input string", "symbol sequence"), node("Automaton", "follow transitions"), node("Accept or reject", "language membership")],
      learn: ["Define alphabets, strings, and languages.", "Trace deterministic finite automata.", "Relate regular expressions to finite automata.", "Distinguish regular, context-free, and more powerful languages."],
      ai: "Automata and grammars support tokenization, parsing, constrained decoding, program synthesis, validation, protocol reasoning, and sequence pattern matching.",
      pitfalls: ["A language is a set of strings, not a natural spoken language only.", "Finite automata have no unbounded stack and cannot recognize every nested structure.", "A nondeterministic automaton is not random; it accepts when some valid path accepts."],
      example: "A DFA for binary strings ending in 1 needs states that remember whether the most recent symbol was 1. It accepts exactly when input ends in the 'last was 1' state.",
      question: "Why can a finite automaton not correctly match arbitrarily nested parentheses?",
      answer: "It has only finitely many states and cannot store an unbounded nesting depth; a stack-based pushdown automaton can.",
      resources: [{ label: "Open textbook: Introduction to Theoretical Computer Science", url: "https://introtcs.org/public/index.html" }]
    }),

    "computability": detail({
      idea: "Computability asks whether any algorithm can solve a problem for every valid input, regardless of how much time it takes. Some precisely stated problems are provably impossible for all algorithms.",
      how: "Formalize inputs, outputs, and termination. Model algorithms with a Turing machine or equivalent system, then prove decidability by giving an algorithm or undecidability through a reduction or diagonal argument.",
      concepts: [
        concept("Decision problem", "A problem whose output is yes or no.", "L subseteq Sigma*", "Does this program halt on this input?"),
        concept("Decidable", "Some algorithm halts on every input and returns the correct answer.", "recursive language", "Testing whether a finite graph is connected."),
        concept("Recognizable", "An algorithm accepts yes-instances but may run forever on no-instances.", "recursively enumerable", "Simulate a program until it halts."),
        concept("Undecidable", "No algorithm can correctly decide every input.", "no total decider exists", "The halting problem.")
      ],
      formulas: [
        formula("Decider", "M(w) halts for every w and accepts iff w in L", "algorithm always answers"),
        formula("Recognizer", "w in L => M accepts; w not in L may loop", "yes cases are eventually confirmed"),
        formula("Halting set", "HALT={(M,w): M halts on w}", "canonical undecidable language")
      ],
      caption: "Computability separates problems with total algorithms from problems no algorithm can decide in full generality.",
      flow: [node("Formal problem", "inputs and required answer"), node("Machine model", "what algorithms may do"), node("Construct or reduce", "algorithm or impossibility proof"), node("Classify", "decidable, recognizable, undecidable")],
      learn: ["Distinguish decidable from recognizable problems.", "Understand the role of Turing machines.", "Explain the halting problem at a high level.", "Use reductions to transfer undecidability."],
      ai: "Computability defines hard limits for program analysis, automated reasoning, verification, synthesis, and what any general AI system could guarantee.",
      pitfalls: ["Undecidable does not mean every individual instance is difficult.", "Intractable problems may be computable but slow; undecidable problems admit no general solver.", "A timeout cannot distinguish a program that loops forever from one that halts much later."],
      example: "A universal halting checker would need to decide whether any program stops on any input. Self-reference can construct a program that does the opposite of the checker's prediction, proving such a checker cannot exist.",
      question: "How is an undecidable problem different from an exponential-time problem?",
      answer: "An exponential-time problem still has an algorithm that eventually answers; an undecidable problem has no algorithm that correctly halts on every input.",
      resources: [{ label: "Stanford Encyclopedia: Computability and complexity", url: "https://plato.stanford.edu/entries/computability/" }]
    }),

    "time-and-space-complexity": detail({
      idea: "Time complexity describes how the number of computational steps grows with input size. Space complexity describes how much memory grows. Asymptotic notation focuses on growth for large inputs.",
      how: "Choose an input-size measure n, identify dominant operations and stored data, derive functions T(n) and S(n), then express upper, lower, or tight growth bounds.",
      concepts: [
        concept("Input size", "A numerical measure of problem scale.", "n", "Number of vertices, tokens, or bits."),
        concept("Time complexity", "Growth of primitive work with input size.", "T(n)", "A loop over n items takes linear time."),
        concept("Space complexity", "Growth of extra memory needed during execution.", "S(n)", "A visited array for n vertices uses linear space."),
        concept("Asymptotic bounds", "O is an eventual upper bound, Omega a lower bound, and Theta a tight bound.", "O(g), Omega(g), Theta(g)", "3n+10 is Theta(n).")
      ],
      formulas: [
        formula("Big-O", "f(n)=O(g(n)) if f(n)<=c g(n) for all n>=n0", "eventual upper growth bound"),
        formula("Tight bound", "f(n)=Theta(g(n)) when f is both O(g) and Omega(g)", "matching upper and lower rates"),
        formula("Common ordering", "1 < log n < n < n log n < n^2 < 2^n", "typical growth rates")
      ],
      caption: "Complexity starts from input size, counts growing resources, and summarizes their long-run rate.",
      flow: [node("Input size n", "measure scale"), node("Count work", "derive T(n)"), node("Count memory", "derive S(n)"), node("Asymptotic class", "summarize growth")],
      learn: ["Identify meaningful input-size measures.", "Compute time and auxiliary-space bounds.", "Use O, Omega, and Theta correctly.", "Compare worst-case, average-case, and amortized analysis."],
      ai: "Complexity determines whether training, search, inference, attention, retrieval, and data processing remain practical as models and datasets grow.",
      pitfalls: ["Big-O is an upper bound, not automatically a tight bound.", "Constants and hardware still matter at realistic sizes.", "Input length in bits may differ greatly from a numeric input value."],
      example: "A nested loop examining every ordered pair of n items performs about n^2 comparisons, so time is Theta(n^2). If it stores only counters, auxiliary space can remain Theta(1).",
      question: "Can an algorithm use Theta(n^2) time but Theta(1) auxiliary space?",
      answer: "Yes. It can repeatedly scan pairs without storing a growing data structure.",
      resources: [{ label: "MIT OpenCourseWare: Introduction to Algorithms", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/" }]
    }),

    "reductions": detail({
      idea: "A reduction transforms instances of one problem A into instances of another problem B. If solving B would solve A, then B is at least as hard as A under that reduction.",
      how: "Construct a transformation f, prove that x is a yes-instance of A exactly when f(x) is a yes-instance of B, and show that f uses the required amount of time or resources.",
      concepts: [
        concept("Source problem", "The problem whose difficulty or solution we want to transfer.", "A", "A known hard problem."),
        concept("Target problem", "The problem that receives transformed instances.", "B", "A new problem being classified."),
        concept("Mapping reduction", "A computable transformation preserving yes/no answers.", "x in A iff f(x) in B", "Convert SAT formulas into graph instances."),
        concept("Polynomial-time reduction", "A mapping whose computation is polynomial in input size.", "A <=p B", "Used for NP-hardness proofs.")
      ],
      formulas: [
        formula("Correctness", "x in A iff f(x) in B", "the transformation preserves answers"),
        formula("Hardness direction", "A <=p B and A hard => B is at least as hard", "solver for B would solve A"),
        formula("Algorithm reuse", "time_A(n)=time_f(n)+time_B(|f(x)|)", "transformation plus target solver")
      ],
      caption: "Transform A into B, solve B, and translate the result back to answer A.",
      flow: [node("Instance of A", "original problem"), node("Reduction f", "efficient transformation"), node("Instance of B", "preserved answer"), node("Solver for B", "answers A indirectly")],
      learn: ["State the direction of a reduction correctly.", "Prove both directions of answer preservation.", "Bound transformation cost.", "Use reductions for algorithms and hardness proofs."],
      ai: "Reductions connect planning, constraint satisfaction, optimization, inference, and verification problems to established solvers and known complexity results.",
      pitfalls: ["To prove B hard, reduce a known hard A to B, not B to A.", "A transformation without a correctness proof is not enough.", "A reduction may increase instance size, which affects total complexity."],
      example: "To show a scheduling problem is hard, transform every instance of a known hard partition problem into a schedule that is feasible exactly when the partition exists.",
      question: "If A reduces to B and B has a fast solver, what follows?",
      answer: "A also has a fast solver consisting of the reduction followed by the solver for B, assuming the reduction and output size are suitably efficient.",
      resources: [{ label: "Wikipedia: Reduction (complexity)", url: "https://en.wikipedia.org/wiki/Reduction_(complexity)" }]
    }),

    "p-np-np-hard-and-np-complete": detail({
      idea: "P contains decision problems solvable efficiently. NP contains decision problems whose proposed yes-solutions can be checked efficiently. NP-hard problems are at least as hard as every NP problem, and NP-complete problems are both in NP and NP-hard.",
      how: "Express a task as a decision problem, identify a certificate and polynomial verifier for NP membership, then prove NP-hardness by a polynomial reduction from a known NP-complete problem.",
      concepts: [
        concept("P", "Decision problems solvable in polynomial time by a deterministic algorithm.", "P", "Graph connectivity or shortest-path threshold."),
        concept("NP", "Decision problems whose yes-certificates can be verified in polynomial time.", "NP", "Verify a proposed satisfying assignment."),
        concept("NP-hard", "Problems at least as hard as every problem in NP; they need not be decision problems or lie in NP.", "for all A in NP, A <=p H", "An optimization version may be NP-hard."),
        concept("NP-complete", "Decision problems that are both in NP and NP-hard.", "NPC=NP intersect NP-hard", "SAT and many combinatorial decisions.")
      ],
      formulas: [
        formula("Containment", "P subseteq NP", "a solved problem can also be verified"),
        formula("NP-complete", "L in NP AND for every A in NP, A <=p L", "membership plus hardness"),
        formula("Central question", "P ?= NP", "unknown whether efficient verification implies efficient solving")
      ],
      caption: "Efficient solving defines P, efficient verification defines NP, and reductions establish NP-hardness and completeness.",
      flow: [node("Decision problem", "yes or no"), node("Verify certificate", "show membership in NP"), node("Reduce known hard problem", "show NP-hardness"), node("Classify", "P, NP, hard, or complete")],
      learn: ["Define P, NP, NP-hard, and NP-complete precisely.", "Separate decision, search, and optimization versions.", "Show NP membership with a verifier.", "Understand the structure of an NP-completeness proof."],
      ai: "Many planning, scheduling, feature selection, logical inference, architecture search, and exact combinatorial optimization tasks have NP-hard forms.",
      pitfalls: ["NP does not mean 'not polynomial'.", "NP-hard problems do not have to be in NP.", "No proof is known that P differs from NP, although most researchers expect it."],
      example: "For SAT, a truth assignment is a certificate. Checking whether it satisfies every clause is polynomial, so SAT is in NP. Reductions establish that every NP problem can be transformed to SAT, making it NP-complete.",
      question: "Can an optimization problem be NP-hard without being NP-complete?",
      answer: "Yes. NP-complete is defined for decision problems in NP; optimization problems may be NP-hard but are not themselves members of that decision class.",
      resources: [{ label: "Clay Mathematics Institute: P versus NP", url: "https://www.claymath.org/millennium/p-vs-np/" }]
    }),

    "approximation-algorithms": detail({
      idea: "An approximation algorithm efficiently finds a solution with a proven quality guarantee when finding the exact optimum is too expensive.",
      how: "Define the objective and feasible solutions, design an efficient heuristic, then prove its value is within a stated ratio or additive error of the unknown optimum for every input.",
      concepts: [
        concept("Feasible solution", "A candidate satisfying all problem constraints.", "S in F", "A valid route visiting every required city."),
        concept("Optimal value", "The best possible objective among feasible solutions.", "OPT", "Shortest valid route length."),
        concept("Approximation ratio", "A worst-case multiplicative guarantee relative to OPT.", "ALG/OPT <= rho for minimization", "A 2-approximation costs at most twice optimum."),
        concept("Approximation scheme", "A family of algorithms trading runtime for accuracy through epsilon.", "1+epsilon", "PTAS or FPTAS.")
      ],
      formulas: [
        formula("Minimization guarantee", "ALG <= rho * OPT", "solution is within factor rho"),
        formula("Maximization guarantee", "ALG >= OPT/rho", "value retains a guaranteed fraction"),
        formula("Relative error", "|ALG-OPT|/|OPT| <= epsilon", "accuracy controlled by epsilon")
      ],
      caption: "Approximation trades exact optimality for efficient computation while retaining a mathematical quality bound.",
      flow: [node("Hard optimization", "exact search too costly"), node("Efficient algorithm", "construct feasible answer"), node("Compare with bound", "relate ALG to OPT"), node("Guaranteed approximation", "known quality and runtime")],
      learn: ["Distinguish heuristics from guaranteed approximations.", "Read minimization and maximization ratios.", "Prove a simple approximation bound.", "Understand PTAS and FPTAS tradeoffs."],
      ai: "Approximation is useful in clustering, facility location, routing, subset selection, inference, and resource allocation where exact search is impractical.",
      pitfalls: ["A good average result is not the same as a worst-case guarantee.", "Ratios near zero or negative objectives need special handling.", "A tighter approximation may have an unusable dependence on epsilon."],
      example: "For metric traveling salesperson, doubling a minimum spanning tree and shortcutting repeated vertices gives a tour no more than twice the optimal length.",
      question: "What extra promise does a 2-approximation provide over an ordinary heuristic?",
      answer: "For every valid input, its objective is guaranteed to be within a factor of 2 of optimum under the stated assumptions.",
      resources: [{ label: "Wikipedia: Approximation algorithm", url: "https://en.wikipedia.org/wiki/Approximation_algorithm" }]
    }),

    "randomized-algorithms": detail({
      idea: "A randomized algorithm makes some choices using random bits. Randomness can simplify a method, avoid adversarial patterns, sample huge spaces, or produce fast estimates.",
      how: "Specify the random choices and output, analyze probability over the algorithm's internal randomness, and bound expected runtime or failure probability. Repetition can amplify success.",
      concepts: [
        concept("Random choice", "The algorithm samples a pivot, item, hash, or path.", "R", "Random pivot in quicksort."),
        concept("Las Vegas algorithm", "Always returns a correct answer, but runtime is random.", "correct with probability 1", "Randomized quicksort."),
        concept("Monte Carlo algorithm", "Has bounded runtime but may return an incorrect approximation or decision.", "Pr(error)<=delta", "Randomized primality-style tests."),
        concept("Amplification", "Independent repetitions reduce failure probability.", "delta^k or concentration bound", "Run a test several times and vote.")
      ],
      formulas: [
        formula("Expected cost", "E[T]=sum_r Pr(R=r) T(r)", "average over internal randomness"),
        formula("Repeated failure", "Pr(all k runs fail)=delta^k", "independent repetition amplifies success"),
        formula("Estimator average", "X_bar=(1/m)sum_i X_i", "sampling reduces estimation noise")
      ],
      caption: "Random choices create a distribution of executions whose correctness and resource use are analyzed probabilistically.",
      flow: [node("Input", "fixed problem instance"), node("Random bits", "sample choices"), node("Algorithm path", "one possible execution"), node("Analyze outcomes", "expected cost and error")],
      learn: ["Distinguish Las Vegas and Monte Carlo algorithms.", "Calculate expected runtime and failure probability.", "Use repetition for amplification.", "Separate random input assumptions from algorithmic randomness."],
      ai: "Sampling, stochastic optimization, randomized search, hashing, sketching, Monte Carlo inference, and exploration are central AI techniques.",
      pitfalls: ["Randomized does not mean unprincipled; guarantees are probability statements.", "Repeated trials must be independent for the simplest amplification formula.", "A fixed random seed improves reproducibility but does not test variation."],
      example: "If one independent test has failure probability 0.1, requiring three tests to fail together reduces failure to 0.1^3=0.001, assuming independence.",
      question: "Which type always gives a correct answer: Las Vegas or Monte Carlo?",
      answer: "Las Vegas. Its runtime may vary, while Monte Carlo trades a bounded error probability for predictable work.",
      resources: [{ label: "Wikipedia: Randomized algorithm", url: "https://en.wikipedia.org/wiki/Randomized_algorithm" }]
    }),

    "online-algorithms": detail({
      idea: "An online algorithm receives input one piece at a time and must make decisions before seeing the future. It is compared with an offline optimum that knows the entire sequence.",
      how: "Define the arrival model, allowed state, and irreversible choices. Analyze performance on every sequence using a competitive ratio, or under a distribution using regret and expected loss.",
      concepts: [
        concept("Online input", "Requests or observations arrive sequentially.", "x_1,x_2,...", "Jobs entering a scheduler."),
        concept("Immediate decision", "The algorithm acts without knowing later inputs.", "a_t based on x_1...x_t", "Place an item into a cache now."),
        concept("Offline optimum", "An ideal benchmark that sees the complete sequence in advance.", "OPT(sigma)", "Best schedule with future knowledge."),
        concept("Competitive ratio", "Worst-case cost relative to the offline optimum.", "ALG(sigma)<=c OPT(sigma)+b", "A c-competitive strategy.")
      ],
      formulas: [
        formula("Competitive guarantee", "ALG(sigma)<=c*OPT(sigma)+b", "online cost compared with clairvoyant optimum"),
        formula("Regret", "R_T=sum_t loss_t(a_t)-min_a sum_t loss_t(a)", "extra loss versus best fixed action"),
        formula("Sublinear regret", "R_T/T -> 0", "average disadvantage vanishes over time")
      ],
      caption: "Each decision uses only the past and present, then performance is compared with a future-aware benchmark.",
      flow: [node("New request", "arrives now"), node("Current state", "past information"), node("Choose action", "future unknown"), node("Evaluate sequence", "competitive ratio or regret")],
      learn: ["Distinguish online from offline algorithms.", "Interpret competitive ratio and regret.", "Identify irreversible and stateful decisions.", "Understand adversarial versus stochastic arrival models."],
      ai: "Online learning, bandits, recommendation, ad serving, streaming, cache management, dynamic pricing, and real-time control all act before future data is known.",
      pitfalls: ["Online does not merely mean connected to the internet.", "A strong offline benchmark has information the online method never receives.", "Good stochastic performance may not imply a good adversarial competitive ratio."],
      example: "In ski rental, renting costs 1 per day and buying costs B. Rent until day B, then buy. Without knowing the season length, this strategy costs less than twice the offline optimum.",
      question: "What does sublinear regret imply about average regret per round?",
      answer: "It approaches zero as the number of rounds grows.",
      resources: [{ label: "Wikipedia: Online algorithm", url: "https://en.wikipedia.org/wiki/Online_algorithm" }]
    })
  };

  const expandedDetails = {};

  Object.assign(expandedDetails, {
    "sets-relations-and-functions": {
      prerequisites: ["Basic algebraic notation.", "Ordered pairs.", "Simple logical statements."],
      notationGuide: [
        { symbol: "x in A", latex: "x\\in A", meaning: "Element x belongs to set A." },
        { symbol: "A subseteq B", latex: "A\\subseteq B", meaning: "Every element of A also belongs to B." },
        { symbol: "A x B", latex: "A\\times B", meaning: "Cartesian product containing ordered pairs from A and B." },
        { symbol: "f:A->B", latex: "f:A\\to B", meaning: "Function with domain A and codomain B." }
      ],
      formulaLatex: ["A\\times B=\\{(a,b):a\\in A,\\ b\\in B\\}", "\\forall a\\in A,\\ \\exists!b\\in B:\\ f(a)=b", "(g\\circ f)(x)=g(f(x))"],
      derivation: { title: "Check whether a relation is a function", steps: ["Write the proposed relation as ordered pairs from domain A to codomain B.", "Group all pairs by their first coordinate.", "Verify that every domain element appears at least once.", "Verify that each domain element has exactly one associated output; only then is the relation a function."] },
      workedExamples: [
        { title: "Set operations", setup: "Let A={1,2,3} and B={3,4}.", steps: ["Union keeps every distinct element.", "Intersection keeps elements appearing in both sets.", "Difference A\\B keeps elements of A not in B."], result: "A union B={1,2,3,4}, A intersection B={3}, and A\\B={1,2}." },
        { title: "Injective but not surjective", setup: "Define f:{1,2}->{a,b,c} by f(1)=a and f(2)=b.", steps: ["Different inputs have different outputs, so f is injective.", "Every input has exactly one output, so f is a function.", "No input maps to c."], result: "f is injective but not surjective onto the stated codomain." }
      ],
      exercises: [
        { level: "Beginner", question: "Is the empty set a subset of every set?", answer: "Yes. There is no element of the empty set that could violate the subset condition." },
        { level: "Intermediate", question: "What distinguishes a bijection?", answer: "It is both injective, so outputs are not shared by distinct inputs, and surjective, so every codomain element is reached." },
        { level: "Applied", question: "Why must a tokenizer-to-ID table be a function?", answer: "Each token must receive one deterministic ID; assigning two IDs to the same token would make downstream lookup ambiguous." }
      ],
      takeaways: ["Sets describe membership without order or duplicates.", "Relations are collections of ordered connections.", "Functions require exactly one output for every domain input.", "Injectivity and surjectivity describe different forms of one-to-one and onto behavior."]
    },
    "boolean-algebra": {
      prerequisites: ["True and false statements.", "Parentheses and operator precedence.", "Reading small tables."],
      notationGuide: [
        { symbol: "AND", latex: "A\\land B", meaning: "True only when both propositions are true." },
        { symbol: "OR", latex: "A\\lor B", meaning: "True when at least one proposition is true." },
        { symbol: "NOT", latex: "\\neg A", meaning: "Logical negation of A." },
        { symbol: "implies", latex: "A\\Rightarrow B", meaning: "Implication from premise A to conclusion B." }
      ],
      formulaLatex: ["\\neg(A\\land B)=(\\neg A)\\lor(\\neg B)", "\\neg(A\\lor B)=(\\neg A)\\land(\\neg B)", "A\\Rightarrow B\\equiv(\\neg A)\\lor B"],
      derivation: { title: "Verify a Boolean identity with a truth table", steps: ["List every possible assignment of truth values to the variables.", "Evaluate the left expression one operator at a time for each row.", "Evaluate the right expression for the same rows.", "If the final columns match in every row, the expressions are logically equivalent."] },
      workedExamples: [
        { title: "Negate an access rule", setup: "Access requires verified AND active.", steps: ["Write the rule V AND A.", "Negate the whole expression.", "Apply De Morgan's law."], result: "Access fails when (NOT V) OR (NOT A): at least one requirement is absent." },
        { title: "Understand implication", setup: "Rule: if a file is private, authentication is required.", steps: ["Let P mean private and A mean authenticated.", "The rule P=>A fails only for P=true, A=false.", "When P is false, the rule makes no claim about A."], result: "Implication is equivalent to (NOT P) OR A." }
      ],
      exercises: [
        { level: "Beginner", question: "When is A AND B true?", answer: "Only when both A and B are true." },
        { level: "Intermediate", question: "Simplify NOT(A AND (B OR C)).", answer: "(NOT A) OR ((NOT B) AND (NOT C))." },
        { level: "Applied", question: "Translate 'run the job when it is scheduled and neither paused nor cancelled.'", answer: "scheduled AND (NOT paused) AND (NOT cancelled)." }
      ],
      takeaways: ["Truth tables provide a mechanical test of equivalence.", "Boolean OR is inclusive unless explicitly stated otherwise.", "De Morgan's laws distribute negation by switching AND and OR.", "Implication is false only when its premise is true and conclusion false."]
    },
    "combinatorics": {
      prerequisites: ["Basic arithmetic.", "Sets and subsets.", "Simple probability examples."],
      notationGuide: [
        { symbol: "n!", latex: "n!", meaning: "Product n(n-1)...1, with 0!=1." },
        { symbol: "P(n,k)", latex: "P(n,k)", meaning: "Ordered selections of k distinct items from n." },
        { symbol: "C(n,k)", latex: "\\binom nk", meaning: "Unordered selections of k distinct items from n." },
        { symbol: "|A|", latex: "|A|", meaning: "Number of elements in finite set A." }
      ],
      formulaLatex: ["n!=n(n-1)\\cdots1", "\\binom nk=\\frac{n!}{k!(n-k)!}", "(a+b)^n=\\sum_{k=0}^n\\binom nk a^{n-k}b^k"],
      derivation: { title: "Derive the combination formula", steps: ["Count ordered choices of k distinct items: n!/(n-k)!.", "Each chosen k-element set appears once for every internal ordering.", "There are k! internal orderings of the same selected set.", "Divide the ordered count by k! to obtain n!/[k!(n-k)!]."] },
      workedExamples: [
        { title: "Feature subsets", setup: "Choose 3 features from 8 without regard to order.", steps: ["Order does not matter, so use a combination.", "Compute 8!/(3!5!).", "Cancel common factors."], result: "There are 56 possible three-feature subsets." },
        { title: "Inclusion-exclusion", setup: "Twenty records have tag A, 15 have tag B, and 6 have both.", steps: ["Adding 20+15 counts shared records twice.", "Subtract the overlap once.", "Compute 20+15-6."], result: "Twenty-nine records have at least one of the tags." }
      ],
      exercises: [
        { level: "Beginner", question: "How many arrangements are there of four distinct objects?", answer: "4!=24." },
        { level: "Intermediate", question: "How many length-3 strings can be formed from 5 symbols when repetition is allowed?", answer: "5^3=125 by the product rule." },
        { level: "Applied", question: "Why is exhaustive subset selection expensive for d features?", answer: "There are 2^d subsets, so the search space doubles with each added feature." }
      ],
      takeaways: ["The first question is whether order matters.", "The second question is whether repetition is allowed.", "Inclusion-exclusion corrects overlap when adding cases.", "Combinatorial growth explains why many discrete searches become infeasible."]
    },
    "graph-theory": {
      prerequisites: ["Sets and ordered pairs.", "Basic data structures.", "Simple path and network intuition."],
      notationGuide: [
        { symbol: "G=(V,E)", latex: "G=(V,E)", meaning: "Graph with vertex set V and edge set E." },
        { symbol: "deg(v)", latex: "\\deg(v)", meaning: "Number of edges incident to vertex v in an undirected graph." },
        { symbol: "N(v)", latex: "N(v)", meaning: "Neighborhood of vertices adjacent to v." },
        { symbol: "w(e)", latex: "w(e)", meaning: "Weight or cost assigned to edge e." }
      ],
      formulaLatex: ["G=(V,E)", "\\sum_{v\\in V}\\deg(v)=2|E|", "\\operatorname{cost}(P)=\\sum_{e\\in P}w(e)"],
      derivation: { title: "Why breadth-first search finds shortest hop paths", steps: ["Place the start vertex in distance layer 0.", "Visit every unvisited neighbor and assign it to the next layer.", "Continue layer by layer using a queue.", "The first visit to a vertex uses the fewest possible edges because all shorter layers were exhausted earlier."] },
      workedExamples: [
        { title: "Degree count", setup: "An undirected graph has vertex degrees 1,2,2,3.", steps: ["Add the degrees to get 8.", "Every edge contributes to two endpoint degrees.", "Divide by two."], result: "The graph has 4 edges." },
        { title: "Weighted versus unweighted path", setup: "Direct edge A-C costs 10; route A-B-C has two edges costing 2 each.", steps: ["By hop count, direct A-C is shorter.", "By total weight, A-B-C costs 4.", "Choose the objective that matches the problem."], result: "The shortest weighted path is A-B-C, despite using more edges." }
      ],
      exercises: [
        { level: "Beginner", question: "What is the degree of a vertex with five incident undirected edges?", answer: "Five." },
        { level: "Intermediate", question: "When is an adjacency list preferable to an adjacency matrix?", answer: "For sparse graphs, because it stores only existing edges and usually uses O(|V|+|E|) space." },
        { level: "Applied", question: "Why does direction matter in a citation graph?", answer: "A paper citing another creates a one-way relation; reversing the edge changes which papers are ancestors, descendants, or reachable." }
      ],
      takeaways: ["Graphs separate entities from relationships.", "Direction and weight change the meaning of paths.", "BFS gives shortest hop paths in unweighted graphs.", "Storage choice should reflect graph density and operations."]
    },
    "trees-and-directed-acyclic-graphs": {
      prerequisites: ["Graph vertices, edges, and paths.", "Recursive structures.", "Dependency ordering."],
      notationGuide: [
        { symbol: "root", latex: "r", meaning: "Chosen starting vertex of a rooted tree." },
        { symbol: "depth(v)", latex: "\\operatorname{depth}(v)", meaning: "Number of tree edges from root to v." },
        { symbol: "|E|=|V|-1", latex: "|E|=|V|-1", meaning: "Edge count for a finite tree." },
        { symbol: "u->v", latex: "u\\to v", meaning: "Directed dependency from u to v." }
      ],
      formulaLatex: ["|E|=|V|-1", "\\text{maximum nodes at depth }d=2^d", "(u,v)\\in E\\Rightarrow\\operatorname{pos}(u)<\\operatorname{pos}(v)"],
      derivation: { title: "Produce a topological order with indegrees", steps: ["Count incoming edges for every vertex.", "Add all zero-indegree vertices to a queue.", "Remove one queued vertex, append it to the order, and decrement its outgoing neighbors' indegrees.", "If every vertex is emitted, the order is valid; otherwise remaining vertices participate in a directed cycle."] },
      workedExamples: [
        { title: "Tree edge count", setup: "A connected hierarchy has 9 vertices and no cycles.", steps: ["A one-vertex tree begins with zero edges.", "Each added vertex needs exactly one edge to remain connected without forming a cycle.", "Eight vertices are added after the first."], result: "The tree has 8 edges." },
        { title: "Task dependency order", setup: "A and B must precede C; C must precede D.", steps: ["A and B initially have indegree zero.", "Choose either first, then the other.", "C becomes available only after both; D follows C."], result: "A,B,C,D and B,A,C,D are both valid topological orders." }
      ],
      exercises: [
        { level: "Beginner", question: "Can a tree contain a cycle?", answer: "No. A tree is connected and acyclic." },
        { level: "Intermediate", question: "Why can a DAG have more than one topological order?", answer: "Vertices with no dependency path between them may be placed in either relative order." },
        { level: "Applied", question: "Why must an automatic differentiation graph be acyclic for a single forward computation?", answer: "Values must be evaluable after their dependencies and gradients traversable in reverse; a dependency cycle would lack a finite starting order unless explicitly unrolled as time steps." }
      ],
      takeaways: ["Trees enforce one connected acyclic structure.", "A rooted tree adds parent, child, and depth relationships.", "DAGs permit multiple parents while forbidding directed cycles.", "Topological order provides a safe dependency evaluation sequence."]
    },
    "recurrence-relations": {
      prerequisites: ["Sequences and functions.", "Algebraic substitution.", "Logarithms and asymptotic notation."],
      notationGuide: [
        { symbol: "a_n", latex: "a_n", meaning: "Sequence value at index n." },
        { symbol: "T(n)", latex: "T(n)", meaning: "Runtime or cost for input size n." },
        { symbol: "base case", latex: "T(1)=c", meaning: "Known starting value anchoring a recurrence." },
        { symbol: "Theta", latex: "\\Theta(g(n))", meaning: "Asymptotically tight growth order." }
      ],
      formulaLatex: ["a_n=a_{n-1}+d", "a_n=ra_{n-1}", "T(n)=aT(n/b)+f(n)"],
      derivation: { title: "Solve a simple additive recurrence", steps: ["Start with a_n=a_{n-1}+d and base value a_0.", "Substitute a_{n-1}=a_{n-2}+d to obtain a_n=a_{n-2}+2d.", "Repeat until reaching a_0 after n substitutions.", "Conclude a_n=a_0+nd and verify it satisfies the recurrence and base case."] },
      workedExamples: [
        { title: "Binary search", setup: "Each comparison halves the remaining input: T(n)=T(n/2)+1.", steps: ["After k steps the size is n/2^k.", "Stop when n/2^k=1.", "Solve k=log_2 n."], result: "T(n)=Theta(log n)." },
        { title: "Repeated subproblems", setup: "Naive Fibonacci recursion calls F(n-1) and F(n-2).", steps: ["Many lower Fibonacci values are computed repeatedly.", "The recursion tree branches at most levels.", "Memoization stores each index once."], result: "Dynamic programming reduces exponential repeated work to linear time." }
      ],
      exercises: [
        { level: "Beginner", question: "Given a_0=3 and a_n=a_(n-1)+2, find a_4.", answer: "11, from 3+4(2)." },
        { level: "Intermediate", question: "What is the growth of T(n)=2T(n/2)+n?", answer: "Theta(n log n), because each of log n levels performs total linear work." },
        { level: "Applied", question: "Why should a recurrence include all necessary base cases?", answer: "Without enough anchored values, repeatedly applying the rule may not determine a unique sequence or may never reach a defined stopping point." }
      ],
      takeaways: ["Base cases and recursive rules jointly define a recurrence.", "Expansion reveals repeated structure.", "Runtime recurrences separate subproblem costs from local work.", "Memoization can remove repeated recursive computation without changing the recurrence's mathematical values."]
    },
    "mathematical-induction": {
      prerequisites: ["Logical implication.", "Integer sequences.", "Algebraic manipulation."],
      notationGuide: [
        { symbol: "P(n)", latex: "P(n)", meaning: "Statement indexed by integer n." },
        { symbol: "n_0", latex: "n_0", meaning: "First integer covered by the claim." },
        { symbol: "P(k)", latex: "P(k)", meaning: "Induction hypothesis for an arbitrary k." },
        { symbol: "P(k+1)", latex: "P(k+1)", meaning: "Next case proved from the hypothesis." }
      ],
      formulaLatex: ["P(n_0)\\land\\forall k\\geq n_0\\,[P(k)\\Rightarrow P(k+1)]", "\\sum_{i=1}^n i=\\frac{n(n+1)}2", "P(n_0)\\land\\cdots\\land P(k)\\Rightarrow P(k+1)"],
      derivation: { title: "Prove the finite-sum formula", steps: ["Verify n=1: the left side is 1 and the formula gives 1(2)/2=1.", "Assume sum from 1 to k equals k(k+1)/2.", "Add k+1 to both descriptions and simplify k(k+1)/2+(k+1).", "Factor to obtain (k+1)(k+2)/2, which is the formula at k+1."] },
      workedExamples: [
        { title: "Divisibility", setup: "Prove 3 divides 4^n-1 for every n>=1.", steps: ["Base: 4-1=3.", "Assume 4^k-1 is divisible by 3.", "Write 4^(k+1)-1=4(4^k-1)+3."], result: "Both terms are divisible by 3, completing the induction step." },
        { title: "Strong induction for postage", setup: "Suppose amounts 12,13,14,15 can be formed using 3- and 4-unit stamps.", steps: ["Use these as base cases.", "For k+1>=16, k-2 is at least 12.", "By the hypothesis form k-2, then add one 3-unit stamp."], result: "Every amount at least 12 can be formed." }
      ],
      exercises: [
        { level: "Beginner", question: "What is the role of the base case?", answer: "It starts the implication chain at the first claimed integer." },
        { level: "Intermediate", question: "Why may k be treated as arbitrary in the inductive step?", answer: "Proving P(k)=>P(k+1) without using special properties of one k establishes the link for every k in the range." },
        { level: "Applied", question: "When is strong induction useful for algorithm proofs?", answer: "When correctness for size n depends on several or any smaller input sizes rather than only size n-1." }
      ],
      takeaways: ["Induction proves an infinite family through a base and a universal step.", "The induction hypothesis is temporary and must be used, not re-proved circularly.", "Multiple base cases may be necessary.", "Strong induction allows the step to use all earlier cases."]
    },
    "proof-by-contradiction": {
      prerequisites: ["Logical negation.", "Implication and equivalence.", "Direct proof basics."],
      notationGuide: [
        { symbol: "P", latex: "P", meaning: "Claim to prove." },
        { symbol: "not P", latex: "\\neg P", meaning: "Temporary assumption opposite to the claim." },
        { symbol: "false", latex: "\\bot", meaning: "Contradiction or impossible proposition." },
        { symbol: "gcd", latex: "\\gcd(a,b)", meaning: "Greatest common divisor, used in the irrationality example." }
      ],
      formulaLatex: ["(\\neg P\\Rightarrow\\bot)\\Rightarrow P", "Q\\land\\neg Q\\equiv\\bot", "\\sqrt2=\\frac ab,\\quad\\gcd(a,b)=1"],
      derivation: { title: "Prove that sqrt(2) is irrational", steps: ["Assume the opposite: sqrt(2)=a/b for integers a,b in lowest terms.", "Square and rearrange to get a^2=2b^2, so a is even; write a=2k.", "Substitute to obtain b^2=2k^2, so b is also even.", "Then a and b share factor 2, contradicting lowest terms; therefore sqrt(2) is irrational."] },
      workedExamples: [
        { title: "No largest integer", setup: "Assume there is a largest integer N.", steps: ["The integer N+1 exists.", "N+1 is greater than N.", "This conflicts with N being largest."], result: "The assumption is impossible, so there is no largest integer." },
        { title: "At most one empty slot", setup: "Assume two supposedly unique empty slots a and b exist with a!=b.", steps: ["Uniqueness says every empty slot equals a.", "Since b is empty, b=a.", "This contradicts a!=b."], result: "There cannot be two distinct objects satisfying the uniqueness condition." }
      ],
      exercises: [
        { level: "Beginner", question: "What assumption begins a contradiction proof of P?", answer: "Assume not P temporarily." },
        { level: "Intermediate", question: "Negate 'every model passes at least one test.'", answer: "There exists a model that passes no tests." },
        { level: "Applied", question: "Why is a failed search for a counterexample not a contradiction proof?", answer: "Not finding an example is not a logical impossibility; a contradiction requires deriving mutually incompatible statements or violating an established fact." }
      ],
      takeaways: ["Contradiction proves a claim by making its negation impossible.", "Negating quantified statements correctly is essential.", "The contradiction must follow through valid reasoning.", "Use direct or contrapositive proof when it communicates the argument more clearly."]
    }
  });

  Object.assign(expandedDetails, {
    "automata-and-formal-languages": {
      prerequisites: ["Sets and functions.", "Strings over finite alphabets.", "Basic state-machine intuition."],
      notationGuide: [
        { symbol: "Sigma", latex: "\\Sigma", meaning: "Finite alphabet of allowed symbols." },
        { symbol: "Sigma star", latex: "\\Sigma^*", meaning: "Set of every finite string over the alphabet." },
        { symbol: "delta", latex: "\\delta", meaning: "State-transition function." },
        { symbol: "F", latex: "F\\subseteq Q", meaning: "Set of accepting states." }
      ],
      formulaLatex: ["\\delta:Q\\times\\Sigma\\to Q", "L(M)=\\{w:\\delta^*(q_0,w)\\in F\\}", "\\Sigma^*=\\bigcup_{n\\geq0}\\Sigma^n"],
      derivation: { title: "Trace a deterministic finite automaton", steps: ["Begin in the designated start state q_0.", "Read the input string from left to right, one symbol at a time.", "Apply delta to the current state and symbol to obtain exactly one next state.", "After the final symbol, accept precisely when the current state belongs to F."] },
      workedExamples: [
        { title: "Binary strings ending in 1", setup: "Use states q0='last symbol is not 1' and q1='last symbol is 1'.", steps: ["Start in q0.", "On symbol 1 move to q1; on 0 move to q0.", "Mark q1 as accepting."], result: "The machine accepts exactly strings whose final symbol is 1." },
        { title: "Balanced parentheses need memory", setup: "Consider arbitrarily deep strings such as (((...))).", steps: ["A recognizer must remember the unmatched opening count.", "That count has no fixed upper bound.", "A finite automaton has only finitely many states."], result: "A pushdown automaton with a stack is required for unrestricted balanced nesting." }
      ],
      exercises: [
        { level: "Beginner", question: "Does Sigma star contain the empty string?", answer: "Yes. It appears in Sigma^0 and is usually written epsilon." },
        { level: "Intermediate", question: "What is the key difference between a DFA and an NFA?", answer: "A DFA has one next state for each state-symbol pair; an NFA may have several possible transitions, yet accepts when at least one path accepts." },
        { level: "Applied", question: "How can formal languages constrain model output?", answer: "A decoder can allow only tokens that keep the partial output inside an automaton or grammar state capable of reaching a valid complete string." }
      ],
      takeaways: ["A language is a set of strings.", "An automaton recognizes membership through state transitions.", "Finite-state memory cannot represent unbounded nesting.", "Grammars and automata provide precise constraints for parsing and generation."]
    },
    "computability": {
      prerequisites: ["Algorithms and termination.", "Formal languages or decision problems.", "Proof by contradiction and reductions."],
      notationGuide: [
        { symbol: "L", latex: "L\\subseteq\\Sigma^*", meaning: "Decision language containing yes-instances." },
        { symbol: "M(w)", latex: "M(w)", meaning: "Machine M executed on input w." },
        { symbol: "HALT", latex: "\\mathrm{HALT}", meaning: "Set of machine-input pairs on which the machine eventually stops." },
        { symbol: "decider", latex: "M_L", meaning: "Machine that halts and answers correctly on every input." }
      ],
      formulaLatex: ["M(w)\\text{ halts for every }w\\text{ and accepts iff }w\\in L", "w\\in L\\Rightarrow M(w)\\text{ accepts}", "\\mathrm{HALT}=\\{(M,w):M\\text{ halts on }w\\}"],
      derivation: { title: "Understand the halting contradiction", steps: ["Assume a total program H(M,w) correctly predicts whether any program M halts on input w.", "Construct D(M) that loops when H(M,M) predicts halt and halts when H predicts loop.", "Run D on its own description D.", "Either prediction forces D to do the opposite, contradicting H's correctness; therefore no universal halting decider exists."] },
      workedExamples: [
        { title: "A decidable graph property", setup: "Decide whether two vertices are connected in a finite graph.", steps: ["Run breadth-first search from the first vertex.", "The finite traversal always terminates.", "Answer yes exactly when the second vertex is visited."], result: "Finite graph reachability is decidable." },
        { title: "Recognizing a halting program", setup: "Given M and w, simulate M(w).", steps: ["If M halts, the simulator eventually observes it and accepts.", "If M never halts, the simulation continues forever.", "The method cannot safely reject after any finite waiting time."], result: "HALT is recognizable even though it is undecidable." }
      ],
      exercises: [
        { level: "Beginner", question: "Must a decider halt on no-instances?", answer: "Yes. A decider halts with a correct yes or no answer on every valid input." },
        { level: "Intermediate", question: "How can a recognizable language differ from a decidable one?", answer: "A recognizer guarantees eventual acceptance for yes-instances but may run forever for no-instances; a decider always terminates." },
        { level: "Applied", question: "Why can a timeout not prove that an arbitrary program never halts?", answer: "The program might halt after the timeout; no finite waiting threshold distinguishes every very slow halting computation from a non-halting one." }
      ],
      takeaways: ["Computability asks whether a total correct algorithm exists at all.", "Undecidable differs fundamentally from merely slow.", "Recognizers may fail to terminate on no-instances.", "Self-reference and reductions reveal limits shared by all general computing systems."]
    },
    "time-and-space-complexity": {
      prerequisites: ["Basic algorithms and loops.", "Functions and logarithms.", "Recurrence relations."],
      notationGuide: [
        { symbol: "n", latex: "n", meaning: "Chosen measure of input size." },
        { symbol: "T(n)", latex: "T(n)", meaning: "Number of time steps as a function of size." },
        { symbol: "S(n)", latex: "S(n)", meaning: "Memory use as a function of size." },
        { symbol: "Theta", latex: "\\Theta(g(n))", meaning: "Matching asymptotic upper and lower growth." }
      ],
      formulaLatex: ["f(n)=O(g(n))\\iff\\exists c,n_0:\\ 0\\leq f(n)\\leq cg(n)\\text{ for }n\\geq n_0", "f(n)=\\Theta(g(n))\\iff f(n)=O(g(n))\\land f(n)=\\Omega(g(n))", "1\\prec\\log n\\prec n\\prec n\\log n\\prec n^2\\prec2^n"],
      derivation: { title: "Analyze a triangular nested loop", steps: ["Suppose outer index i runs from 1 through n.", "For each i, the inner loop executes i times.", "Total work is sum_{i=1}^n i=n(n+1)/2.", "The highest-order term is n^2/2, so the running time is Theta(n^2)."] },
      workedExamples: [
        { title: "Binary search", setup: "Each comparison halves a sorted search interval.", steps: ["After k comparisons at most n/2^k items remain.", "Stop when this quantity is at most one.", "Solve k>=log_2 n."], result: "Worst-case time is Theta(log n) with constant iterative auxiliary space." },
        { title: "Adjacency matrix scan", setup: "A graph with n vertices is stored as an n by n matrix.", steps: ["The matrix contains n^2 cells.", "Scanning every possible edge reads each cell once.", "Storage also retains all cells."], result: "Both scan time and representation space are Theta(n^2)." }
      ],
      exercises: [
        { level: "Beginner", question: "What is the tight growth of 7n+20?", answer: "Theta(n)." },
        { level: "Intermediate", question: "Why is O(n^2) technically true but uninformative for a Theta(n) algorithm?", answer: "Big-O is only an upper bound; n is eventually below n^2, but the looser class hides the sharper linear growth." },
        { level: "Applied", question: "Why can input value and input length produce different complexity statements?", answer: "An integer N needs only about log N bits, so an algorithm polynomial in N may be exponential in the actual encoded input length." }
      ],
      takeaways: ["Complexity requires a clearly defined input-size measure.", "Time and auxiliary space are separate resources.", "O, Omega, and Theta make different claims.", "Asymptotics describe growth, while constants and hardware still matter in practice."]
    },
    "reductions": {
      prerequisites: ["Decision problems.", "Function composition.", "Polynomial-time complexity."],
      notationGuide: [
        { symbol: "A <=p B", latex: "A\\leq_p B", meaning: "A polynomial-time maps to B." },
        { symbol: "f(x)", latex: "f(x)", meaning: "Transformed target-problem instance." },
        { symbol: "iff", latex: "\\Longleftrightarrow", meaning: "Both yes and no answers are preserved." },
        { symbol: "|x|", latex: "|x|", meaning: "Encoded length of source instance x." }
      ],
      formulaLatex: ["x\\in A\\Longleftrightarrow f(x)\\in B", "A\\leq_pB\\land A\\text{ hard}\\Rightarrow B\\text{ hard}", "T_A(n)=T_f(n)+T_B(|f(x)|)"],
      derivation: { title: "Structure a polynomial-time hardness reduction", steps: ["Choose a known hard source problem A and an arbitrary source instance x.", "Construct target instance f(x) in polynomial time.", "Prove both directions: x is yes for A exactly when f(x) is yes for B.", "Conclude that a polynomial solver for B would give one for A, so B is at least as hard."] },
      workedExamples: [
        { title: "Reuse a target solver", setup: "A scheduling instance is encoded as a constraint-satisfaction instance.", steps: ["Create one variable per scheduling decision.", "Add constraints for conflicts and capacities.", "Run a CSP solver and translate its assignment back."], result: "The reduction provides an algorithm for scheduling whenever the constructed CSP can be solved." },
        { title: "Catch the wrong direction", setup: "You want to prove new problem B is hard and show B reduces to known hard A.", steps: ["The mapping says an A solver could solve B.", "That only places B no harder than A.", "It gives no evidence that B can solve A instances."], result: "To prove B hard, reduce known hard A to B." }
      ],
      exercises: [
        { level: "Beginner", question: "What equivalence must a mapping reduction prove?", answer: "x belongs to A if and only if f(x) belongs to B." },
        { level: "Intermediate", question: "If A<=pB and B is in P, what follows?", answer: "A is in P because compute f(x) and then run the polynomial B solver." },
        { level: "Applied", question: "Why must output size be controlled in a polynomial reduction?", answer: "Writing an exponentially large target instance would already take exponential time and would not preserve polynomial solvability." }
      ],
      takeaways: ["A reduction transfers algorithms or hardness through a transformation.", "Correctness requires preserving yes and no instances.", "The reduction direction is central.", "Transformation time and output size are part of the complexity proof."]
    },
    "p-np-np-hard-and-np-complete": {
      prerequisites: ["Decision problems and certificates.", "Polynomial-time algorithms.", "Polynomial reductions."],
      notationGuide: [
        { symbol: "P", latex: "\\mathbf P", meaning: "Decision problems solvable in polynomial time." },
        { symbol: "NP", latex: "\\mathbf{NP}", meaning: "Decision problems with polynomially verifiable yes-certificates." },
        { symbol: "<=p", latex: "\\leq_p", meaning: "Polynomial-time many-one reduction." },
        { symbol: "NPC", latex: "\\mathbf{NP}\\text{-complete}", meaning: "Problems in NP that are also NP-hard." }
      ],
      formulaLatex: ["\\mathbf P\\subseteq\\mathbf{NP}", "L\\in\\mathbf{NP}\\land\\forall A\\in\\mathbf{NP},\\ A\\leq_pL", "\\mathbf P\\stackrel{?}{=}\\mathbf{NP}"],
      derivation: { title: "Prove that a decision problem is NP-complete", steps: ["Show membership in NP by describing a polynomial-size certificate and polynomial-time verifier.", "Choose a known NP-complete problem A.", "Give a polynomial-time reduction from A to the new problem L.", "Prove the reduction's answer equivalence; membership plus hardness establishes NP-completeness."] },
      workedExamples: [
        { title: "Verifying SAT", setup: "A Boolean formula and proposed truth assignment are given.", steps: ["Use the assignment as the certificate.", "Evaluate each variable occurrence and clause.", "Accept when every clause is true."], result: "Verification is polynomial in formula length, so SAT belongs to NP." },
        { title: "Optimization versus decision", setup: "Compare finding the shortest route with deciding whether a route of length at most K exists.", steps: ["The decision version returns yes or no.", "A proposed route can be checked for validity and length.", "The optimization version seeks the best numerical value."], result: "The decision problem may be NP-complete while the optimization problem is described as NP-hard." }
      ],
      exercises: [
        { level: "Beginner", question: "Does NP stand for non-polynomial?", answer: "No. It stands for nondeterministic polynomial time and is commonly characterized by efficient verification." },
        { level: "Intermediate", question: "Why is every problem in P also in NP?", answer: "A verifier can ignore the certificate and directly solve the problem in polynomial time." },
        { level: "Applied", question: "What would a polynomial-time algorithm for one NP-complete problem imply?", answer: "Every NP problem would reduce to it and become polynomially solvable, proving P=NP." }
      ],
      takeaways: ["P concerns efficient solving; NP concerns efficient verification of yes-instances.", "NP-hardness does not require membership in NP.", "NP-completeness combines membership and hardness.", "Whether P equals NP remains open."]
    },
    "approximation-algorithms": {
      prerequisites: ["Optimization objectives.", "Polynomial-time complexity.", "Inequalities and proof techniques."],
      notationGuide: [
        { symbol: "ALG", latex: "\\mathrm{ALG}", meaning: "Objective value returned by the approximation algorithm." },
        { symbol: "OPT", latex: "\\mathrm{OPT}", meaning: "Unknown optimal objective value." },
        { symbol: "rho", latex: "\\rho\\geq1", meaning: "Multiplicative approximation factor." },
        { symbol: "epsilon", latex: "\\varepsilon>0", meaning: "Requested relative accuracy in an approximation scheme." }
      ],
      formulaLatex: ["\\mathrm{ALG}\\leq\\rho\\,\\mathrm{OPT}", "\\mathrm{ALG}\\geq\\frac{\\mathrm{OPT}}{\\rho}", "\\frac{|\\mathrm{ALG}-\\mathrm{OPT}|}{|\\mathrm{OPT}|}\\leq\\varepsilon"],
      derivation: { title: "Prove the classic 2-approximation for vertex cover", steps: ["Choose any uncovered edge (u,v) and add both endpoints to the cover.", "Delete every edge incident to u or v and repeat.", "The selected edges form a matching, so any valid cover needs at least one endpoint per selected edge.", "The algorithm uses two vertices per selected edge, at most twice the optimum cover size."] },
      workedExamples: [
        { title: "Interpret a minimization ratio", setup: "A 1.5-approximation returns a schedule costing 120.", steps: ["The guarantee says ALG<=1.5 OPT.", "Rearrange OPT>=ALG/1.5.", "Compute 120/1.5."], result: "The unknown optimum is at least 80; the result is guaranteed within factor 1.5." },
        { title: "Heuristic without proof", setup: "A clustering method performs well on benchmarks but has no instance-wide bound.", steps: ["Empirical quality describes tested inputs.", "An approximation ratio must hold for every input under assumptions.", "No proof connects its output to OPT."], result: "It is a heuristic, not a guaranteed approximation algorithm." }
      ],
      exercises: [
        { level: "Beginner", question: "For minimization, what does a 2-approximation guarantee?", answer: "Its feasible solution costs at most twice the optimal cost." },
        { level: "Intermediate", question: "How does a PTAS differ from an FPTAS?", answer: "Both achieve 1+epsilon accuracy for fixed epsilon, but an FPTAS is polynomial in both input size and 1/epsilon." },
        { level: "Applied", question: "Why can approximation ratios be awkward for objectives near zero or with negative values?", answer: "Multiplicative comparison may be undefined, unstable, or reverse meaning, so additive or problem-specific guarantees may be more appropriate." }
      ],
      takeaways: ["Approximation algorithms pair efficiency with proved solution quality.", "Minimization and maximization ratios use different inequality directions.", "A heuristic's good average behavior is not a worst-case guarantee.", "Approximation schemes expose an explicit runtime-accuracy tradeoff."]
    },
    "randomized-algorithms": {
      prerequisites: ["Probability and expectation.", "Algorithm correctness.", "Independent events."],
      notationGuide: [
        { symbol: "R", latex: "R", meaning: "Internal random choices made by the algorithm." },
        { symbol: "T(R)", latex: "T(R)", meaning: "Runtime produced by random choice outcome R." },
        { symbol: "delta", latex: "\\delta", meaning: "Failure probability of one Monte Carlo run." },
        { symbol: "X_bar", latex: "\\overline X", meaning: "Average of sampled estimates." }
      ],
      formulaLatex: ["\\mathbb E[T]=\\sum_r\\Pr(R=r)T(r)", "\\Pr(\\text{all }k\\text{ runs fail})=\\delta^k", "\\overline X=\\frac1m\\sum_{i=1}^mX_i"],
      derivation: { title: "Amplify independent success probability", steps: ["Suppose one run fails with probability delta.", "Repeat the run k times using independent random bits.", "The probability that every run fails is the product delta multiplied k times.", "Accepting when any run succeeds reduces failure to delta^k."] },
      workedExamples: [
        { title: "Randomized quicksort", setup: "Choose each pivot uniformly from the current subarray.", steps: ["Every output ordering is correct regardless of pivot choices.", "Random pivots make repeatedly unbalanced splits unlikely.", "Average over the random choices."], result: "It is Las Vegas: always correct, with expected Theta(n log n) time." },
        { title: "Three-run amplification", setup: "One independent test fails with probability 0.05.", steps: ["Run it three times.", "Require all three runs to fail for overall failure.", "Compute 0.05^3."], result: "Overall failure probability is 0.000125 under independence." }
      ],
      exercises: [
        { level: "Beginner", question: "Which randomized type always returns a correct answer?", answer: "A Las Vegas algorithm; its runtime is the random quantity." },
        { level: "Intermediate", question: "Why does reusing the same random seed not provide independent amplification?", answer: "It can reproduce the same random choices and failure event, so the product formula delta^k does not apply." },
        { level: "Applied", question: "What should a reproducible randomized experiment report?", answer: "The random-seed policy, number of independent runs, summary statistics, uncertainty, and any selection performed across seeds." }
      ],
      takeaways: ["Randomness is part of the algorithm and its guarantee.", "Las Vegas randomizes cost; Monte Carlo may randomize correctness.", "Expectation averages over internal random choices for a fixed input.", "Independent repetition can sharply reduce failure probability."]
    },
    "online-algorithms": {
      prerequisites: ["Sequential decisions.", "Optimization losses.", "Asymptotic and worst-case analysis."],
      notationGuide: [
        { symbol: "sigma", latex: "\\sigma", meaning: "Entire input or request sequence." },
        { symbol: "a_t", latex: "a_t", meaning: "Action chosen at round t using only available history." },
        { symbol: "OPT(sigma)", latex: "\\mathrm{OPT}(\\sigma)", meaning: "Offline cost with full knowledge of the sequence." },
        { symbol: "R_T", latex: "R_T", meaning: "Cumulative regret through round T." }
      ],
      formulaLatex: ["\\mathrm{ALG}(\\sigma)\\leq c\\,\\mathrm{OPT}(\\sigma)+b", "R_T=\\sum_{t=1}^T\\ell_t(a_t)-\\min_a\\sum_{t=1}^T\\ell_t(a)", "\\frac{R_T}{T}\\to0"],
      derivation: { title: "Analyze the ski-rental threshold strategy", steps: ["Rent for one unit per day while cumulative rental cost is below purchase price B.", "If the season continues to day B, buy once.", "For a short season, cost equals the offline optimum; for a long season, total cost is at most about 2B.", "Since the long-season offline optimum pays B, the deterministic threshold strategy is 2-competitive up to convention at the boundary."] },
      workedExamples: [
        { title: "Sublinear regret", setup: "An online learner has regret R_T=sqrt(T).", steps: ["Divide by T to obtain average regret.", "R_T/T=1/sqrt(T).", "Take the limit as T grows."], result: "Average regret approaches zero, so performance catches the best fixed action on a per-round basis." },
        { title: "Cache decision", setup: "A cache must evict an item before future requests are known.", steps: ["Use only current cache state and request history.", "Choose an eviction rule such as least recently used.", "Compare misses with a clairvoyant strategy."], result: "Competitive analysis quantifies the cost of lacking future knowledge." }
      ],
      exercises: [
        { level: "Beginner", question: "What information distinguishes an offline optimum?", answer: "It knows the complete future input sequence before making decisions." },
        { level: "Intermediate", question: "What does R_T/T->0 mean?", answer: "The learner's extra loss per round relative to the best fixed comparator vanishes over time." },
        { level: "Applied", question: "Why can an online method perform well stochastically but poorly against an adversary?", answer: "Its guarantees may rely on an input distribution that an adaptive or worst-case sequence violates." }
      ],
      takeaways: ["Online algorithms act without future inputs.", "Competitive ratio compares with a clairvoyant sequence-specific optimum.", "Regret compares cumulative loss with a chosen comparator class.", "Arrival assumptions determine which guarantee is meaningful."]
    }
  });

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
