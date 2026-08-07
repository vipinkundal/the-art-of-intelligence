(function () {
  const details = {
    "limits-and-continuity": {
      simpleIdea: [
        "A limit asks what value a function approaches as its input gets close to a point. Continuity says the function reaches that expected value without a jump, hole, or break.",
        "Limits let us study local behavior even when the function is not defined exactly at the point. They provide the foundation for derivatives, integrals, and stable model behavior."
      ],
      howItWorks: [
        "Choose input values closer and closer to a target from the left and from the right. If the outputs approach the same number, that number is the limit.",
        "A function is continuous at x=a when three things hold: f(a) exists, the limit as x approaches a exists, and that limit equals f(a)."
      ],
      concepts: [
        { title: "Limit", explanation: "The value a function approaches near a point. The function does not have to equal that value at the point.", notation: "lim_(x->a) f(x) = L", example: "For f(x)=(x^2-1)/(x-1), the limit at x=1 is 2 even though the original expression is undefined there." },
        { title: "One-sided limits", explanation: "A left-hand limit approaches from smaller inputs; a right-hand limit approaches from larger inputs. A two-sided limit exists only when they agree.", notation: "lim_(x->a-) f(x) and lim_(x->a+) f(x)", example: "A step function has different one-sided limits at its jump." },
        { title: "Continuity", explanation: "Small changes in input produce small changes in output near the point. There is no sudden break.", notation: "lim_(x->a) f(x) = f(a)", example: "Polynomials are continuous everywhere." },
        { title: "Discontinuity", explanation: "A hole, jump, or unbounded break where continuity fails.", notation: "limit missing or limit != f(a)", example: "Division by zero often creates a hole or vertical asymptote." }
      ],
      formulas: [
        { label: "Limit", expression: "lim_(x->a) f(x) = L", meaning: "outputs approach L as inputs approach a" },
        { label: "Continuity test", expression: "lim_(x->a) f(x) = f(a)", meaning: "the approached value equals the actual value" },
        { label: "Two-sided limit", expression: "left limit = right limit = L", meaning: "both directions must agree" }
      ],
      diagram: { caption: "A two-sided limit exists only when both paths approach the same output.", nodes: [
        { label: "Approach from left", detail: "x values below a" },
        { label: "Approach from right", detail: "x values above a" },
        { label: "Compare outputs", detail: "do both approach L?" },
        { label: "Check f(a)", detail: "equality gives continuity" }
      ] },
      whatToLearn: ["Estimate a limit from values or a graph.", "Compare left-hand and right-hand limits.", "Apply the three-part continuity test.", "Recognize holes, jumps, and infinite discontinuities."],
      whyItMatters: ["Gradient-based learning assumes losses and model operations behave predictably under small changes. Continuity is the first level of that stability.", "Limits justify derivatives and help explain why functions such as ReLU can still be useful despite a nondifferentiable point."],
      pitfalls: ["A limit describes nearby values, not necessarily the value at the point.", "Checking only one side is not enough for a two-sided limit.", "Continuity does not imply differentiability; an absolute-value corner is continuous but not differentiable at zero."],
      example: ["Let f(x)=(x^2-4)/(x-2). For x != 2, factor the numerator to get f(x)=x+2. Therefore values near 2 approach 4, so the limit is 4, even though the original expression is undefined at x=2.", "Defining f(2)=4 fills the hole and makes the function continuous there."],
      practice: { question: "If the left-hand limit is 3, the right-hand limit is 3, but f(a)=5, does the limit exist and is the function continuous?", answer: "The limit exists and equals 3, but the function is not continuous because f(a) does not equal the limit." },
      resources: [{ label: "Wikipedia: Limit of a function", url: "https://en.wikipedia.org/wiki/Limit_of_a_function" }, { label: "Khan Academy: Limits and continuity", url: "https://www.khanacademy.org/math/ap-calculus-ab/ab-limits-new" }]
    },
    "derivatives-and-partial-derivatives": {
      simpleIdea: [
        "A derivative measures how quickly an output changes when an input moves a tiny amount. A partial derivative does the same job for one input of a multivariable function while temporarily holding the other inputs fixed.",
        "Think of a derivative as local sensitivity: positive means the output rises, negative means it falls, and a large magnitude means it changes quickly."
      ],
      howItWorks: ["Compute the slope between two nearby points, then let the gap shrink toward zero. For a multivariable function, choose one coordinate to vary and keep the remaining coordinates constant."],
      concepts: [
        { title: "Derivative", explanation: "The instantaneous rate of change of a one-input function and the slope of its tangent line.", notation: "f'(x) = lim_(h->0) [f(x+h)-f(x)]/h", example: "For f(x)=x^2, f'(x)=2x." },
        { title: "Tangent-line approximation", explanation: "Near a point, a smooth curve behaves almost like a straight line whose slope is the derivative.", notation: "f(x+h) approximately f(x) + f'(x)h", example: "Near x=3, x^2 changes by about 6h." },
        { title: "Partial derivative", explanation: "The change with respect to one variable while all other variables are treated as constants.", notation: "partial f / partial x_i", example: "For f(x,y)=x^2+xy, partial f/partial x=2x+y." },
        { title: "Differentiability", explanation: "A differentiable function has a consistent local linear approximation, not merely separate coordinate slopes.", notation: "f(x+h)=f(x)+linear term+small error", example: "A function can have partial derivatives at a point yet still fail to be differentiable there." }
      ],
      formulas: [
        { label: "Derivative definition", expression: "f'(x)=lim_(h->0) [f(x+h)-f(x)]/h", meaning: "slope as the input gap becomes tiny" },
        { label: "Power rule", expression: "d(x^n)/dx = n x^(n-1)", meaning: "lower the power and multiply by the old power" },
        { label: "Partial derivative", expression: "partial f/partial x_i", meaning: "sensitivity to coordinate i alone" }
      ],
      diagram: { caption: "A derivative turns nearby input movement into predicted output movement.", nodes: [
        { label: "Current input x", detail: "starting point" },
        { label: "Tiny change h", detail: "move the input" },
        { label: "Derivative f'(x)", detail: "local sensitivity" },
        { label: "Output change", detail: "approximately f'(x)h" }
      ] },
      whatToLearn: ["Compute simple derivatives using the limit or standard rules.", "Interpret derivative sign and magnitude.", "Compute partial derivatives of a two-variable function.", "Use a derivative as a local linear approximation."],
      whyItMatters: ["A model gradient is built from partial derivatives of the loss with respect to every parameter. These values tell training how each weight affects error.", "Input derivatives also measure sensitivity and support saliency, robustness analysis, and continuous optimization."],
      pitfalls: ["A derivative is local; it does not describe the entire function.", "A zero derivative can be a minimum, maximum, saddle point, or flat region.", "Partial derivatives alone do not always guarantee full differentiability."],
      example: ["For f(x,y)=x^2+3xy, partial f/partial x=2x+3y because y is held fixed. Partial f/partial y=3x because x is held fixed. At (1,2), these sensitivities are 8 and 3."],
      practice: { question: "For f(x,y)=x^2+y^3, find both partial derivatives at (2,1).", answer: "partial f/partial x=2x=4 and partial f/partial y=3y^2=3." },
      resources: [{ label: "Wikipedia: Derivative", url: "https://en.wikipedia.org/wiki/Derivative" }, { label: "Wikipedia: Partial derivative", url: "https://en.wikipedia.org/wiki/Partial_derivative" }]
    },
    "product-quotient-and-chain-rules": {
      simpleIdea: ["Differentiation rules let us break a complicated expression into smaller pieces. The product rule handles multiplication, the quotient rule handles division, and the chain rule handles one function inside another."],
      howItWorks: ["Identify the outer operation first. Keep track of which pieces depend on x, differentiate those pieces, and combine the local derivatives according to the matching rule."],
      concepts: [
        { title: "Product rule", explanation: "When two changing quantities are multiplied, each one contributes to the total change.", notation: "(uv)' = u'v + uv'", example: "d[x sin(x)]/dx = sin(x) + x cos(x)." },
        { title: "Quotient rule", explanation: "For one changing quantity divided by another, combine numerator and denominator changes over the squared denominator.", notation: "(u/v)' = (u'v-uv')/v^2", example: "d[x/(x+1)]/dx = 1/(x+1)^2." },
        { title: "Chain rule", explanation: "For nested functions, multiply the outer derivative by the inner derivative.", notation: "d f(g(x))/dx = f'(g(x)) g'(x)", example: "d[(3x+1)^2]/dx = 2(3x+1)*3." },
        { title: "Computation graph view", explanation: "Each operation contributes a local derivative. Multiplying local derivatives along a path gives the total sensitivity.", notation: "dL/dx = dL/dy * dy/dx", example: "Backpropagation repeatedly applies the chain rule from loss to parameters." }
      ],
      formulas: [
        { label: "Product rule", expression: "(uv)' = u'v + uv'", meaning: "change the first, then change the second" },
        { label: "Quotient rule", expression: "(u/v)' = (u'v - uv') / v^2", meaning: "division requires denominator correction" },
        { label: "Chain rule", expression: "(f o g)'(x) = f'(g(x))g'(x)", meaning: "multiply sensitivities through nested functions" }
      ],
      diagram: { caption: "The chain rule follows dependencies from input to output and multiplies local slopes.", nodes: [
        { label: "x", detail: "original input" },
        { label: "u=g(x)", detail: "inner operation" },
        { label: "y=f(u)", detail: "outer operation" },
        { label: "dy/dx", detail: "dy/du times du/dx" }
      ] },
      whatToLearn: ["Choose the correct rule from expression structure.", "Apply the product and quotient rules without losing terms.", "Work from outer function to inner function in the chain rule.", "Trace derivatives through a small computation graph."],
      whyItMatters: ["Neural networks are nested compositions of matrix operations and nonlinear functions. The chain rule is the central mechanism behind backpropagation.", "Product and quotient rules appear in normalization, probability losses, attention, and regularized objectives."],
      pitfalls: ["The derivative of uv is not u'v'.", "The derivative of f(g(x)) is not just f'(g(x)); include g'(x).", "In matrix calculus, multiplication order matters even when the scalar rule looks simple."],
      example: ["Let y=(x^2+1)^3. The outer derivative is 3(x^2+1)^2 and the inner derivative is 2x. The chain rule gives y'=6x(x^2+1)^2."],
      practice: { question: "Differentiate x^2 e^x using the product rule.", answer: "2x e^x + x^2 e^x = e^x(2x+x^2)." },
      resources: [{ label: "Wikipedia: Chain rule", url: "https://en.wikipedia.org/wiki/Chain_rule" }]
    },
    "gradients": {
      simpleIdea: ["A gradient collects all partial derivatives of a scalar function into one vector. It points in the direction where the function increases fastest nearby."],
      howItWorks: ["Differentiate the function once with respect to each input coordinate and place those values in matching order. Moving a small distance along the negative gradient usually decreases the function."],
      concepts: [
        { title: "Gradient vector", explanation: "One partial derivative per input variable, arranged as a vector with the same coordinate meaning as the input.", notation: "grad f = [partial f/partial x1, ..., partial f/partial xn]", example: "For f=x^2+y^2, grad f=[2x,2y]." },
        { title: "Steepest direction", explanation: "Among unit directions, the gradient gives the largest first-order increase; its negative gives the largest decrease.", notation: "max_(||u||=1) D_u f = ||grad f||", example: "Gradient descent moves opposite the gradient." },
        { title: "Gradient magnitude", explanation: "The norm of the gradient measures how steep the local slope is.", notation: "||grad f||_2", example: "A small gradient indicates a locally flat region." },
        { title: "Gradient step", explanation: "Update parameters by subtracting a learning-rate-scaled gradient.", notation: "theta_new = theta - eta grad L(theta)", example: "eta controls the size of the training step." }
      ],
      formulas: [
        { label: "Gradient", expression: "grad f(x) = [partial f/partial x_i]_i", meaning: "all coordinate sensitivities" },
        { label: "Local change", expression: "f(x+d) approximately f(x) + grad f(x)^T d", meaning: "dot product predicts nearby change" },
        { label: "Gradient descent", expression: "theta <- theta - eta grad L(theta)", meaning: "move toward lower loss" }
      ],
      diagram: { caption: "The gradient converts many coordinate slopes into one actionable direction.", nodes: [
        { label: "Scalar loss L", detail: "one model score" },
        { label: "Partial derivatives", detail: "one per parameter" },
        { label: "Gradient vector", detail: "combined local slope" },
        { label: "Negative step", detail: "reduce the loss" }
      ] },
      whatToLearn: ["Build a gradient from partial derivatives.", "Interpret gradient direction and magnitude.", "Use a dot product to predict directional change.", "Apply one gradient-descent update."],
      whyItMatters: ["Training adjusts model parameters using gradients of a scalar loss. Modern automatic differentiation computes these vectors efficiently even for huge models.", "Gradients also support sensitivity analysis, attribution, adversarial examples, and differentiable programming."],
      pitfalls: ["The gradient depends on coordinate scaling; poorly scaled features distort the direction.", "A small gradient does not prove a good minimum.", "The negative gradient is the steepest local descent direction, not a guarantee of the best global path."],
      example: ["For L(w1,w2)=(w1-2)^2+(w2+1)^2, grad L=[2(w1-2),2(w2+1)]. At (0,0), the gradient is [-4,2]. With eta=0.1, the update gives (0.4,-0.2), moving toward the minimum (2,-1)."],
      practice: { question: "For f(x,y)=x^2+2y^2, what is the gradient at (1,-2)?", answer: "grad f=[2x,4y]=[2,-8]." },
      resources: [{ label: "Wikipedia: Gradient", url: "https://en.wikipedia.org/wiki/Gradient" }]
    },
    "directional-derivatives": {
      simpleIdea: ["A directional derivative asks how a function changes if you move from a point in one chosen direction. It turns the full gradient into the slope along a particular path."],
      howItWorks: ["Normalize the direction vector u, compute the gradient at the point, and take their dot product. Alignment with the gradient produces positive change; opposition produces negative change; perpendicular movement produces zero first-order change."],
      concepts: [
        { title: "Direction vector", explanation: "A vector that specifies where to move. Using a unit vector makes the result change per unit distance.", notation: "u_hat = u/||u||", example: "[3,4] normalizes to [3/5,4/5]." },
        { title: "Directional derivative", explanation: "The instantaneous slope of f along direction u.", notation: "D_u f(x) = grad f(x) . u", example: "It is positive when moving along u initially raises f." },
        { title: "Maximum change", explanation: "The largest directional derivative occurs along the normalized gradient.", notation: "max D_u f = ||grad f||", example: "The negative gradient gives the fastest local decrease." },
        { title: "Level-set tangent", explanation: "A direction perpendicular to the gradient stays on the same level set to first order.", notation: "grad f . u = 0", example: "Walking sideways along a contour has zero local elevation change." }
      ],
      formulas: [
        { label: "Directional derivative", expression: "D_u f(x) = grad f(x)^T u", meaning: "slope along unit direction u" },
        { label: "Normalization", expression: "u_hat = u / ||u||_2", meaning: "separate direction from step size" },
        { label: "Local prediction", expression: "f(x+epsilon u) approximately f(x)+epsilon D_u f(x)", meaning: "predict a small directed move" }
      ],
      diagram: { caption: "The same point can have very different slopes depending on the chosen direction.", nodes: [
        { label: "Point x", detail: "current location" },
        { label: "Choose unit u", detail: "movement direction" },
        { label: "Project gradient", detail: "grad f dot u" },
        { label: "Directional slope", detail: "rise or fall along u" }
      ] },
      whatToLearn: ["Normalize a direction vector.", "Compute grad f dot u.", "Find directions of maximum increase and decrease.", "Explain why tangent directions to a level set give zero derivative."],
      whyItMatters: ["Directional derivatives measure model sensitivity to structured input changes and form the basis of Jacobian-vector products.", "Optimization methods use them in line searches, curvature estimates, and checks of proposed update directions."],
      pitfalls: ["Use a unit direction if you want change per unit distance.", "A zero directional derivative in one direction does not mean the full gradient is zero.", "The formula grad f dot u assumes differentiability at the point."],
      example: ["For f(x,y)=x^2+y^2 at (1,2), grad f=[2,4]. Along u=[1,0], D_u f=2. Along the normalized gradient [1/sqrt(5),2/sqrt(5)], the derivative is ||grad f||=sqrt(20)."],
      practice: { question: "For grad f=[3,4], what is the directional derivative along u=[0,1]?", answer: "[3,4] dot [0,1] = 4." },
      resources: [{ label: "Wikipedia: Directional derivative", url: "https://en.wikipedia.org/wiki/Directional_derivative" }]
    },
    "jacobians": {
      simpleIdea: ["A Jacobian is a table of first derivatives for a function with several inputs and several outputs. It tells how each output responds to each input."],
      howItWorks: ["Place outputs along rows and inputs along columns. Entry J_ij is the partial derivative of output i with respect to input j. Near a point, multiplying J by a small input change predicts the output change."],
      concepts: [
        { title: "Jacobian matrix", explanation: "A complete first-order sensitivity map from n inputs to m outputs.", notation: "J_ij = partial f_i / partial x_j", example: "A function R^3 to R^2 has a 2 x 3 Jacobian." },
        { title: "Local linear map", explanation: "The Jacobian is the best linear approximation to a differentiable function near a point.", notation: "f(x+dx) approximately f(x)+J dx", example: "It predicts all output changes from a small input move." },
        { title: "Jacobian-vector product", explanation: "Jv computes output change along one input direction without building every Jacobian entry.", notation: "Jv", example: "Forward-mode autodiff calculates Jv efficiently." },
        { title: "Vector-Jacobian product", explanation: "v^T J sends an output sensitivity backward to inputs.", notation: "v^T J", example: "Reverse-mode autodiff and backpropagation use VJPs." }
      ],
      formulas: [
        { label: "Jacobian entry", expression: "J_ij = partial f_i / partial x_j", meaning: "effect of input j on output i" },
        { label: "Linearization", expression: "Delta f approximately J Delta x", meaning: "predict nearby vector output change" },
        { label: "Chain rule", expression: "J_(f o g)(x) = J_f(g(x)) J_g(x)", meaning: "compose local linear maps in order" }
      ],
      diagram: { caption: "Rows represent outputs, columns represent inputs, and each cell is one sensitivity.", nodes: [
        { label: "Inputs x1...xn", detail: "Jacobian columns" },
        { label: "Function f", detail: "vector transformation" },
        { label: "Outputs f1...fm", detail: "Jacobian rows" },
        { label: "J: m x n", detail: "all input-output slopes" }
      ] },
      whatToLearn: ["Predict Jacobian shape from input and output sizes.", "Compute a small Jacobian entry by entry.", "Use J dx as a local output-change estimate.", "Distinguish JVPs from VJPs."],
      whyItMatters: ["Jacobians appear in backpropagation, normalizing flows, sensitivity analysis, coordinate transformations, and robotics.", "Large models rarely build full Jacobians; efficient vector products extract only the information needed."],
      pitfalls: ["Different conventions may transpose the Jacobian; always check shapes.", "A Jacobian is local and changes with the evaluation point.", "Computing the full matrix can be wasteful when only Jv or v^T J is needed."],
      example: ["Let f(x,y)=[x^2+y, xy]. Then J=[[2x,1],[y,x]]. At (2,3), J=[[4,1],[3,2]]. For dx=[0.1,0], the predicted output change is [0.4,0.3]."],
      practice: { question: "What is the Jacobian shape for a function with 5 inputs and 2 outputs using rows-as-outputs convention?", answer: "2 x 5: one row per output and one column per input." },
      resources: [{ label: "Wikipedia: Jacobian matrix", url: "https://en.wikipedia.org/wiki/Jacobian_matrix_and_determinant" }]
    },
    "hessians": {
      simpleIdea: ["A Hessian is a matrix of second derivatives. While a gradient tells which way a function slopes, a Hessian tells how that slope bends and changes."],
      howItWorks: ["Differentiate every gradient component with respect to every input. Diagonal entries describe curvature along individual coordinates; off-diagonal entries describe interactions between coordinate directions."],
      concepts: [
        { title: "Second derivative", explanation: "Measures how a one-dimensional slope changes. Positive means bending upward; negative means bending downward.", notation: "f''(x)", example: "For f=x^2, f''=2 everywhere." },
        { title: "Hessian matrix", explanation: "Collects all second partial derivatives of a scalar function.", notation: "H_ij = partial^2 f / partial x_i partial x_j", example: "A function of n variables has an n x n Hessian." },
        { title: "Curvature directions", explanation: "Hessian eigenvectors give principal directions of curvature; eigenvalues give curvature strength and sign.", notation: "Hv=lambda v", example: "All positive eigenvalues indicate a local bowl shape." },
        { title: "Hessian-vector product", explanation: "Hv measures curvature along a chosen vector without storing the entire Hessian.", notation: "Hv", example: "Useful in second-order optimization for large models." }
      ],
      formulas: [
        { label: "Hessian", expression: "H_ij = partial^2 f / (partial x_i partial x_j)", meaning: "change of gradient component i along coordinate j" },
        { label: "Quadratic change", expression: "1/2 d^T H d", meaning: "second-order correction along step d" },
        { label: "Newton step", expression: "d = -H^-1 grad f", meaning: "scale the gradient using local curvature" }
      ],
      diagram: { caption: "The Hessian classifies local geometry by curvature signs.", nodes: [
        { label: "All positive", detail: "local bowl / minimum" },
        { label: "All negative", detail: "local dome / maximum" },
        { label: "Mixed signs", detail: "saddle point" },
        { label: "Near zero", detail: "flat direction" }
      ] },
      whatToLearn: ["Compute a 2 x 2 Hessian.", "Interpret diagonal and cross-partial entries.", "Use eigenvalue signs to describe local shape.", "Understand the role of Hessian-vector products."],
      whyItMatters: ["Hessians describe loss-landscape curvature, parameter interactions, sharpness, and conditioning. Newton and quasi-Newton methods use curvature to choose better-scaled updates.", "Large neural networks make full Hessians impractical, so approximations and vector products are common."],
      pitfalls: ["A zero gradient does not identify the point type without curvature or other analysis.", "Positive diagonal entries do not guarantee a positive-definite Hessian.", "Hessians can be enormous and numerically sensitive."],
      example: ["For f(x,y)=x^2+3xy+2y^2, grad f=[2x+3y,3x+4y] and H=[[2,3],[3,4]]. The off-diagonal 3 records interaction between x and y."],
      practice: { question: "What does a Hessian with one positive and one negative eigenvalue indicate?", answer: "A saddle point geometry: the function bends upward in one direction and downward in another." },
      resources: [{ label: "Wikipedia: Hessian matrix", url: "https://en.wikipedia.org/wiki/Hessian_matrix" }]
    },
    "taylor-approximation": {
      simpleIdea: ["Taylor approximation replaces a complicated smooth function near one point with a polynomial built from its value, slope, curvature, and higher derivatives."],
      howItWorks: ["Choose a center a. Match the function's derivatives at a: the constant term matches value, the linear term matches slope, and the quadratic term matches curvature. Accuracy is usually best close to a."],
      concepts: [
        { title: "Zeroth order", explanation: "Treat the function as locally constant and keep only its current value.", notation: "f(x) approximately f(a)", example: "Useful only for very tiny changes or rough estimates." },
        { title: "First order", explanation: "Use the tangent line or tangent plane, adding local slope.", notation: "f(a+h) approximately f(a)+f'(a)h", example: "This is the linearization used by gradients." },
        { title: "Second order", explanation: "Add curvature to obtain a local quadratic model.", notation: "f(a+h) approximately f(a)+f'(a)h+0.5f''(a)h^2", example: "Newton methods rely on second-order models." },
        { title: "Remainder", explanation: "The difference between the true function and the truncated polynomial. It grows as you move away or omit important higher derivatives.", notation: "f = Taylor polynomial + remainder", example: "A local approximation can be poor far from its center." }
      ],
      formulas: [
        { label: "First order", expression: "f(x+d) approximately f(x)+grad f(x)^T d", meaning: "value plus local slope" },
        { label: "Second order", expression: "f(x+d) approximately f(x)+g^T d+1/2 d^T H d", meaning: "add local curvature" },
        { label: "One-variable series", expression: "f(a+h)=sum_k f^(k)(a) h^k/k!", meaning: "combine all derivative orders when the series is valid" }
      ],
      diagram: { caption: "Each derivative order adds a richer local description.", nodes: [
        { label: "Value", detail: "zeroth-order level" },
        { label: "+ slope", detail: "first-order line" },
        { label: "+ curvature", detail: "second-order bend" },
        { label: "+ higher terms", detail: "greater local accuracy" }
      ] },
      whatToLearn: ["Build first- and second-order approximations.", "Interpret gradient and Hessian terms geometrically.", "Know that Taylor models are local.", "Estimate when omitted terms may matter."],
      whyItMatters: ["Gradient descent minimizes a first-order local model plus a step-size rule. Newton methods minimize a second-order local model.", "Taylor reasoning appears in optimization, uncertainty approximations, robustness analysis, and numerical integration."],
      pitfalls: ["More terms do not guarantee good behavior far from the center.", "The function must be sufficiently smooth for the required derivatives.", "The approximation sign is not an equality unless the remainder is included or the function is already the matching polynomial."],
      example: ["Approximate e^0.1 around a=0. Since e^0=1 and every derivative is 1, first order gives 1+0.1=1.1. Second order gives 1+0.1+0.1^2/2=1.105, close to the true value about 1.10517."],
      practice: { question: "Use first order around x=4 to approximate sqrt(4.1).", answer: "f(4)=2 and f'(4)=1/4. With h=0.1, the estimate is 2+0.025=2.025." },
      resources: [{ label: "Wikipedia: Taylor's theorem", url: "https://en.wikipedia.org/wiki/Taylor%27s_theorem" }]
    },
    "multivariable-integration": {
      simpleIdea: ["Multivariable integration adds infinitely many tiny contributions over an area, volume, or higher-dimensional region. It extends the idea of area under a curve to several dimensions."],
      howItWorks: ["Divide a region into tiny cells, multiply the function value in each cell by the cell's volume, add the pieces, and take the limit as cells shrink. Iterated integrals evaluate one variable at a time."],
      concepts: [
        { title: "Double integral", explanation: "Accumulates a function over a two-dimensional region.", notation: "integral integral_R f(x,y) dA", example: "If f is density, the result is total mass over R." },
        { title: "Triple and higher integrals", explanation: "Extend accumulation to volumes and higher-dimensional spaces.", notation: "integral_V f(x,y,z) dV", example: "A probability density integrates to one over its full space." },
        { title: "Iterated integral", explanation: "Compute a multivariable integral by integrating one coordinate at a time when conditions permit.", notation: "integral [integral f(x,y) dy] dx", example: "For a rectangle, bounds can often be separated cleanly." },
        { title: "Expectation as integration", explanation: "A continuous random variable's expected value is a weighted integral over possible values.", notation: "E[g(X)] = integral g(x)p(x) dx", example: "Expected loss averages loss under a data distribution." }
      ],
      formulas: [
        { label: "Double integral", expression: "integral integral_R f(x,y) dA", meaning: "sum f over a 2D region" },
        { label: "Probability normalization", expression: "integral p(x) dx = 1", meaning: "total probability is one" },
        { label: "Expectation", expression: "E[g(X)] = integral g(x)p(x) dx", meaning: "probability-weighted average" }
      ],
      diagram: { caption: "Integration turns many tiny local contributions into one total.", nodes: [
        { label: "Choose region", detail: "area or volume" },
        { label: "Split into cells", detail: "tiny pieces" },
        { label: "Value x cell size", detail: "local contribution" },
        { label: "Add and limit", detail: "integral total" }
      ] },
      whatToLearn: ["Interpret double and higher-dimensional integrals.", "Set bounds for simple rectangular regions.", "Evaluate an iterated integral.", "Connect probability, expectation, and integration."],
      whyItMatters: ["Probabilistic AI defines normalization constants, expectations, marginal probabilities, and likelihoods through multivariable integrals.", "High-dimensional integrals are often impossible analytically, motivating Monte Carlo sampling and variational approximations."],
      pitfalls: ["Bounds may depend on earlier variables for nonrectangular regions.", "Changing integration order can require new bounds.", "High-dimensional volume behaves counterintuitively and numerical integration scales poorly with dimension."],
      example: ["Integrate f(x,y)=x+y over the unit square. First integrate over y: integral_0^1 (x+y)dy=x+1/2. Then integrate over x: integral_0^1 (x+1/2)dx=1."],
      practice: { question: "What is the integral of the constant function 3 over a rectangle of width 2 and height 4?", answer: "3 times the area 8, so the integral is 24." },
      resources: [{ label: "Wikipedia: Multiple integral", url: "https://en.wikipedia.org/wiki/Multiple_integral" }]
    },
    "change-of-variables": {
      simpleIdea: ["Change of variables rewrites a problem in coordinates that are easier to use. Because the transformation may stretch or shrink space, a Jacobian determinant corrects the volume element."],
      howItWorks: ["Choose new coordinates z and a transformation x=T(z). Rewrite the function and region in z-coordinates, then multiply by the absolute determinant of the transformation Jacobian before integrating."],
      concepts: [
        { title: "Coordinate transformation", explanation: "A mapping that represents old coordinates using new ones.", notation: "x = T(z)", example: "Polar coordinates use x=r cos(theta), y=r sin(theta)." },
        { title: "Jacobian determinant", explanation: "The local factor by which the transformation changes area or volume.", notation: "|det J_T(z)|", example: "Polar coordinates contribute a factor r." },
        { title: "Integral substitution", explanation: "Integrate in new coordinates while including the local volume correction.", notation: "integral f(x)dx = integral f(T(z))|det J_T(z)|dz", example: "Circular regions become simple rectangular bounds in r and theta." },
        { title: "Density transformation", explanation: "Probability density changes inversely with local volume expansion so total probability is preserved.", notation: "p_X(x)=p_Z(z)|det J_T(z)|^-1", example: "Normalizing flows compute exact densities this way." }
      ],
      formulas: [
        { label: "Integral rule", expression: "integral f(x)dx = integral f(T(z))|det J_T(z)|dz", meaning: "transform values and correct volume" },
        { label: "Density rule", expression: "p_X(x)=p_Z(z)|det J_T(z)|^-1", meaning: "expanded space gets lower density" },
        { label: "Polar area", expression: "dx dy = r dr dtheta", meaning: "polar coordinates stretch angle more at larger radius" }
      ],
      diagram: { caption: "A coordinate map changes both positions and the size of local cells.", nodes: [
        { label: "Simple z-space", detail: "easy coordinates" },
        { label: "Transform T", detail: "map into x-space" },
        { label: "Jacobian", detail: "local stretch" },
        { label: "Correct measure", detail: "preserve mass or probability" }
      ] },
      whatToLearn: ["Rewrite a simple coordinate transformation.", "Build a small Jacobian and determinant.", "Apply the determinant correction in an integral.", "Explain density expansion and contraction."],
      whyItMatters: ["Normalizing flows transform simple distributions into complex ones while tracking exact likelihood. The same rule appears in diffusion theory, variational inference, and reparameterization.", "Good coordinates can turn a difficult integral or model geometry into a much simpler one."],
      pitfalls: ["Do not forget the absolute determinant.", "Use the inverse determinant consistently when transforming densities.", "The transformation should be one-to-one on the relevant region or handled piecewise."],
      example: ["For polar coordinates, x=r cos(theta), y=r sin(theta). The Jacobian determinant has absolute value r, so an area integral becomes integral integral f(r cos(theta), r sin(theta)) r dr dtheta."],
      practice: { question: "If a one-dimensional transformation is x=3z, what factor changes dz into dx?", answer: "dx=3 dz because |dx/dz|=3. A density transforms with the inverse factor 1/3." },
      resources: [{ label: "Wikipedia: Change of variables", url: "https://en.wikipedia.org/wiki/Change_of_variables" }]
    },
    "ordinary-differential-equations": {
      simpleIdea: ["An ordinary differential equation describes how a system's state changes continuously over time. Instead of directly stating the future state, it gives the rule for the state's instantaneous motion."],
      howItWorks: ["Specify a derivative rule dx/dt=f(t,x) and an initial state x(t0). A solution is a trajectory whose slope matches that rule at every time. Numerical solvers approximate it using small time steps."],
      concepts: [
        { title: "State and derivative", explanation: "The state x(t) describes the system now; its derivative describes current direction and speed of change.", notation: "dx/dt = f(t,x)", example: "Population growth may satisfy dx/dt=kx." },
        { title: "Initial-value problem", explanation: "The differential rule plus a starting state selects a particular trajectory.", notation: "x(t0)=x0", example: "Different initial positions produce different paths under the same rule." },
        { title: "Euler method", explanation: "Approximate the next state using the current slope over a small step.", notation: "x_(k+1)=x_k+h f(t_k,x_k)", example: "Smaller h is usually more accurate but needs more steps." },
        { title: "Stability", explanation: "Describes whether nearby trajectories remain close, converge, or diverge over time.", notation: "behavior of perturbations", example: "Negative exponential dynamics decay toward equilibrium." }
      ],
      formulas: [
        { label: "ODE", expression: "dx/dt = f(t,x)", meaning: "instantaneous state-change rule" },
        { label: "Euler step", expression: "x_(k+1)=x_k+h f(t_k,x_k)", meaning: "follow the current slope for time h" },
        { label: "Exponential solution", expression: "dx/dt=kx => x(t)=x0 exp(kt)", meaning: "growth for k>0 and decay for k<0" }
      ],
      diagram: { caption: "An ODE solver repeatedly turns a local slope into a trajectory.", nodes: [
        { label: "Initial state x0", detail: "starting point" },
        { label: "Evaluate f", detail: "current slope" },
        { label: "Take time step", detail: "advance state" },
        { label: "Repeat", detail: "trace trajectory" }
      ] },
      whatToLearn: ["Interpret dx/dt as a state-change rule.", "Solve simple exponential growth or decay.", "Perform Euler steps by hand.", "Describe numerical error and stability."],
      whyItMatters: ["Neural ODEs, continuous normalizing flows, physical models, control systems, and some diffusion formulations use continuous-time dynamics.", "ODE solvers trade accuracy for computation through step size and method choice."],
      pitfalls: ["The derivative rule is not the state itself.", "Large Euler steps can be inaccurate or unstable.", "Some ODEs are stiff and require specialized solvers."],
      example: ["For dx/dt=-2x with x(0)=1, the exact solution is exp(-2t). Euler's method with h=0.1 gives x1=1+0.1(-2)=0.8 and x2=0.8+0.1(-1.6)=0.64."],
      practice: { question: "Use one Euler step with h=0.5 for dx/dt=3x starting from x=2.", answer: "x_new=2+0.5*(3*2)=5." },
      resources: [{ label: "Wikipedia: Ordinary differential equation", url: "https://en.wikipedia.org/wiki/Ordinary_differential_equation" }]
    },
    "stochastic-differential-equations": {
      simpleIdea: ["A stochastic differential equation describes continuous change with two ingredients: a predictable drift and random fluctuations. It models trajectories that are different each time even from the same starting point."],
      howItWorks: ["The drift term f(x,t)dt gives systematic motion. The diffusion term g(x,t)dW adds Brownian noise whose typical size grows like the square root of the time step. Simulation uses methods such as Euler-Maruyama."],
      concepts: [
        { title: "Drift", explanation: "The deterministic direction and speed of average motion.", notation: "f(x,t) dt", example: "A restoring drift can pull a state toward zero." },
        { title: "Brownian motion", explanation: "A continuous random process with independent Gaussian increments.", notation: "dW approximately sqrt(dt) epsilon", example: "epsilon is sampled from a standard normal distribution." },
        { title: "Diffusion", explanation: "Controls how strongly random noise affects the state.", notation: "g(x,t) dW", example: "Larger g creates more varied trajectories." },
        { title: "Euler-Maruyama", explanation: "A simple discrete simulation method combining a drift step and a random diffusion step.", notation: "x_(k+1)=x_k+f dt+g sqrt(dt) epsilon", example: "It is the stochastic counterpart of Euler's ODE method." }
      ],
      formulas: [
        { label: "SDE", expression: "dX_t = f(X_t,t)dt + g(X_t,t)dW_t", meaning: "drift plus random diffusion" },
        { label: "Noise increment", expression: "Delta W approximately sqrt(Delta t) epsilon, epsilon~N(0,1)", meaning: "random motion scales with square-root time" },
        { label: "Euler-Maruyama", expression: "X_(k+1)=X_k+f Delta t+g sqrt(Delta t)epsilon", meaning: "one simulated stochastic step" }
      ],
      diagram: { caption: "Every time step combines a predictable move with a fresh random move.", nodes: [
        { label: "Current state", detail: "X_k" },
        { label: "Drift step", detail: "f Delta t" },
        { label: "Noise step", detail: "g sqrt(Delta t) epsilon" },
        { label: "New random state", detail: "X_(k+1)" }
      ] },
      whatToLearn: ["Separate drift from diffusion.", "Explain Brownian increments.", "Simulate one Euler-Maruyama step.", "Understand that an SDE defines a distribution over paths."],
      whyItMatters: ["Score-based diffusion models can be described through forward and reverse-time SDEs. SDEs also model uncertainty, noisy optimization, and continuous latent processes.", "They connect deterministic dynamics, random sampling, and probability-density evolution."],
      pitfalls: ["dW is not an ordinary derivative times dt.", "Noise scales with sqrt(dt), not dt.", "Stochastic integrals require interpretation choices such as Ito or Stratonovich; they are not always interchangeable."],
      example: ["For dX=-X dt+0.2 dW, X=1, dt=0.01, and sampled epsilon=0.5, the next state is 1-1*0.01+0.2*0.1*0.5=1.0. Another noise sample gives a different result."],
      practice: { question: "If dt decreases from 0.04 to 0.01, how does the scale sqrt(dt) of the noise increment change?", answer: "It halves, from 0.2 to 0.1." },
      resources: [{ label: "Wikipedia: Stochastic differential equation", url: "https://en.wikipedia.org/wiki/Stochastic_differential_equation" }, { label: "Score-Based Generative Modeling through SDEs", url: "https://arxiv.org/abs/2011.13456" }]
    },
    "automatic-differentiation": {
      simpleIdea: ["Automatic differentiation computes derivatives of a program by recording elementary operations and applying the chain rule to them. It produces derivatives accurate to machine precision without deriving one giant symbolic formula."],
      howItWorks: ["Break a computation into operations such as add, multiply, exp, and matrix multiply. Each operation knows its local derivative. Autodiff combines those local rules through the computation graph."],
      concepts: [
        { title: "Computation graph", explanation: "A directed graph whose nodes are intermediate values and whose edges represent dependencies.", notation: "inputs -> operations -> output", example: "z=x*y and L=z^2 creates two operation stages." },
        { title: "Local derivative", explanation: "Each primitive operation supplies a small derivative rule.", notation: "partial output / partial input", example: "For z=xy, partial z/partial x=y." },
        { title: "Chain-rule accumulation", explanation: "Autodiff combines local sensitivities along every dependency path.", notation: "total derivative = sum of path contributions", example: "A reused variable receives gradient contributions from each use." },
        { title: "Autodiff versus alternatives", explanation: "Unlike symbolic differentiation, it evaluates a concrete program; unlike finite differences, it does not rely on subtracting nearby noisy values.", notation: "exact chain rule in floating point", example: "It handles loops and branching along the executed path." }
      ],
      formulas: [
        { label: "Local chain rule", expression: "dL/dx = dL/dy * dy/dx", meaning: "pass sensitivity through one operation" },
        { label: "Branch accumulation", expression: "dL/dx = sum_paths dL/dx|_path", meaning: "add contributions when x affects L in several ways" },
        { label: "Finite difference contrast", expression: "f'(x) approximately [f(x+h)-f(x)]/h", meaning: "an approximation that autodiff usually avoids" }
      ],
      diagram: { caption: "Autodiff reuses small derivative rules across the executed computation.", nodes: [
        { label: "Run program", detail: "compute values" },
        { label: "Record operations", detail: "build graph or trace" },
        { label: "Apply local rules", detail: "chain derivatives" },
        { label: "Return gradients", detail: "sensitivities of chosen outputs" }
      ] },
      whatToLearn: ["Draw a small computation graph.", "Label local derivatives.", "Combine paths with the chain rule.", "Distinguish autodiff from symbolic and numerical differentiation."],
      whyItMatters: ["Deep-learning frameworks use autodiff to train arbitrary differentiable programs. Model authors define the forward computation, and the framework constructs parameter gradients.", "It also enables differentiable simulation, meta-learning, implicit layers, and scientific machine learning."],
      pitfalls: ["Autodiff does not make a nondifferentiable operation smooth.", "In-place mutation or detached values can break the graph.", "Correct derivatives can still overflow, vanish, or use excessive memory."],
      example: ["For z=xy and L=z^2 with x=2,y=3, forward values are z=6,L=36. Reverse sensitivities are dL/dz=12, so dL/dx=12*y=36 and dL/dy=12*x=24."],
      practice: { question: "For y=sin(x) and L=y^2, what local derivatives are multiplied to find dL/dx?", answer: "dL/dy=2y and dy/dx=cos(x), so dL/dx=2 sin(x) cos(x)." },
      resources: [{ label: "Wikipedia: Automatic differentiation", url: "https://en.wikipedia.org/wiki/Automatic_differentiation" }]
    },
    "forward-mode-and-reverse-mode-autodiff": {
      simpleIdea: ["Forward mode carries input changes forward through a program. Reverse mode carries output sensitivity backward. They compute the same derivatives but have different costs depending on the numbers of inputs and outputs."],
      howItWorks: ["Forward mode pairs every intermediate value with its derivative along a selected input direction. Reverse mode first stores intermediate values, then walks backward from a selected output and accumulates adjoints."],
      concepts: [
        { title: "Forward mode", explanation: "Propagates tangents from inputs to outputs in the same direction as evaluation.", notation: "Jv", example: "One pass gives how all outputs change along one input direction." },
        { title: "Reverse mode", explanation: "Propagates adjoints from outputs back to inputs after the forward computation.", notation: "v^T J", example: "One backward pass gives a scalar loss gradient for all parameters." },
        { title: "Cost tradeoff", explanation: "Forward mode is attractive for few input directions; reverse mode is attractive for few output directions.", notation: "cost roughly follows selected directions", example: "Millions of parameters and one loss strongly favor reverse mode." },
        { title: "Memory tradeoff", explanation: "Reverse mode needs forward intermediates for the backward pass, while forward mode carries tangent values as it runs.", notation: "checkpointing trades recomputation for memory", example: "Large networks may recompute activations to reduce memory." }
      ],
      formulas: [
        { label: "Forward product", expression: "Jv", meaning: "output change for one input direction v" },
        { label: "Reverse product", expression: "v^T J", meaning: "input sensitivity for one output weighting v" },
        { label: "Neural-network loss", expression: "grad_theta L = 1^T J_L", meaning: "reverse mode gets all parameter derivatives from one scalar output" }
      ],
      diagram: { caption: "Choose propagation direction based on whether inputs or outputs are fewer.", nodes: [
        { label: "Few inputs", detail: "forward mode fits" },
        { label: "Values + tangents", detail: "move forward" },
        { label: "Few outputs", detail: "reverse mode fits" },
        { label: "Values then adjoints", detail: "move backward" }
      ] },
      whatToLearn: ["Explain JVP and VJP meanings.", "Choose a mode from input/output dimensions.", "Trace one small forward-mode example.", "Trace one small reverse-mode example and its memory needs."],
      whyItMatters: ["Backpropagation is reverse-mode autodiff specialized to scalar losses, making it efficient to train models with huge parameter counts.", "Forward mode is useful for directional derivatives, sensitivity to a few controls, and combinations such as Hessian-vector products."],
      pitfalls: ["Forward mode is not always faster; its advantage depends on dimensions.", "Reverse mode's stored activations can dominate memory.", "A full Jacobian may require repeated passes in either mode."],
      example: ["For f:R^1000000 to R, reverse mode can obtain all one million partial derivatives in roughly one backward sweep after the forward pass. Forward mode would need about one sweep per independent input direction to form the full gradient."],
      practice: { question: "Which mode is usually preferred for a neural network with ten million parameters and one scalar loss, and why?", answer: "Reverse mode, because one backward pass computes sensitivities of the single loss with respect to all parameters." },
      resources: [{ label: "JAX: Autodiff Cookbook", url: "https://docs.jax.dev/en/latest/notebooks/autodiff_cookbook.html" }, { label: "Wikipedia: Automatic differentiation", url: "https://en.wikipedia.org/wiki/Automatic_differentiation" }]
    }
  };

  const expandedDetails = {
    "limits-and-continuity": {
      prerequisites: ["Functions and graphs.", "Intervals and absolute value.", "Basic algebraic simplification."],
      notationGuide: [{ symbol: "lim x->a f(x)", latex: "\\lim_{x\\to a}f(x)", meaning: "Value approached by f(x) as x approaches a." }, { symbol: "x->a-", latex: "x\\to a^-", meaning: "Approach a from values smaller than a." }, { symbol: "x->a+", latex: "x\\to a^+", meaning: "Approach a from values larger than a." }, { symbol: "epsilon, delta", latex: "\\varepsilon,\\delta", meaning: "Output tolerance and matching input tolerance." }],
      formulaLatex: ["\\lim_{x\\to a}f(x)=L", "\\lim_{x\\to a}f(x)=f(a)", "\\lim_{x\\to a^-}f(x)=\\lim_{x\\to a^+}f(x)=L"],
      derivation: { title: "Evaluate a removable limit", steps: ["Start with lim_(x->2) (x^2-4)/(x-2), which gives the undefined form 0/0 by direct substitution.", "Factor x^2-4=(x-2)(x+2).", "For x near but not equal to 2, cancel x-2.", "The remaining expression x+2 approaches 4, so the limit is 4 even if the original function is undefined at 2."] },
      workedExamples: [{ title: "Check continuity", setup: "Let f(x)=x^2+1 and inspect x=3.", steps: ["Polynomial limits allow direct substitution.", "lim_(x->3)f(x)=10.", "The function value f(3)=10."], result: "The limit equals the function value, so f is continuous at 3." }, { title: "Detect a jump", setup: "Let f(x)=0 for x<0 and 1 for x>=0.", steps: ["The left limit at 0 is 0.", "The right limit at 0 is 1.", "The one-sided limits disagree."], result: "The two-sided limit does not exist; f has a jump discontinuity." }],
      exercises: [{ level: "Beginner", question: "Find lim_(x->1)(3x+2).", answer: "5, by direct substitution." }, { level: "Intermediate", question: "Find lim_(x->3)(x^2-9)/(x-3).", answer: "Factor to x+3 for x not equal to 3; the limit is 6." }, { level: "Applied", question: "Why can a hard threshold make gradient-based learning difficult?", answer: "A jump is discontinuous and has no useful derivative at the threshold, while its derivative is zero away from it." }],
      takeaways: ["A limit concerns nearby behavior, not necessarily the value at the point.", "Two-sided limits require matching one-sided limits.", "Continuity requires existence, definition, and equality of limit and value.", "Limits provide the foundation for derivatives and integrals."]
    },
    "derivatives-and-partial-derivatives": {
      prerequisites: ["Limits and continuity.", "Function composition and powers.", "Coordinate axes for multivariable functions."],
      notationGuide: [{ symbol: "f'(x)", latex: "f'(x)", meaning: "Ordinary derivative of a one-input function." }, { symbol: "df/dx", latex: "\\frac{df}{dx}", meaning: "Leibniz notation for a derivative." }, { symbol: "partial f/partial x_i", latex: "\\frac{\\partial f}{\\partial x_i}", meaning: "Change with x_i while other coordinates are fixed." }, { symbol: "Delta x", latex: "\\Delta x", meaning: "A small input change." }],
      formulaLatex: ["f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}", "\\frac{d}{dx}x^n=nx^{n-1}", "\\frac{\\partial f}{\\partial x_i}"],
      derivation: { title: "Derive the derivative of x squared", steps: ["Insert f(x)=x^2 into the difference quotient.", "Expand (x+h)^2-x^2=2xh+h^2.", "Divide by h to get 2x+h for h not equal to zero.", "Take h->0 to obtain f'(x)=2x."] },
      workedExamples: [{ title: "Tangent approximation", setup: "Approximate sqrt(4.1) using f(x)=sqrt(x) near 4.", steps: ["f(4)=2.", "f'(x)=1/(2sqrt(x)), so f'(4)=1/4.", "Use f(4.1) about f(4)+0.1f'(4)."], result: "sqrt(4.1) is approximately 2.025." }, { title: "Partial derivatives", setup: "Let f(x,y)=x^2y+3y.", steps: ["For partial_x, hold y fixed: 2xy.", "For partial_y, hold x fixed: x^2+3.", "Evaluate independently at the chosen point."], result: "The two partial derivatives measure axis-aligned changes." }],
      exercises: [{ level: "Beginner", question: "Differentiate f(x)=3x^2-2x+1.", answer: "f'(x)=6x-2." }, { level: "Intermediate", question: "For f(x,y)=xy+y^2, find both partial derivatives.", answer: "partial_x f=y and partial_y f=x+2y." }, { level: "Applied", question: "What does partial loss/partial weight mean in a model?", answer: "It is the local rate at which loss changes when that weight changes while all other parameters are held fixed." }],
      takeaways: ["A derivative is an instantaneous rate and local slope.", "Differentiability gives a reliable local linear approximation.", "Partial derivatives isolate coordinate directions.", "A derivative is local and may vary from point to point."]
    },
    "product-quotient-and-chain-rules": {
      prerequisites: ["Basic derivatives.", "Products, ratios, and composed functions.", "Algebraic simplification."],
      notationGuide: [{ symbol: "uv", latex: "u(x)v(x)", meaning: "Product of two changing functions." }, { symbol: "u/v", latex: "\\frac{u(x)}{v(x)}", meaning: "Quotient, requiring v(x) nonzero." }, { symbol: "f o g", latex: "(f\\circ g)(x)", meaning: "Composition f(g(x))." }, { symbol: "g'(x)", latex: "g'(x)", meaning: "Inner rate in the chain rule." }],
      formulaLatex: ["(uv)'=u'v+uv'", "\\left(\\frac uv\\right)'=\\frac{u'v-uv'}{v^2}", "(f\\circ g)'(x)=f'(g(x))g'(x)"],
      derivation: { title: "Derive the product rule", steps: ["Start from [u(x+h)v(x+h)-u(x)v(x)]/h.", "Add and subtract u(x+h)v(x) in the numerator.", "Group one term for the change in v and one for the change in u.", "Take h->0; continuity supplies the unchanged factors, giving u'v+uv'."] },
      workedExamples: [{ title: "Differentiate a product", setup: "Let f(x)=x^2 sin(x).", steps: ["Set u=x^2 and v=sin(x).", "Compute u'=2x and v'=cos(x).", "Apply u'v+uv'."], result: "f'(x)=2x sin(x)+x^2 cos(x)." }, { title: "Trace a nested function", setup: "Let L(x)=exp((3x+1)^2).", steps: ["Outer exp contributes exp((3x+1)^2).", "Square contributes 2(3x+1).", "Linear inner function contributes 3."], result: "L'=6(3x+1)exp((3x+1)^2)." }],
      exercises: [{ level: "Beginner", question: "Differentiate x e^x.", answer: "e^x+x e^x=e^x(1+x)." }, { level: "Intermediate", question: "Differentiate (x^2+1)/(x-1).", answer: "[2x(x-1)-(x^2+1)]/(x-1)^2." }, { level: "Applied", question: "Why does backpropagation multiply many local derivatives?", answer: "A neural network is a composition; the chain rule multiplies each operation's local sensitivity along a path." }],
      takeaways: ["Both factors changing creates two product-rule terms.", "The quotient rule includes denominator scaling and a sign-sensitive numerator.", "The chain rule multiplies outer and inner rates.", "Computation graphs organize repeated chain-rule application."]
    },
    "gradients": {
      prerequisites: ["Partial derivatives.", "Vectors and dot products.", "Local linear approximation."],
      notationGuide: [{ symbol: "grad f", latex: "\\nabla f", meaning: "Vector of all partial derivatives." }, { symbol: "eta", latex: "\\eta", meaning: "Learning rate or step size." }, { symbol: "d", latex: "d", meaning: "A proposed direction of movement." }, { symbol: "||grad f||", latex: "\\lVert\\nabla f\\rVert", meaning: "Magnitude of steepest local change." }],
      formulaLatex: ["\\nabla f(x)=\\begin{bmatrix}\\partial f/\\partial x_1&\\cdots&\\partial f/\\partial x_n\\end{bmatrix}^\\top", "f(x+d)\\approx f(x)+\\nabla f(x)^\\top d", "\\theta\\leftarrow\\theta-\\eta\\nabla L(\\theta)"],
      derivation: { title: "Why the gradient is steepest", steps: ["For a unit direction u, the directional derivative is grad f dot u.", "Cauchy-Schwarz bounds this by ||grad f|| ||u||=||grad f||.", "Equality occurs when u points in the gradient direction.", "Therefore grad f gives steepest increase and -grad f gives steepest decrease under Euclidean length."] },
      workedExamples: [{ title: "Compute a gradient", setup: "Let f(x,y)=x^2+3xy+2y^2.", steps: ["partial_x f=2x+3y.", "partial_y f=3x+4y.", "Stack them as a column."], result: "grad f=(2x+3y, 3x+4y)." }, { title: "Take a descent step", setup: "At theta=(1,2), suppose grad L=(3,-1) and eta=0.1.", steps: ["Scale the gradient: 0.1(3,-1)=(0.3,-0.1).", "Subtract it from theta.", "The second coordinate rises because its gradient is negative."], result: "The new theta is (0.7,2.1)." }],
      exercises: [{ level: "Beginner", question: "Find grad(x^2+y^2).", answer: "(2x,2y)." }, { level: "Intermediate", question: "At (1,-1), what direction gives steepest increase for f=x^2+2y^2?", answer: "The gradient is (2,-4); its normalized version gives the unit steepest direction." }, { level: "Applied", question: "Why can an excessively large learning rate increase loss?", answer: "The gradient is only a local approximation; a large step can overshoot the region where it predicts improvement." }],
      takeaways: ["The gradient collects every coordinate sensitivity.", "It represents the local linear part of a scalar function.", "Its direction is steepest increase in Euclidean geometry.", "Gradient descent moves opposite the gradient with a controlled step size."]
    },
    "directional-derivatives": {
      prerequisites: ["Gradients and dot products.", "Unit vectors.", "Local changes in multivariable functions."],
      notationGuide: [{ symbol: "D_u f(x)", latex: "D_u f(x)", meaning: "Rate of change at x along direction u." }, { symbol: "u-hat", latex: "\\hat u", meaning: "Normalized unit direction." }, { symbol: "epsilon", latex: "\\varepsilon", meaning: "Small distance traveled along u." }],
      formulaLatex: ["D_u f(x)=\\nabla f(x)^\\top u", "\\hat u=\\frac{u}{\\lVert u\\rVert_2}", "f(x+\\varepsilon u)\\approx f(x)+\\varepsilon D_u f(x)"],
      derivation: { title: "Reduce a multivariable change to one variable", steps: ["Choose a path r(t)=x+tu through point x.", "Define phi(t)=f(r(t)).", "Apply the chain rule: phi'(0)=grad f(x)^T r'(0).", "Because r'(0)=u, the directional derivative is grad f(x)^T u."] },
      workedExamples: [{ title: "Slope toward a direction", setup: "For f=x^2+y^2 at (1,2), use u=(3,4)/5.", steps: ["grad f=(2,4).", "Dot with u=(3/5,4/5).", "Compute 6/5+16/5."], result: "D_u f=22/5." }, { title: "Move along a level set", setup: "At a point, choose u perpendicular to grad f.", steps: ["The dot product grad f dot u is zero.", "The first-order directional change vanishes.", "Movement follows the tangent of a level set locally."], result: "The function is unchanged to first order along that direction." }],
      exercises: [{ level: "Beginner", question: "For grad f=(3,4), find change along unit x direction.", answer: "3." }, { level: "Intermediate", question: "Which unit direction minimizes the directional derivative?", answer: "-grad f/||grad f||, giving value -||grad f|| when the gradient is nonzero." }, { level: "Applied", question: "How does a directional derivative help test sensitivity to one data perturbation?", answer: "It measures first-order output change along exactly that perturbation without requiring every coordinate effect separately." }],
      takeaways: ["Directional derivatives measure slope along chosen motion.", "Normalize directions when comparing slopes fairly.", "The gradient-dot-direction formula unifies all directions.", "Directions tangent to a level set are orthogonal to the gradient."]
    },
    "jacobians": {
      prerequisites: ["Partial derivatives and gradients.", "Matrix-vector multiplication.", "Vector-valued functions."],
      notationGuide: [{ symbol: "J_f", latex: "J_f", meaning: "Jacobian matrix of f." }, { symbol: "J_ij", latex: "J_{ij}", meaning: "Sensitivity of output i to input j." }, { symbol: "Jv", latex: "Jv", meaning: "Output change along input direction v." }, { symbol: "v^T J", latex: "v^\\top J", meaning: "Input sensitivity for weighted outputs." }],
      formulaLatex: ["(J_f)_{ij}=\\frac{\\partial f_i}{\\partial x_j}", "\\Delta f\\approx J_f(x)\\Delta x", "J_{f\\circ g}(x)=J_f(g(x))J_g(x)"],
      derivation: { title: "Build a Jacobian from output gradients", steps: ["Write f=(f1,...,fm) with input x=(x1,...,xn).", "Differentiate output fi with respect to every input xj.", "Place those n partials in row i.", "Repeat for all m outputs to obtain an m x n local linear map."] },
      workedExamples: [{ title: "Two-output Jacobian", setup: "Let f(x,y)=(x+y, xy).", steps: ["First output gradient is (1,1).", "Second output gradient is (y,x).", "Stack output gradients by rows."], result: "J=[[1,1],[y,x]]." }, { title: "Use a JVP", setup: "At (x,y)=(2,3), move in v=(1,-1).", steps: ["Evaluate J=[[1,1],[3,2]].", "Multiply Jv.", "Results are 0 and 1."], result: "The first output is unchanged to first order; the second increases at rate 1." }],
      exercises: [{ level: "Beginner", question: "What shape is J for f:R^4->R^7?", answer: "7 x 4 in output-by-input convention." }, { level: "Intermediate", question: "Find J for f(x,y)=(x^2, sin y, x+y).", answer: "[[2x,0],[0,cos y],[1,1]]." }, { level: "Applied", question: "Why avoid forming a full neural-network Jacobian?", answer: "It can have outputs times inputs entries; JVPs or VJPs compute needed products with far less memory." }],
      takeaways: ["A Jacobian is the derivative of a vector-valued function.", "Rows track outputs and columns track inputs under the stated convention.", "It maps small input changes to output changes.", "Composed Jacobians multiply in chain-rule order."]
    },
    "hessians": {
      prerequisites: ["Gradients and Jacobians.", "Second derivatives.", "Eigenvalues and quadratic forms."],
      notationGuide: [{ symbol: "H_f", latex: "H_f", meaning: "Hessian matrix of scalar f." }, { symbol: "H_ij", latex: "H_{ij}", meaning: "Mixed second partial derivative." }, { symbol: "d^T H d", latex: "d^\\top H d", meaning: "Curvature along direction d." }, { symbol: "H^-1", latex: "H^{-1}", meaning: "Inverse curvature operator when it exists." }],
      formulaLatex: ["(H_f)_{ij}=\\frac{\\partial^2 f}{\\partial x_i\\partial x_j}", "\\tfrac12 d^\\top H d", "d=-H^{-1}\\nabla f"],
      derivation: { title: "Derive the Newton step", steps: ["Approximate f(x+d) by f(x)+g^T d+0.5 d^T H d.", "Differentiate this quadratic model with respect to d.", "Set g+Hd=0 for its stationary point.", "When H is invertible, solve d=-H^-1 g."] },
      workedExamples: [{ title: "Constant quadratic curvature", setup: "Let f(x,y)=x^2+3xy+2y^2.", steps: ["The gradient is (2x+3y,3x+4y).", "Differentiate again.", "Mixed entries both equal 3."], result: "H=[[2,3],[3,4]]." }, { title: "Read a saddle", setup: "Let f=x^2-y^2 at the origin.", steps: ["H=diag(2,-2).", "One eigenvalue is positive and one negative.", "Curvature rises along x and falls along y."], result: "The origin is a saddle, not a minimum." }],
      exercises: [{ level: "Beginner", question: "Find the Hessian of x^2+y^2.", answer: "2I, or [[2,0],[0,2]]." }, { level: "Intermediate", question: "What does a positive-definite Hessian imply at a stationary point?", answer: "A strict local minimum under standard smoothness assumptions." }, { level: "Applied", question: "Why are full Hessians rarely stored for large models?", answer: "For n parameters they require n^2 entries; products Hv can be computed without materializing the matrix." }],
      takeaways: ["The Hessian is the Jacobian of the gradient.", "Its quadratic form measures directional curvature.", "Eigenvalue signs classify local curvature.", "Second-order methods use curvature but face cost and stability tradeoffs."]
    },
    "taylor-approximation": {
      prerequisites: ["Derivatives and Hessians.", "Polynomial arithmetic.", "The idea of local approximation."],
      notationGuide: [{ symbol: "a", latex: "a", meaning: "Expansion point." }, { symbol: "h", latex: "h", meaning: "Displacement from the expansion point." }, { symbol: "f^(k)(a)", latex: "f^{(k)}(a)", meaning: "k-th derivative evaluated at a." }, { symbol: "R_k", latex: "R_k", meaning: "Remainder after truncation." }],
      formulaLatex: ["f(x+d)\\approx f(x)+\\nabla f(x)^\\top d", "f(x+d)\\approx f(x)+g^\\top d+\\tfrac12 d^\\top H d", "f(a+h)=\\sum_{k=0}^{\\infty}\\frac{f^{(k)}(a)}{k!}h^k"],
      derivation: { title: "Build a second-order expansion", steps: ["Match function value at a with constant term f(a).", "Match slope using f'(a)h.", "Match curvature using f''(a)h^2/2.", "Collect higher-order behavior in a remainder that shrinks faster than h^2 near a under suitable smoothness."] },
      workedExamples: [{ title: "Approximate exp", setup: "Approximate e^0.1 around a=0.", steps: ["e^0=1 and every derivative at 0 is 1.", "Second order gives 1+h+h^2/2.", "Insert h=0.1."], result: "The approximation is 1.105, close to 1.10517." }, { title: "Quadratic model of loss", setup: "Near theta, let gradient be g and Hessian H.", steps: ["Constant term records current loss.", "g^T d predicts slope.", "0.5 d^T H d adjusts for curvature."], result: "The model predicts how both direction and step size affect nearby loss." }],
      exercises: [{ level: "Beginner", question: "Give the first-order approximation to sin x near 0.", answer: "sin x about x." }, { level: "Intermediate", question: "Use second order to approximate cos(0.2).", answer: "1-0.2^2/2=0.98." }, { level: "Applied", question: "Why can a Taylor model fail for a large optimization step?", answer: "It is local; neglected higher-order terms can dominate far from the expansion point." }],
      takeaways: ["Taylor approximation matches local derivatives with a polynomial.", "First order captures slope; second order captures curvature.", "The remainder determines accuracy.", "Local models power optimization, uncertainty approximations, and numerical analysis."]
    },
    "multivariable-integration": {
      prerequisites: ["Single-variable integration.", "Functions of several variables.", "Regions, area, and volume."],
      notationGuide: [{ symbol: "double integral_R", latex: "\\iint_R", meaning: "Integral over a two-dimensional region R." }, { symbol: "dA", latex: "dA", meaning: "Infinitesimal area element." }, { symbol: "p(x)", latex: "p(x)", meaning: "Probability density." }, { symbol: "E[g(X)]", latex: "\\mathbb{E}[g(X)]", meaning: "Expected value of g(X)." }],
      formulaLatex: ["\\iint_R f(x,y)\\,dA", "\\int p(x)\\,dx=1", "\\mathbb{E}[g(X)]=\\int g(x)p(x)\\,dx"],
      derivation: { title: "Turn a double integral into iterated integrals", steps: ["Describe region R using bounds a<=x<=b and c(x)<=y<=d(x).", "For fixed x, integrate f vertically over y.", "This produces a function of x representing one slice.", "Integrate those slice totals over x; Fubini's theorem justifies the procedure under suitable conditions."] },
      workedExamples: [{ title: "Integrate over a rectangle", setup: "Compute integral of x+y over 0<=x<=1, 0<=y<=2.", steps: ["Integrate in y: xy+y^2/2 from 0 to 2 gives 2x+2.", "Integrate 2x+2 from x=0 to 1.", "Evaluate x^2+2x at the bounds."], result: "The integral is 3." }, { title: "Expectation as area", setup: "X is uniform on [0,1], so p(x)=1 there.", steps: ["E[X^2]=integral_0^1 x^2 p(x) dx.", "Integrate x^2.", "Evaluate x^3/3 from 0 to 1."], result: "E[X^2]=1/3." }],
      exercises: [{ level: "Beginner", question: "Compute integral_0^1 integral_0^1 1 dy dx.", answer: "1, the area of the unit square." }, { level: "Intermediate", question: "Write bounds for triangle x>=0, y>=0, x+y<=1.", answer: "0<=x<=1 and 0<=y<=1-x." }, { level: "Applied", question: "Why are high-dimensional integrals difficult computationally?", answer: "Grid points grow exponentially with dimension, motivating Monte Carlo and structured approximations." }],
      takeaways: ["Multivariable integrals accumulate over areas, volumes, and higher-dimensional regions.", "Iterated integration sums slices.", "Probability normalization and expectation are integrals.", "Bounds must describe the intended region without omission or duplication."]
    },
    "change-of-variables": {
      prerequisites: ["Multivariable integration.", "Jacobians and determinants.", "Coordinate transformations."],
      notationGuide: [{ symbol: "x=T(z)", latex: "x=T(z)", meaning: "Transformation from new coordinates z to x." }, { symbol: "J_T", latex: "J_T", meaning: "Jacobian matrix of T." }, { symbol: "|det J_T|", latex: "|\\det J_T|", meaning: "Local absolute volume-scaling factor." }, { symbol: "T^-1", latex: "T^{-1}", meaning: "Inverse transformation when it exists." }],
      formulaLatex: ["\\int f(x)\\,dx=\\int f(T(z))|\\det J_T(z)|\\,dz", "p_X(x)=p_Z(z)|\\det J_T(z)|^{-1}", "dx\\,dy=r\\,dr\\,d\\theta"],
      derivation: { title: "Derive the polar area factor", steps: ["Use x=r cos(theta), y=r sin(theta).", "Form J=[[cos theta,-r sin theta],[sin theta,r cos theta]].", "Its determinant is r(cos^2 theta+sin^2 theta)=r.", "Therefore a small polar rectangle dr dtheta maps to area r dr dtheta."] },
      workedExamples: [{ title: "Integrate a disk", setup: "Find area of radius R using polar coordinates.", steps: ["Use integrand 1.", "Set 0<=r<=R and 0<=theta<=2pi.", "Include Jacobian factor r."], result: "Integral theta then r gives pi R^2." }, { title: "Transform a one-dimensional density", setup: "Let X=2Z with density p_Z.", steps: ["Inverse is z=x/2.", "Derivative dz/dx=1/2.", "Multiply p_Z(x/2) by the absolute derivative."], result: "p_X(x)=0.5 p_Z(x/2)." }],
      exercises: [{ level: "Beginner", question: "For x=3z, what is |dx/dz|?", answer: "3." }, { level: "Intermediate", question: "Why is the determinant absolute-valued in integration?", answer: "Integration measures unsigned volume; a negative determinant records orientation reversal, not negative volume." }, { level: "Applied", question: "What role does log|det J| play in a normalizing flow?", answer: "It exactly adjusts density for local expansion or contraction under an invertible map." }],
      takeaways: ["Changing coordinates requires correcting local volume.", "The Jacobian determinant supplies that correction.", "Density transformations use the inverse volume factor.", "Invertibility and support must be checked before applying the formula."]
    },
    "ordinary-differential-equations": {
      prerequisites: ["Derivatives as rates of change.", "Functions of time.", "Basic numerical iteration."],
      notationGuide: [{ symbol: "dx/dt", latex: "\\frac{dx}{dt}", meaning: "Instantaneous state velocity." }, { symbol: "x(t0)=x0", latex: "x(t_0)=x_0", meaning: "Initial condition." }, { symbol: "h", latex: "h", meaning: "Numerical time-step size." }, { symbol: "f(t,x)", latex: "f(t,x)", meaning: "Rule defining state change." }],
      formulaLatex: ["\\frac{dx}{dt}=f(t,x)", "x_{k+1}=x_k+h f(t_k,x_k)", "\\frac{dx}{dt}=kx\\implies x(t)=x_0e^{kt}"],
      derivation: { title: "Derive Euler's method", steps: ["Use first-order Taylor expansion x(t+h) about t.", "Write x(t+h) about x(t)+h x'(t).", "Replace x'(t) with the ODE rule f(t,x(t)).", "At discrete times, obtain x_(k+1)=x_k+h f(t_k,x_k)."] },
      workedExamples: [{ title: "Exponential growth", setup: "Solve x'=2x with x(0)=3.", steps: ["Separate dx/x=2dt.", "Integrate to ln|x|=2t+C.", "Use x(0)=3 to get C=ln 3."], result: "x(t)=3e^(2t)." }, { title: "One Euler step", setup: "Use x'=-x, x(0)=1, h=0.1.", steps: ["At t0, f=-1.", "Update x1=1+0.1(-1).", "Advance time to 0.1."], result: "Euler gives x(0.1) about 0.9; exact value is e^-0.1 about 0.9048." }],
      exercises: [{ level: "Beginner", question: "For x'=3 with x(0)=2, find x(t).", answer: "x(t)=2+3t." }, { level: "Intermediate", question: "Take two Euler steps for x'=-x, x0=1, h=0.5.", answer: "x1=0.5 and x2=0.25." }, { level: "Applied", question: "Why can a large Euler step make a stable system numerically unstable?", answer: "The discrete update can overshoot and amplify errors even when the continuous dynamics decay." }],
      takeaways: ["An ODE specifies local state velocity.", "Initial conditions select one trajectory.", "Euler follows local tangents and accumulates truncation error.", "Step size and solver choice determine numerical accuracy and stability."]
    },
    "stochastic-differential-equations": {
      prerequisites: ["Ordinary differential equations.", "Gaussian random variables.", "Variance scaling and simulation."],
      notationGuide: [{ symbol: "dW_t", latex: "dW_t", meaning: "Brownian-motion increment." }, { symbol: "f", latex: "f", meaning: "Drift or systematic velocity." }, { symbol: "g", latex: "g", meaning: "Diffusion scale for random motion." }, { symbol: "Delta t", latex: "\\Delta t", meaning: "Discrete simulation step." }],
      formulaLatex: ["dX_t=f(X_t,t)\\,dt+g(X_t,t)\\,dW_t", "\\Delta W\\approx\\sqrt{\\Delta t}\\,\\varepsilon,\\quad\\varepsilon\\sim\\mathcal N(0,1)", "X_{k+1}=X_k+f\\Delta t+g\\sqrt{\\Delta t}\\,\\varepsilon"],
      derivation: { title: "Construct Euler-Maruyama", steps: ["Integrate the SDE over one short interval Delta t.", "Approximate drift as constant, contributing f Delta t.", "A Brownian increment over the interval is Gaussian with variance Delta t, so write sqrt(Delta t) epsilon.", "Add deterministic and random increments to obtain the update."] },
      workedExamples: [{ title: "Pure Brownian motion", setup: "Use dX=dW with X0=0 and step Delta t=0.04.", steps: ["Drift is zero and diffusion is one.", "Sample epsilon from N(0,1).", "Increment is 0.2 epsilon."], result: "Each step has mean zero and standard deviation 0.2." }, { title: "Ornstein-Uhlenbeck pull", setup: "Use dX=-theta X dt+sigma dW.", steps: ["Drift points toward zero when X is nonzero.", "Noise continually perturbs the state.", "Balance produces mean reversion with random variation."], result: "The process fluctuates but is pulled back toward its long-run mean." }],
      exercises: [{ level: "Beginner", question: "What is the standard deviation of Delta W over Delta t=0.01?", answer: "sqrt(0.01)=0.1." }, { level: "Intermediate", question: "Why is the noise term proportional to sqrt(Delta t), not Delta t?", answer: "Brownian variance grows linearly with time, so its standard deviation grows with the square root of time." }, { level: "Applied", question: "Where do SDEs appear in generative modelling?", answer: "Diffusion and score-based models describe forward noising and reverse generation through stochastic dynamics." }],
      takeaways: ["SDEs combine deterministic drift with random diffusion.", "Brownian increments scale as sqrt(time).", "Euler-Maruyama is the stochastic analogue of Euler's method.", "Stochastic integrals require conventions such as Ito or Stratonovich in advanced settings."]
    },
    "automatic-differentiation": {
      prerequisites: ["Chain rule.", "Computation graphs.", "Basic program execution and intermediate values."],
      notationGuide: [{ symbol: "v_i", latex: "v_i", meaning: "Intermediate value in a computation graph." }, { symbol: "partial v_j/partial v_i", latex: "\\frac{\\partial v_j}{\\partial v_i}", meaning: "Local derivative along one graph edge." }, { symbol: "dL/dx", latex: "\\frac{dL}{dx}", meaning: "Accumulated derivative of output L with respect to x." }],
      formulaLatex: ["\\frac{dL}{dx}=\\frac{dL}{dy}\\frac{dy}{dx}", "\\frac{dL}{dx}=\\sum_{p\\in\\text{paths}}\\left.\\frac{dL}{dx}\\right|_p", "f'(x)\\approx\\frac{f(x+h)-f(x)}{h}"],
      derivation: { title: "Differentiate a small computation graph", steps: ["Evaluate a=x^2, b=sin x, and L=a+b in a forward pass.", "Record local derivatives da/dx=2x, db/dx=cos x, dL/da=1, and dL/db=1.", "Accumulate path contributions from x through a and b.", "Obtain dL/dx=2x+cos x exactly up to floating-point arithmetic."] },
      workedExamples: [{ title: "Shared variable paths", setup: "Let L=x^2+x^3.", steps: ["The x^2 path contributes 2x.", "The x^3 path contributes 3x^2.", "Add contributions because x influences L through both paths."], result: "dL/dx=2x+3x^2." }, { title: "Compare finite differences", setup: "Estimate derivative using [f(x+h)-f(x)]/h.", steps: ["Large h creates truncation error.", "Tiny h causes subtractive cancellation.", "Autodiff applies exact symbolic derivative rules to executed operations."], result: "Autodiff avoids the finite-difference step-size tradeoff." }],
      exercises: [{ level: "Beginner", question: "For y=x^2 and L=3y, compute dL/dx.", answer: "dL/dy=3 and dy/dx=2x, so dL/dx=6x." }, { level: "Intermediate", question: "For z=xy and L=z^2, find partial L/partial x.", answer: "2z * y=2xy^2." }, { level: "Applied", question: "Why is autodiff not the same as symbolic differentiation?", answer: "It differentiates the concrete sequence of primitive operations during program execution rather than constructing and simplifying one symbolic expression." }],
      takeaways: ["Autodiff applies the chain rule to primitive program operations.", "Shared dependencies require summing path contributions.", "It produces derivatives accurate to floating-point arithmetic.", "It differs from both symbolic differentiation and numerical finite differences."]
    },
    "forward-mode-and-reverse-mode-autodiff": {
      prerequisites: ["Jacobians and chain rule.", "Automatic-differentiation computation graphs.", "Input and output dimensionality."],
      notationGuide: [{ symbol: "Jv", latex: "Jv", meaning: "Jacobian-vector product computed by forward mode." }, { symbol: "v^T J", latex: "v^\\top J", meaning: "Vector-Jacobian product computed by reverse mode." }, { symbol: "tangent", latex: "\\dot v", meaning: "Forward-propagated directional derivative." }, { symbol: "adjoint", latex: "\\bar v", meaning: "Reverse-propagated output sensitivity." }],
      formulaLatex: ["Jv", "v^\\top J", "\\nabla_\\theta L=J_L^\\top 1"],
      derivation: { title: "Compare propagation on y=sin(x squared)", steps: ["Forward mode carries x and tangent x-dot, then computes a=x^2 with a-dot=2x x-dot, then y with y-dot=cos(a)a-dot.", "Reverse mode first computes x,a,y and stores needed values.", "Seed y-bar=1, propagate a-bar=y-bar cos(a), then x-bar=a-bar 2x.", "Both return the same derivative; they organize chain-rule multiplication in opposite directions."] },
      workedExamples: [{ title: "Few inputs, many outputs", setup: "A simulator maps 2 controls to 10,000 outputs.", steps: ["One forward pass per input direction gives a Jacobian column.", "Only two independent input directions exist.", "Reverse mode would need many output seeds for the full Jacobian."], result: "Forward mode is attractive for the complete sensitivity matrix." }, { title: "Many parameters, one loss", setup: "A network maps ten million weights to one scalar loss.", steps: ["One reverse seed starts at the loss.", "Adjoints flow to every parameter.", "A full gradient arrives in one reverse sweep after evaluation."], result: "Reverse mode, known as backpropagation here, is strongly preferred." }],
      exercises: [{ level: "Beginner", question: "Which mode naturally computes Jv?", answer: "Forward mode." }, { level: "Intermediate", question: "For f:R^3->R^2, how many directional sweeps form the full Jacobian in each basic mode?", answer: "Three forward sweeps for columns or two reverse sweeps for rows." }, { level: "Applied", question: "Why does gradient checkpointing reduce reverse-mode memory?", answer: "It stores fewer forward intermediates and recomputes selected values during the backward pass." }],
      takeaways: ["Forward mode propagates input tangents to outputs.", "Reverse mode propagates output adjoints to inputs.", "Choose based mainly on selected input versus output directions.", "Reverse mode powers neural-network backpropagation but requires activation memory or recomputation."]
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
