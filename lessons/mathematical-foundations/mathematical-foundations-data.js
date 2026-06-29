(function () {
  const groups = {
    "linear-algebra": {
      "label": "Linear Algebra",
      "shortLabel": "Linear algebra",
      "focus": "numeric representations, geometry, transformations, and high-dimensional structure",
      "aiConnection": "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
      "value": "makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations",
      "defaultResource": {
        "label": "MIT OpenCourseWare: Linear Algebra",
        "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
      },
      "exampleStem": "In a model implementation,"
    },
    "calculus-and-matrix-calculus": {
      "label": "Calculus And Matrix Calculus",
      "shortLabel": "Calculus and matrix calculus",
      "focus": "rates of change, sensitivity, curvature, and differentiable programs",
      "aiConnection": "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
      "value": "explains how changing inputs or parameters changes losses, outputs, and trajectories",
      "defaultResource": {
        "label": "The Matrix Calculus You Need For Deep Learning",
        "url": "https://explained.ai/matrix-calculus/"
      },
      "exampleStem": "During training,"
    },
    "probability": {
      "label": "Probability",
      "shortLabel": "Probability",
      "focus": "uncertainty, sampling, distributions, and evidence",
      "aiConnection": "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
      "value": "lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes",
      "defaultResource": {
        "label": "Seeing Theory",
        "url": "https://seeing-theory.brown.edu/"
      },
      "exampleStem": "In a probabilistic model,"
    },
    "statistics": {
      "label": "Statistics",
      "shortLabel": "Statistics",
      "focus": "evidence, estimation, uncertainty, experiments, and model evaluation",
      "aiConnection": "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
      "value": "helps decide whether model behavior is supported by data or is an artifact of sampling noise",
      "defaultResource": {
        "label": "OpenIntro Statistics",
        "url": "https://www.openintro.org/book/os/"
      },
      "exampleStem": "When evaluating a model,"
    },
    "optimization": {
      "label": "Optimization",
      "shortLabel": "Optimization",
      "focus": "objectives, constraints, gradients, update rules, and numerical stability",
      "aiConnection": "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
      "value": "turns model training into a disciplined search for better parameters under practical constraints",
      "defaultResource": {
        "label": "Convex Optimization by Boyd and Vandenberghe",
        "url": "https://web.stanford.edu/~boyd/cvxbook/"
      },
      "exampleStem": "In a training loop,"
    },
    "information-theory": {
      "label": "Information Theory",
      "shortLabel": "Information theory",
      "focus": "uncertainty, surprise, distribution mismatch, compression, and information flow",
      "aiConnection": "how this appears in cross-entropy loss, language-model perplexity, KL regularization, representation learning, or compression",
      "value": "connects learning objectives with uncertainty, coding, compression, and distribution comparison",
      "defaultResource": {
        "label": "Information Theory, Inference, and Learning Algorithms",
        "url": "https://www.inference.org.uk/itila/book.html"
      },
      "exampleStem": "For a model distribution,"
    },
    "discrete-mathematics-theoretical-computer-science": {
      "label": "Discrete Mathematics And Theoretical Computer Science",
      "shortLabel": "Discrete mathematics and theoretical computer science",
      "focus": "sets, logic, graphs, proofs, algorithms, and computational limits",
      "aiConnection": "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
      "value": "gives AI systems discrete structures for reasoning, search, planning, and efficient computation",
      "defaultResource": {
        "label": "MIT OpenCourseWare: Mathematics for Computer Science",
        "url": "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/"
      },
      "exampleStem": "In an AI system,"
    }
  };

  const rawTopics = [
    {
      "id": "scalars-vectors-matrices-and-tensors",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Scalars, vectors, matrices, and tensors",
      "summary": "Scalars are single numbers, vectors are ordered lists, matrices are tables, and tensors generalize these ideas to higher-dimensional arrays.",
      "simpleIdea": "Scalars are single numbers, vectors are ordered lists, matrices are tables, and tensors generalize these ideas to higher-dimensional arrays. The practical point is to understand what scalars, vectors, matrices, and tensors lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Scalars, vectors, matrices, and tensors belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Scalars, vectors, matrices, and tensors.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Scalars, vectors, matrices, and tensors matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, scalars, vectors, matrices, and tensors can be used to interpret scalars are single numbers, vectors are ordered lists, matrices are tables, and tensors generalize these ideas to higher-dimensional arrays.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "vector-spaces-subspaces-span-basis-and-dimension",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Vector spaces, subspaces, span, basis, and dimension",
      "summary": "These describe which vectors can be combined, which directions are independent, and how many coordinates are needed.",
      "simpleIdea": "These describe which vectors can be combined, which directions are independent, and how many coordinates are needed. The practical point is to understand what vector spaces, subspaces, span, basis, and dimension lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Vector spaces, subspaces, span, basis, and dimension belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Vector spaces, subspaces, span, basis, and dimension.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Vector spaces, subspaces, span, basis, and dimension matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, vector spaces, subspaces, span, basis, and dimension can be used to interpret these describe which vectors can be combined, which directions are independent, and how many coordinates are needed.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "linear-independence",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Linear independence",
      "summary": "A set of vectors is independent when none can be recreated from the others, which avoids redundant directions.",
      "simpleIdea": "A set of vectors is independent when none can be recreated from the others, which avoids redundant directions. The practical point is to understand what linear independence lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Linear independence belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Linear independence.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Linear independence matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, linear independence can be used to interpret a set of vectors is independent when none can be recreated from the others, which avoids redundant directions.",
      "resources": [
        {
          "label": "Wikipedia: Linear independence",
          "url": "https://en.wikipedia.org/wiki/Linear_independence"
        }
      ]
    },
    {
      "id": "dot-products-and-inner-product-spaces",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Dot products and inner-product spaces",
      "summary": "Dot products measure alignment and support similarity, projection, and geometric reasoning.",
      "simpleIdea": "Dot products measure alignment and support similarity, projection, and geometric reasoning. The practical point is to understand what dot products and inner-product spaces lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Dot products and inner-product spaces belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Dot products and inner-product spaces.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Dot products and inner-product spaces matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, dot products and inner-product spaces can be used to interpret dot products measure alignment and support similarity, projection, and geometric reasoning.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "matrix-multiplication-and-tensor-contraction",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Matrix multiplication and tensor contraction",
      "summary": "These combine dimensions to transform data, compose layers, and aggregate features.",
      "simpleIdea": "These combine dimensions to transform data, compose layers, and aggregate features. The practical point is to understand what matrix multiplication and tensor contraction lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Matrix multiplication and tensor contraction belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Matrix multiplication and tensor contraction.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Matrix multiplication and tensor contraction matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, matrix multiplication and tensor contraction can be used to interpret these combine dimensions to transform data, compose layers, and aggregate features.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "norms",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Norms",
      "summary": "L1, L2, Frobenius, spectral, and related norms measure size, error, sparsity, or operator strength.",
      "simpleIdea": "L1, L2, Frobenius, spectral, and related norms measure size, error, sparsity, or operator strength. The practical point is to understand what norms lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Norms belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Norms.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Norms matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, norms can be used to interpret l1, L2, Frobenius, spectral, and related norms measure size, error, sparsity, or operator strength.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "distance-and-similarity-metrics",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Distance and similarity metrics",
      "summary": "Metrics such as Euclidean distance and cosine similarity compare embeddings, examples, and predictions.",
      "simpleIdea": "Metrics such as Euclidean distance and cosine similarity compare embeddings, examples, and predictions. The practical point is to understand what distance and similarity metrics lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Distance and similarity metrics belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Distance and similarity metrics.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Distance and similarity metrics matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, distance and similarity metrics can be used to interpret metrics such as Euclidean distance and cosine similarity compare embeddings, examples, and predictions.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "orthogonality-and-orthonormal-bases",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Orthogonality and orthonormal bases",
      "summary": "Perpendicular unit directions make decompositions cleaner and reduce duplicate information.",
      "simpleIdea": "Perpendicular unit directions make decompositions cleaner and reduce duplicate information. The practical point is to understand what orthogonality and orthonormal bases lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Orthogonality and orthonormal bases belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Orthogonality and orthonormal bases.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Orthogonality and orthonormal bases matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, orthogonality and orthonormal bases can be used to interpret perpendicular unit directions make decompositions cleaner and reduce duplicate information.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "projections",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Projections",
      "summary": "Projections drop a vector onto a subspace, keeping the part that matches chosen directions.",
      "simpleIdea": "Projections drop a vector onto a subspace, keeping the part that matches chosen directions. The practical point is to understand what projections lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Projections belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Projections.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Projections matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, projections can be used to interpret projections drop a vector onto a subspace, keeping the part that matches chosen directions.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "rank-and-null-space",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Rank and null space",
      "summary": "Rank counts independent output directions; the null space contains inputs a matrix maps to zero.",
      "simpleIdea": "Rank counts independent output directions; the null space contains inputs a matrix maps to zero. The practical point is to understand what rank and null space lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Rank and null space belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Rank and null space.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Rank and null space matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, rank and null space can be used to interpret rank counts independent output directions; the null space contains inputs a matrix maps to zero.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "trace-and-determinant",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Trace and determinant",
      "summary": "Trace summarizes diagonal action, while determinant describes volume scaling and invertibility.",
      "simpleIdea": "Trace summarizes diagonal action, while determinant describes volume scaling and invertibility. The practical point is to understand what trace and determinant lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Trace and determinant belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Trace and determinant.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Trace and determinant matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, trace and determinant can be used to interpret trace summarizes diagonal action, while determinant describes volume scaling and invertibility.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "positive-semidefinite-matrices",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Positive-semidefinite matrices",
      "summary": "These matrices never produce negative quadratic forms and often represent covariance, kernels, or curvature.",
      "simpleIdea": "These matrices never produce negative quadratic forms and often represent covariance, kernels, or curvature. The practical point is to understand what positive-semidefinite matrices lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Positive-semidefinite matrices belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Positive-semidefinite matrices.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Positive-semidefinite matrices matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, positive-semidefinite matrices can be used to interpret these matrices never produce negative quadratic forms and often represent covariance, kernels, or curvature.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "eigenvalues-and-eigenvectors",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Eigenvalues and eigenvectors",
      "summary": "Eigenvectors keep their direction under a transformation, and eigenvalues say how much they scale.",
      "simpleIdea": "Eigenvectors keep their direction under a transformation, and eigenvalues say how much they scale. The practical point is to understand what eigenvalues and eigenvectors lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Eigenvalues and eigenvectors belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Eigenvalues and eigenvectors.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Eigenvalues and eigenvectors matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, eigenvalues and eigenvectors can be used to interpret eigenvectors keep their direction under a transformation, and eigenvalues say how much they scale.",
      "resources": [
        {
          "label": "Wikipedia: Eigenvalues and eigenvectors",
          "url": "https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors"
        }
      ]
    },
    {
      "id": "eigendecomposition",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Eigendecomposition",
      "summary": "Decomposes a matrix into special directions, useful for covariance analysis and dynamics.",
      "simpleIdea": "Decomposes a matrix into special directions, useful for covariance analysis and dynamics. The practical point is to understand what eigendecomposition lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Eigendecomposition belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Eigendecomposition.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Eigendecomposition matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, eigendecomposition can be used to interpret decomposes a matrix into special directions, useful for covariance analysis and dynamics.",
      "resources": [
        {
          "label": "Wikipedia: Eigendecomposition",
          "url": "https://en.wikipedia.org/wiki/Eigendecomposition_of_a_matrix"
        }
      ]
    },
    {
      "id": "singular-value-decomposition",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Singular value decomposition",
      "summary": "SVD factors any matrix into rotations and scalings, revealing rank, structure, and compression opportunities.",
      "simpleIdea": "SVD factors any matrix into rotations and scalings, revealing rank, structure, and compression opportunities. The practical point is to understand what singular value decomposition lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Singular value decomposition belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Singular value decomposition.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Singular value decomposition matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, singular value decomposition can be used to interpret sVD factors any matrix into rotations and scalings, revealing rank, structure, and compression opportunities.",
      "resources": [
        {
          "label": "Wikipedia: Singular value decomposition",
          "url": "https://en.wikipedia.org/wiki/Singular_value_decomposition"
        }
      ]
    },
    {
      "id": "low-rank-approximation",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Low-rank approximation",
      "summary": "Keeps the strongest directions while discarding weaker ones, which supports compression and denoising.",
      "simpleIdea": "Keeps the strongest directions while discarding weaker ones, which supports compression and denoising. The practical point is to understand what low-rank approximation lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Low-rank approximation belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Low-rank approximation.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Low-rank approximation matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, low-rank approximation can be used to interpret keeps the strongest directions while discarding weaker ones, which supports compression and denoising.",
      "resources": [
        {
          "label": "Wikipedia: Low-rank approximation",
          "url": "https://en.wikipedia.org/wiki/Low-rank_approximation"
        }
      ]
    },
    {
      "id": "sparse-matrices",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Sparse matrices",
      "summary": "Store mostly-zero data efficiently, common in text, graphs, recommendations, and large feature spaces.",
      "simpleIdea": "Store mostly-zero data efficiently, common in text, graphs, recommendations, and large feature spaces. The practical point is to understand what sparse matrices lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Sparse matrices belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Sparse matrices.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Sparse matrices matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, sparse matrices can be used to interpret store mostly-zero data efficiently, common in text, graphs, recommendations, and large feature spaces.",
      "resources": [
        {
          "label": "Wikipedia: Sparse matrices",
          "url": "https://en.wikipedia.org/wiki/Sparse_matrix"
        }
      ]
    },
    {
      "id": "matrix-calculus",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Matrix calculus",
      "summary": "Extends derivatives to vectors and matrices so model parameters can be optimized.",
      "simpleIdea": "Extends derivatives to vectors and matrices so model parameters can be optimized. The practical point is to understand what matrix calculus lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Matrix calculus belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Matrix calculus.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Matrix calculus matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, matrix calculus can be used to interpret extends derivatives to vectors and matrices so model parameters can be optimized.",
      "resources": [
        {
          "label": "Wikipedia: Matrix calculus",
          "url": "https://en.wikipedia.org/wiki/Matrix_calculus"
        }
      ]
    },
    {
      "id": "jacobians-and-hessians",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Jacobians and Hessians",
      "summary": "Jacobians describe first-order vector sensitivity; Hessians describe curvature and second-order change.",
      "simpleIdea": "Jacobians describe first-order vector sensitivity; Hessians describe curvature and second-order change. The practical point is to understand what jacobians and hessians lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Jacobians and Hessians belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Jacobians and Hessians.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Jacobians and Hessians matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, jacobians and hessians can be used to interpret jacobians describe first-order vector sensitivity; Hessians describe curvature and second-order change.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "kronecker-products",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Kronecker products",
      "summary": "Build large structured matrices from smaller ones, useful in tensor operations and efficient approximations.",
      "simpleIdea": "Build large structured matrices from smaller ones, useful in tensor operations and efficient approximations. The practical point is to understand what kronecker products lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Kronecker products belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Kronecker products.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Kronecker products matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, kronecker products can be used to interpret build large structured matrices from smaller ones, useful in tensor operations and efficient approximations.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "einstein-summation",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Einstein summation",
      "summary": "A compact notation for tensor contractions that makes high-dimensional operations easier to express.",
      "simpleIdea": "A compact notation for tensor contractions that makes high-dimensional operations easier to express. The practical point is to understand what einstein summation lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Einstein summation belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Einstein summation.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Einstein summation matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, einstein summation can be used to interpret a compact notation for tensor contractions that makes high-dimensional operations easier to express.",
      "resources": [
        {
          "label": "Wikipedia: Einstein summation",
          "url": "https://en.wikipedia.org/wiki/Einstein_notation"
        }
      ]
    },
    {
      "id": "numerical-conditioning",
      "group": "linear-algebra",
      "section": "The simple idea",
      "title": "Numerical conditioning",
      "summary": "Measures how much errors are amplified, which affects stability and trustworthy computation.",
      "simpleIdea": "Measures how much errors are amplified, which affects stability and trustworthy computation. The practical point is to understand what numerical conditioning lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Numerical conditioning belongs to numeric representations, geometry, transformations, and high-dimensional structure. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Numerical conditioning.",
        "A small worked example you can compute by hand.",
        "where this shows up in embeddings, neural network layers, PCA, attention, kernels, or numerical computation",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Numerical conditioning matters for AI because makes AI data and model parameters manipulable as vectors, matrices, tensors, and transformations. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a model implementation, numerical conditioning can be used to interpret measures how much errors are amplified, which affects stability and trustworthy computation.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Linear Algebra",
          "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        }
      ]
    },
    {
      "id": "limits-and-continuity",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Limits and continuity",
      "summary": "Limits describe behavior near a point, and continuity means small input changes do not cause jumps.",
      "simpleIdea": "Limits describe behavior near a point, and continuity means small input changes do not cause jumps. The practical point is to understand what limits and continuity lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Limits and continuity belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Limits and continuity.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Limits and continuity matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, limits and continuity can be used to interpret limits describe behavior near a point, and continuity means small input changes do not cause jumps.",
      "resources": [
        {
          "label": "The Matrix Calculus You Need For Deep Learning",
          "url": "https://explained.ai/matrix-calculus/"
        }
      ]
    },
    {
      "id": "derivatives-and-partial-derivatives",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Derivatives and partial derivatives",
      "summary": "Derivatives measure change; partial derivatives isolate one variable while holding others fixed.",
      "simpleIdea": "Derivatives measure change; partial derivatives isolate one variable while holding others fixed. The practical point is to understand what derivatives and partial derivatives lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Derivatives and partial derivatives belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Derivatives and partial derivatives.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Derivatives and partial derivatives matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, derivatives and partial derivatives can be used to interpret derivatives measure change; partial derivatives isolate one variable while holding others fixed.",
      "resources": [
        {
          "label": "The Matrix Calculus You Need For Deep Learning",
          "url": "https://explained.ai/matrix-calculus/"
        }
      ]
    },
    {
      "id": "product-quotient-and-chain-rules",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Product, quotient, and chain rules",
      "summary": "These rules break complex derivatives into manageable pieces, especially through nested functions.",
      "simpleIdea": "These rules break complex derivatives into manageable pieces, especially through nested functions. The practical point is to understand what product, quotient, and chain rules lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Product, quotient, and chain rules belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Product, quotient, and chain rules.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Product, quotient, and chain rules matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, product, quotient, and chain rules can be used to interpret these rules break complex derivatives into manageable pieces, especially through nested functions.",
      "resources": [
        {
          "label": "The Matrix Calculus You Need For Deep Learning",
          "url": "https://explained.ai/matrix-calculus/"
        }
      ]
    },
    {
      "id": "gradients",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Gradients",
      "summary": "A gradient collects partial derivatives and points in the direction of steepest local increase.",
      "simpleIdea": "A gradient collects partial derivatives and points in the direction of steepest local increase. The practical point is to understand what gradients lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Gradients belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Gradients.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Gradients matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, gradients can be used to interpret a gradient collects partial derivatives and points in the direction of steepest local increase.",
      "resources": [
        {
          "label": "Wikipedia: Gradients",
          "url": "https://en.wikipedia.org/wiki/Gradient"
        }
      ]
    },
    {
      "id": "directional-derivatives",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Directional derivatives",
      "summary": "These measure how a function changes along one chosen direction instead of all directions.",
      "simpleIdea": "These measure how a function changes along one chosen direction instead of all directions. The practical point is to understand what directional derivatives lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Directional derivatives belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Directional derivatives.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Directional derivatives matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, directional derivatives can be used to interpret these measure how a function changes along one chosen direction instead of all directions.",
      "resources": [
        {
          "label": "The Matrix Calculus You Need For Deep Learning",
          "url": "https://explained.ai/matrix-calculus/"
        }
      ]
    },
    {
      "id": "jacobians",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Jacobians",
      "summary": "A Jacobian stores first-order derivatives for vector-valued functions, tracking how each output changes with each input.",
      "simpleIdea": "A Jacobian stores first-order derivatives for vector-valued functions, tracking how each output changes with each input. The practical point is to understand what jacobians lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Jacobians belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Jacobians.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Jacobians matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, jacobians can be used to interpret a Jacobian stores first-order derivatives for vector-valued functions, tracking how each output changes with each input.",
      "resources": [
        {
          "label": "The Matrix Calculus You Need For Deep Learning",
          "url": "https://explained.ai/matrix-calculus/"
        }
      ]
    },
    {
      "id": "hessians",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Hessians",
      "summary": "A Hessian stores second-order derivatives and describes curvature, sharpness, and local optimization geometry.",
      "simpleIdea": "A Hessian stores second-order derivatives and describes curvature, sharpness, and local optimization geometry. The practical point is to understand what hessians lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Hessians belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Hessians.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Hessians matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, hessians can be used to interpret a Hessian stores second-order derivatives and describes curvature, sharpness, and local optimization geometry.",
      "resources": [
        {
          "label": "The Matrix Calculus You Need For Deep Learning",
          "url": "https://explained.ai/matrix-calculus/"
        }
      ]
    },
    {
      "id": "taylor-approximation",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Taylor approximation",
      "summary": "Taylor formulas approximate a function near a point using value, slope, and sometimes curvature.",
      "simpleIdea": "Taylor formulas approximate a function near a point using value, slope, and sometimes curvature. The practical point is to understand what taylor approximation lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Taylor approximation belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Taylor approximation.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Taylor approximation matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, taylor approximation can be used to interpret taylor formulas approximate a function near a point using value, slope, and sometimes curvature.",
      "resources": [
        {
          "label": "Wikipedia: Taylor approximation",
          "url": "https://en.wikipedia.org/wiki/Taylor%27s_theorem"
        }
      ]
    },
    {
      "id": "multivariable-integration",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Multivariable integration",
      "summary": "Integrates quantities over areas, volumes, or higher-dimensional spaces.",
      "simpleIdea": "Integrates quantities over areas, volumes, or higher-dimensional spaces. The practical point is to understand what multivariable integration lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Multivariable integration belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Multivariable integration.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Multivariable integration matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, multivariable integration can be used to interpret integrates quantities over areas, volumes, or higher-dimensional spaces.",
      "resources": [
        {
          "label": "The Matrix Calculus You Need For Deep Learning",
          "url": "https://explained.ai/matrix-calculus/"
        }
      ]
    },
    {
      "id": "change-of-variables",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Change of variables",
      "summary": "Re-expresses integrals or densities in new coordinates while correcting for volume distortion.",
      "simpleIdea": "Re-expresses integrals or densities in new coordinates while correcting for volume distortion. The practical point is to understand what change of variables lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Change of variables belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Change of variables.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Change of variables matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, change of variables can be used to interpret re-expresses integrals or densities in new coordinates while correcting for volume distortion.",
      "resources": [
        {
          "label": "Wikipedia: Change of variables",
          "url": "https://en.wikipedia.org/wiki/Change_of_variables"
        }
      ]
    },
    {
      "id": "ordinary-differential-equations",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Ordinary differential equations",
      "summary": "Describe systems whose state changes over continuous time according to deterministic rules.",
      "simpleIdea": "Describe systems whose state changes over continuous time according to deterministic rules. The practical point is to understand what ordinary differential equations lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Ordinary differential equations belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Ordinary differential equations.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Ordinary differential equations matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, ordinary differential equations can be used to interpret describe systems whose state changes over continuous time according to deterministic rules.",
      "resources": [
        {
          "label": "Wikipedia: Ordinary differential equations",
          "url": "https://en.wikipedia.org/wiki/Ordinary_differential_equation"
        }
      ]
    },
    {
      "id": "stochastic-differential-equations",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Stochastic differential equations",
      "summary": "Add random noise to continuous-time dynamics, useful for diffusion and uncertainty models.",
      "simpleIdea": "Add random noise to continuous-time dynamics, useful for diffusion and uncertainty models. The practical point is to understand what stochastic differential equations lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Stochastic differential equations belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Stochastic differential equations.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Stochastic differential equations matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, stochastic differential equations can be used to interpret add random noise to continuous-time dynamics, useful for diffusion and uncertainty models.",
      "resources": [
        {
          "label": "Wikipedia: Stochastic differential equations",
          "url": "https://en.wikipedia.org/wiki/Stochastic_differential_equation"
        }
      ]
    },
    {
      "id": "automatic-differentiation",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Automatic differentiation",
      "summary": "Computes exact derivatives of programs by applying calculus rules to the computation graph.",
      "simpleIdea": "Computes exact derivatives of programs by applying calculus rules to the computation graph. The practical point is to understand what automatic differentiation lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Automatic differentiation belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Automatic differentiation.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Automatic differentiation matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, automatic differentiation can be used to interpret computes exact derivatives of programs by applying calculus rules to the computation graph.",
      "resources": [
        {
          "label": "Wikipedia: Automatic differentiation",
          "url": "https://en.wikipedia.org/wiki/Automatic_differentiation"
        }
      ]
    },
    {
      "id": "forward-mode-and-reverse-mode-autodiff",
      "group": "calculus-and-matrix-calculus",
      "section": "The simple idea",
      "title": "Forward-mode and reverse-mode autodiff",
      "summary": "Forward mode is efficient for few inputs; reverse mode is efficient for many parameters and one loss.",
      "simpleIdea": "Forward mode is efficient for few inputs; reverse mode is efficient for many parameters and one loss. The practical point is to understand what forward-mode and reverse-mode autodiff lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Forward-mode and reverse-mode autodiff belongs to rates of change, sensitivity, curvature, and differentiable programs. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Forward-mode and reverse-mode autodiff.",
        "A small worked example you can compute by hand.",
        "how this supports gradients, backpropagation, automatic differentiation, continuous dynamics, or training stability",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Forward-mode and reverse-mode autodiff matters for AI because explains how changing inputs or parameters changes losses, outputs, and trajectories. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "During training, forward-mode and reverse-mode autodiff can be used to interpret forward mode is efficient for few inputs; reverse mode is efficient for many parameters and one loss.",
      "resources": [
        {
          "label": "The Matrix Calculus You Need For Deep Learning",
          "url": "https://explained.ai/matrix-calculus/"
        }
      ]
    },
    {
      "id": "sample-spaces-and-events",
      "group": "probability",
      "section": "The simple idea",
      "title": "Sample spaces and events",
      "summary": "The sample space lists possible outcomes; an event is a subset of outcomes you care about.",
      "simpleIdea": "The sample space lists possible outcomes; an event is a subset of outcomes you care about. The practical point is to understand what sample spaces and events lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Sample spaces and events belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Sample spaces and events.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Sample spaces and events matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, sample spaces and events can be used to interpret the sample space lists possible outcomes; an event is a subset of outcomes you care about.",
      "resources": [
        {
          "label": "Seeing Theory",
          "url": "https://seeing-theory.brown.edu/"
        }
      ]
    },
    {
      "id": "conditional-probability",
      "group": "probability",
      "section": "The simple idea",
      "title": "Conditional probability",
      "summary": "Updates the chance of an event after you know another event has occurred.",
      "simpleIdea": "Updates the chance of an event after you know another event has occurred. The practical point is to understand what conditional probability lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Conditional probability belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Conditional probability.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Conditional probability matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, conditional probability can be used to interpret updates the chance of an event after you know another event has occurred.",
      "resources": [
        {
          "label": "Wikipedia: Conditional probability",
          "url": "https://en.wikipedia.org/wiki/Conditional_probability"
        }
      ]
    },
    {
      "id": "independence-and-conditional-independence",
      "group": "probability",
      "section": "The simple idea",
      "title": "Independence and conditional independence",
      "summary": "Independence means one event gives no information about another; conditional independence means that after controlling for a third variable.",
      "simpleIdea": "Independence means one event gives no information about another; conditional independence means that after controlling for a third variable. The practical point is to understand what independence and conditional independence lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Independence and conditional independence belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Independence and conditional independence.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Independence and conditional independence matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, independence and conditional independence can be used to interpret independence means one event gives no information about another; conditional independence means that after controlling for a third variable.",
      "resources": [
        {
          "label": "Seeing Theory",
          "url": "https://seeing-theory.brown.edu/"
        }
      ]
    },
    {
      "id": "random-variables",
      "group": "probability",
      "section": "The simple idea",
      "title": "Random variables",
      "summary": "Functions that assign numeric or categorical values to uncertain outcomes.",
      "simpleIdea": "Functions that assign numeric or categorical values to uncertain outcomes. The practical point is to understand what random variables lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Random variables belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Random variables.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Random variables matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, random variables can be used to interpret functions that assign numeric or categorical values to uncertain outcomes.",
      "resources": [
        {
          "label": "Wikipedia: Random variables",
          "url": "https://en.wikipedia.org/wiki/Random_variable"
        }
      ]
    },
    {
      "id": "probability-mass-and-density-functions",
      "group": "probability",
      "section": "The simple idea",
      "title": "Probability mass and density functions",
      "summary": "PMFs handle discrete outcomes; densities describe continuous outcomes through areas under a curve.",
      "simpleIdea": "PMFs handle discrete outcomes; densities describe continuous outcomes through areas under a curve. The practical point is to understand what probability mass and density functions lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Probability mass and density functions belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Probability mass and density functions.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Probability mass and density functions matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, probability mass and density functions can be used to interpret pMFs handle discrete outcomes; densities describe continuous outcomes through areas under a curve.",
      "resources": [
        {
          "label": "Seeing Theory",
          "url": "https://seeing-theory.brown.edu/"
        }
      ]
    },
    {
      "id": "cumulative-distributions",
      "group": "probability",
      "section": "The simple idea",
      "title": "Cumulative distributions",
      "summary": "Give the probability that a random variable is less than or equal to a value.",
      "simpleIdea": "Give the probability that a random variable is less than or equal to a value. The practical point is to understand what cumulative distributions lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Cumulative distributions belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Cumulative distributions.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Cumulative distributions matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, cumulative distributions can be used to interpret give the probability that a random variable is less than or equal to a value.",
      "resources": [
        {
          "label": "Seeing Theory",
          "url": "https://seeing-theory.brown.edu/"
        }
      ]
    },
    {
      "id": "joint-marginal-and-conditional-distributions",
      "group": "probability",
      "section": "The simple idea",
      "title": "Joint, marginal, and conditional distributions",
      "summary": "Joint distributions model variables together, marginals focus on one variable, and conditionals update one variable given another.",
      "simpleIdea": "Joint distributions model variables together, marginals focus on one variable, and conditionals update one variable given another. The practical point is to understand what joint, marginal, and conditional distributions lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Joint, marginal, and conditional distributions belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Joint, marginal, and conditional distributions.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Joint, marginal, and conditional distributions matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, joint, marginal, and conditional distributions can be used to interpret joint distributions model variables together, marginals focus on one variable, and conditionals update one variable given another.",
      "resources": [
        {
          "label": "Seeing Theory",
          "url": "https://seeing-theory.brown.edu/"
        }
      ]
    },
    {
      "id": "expectation",
      "group": "probability",
      "section": "The simple idea",
      "title": "Expectation",
      "summary": "The long-run average value of a random variable under its distribution.",
      "simpleIdea": "The long-run average value of a random variable under its distribution. The practical point is to understand what expectation lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Expectation belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Expectation.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Expectation matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, expectation can be used to interpret the long-run average value of a random variable under its distribution.",
      "resources": [
        {
          "label": "Seeing Theory",
          "url": "https://seeing-theory.brown.edu/"
        }
      ]
    },
    {
      "id": "variance-and-covariance",
      "group": "probability",
      "section": "The simple idea",
      "title": "Variance and covariance",
      "summary": "Variance measures spread; covariance measures how two variables move together.",
      "simpleIdea": "Variance measures spread; covariance measures how two variables move together. The practical point is to understand what variance and covariance lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Variance and covariance belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Variance and covariance.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Variance and covariance matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, variance and covariance can be used to interpret variance measures spread; covariance measures how two variables move together.",
      "resources": [
        {
          "label": "Seeing Theory",
          "url": "https://seeing-theory.brown.edu/"
        }
      ]
    },
    {
      "id": "correlation",
      "group": "probability",
      "section": "The simple idea",
      "title": "Correlation",
      "summary": "A normalized covariance that ranges from negative to positive association.",
      "simpleIdea": "A normalized covariance that ranges from negative to positive association. The practical point is to understand what correlation lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Correlation belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Correlation.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Correlation matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, correlation can be used to interpret a normalized covariance that ranges from negative to positive association.",
      "resources": [
        {
          "label": "Wikipedia: Correlation",
          "url": "https://en.wikipedia.org/wiki/Correlation"
        }
      ]
    },
    {
      "id": "law-of-total-probability",
      "group": "probability",
      "section": "The simple idea",
      "title": "Law of total probability",
      "summary": "Breaks a probability into cases and adds their weighted contributions.",
      "simpleIdea": "Breaks a probability into cases and adds their weighted contributions. The practical point is to understand what law of total probability lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Law of total probability belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Law of total probability.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Law of total probability matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, law of total probability can be used to interpret breaks a probability into cases and adds their weighted contributions.",
      "resources": [
        {
          "label": "Wikipedia: Law of total probability",
          "url": "https://en.wikipedia.org/wiki/Law_of_total_probability"
        }
      ]
    },
    {
      "id": "bayes-theorem",
      "group": "probability",
      "section": "The simple idea",
      "title": "Bayes' theorem",
      "summary": "Reverses conditioning so evidence can update beliefs about hidden causes.",
      "simpleIdea": "Reverses conditioning so evidence can update beliefs about hidden causes. The practical point is to understand what bayes' theorem lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Bayes' theorem belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Bayes' theorem.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Bayes' theorem matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, bayes' theorem can be used to interpret reverses conditioning so evidence can update beliefs about hidden causes.",
      "resources": [
        {
          "label": "Wikipedia: Bayes' theorem",
          "url": "https://en.wikipedia.org/wiki/Bayes%27_theorem"
        }
      ]
    },
    {
      "id": "law-of-large-numbers",
      "group": "probability",
      "section": "The simple idea",
      "title": "Law of large numbers",
      "summary": "Sample averages converge toward expected values as sample size grows.",
      "simpleIdea": "Sample averages converge toward expected values as sample size grows. The practical point is to understand what law of large numbers lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Law of large numbers belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Law of large numbers.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Law of large numbers matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, law of large numbers can be used to interpret sample averages converge toward expected values as sample size grows.",
      "resources": [
        {
          "label": "Wikipedia: Law of large numbers",
          "url": "https://en.wikipedia.org/wiki/Law_of_large_numbers"
        }
      ]
    },
    {
      "id": "central-limit-theorem",
      "group": "probability",
      "section": "The simple idea",
      "title": "Central limit theorem",
      "summary": "Many averaged random effects become approximately Gaussian under broad conditions.",
      "simpleIdea": "Many averaged random effects become approximately Gaussian under broad conditions. The practical point is to understand what central limit theorem lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Central limit theorem belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Central limit theorem.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Central limit theorem matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, central limit theorem can be used to interpret many averaged random effects become approximately Gaussian under broad conditions.",
      "resources": [
        {
          "label": "Wikipedia: Central limit theorem",
          "url": "https://en.wikipedia.org/wiki/Central_limit_theorem"
        }
      ]
    },
    {
      "id": "markov-chains",
      "group": "probability",
      "section": "The simple idea",
      "title": "Markov chains",
      "summary": "Model sequences where the next state depends on the current state, not the full history.",
      "simpleIdea": "Model sequences where the next state depends on the current state, not the full history. The practical point is to understand what markov chains lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Markov chains belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Markov chains.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Markov chains matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, markov chains can be used to interpret model sequences where the next state depends on the current state, not the full history.",
      "resources": [
        {
          "label": "Wikipedia: Markov chains",
          "url": "https://en.wikipedia.org/wiki/Markov_chain"
        }
      ]
    },
    {
      "id": "markov-processes",
      "group": "probability",
      "section": "The simple idea",
      "title": "Markov processes",
      "summary": "Generalize memoryless state transitions over time.",
      "simpleIdea": "Generalize memoryless state transitions over time. The practical point is to understand what markov processes lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Markov processes belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Markov processes.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Markov processes matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, markov processes can be used to interpret generalize memoryless state transitions over time.",
      "resources": [
        {
          "label": "Seeing Theory",
          "url": "https://seeing-theory.brown.edu/"
        }
      ]
    },
    {
      "id": "monte-carlo-estimation",
      "group": "probability",
      "section": "The simple idea",
      "title": "Monte Carlo estimation",
      "summary": "Uses random samples to approximate expectations or probabilities that are hard to compute exactly.",
      "simpleIdea": "Uses random samples to approximate expectations or probabilities that are hard to compute exactly. The practical point is to understand what monte carlo estimation lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Monte Carlo estimation belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Monte Carlo estimation.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Monte Carlo estimation matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, monte carlo estimation can be used to interpret uses random samples to approximate expectations or probabilities that are hard to compute exactly.",
      "resources": [
        {
          "label": "Seeing Theory",
          "url": "https://seeing-theory.brown.edu/"
        }
      ]
    },
    {
      "id": "importance-sampling",
      "group": "probability",
      "section": "The simple idea",
      "title": "Importance sampling",
      "summary": "Samples from a more convenient distribution and reweights samples to estimate the target distribution.",
      "simpleIdea": "Samples from a more convenient distribution and reweights samples to estimate the target distribution. The practical point is to understand what importance sampling lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Importance sampling belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Importance sampling.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Importance sampling matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, importance sampling can be used to interpret samples from a more convenient distribution and reweights samples to estimate the target distribution.",
      "resources": [
        {
          "label": "Wikipedia: Importance sampling",
          "url": "https://en.wikipedia.org/wiki/Importance_sampling"
        }
      ]
    },
    {
      "id": "rejection-sampling",
      "group": "probability",
      "section": "The simple idea",
      "title": "Rejection sampling",
      "summary": "Samples from a proposal distribution and accepts only samples that fit the target shape.",
      "simpleIdea": "Samples from a proposal distribution and accepts only samples that fit the target shape. The practical point is to understand what rejection sampling lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Rejection sampling belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Rejection sampling.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Rejection sampling matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, rejection sampling can be used to interpret samples from a proposal distribution and accepts only samples that fit the target shape.",
      "resources": [
        {
          "label": "Wikipedia: Rejection sampling",
          "url": "https://en.wikipedia.org/wiki/Rejection_sampling"
        }
      ]
    },
    {
      "id": "bernoulli",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Bernoulli",
      "summary": "Models one yes-or-no trial, such as click or no click.",
      "simpleIdea": "Models one yes-or-no trial, such as click or no click. The practical point is to understand what bernoulli lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Bernoulli belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Bernoulli.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Bernoulli matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, bernoulli can be used to interpret models one yes-or-no trial, such as click or no click.",
      "resources": [
        {
          "label": "Wikipedia: Bernoulli",
          "url": "https://en.wikipedia.org/wiki/Bernoulli_distribution"
        }
      ]
    },
    {
      "id": "binomial",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Binomial",
      "summary": "Counts successes across a fixed number of Bernoulli trials.",
      "simpleIdea": "Counts successes across a fixed number of Bernoulli trials. The practical point is to understand what binomial lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Binomial belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Binomial.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Binomial matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, binomial can be used to interpret counts successes across a fixed number of Bernoulli trials.",
      "resources": [
        {
          "label": "Wikipedia: Binomial",
          "url": "https://en.wikipedia.org/wiki/Binomial_distribution"
        }
      ]
    },
    {
      "id": "categorical",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Categorical",
      "summary": "Models one choice among several classes.",
      "simpleIdea": "Models one choice among several classes. The practical point is to understand what categorical lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Categorical belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Categorical.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Categorical matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, categorical can be used to interpret models one choice among several classes.",
      "resources": [
        {
          "label": "Wikipedia: Categorical",
          "url": "https://en.wikipedia.org/wiki/Categorical_distribution"
        }
      ]
    },
    {
      "id": "multinomial",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Multinomial",
      "summary": "Counts how many times each class appears across repeated categorical trials.",
      "simpleIdea": "Counts how many times each class appears across repeated categorical trials. The practical point is to understand what multinomial lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Multinomial belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Multinomial.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Multinomial matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, multinomial can be used to interpret counts how many times each class appears across repeated categorical trials.",
      "resources": [
        {
          "label": "Wikipedia: Multinomial",
          "url": "https://en.wikipedia.org/wiki/Multinomial_distribution"
        }
      ]
    },
    {
      "id": "uniform",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Uniform",
      "summary": "Gives equal probability to each value in a range or set.",
      "simpleIdea": "Gives equal probability to each value in a range or set. The practical point is to understand what uniform lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Uniform belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Uniform.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Uniform matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, uniform can be used to interpret gives equal probability to each value in a range or set.",
      "resources": [
        {
          "label": "Wikipedia: Uniform",
          "url": "https://en.wikipedia.org/wiki/Continuous_uniform_distribution"
        }
      ]
    },
    {
      "id": "gaussian",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Gaussian",
      "summary": "Models bell-shaped continuous variation around a mean.",
      "simpleIdea": "Models bell-shaped continuous variation around a mean. The practical point is to understand what gaussian lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Gaussian belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Gaussian.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Gaussian matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, gaussian can be used to interpret models bell-shaped continuous variation around a mean.",
      "resources": [
        {
          "label": "Wikipedia: Gaussian",
          "url": "https://en.wikipedia.org/wiki/Normal_distribution"
        }
      ]
    },
    {
      "id": "multivariate-gaussian",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Multivariate Gaussian",
      "summary": "Extends Gaussian structure to vectors with covariance between dimensions.",
      "simpleIdea": "Extends Gaussian structure to vectors with covariance between dimensions. The practical point is to understand what multivariate gaussian lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Multivariate Gaussian belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Multivariate Gaussian.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Multivariate Gaussian matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, multivariate gaussian can be used to interpret extends Gaussian structure to vectors with covariance between dimensions.",
      "resources": [
        {
          "label": "Wikipedia: Multivariate Gaussian",
          "url": "https://en.wikipedia.org/wiki/Multivariate_normal_distribution"
        }
      ]
    },
    {
      "id": "poisson",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Poisson",
      "summary": "Counts events occurring in a fixed interval when events are rare and independent.",
      "simpleIdea": "Counts events occurring in a fixed interval when events are rare and independent. The practical point is to understand what poisson lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Poisson belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Poisson.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Poisson matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, poisson can be used to interpret counts events occurring in a fixed interval when events are rare and independent.",
      "resources": [
        {
          "label": "Wikipedia: Poisson",
          "url": "https://en.wikipedia.org/wiki/Poisson_distribution"
        }
      ]
    },
    {
      "id": "exponential",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Exponential",
      "summary": "Models waiting time between events in a Poisson process.",
      "simpleIdea": "Models waiting time between events in a Poisson process. The practical point is to understand what exponential lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Exponential belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Exponential.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Exponential matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, exponential can be used to interpret models waiting time between events in a Poisson process.",
      "resources": [
        {
          "label": "Wikipedia: Exponential",
          "url": "https://en.wikipedia.org/wiki/Exponential_distribution"
        }
      ]
    },
    {
      "id": "beta",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Beta",
      "summary": "Models uncertainty over a probability between zero and one.",
      "simpleIdea": "Models uncertainty over a probability between zero and one. The practical point is to understand what beta lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Beta belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Beta.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Beta matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, beta can be used to interpret models uncertainty over a probability between zero and one.",
      "resources": [
        {
          "label": "Wikipedia: Beta",
          "url": "https://en.wikipedia.org/wiki/Beta_distribution"
        }
      ]
    },
    {
      "id": "gamma",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Gamma",
      "summary": "Models positive continuous quantities such as waiting times or rates.",
      "simpleIdea": "Models positive continuous quantities such as waiting times or rates. The practical point is to understand what gamma lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Gamma belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Gamma.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Gamma matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, gamma can be used to interpret models positive continuous quantities such as waiting times or rates.",
      "resources": [
        {
          "label": "Wikipedia: Gamma",
          "url": "https://en.wikipedia.org/wiki/Gamma_distribution"
        }
      ]
    },
    {
      "id": "dirichlet",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Dirichlet",
      "summary": "Models uncertainty over a vector of probabilities that sum to one.",
      "simpleIdea": "Models uncertainty over a vector of probabilities that sum to one. The practical point is to understand what dirichlet lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Dirichlet belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Dirichlet.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Dirichlet matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, dirichlet can be used to interpret models uncertainty over a vector of probabilities that sum to one.",
      "resources": [
        {
          "label": "Wikipedia: Dirichlet",
          "url": "https://en.wikipedia.org/wiki/Dirichlet_distribution"
        }
      ]
    },
    {
      "id": "student-s-t",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Student's t",
      "summary": "Handles heavier-tailed uncertainty, often when sample sizes are small.",
      "simpleIdea": "Handles heavier-tailed uncertainty, often when sample sizes are small. The practical point is to understand what student's t lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Student's t belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Student's t.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Student's t matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, student's t can be used to interpret handles heavier-tailed uncertainty, often when sample sizes are small.",
      "resources": [
        {
          "label": "Wikipedia: Student's t",
          "url": "https://en.wikipedia.org/wiki/Student%27s_t-distribution"
        }
      ]
    },
    {
      "id": "log-normal",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Log-normal",
      "summary": "Models positive values whose logarithm is Gaussian.",
      "simpleIdea": "Models positive values whose logarithm is Gaussian. The practical point is to understand what log-normal lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Log-normal belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Log-normal.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Log-normal matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, log-normal can be used to interpret models positive values whose logarithm is Gaussian.",
      "resources": [
        {
          "label": "Wikipedia: Log-normal",
          "url": "https://en.wikipedia.org/wiki/Log-normal_distribution"
        }
      ]
    },
    {
      "id": "gumbel",
      "group": "probability",
      "section": "Essential formulas",
      "title": "Gumbel",
      "summary": "Models extremes and appears in differentiable sampling tricks.",
      "simpleIdea": "Models extremes and appears in differentiable sampling tricks. The practical point is to understand what gumbel lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Gumbel belongs to uncertainty, sampling, distributions, and evidence. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Gumbel.",
        "A small worked example you can compute by hand.",
        "how this supports probabilistic predictions, generative models, uncertainty estimates, sampling, or Bayesian reasoning",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Gumbel matters for AI because lets AI systems represent uncertainty, update beliefs, and reason about likely outcomes. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a probabilistic model, gumbel can be used to interpret models extremes and appears in differentiable sampling tricks.",
      "resources": [
        {
          "label": "Wikipedia: Gumbel",
          "url": "https://en.wikipedia.org/wiki/Gumbel_distribution"
        }
      ]
    },
    {
      "id": "populations-and-samples",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Populations and samples",
      "summary": "The population is what you want to understand; the sample is the data you actually observe.",
      "simpleIdea": "The population is what you want to understand; the sample is the data you actually observe. The practical point is to understand what populations and samples lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Populations and samples belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Populations and samples.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Populations and samples matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, populations and samples can be used to interpret the population is what you want to understand; the sample is the data you actually observe.",
      "resources": [
        {
          "label": "OpenIntro Statistics",
          "url": "https://www.openintro.org/book/os/"
        }
      ]
    },
    {
      "id": "bias-and-variance",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Bias and variance",
      "summary": "Bias is systematic error; variance is sensitivity to the particular sample or training data.",
      "simpleIdea": "Bias is systematic error; variance is sensitivity to the particular sample or training data. The practical point is to understand what bias and variance lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Bias and variance belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Bias and variance.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Bias and variance matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, bias and variance can be used to interpret bias is systematic error; variance is sensitivity to the particular sample or training data.",
      "resources": [
        {
          "label": "OpenIntro Statistics",
          "url": "https://www.openintro.org/book/os/"
        }
      ]
    },
    {
      "id": "point-estimation",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Point estimation",
      "summary": "Produces a single best estimate of an unknown quantity from data.",
      "simpleIdea": "Produces a single best estimate of an unknown quantity from data. The practical point is to understand what point estimation lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Point estimation belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Point estimation.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Point estimation matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, point estimation can be used to interpret produces a single best estimate of an unknown quantity from data.",
      "resources": [
        {
          "label": "Wikipedia: Point estimation",
          "url": "https://en.wikipedia.org/wiki/Point_estimation"
        }
      ]
    },
    {
      "id": "maximum-likelihood-estimation",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Maximum likelihood estimation",
      "summary": "Chooses parameters that make the observed data most probable under the model.",
      "simpleIdea": "Chooses parameters that make the observed data most probable under the model. The practical point is to understand what maximum likelihood estimation lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Maximum likelihood estimation belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Maximum likelihood estimation.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Maximum likelihood estimation matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, maximum likelihood estimation can be used to interpret chooses parameters that make the observed data most probable under the model.",
      "resources": [
        {
          "label": "Wikipedia: Maximum likelihood estimation",
          "url": "https://en.wikipedia.org/wiki/Maximum_likelihood_estimation"
        }
      ]
    },
    {
      "id": "maximum-a-posteriori-estimation",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Maximum a posteriori estimation",
      "summary": "Combines likelihood with a prior preference over parameters.",
      "simpleIdea": "Combines likelihood with a prior preference over parameters. The practical point is to understand what maximum a posteriori estimation lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Maximum a posteriori estimation belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Maximum a posteriori estimation.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Maximum a posteriori estimation matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, maximum a posteriori estimation can be used to interpret combines likelihood with a prior preference over parameters.",
      "resources": [
        {
          "label": "Wikipedia: Maximum a posteriori estimation",
          "url": "https://en.wikipedia.org/wiki/Maximum_a_posteriori_estimation"
        }
      ]
    },
    {
      "id": "confidence-intervals",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Confidence intervals",
      "summary": "Provide a range that would capture the true value at a stated rate under repeated sampling.",
      "simpleIdea": "Provide a range that would capture the true value at a stated rate under repeated sampling. The practical point is to understand what confidence intervals lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Confidence intervals belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Confidence intervals.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Confidence intervals matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, confidence intervals can be used to interpret provide a range that would capture the true value at a stated rate under repeated sampling.",
      "resources": [
        {
          "label": "Wikipedia: Confidence intervals",
          "url": "https://en.wikipedia.org/wiki/Confidence_interval"
        }
      ]
    },
    {
      "id": "hypothesis-testing",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Hypothesis testing",
      "summary": "Uses data to evaluate whether an observed effect is surprising under a baseline assumption.",
      "simpleIdea": "Uses data to evaluate whether an observed effect is surprising under a baseline assumption. The practical point is to understand what hypothesis testing lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Hypothesis testing belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Hypothesis testing.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Hypothesis testing matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, hypothesis testing can be used to interpret uses data to evaluate whether an observed effect is surprising under a baseline assumption.",
      "resources": [
        {
          "label": "Wikipedia: Hypothesis testing",
          "url": "https://en.wikipedia.org/wiki/Statistical_hypothesis_test"
        }
      ]
    },
    {
      "id": "p-values-and-statistical-power",
      "group": "statistics",
      "section": "The simple idea",
      "title": "p-values and statistical power",
      "summary": "p-values quantify surprise under a null hypothesis; power measures the chance of detecting a real effect.",
      "simpleIdea": "p-values quantify surprise under a null hypothesis; power measures the chance of detecting a real effect. The practical point is to understand what p-values and statistical power lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "p-values and statistical power belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for p-values and statistical power.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "p-values and statistical power matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, p-values and statistical power can be used to interpret p-values quantify surprise under a null hypothesis; power measures the chance of detecting a real effect.",
      "resources": [
        {
          "label": "OpenIntro Statistics",
          "url": "https://www.openintro.org/book/os/"
        }
      ]
    },
    {
      "id": "bootstrap",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Bootstrap",
      "summary": "Resamples observed data to estimate uncertainty without deriving a formula.",
      "simpleIdea": "Resamples observed data to estimate uncertainty without deriving a formula. The practical point is to understand what bootstrap lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Bootstrap belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Bootstrap.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Bootstrap matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, bootstrap can be used to interpret resamples observed data to estimate uncertainty without deriving a formula.",
      "resources": [
        {
          "label": "OpenIntro Statistics",
          "url": "https://www.openintro.org/book/os/"
        }
      ]
    },
    {
      "id": "bayesian-inference",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Bayesian inference",
      "summary": "Updates prior beliefs into posterior beliefs using observed evidence.",
      "simpleIdea": "Updates prior beliefs into posterior beliefs using observed evidence. The practical point is to understand what bayesian inference lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Bayesian inference belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Bayesian inference.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Bayesian inference matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, bayesian inference can be used to interpret updates prior beliefs into posterior beliefs using observed evidence.",
      "resources": [
        {
          "label": "Wikipedia: Bayesian inference",
          "url": "https://en.wikipedia.org/wiki/Bayesian_inference"
        }
      ]
    },
    {
      "id": "conjugate-priors",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Conjugate priors",
      "summary": "Priors that keep posterior calculations in the same distribution family.",
      "simpleIdea": "Priors that keep posterior calculations in the same distribution family. The practical point is to understand what conjugate priors lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Conjugate priors belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Conjugate priors.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Conjugate priors matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, conjugate priors can be used to interpret priors that keep posterior calculations in the same distribution family.",
      "resources": [
        {
          "label": "Wikipedia: Conjugate priors",
          "url": "https://en.wikipedia.org/wiki/Conjugate_prior"
        }
      ]
    },
    {
      "id": "posterior-predictive-distributions",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Posterior predictive distributions",
      "summary": "Predict future observations while accounting for parameter uncertainty.",
      "simpleIdea": "Predict future observations while accounting for parameter uncertainty. The practical point is to understand what posterior predictive distributions lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Posterior predictive distributions belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Posterior predictive distributions.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Posterior predictive distributions matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, posterior predictive distributions can be used to interpret predict future observations while accounting for parameter uncertainty.",
      "resources": [
        {
          "label": "OpenIntro Statistics",
          "url": "https://www.openintro.org/book/os/"
        }
      ]
    },
    {
      "id": "missing-data-mechanisms",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Missing-data mechanisms",
      "summary": "Describe why values are absent, which determines whether simple fixes are safe.",
      "simpleIdea": "Describe why values are absent, which determines whether simple fixes are safe. The practical point is to understand what missing-data mechanisms lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Missing-data mechanisms belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Missing-data mechanisms.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Missing-data mechanisms matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, missing-data mechanisms can be used to interpret describe why values are absent, which determines whether simple fixes are safe.",
      "resources": [
        {
          "label": "OpenIntro Statistics",
          "url": "https://www.openintro.org/book/os/"
        }
      ]
    },
    {
      "id": "experimental-design",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Experimental design",
      "summary": "Plans data collection so comparisons are fair, powered, and interpretable.",
      "simpleIdea": "Plans data collection so comparisons are fair, powered, and interpretable. The practical point is to understand what experimental design lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Experimental design belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Experimental design.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Experimental design matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, experimental design can be used to interpret plans data collection so comparisons are fair, powered, and interpretable.",
      "resources": [
        {
          "label": "Wikipedia: Experimental design",
          "url": "https://en.wikipedia.org/wiki/Design_of_experiments"
        }
      ]
    },
    {
      "id": "multiple-testing-correction",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Multiple-testing correction",
      "summary": "Controls false discoveries when many hypotheses are tested at once.",
      "simpleIdea": "Controls false discoveries when many hypotheses are tested at once. The practical point is to understand what multiple-testing correction lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Multiple-testing correction belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Multiple-testing correction.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Multiple-testing correction matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, multiple-testing correction can be used to interpret controls false discoveries when many hypotheses are tested at once.",
      "resources": [
        {
          "label": "OpenIntro Statistics",
          "url": "https://www.openintro.org/book/os/"
        }
      ]
    },
    {
      "id": "effect-size",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Effect size",
      "summary": "Measures how large a difference is, not just whether it is statistically detectable.",
      "simpleIdea": "Measures how large a difference is, not just whether it is statistically detectable. The practical point is to understand what effect size lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Effect size belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Effect size.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Effect size matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, effect size can be used to interpret measures how large a difference is, not just whether it is statistically detectable.",
      "resources": [
        {
          "label": "Wikipedia: Effect size",
          "url": "https://en.wikipedia.org/wiki/Effect_size"
        }
      ]
    },
    {
      "id": "calibration",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Calibration",
      "summary": "Checks whether predicted probabilities match real-world frequencies.",
      "simpleIdea": "Checks whether predicted probabilities match real-world frequencies. The practical point is to understand what calibration lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Calibration belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Calibration.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Calibration matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, calibration can be used to interpret checks whether predicted probabilities match real-world frequencies.",
      "resources": [
        {
          "label": "Wikipedia: Calibration",
          "url": "https://en.wikipedia.org/wiki/Calibration"
        }
      ]
    },
    {
      "id": "distribution-shift",
      "group": "statistics",
      "section": "The simple idea",
      "title": "Distribution shift",
      "summary": "Occurs when deployment data differs from training or validation data.",
      "simpleIdea": "Occurs when deployment data differs from training or validation data. The practical point is to understand what distribution shift lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Distribution shift belongs to evidence, estimation, uncertainty, experiments, and model evaluation. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Distribution shift.",
        "A small worked example you can compute by hand.",
        "how this supports dataset design, model comparison, calibration, uncertainty estimates, or deployment monitoring",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Distribution shift matters for AI because helps decide whether model behavior is supported by data or is an artifact of sampling noise. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "When evaluating a model, distribution shift can be used to interpret occurs when deployment data differs from training or validation data.",
      "resources": [
        {
          "label": "OpenIntro Statistics",
          "url": "https://www.openintro.org/book/os/"
        }
      ]
    },
    {
      "id": "objectives-losses-and-cost-functions",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Objectives, losses, and cost functions",
      "summary": "These define what the system is trying to minimize, maximize, or balance.",
      "simpleIdea": "These define what the system is trying to minimize, maximize, or balance. The practical point is to understand what objectives, losses, and cost functions lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Objectives, losses, and cost functions belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Objectives, losses, and cost functions.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Objectives, losses, and cost functions matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, objectives, losses, and cost functions can be used to interpret these define what the system is trying to minimize, maximize, or balance.",
      "resources": [
        {
          "label": "Convex Optimization by Boyd and Vandenberghe",
          "url": "https://web.stanford.edu/~boyd/cvxbook/"
        }
      ]
    },
    {
      "id": "parameters-and-decision-variables",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Parameters and decision variables",
      "summary": "Parameters are the adjustable values the optimizer changes.",
      "simpleIdea": "Parameters are the adjustable values the optimizer changes. The practical point is to understand what parameters and decision variables lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Parameters and decision variables belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Parameters and decision variables.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Parameters and decision variables matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, parameters and decision variables can be used to interpret parameters are the adjustable values the optimizer changes.",
      "resources": [
        {
          "label": "Convex Optimization by Boyd and Vandenberghe",
          "url": "https://web.stanford.edu/~boyd/cvxbook/"
        }
      ]
    },
    {
      "id": "unconstrained-and-constrained-optimization",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Unconstrained and constrained optimization",
      "summary": "Unconstrained problems move freely; constrained problems must satisfy rules or limits.",
      "simpleIdea": "Unconstrained problems move freely; constrained problems must satisfy rules or limits. The practical point is to understand what unconstrained and constrained optimization lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Unconstrained and constrained optimization belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Unconstrained and constrained optimization.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Unconstrained and constrained optimization matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, unconstrained and constrained optimization can be used to interpret unconstrained problems move freely; constrained problems must satisfy rules or limits.",
      "resources": [
        {
          "label": "Convex Optimization by Boyd and Vandenberghe",
          "url": "https://web.stanford.edu/~boyd/cvxbook/"
        }
      ]
    },
    {
      "id": "convex-and-non-convex-optimization",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Convex and non-convex optimization",
      "summary": "Convex problems have simpler global structure; non-convex problems can contain many local traps.",
      "simpleIdea": "Convex problems have simpler global structure; non-convex problems can contain many local traps. The practical point is to understand what convex and non-convex optimization lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Convex and non-convex optimization belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Convex and non-convex optimization.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Convex and non-convex optimization matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, convex and non-convex optimization can be used to interpret convex problems have simpler global structure; non-convex problems can contain many local traps.",
      "resources": [
        {
          "label": "Convex Optimization by Boyd and Vandenberghe",
          "url": "https://web.stanford.edu/~boyd/cvxbook/"
        }
      ]
    },
    {
      "id": "local-minima-global-minima-and-saddle-points",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Local minima, global minima, and saddle points",
      "summary": "These describe places where progress can stop or become ambiguous.",
      "simpleIdea": "These describe places where progress can stop or become ambiguous. The practical point is to understand what local minima, global minima, and saddle points lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Local minima, global minima, and saddle points belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Local minima, global minima, and saddle points.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Local minima, global minima, and saddle points matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, local minima, global minima, and saddle points can be used to interpret these describe places where progress can stop or become ambiguous.",
      "resources": [
        {
          "label": "Convex Optimization by Boyd and Vandenberghe",
          "url": "https://web.stanford.edu/~boyd/cvxbook/"
        }
      ]
    },
    {
      "id": "gradient-descent",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Gradient descent",
      "summary": "Moves parameters opposite the gradient to reduce the objective locally.",
      "simpleIdea": "Moves parameters opposite the gradient to reduce the objective locally. The practical point is to understand what gradient descent lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Gradient descent belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Gradient descent.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Gradient descent matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, gradient descent can be used to interpret moves parameters opposite the gradient to reduce the objective locally.",
      "resources": [
        {
          "label": "Wikipedia: Gradient descent",
          "url": "https://en.wikipedia.org/wiki/Gradient_descent"
        }
      ]
    },
    {
      "id": "stochastic-gradient-descent",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Stochastic gradient descent",
      "summary": "Estimates the gradient from small random batches, trading exactness for speed.",
      "simpleIdea": "Estimates the gradient from small random batches, trading exactness for speed. The practical point is to understand what stochastic gradient descent lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Stochastic gradient descent belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Stochastic gradient descent.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Stochastic gradient descent matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, stochastic gradient descent can be used to interpret estimates the gradient from small random batches, trading exactness for speed.",
      "resources": [
        {
          "label": "Wikipedia: Stochastic gradient descent",
          "url": "https://en.wikipedia.org/wiki/Stochastic_gradient_descent"
        }
      ]
    },
    {
      "id": "mini-batch-optimization",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Mini-batch optimization",
      "summary": "Uses batches large enough for stable estimates but small enough for efficient training.",
      "simpleIdea": "Uses batches large enough for stable estimates but small enough for efficient training. The practical point is to understand what mini-batch optimization lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Mini-batch optimization belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Mini-batch optimization.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Mini-batch optimization matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, mini-batch optimization can be used to interpret uses batches large enough for stable estimates but small enough for efficient training.",
      "resources": [
        {
          "label": "Convex Optimization by Boyd and Vandenberghe",
          "url": "https://web.stanford.edu/~boyd/cvxbook/"
        }
      ]
    },
    {
      "id": "learning-rates-and-schedules",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Learning rates and schedules",
      "summary": "Control step size over time, strongly affecting speed and stability.",
      "simpleIdea": "Control step size over time, strongly affecting speed and stability. The practical point is to understand what learning rates and schedules lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Learning rates and schedules belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Learning rates and schedules.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Learning rates and schedules matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, learning rates and schedules can be used to interpret control step size over time, strongly affecting speed and stability.",
      "resources": [
        {
          "label": "Convex Optimization by Boyd and Vandenberghe",
          "url": "https://web.stanford.edu/~boyd/cvxbook/"
        }
      ]
    },
    {
      "id": "momentum-and-adaptive-methods",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Momentum and adaptive methods",
      "summary": "Smooth or rescale updates so optimization handles noisy or uneven gradients better.",
      "simpleIdea": "Smooth or rescale updates so optimization handles noisy or uneven gradients better. The practical point is to understand what momentum and adaptive methods lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Momentum and adaptive methods belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Momentum and adaptive methods.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Momentum and adaptive methods matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, momentum and adaptive methods can be used to interpret smooth or rescale updates so optimization handles noisy or uneven gradients better.",
      "resources": [
        {
          "label": "Convex Optimization by Boyd and Vandenberghe",
          "url": "https://web.stanford.edu/~boyd/cvxbook/"
        }
      ]
    },
    {
      "id": "adam-and-rmsprop",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Adam and RMSProp",
      "summary": "Popular adaptive optimizers that track gradient statistics to scale updates.",
      "simpleIdea": "Popular adaptive optimizers that track gradient statistics to scale updates. The practical point is to understand what adam and rmsprop lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Adam and RMSProp belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Adam and RMSProp.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Adam and RMSProp matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, adam and rmsprop can be used to interpret popular adaptive optimizers that track gradient statistics to scale updates.",
      "resources": [
        {
          "label": "Convex Optimization by Boyd and Vandenberghe",
          "url": "https://web.stanford.edu/~boyd/cvxbook/"
        }
      ]
    },
    {
      "id": "line-search",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Line search",
      "summary": "Chooses a step size by testing how the objective changes along a direction.",
      "simpleIdea": "Chooses a step size by testing how the objective changes along a direction. The practical point is to understand what line search lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Line search belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Line search.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Line search matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, line search can be used to interpret chooses a step size by testing how the objective changes along a direction.",
      "resources": [
        {
          "label": "Wikipedia: Line search",
          "url": "https://en.wikipedia.org/wiki/Line_search"
        }
      ]
    },
    {
      "id": "newton-and-quasi-newton-methods",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Newton and quasi-Newton methods",
      "summary": "Use curvature information to choose more informed update steps.",
      "simpleIdea": "Use curvature information to choose more informed update steps. The practical point is to understand what newton and quasi-newton methods lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Newton and quasi-Newton methods belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Newton and quasi-Newton methods.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Newton and quasi-Newton methods matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, newton and quasi-newton methods can be used to interpret use curvature information to choose more informed update steps.",
      "resources": [
        {
          "label": "Convex Optimization by Boyd and Vandenberghe",
          "url": "https://web.stanford.edu/~boyd/cvxbook/"
        }
      ]
    },
    {
      "id": "lagrange-multipliers",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Lagrange multipliers",
      "summary": "Convert constrained problems into equations that balance objective and constraint forces.",
      "simpleIdea": "Convert constrained problems into equations that balance objective and constraint forces. The practical point is to understand what lagrange multipliers lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Lagrange multipliers belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Lagrange multipliers.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Lagrange multipliers matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, lagrange multipliers can be used to interpret convert constrained problems into equations that balance objective and constraint forces.",
      "resources": [
        {
          "label": "Wikipedia: Lagrange multipliers",
          "url": "https://en.wikipedia.org/wiki/Lagrange_multiplier"
        }
      ]
    },
    {
      "id": "kkt-conditions",
      "group": "optimization",
      "section": "The simple idea",
      "title": "KKT conditions",
      "summary": "Generalize optimality conditions for constrained optimization problems.",
      "simpleIdea": "Generalize optimality conditions for constrained optimization problems. The practical point is to understand what kkt conditions lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "KKT conditions belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for KKT conditions.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "KKT conditions matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, kkt conditions can be used to interpret generalize optimality conditions for constrained optimization problems.",
      "resources": [
        {
          "label": "Wikipedia: KKT conditions",
          "url": "https://en.wikipedia.org/wiki/Karush%E2%80%93Kuhn%E2%80%93Tucker_conditions"
        }
      ]
    },
    {
      "id": "regularization-and-penalties",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Regularization and penalties",
      "summary": "Add terms that discourage overly complex, unstable, or undesirable solutions.",
      "simpleIdea": "Add terms that discourage overly complex, unstable, or undesirable solutions. The practical point is to understand what regularization and penalties lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Regularization and penalties belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Regularization and penalties.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Regularization and penalties matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, regularization and penalties can be used to interpret add terms that discourage overly complex, unstable, or undesirable solutions.",
      "resources": [
        {
          "label": "Convex Optimization by Boyd and Vandenberghe",
          "url": "https://web.stanford.edu/~boyd/cvxbook/"
        }
      ]
    },
    {
      "id": "early-stopping",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Early stopping",
      "summary": "Stops training when validation behavior stops improving, reducing overfitting.",
      "simpleIdea": "Stops training when validation behavior stops improving, reducing overfitting. The practical point is to understand what early stopping lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Early stopping belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Early stopping.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Early stopping matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, early stopping can be used to interpret stops training when validation behavior stops improving, reducing overfitting.",
      "resources": [
        {
          "label": "Wikipedia: Early stopping",
          "url": "https://en.wikipedia.org/wiki/Early_stopping"
        }
      ]
    },
    {
      "id": "numerical-stability",
      "group": "optimization",
      "section": "The simple idea",
      "title": "Numerical stability",
      "summary": "Keeps calculations reliable despite finite precision, overflow, underflow, or bad scaling.",
      "simpleIdea": "Keeps calculations reliable despite finite precision, overflow, underflow, or bad scaling. The practical point is to understand what numerical stability lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Numerical stability belongs to objectives, constraints, gradients, update rules, and numerical stability. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Numerical stability.",
        "A small worked example you can compute by hand.",
        "how this affects loss minimization, parameter updates, training speed, regularization, or convergence",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Numerical stability matters for AI because turns model training into a disciplined search for better parameters under practical constraints. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In a training loop, numerical stability can be used to interpret keeps calculations reliable despite finite precision, overflow, underflow, or bad scaling.",
      "resources": [
        {
          "label": "Wikipedia: Numerical stability",
          "url": "https://en.wikipedia.org/wiki/Numerical_stability"
        }
      ]
    },
    {
      "id": "entropy",
      "group": "information-theory",
      "section": "The simple idea",
      "title": "Entropy",
      "summary": "Measures the uncertainty or average surprise in a probability distribution.",
      "simpleIdea": "Measures the uncertainty or average surprise in a probability distribution. The practical point is to understand what entropy lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Entropy belongs to uncertainty, surprise, distribution mismatch, compression, and information flow. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Entropy.",
        "A small worked example you can compute by hand.",
        "how this appears in cross-entropy loss, language-model perplexity, KL regularization, representation learning, or compression",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Entropy matters for AI because connects learning objectives with uncertainty, coding, compression, and distribution comparison. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "For a model distribution, entropy can be used to interpret measures the uncertainty or average surprise in a probability distribution.",
      "resources": [
        {
          "label": "Wikipedia: Entropy",
          "url": "https://en.wikipedia.org/wiki/Entropy_(information_theory)"
        }
      ]
    },
    {
      "id": "cross-entropy",
      "group": "information-theory",
      "section": "The simple idea",
      "title": "Cross-entropy",
      "summary": "Measures how costly it is to encode true outcomes using a model's predicted distribution.",
      "simpleIdea": "Measures how costly it is to encode true outcomes using a model's predicted distribution. The practical point is to understand what cross-entropy lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Cross-entropy belongs to uncertainty, surprise, distribution mismatch, compression, and information flow. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Cross-entropy.",
        "A small worked example you can compute by hand.",
        "how this appears in cross-entropy loss, language-model perplexity, KL regularization, representation learning, or compression",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Cross-entropy matters for AI because connects learning objectives with uncertainty, coding, compression, and distribution comparison. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "For a model distribution, cross-entropy can be used to interpret measures how costly it is to encode true outcomes using a model's predicted distribution.",
      "resources": [
        {
          "label": "Wikipedia: Cross-entropy",
          "url": "https://en.wikipedia.org/wiki/Cross-entropy"
        }
      ]
    },
    {
      "id": "kl-divergence",
      "group": "information-theory",
      "section": "The simple idea",
      "title": "KL divergence",
      "summary": "Measures how much one distribution differs from another, with direction-dependent penalties.",
      "simpleIdea": "Measures how much one distribution differs from another, with direction-dependent penalties. The practical point is to understand what kl divergence lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "KL divergence belongs to uncertainty, surprise, distribution mismatch, compression, and information flow. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for KL divergence.",
        "A small worked example you can compute by hand.",
        "how this appears in cross-entropy loss, language-model perplexity, KL regularization, representation learning, or compression",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "KL divergence matters for AI because connects learning objectives with uncertainty, coding, compression, and distribution comparison. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "For a model distribution, kl divergence can be used to interpret measures how much one distribution differs from another, with direction-dependent penalties.",
      "resources": [
        {
          "label": "Wikipedia: KL divergence",
          "url": "https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence"
        }
      ]
    },
    {
      "id": "mutual-information",
      "group": "information-theory",
      "section": "The simple idea",
      "title": "Mutual information",
      "summary": "Measures how much knowing one variable reduces uncertainty about another.",
      "simpleIdea": "Measures how much knowing one variable reduces uncertainty about another. The practical point is to understand what mutual information lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Mutual information belongs to uncertainty, surprise, distribution mismatch, compression, and information flow. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Mutual information.",
        "A small worked example you can compute by hand.",
        "how this appears in cross-entropy loss, language-model perplexity, KL regularization, representation learning, or compression",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Mutual information matters for AI because connects learning objectives with uncertainty, coding, compression, and distribution comparison. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "For a model distribution, mutual information can be used to interpret measures how much knowing one variable reduces uncertainty about another.",
      "resources": [
        {
          "label": "Wikipedia: Mutual information",
          "url": "https://en.wikipedia.org/wiki/Mutual_information"
        }
      ]
    },
    {
      "id": "conditional-entropy",
      "group": "information-theory",
      "section": "The simple idea",
      "title": "Conditional entropy",
      "summary": "Measures remaining uncertainty in one variable after another variable is known.",
      "simpleIdea": "Measures remaining uncertainty in one variable after another variable is known. The practical point is to understand what conditional entropy lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Conditional entropy belongs to uncertainty, surprise, distribution mismatch, compression, and information flow. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Conditional entropy.",
        "A small worked example you can compute by hand.",
        "how this appears in cross-entropy loss, language-model perplexity, KL regularization, representation learning, or compression",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Conditional entropy matters for AI because connects learning objectives with uncertainty, coding, compression, and distribution comparison. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "For a model distribution, conditional entropy can be used to interpret measures remaining uncertainty in one variable after another variable is known.",
      "resources": [
        {
          "label": "Wikipedia: Conditional entropy",
          "url": "https://en.wikipedia.org/wiki/Conditional_entropy"
        }
      ]
    },
    {
      "id": "jensen-shannon-divergence",
      "group": "information-theory",
      "section": "The simple idea",
      "title": "Jensen-Shannon divergence",
      "summary": "A symmetric, smoothed way to compare probability distributions.",
      "simpleIdea": "A symmetric, smoothed way to compare probability distributions. The practical point is to understand what jensen-shannon divergence lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Jensen-Shannon divergence belongs to uncertainty, surprise, distribution mismatch, compression, and information flow. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Jensen-Shannon divergence.",
        "A small worked example you can compute by hand.",
        "how this appears in cross-entropy loss, language-model perplexity, KL regularization, representation learning, or compression",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Jensen-Shannon divergence matters for AI because connects learning objectives with uncertainty, coding, compression, and distribution comparison. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "For a model distribution, jensen-shannon divergence can be used to interpret a symmetric, smoothed way to compare probability distributions.",
      "resources": [
        {
          "label": "Wikipedia: Jensen-Shannon divergence",
          "url": "https://en.wikipedia.org/wiki/Jensen%E2%80%93Shannon_divergence"
        }
      ]
    },
    {
      "id": "coding-theory",
      "group": "information-theory",
      "section": "The simple idea",
      "title": "Coding theory",
      "summary": "Connects probability to efficient representation, compression, and error correction.",
      "simpleIdea": "Connects probability to efficient representation, compression, and error correction. The practical point is to understand what coding theory lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Coding theory belongs to uncertainty, surprise, distribution mismatch, compression, and information flow. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Coding theory.",
        "A small worked example you can compute by hand.",
        "how this appears in cross-entropy loss, language-model perplexity, KL regularization, representation learning, or compression",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Coding theory matters for AI because connects learning objectives with uncertainty, coding, compression, and distribution comparison. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "For a model distribution, coding theory can be used to interpret connects probability to efficient representation, compression, and error correction.",
      "resources": [
        {
          "label": "Wikipedia: Coding theory",
          "url": "https://en.wikipedia.org/wiki/Coding_theory"
        }
      ]
    },
    {
      "id": "minimum-description-length",
      "group": "information-theory",
      "section": "The simple idea",
      "title": "Minimum description length",
      "summary": "Prefers models that explain data well without requiring overly complex descriptions.",
      "simpleIdea": "Prefers models that explain data well without requiring overly complex descriptions. The practical point is to understand what minimum description length lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Minimum description length belongs to uncertainty, surprise, distribution mismatch, compression, and information flow. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Minimum description length.",
        "A small worked example you can compute by hand.",
        "how this appears in cross-entropy loss, language-model perplexity, KL regularization, representation learning, or compression",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Minimum description length matters for AI because connects learning objectives with uncertainty, coding, compression, and distribution comparison. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "For a model distribution, minimum description length can be used to interpret prefers models that explain data well without requiring overly complex descriptions.",
      "resources": [
        {
          "label": "Wikipedia: Minimum description length",
          "url": "https://en.wikipedia.org/wiki/Minimum_description_length"
        }
      ]
    },
    {
      "id": "rate-distortion-theory",
      "group": "information-theory",
      "section": "The simple idea",
      "title": "Rate-distortion theory",
      "summary": "Studies the trade-off between compression rate and acceptable reconstruction error.",
      "simpleIdea": "Studies the trade-off between compression rate and acceptable reconstruction error. The practical point is to understand what rate-distortion theory lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Rate-distortion theory belongs to uncertainty, surprise, distribution mismatch, compression, and information flow. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Rate-distortion theory.",
        "A small worked example you can compute by hand.",
        "how this appears in cross-entropy loss, language-model perplexity, KL regularization, representation learning, or compression",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Rate-distortion theory matters for AI because connects learning objectives with uncertainty, coding, compression, and distribution comparison. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "For a model distribution, rate-distortion theory can be used to interpret studies the trade-off between compression rate and acceptable reconstruction error.",
      "resources": [
        {
          "label": "Wikipedia: Rate-distortion theory",
          "url": "https://en.wikipedia.org/wiki/Rate%E2%80%93distortion_theory"
        }
      ]
    },
    {
      "id": "perplexity",
      "group": "information-theory",
      "section": "The simple idea",
      "title": "Perplexity",
      "summary": "Interprets language-model uncertainty as the effective number of plausible next choices.",
      "simpleIdea": "Interprets language-model uncertainty as the effective number of plausible next choices. The practical point is to understand what perplexity lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Perplexity belongs to uncertainty, surprise, distribution mismatch, compression, and information flow. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Perplexity.",
        "A small worked example you can compute by hand.",
        "how this appears in cross-entropy loss, language-model perplexity, KL regularization, representation learning, or compression",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Perplexity matters for AI because connects learning objectives with uncertainty, coding, compression, and distribution comparison. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "For a model distribution, perplexity can be used to interpret interprets language-model uncertainty as the effective number of plausible next choices.",
      "resources": [
        {
          "label": "Wikipedia: Perplexity",
          "url": "https://en.wikipedia.org/wiki/Perplexity"
        }
      ]
    },
    {
      "id": "information-bottleneck",
      "group": "information-theory",
      "section": "The simple idea",
      "title": "Information bottleneck",
      "summary": "Learns compressed representations that preserve information relevant to a target.",
      "simpleIdea": "Learns compressed representations that preserve information relevant to a target. The practical point is to understand what information bottleneck lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Information bottleneck belongs to uncertainty, surprise, distribution mismatch, compression, and information flow. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Information bottleneck.",
        "A small worked example you can compute by hand.",
        "how this appears in cross-entropy loss, language-model perplexity, KL regularization, representation learning, or compression",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Information bottleneck matters for AI because connects learning objectives with uncertainty, coding, compression, and distribution comparison. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "For a model distribution, information bottleneck can be used to interpret learns compressed representations that preserve information relevant to a target.",
      "resources": [
        {
          "label": "Wikipedia: Information bottleneck",
          "url": "https://en.wikipedia.org/wiki/Information_bottleneck_method"
        }
      ]
    },
    {
      "id": "sets-relations-and-functions",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Sets, relations, and functions",
      "summary": "Basic objects for describing collections, mappings, and relationships between entities.",
      "simpleIdea": "Basic objects for describing collections, mappings, and relationships between entities. The practical point is to understand what sets, relations, and functions lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Sets, relations, and functions belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Sets, relations, and functions.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Sets, relations, and functions matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, sets, relations, and functions can be used to interpret basic objects for describing collections, mappings, and relationships between entities.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Mathematics for Computer Science",
          "url": "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/"
        }
      ]
    },
    {
      "id": "boolean-algebra",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Boolean algebra",
      "summary": "The math of true/false logic, used in conditions, circuits, constraints, and symbolic reasoning.",
      "simpleIdea": "The math of true/false logic, used in conditions, circuits, constraints, and symbolic reasoning. The practical point is to understand what boolean algebra lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Boolean algebra belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Boolean algebra.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Boolean algebra matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, boolean algebra can be used to interpret the math of true/false logic, used in conditions, circuits, constraints, and symbolic reasoning.",
      "resources": [
        {
          "label": "Wikipedia: Boolean algebra",
          "url": "https://en.wikipedia.org/wiki/Boolean_algebra"
        }
      ]
    },
    {
      "id": "combinatorics",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Combinatorics",
      "summary": "Counts arrangements, choices, and possibilities, which matters in search spaces and probability.",
      "simpleIdea": "Counts arrangements, choices, and possibilities, which matters in search spaces and probability. The practical point is to understand what combinatorics lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Combinatorics belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Combinatorics.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Combinatorics matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, combinatorics can be used to interpret counts arrangements, choices, and possibilities, which matters in search spaces and probability.",
      "resources": [
        {
          "label": "Wikipedia: Combinatorics",
          "url": "https://en.wikipedia.org/wiki/Combinatorics"
        }
      ]
    },
    {
      "id": "graph-theory",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Graph theory",
      "summary": "Represents entities as nodes and relationships as edges, useful for networks, dependencies, and knowledge graphs.",
      "simpleIdea": "Represents entities as nodes and relationships as edges, useful for networks, dependencies, and knowledge graphs. The practical point is to understand what graph theory lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Graph theory belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Graph theory.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Graph theory matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, graph theory can be used to interpret represents entities as nodes and relationships as edges, useful for networks, dependencies, and knowledge graphs.",
      "resources": [
        {
          "label": "Wikipedia: Graph theory",
          "url": "https://en.wikipedia.org/wiki/Graph_theory"
        }
      ]
    },
    {
      "id": "trees-and-directed-acyclic-graphs",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Trees and directed acyclic graphs",
      "summary": "Structured graphs that model hierarchies, computation graphs, parse trees, and pipelines.",
      "simpleIdea": "Structured graphs that model hierarchies, computation graphs, parse trees, and pipelines. The practical point is to understand what trees and directed acyclic graphs lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Trees and directed acyclic graphs belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Trees and directed acyclic graphs.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Trees and directed acyclic graphs matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, trees and directed acyclic graphs can be used to interpret structured graphs that model hierarchies, computation graphs, parse trees, and pipelines.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Mathematics for Computer Science",
          "url": "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/"
        }
      ]
    },
    {
      "id": "recurrence-relations",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Recurrence relations",
      "summary": "Define values in terms of previous values, common in algorithms and dynamic programming.",
      "simpleIdea": "Define values in terms of previous values, common in algorithms and dynamic programming. The practical point is to understand what recurrence relations lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Recurrence relations belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Recurrence relations.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Recurrence relations matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, recurrence relations can be used to interpret define values in terms of previous values, common in algorithms and dynamic programming.",
      "resources": [
        {
          "label": "Wikipedia: Recurrence relations",
          "url": "https://en.wikipedia.org/wiki/Recurrence_relation"
        }
      ]
    },
    {
      "id": "mathematical-induction",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Mathematical induction",
      "summary": "Proves a claim for all cases by proving a base case and a step from one case to the next.",
      "simpleIdea": "Proves a claim for all cases by proving a base case and a step from one case to the next. The practical point is to understand what mathematical induction lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Mathematical induction belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Mathematical induction.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Mathematical induction matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, mathematical induction can be used to interpret proves a claim for all cases by proving a base case and a step from one case to the next.",
      "resources": [
        {
          "label": "Wikipedia: Mathematical induction",
          "url": "https://en.wikipedia.org/wiki/Mathematical_induction"
        }
      ]
    },
    {
      "id": "proof-by-contradiction",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Proof by contradiction",
      "summary": "Proves a claim by showing the opposite assumption leads to an impossibility.",
      "simpleIdea": "Proves a claim by showing the opposite assumption leads to an impossibility. The practical point is to understand what proof by contradiction lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Proof by contradiction belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Proof by contradiction.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Proof by contradiction matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, proof by contradiction can be used to interpret proves a claim by showing the opposite assumption leads to an impossibility.",
      "resources": [
        {
          "label": "Wikipedia: Proof by contradiction",
          "url": "https://en.wikipedia.org/wiki/Reductio_ad_absurdum"
        }
      ]
    },
    {
      "id": "automata-and-formal-languages",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Automata and formal languages",
      "summary": "Model machines and grammars that recognize structured symbol sequences.",
      "simpleIdea": "Model machines and grammars that recognize structured symbol sequences. The practical point is to understand what automata and formal languages lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Automata and formal languages belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Automata and formal languages.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Automata and formal languages matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, automata and formal languages can be used to interpret model machines and grammars that recognize structured symbol sequences.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Mathematics for Computer Science",
          "url": "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/"
        }
      ]
    },
    {
      "id": "computability",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Computability",
      "summary": "Studies what can or cannot be solved by algorithms at all.",
      "simpleIdea": "Studies what can or cannot be solved by algorithms at all. The practical point is to understand what computability lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Computability belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Computability.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Computability matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, computability can be used to interpret studies what can or cannot be solved by algorithms at all.",
      "resources": [
        {
          "label": "Wikipedia: Computability",
          "url": "https://en.wikipedia.org/wiki/Computability"
        }
      ]
    },
    {
      "id": "time-and-space-complexity",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Time and space complexity",
      "summary": "Measures how computation and memory grow as input size increases.",
      "simpleIdea": "Measures how computation and memory grow as input size increases. The practical point is to understand what time and space complexity lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Time and space complexity belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Time and space complexity.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Time and space complexity matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, time and space complexity can be used to interpret measures how computation and memory grow as input size increases.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Mathematics for Computer Science",
          "url": "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/"
        }
      ]
    },
    {
      "id": "reductions",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Reductions",
      "summary": "Transform one problem into another to compare difficulty or reuse solvers.",
      "simpleIdea": "Transform one problem into another to compare difficulty or reuse solvers. The practical point is to understand what reductions lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Reductions belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Reductions.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Reductions matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, reductions can be used to interpret transform one problem into another to compare difficulty or reuse solvers.",
      "resources": [
        {
          "label": "Wikipedia: Reductions",
          "url": "https://en.wikipedia.org/wiki/Reductions"
        }
      ]
    },
    {
      "id": "p-np-np-hard-and-np-complete",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "P, NP, NP-hard, and NP-complete",
      "summary": "Complexity classes that describe which problems are efficiently solvable or likely hard.",
      "simpleIdea": "Complexity classes that describe which problems are efficiently solvable or likely hard. The practical point is to understand what p, np, np-hard, and np-complete lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "P, NP, NP-hard, and NP-complete belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for P, NP, NP-hard, and NP-complete.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "P, NP, NP-hard, and NP-complete matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, p, np, np-hard, and np-complete can be used to interpret complexity classes that describe which problems are efficiently solvable or likely hard.",
      "resources": [
        {
          "label": "MIT OpenCourseWare: Mathematics for Computer Science",
          "url": "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/"
        }
      ]
    },
    {
      "id": "approximation-algorithms",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Approximation algorithms",
      "summary": "Find near-good solutions when exact optimization is too expensive.",
      "simpleIdea": "Find near-good solutions when exact optimization is too expensive. The practical point is to understand what approximation algorithms lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Approximation algorithms belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Approximation algorithms.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Approximation algorithms matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, approximation algorithms can be used to interpret find near-good solutions when exact optimization is too expensive.",
      "resources": [
        {
          "label": "Wikipedia: Approximation algorithms",
          "url": "https://en.wikipedia.org/wiki/Approximation_algorithm"
        }
      ]
    },
    {
      "id": "randomized-algorithms",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Randomized algorithms",
      "summary": "Use randomness to simplify logic, improve average performance, or estimate hard quantities.",
      "simpleIdea": "Use randomness to simplify logic, improve average performance, or estimate hard quantities. The practical point is to understand what randomized algorithms lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Randomized algorithms belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Randomized algorithms.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Randomized algorithms matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, randomized algorithms can be used to interpret use randomness to simplify logic, improve average performance, or estimate hard quantities.",
      "resources": [
        {
          "label": "Wikipedia: Randomized algorithms",
          "url": "https://en.wikipedia.org/wiki/Randomized_algorithm"
        }
      ]
    },
    {
      "id": "online-algorithms",
      "group": "discrete-mathematics-theoretical-computer-science",
      "section": "Study",
      "title": "Online algorithms",
      "summary": "Make decisions as data arrives without knowing the future.",
      "simpleIdea": "Make decisions as data arrives without knowing the future. The practical point is to understand what online algorithms lets you represent, measure, or compute before using it inside a model.",
      "howItWorks": "Online algorithms belongs to sets, logic, graphs, proofs, algorithms, and computational limits. Learn the definition, write down the notation, work a small numerical or symbolic example, and then connect the result to a concrete AI workflow.",
      "whatToLearn": [
        "The definition and notation for Online algorithms.",
        "A small worked example you can compute by hand.",
        "how this supports search, planning, symbolic reasoning, graph modelling, program analysis, or algorithmic efficiency",
        "The assumptions that make the concept valid and the situations where those assumptions break."
      ],
      "whyItMatters": "Online algorithms matters for AI because gives AI systems discrete structures for reasoning, search, planning, and efficient computation. It also gives you language for debugging models when numbers, uncertainty, objectives, or algorithms behave unexpectedly.",
      "pitfalls": [
        "Do not memorize the term without being able to compute or sketch a small example.",
        "Watch for hidden assumptions such as independence, linearity, differentiability, convexity, finite precision, or representative data.",
        "Check whether the concept is being used as an exact theorem, an approximation, or a modelling heuristic."
      ],
      "example": "In an AI system, online algorithms can be used to interpret make decisions as data arrives without knowing the future.",
      "resources": [
        {
          "label": "Wikipedia: Online algorithms",
          "url": "https://en.wikipedia.org/wiki/Online_algorithm"
        }
      ]
    }
  ];

  const mathematicalFoundationTopics = rawTopics.map((topic, index, topics) => {
    const group = groups[topic.group];

    return {
      ...topic,
      groupLabel: group.label,
      previousId: topics[index - 1]?.id || "",
      nextId: topics[index + 1]?.id || "",
    };
  });

  if (typeof window !== "undefined") {
    window.mathematicalFoundationGroups = groups;
    window.mathematicalFoundationTopics = mathematicalFoundationTopics;
  }
})();
