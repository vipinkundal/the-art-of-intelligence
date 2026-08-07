(function () {
  const details = {
    "scalars-vectors-matrices-and-tensors": {
      simpleIdea: [
        "A scalar, vector, matrix, and tensor are all containers for numbers. The difference is how many directions, or axes, are needed to locate one number inside the container.",
        "Start with the shape. A scalar has no axes, a vector has one, a matrix has two, and a higher-order tensor has three or more. The shape tells you what kind of data the object can hold and which operations are valid."
      ],
      howItWorks: [
        "A model turns real things into numeric containers. One temperature can be a scalar. A person's measurements can be a vector. A grayscale image can be a matrix. A batch of color images can be a four-axis tensor: batch, height, width, and color channel.",
        "An axis has meaning, not just a size. In a matrix with shape 3 x 2, the first axis might identify three examples and the second axis two features. Swapping those axes changes the meaning even though the same six numbers remain."
      ],
      concepts: [
        {
          title: "Scalar",
          explanation: "A scalar is one number. It has magnitude but no list of components. Loss, learning rate, temperature, and a single probability are common scalar values.",
          notation: "a = 3.5",
          example: "A model's validation loss is 0.42. That one value is a scalar."
        },
        {
          title: "Vector",
          explanation: "A vector is an ordered one-dimensional list. Each position usually has a meaning, so changing the order changes the object. A vector can represent a point, a direction, or a collection of features.",
          notation: "x = [2, -1, 4], shape (3,)",
          example: "The vector [height, weight, age] describes one person using three features."
        },
        {
          title: "Matrix",
          explanation: "A matrix is a rectangular table with rows and columns. It can store a dataset, where rows are examples and columns are features, or represent a linear transformation that turns one vector into another.",
          notation: "A = [[1, 2], [3, 4]], shape (2, 2)",
          example: "A table of 100 people and 3 features is a 100 x 3 matrix."
        },
        {
          title: "Tensor",
          explanation: "A tensor is the general name for a multidimensional array. Scalars, vectors, and matrices are tensors of order 0, 1, and 2. In machine learning, tensor often means an array with any number of axes.",
          notation: "X[b, h, w, c], shape (batch, height, width, channels)",
          example: "A batch of 32 RGB images, each 224 x 224 pixels, has shape 32 x 224 x 224 x 3."
        }
      ],
      formulas: [
        { label: "Scalar", expression: "a in R", meaning: "one real number" },
        { label: "Vector", expression: "x in R^n", meaning: "n ordered numbers" },
        { label: "Matrix", expression: "A in R^(m x n)", meaning: "m rows and n columns" },
        { label: "Tensor", expression: "T in R^(d1 x d2 x ... x dk)", meaning: "k axes with the listed sizes" }
      ],
      diagram: {
        caption: "Each step adds one axis for organizing numbers.",
        nodes: [
          { label: "Scalar", detail: "one value" },
          { label: "Vector", detail: "a line of values" },
          { label: "Matrix", detail: "rows x columns" },
          { label: "Tensor", detail: "three or more axes" }
        ]
      },
      whatToLearn: [
        "Read and write the shape of an array.",
        "Explain what every axis represents in a real dataset.",
        "Distinguish mathematical dimension from the number of tensor axes.",
        "Check that shapes are compatible before applying an operation."
      ],
      whyItMatters: [
        "Nearly every AI system stores inputs, parameters, activations, and outputs as tensors. Shape errors are therefore among the most common implementation mistakes.",
        "Understanding the meaning of each axis makes batching, broadcasting, attention, convolution, and reshaping much easier to reason about."
      ],
      pitfalls: [
        "A vector's length is not the same as a tensor's number of axes. A vector with 1,000 entries still has one axis.",
        "A matrix is not only a table of data; it can also be an operation that transforms vectors.",
        "Reshaping preserves numbers but can destroy their intended meaning if axes are mixed carelessly."
      ],
      example: [
        "Suppose one image is 28 x 28 pixels. It is a matrix. A set of 64 such images has shape 64 x 28 x 28: a three-axis tensor. If each image has RGB color, add a channel axis and the batch becomes 64 x 28 x 28 x 3.",
        "The total number of stored values is the product of the axis sizes. The RGB batch holds 64 * 28 * 28 * 3 = 150,528 numbers."
      ],
      practice: {
        question: "A language model receives 8 sentences, each represented by 128 tokens, and gives every token a 768-number embedding. What is the tensor shape?",
        answer: "8 x 128 x 768: batch, token position, and embedding feature."
      },
      resources: [
        { label: "Wikipedia: Tensor", url: "https://en.wikipedia.org/wiki/Tensor" },
        { label: "NumPy: Array objects", url: "https://numpy.org/doc/stable/reference/arrays.html" }
      ]
    },
    "vector-spaces-subspaces-span-basis-and-dimension": {
      simpleIdea: [
        "A vector space is a world in which vectors can be added and scaled without leaving that world. A basis gives the smallest reusable set of directions needed to describe every vector in the space.",
        "These ideas answer three practical questions: Which vectors are allowed? Which directions can generate them? How many independent coordinates are required?"
      ],
      howItWorks: [
        "Take a few vectors and form every possible weighted sum. The set of results is their span. If that span obeys the vector-space rules and lies inside a larger space, it is a subspace.",
        "A basis spans the space without redundant directions. The number of vectors in any basis is the dimension. Coordinates tell you how much of each basis direction is needed."
      ],
      concepts: [
        { title: "Vector space", explanation: "A set of vectors closed under addition and scalar multiplication. Adding two members or scaling one must produce another member of the set.", notation: "u, v in V => u + v in V and c v in V", example: "All 2D vectors form R^2." },
        { title: "Subspace", explanation: "A smaller vector space contained in a larger one. It must contain the zero vector and remain closed under addition and scaling.", notation: "W subset of V", example: "Every point on a line through the origin is a subspace of R^2." },
        { title: "Span", explanation: "The span of some vectors is every linear combination you can build from them.", notation: "span(v1,...,vk) = {c1v1 + ... + ckvk}", example: "[1,0] and [0,1] span the whole 2D plane." },
        { title: "Basis", explanation: "A basis is a set of vectors that spans the space and has no redundant vector.", notation: "B = {b1,...,bd}", example: "[1,0] and [0,1] are the standard basis of R^2." },
        { title: "Dimension", explanation: "Dimension is the number of independent basis directions. Every basis of the same space has the same size.", notation: "dim(R^n) = n", example: "A plane through the origin inside R^3 has dimension 2." }
      ],
      formulas: [
        { label: "Linear combination", expression: "x = c1 v1 + ... + ck vk", meaning: "build x by scaling and adding source vectors" },
        { label: "Coordinates in a basis", expression: "x = sum_i alpha_i b_i", meaning: "alpha_i are x's coordinates in basis B" },
        { label: "Dimension", expression: "dim(V) = number of vectors in a basis of V", meaning: "independent directions required" }
      ],
      diagram: { caption: "Directions generate a space; a basis keeps only the directions that are needed.", nodes: [
        { label: "Candidate vectors", detail: "possible directions" },
        { label: "Remove redundancy", detail: "keep independent vectors" },
        { label: "Basis", detail: "minimal generating set" },
        { label: "Span", detail: "all weighted combinations" }
      ] },
      whatToLearn: ["Test whether a set is a subspace.", "Describe a span as all linear combinations.", "Find coordinates relative to a simple basis.", "Relate basis size to dimension."],
      whyItMatters: ["Feature spaces and embedding spaces are vector spaces. A learned representation often places useful information in a lower-dimensional subspace.", "Basis changes let a model or analysis describe the same data using coordinates that expose structure more clearly."],
      pitfalls: ["A line that does not pass through the origin is not a subspace.", "A spanning set may contain redundant vectors; a basis may not.", "Dimension means independent directions, not the number of data points."],
      example: ["Let v1 = [1, 0] and v2 = [1, 1]. They are independent and span R^2, so they form a basis. To express x = [3, 2], solve x = a v1 + b v2. The second coordinate gives b = 2; the first gives a + b = 3, so a = 1.", "The coordinates of x in this basis are [1, 2], even though its standard coordinates are [3, 2]."],
      practice: { question: "Do [1, 0], [0, 1], and [1, 1] form a basis of R^2?", answer: "No. They span R^2, but the third vector is the sum of the first two, so the set is redundant." },
      resources: [{ label: "MIT OpenCourseWare: Vector spaces and subspaces", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/pages/unit-i-ax-b-and-the-four-subspaces/the-geometry-of-linear-equations/" }]
    },
    "linear-independence": {
      simpleIdea: ["Vectors are linearly independent when each one adds a genuinely new direction. If one vector can be rebuilt from the others, the set is dependent and contains redundant information."],
      howItWorks: ["Place the vectors as columns of a matrix A. Solve Ac = 0. If the only solution is c = 0, the columns are independent. Any nonzero solution gives a recipe for combining the columns to make zero, proving dependence."],
      concepts: [
        { title: "Independent set", explanation: "No vector in the set can be written as a linear combination of the others.", notation: "c1v1 + ... + ckvk = 0 only when every ci = 0", example: "[1,0] and [0,1] are independent." },
        { title: "Dependent set", explanation: "At least one nontrivial weighted combination equals zero, so one direction is redundant.", notation: "Ac = 0 for some c != 0", example: "[1,0], [0,1], and [1,1] are dependent." },
        { title: "Geometric view", explanation: "In 2D, two independent nonzero vectors do not lie on the same line. In 3D, three independent vectors do not lie in the same plane through the origin.", notation: "rank(A) = number of independent columns", example: "Parallel vectors always form a dependent pair." }
      ],
      formulas: [{ label: "Independence test", expression: "Ac = 0 => c = 0", meaning: "the null space contains only the zero coefficients" }, { label: "Column limit", expression: "k > n => k vectors in R^n are dependent", meaning: "there cannot be more than n independent directions in R^n" }],
      diagram: { caption: "A redundant vector adds no new reachable direction.", nodes: [{ label: "v1", detail: "first direction" }, { label: "v2", detail: "new direction" }, { label: "v3 = v1 + v2", detail: "repeated information" }, { label: "Keep v1, v2", detail: "independent basis" }] },
      whatToLearn: ["Recognize dependence from an obvious combination.", "Use row reduction or the null space to test independence.", "Connect independent columns to rank.", "Explain why too many vectors in a low-dimensional space must be dependent."],
      whyItMatters: ["Redundant features can make parameters unidentifiable and numerical calculations unstable. Independent directions help reveal the true degrees of freedom in data.", "Feature selection, PCA, and low-rank methods all ask which directions contain distinct information."],
      pitfalls: ["The zero vector makes any set dependent.", "Orthogonal vectors are independent, but independent vectors do not need to be orthogonal.", "Near dependence can be just as troublesome numerically as exact dependence."],
      example: ["For v1 = [1, 2] and v2 = [2, 4], v2 = 2v1. Therefore 2v1 - v2 = 0 uses nonzero coefficients, so the pair is dependent.", "For v1 = [1, 2] and v2 = [2, 3], no scalar multiple converts one into the other; in R^2 they are independent."],
      practice: { question: "Are [1, 1], [1, -1] independent?", answer: "Yes. Neither is a multiple of the other, and the only solution to c1[1,1] + c2[1,-1] = 0 is c1 = c2 = 0." },
      resources: [{ label: "Wikipedia: Linear independence", url: "https://en.wikipedia.org/wiki/Linear_independence" }]
    },
    "dot-products-and-inner-product-spaces": {
      simpleIdea: ["The dot product turns two vectors into one number that measures how strongly they point in the same direction. An inner product generalizes this idea while preserving the geometry of length and angle."],
      howItWorks: ["Multiply matching components and add the results. A positive result means broad alignment, zero means perpendicular directions, and a negative result means opposition. Divide by both vector lengths to isolate angle from magnitude."],
      concepts: [
        { title: "Dot product", explanation: "The standard inner product for real coordinate vectors. It combines matching components into a scalar.", notation: "x . y = sum_i x_i y_i", example: "[1,2] . [3,4] = 1*3 + 2*4 = 11." },
        { title: "Angle and alignment", explanation: "The dot product equals the product of lengths and the cosine of the angle between vectors.", notation: "x . y = ||x|| ||y|| cos(theta)", example: "Perpendicular nonzero vectors have dot product zero." },
        { title: "Inner-product space", explanation: "A vector space equipped with a valid inner product. The operation must be linear, symmetric for real vectors, and positive on nonzero vectors.", notation: "<x,y>", example: "A weighted inner product can make some coordinates count more than others." }
      ],
      formulas: [{ label: "Dot product", expression: "x . y = sum_i x_i y_i", meaning: "weighted alignment of matching coordinates" }, { label: "Angle", expression: "cos(theta) = (x . y) / (||x||_2 ||y||_2)", meaning: "alignment independent of length" }, { label: "Length from inner product", expression: "||x|| = sqrt(<x,x>)", meaning: "the inner product defines a norm" }],
      diagram: { caption: "The sign and size of a dot product reveal relative direction.", nodes: [{ label: "Same direction", detail: "large positive" }, { label: "Perpendicular", detail: "zero" }, { label: "Opposite direction", detail: "negative" }] },
      whatToLearn: ["Compute a dot product by hand.", "Relate dot product to angle and cosine similarity.", "Recognize orthogonality from a zero dot product.", "Understand that an inner product defines geometry."],
      whyItMatters: ["Attention scores and embedding similarity commonly use dot products. They provide a fast way to measure compatibility between a query and candidate items.", "Many projections, least-squares solutions, and kernel methods are built from inner products."],
      pitfalls: ["A large dot product may come from large vector lengths rather than close directions.", "Zero dot product implies perpendicularity only in the geometry defined by that inner product.", "The dot product requires compatible vector sizes."],
      example: ["Let x = [1, 2] and y = [2, 1]. Their dot product is 4. Both lengths are sqrt(5), so cosine similarity is 4/5 = 0.8. They point in similar, but not identical, directions."],
      practice: { question: "What is [2, -1] . [1, 2], and what does it imply?", answer: "2*1 + (-1)*2 = 0. The vectors are perpendicular under the standard dot product." },
      resources: [{ label: "Wikipedia: Dot product", url: "https://en.wikipedia.org/wiki/Dot_product" }]
    },
    "matrix-multiplication-and-tensor-contraction": {
      simpleIdea: ["Matrix multiplication applies many dot products at once. Tensor contraction is the same matching-and-summing idea applied to arrays with more axes."],
      howItWorks: ["For AB, each output entry takes one row from A and one column from B, multiplies matching values, and sums them. The inner dimensions must match. Tensor contraction likewise chooses matching axes, multiplies along them, and removes those axes by summing."],
      concepts: [
        { title: "Matrix-vector multiplication", explanation: "Each output is the dot product of one matrix row with the input vector. The matrix transforms the vector into a new space.", notation: "y = Ax", example: "A 3 x 2 matrix turns a 2-vector into a 3-vector." },
        { title: "Matrix-matrix multiplication", explanation: "The columns of B are transformed by A, or equivalently each output is a row-column dot product.", notation: "C_ij = sum_k A_ik B_kj", example: "(3 x 2)(2 x 4) produces a 3 x 4 matrix." },
        { title: "Composition", explanation: "Multiplication composes transformations. In ABx, B acts first and A acts second.", notation: "A(Bx) = (AB)x", example: "Two linear neural-network layers without an activation collapse to one matrix." },
        { title: "Tensor contraction", explanation: "Selected axes are paired and summed, generalizing a dot product and matrix multiplication.", notation: "C_ij = sum_k T_ik S_kj", example: "Attention combines token and feature axes using contractions." }
      ],
      formulas: [{ label: "Matrix product", expression: "C_ij = sum_k A_ik B_kj", meaning: "row i of A dotted with column j of B" }, { label: "Shape rule", expression: "(m x n)(n x p) -> (m x p)", meaning: "inner sizes match and disappear" }, { label: "Associativity", expression: "A(BC) = (AB)C", meaning: "grouping may change cost, not the result" }],
      diagram: { caption: "Matching inner axes are multiplied and summed away.", nodes: [{ label: "A: m x n", detail: "rows x shared" }, { label: "B: n x p", detail: "shared x columns" }, { label: "Contract n", detail: "multiply and sum" }, { label: "C: m x p", detail: "remaining axes" }] },
      whatToLearn: ["Check matrix shapes before multiplying.", "Compute one output entry as a dot product.", "Remember that AB usually differs from BA.", "Read a tensor contraction by identifying summed and surviving axes."],
      whyItMatters: ["Dense layers, attention, convolution implementations, and embedding lookups depend heavily on matrix products and tensor contractions.", "Understanding shapes and contraction order helps prevent bugs and can greatly reduce memory and compute cost."],
      pitfalls: ["Matrix multiplication is not elementwise multiplication.", "AB and BA may have different shapes or values.", "A mathematically equivalent contraction order can be much slower or use much more memory."],
      example: ["Let A = [[1,2],[3,4]] and x = [5,6]. The first output is 1*5 + 2*6 = 17; the second is 3*5 + 4*6 = 39. Therefore Ax = [17,39]."],
      practice: { question: "What shape results from multiplying a 32 x 768 batch matrix by a 768 x 128 weight matrix?", answer: "32 x 128. The shared 768 feature axis is contracted." },
      resources: [{ label: "Wikipedia: Matrix multiplication", url: "https://en.wikipedia.org/wiki/Matrix_multiplication" }, { label: "NumPy: einsum", url: "https://numpy.org/doc/stable/reference/generated/numpy.einsum.html" }]
    },
    "norms": {
      simpleIdea: ["A norm turns a vector or matrix into one nonnegative number that describes its size. Different norms emphasize different kinds of size, so the right choice depends on what you want to measure."],
      howItWorks: ["A valid norm is zero only for the zero object, scales with absolute scalar size, and obeys the triangle inequality. L1 adds absolute values, L2 measures straight-line length, Frobenius extends L2 to all matrix entries, and the spectral norm measures maximum amplification."],
      concepts: [
        { title: "L1 norm", explanation: "Adds absolute component values. It treats every unit separately and often encourages sparse solutions.", notation: "||x||_1 = sum_i |x_i|", example: "||[3,-4]||_1 = 7." },
        { title: "L2 norm", explanation: "The ordinary Euclidean length. Squaring large components makes them contribute strongly.", notation: "||x||_2 = sqrt(sum_i x_i^2)", example: "||[3,-4]||_2 = 5." },
        { title: "Frobenius norm", explanation: "The L2 norm of all entries in a matrix, as if the matrix were flattened into one vector.", notation: "||A||_F = sqrt(sum_ij A_ij^2)", example: "For [[1,2],[2,1]], the norm is sqrt(10)." },
        { title: "Spectral norm", explanation: "The largest amount by which a matrix can stretch a unit vector. It equals the largest singular value.", notation: "||A||_2 = sigma_max(A)", example: "It bounds how much a linear layer can amplify an input." }
      ],
      formulas: [{ label: "L1", expression: "||x||_1 = sum_i |x_i|", meaning: "total absolute magnitude" }, { label: "L2", expression: "||x||_2 = sqrt(sum_i x_i^2)", meaning: "straight-line length" }, { label: "Frobenius", expression: "||A||_F = sqrt(sum_ij A_ij^2)", meaning: "entrywise matrix size" }, { label: "Spectral", expression: "||A||_2 = sigma_max(A)", meaning: "maximum input amplification" }],
      diagram: { caption: "The same vector receives different sizes because each norm asks a different question.", nodes: [{ label: "x = [3, -4]", detail: "same vector" }, { label: "L1 = 7", detail: "sum of absolute values" }, { label: "L2 = 5", detail: "Euclidean length" }, { label: "Choose by goal", detail: "sparsity, error, or stability" }] },
      whatToLearn: ["Compute L1 and L2 norms.", "Distinguish vector norms from matrix norms.", "Explain why norm choice changes regularization behavior.", "Use a norm to compare error or parameter size."],
      whyItMatters: ["Norms measure prediction error, constrain model weights, compare embeddings, and control sensitivity. L1 and L2 penalties create different learned models.", "Matrix norms help reason about exploding activations, Lipschitz bounds, and numerical stability."],
      pitfalls: ["Do not call every size measure an L2 norm; specify which norm is used.", "Squaring the L2 norm removes the square root and is not itself a norm.", "Feature scale can dominate a norm unless data is normalized appropriately."],
      example: ["For x = [3,-4], L1 is 7 and L2 is 5. If a penalty uses L1, reducing either coordinate by one lowers the penalty by one. Under squared L2, reducing the larger coordinate has a stronger effect."],
      practice: { question: "What are the L1 and L2 norms of [1, -2, 2]?", answer: "L1 = 1 + 2 + 2 = 5. L2 = sqrt(1 + 4 + 4) = 3." },
      resources: [{ label: "Wikipedia: Norm", url: "https://en.wikipedia.org/wiki/Norm_(mathematics)" }]
    },
    "distance-and-similarity-metrics": {
      simpleIdea: ["Distance says how far apart two objects are. Similarity says how alike they are. The formula you choose defines what 'close' means, so it should match the structure of the data and the task."],
      howItWorks: ["Subtract two vectors, then summarize the difference. Euclidean distance uses L2 length, Manhattan distance uses L1 length, and cosine similarity compares direction after ignoring overall scale."],
      concepts: [
        { title: "Euclidean distance", explanation: "Straight-line distance between two points. Large coordinate differences are emphasized through squaring.", notation: "d(x,y) = ||x-y||_2", example: "Distance from [0,0] to [3,4] is 5." },
        { title: "Manhattan distance", explanation: "Adds absolute coordinate differences, like moving along a city grid.", notation: "d(x,y) = ||x-y||_1", example: "Distance from [0,0] to [3,4] is 7." },
        { title: "Cosine similarity", explanation: "Compares direction rather than magnitude. It ranges from -1 to 1 for real vectors.", notation: "cos(x,y) = x.y / (||x|| ||y||)", example: "[1,1] and [10,10] have cosine similarity 1." },
        { title: "Metric", explanation: "A true distance metric is nonnegative, symmetric, zero only for identical points, and obeys the triangle inequality.", notation: "d(x,z) <= d(x,y) + d(y,z)", example: "Cosine similarity itself is not a distance metric." }
      ],
      formulas: [{ label: "Euclidean", expression: "sqrt(sum_i (x_i-y_i)^2)", meaning: "straight-line distance" }, { label: "Manhattan", expression: "sum_i |x_i-y_i|", meaning: "coordinate-by-coordinate distance" }, { label: "Cosine", expression: "(x.y)/(||x||_2 ||y||_2)", meaning: "directional similarity" }],
      diagram: { caption: "Different measures can rank the same pair differently.", nodes: [{ label: "Two vectors", detail: "x and y" }, { label: "Subtract", detail: "coordinate differences" }, { label: "Choose geometry", detail: "L1, L2, or angle" }, { label: "Score", detail: "distance or similarity" }] },
      whatToLearn: ["Compute Euclidean, Manhattan, and cosine values.", "Know whether a measure is scale-sensitive.", "Normalize features when units differ.", "Choose a metric that matches the downstream meaning of similarity."],
      whyItMatters: ["Nearest-neighbor search, clustering, retrieval, recommendation, and embedding evaluation all depend on a similarity choice.", "The wrong metric can make irrelevant scale or noisy coordinates dominate supposedly similar examples."],
      pitfalls: ["Cosine similarity is undefined for a zero vector.", "High-dimensional distances can become less informative as values concentrate.", "Comparing age in years with income in dollars without scaling lets income dominate Euclidean distance."],
      example: ["For x = [1,0] and y = [2,1], Euclidean distance is sqrt(2). Their cosine similarity is 2/sqrt(5), about 0.894. The vectors are separated in position but point in fairly similar directions."],
      practice: { question: "Why are [1,2] and [10,20] maximally cosine-similar but far apart in Euclidean distance?", answer: "They point in exactly the same direction, but the second vector is ten times longer. Cosine ignores that scale; Euclidean distance does not." },
      resources: [{ label: "Wikipedia: Metric space", url: "https://en.wikipedia.org/wiki/Metric_space" }, { label: "Wikipedia: Cosine similarity", url: "https://en.wikipedia.org/wiki/Cosine_similarity" }]
    },
    "orthogonality-and-orthonormal-bases": {
      simpleIdea: ["Orthogonal vectors meet at a right angle and have zero dot product. An orthonormal basis uses mutually orthogonal unit vectors, giving a clean coordinate system with no overlap between directions."],
      howItWorks: ["First make directions perpendicular, then divide each by its length. In an orthonormal basis, the coordinate along a basis vector is simply a dot product. The Gram-Schmidt process converts an independent set into an orthonormal one."],
      concepts: [
        { title: "Orthogonality", explanation: "Two vectors are orthogonal when their inner product is zero. They carry independent geometric directions under that inner product.", notation: "u . v = 0", example: "[1,0] and [0,1] are orthogonal." },
        { title: "Unit vector", explanation: "A vector with length one. Normalization keeps direction and removes magnitude.", notation: "u_hat = u / ||u||", example: "[3,4] becomes [3/5,4/5]." },
        { title: "Orthonormal basis", explanation: "Every basis vector has unit length and every distinct pair is orthogonal.", notation: "q_i . q_j = 1 if i=j, otherwise 0", example: "The columns of an orthogonal matrix form an orthonormal basis." },
        { title: "Gram-Schmidt", explanation: "A procedure that removes from each new vector the components already explained by earlier directions, then normalizes the remainder.", notation: "u2 = v2 - proj_u1(v2)", example: "It is the conceptual basis of QR factorization." }
      ],
      formulas: [{ label: "Orthogonal", expression: "u . v = 0", meaning: "no component along the other direction" }, { label: "Normalize", expression: "u_hat = u / ||u||_2", meaning: "same direction with unit length" }, { label: "Orthonormal matrix", expression: "Q^T Q = I", meaning: "columns are orthonormal" }],
      diagram: { caption: "Orthonormal directions separate information cleanly.", nodes: [{ label: "Independent vectors", detail: "useful but overlapping" }, { label: "Remove projections", detail: "make perpendicular" }, { label: "Normalize", detail: "make unit length" }, { label: "Q^T Q = I", detail: "orthonormal basis" }] },
      whatToLearn: ["Test orthogonality with a dot product.", "Normalize a nonzero vector.", "Recognize Q^TQ = I.", "Explain the idea behind Gram-Schmidt."],
      whyItMatters: ["Orthogonal features avoid repeated information and make numerical methods more stable. PCA directions and the U and V factors in SVD are orthonormal.", "Orthogonal transformations preserve lengths and angles, which helps control signal size through a computation."],
      pitfalls: ["Orthogonal does not mean unit length.", "The zero vector is orthogonal to every vector but cannot be a basis vector.", "Classical Gram-Schmidt can lose numerical accuracy; practical libraries use stable QR algorithms."],
      example: ["For u = [1,1] and v = [1,-1], u.v = 1 - 1 = 0. Each has length sqrt(2). Dividing both by sqrt(2) gives an orthonormal basis of R^2."],
      practice: { question: "Is [2,0] and [0,3] an orthonormal set?", answer: "They are orthogonal, but not orthonormal because their lengths are 2 and 3 rather than 1." },
      resources: [{ label: "Wikipedia: Orthonormal basis", url: "https://en.wikipedia.org/wiki/Orthonormal_basis" }]
    },
    "projections": {
      simpleIdea: ["A projection keeps the part of a vector that points along a chosen direction or subspace and discards the perpendicular remainder. It is the mathematical version of casting a shadow."],
      howItWorks: ["Measure alignment with a dot product, divide by the direction's squared length, and scale the direction by that amount. For a subspace with orthonormal basis columns Q, the projection is QQ^T x."],
      concepts: [
        { title: "Projection onto a vector", explanation: "Finds the closest point to x along the line generated by u.", notation: "proj_u(x) = (x.u / u.u)u", example: "Projecting [3,2] onto [1,0] gives [3,0]." },
        { title: "Projection onto a subspace", explanation: "Keeps all components lying in a multi-directional subspace.", notation: "x_hat = Q Q^T x", example: "A plane projection keeps two orthonormal basis components." },
        { title: "Residual", explanation: "The discarded difference between the original vector and its projection. It is orthogonal to the target subspace.", notation: "r = x - x_hat", example: "Least squares chooses a prediction whose residual is orthogonal to the feature columns." }
      ],
      formulas: [{ label: "Vector projection", expression: "proj_u(x) = ((x.u)/(u.u))u", meaning: "component of x along u" }, { label: "Orthonormal subspace", expression: "P = QQ^T; x_hat = Px", meaning: "projection using orthonormal basis Q" }, { label: "Projection matrix", expression: "P^2 = P", meaning: "projecting twice changes nothing" }],
      diagram: { caption: "The original vector splits into an explained component and a perpendicular residual.", nodes: [{ label: "x", detail: "original vector" }, { label: "Projection", detail: "part inside subspace" }, { label: "Residual", detail: "perpendicular remainder" }, { label: "x = x_hat + r", detail: "complete decomposition" }] },
      whatToLearn: ["Project a vector onto one direction.", "Explain why the residual is perpendicular.", "Use QQ^T for an orthonormal subspace.", "Connect projection to closest-point problems."],
      whyItMatters: ["Least squares, PCA, dimensionality reduction, and attention-like decompositions rely on projections.", "Projection separates signal captured by a representation from information left unexplained."],
      pitfalls: ["The short formula x_hat = uu^T x assumes u has unit length.", "Projection onto a subspace differs from simply deleting coordinates unless that subspace is axis-aligned.", "An oblique projection need not produce the nearest point; orthogonal projection does."],
      example: ["Project x = [3,2] onto u = [1,1]. The coefficient is (3+2)/(1+1) = 2.5, so the projection is [2.5,2.5]. The residual [0.5,-0.5] has dot product zero with u."],
      practice: { question: "Project [4,3] onto the x-axis.", answer: "Using u = [1,0], the projection is [4,0] and the residual is [0,3]." },
      resources: [{ label: "Wikipedia: Vector projection", url: "https://en.wikipedia.org/wiki/Vector_projection" }]
    },
    "rank-and-null-space": {
      simpleIdea: ["Rank counts how many independent output directions a matrix can create. The null space contains every input direction the matrix completely erases."],
      howItWorks: ["Row-reduce the matrix or inspect its singular values. Pivot columns reveal rank. Solving Ax = 0 reveals the null space. For a matrix with n input columns, rank plus nullity always equals n."],
      concepts: [
        { title: "Column space", explanation: "Every output Ax is a combination of A's columns. Their span is the set of reachable outputs.", notation: "Col(A) = {Ax}", example: "If columns lie on one line, every output lies on that line." },
        { title: "Rank", explanation: "The dimension of the column space, equal to the number of independent columns and independent rows.", notation: "rank(A)", example: "A 3 x 5 matrix can have rank at most 3." },
        { title: "Null space", explanation: "All inputs mapped to zero. These directions are invisible to the transformation.", notation: "Null(A) = {x : Ax = 0}", example: "If two input features have identical columns, changing them in opposite directions may lie in the null space." },
        { title: "Rank-nullity", explanation: "Input dimensions split into preserved independent directions and erased directions.", notation: "rank(A) + nullity(A) = n", example: "A rank-2 matrix with 5 columns has a 3-dimensional null space." }
      ],
      formulas: [{ label: "Rank-nullity", expression: "rank(A) + dim(Null(A)) = number of columns", meaning: "every input direction is visible or erased" }, { label: "Full column rank", expression: "rank(A) = n", meaning: "Ax = 0 has only x = 0" }, { label: "Rank bound", expression: "rank(A) <= min(m,n)", meaning: "independent directions cannot exceed either matrix dimension" }],
      diagram: { caption: "A linear map preserves some input directions and collapses the rest.", nodes: [{ label: "Input space", detail: "n directions" }, { label: "Null space", detail: "erased by A" }, { label: "Column space", detail: "reachable outputs" }, { label: "Rank + nullity", detail: "accounts for all input directions" }] },
      whatToLearn: ["Find rank using pivots.", "Solve Ax = 0 for a null-space basis.", "Use the rank-nullity theorem.", "Connect full rank to uniqueness or invertibility."],
      whyItMatters: ["Rank reveals effective model capacity and redundancy. The null space reveals parameter or input changes that do not affect an output.", "Low rank appears in compression, collaborative filtering, adapters, and efficient approximations."],
      pitfalls: ["Rank is not normally the number of nonzero entries.", "Tiny singular values may behave like zero in finite-precision computation.", "Row space and column space have equal dimension but live in different coordinate spaces."],
      example: ["For A = [[1,2],[2,4]], the second row and second column are multiples of the first, so rank(A)=1. Solving Ax=0 gives x1 + 2x2=0, so the null space is spanned by [-2,1]. Rank 1 plus nullity 1 equals 2 columns."],
      practice: { question: "A 4 x 7 matrix has rank 3. What is its nullity?", answer: "7 - 3 = 4, because rank plus nullity equals the number of input columns." },
      resources: [{ label: "Wikipedia: Rank-nullity theorem", url: "https://en.wikipedia.org/wiki/Rank%E2%80%93nullity_theorem" }]
    },
    "trace-and-determinant": {
      simpleIdea: ["Trace adds a square matrix's diagonal entries. Determinant measures signed volume scaling. Both compress a whole matrix into one scalar, but they describe different properties."],
      howItWorks: ["Trace is a direct sum. A 2 x 2 determinant uses ad-bc; larger determinants can be computed by elimination or factorization. A zero determinant means the transformation collapses at least one dimension and is not invertible."],
      concepts: [
        { title: "Trace", explanation: "The sum of diagonal entries. It also equals the sum of eigenvalues, counting multiplicity.", notation: "tr(A) = sum_i A_ii", example: "tr([[2,1],[3,4]]) = 2 + 4 = 6." },
        { title: "Determinant", explanation: "The factor by which a square matrix scales oriented volume. Its sign records an orientation flip.", notation: "det(A)", example: "A determinant of -2 doubles area and flips orientation." },
        { title: "Invertibility", explanation: "A square matrix is invertible exactly when its determinant is nonzero.", notation: "det(A) != 0", example: "A zero determinant means some nonzero direction is collapsed." }
      ],
      formulas: [{ label: "Trace", expression: "tr(A) = sum_i A_ii", meaning: "sum of diagonal action" }, { label: "2 x 2 determinant", expression: "det([[a,b],[c,d]]) = ad - bc", meaning: "signed area scale" }, { label: "Product", expression: "det(AB) = det(A)det(B)", meaning: "volume scales multiply under composition" }],
      diagram: { caption: "Determinant describes what a transformation does to area or volume.", nodes: [{ label: "Unit square", detail: "area 1" }, { label: "Apply A", detail: "stretch, shear, rotate" }, { label: "Parallelogram", detail: "area |det(A)|" }, { label: "det(A)=0", detail: "collapsed dimension" }] },
      whatToLearn: ["Compute trace and a 2 x 2 determinant.", "Interpret determinant as volume scaling.", "Use determinant to test square-matrix invertibility.", "Know trace and determinant identities without confusing their roles."],
      whyItMatters: ["Log determinants appear in Gaussian likelihoods, normalizing flows, and change-of-variable formulas. Trace identities simplify matrix derivatives and expectations.", "Determinants are conceptually useful, though numerical code often uses stable factorizations or log-determinants instead of direct computation."],
      pitfalls: ["Trace and determinant are defined this way for square matrices.", "A tiny nonzero determinant can still indicate severe numerical instability.", "Do not compute large determinants by recursive expansion in real applications."],
      example: ["For A = [[2,1],[0,3]], trace(A)=5 and det(A)=6. The transformation scales area by 6. Since the determinant is nonzero, A is invertible."],
      practice: { question: "For A = [[1,2],[2,4]], find trace and determinant. What does the determinant imply?", answer: "Trace is 5 and determinant is 1*4 - 2*2 = 0, so A is not invertible and collapses a direction." },
      resources: [{ label: "Wikipedia: Determinant", url: "https://en.wikipedia.org/wiki/Determinant" }, { label: "Wikipedia: Trace", url: "https://en.wikipedia.org/wiki/Trace_(linear_algebra)" }]
    },
    "positive-semidefinite-matrices": {
      simpleIdea: ["A positive-semidefinite matrix never assigns a negative value to the quadratic expression x^T A x. It behaves like a generalized squared length, which is why it naturally describes variance, similarity, and curvature."],
      howItWorks: ["For a real symmetric matrix A, test every direction x through x^T A x. If the result is always at least zero, A is positive semidefinite. Equivalently, all eigenvalues are nonnegative."],
      concepts: [
        { title: "Quadratic form", explanation: "The scalar x^T A x measures how A acts along direction x.", notation: "q(x) = x^T A x", example: "For A=I, q(x)=||x||_2^2." },
        { title: "Positive semidefinite", explanation: "A symmetric matrix whose quadratic form is never negative. Zero is allowed in some directions.", notation: "A >= 0 iff x^T A x >= 0 for all x", example: "A covariance matrix is always PSD." },
        { title: "Positive definite", explanation: "A stronger condition: the quadratic form is strictly positive for every nonzero x.", notation: "x^T A x > 0 for x != 0", example: "A positive-definite matrix has positive eigenvalues and is invertible." },
        { title: "Gram matrix", explanation: "A matrix of pairwise inner products. Every Gram matrix is PSD because it can be written X^T X.", notation: "G = X^T X", example: "Kernel matrices are designed to be Gram-like PSD matrices." }
      ],
      formulas: [{ label: "PSD test", expression: "x^T A x >= 0 for every x", meaning: "no direction has negative quadratic value" }, { label: "Eigenvalue test", expression: "lambda_i(A) >= 0", meaning: "symmetric A is PSD exactly when all eigenvalues are nonnegative" }, { label: "Gram form", expression: "A = B^T B", meaning: "automatically positive semidefinite" }],
      diagram: { caption: "Equivalent views make PSD matrices easier to recognize.", nodes: [{ label: "A = B^T B", detail: "Gram construction" }, { label: "x^T A x >= 0", detail: "nonnegative energy" }, { label: "lambda_i >= 0", detail: "nonnegative spectrum" }, { label: "Covariance / kernels", detail: "common applications" }] },
      whatToLearn: ["Evaluate a quadratic form.", "Distinguish semidefinite from definite.", "Use symmetry and eigenvalues to test PSD.", "Recognize covariance and Gram matrices as PSD."],
      whyItMatters: ["Covariance matrices, kernel matrices, Gauss-Newton approximations, and many curvature matrices are PSD.", "The condition guarantees nonnegative variance or squared distance and supports convex quadratic objectives."],
      pitfalls: ["PSD normally assumes a real symmetric or complex Hermitian matrix.", "Nonnegative entries do not guarantee a matrix is PSD.", "A PSD matrix can be singular because zero eigenvalues are allowed."],
      example: ["Let A = [[1,1],[1,1]]. Then x^T A x = (x1+x2)^2, which is never negative, so A is PSD. It is not positive definite because x=[1,-1] gives zero."],
      practice: { question: "Why is X^T X always PSD?", answer: "For any v, v^T X^T X v = (Xv)^T(Xv) = ||Xv||_2^2, which cannot be negative." },
      resources: [{ label: "Wikipedia: Positive-semidefinite matrix", url: "https://en.wikipedia.org/wiki/Definite_matrix" }]
    },
    "eigenvalues-and-eigenvectors": {
      simpleIdea: ["Most vectors change both length and direction when a matrix acts on them. An eigenvector is a special direction that keeps its line; its eigenvalue says how that direction is stretched, shrunk, or flipped."],
      howItWorks: ["Solve Av=lambda v for nonzero v. Rearranging gives (A-lambda I)v=0, which has a nonzero solution only when det(A-lambda I)=0. Each resulting lambda has one or more associated eigenvectors."],
      concepts: [
        { title: "Eigenvector", explanation: "A nonzero direction preserved by a square linear transformation. The output stays parallel to the input.", notation: "Av = lambda v, v != 0", example: "For a diagonal matrix, coordinate axes are eigenvectors." },
        { title: "Eigenvalue", explanation: "The scale factor applied along an eigenvector. Negative values flip direction; zero values collapse it.", notation: "lambda", example: "lambda=2 doubles the eigenvector; lambda=-1 flips it." },
        { title: "Eigenspace", explanation: "All eigenvectors for one eigenvalue, together with zero, form a subspace.", notation: "Null(A-lambda I)", example: "Repeated eigenvalues can have more than one independent eigenvector." },
        { title: "Spectrum", explanation: "The collection of a matrix's eigenvalues. It summarizes key transformation behavior.", notation: "spectrum(A)", example: "The largest eigenvalue can govern long-run growth in repeated multiplication." }
      ],
      formulas: [{ label: "Eigen equation", expression: "Av = lambda v", meaning: "v keeps its direction under A" }, { label: "Characteristic equation", expression: "det(A - lambda I) = 0", meaning: "find possible eigenvalues" }, { label: "Trace and determinant", expression: "sum lambda_i = tr(A); product lambda_i = det(A)", meaning: "spectrum connects to matrix summaries" }],
      diagram: { caption: "A general direction turns, while an eigenvector remains on its original line.", nodes: [{ label: "Input v", detail: "special direction" }, { label: "Apply A", detail: "linear transformation" }, { label: "Output lambda v", detail: "same line" }, { label: "lambda", detail: "stretch, shrink, or flip" }] },
      whatToLearn: ["Verify an eigenpair by multiplication.", "Find eigenvalues of a small 2 x 2 matrix.", "Interpret positive, negative, and zero eigenvalues.", "Connect eigenvalues to repeated transformations."],
      whyItMatters: ["PCA uses eigenvectors of a covariance matrix. Spectral clustering, graph methods, stability analysis, and initialization also use eigenvalues.", "Eigenvectors reveal directions in which a transformation behaves simply, making complex dynamics easier to understand."],
      pitfalls: ["The zero vector is never an eigenvector.", "Not every real matrix has real eigenvalues or enough eigenvectors to form a basis.", "Eigenvectors can be rescaled; the direction, not a particular length, is what matters."],
      example: ["For A=[[2,0],[0,3]], e1=[1,0] is an eigenvector with eigenvalue 2 and e2=[0,1] has eigenvalue 3. Repeated multiplication by A makes the second direction grow faster."],
      practice: { question: "For A=[[4,0],[0,1]], what happens to v=[0,2]?", answer: "Av=[0,2]=1v, so v is an eigenvector with eigenvalue 1 and is unchanged." },
      resources: [{ label: "Wikipedia: Eigenvalues and eigenvectors", url: "https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors" }]
    },
    "eigendecomposition": {
      simpleIdea: ["Eigendecomposition rewrites a matrix using its special directions. It changes into an eigenvector coordinate system, scales each coordinate independently, and changes back."],
      howItWorks: ["Put independent eigenvectors into the columns of V and their eigenvalues on the diagonal of Lambda. Then A=V Lambda V^-1. This works only when A has enough independent eigenvectors to be diagonalizable."],
      concepts: [
        { title: "Diagonalization", explanation: "A complicated matrix becomes diagonal in its eigenvector basis, so directions no longer mix.", notation: "A = V Lambda V^-1", example: "Lambda stores one scale per eigenvector." },
        { title: "Change of basis", explanation: "V^-1 converts standard coordinates to eigenvector coordinates; V converts back.", notation: "x -> V^-1 x -> Lambda V^-1 x -> V Lambda V^-1 x", example: "The middle step is only coordinate-wise scaling." },
        { title: "Symmetric case", explanation: "A real symmetric matrix has an orthonormal eigenbasis, making the decomposition especially stable and simple.", notation: "A = Q Lambda Q^T", example: "Covariance matrices use this form." },
        { title: "Matrix powers", explanation: "Powers become easy because only diagonal eigenvalues are raised to a power.", notation: "A^k = V Lambda^k V^-1", example: "Useful for repeated dynamics or Markov transitions." }
      ],
      formulas: [{ label: "General", expression: "A = V Lambda V^-1", meaning: "eigenvectors, diagonal scaling, inverse basis change" }, { label: "Symmetric", expression: "A = Q Lambda Q^T", meaning: "orthonormal eigenvectors make Q^-1 = Q^T" }, { label: "Power", expression: "A^k = V Lambda^k V^-1", meaning: "raise each eigenvalue to k" }],
      diagram: { caption: "Diagonalization separates a transformation into three understandable steps.", nodes: [{ label: "V^-1", detail: "enter eigenbasis" }, { label: "Lambda", detail: "scale coordinates" }, { label: "V", detail: "return to original basis" }, { label: "A", detail: "complete transformation" }] },
      whatToLearn: ["Build V and Lambda from eigenpairs.", "Explain decomposition as a basis change.", "Know when diagonalization may fail.", "Use the symmetric form Q Lambda Q^T."],
      whyItMatters: ["Eigendecomposition powers PCA, spectral graph methods, covariance analysis, and linear dynamical systems.", "It exposes long-term behavior: eigenvalues larger than one grow, smaller than one decay, and negative values alternate direction."],
      pitfalls: ["Some matrices are not diagonalizable.", "Repeated or nearly repeated eigenvalues can make numerical eigenvectors sensitive.", "For nonsymmetric data matrices, SVD is often the safer and more general tool."],
      example: ["For diagonal A=[[2,0],[0,3]], V=I and Lambda=A. Then A^4=[[16,0],[0,81]]. The second eigen-direction dominates repeated applications."],
      practice: { question: "Why is eigendecomposition especially simple for a real symmetric matrix?", answer: "Its eigenvectors can be chosen orthonormal, so V^-1 is just V^T and all eigenvalues are real." },
      resources: [{ label: "Wikipedia: Eigendecomposition", url: "https://en.wikipedia.org/wiki/Eigendecomposition_of_a_matrix" }]
    },
    "singular-value-decomposition": {
      simpleIdea: ["SVD describes any matrix as a rotation or reflection, followed by independent stretching, followed by another rotation or reflection. It reveals the matrix's strongest input-output directions."],
      howItWorks: ["Factor A as U Sigma V^T. Columns of V are input directions, singular values in Sigma are nonnegative stretch amounts, and columns of U are the corresponding output directions. Unlike eigendecomposition, SVD works for rectangular matrices."],
      concepts: [
        { title: "Right singular vectors", explanation: "Orthonormal input directions in the columns of V.", notation: "v_i", example: "They are eigenvectors of A^T A." },
        { title: "Singular values", explanation: "Nonnegative strengths sorted from largest to smallest. Zero values mark erased directions.", notation: "sigma_1 >= sigma_2 >= ... >= 0", example: "The number of nonzero singular values equals rank." },
        { title: "Left singular vectors", explanation: "Orthonormal output directions in U produced when A acts on right singular vectors.", notation: "A v_i = sigma_i u_i", example: "They are eigenvectors of AA^T." },
        { title: "Geometric action", explanation: "V^T reorients inputs, Sigma stretches axes, and U places the result in output space.", notation: "A = U Sigma V^T", example: "A circle becomes an ellipse whose semiaxes have lengths sigma_i." }
      ],
      formulas: [{ label: "SVD", expression: "A = U Sigma V^T", meaning: "output directions x strengths x input directions" }, { label: "Singular pair", expression: "A v_i = sigma_i u_i", meaning: "input direction maps to scaled output direction" }, { label: "Rank", expression: "rank(A) = number of sigma_i > 0", meaning: "nonzero transformation directions" }],
      diagram: { caption: "SVD follows the path of a vector through three simple operations.", nodes: [{ label: "V^T", detail: "align input directions" }, { label: "Sigma", detail: "stretch each axis" }, { label: "U", detail: "orient output directions" }, { label: "A", detail: "works for rectangular matrices" }] },
      whatToLearn: ["Name the roles of U, Sigma, and V.", "Read rank from singular values.", "Connect SVD to A^T A and AA^T.", "Explain why truncating SVD compresses data."],
      whyItMatters: ["SVD supports PCA, low-rank approximation, denoising, pseudoinverses, latent semantic analysis, and model compression.", "Singular values also expose sensitivity: a very small minimum singular value signals a poorly conditioned transformation."],
      pitfalls: ["SVD is not limited to square matrices.", "Singular values are nonnegative, unlike eigenvalues.", "Signs of singular vectors are not unique; flipping matching columns of U and V leaves A unchanged."],
      example: ["For A=[[3,0],[0,1]], U=I, V=I, and Sigma=diag(3,1). The matrix stretches the x direction three times and leaves the y direction unchanged."],
      practice: { question: "If a matrix has singular values [9, 2, 0, 0], what is its rank?", answer: "Rank 2, because exactly two singular values are nonzero." },
      resources: [{ label: "Wikipedia: Singular value decomposition", url: "https://en.wikipedia.org/wiki/Singular_value_decomposition" }]
    },
    "low-rank-approximation": {
      simpleIdea: ["Low-rank approximation replaces a large matrix with a simpler matrix that keeps its strongest patterns. It trades a controlled amount of detail for less storage, less noise, and faster computation."],
      howItWorks: ["Compute the SVD and retain only the top k singular values and their singular vectors. The truncated product A_k=U_k Sigma_k V_k^T is the best rank-k approximation under Frobenius and spectral norms."],
      concepts: [
        { title: "Rank-k model", explanation: "A matrix expressed using only k independent latent directions.", notation: "A_k = U_k Sigma_k V_k^T", example: "A million-entry matrix may be represented by two much smaller factor matrices." },
        { title: "Truncated SVD", explanation: "Discard smaller singular components and keep the first k strongest ones.", notation: "sigma_1,...,sigma_k", example: "Small singular values often capture weak detail or noise." },
        { title: "Reconstruction error", explanation: "The information lost by approximation. Under Frobenius norm, squared error is the sum of discarded squared singular values.", notation: "||A-A_k||_F^2 = sum_(i>k) sigma_i^2", example: "A rapid singular-value drop suggests a compact approximation." },
        { title: "Factorized storage", explanation: "Store U_k Sigma_k and V_k^T instead of every entry of A.", notation: "O(k(m+n)) instead of O(mn)", example: "Useful when k is much smaller than m and n." }
      ],
      formulas: [{ label: "Rank-k approximation", expression: "A_k = U_k Sigma_k V_k^T", meaning: "keep top k singular components" }, { label: "Frobenius error", expression: "||A-A_k||_F^2 = sum_(i>k) sigma_i^2", meaning: "energy in discarded directions" }, { label: "Storage", expression: "mn -> k(m+n+1)", meaning: "factor storage when k is small" }],
      diagram: { caption: "Compression keeps dominant structure and drops weak components.", nodes: [{ label: "Full matrix A", detail: "many entries" }, { label: "SVD", detail: "ordered components" }, { label: "Keep top k", detail: "strongest patterns" }, { label: "A_k", detail: "compact approximation" }] },
      whatToLearn: ["Construct the idea of truncated SVD.", "Choose k using singular values or validation performance.", "Compute reconstruction error from discarded singular values.", "Compare full and factorized storage."],
      whyItMatters: ["Low-rank structure is used in recommender systems, PCA, denoising, efficient fine-tuning, and neural-network compression.", "It can expose latent factors, such as user tastes or semantic directions, that explain many observed entries."],
      pitfalls: ["Low rank is useful only when singular values decay enough.", "The best matrix reconstruction may not be best for the downstream task.", "Choosing k too small removes signal; choosing it too large preserves noise and cost."],
      example: ["Suppose singular values are [10,3,0.2,0.1]. A rank-2 approximation keeps 10 and 3. Its squared Frobenius error is 0.2^2+0.1^2=0.05, small compared with the retained energy 109."],
      practice: { question: "A 1000 x 1000 matrix is approximated with rank 10. Roughly how many factor entries are stored instead of one million?", answer: "About 10*(1000+1000+1) = 20,010 entries, ignoring small implementation details." },
      resources: [{ label: "Wikipedia: Low-rank approximation", url: "https://en.wikipedia.org/wiki/Low-rank_approximation" }]
    },
    "sparse-matrices": {
      simpleIdea: ["A sparse matrix contains mostly zeros. Instead of storing every zero, a sparse representation stores only nonzero values and where they occur."],
      howItWorks: ["Formats such as COO store row, column, and value triples. CSR groups nonzero values by row for fast row operations. The right sparse algorithm computes only with stored entries, reducing work from the full matrix size to the number of nonzeros."],
      concepts: [
        { title: "Sparsity", explanation: "The fraction of entries that are zero. A matrix can be enormous in shape but cheap to store when few entries are nonzero.", notation: "density = nnz/(m n)", example: "A word-document matrix has zeros for almost every absent word." },
        { title: "COO format", explanation: "Stores a list of (row, column, value) triples. It is simple to construct and combine.", notation: "rows[], cols[], values[]", example: "Entry 5 at position (2,7) is stored as one triple." },
        { title: "CSR format", explanation: "Compressed Sparse Row stores nonzero values, their column indices, and pointers marking where each row starts.", notation: "data, indices, indptr", example: "Efficient for matrix-vector multiplication row by row." },
        { title: "Sparse operations", explanation: "Algorithms must preserve sparsity to gain speed. Some operations create many nonzeros, called fill-in.", notation: "cost often O(nnz)", example: "Adding a dense bias can make a sparse result dense." }
      ],
      formulas: [{ label: "Density", expression: "density = nnz / (m*n)", meaning: "fraction of stored positions that are nonzero" }, { label: "Sparsity", expression: "sparsity = 1 - density", meaning: "fraction of zero entries" }, { label: "Sparse matvec", expression: "cost approximately O(nnz)", meaning: "work follows nonzeros rather than all m*n positions" }],
      diagram: { caption: "Sparse storage replaces a mostly empty grid with a compact list of useful entries.", nodes: [{ label: "Large matrix", detail: "mostly zeros" }, { label: "Find nonzeros", detail: "positions and values" }, { label: "COO / CSR", detail: "compressed structure" }, { label: "Sparse kernels", detail: "skip zero work" }] },
      whatToLearn: ["Calculate density and sparsity.", "Understand COO and CSR at a high level.", "Estimate memory from nonzero count.", "Recognize operations that destroy sparsity."],
      whyItMatters: ["Text counts, graphs, recommender interactions, and one-hot features are often sparse. Efficient storage can turn an impossible dataset into a manageable one.", "Sparse models and activations can reduce computation, but only when hardware and kernels exploit the pattern."],
      pitfalls: ["A sparse representation has index overhead and may be slower for moderately dense small matrices.", "Random unstructured sparsity is harder for hardware to accelerate than structured sparsity.", "Converting between dense and sparse formats can erase performance gains."],
      example: ["A 1,000,000 x 100,000 matrix has 100 billion possible entries. At 0.001% density it has only one million nonzeros, so sparse storage is practical while dense storage is not."],
      practice: { question: "A 100 x 200 matrix contains 400 nonzero values. What are its density and sparsity?", answer: "Density is 400/20,000 = 0.02 or 2%. Sparsity is 98%." },
      resources: [{ label: "SciPy: Sparse arrays", url: "https://docs.scipy.org/doc/scipy/tutorial/sparse.html" }]
    },
    "matrix-calculus": {
      simpleIdea: ["Matrix calculus extends derivatives to functions whose inputs or outputs are vectors and matrices. It tracks how every output changes when every parameter changes."],
      howItWorks: ["Start by writing shapes. Differentiate a scalar loss with respect to each component, then arrange the results in an agreed layout. Use differentials and the chain rule to handle products and compositions without expanding every index."],
      concepts: [
        { title: "Gradient of a scalar", explanation: "For a scalar function of a vector, the gradient collects one partial derivative per input component and points toward fastest increase.", notation: "grad_x f in R^n", example: "For f=x^T x, grad_x f=2x." },
        { title: "Matrix derivative", explanation: "For a scalar loss depending on a matrix, the derivative has the same shape as the matrix under common ML conventions.", notation: "dL/dW in R^(m x n)", example: "Every entry tells how L changes when one weight changes." },
        { title: "Differential", explanation: "The differential expresses a small output change caused by a small input change and makes algebraic rearrangement easier.", notation: "df = grad_x f ^T dx", example: "Rewrite dL as tr(G^T dW) to identify gradient G." },
        { title: "Chain rule", explanation: "For composed operations, local derivatives multiply in the order required by their shapes.", notation: "dL/dx = (dy/dx)^T dL/dy", example: "Backpropagation is repeated application of this rule." }
      ],
      formulas: [{ label: "Quadratic", expression: "grad_x (x^T A x) = (A + A^T)x", meaning: "for symmetric A this becomes 2Ax" }, { label: "Linear map", expression: "y = Wx => dL/dW = (dL/dy) x^T", meaning: "weight gradient is an outer product" }, { label: "Squared error", expression: "grad_x ||Ax-b||_2^2 = 2A^T(Ax-b)", meaning: "map residual back through A^T" }],
      diagram: { caption: "Shapes flow forward; sensitivities flow backward through transposed local maps.", nodes: [{ label: "x: n", detail: "input" }, { label: "W: m x n", detail: "parameters" }, { label: "y = Wx: m", detail: "output" }, { label: "L: scalar", detail: "loss and backward gradients" }] },
      whatToLearn: ["Write the shape of every derivative.", "Differentiate basic linear and quadratic forms.", "Use differentials or index notation to verify a result.", "Apply the chain rule through a matrix operation."],
      whyItMatters: ["Training neural networks requires gradients of scalar losses with respect to millions or billions of matrix parameters.", "Shape-aware matrix calculus makes backpropagation understandable and helps detect transposes, broadcasting errors, and missing reduction factors."],
      pitfalls: ["Derivative layout conventions differ between textbooks; state the convention and check shapes.", "Matrix multiplication order matters in derivatives.", "Broadcasting and batch averaging introduce sums or scale factors that component-free formulas can hide."],
      example: ["Let y=Wx and L=1/2||y-t||^2. First dL/dy=y-t. Then dL/dW=(y-t)x^T and dL/dx=W^T(y-t). Each result has the same shape as the variable it differentiates."],
      practice: { question: "If W is 4 x 3, x is length 3, and L is scalar, what are the shapes of dL/dW and dL/dx?", answer: "dL/dW is 4 x 3 and dL/dx is length 3." },
      resources: [{ label: "The Matrix Calculus You Need for Deep Learning", url: "https://explained.ai/matrix-calculus/" }]
    },
    "jacobians-and-hessians": {
      simpleIdea: ["A Jacobian records first-order sensitivity when a vector produces a vector. A Hessian records second-order curvature when a scalar function depends on a vector."],
      howItWorks: ["The Jacobian places derivative of output i with respect to input j at entry (i,j). The Hessian differentiates the gradient again, so entry (i,j) shows how two input directions interact in the local curvature."],
      concepts: [
        { title: "Jacobian", explanation: "A matrix of all first partial derivatives for f:R^n to R^m. It is the best local linear approximation of f.", notation: "J_ij = partial f_i / partial x_j", example: "A 5-output function of 3 inputs has a 5 x 3 Jacobian." },
        { title: "Jacobian-vector product", explanation: "Computes how the output changes along one input direction without forming the full Jacobian.", notation: "Jv", example: "Forward-mode automatic differentiation computes Jv efficiently." },
        { title: "Hessian", explanation: "A square matrix of second derivatives for a scalar function. It describes local curvature.", notation: "H_ij = partial^2 f / partial x_i partial x_j", example: "Positive eigenvalues indicate upward curvature along their directions." },
        { title: "Hessian-vector product", explanation: "Measures curvature along a chosen direction without storing the full n x n Hessian.", notation: "Hv", example: "Useful in second-order optimization and curvature diagnostics." }
      ],
      formulas: [{ label: "Local linearization", expression: "f(x + dx) approximately f(x) + J dx", meaning: "Jacobian predicts first-order output change" }, { label: "Second-order expansion", expression: "f(x+d) approximately f(x) + g^T d + 1/2 d^T H d", meaning: "Hessian adds curvature" }, { label: "Shapes", expression: "J: m x n; H: n x n", meaning: "for f:R^n->R^m and scalar loss h:R^n->R" }],
      diagram: { caption: "First derivatives describe slope; second derivatives describe how that slope changes.", nodes: [{ label: "Inputs x", detail: "n variables" }, { label: "Jacobian J", detail: "first-order sensitivity" }, { label: "Gradient g", detail: "scalar output slope" }, { label: "Hessian H", detail: "curvature of g" }] },
      whatToLearn: ["Build a small Jacobian component by component.", "Interpret Jv as directional output change.", "Build a small Hessian and read its curvature.", "Know why full Hessians are expensive in large models."],
      whyItMatters: ["Jacobians appear in backpropagation, sensitivity analysis, normalizing flows, and neural tangent methods. Hessians describe loss-landscape curvature and support Newton-like methods.", "Vector products let modern autodiff systems use this information without materializing enormous derivative matrices."],
      pitfalls: ["A gradient is not generally a Jacobian of the same shape when the output is vector-valued.", "Hessians are symmetric only under suitable smoothness conditions.", "A positive diagonal does not by itself guarantee a positive-definite Hessian."],
      example: ["For f(x1,x2)=[x1^2, x1x2], J=[[2x1,0],[x2,x1]]. At [1,3], J=[[2,0],[3,1]]. A small move v=[0.1,0] predicts output change Jv=[0.2,0.3]."],
      practice: { question: "What is the Hessian of f(x)=x1^2+3x2^2?", answer: "H=[[2,0],[0,6]]. The function curves upward more strongly along x2." },
      resources: [{ label: "Wikipedia: Jacobian matrix and determinant", url: "https://en.wikipedia.org/wiki/Jacobian_matrix_and_determinant" }, { label: "Wikipedia: Hessian matrix", url: "https://en.wikipedia.org/wiki/Hessian_matrix" }]
    },
    "kronecker-products": {
      simpleIdea: ["The Kronecker product builds one large block matrix from two smaller matrices. Every entry of the first matrix scales a complete copy of the second."],
      howItWorks: ["If A is m x n and B is p x q, replace each A_ij with the block A_ij B. The result has shape mp x nq. This preserves repeated structure that would be tedious to write entry by entry."],
      concepts: [
        { title: "Block construction", explanation: "Each scalar in A becomes a scaled block shaped like B.", notation: "A tensor_product B = [A_ij B]", example: "A 2 x 2 matrix and a 2 x 3 matrix create a 4 x 6 matrix." },
        { title: "Shape multiplication", explanation: "Row counts multiply and column counts multiply.", notation: "(m x n) tensor_product (p x q) -> (mp x nq)", example: "3 x 4 with 2 x 5 produces 6 x 20." },
        { title: "Structured operators", explanation: "Kronecker products express operations repeated across grids, batches, or independent dimensions.", notation: "I tensor_product B", example: "I tensor_product B applies B independently to several blocks." },
        { title: "Vectorization identity", explanation: "A matrix sandwich can be represented as one large linear operation on the flattened matrix.", notation: "vec(AXB) = (B^T tensor_product A) vec(X)", example: "Useful in matrix equations and structured curvature approximations." }
      ],
      formulas: [{ label: "Shape", expression: "A(m x n) tensor_product B(p x q) has shape (mp x nq)", meaning: "dimensions multiply" }, { label: "Mixed product", expression: "(A tensor_product B)(C tensor_product D) = AC tensor_product BD", meaning: "when component shapes match" }, { label: "Transpose", expression: "(A tensor_product B)^T = A^T tensor_product B^T", meaning: "transpose each factor" }],
      diagram: { caption: "Each entry of A controls one full copy of B.", nodes: [{ label: "A", detail: "small coefficient grid" }, { label: "B", detail: "reusable block" }, { label: "Scale B by A_ij", detail: "one block per entry" }, { label: "A tensor_product B", detail: "large structured matrix" }] },
      whatToLearn: ["Construct a small Kronecker product by hand.", "Predict the output shape.", "Recognize repeated block structure.", "Distinguish Kronecker product from ordinary matrix multiplication."],
      whyItMatters: ["Kronecker structure appears in separable kernels, covariance models, tensor grids, quantum systems, and approximate neural-network curvature.", "Keeping factors separate can reduce storage and computation dramatically compared with materializing the full matrix."],
      pitfalls: ["The Kronecker product is not elementwise multiplication.", "Order matters: A tensor_product B is generally not B tensor_product A.", "The full product can become enormous, so exploit factor structure instead of constructing it when possible."],
      example: ["For A=[[1,2],[0,3]] and B=[[1,0],[0,-1]], A tensor_product B has blocks B, 2B, 0B, and 3B arranged in a 2 x 2 block grid."],
      practice: { question: "What is the shape of a Kronecker product between a 3 x 2 matrix and a 4 x 5 matrix?", answer: "12 x 10, because rows are 3*4 and columns are 2*5." },
      resources: [{ label: "Wikipedia: Kronecker product", url: "https://en.wikipedia.org/wiki/Kronecker_product" }]
    },
    "einstein-summation": {
      simpleIdea: ["Einstein summation is a compact language for tensor operations. Repeated index labels are multiplied and summed; labels that appear only in the output remain as output axes."],
      howItWorks: ["Name tensor axes with letters. When a letter appears in two inputs but not the output, contract over it. When a letter survives in the output, keep that axis. Libraries such as NumPy and PyTorch make the output labels explicit with an arrow."],
      concepts: [
        { title: "Index labels", explanation: "Letters name logical axes rather than fixed positions. Matching letters mean matching dimensions.", notation: "A_ik B_kj", example: "k is the shared matrix-multiplication axis." },
        { title: "Contraction", explanation: "A repeated label is multiplied across inputs and summed away.", notation: "C_ij = sum_k A_ik B_kj", example: "Matrix multiplication contracts k." },
        { title: "Free indices", explanation: "Labels that are not summed identify output axes.", notation: "ij remain in C_ij", example: "The result keeps A's row i and B's column j." },
        { title: "Einsum notation", explanation: "A string states input axis labels and desired output labels directly.", notation: "'ik,kj->ij'", example: "The expression performs matrix multiplication." }
      ],
      formulas: [{ label: "Dot product", expression: "'i,i->'", meaning: "multiply corresponding vector entries and sum" }, { label: "Matrix multiplication", expression: "'ik,kj->ij'", meaning: "contract shared k axis" }, { label: "Batch matrix multiplication", expression: "'bij,bjk->bik'", meaning: "preserve batch b while contracting j" }, { label: "Trace", expression: "'ii->'", meaning: "sum a matrix diagonal" }],
      diagram: { caption: "Read an einsum by marking which labels disappear and which survive.", nodes: [{ label: "ik, kj", detail: "input labels" }, { label: "k repeats", detail: "multiply and sum" }, { label: "i and j survive", detail: "output axes" }, { label: "ij", detail: "result labels" }] },
      whatToLearn: ["Translate dot product and matrix multiplication into einsum.", "Identify contracted and free indices.", "Track batch axes explicitly.", "Predict result shape from output labels."],
      whyItMatters: ["Einstein notation makes attention, tensor contractions, bilinear layers, and scientific models easier to express and verify.", "It can replace chains of transpose, reshape, multiply, and sum operations with one shape-aware expression."],
      pitfalls: ["A repeated label must refer to dimensions of equal size.", "Accidentally omitting a label from the output sums it away.", "A concise einsum is not automatically the fastest contraction order; inspect performance for large tensors."],
      example: ["For Q with shape batch x tokens x features and K with the same shape, 'btf,bsf->bts' computes every token-to-token dot product within each batch. Feature f is contracted; batch b and token axes t,s remain."],
      practice: { question: "What does 'ij,j->i' compute?", answer: "A matrix-vector product. It contracts the matrix's column axis j with the vector axis j and keeps row axis i." },
      resources: [{ label: "NumPy: einsum", url: "https://numpy.org/doc/stable/reference/generated/numpy.einsum.html" }]
    },
    "numerical-conditioning": {
      simpleIdea: ["Conditioning asks whether a small change in input can cause a large change in output. A well-conditioned problem is robust; an ill-conditioned problem magnifies measurement noise and rounding error."],
      howItWorks: ["For an invertible matrix, the condition number is the ratio of largest to smallest singular value. A large ratio means some directions are stretched much more than others, so recovering an input from the output is sensitive."],
      concepts: [
        { title: "Condition number", explanation: "A scale-free sensitivity measure. Values near 1 are favorable; very large values indicate potential instability.", notation: "kappa_2(A) = sigma_max / sigma_min", example: "kappa=10^8 can lose many digits of accuracy." },
        { title: "Ill-conditioning", explanation: "The mathematical problem itself amplifies small perturbations, even with a correct algorithm.", notation: "relative output error approximately <= kappa * relative input error", example: "Nearly dependent columns make least squares sensitive." },
        { title: "Numerical stability", explanation: "A property of an algorithm: it avoids adding much more error than the problem's conditioning requires.", notation: "stable algorithm + conditioned problem", example: "Solving Ax=b by factorization is safer than explicitly computing A^-1." },
        { title: "Regularization", explanation: "Adding a controlled penalty can reduce sensitivity by preventing division by extremely small directions.", notation: "A^T A + lambda I", example: "Ridge regression stabilizes correlated features." }
      ],
      formulas: [{ label: "2-norm condition", expression: "kappa_2(A) = sigma_max(A) / sigma_min(A)", meaning: "ratio of strongest to weakest stretch" }, { label: "Ideal case", expression: "kappa(A) >= 1", meaning: "1 means equal scaling in all directions" }, { label: "Regularized system", expression: "(A^T A + lambda I)x = A^T b", meaning: "lambda protects weak directions" }],
      diagram: { caption: "A nearly collapsed direction makes inversion amplify tiny errors.", nodes: [{ label: "Input + tiny noise", detail: "measurement or rounding" }, { label: "Ill-conditioned A", detail: "uneven directional scaling" }, { label: "Solve or invert", detail: "weak direction amplified" }, { label: "Large output error", detail: "unstable answer" }] },
      whatToLearn: ["Interpret a condition number.", "Connect small singular values to sensitivity.", "Separate problem conditioning from algorithm stability.", "Use scaling, regularization, or stable factorization to reduce trouble."],
      whyItMatters: ["Training and inference use finite-precision arithmetic. Poor conditioning can produce noisy gradients, unstable least-squares fits, slow optimization, and unreliable parameter estimates.", "Normalization, residual connections, regularization, and careful solvers partly exist to control scale and sensitivity."],
      pitfalls: ["A correct formula can still produce a poor numerical answer.", "Explicit matrix inversion is usually unnecessary and less stable than solving a system.", "Condition numbers depend on the chosen norm and on feature scaling."],
      example: ["If singular values are 100 and 0.001, kappa_2=100,000. A relative input error around 10^-6 may lead to output error as large as about 10^-1 in the worst direction."],
      practice: { question: "Matrix A has singular values 8, 2, and 0.5. What is its 2-norm condition number?", answer: "8/0.5 = 16. It is less sensitive than a matrix whose smallest singular value is near zero." },
      resources: [{ label: "Wikipedia: Condition number", url: "https://en.wikipedia.org/wiki/Condition_number" }]
    }
  };

  const expandedDetails = {
    "scalars-vectors-matrices-and-tensors": {
      prerequisites: ["Comfort with ordinary numbers and arithmetic.", "The idea of an axis or coordinate.", "Reading a small table of values."],
      notationGuide: [{ symbol: "a", latex: "a", meaning: "A scalar: one number." }, { symbol: "x in R^n", latex: "x\\in\\mathbb{R}^n", meaning: "A vector with n real-valued entries." }, { symbol: "A in R^(m x n)", latex: "A\\in\\mathbb{R}^{m\\times n}", meaning: "A matrix with m rows and n columns." }, { symbol: "T[i,j,k]", latex: "T_{ijk}", meaning: "One entry selected from a third-order tensor." }],
      formulaLatex: ["a\\in\\mathbb{R}", "x\\in\\mathbb{R}^n", "A\\in\\mathbb{R}^{m\\times n}", "T\\in\\mathbb{R}^{d_1\\times d_2\\times\\cdots\\times d_k}"],
      derivation: { title: "Build higher-order objects by adding axes", steps: ["Start with a scalar such as temperature 21.5; it needs no index.", "Record temperatures for four hours as a vector x_i; one index selects an hour.", "Record four hours for three cities as a matrix A_ij; row and column indices select city and hour.", "Add seven days as a third axis T_ijk. The data did not become mysterious; it simply gained another independent index."] },
      workedExamples: [{ title: "Choose the correct shape", setup: "A batch contains 32 RGB images of height 64 and width 64.", steps: ["Batch is one axis of length 32.", "Height and width contribute axes of length 64.", "RGB contributes a channel axis of length 3."], result: "A common shape is 32 x 64 x 64 x 3, a fourth-order tensor." }, { title: "Read a matrix entry", setup: "Let A contain two students' scores on three tests.", steps: ["Rows identify students.", "Columns identify tests.", "A_23 means row 2, column 3."], result: "A_23 is the second student's score on the third test." }],
      exercises: [{ level: "Beginner", question: "Classify 7, [7,2], and [[7,2],[1,4]] as scalar, vector, or matrix.", answer: "They are a scalar, a length-2 vector, and a 2 x 2 matrix." }, { level: "Intermediate", question: "What shape stores 100 grayscale images of size 28 x 28 if channel is explicit?", answer: "100 x 28 x 28 x 1: batch, height, width, channel." }, { level: "Applied", question: "A language model stores embeddings for 8 sequences, 128 tokens each, with width 512. Identify the tensor shape and meaning of each axis.", answer: "8 x 128 x 512: batch item, token position, embedding feature." }],
      takeaways: ["Order counts independent axes; it does not measure importance.", "Shape records the length of every axis.", "A tensor generalizes scalars, vectors, and matrices.", "Always name axes before manipulating data."]
    },
    "vector-spaces-subspaces-span-basis-and-dimension": {
      prerequisites: ["Vectors and scalar multiplication.", "Adding coordinate vectors.", "Solving simple linear equations."],
      notationGuide: [{ symbol: "V", latex: "V", meaning: "A vector space." }, { symbol: "U subseteq V", latex: "U\\subseteq V", meaning: "A candidate subspace inside V." }, { symbol: "span(v1,...,vk)", latex: "\\operatorname{span}(v_1,\\ldots,v_k)", meaning: "Every linear combination of the listed vectors." }, { symbol: "dim(V)", latex: "\\dim(V)", meaning: "The number of vectors in any basis of V." }],
      formulaLatex: ["x=c_1v_1+\\cdots+c_kv_k", "x=\\sum_i\\alpha_i b_i", "\\dim(V)=\\lvert\\text{a basis of }V\\rvert"],
      derivation: { title: "Test whether a set is a subspace", steps: ["Check that the zero vector belongs to the set.", "Take arbitrary u and v in the set and verify u+v stays in it.", "Take any scalar c and verify cu stays in it.", "If all three conditions hold, every linear combination remains in the set, so it is a subspace."] },
      workedExamples: [{ title: "Span a plane", setup: "Use v1=(1,0,0) and v2=(0,1,0).", steps: ["A combination av1+bv2 equals (a,b,0).", "The third coordinate is always zero.", "Every point with z=0 can be produced."], result: "The span is the xy-plane, a two-dimensional subspace of R^3." }, { title: "Reject a shifted line", setup: "Consider S={(x,y): y=2x+1}.", steps: ["A subspace must contain (0,0).", "At x=0 the rule requires y=1.", "Therefore (0,0) is absent."], result: "S is a line but not a subspace because it is shifted away from the origin." }],
      exercises: [{ level: "Beginner", question: "What is span((1,0),(0,1)) in R^2?", answer: "All of R^2, because (a,b)=a(1,0)+b(0,1)." }, { level: "Intermediate", question: "Is {(x,y,z): x+y+z=0} a subspace?", answer: "Yes. It contains zero and is closed under addition and scalar multiplication." }, { level: "Applied", question: "Why can a learned embedding basis be changed without changing the represented subspace?", answer: "Different independent coordinate directions can span the same set of representable vectors; coordinates change, but the subspace does not." }],
      takeaways: ["A vector space is closed under linear combinations.", "A span is every vector reachable from chosen generators.", "A basis is independent and spanning.", "Dimension counts independent directions, not stored coordinates alone."]
    },
    "linear-independence": {
      prerequisites: ["Linear combinations.", "Homogeneous systems Ac=0.", "Basic geometric directions."],
      notationGuide: [{ symbol: "c1v1+...+ckvk=0", latex: "c_1v_1+\\cdots+c_kv_k=0", meaning: "A linear combination producing zero." }, { symbol: "c=0", latex: "c=0", meaning: "Every coefficient is zero." }, { symbol: "Null(A)", latex: "\\operatorname{Null}(A)", meaning: "Coefficient vectors mapped to zero." }],
      formulaLatex: ["Ac=0\\implies c=0", "k>n\\implies\\{v_1,\\ldots,v_k\\}\\text{ is dependent in }\\mathbb{R}^n"],
      derivation: { title: "Turn independence into a linear system", steps: ["Place candidate vectors as columns of A.", "Write c1v1+...+ckvk=0 as Ac=0.", "Row-reduce A or inspect its null space.", "Only c=0 means independent; any nonzero solution gives an exact redundancy relation."] },
      workedExamples: [{ title: "Independent directions", setup: "Test (1,0) and (1,1).", steps: ["Solve c1(1,0)+c2(1,1)=(0,0).", "The second coordinate gives c2=0.", "Then the first gives c1=0."], result: "Only the trivial coefficients work, so the vectors are independent." }, { title: "Find the dependency", setup: "Test (1,0), (0,1), and (1,1).", steps: ["Observe (1,1)=(1,0)+(0,1).", "Rearrange v1+v2-v3=0.", "The coefficients (1,1,-1) are nonzero."], result: "The three vectors are dependent." }],
      exercises: [{ level: "Beginner", question: "Are (2,4) and (1,2) independent?", answer: "No. The first is twice the second." }, { level: "Intermediate", question: "Find a dependency among (1,0,1), (0,1,1), and (1,1,2).", answer: "v1+v2-v3=0." }, { level: "Applied", question: "What problem can nearly dependent features cause in regression?", answer: "Coefficients become sensitive and hard to identify because several feature combinations explain almost the same direction." }],
      takeaways: ["Independence means no vector is redundant.", "A nonzero null-space coefficient proves dependence.", "At most n vectors can be independent in R^n.", "Near dependence matters numerically even without exact dependence."]
    },
    "dot-products-and-inner-product-spaces": {
      prerequisites: ["Vector coordinates.", "Vector length and square roots.", "Basic angle intuition."],
      notationGuide: [{ symbol: "x dot y", latex: "x^\\top y", meaning: "Euclidean dot product." }, { symbol: "<x,y>", latex: "\\langle x,y\\rangle", meaning: "A general inner product." }, { symbol: "||x||", latex: "\\lVert x\\rVert", meaning: "Length induced by an inner product." }, { symbol: "theta", latex: "\\theta", meaning: "Angle between nonzero vectors." }],
      formulaLatex: ["x^\\top y=\\sum_i x_i y_i", "\\cos\\theta=\\frac{x^\\top y}{\\lVert x\\rVert_2\\lVert y\\rVert_2}", "\\lVert x\\rVert=\\sqrt{\\langle x,x\\rangle}"],
      derivation: { title: "Recover the angle formula", steps: ["The law of cosines gives ||x-y||^2=||x||^2+||y||^2-2||x||||y||cos(theta).", "Expanding (x-y)^T(x-y) gives ||x||^2+||y||^2-2x^Ty.", "Match the two expressions.", "Cancel common terms and divide by 2||x||||y|| to obtain cosine similarity."] },
      workedExamples: [{ title: "Measure alignment", setup: "Let x=(1,2) and y=(2,1).", steps: ["x dot y=1*2+2*1=4.", "Both lengths are sqrt(5).", "cos(theta)=4/5=0.8."], result: "The vectors point in similar, but not identical, directions." }, { title: "Weighted inner product", setup: "Let <x,y>_W=x^TWy with W=diag(1,4).", steps: ["The second coordinate receives four times the weight.", "For x=(1,1), its squared induced norm is 1+4.", "Take the square root."], result: "The W-norm of x is sqrt(5), emphasizing the second coordinate." }],
      exercises: [{ level: "Beginner", question: "Compute (1,-2,3) dot (4,0,1).", answer: "1*4+(-2)*0+3*1=7." }, { level: "Intermediate", question: "If nonzero u dot v=0, what is their angle?", answer: "90 degrees, or pi/2 radians." }, { level: "Applied", question: "Why is cosine similarity useful for embeddings?", answer: "It compares direction while largely ignoring vector magnitude, which often better represents semantic alignment." }],
      takeaways: ["A dot product combines matching coordinates into one alignment score.", "Inner products generalize geometry beyond ordinary coordinates.", "Norms and angles can be induced by an inner product.", "Cosine similarity is undefined for a zero vector."]
    },
    "matrix-multiplication-and-tensor-contraction": {
      prerequisites: ["Matrix shapes and indices.", "Dot products.", "Functions composed in sequence."],
      notationGuide: [{ symbol: "A_ik", latex: "A_{ik}", meaning: "Entry in row i and shared column k." }, { symbol: "C=AB", latex: "C=AB", meaning: "Composition of two compatible linear maps." }, { symbol: "sum_k", latex: "\\sum_k", meaning: "Contract or remove the shared k axis." }],
      formulaLatex: ["C_{ij}=\\sum_k A_{ik}B_{kj}", "(m\\times n)(n\\times p)\\longrightarrow(m\\times p)", "A(BC)=(AB)C"],
      derivation: { title: "Derive one output entry", steps: ["Choose output row i from A and output column j from B.", "Pair entries along their shared k axis.", "Multiply each pair A_ik B_kj.", "Sum over k; the shared axis disappears and leaves output indices i,j."] },
      workedExamples: [{ title: "Multiply a matrix and vector", setup: "A=[[1,2],[3,4]], x=(5,6).", steps: ["First row dot x is 1*5+2*6=17.", "Second row dot x is 3*5+4*6=39.", "Stack the two outputs."], result: "Ax=(17,39)." }, { title: "Track a neural layer composition", setup: "B maps 4 features to 3 hidden values and A maps 3 hidden values to 2 outputs.", steps: ["B has shape 3 x 4.", "A has shape 2 x 3.", "AB has shape 2 x 4."], result: "The combined matrix maps the original 4-vector directly to 2 outputs." }],
      exercises: [{ level: "Beginner", question: "Can a 2 x 3 matrix multiply a 4 x 2 matrix in that order?", answer: "No. The inner dimensions 3 and 4 do not match." }, { level: "Intermediate", question: "Compute [[1,0],[2,1]][[3],[4]].", answer: "The result is [[3],[10]]." }, { level: "Applied", question: "In attention scores QK^T, which axis is contracted?", answer: "The feature or head-dimension axis; query and key token axes remain." }],
      takeaways: ["Matrix multiplication is row-by-column dot products.", "Inner dimensions must match and are contracted.", "Order matters even though grouping does not.", "Tensor contraction is the same shared-index idea with more axes."]
    },
    "norms": {
      prerequisites: ["Absolute values and square roots.", "Vectors and matrices.", "The idea of measuring size."],
      notationGuide: [{ symbol: "||x||_p", latex: "\\lVert x\\rVert_p", meaning: "The p-norm of vector x." }, { symbol: "||A||_F", latex: "\\lVert A\\rVert_F", meaning: "Frobenius norm of all matrix entries." }, { symbol: "sigma_max(A)", latex: "\\sigma_{\\max}(A)", meaning: "Largest singular value of A." }],
      formulaLatex: ["\\lVert x\\rVert_1=\\sum_i|x_i|", "\\lVert x\\rVert_2=\\sqrt{\\sum_i x_i^2}", "\\lVert A\\rVert_F=\\sqrt{\\sum_{i,j}A_{ij}^2}", "\\lVert A\\rVert_2=\\sigma_{\\max}(A)"],
      derivation: { title: "Understand the induced matrix 2-norm", steps: ["Apply A to every unit vector x.", "Measure each output length ||Ax||_2.", "Find the direction with maximum stretch.", "That maximum equals the largest singular value sigma_max(A)."] },
      workedExamples: [{ title: "Compare L1 and L2", setup: "Let x=(3,-4).", steps: ["L1 adds absolute values: 3+4.", "L2 takes sqrt(3^2+(-4)^2)."], result: "||x||_1=7 while ||x||_2=5." }, { title: "Frobenius matrix size", setup: "Let A=[[1,2],[2,1]].", steps: ["Square all four entries: 1,4,4,1.", "Sum to get 10.", "Take the square root."], result: "||A||_F=sqrt(10)." }],
      exercises: [{ level: "Beginner", question: "Find the L1 and L2 norms of (1,2,2).", answer: "L1=5 and L2=3." }, { level: "Intermediate", question: "Why does multiplying x by 3 multiply every norm by 3?", answer: "Norm homogeneity gives ||3x||=|3| ||x||." }, { level: "Applied", question: "Why can L1 regularization encourage sparse model weights?", answer: "Its sharp geometry at zero makes exact zero coefficients more favorable during optimization." }],
      takeaways: ["Norms satisfy positivity, homogeneity, and the triangle inequality.", "Different norms emphasize different geometry.", "Frobenius measures all entries; spectral measures maximum directional stretch.", "Choose a norm that matches the error or structure you care about."]
    },
    "distance-and-similarity-metrics": {
      prerequisites: ["Vector subtraction.", "Norms and dot products.", "Comparing feature scales."],
      notationGuide: [{ symbol: "d(x,y)", latex: "d(x,y)", meaning: "Distance between x and y." }, { symbol: "sim(x,y)", latex: "\\operatorname{sim}(x,y)", meaning: "Similarity score; larger often means closer." }, { symbol: "cos(theta)", latex: "\\cos\\theta", meaning: "Directional similarity." }],
      formulaLatex: ["d_2(x,y)=\\sqrt{\\sum_i(x_i-y_i)^2}", "d_1(x,y)=\\sum_i|x_i-y_i|", "\\operatorname{cosim}(x,y)=\\frac{x^\\top y}{\\lVert x\\rVert_2\\lVert y\\rVert_2}"],
      derivation: { title: "Check whether a distance is a metric", steps: ["Verify d(x,y) is never negative.", "Verify d(x,y)=0 only when x=y.", "Verify symmetry d(x,y)=d(y,x).", "Verify the triangle inequality d(x,z)<=d(x,y)+d(y,z)."] },
      workedExamples: [{ title: "Euclidean versus Manhattan", setup: "Compare x=(0,0) and y=(3,4).", steps: ["Euclidean distance is sqrt(3^2+4^2)=5.", "Manhattan distance is |3|+|4|=7."], result: "Both rank identical points closest, but their geometry differs." }, { title: "Same direction, different scale", setup: "Compare x=(1,2) and y=(10,20).", steps: ["y is 10x.", "Their Euclidean distance is large.", "Their cosine similarity is 1."], result: "Cosine treats them as perfectly directionally similar." }],
      exercises: [{ level: "Beginner", question: "Find Euclidean distance between (1,1) and (4,5).", answer: "sqrt(3^2+4^2)=5." }, { level: "Intermediate", question: "Is cosine similarity itself a metric distance?", answer: "No. It is a similarity and does not satisfy all metric axioms without transformation and restrictions." }, { level: "Applied", question: "Why should features often be standardized before Euclidean nearest-neighbor search?", answer: "A large-scale feature can dominate squared differences regardless of its actual importance." }],
      takeaways: ["Distance and similarity answer related but different questions.", "A metric obeys four specific axioms.", "Feature scaling can change neighborhoods dramatically.", "Cosine focuses on direction; Euclidean includes magnitude."]
    },
    "orthogonality-and-orthonormal-bases": {
      prerequisites: ["Dot products and vector norms.", "Linear independence.", "Basis coordinates."],
      notationGuide: [{ symbol: "u perpendicular v", latex: "u\\perp v", meaning: "u and v are orthogonal." }, { symbol: "q_i", latex: "q_i", meaning: "A unit basis vector." }, { symbol: "Q^TQ=I", latex: "Q^\\top Q=I", meaning: "Columns of Q are orthonormal." }],
      formulaLatex: ["u^\\top v=0", "\\hat u=\\frac{u}{\\lVert u\\rVert_2}", "Q^\\top Q=I"],
      derivation: { title: "One Gram-Schmidt step", steps: ["Start with independent vectors v1 and v2.", "Normalize v1 to q1=v1/||v1||.", "Remove v2's component along q1: u2=v2-(q1^Tv2)q1.", "Normalize the residual q2=u2/||u2||; now q1 and q2 are orthonormal."] },
      workedExamples: [{ title: "Verify orthogonality", setup: "Let u=(1,2) and v=(2,-1).", steps: ["Compute u dot v=1*2+2*(-1).", "The result is zero."], result: "u and v are orthogonal." }, { title: "Coordinates become dot products", setup: "Let q1,q2 be an orthonormal basis and x be any vector in their span.", steps: ["Write x=c1q1+c2q2.", "Dot both sides with q1.", "Cross terms vanish and q1 dot q1=1."], result: "c1=q1 dot x, and similarly c2=q2 dot x." }],
      exercises: [{ level: "Beginner", question: "Normalize (3,4).", answer: "Its length is 5, so the unit vector is (3/5,4/5)." }, { level: "Intermediate", question: "Are columns (1/sqrt(2))(1,1) and (1/sqrt(2))(1,-1) orthonormal?", answer: "Yes. Each has unit length and their dot product is zero." }, { level: "Applied", question: "Why are orthonormal transformations numerically attractive?", answer: "They preserve lengths and angles, so they do not amplify errors merely through scaling." }],
      takeaways: ["Orthogonal nonzero vectors are automatically independent.", "Orthonormal means orthogonal and unit length.", "Coordinates in an orthonormal basis are simple dot products.", "Gram-Schmidt constructs an orthonormal basis from independent vectors."]
    },
    "projections": {
      prerequisites: ["Dot products and orthogonality.", "Subspaces and bases.", "Matrix multiplication."],
      notationGuide: [{ symbol: "proj_u(x)", latex: "\\operatorname{proj}_u(x)", meaning: "Projection of x onto vector u." }, { symbol: "P", latex: "P", meaning: "Projection matrix." }, { symbol: "r=x-Px", latex: "r=x-Px", meaning: "Residual orthogonal to the target subspace." }],
      formulaLatex: ["\\operatorname{proj}_u(x)=\\frac{x^\\top u}{u^\\top u}u", "P=QQ^\\top,\\qquad\\hat x=Px", "P^2=P"],
      derivation: { title: "Project onto one direction", steps: ["Assume the closest point has form alpha u.", "The residual x-alpha u must be perpendicular to u.", "Set u^T(x-alpha u)=0.", "Solve alpha=(u^Tx)/(u^Tu), then substitute into alpha u."] },
      workedExamples: [{ title: "Project onto the x-axis", setup: "Project x=(3,4) onto u=(1,0).", steps: ["x dot u=3 and u dot u=1.", "The scalar coefficient is 3.", "Multiply 3u."], result: "The projection is (3,0) and residual is (0,4)." }, { title: "Project onto a plane", setup: "Q has orthonormal columns spanning a plane.", steps: ["Compute coordinates c=Q^Tx.", "Reconstruct inside the plane as Qc.", "Combine to get QQ^Tx."], result: "P=QQ^T projects any x onto the plane." }],
      exercises: [{ level: "Beginner", question: "Project (2,3) onto (0,1).", answer: "The projection is (0,3)." }, { level: "Intermediate", question: "Why is x-Px orthogonal to every column of Q?", answer: "Q^T(x-QQ^Tx)=Q^Tx-Q^TQ Q^Tx=0 because Q^TQ=I." }, { level: "Applied", question: "How is least squares a projection problem?", answer: "It projects target b onto the column space of A; the fitted vector A x_hat is the closest reachable output." }],
      takeaways: ["A projection keeps the component inside a chosen subspace.", "The residual is orthogonal to that subspace.", "An orthonormal basis gives P=QQ^T.", "Projection matrices are idempotent: applying them twice changes nothing."]
    },
    "rank-and-null-space": {
      prerequisites: ["Matrix-vector multiplication.", "Linear independence and span.", "Solving homogeneous systems."],
      notationGuide: [{ symbol: "rank(A)", latex: "\\operatorname{rank}(A)", meaning: "Number of independent output directions." }, { symbol: "Null(A)", latex: "\\operatorname{Null}(A)", meaning: "Inputs mapped to zero." }, { symbol: "Col(A)", latex: "\\operatorname{Col}(A)", meaning: "Span of matrix columns." }, { symbol: "nullity(A)", latex: "\\operatorname{nullity}(A)", meaning: "Dimension of the null space." }],
      formulaLatex: ["\\operatorname{rank}(A)+\\dim(\\operatorname{Null}(A))=n", "\\operatorname{rank}(A)=n", "\\operatorname{rank}(A)\\leq\\min(m,n)"],
      derivation: { title: "Understand rank-nullity", steps: ["A maps an n-dimensional input space into outputs.", "Null-space directions disappear and contribute no distinguishable output.", "Independent remaining input directions create the column-space dimensions counted by rank.", "A basis can be split between these two groups, so rank+nullity=n."] },
      workedExamples: [{ title: "Rank-one matrix", setup: "A=[[1,2],[2,4]].", steps: ["The second row is twice the first.", "The second column is twice the first.", "Only one independent column remains."], result: "rank(A)=1 and nullity(A)=1." }, { title: "Find a null direction", setup: "Use the same A and solve Ax=0.", steps: ["The equation is x1+2x2=0.", "Choose x2=1.", "Then x1=-2."], result: "(-2,1) spans Null(A)." }],
      exercises: [{ level: "Beginner", question: "What is the rank of the 3 x 3 identity matrix?", answer: "3; every column is independent." }, { level: "Intermediate", question: "A 4 x 7 matrix has rank 3. What is its nullity?", answer: "7-3=4." }, { level: "Applied", question: "Why does a nontrivial null space make inverse recovery ambiguous?", answer: "Inputs x and x+z produce the same output whenever Az=0, so the output cannot identify which input was used." }],
      takeaways: ["Rank counts independent transformed directions.", "The null space contains invisible input changes.", "Rank-nullity partitions input dimensions.", "Low rank implies redundancy but may also enable compression."]
    },
    "trace-and-determinant": {
      prerequisites: ["Square matrices.", "Matrix multiplication.", "Area and volume scaling intuition."],
      notationGuide: [{ symbol: "tr(A)", latex: "\\operatorname{tr}(A)", meaning: "Sum of diagonal entries." }, { symbol: "det(A)", latex: "\\det(A)", meaning: "Signed volume-scaling factor." }, { symbol: "A^-1", latex: "A^{-1}", meaning: "Inverse, which exists when det(A) is nonzero." }],
      formulaLatex: ["\\operatorname{tr}(A)=\\sum_i A_{ii}", "\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc", "\\det(AB)=\\det(A)\\det(B)"],
      derivation: { title: "Derive the 2 x 2 determinant geometrically", steps: ["Columns u=(a,c) and v=(b,d) form a parallelogram.", "The axis-aligned product ad contributes one oriented area.", "The cross product bc contributes area with opposite orientation.", "Subtract to obtain det(A)=ad-bc; zero means the columns collapse onto one line."] },
      workedExamples: [{ title: "Compute trace and determinant", setup: "Let A=[[2,1],[3,4]].", steps: ["Trace adds diagonal entries: 2+4.", "Determinant is 2*4-1*3."], result: "tr(A)=6 and det(A)=5." }, { title: "Interpret a negative determinant", setup: "The reflection matrix A=[[-1,0],[0,1]].", steps: ["Absolute determinant is 1, so area is preserved.", "The determinant is -1.", "The negative sign records orientation reversal."], result: "A reflects across the y-axis without changing area." }],
      exercises: [{ level: "Beginner", question: "Find trace and determinant of [[1,2],[3,4]].", answer: "Trace=5 and determinant=1*4-2*3=-2." }, { level: "Intermediate", question: "If det(A)=0, why can A not have an inverse?", answer: "A collapses volume and maps distinct inputs together, so no transformation can uniquely recover every input." }, { level: "Applied", question: "Why does log|det J| appear in normalizing flows?", answer: "It measures local volume change under an invertible transformation and corrects probability density accordingly." }],
      takeaways: ["Trace summarizes the diagonal and equals the sum of eigenvalues.", "Determinant measures signed volume scaling.", "Zero determinant means singularity.", "Determinants multiply under composition; traces cycle under products."]
    },
    "positive-semidefinite-matrices": {
      prerequisites: ["Symmetric matrices.", "Dot products and quadratic expressions.", "Eigenvalues and basic optimization intuition."],
      notationGuide: [{ symbol: "A >= 0", latex: "A\\succeq 0", meaning: "A is positive semidefinite." }, { symbol: "A > 0", latex: "A\\succ 0", meaning: "A is positive definite." }, { symbol: "x^T A x", latex: "x^\\top A x", meaning: "Quadratic form evaluated in direction x." }, { symbol: "G=X^T X", latex: "G=X^\\top X", meaning: "A Gram matrix." }],
      formulaLatex: ["x^\\top A x\\geq 0\\quad\\text{for every }x", "\\lambda_i(A)\\geq 0", "A=B^\\top B"],
      derivation: { title: "Why every Gram matrix is positive semidefinite", steps: ["Start with A=B^TB.", "Insert it into the quadratic form x^TAx.", "Regroup as x^TB^TBx=(Bx)^T(Bx).", "The result is ||Bx||^2, which cannot be negative."] },
      workedExamples: [{ title: "Test a diagonal matrix", setup: "Let A=diag(2,0,5).", steps: ["x^TAx=2x1^2+0x2^2+5x3^2.", "Every term is nonnegative.", "The x2 direction can produce zero."], result: "A is positive semidefinite but not positive definite." }, { title: "Covariance as PSD", setup: "A covariance matrix is E[(X-mu)(X-mu)^T].", steps: ["Evaluate v^T Sigma v.", "This equals E[(v^T(X-mu))^2].", "An expected square is nonnegative."], result: "Every covariance matrix is positive semidefinite." }],
      exercises: [{ level: "Beginner", question: "Is diag(1,-1) positive semidefinite?", answer: "No. Direction x=(0,1) gives x^TAx=-1." }, { level: "Intermediate", question: "What eigenvalue condition characterizes a real symmetric PSD matrix?", answer: "All eigenvalues are nonnegative." }, { level: "Applied", question: "Why should a kernel Gram matrix be PSD?", answer: "It must behave like inner products in some feature space, making every coefficient quadratic form nonnegative." }],
      takeaways: ["PSD matrices never create a negative quadratic form.", "Positive definite strengthens nonnegative to positive for every nonzero direction.", "Symmetric PSD matrices have nonnegative eigenvalues.", "Covariance, Gram, and curvature matrices commonly have PSD structure."]
    },
    "eigenvalues-and-eigenvectors": {
      prerequisites: ["Matrix-vector multiplication.", "Linear independence.", "Determinants and solving equations."],
      notationGuide: [{ symbol: "v", latex: "v", meaning: "A nonzero eigenvector." }, { symbol: "lambda", latex: "\\lambda", meaning: "Its eigenvalue or directional scale." }, { symbol: "spectrum(A)", latex: "\\operatorname{spec}(A)", meaning: "The collection of eigenvalues." }, { symbol: "E_lambda", latex: "E_\\lambda", meaning: "Eigenspace for eigenvalue lambda." }],
      formulaLatex: ["Av=\\lambda v", "\\det(A-\\lambda I)=0", "\\sum_i\\lambda_i=\\operatorname{tr}(A),\\qquad\\prod_i\\lambda_i=\\det(A)"],
      derivation: { title: "Find eigenvalues and eigenvectors", steps: ["Rewrite Av=lambda v as (A-lambda I)v=0.", "A nonzero v exists only if A-lambda I is singular.", "Set det(A-lambda I)=0 and solve the characteristic equation.", "For each eigenvalue, solve (A-lambda I)v=0 to obtain its eigenspace."] },
      workedExamples: [{ title: "Diagonal matrix", setup: "Let A=diag(3,1).", steps: ["A(1,0)=3(1,0).", "A(0,1)=1(0,1).", "Coordinate axes keep their direction."], result: "Eigenpairs are lambda=3 with e1 and lambda=1 with e2." }, { title: "Repeated direction scaling", setup: "Use A=[[2,1],[1,2]].", steps: ["A(1,1)=(3,3)=3(1,1).", "A(1,-1)=(1,-1).", "The two directions are orthogonal."], result: "Eigenvalues are 3 and 1 with symmetric and antisymmetric directions." }],
      exercises: [{ level: "Beginner", question: "What are the eigenvalues of diag(4,-2,7)?", answer: "4, -2, and 7." }, { level: "Intermediate", question: "Find an eigenvector of [[1,1],[0,1]].", answer: "For lambda=1, solve (A-I)v=0, giving v2=0; any nonzero multiple of (1,0) works." }, { level: "Applied", question: "What does a dominant eigenvector describe in repeated linear dynamics x_(t+1)=Ax_t?", answer: "When conditions allow, it describes the direction that eventually dominates because its eigenvalue has largest magnitude." }],
      takeaways: ["Eigenvectors keep direction under a linear transformation.", "Eigenvalues record their scale and possible sign reversal.", "The characteristic equation finds candidate eigenvalues.", "Not every matrix has a full real eigenbasis."]
    },
    "eigendecomposition": {
      prerequisites: ["Eigenvalues and independent eigenvectors.", "Matrix inverses.", "Change-of-basis coordinates."],
      notationGuide: [{ symbol: "V", latex: "V", meaning: "Matrix whose columns are eigenvectors." }, { symbol: "Lambda", latex: "\\Lambda", meaning: "Diagonal matrix of eigenvalues." }, { symbol: "Q", latex: "Q", meaning: "Orthonormal eigenvector matrix for a symmetric matrix." }],
      formulaLatex: ["A=V\\Lambda V^{-1}", "A=Q\\Lambda Q^\\top", "A^k=V\\Lambda^kV^{-1}"],
      derivation: { title: "Assemble the decomposition", steps: ["Collect independent eigenvectors v_i as columns of V.", "Write Av_i=lambda_i v_i for every column at once as AV=V Lambda.", "If the eigenvectors form a basis, V is invertible.", "Multiply by V^-1 on the right to obtain A=V Lambda V^-1."] },
      workedExamples: [{ title: "Power a matrix cheaply", setup: "Suppose A=V Lambda V^-1 and k=20.", steps: ["Write A^20=(V Lambda V^-1)...(V Lambda V^-1).", "Adjacent V^-1V factors cancel.", "Only diagonal entries of Lambda need powers."], result: "A^20=V Lambda^20 V^-1." }, { title: "Symmetric spectral form", setup: "Let A be real and symmetric.", steps: ["Its eigenvalues are real.", "Its eigenvectors can be chosen orthonormal.", "Therefore Q^-1=Q^T."], result: "The decomposition simplifies to A=Q Lambda Q^T." }],
      exercises: [{ level: "Beginner", question: "If Lambda=diag(2,3), what is Lambda^4?", answer: "diag(16,81)." }, { level: "Intermediate", question: "Why does a defective matrix lack an ordinary eigendecomposition?", answer: "It does not have enough independent eigenvectors to make V invertible." }, { level: "Applied", question: "How does eigendecomposition help analyze a linear recurrence?", answer: "It separates the dynamics into independent eigen-directions whose amplitudes evolve as powers of eigenvalues." }],
      takeaways: ["Diagonalization is a change to eigenvector coordinates.", "Diagonal matrices make powers and functions easy.", "A full eigendecomposition requires enough independent eigenvectors.", "Real symmetric matrices have the clean orthogonal spectral decomposition."]
    },
    "singular-value-decomposition": {
      prerequisites: ["Orthonormal bases.", "Eigenvalues of symmetric matrices.", "Matrix transformations and rank."],
      notationGuide: [{ symbol: "U", latex: "U", meaning: "Left singular vectors in output space." }, { symbol: "Sigma", latex: "\\Sigma", meaning: "Diagonal nonnegative singular values." }, { symbol: "V", latex: "V", meaning: "Right singular vectors in input space." }, { symbol: "sigma_i", latex: "\\sigma_i", meaning: "Stretch along the i-th singular direction." }],
      formulaLatex: ["A=U\\Sigma V^\\top", "Av_i=\\sigma_i u_i", "\\operatorname{rank}(A)=\\#\\{i:\\sigma_i>0\\}"],
      derivation: { title: "Build SVD from A^T A", steps: ["Form A^TA, which is symmetric positive semidefinite.", "Find orthonormal eigenvectors v_i and eigenvalues lambda_i.", "Set singular values sigma_i=sqrt(lambda_i).", "For nonzero sigma_i define u_i=Av_i/sigma_i, then collect columns to obtain A=U Sigma V^T."] },
      workedExamples: [{ title: "SVD of a diagonal stretch", setup: "Let A=diag(3,1).", steps: ["Coordinate axes are already orthonormal singular directions.", "Stretch factors are 3 and 1.", "No rotation is needed."], result: "U=I, Sigma=diag(3,1), V=I." }, { title: "Read rank and null space", setup: "Suppose singular values are 5,2,0,0.", steps: ["Count positive singular values to get rank.", "Zero singular directions are mapped to zero.", "Their right singular vectors span the null space."], result: "rank=2 and nullity includes two right-singular directions." }],
      exercises: [{ level: "Beginner", question: "What are the singular values of diag(-4,2)?", answer: "4 and 2; singular values are nonnegative magnitudes." }, { level: "Intermediate", question: "How are singular values related to eigenvalues of A^TA?", answer: "They are the nonnegative square roots of those eigenvalues." }, { level: "Applied", question: "Why is SVD useful when A is rectangular?", answer: "Unlike ordinary eigendecomposition, it applies to every real or complex matrix and separates input and output directions." }],
      takeaways: ["Every matrix has an SVD.", "V rotates input coordinates, Sigma scales, and U rotates output coordinates.", "Singular values reveal rank, energy, and conditioning.", "SVD is the foundation of optimal low-rank approximation."]
    },
    "low-rank-approximation": {
      prerequisites: ["Matrix rank.", "Singular value decomposition.", "Frobenius norm and reconstruction error."],
      notationGuide: [{ symbol: "A_k", latex: "A_k", meaning: "Rank-k approximation to A." }, { symbol: "U_k", latex: "U_k", meaning: "First k left singular vectors." }, { symbol: "sigma_(k+1)", latex: "\\sigma_{k+1}", meaning: "Largest discarded singular value." }],
      formulaLatex: ["A_k=U_k\\Sigma_kV_k^\\top", "\\lVert A-A_k\\rVert_F^2=\\sum_{i>k}\\sigma_i^2", "mn\\longrightarrow k(m+n+1)"],
      derivation: { title: "Truncate the SVD", steps: ["Write A as a sum of rank-one pieces sum_i sigma_i u_i v_i^T.", "Order singular values from largest to smallest.", "Keep the first k pieces and discard the rest.", "The Eckart-Young theorem says this choice minimizes 2-norm and Frobenius error among rank-k matrices."] },
      workedExamples: [{ title: "Choose rank from energy", setup: "Singular values are 9,3,1.", steps: ["Total squared Frobenius energy is 81+9+1=91.", "Rank 1 keeps 81/91 about 89%.", "Rank 2 keeps 90/91 about 99%."], result: "Rank 2 gives much smaller error while remaining compressed." }, { title: "Count compressed parameters", setup: "Approximate a 1000 x 500 matrix with rank 20.", steps: ["Dense storage uses 500,000 entries.", "Factors use 20(1000+500+1).", "That equals 30,020 entries."], result: "Factor storage is about 16.7 times smaller, ignoring overhead." }],
      exercises: [{ level: "Beginner", question: "For singular values 4,2,1, what is squared Frobenius error of rank 1?", answer: "2^2+1^2=5." }, { level: "Intermediate", question: "Why can truncated SVD denoise data?", answer: "It removes weak singular directions that often contain small, unstructured variation while retaining dominant structure." }, { level: "Applied", question: "What tradeoff does k control in a low-rank model?", answer: "Larger k improves reconstruction capacity but increases storage, computation, and risk of preserving noise." }],
      takeaways: ["A matrix is a sum of ranked singular components.", "Truncated SVD is the optimal rank-k approximation for common norms.", "Discarded singular values quantify reconstruction error.", "Low-rank factors trade fidelity for efficiency and structure."]
    },
    "sparse-matrices": {
      prerequisites: ["Matrix shapes and indexing.", "Matrix-vector multiplication.", "Basic storage and algorithmic complexity."],
      notationGuide: [{ symbol: "nnz(A)", latex: "\\operatorname{nnz}(A)", meaning: "Number of nonzero entries." }, { symbol: "density", latex: "\\rho(A)", meaning: "Fraction of entries that are nonzero." }, { symbol: "CSR", latex: "\\mathrm{CSR}", meaning: "Compressed sparse row storage." }],
      formulaLatex: ["\\operatorname{density}(A)=\\frac{\\operatorname{nnz}(A)}{mn}", "\\operatorname{sparsity}(A)=1-\\operatorname{density}(A)", "\\operatorname{cost}(Ax)\\approx O(\\operatorname{nnz}(A))"],
      derivation: { title: "Why sparse matrix-vector multiplication saves work", steps: ["Dense Ax visits all mn entries, including zeros.", "A zero entry contributes nothing to the output sum.", "Store only each nonzero value and its location.", "Iterate through nnz entries, accumulating each contribution, so work tracks nnz instead of mn."] },
      workedExamples: [{ title: "Compute density", setup: "A 100 x 200 matrix has 500 nonzeros.", steps: ["Total positions are 20,000.", "Density is 500/20,000.", "Sparsity is one minus density."], result: "Density is 2.5% and sparsity is 97.5%." }, { title: "Choose a format", setup: "Rows are processed repeatedly for matrix-vector products.", steps: ["COO stores flexible row-column-value triples.", "CSR groups values by row using row pointers.", "Repeated row traversal benefits from contiguous row groups."], result: "CSR is usually the better execution format after construction." }],
      exercises: [{ level: "Beginner", question: "A 10 x 10 matrix has 8 nonzeros. What is its density?", answer: "8/100=0.08, or 8%." }, { level: "Intermediate", question: "Why can sparse addition create more nonzeros?", answer: "The union of nonzero positions from both inputs may be larger, and operations can cause fill-in." }, { level: "Applied", question: "Why are one-hot feature matrices often stored sparsely?", answer: "Each row has very few active entries compared with a huge vocabulary dimension, so dense storage wastes nearly all space." }],
      takeaways: ["Sparsity is structural information, not merely many small numbers.", "Sparse formats store values plus indexing metadata.", "The best format depends on construction and access patterns.", "Some operations cause fill-in and can destroy sparse efficiency."]
    },
    "matrix-calculus": {
      prerequisites: ["Single-variable derivatives and gradients.", "Matrix multiplication and transpose.", "Differentials and the chain rule."],
      notationGuide: [{ symbol: "grad_x L", latex: "\\nabla_x L", meaning: "Gradient of scalar L with respect to vector x." }, { symbol: "dL", latex: "dL", meaning: "First-order change in L." }, { symbol: "dW", latex: "dW", meaning: "Small perturbation of matrix W." }, { symbol: "tr(A)", latex: "\\operatorname{tr}(A)", meaning: "Trace used to rearrange matrix differentials." }],
      formulaLatex: ["\\nabla_x(x^\\top A x)=(A+A^\\top)x", "y=Wx\\implies\\nabla_W L=(\\nabla_y L)x^\\top", "\\nabla_x\\lVert Ax-b\\rVert_2^2=2A^\\top(Ax-b)"],
      derivation: { title: "Differentiate a linear layer", steps: ["Start with y=Wx and scalar loss L(y).", "Perturb W: dy=dW x.", "Write dL=(nabla_y L)^T dy=(nabla_y L)^T dW x.", "Match dL=tr((nabla_W L)^T dW) to identify nabla_W L=(nabla_y L)x^T."] },
      workedExamples: [{ title: "Squared-error gradient", setup: "L(x)=||Ax-b||^2.", steps: ["Let r=Ax-b.", "Then dL=2r^T dr and dr=A dx.", "So dL=2r^T A dx."], result: "nabla_x L=2A^T(Ax-b)." }, { title: "Check gradient shape", setup: "W is m x n, x is n, and upstream gradient g is m.", steps: ["g x^T is an outer product.", "Its shape is m x n.", "That matches W."], result: "nabla_W L=gx^T has the correct parameter shape." }],
      exercises: [{ level: "Beginner", question: "What is nabla_x (a^T x)?", answer: "a." }, { level: "Intermediate", question: "For symmetric A, simplify nabla_x(x^TAx).", answer: "2Ax because A+A^T=2A." }, { level: "Applied", question: "Why is shape checking useful in backpropagation?", answer: "A derivative with the wrong shape reveals an incorrect transpose, contraction, or convention before numerical testing." }],
      takeaways: ["Matrix calculus tracks both values and shapes.", "Differentials provide a reliable route through complicated expressions.", "The chain rule becomes multiplication or contraction of derivative maps.", "State numerator/denominator conventions when using Jacobian layouts."]
    },
    "jacobians-and-hessians": {
      prerequisites: ["Partial derivatives and gradients.", "Matrix multiplication.", "First- and second-order Taylor approximation."],
      notationGuide: [{ symbol: "J_f(x)", latex: "J_f(x)", meaning: "Jacobian of vector-valued f." }, { symbol: "H_f(x)", latex: "H_f(x)", meaning: "Hessian of scalar f." }, { symbol: "Jv", latex: "Jv", meaning: "Jacobian-vector product." }, { symbol: "Hv", latex: "Hv", meaning: "Hessian-vector product." }],
      formulaLatex: ["f(x+\\Delta x)\\approx f(x)+J_f(x)\\Delta x", "f(x+d)\\approx f(x)+g^\\top d+\\tfrac12 d^\\top H d", "J\\in\\mathbb{R}^{m\\times n},\\qquad H\\in\\mathbb{R}^{n\\times n}"],
      derivation: { title: "Build a Hessian-vector product without the full Hessian", steps: ["Compute the gradient function g(x)=nabla f(x).", "The Hessian is the Jacobian of g.", "Consider directional change g(x+epsilon v)-g(x).", "Automatic differentiation computes J_g v=Hv directly, avoiding storage of all n^2 entries."] },
      workedExamples: [{ title: "Jacobian of a two-output map", setup: "f(x,y)=(x^2+y, xy).", steps: ["Differentiate first output: (2x,1).", "Differentiate second output: (y,x).", "Place output gradients as rows."], result: "J=[[2x,1],[y,x]]." }, { title: "Hessian of a quadratic", setup: "f(x)=0.5 x^T A x with symmetric A.", steps: ["The gradient is Ax.", "Differentiate the gradient with respect to x.", "The derivative of Ax is A."], result: "H=A everywhere, so curvature is constant." }],
      exercises: [{ level: "Beginner", question: "What shape is the Jacobian of f:R^5->R^3?", answer: "3 x 5 under the output-by-input convention." }, { level: "Intermediate", question: "Find the Hessian of f(x,y)=x^2+3xy+y^2.", answer: "[[2,3],[3,2]]." }, { level: "Applied", question: "Why use Hessian-vector products in large neural networks?", answer: "They reveal curvature along chosen directions with roughly gradient-like memory, while the full Hessian is too large to store." }],
      takeaways: ["Jacobians are local linear maps for vector outputs.", "Hessians describe local curvature of scalar functions.", "JVPs and VJPs avoid materializing large Jacobians.", "Hessian-vector products support second-order analysis at scale."]
    },
    "kronecker-products": {
      prerequisites: ["Block matrices.", "Matrix shapes and multiplication.", "Vectorization of matrices."],
      notationGuide: [{ symbol: "A tensor B", latex: "A\\otimes B", meaning: "Kronecker product." }, { symbol: "vec(X)", latex: "\\operatorname{vec}(X)", meaning: "Matrix X stacked into a vector." }, { symbol: "I tensor B", latex: "I\\otimes B", meaning: "Repeated independent copies of B." }],
      formulaLatex: ["A\\in\\mathbb{R}^{m\\times n},B\\in\\mathbb{R}^{p\\times q}\\implies A\\otimes B\\in\\mathbb{R}^{mp\\times nq}", "(A\\otimes B)(C\\otimes D)=(AC)\\otimes(BD)", "(A\\otimes B)^\\top=A^\\top\\otimes B^\\top"],
      derivation: { title: "Construct a Kronecker product", steps: ["Take the first scalar A_11.", "Multiply every entry of B by A_11 to form the first block.", "Repeat for each A_ij.", "Arrange scaled blocks in the same row-column pattern as A; dimensions multiply."] },
      workedExamples: [{ title: "Build small blocks", setup: "A=[[1,2],[0,3]], B=[[1,0],[0,-1]].", steps: ["Top blocks are 1B and 2B.", "Bottom blocks are 0B and 3B.", "Each block is 2 x 2."], result: "The Kronecker product is a structured 4 x 4 matrix." }, { title: "Apply repeated operators", setup: "Use I_3 tensor B.", steps: ["I_3 has ones only on its diagonal.", "Diagonal blocks become B.", "Off-diagonal blocks become zero."], result: "The block-diagonal operator applies B independently to three groups." }],
      exercises: [{ level: "Beginner", question: "What shape is (2 x 3) tensor (4 x 5)?", answer: "8 x 15." }, { level: "Intermediate", question: "Compute [1,2] tensor [[a,b],[c,d]].", answer: "It is the 2 x 4 block row [[a,b,2a,2b],[c,d,2c,2d]]." }, { level: "Applied", question: "Why keep Kronecker factors instead of materializing the product?", answer: "The full matrix can be enormous; factorized identities can reduce storage and allow structured multiplication." }],
      takeaways: ["Every entry of A scales a full copy of B.", "Kronecker dimensions multiply.", "It differs from ordinary and elementwise multiplication.", "Factor structure expresses repeated multidimensional operations compactly."]
    },
    "einstein-summation": {
      prerequisites: ["Tensor axes and indices.", "Matrix multiplication.", "Summing over repeated dimensions."],
      notationGuide: [{ symbol: "i,j,k", latex: "i,j,k", meaning: "Labels naming tensor axes." }, { symbol: "->", latex: "\\to", meaning: "Separates input labels from requested output labels in einsum." }, { symbol: "free index", latex: "i", meaning: "An index preserved in the output." }, { symbol: "contracted index", latex: "k", meaning: "A repeated index summed away." }],
      formulaLatex: ["\\sum_i x_i y_i", "C_{ij}=\\sum_k A_{ik}B_{kj}", "C_{bik}=\\sum_j A_{bij}B_{bjk}", "\\operatorname{tr}(A)=\\sum_i A_{ii}"],
      derivation: { title: "Read an einsum expression", steps: ["List every input label and verify matching labels have matching sizes.", "Read output labels after the arrow; these axes survive in that order.", "Any repeated label omitted from output is multiplied and summed.", "A label repeated inside one operand selects a diagonal before summation or output."] },
      workedExamples: [{ title: "Batch attention scores", setup: "Q and K have shapes b x t x f and b x s x f.", steps: ["Use labels btf and bsf.", "Feature f repeats and is omitted, so it contracts.", "Keep b,t,s in the output."], result: "'btf,bsf->bts' returns all token-pair scores per batch." }, { title: "Extract a diagonal", setup: "A has labels ij.", steps: ["Using ii requires row and column sizes to match.", "The repeated label selects entries A_ii.", "Keeping i avoids summing them."], result: "'ii->i' returns the diagonal; 'ii->' returns the trace." }],
      exercises: [{ level: "Beginner", question: "What does 'i,i->' compute?", answer: "A vector dot product." }, { level: "Intermediate", question: "Give einsum labels for matrix multiplication A(m,n)B(n,p).", answer: "'ik,kj->ij' or equivalently 'mn,np->mp'." }, { level: "Applied", question: "What error occurs if a contracted label has different sizes in two inputs?", answer: "The contraction is undefined because entries cannot be paired along a shared axis." }],
      takeaways: ["Labels describe logical axes, not fixed letters.", "Repeated omitted labels contract.", "Output labels determine surviving axes and their order.", "Einsum makes complex tensor intent explicit but still requires shape checks."]
    },
    "numerical-conditioning": {
      prerequisites: ["Singular values and matrix norms.", "Linear systems and least squares.", "Floating-point rounding intuition."],
      notationGuide: [{ symbol: "kappa(A)", latex: "\\kappa(A)", meaning: "Condition number of A." }, { symbol: "sigma_max", latex: "\\sigma_{\\max}", meaning: "Largest singular value." }, { symbol: "sigma_min", latex: "\\sigma_{\\min}", meaning: "Smallest singular value." }, { symbol: "epsilon", latex: "\\varepsilon", meaning: "Small relative perturbation or rounding scale." }],
      formulaLatex: ["\\kappa_2(A)=\\frac{\\sigma_{\\max}(A)}{\\sigma_{\\min}(A)}", "\\kappa(A)\\geq 1", "(A^\\top A+\\lambda I)x=A^\\top b"],
      derivation: { title: "Why small singular values amplify inverse error", steps: ["SVD rotates an input into right-singular coordinates.", "A scales each coordinate by sigma_i.", "Solving Ax=b reverses that scaling by dividing by sigma_i.", "If sigma_i is tiny, even tiny noise in b along u_i is divided by a tiny number and becomes a large error in x."] },
      workedExamples: [{ title: "Estimate sensitivity", setup: "A has singular values 100 and 0.001.", steps: ["Compute kappa_2=100/0.001=100,000.", "Suppose relative input noise is 10^-6.", "Worst-case relative solution error can be on the order of kappa times that noise."], result: "The error may reach roughly 10^-1 in the most sensitive direction." }, { title: "Regularize a weak direction", setup: "A^TA has a tiny eigenvalue lambda_i.", steps: ["Ordinary inversion uses 1/lambda_i.", "Ridge adds alpha to produce lambda_i+alpha.", "The inverse factor becomes 1/(lambda_i+alpha)."], result: "Sensitivity falls, at the cost of a controlled bias." }],
      exercises: [{ level: "Beginner", question: "Find kappa_2 for singular values 12,4,3.", answer: "12/3=4." }, { level: "Intermediate", question: "What happens to kappa when sigma_min approaches zero?", answer: "It grows without bound; at zero the matrix is singular and the inverse condition number is infinite." }, { level: "Applied", question: "Why is solving normal equations sometimes less stable than QR for least squares?", answer: "A^TA squares the 2-norm condition number, magnifying sensitivity before solving." }],
      takeaways: ["Conditioning describes the problem; stability describes the algorithm.", "Condition number is a worst-case sensitivity multiplier.", "Tiny singular values make inverse problems fragile.", "Scaling, QR/SVD solvers, and regularization can reduce numerical trouble."]
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
