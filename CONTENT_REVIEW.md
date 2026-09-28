# Content review — ongoing

The review covers every topic reachable from `/lessons/`, duplicate concepts, curriculum gaps, factual explanations, examples, source relevance, and explanatory visuals. It is not complete.

## Current evidence (2026-09-28)

- 389 addressable lesson documents; 386 canonical lessons after consolidating three duplicate pairs.
- 75 canonical lessons now have authored explanations, assumptions, worked arithmetic, failure modes, implementation notes, primary/canonical sources, and calculated interactive diagrams.
- 311 canonical lessons still require factual and source review. They are marked pending in the library and lesson view.
- The source-derived corpus still contains 41 repeated passages appearing on more than two pages. These are editorial candidates, not automatically proven duplicate concepts.
- Six new concepts: Brier score, split conformal prediction, geometric distribution, conditional expectation, law of total variance, and standard error. Early stopping and Markov chains each have one canonical lesson. The new Multiple testing treatment also consolidates the overlapping Multiple-testing correction entry, preserving its old address as an alias rather than claiming another new concept.

Earlier build and screenshot reports did not establish content accuracy. In particular, the old generator assigned labs and equations from keywords, invented alphabetical prerequisites, and generated repeated generic prose. This pass removes generated pseudo-equations, filler hooks and implementation advice; marks remaining generic illustrations as schematics; and reserves reviewed status for authored content. Missing sections are reported as missing rather than filled with invented instruction.

## Reviewed topics

Conditional probability; Bernoulli; Binomial; Bayes' theorem; Entropy; Cross-entropy; KL divergence; Perplexity; Brier score; Confidence intervals; Eigenvalues and eigenvectors; Eigendecomposition; Early stopping; Markov chains; Split conformal prediction.

Reviewed source lives in `content/editorial/reviewed-lessons.mjs`. Edit this authored input, not generated MDX. `content:generate` recreates the MDX and metadata, preserving editorial overrides. Additional batches may be split into imported modules as the corpus grows.

The additional linear-algebra batch lives in `content/editorial/linear-algebra.mjs`: scalars/vectors/matrices/tensors; spaces/span/basis/dimension; linear independence; inner products; matrix multiplication/contraction; norms; distance/similarity; orthonormal bases; projections; rank/null space; trace/determinant; PSD matrices; SVD; low-rank approximation; sparse matrices; matrix calculus; Jacobians/Hessians; Kronecker products; Einstein summation; numerical conditioning. Together with the two earlier eigen lessons, all 22 topic entries in the original linear-algebra group now have authored content and calculated examples. The broad Linear Algebra overview and other section hubs are not included in that claim.

`lib/content/linear-algebra.ts` implements the 20 new numerical models. Accessible tables show actual matrix entries. Geometric plots preserve equal coordinate scales; their viewport now follows container width instead of shrinking labels. Topic-specific lab titles replace repeated long lesson titles. Supporting matrices on graph pages expand below the controls, while matrix-only labs show their tables immediately. Lesson navigation remounts a new calculation model so one lesson's slider state cannot leak outside another lesson's valid range.

## Verification performed

### Latest statistical-inference batch

`content/editorial/statistical-inference.mjs` authors 11 canonical lessons: point estimation, bias/variance, MLE, MAP, conjugate priors, posterior predictive distributions, hypothesis testing, p-values/power, bootstrap, standard error, and multiple testing. The last treatment subsumes the existing Multiple-testing correction page; only standard error is a new concept. `lib/content/statistical-inference.ts` provides 11 calculation models.

Examples distinguish estimators from realized estimates, likelihood from parameter probability, posterior modes from posterior means, and prospective power from an observed p-value. MAP explains its coordinate dependence. Bootstrap enumerates a conditional resampling distribution and exposes its all-zero limitation. Predictive counts compare an exact beta-binomial distribution with a plug-in binomial, showing their different variances. Multiple testing separates per-test and family-wise error, Bonferroni's dependence-free bound, and the separate FDR criterion.

The shared renderer now places comparison bars in separate slots, with left/right series labels and complete probability rows for the predictive and testing examples. Bar widths respect category spacing and available edge margins. A shared adaptive vertical scale makes predictive comparisons readable, and the displayed assumptions explicitly describe that rescaling.

The glossary's relationship labels now come from authored prerequisites rather than search tags such as internal model names and “reviewed.” Unmapped relationships are stated as missing. Exact-title matches rank first so clicking a concept cannot select a different lesson that merely lists it as a prerequisite. Prerequisite labels use a wrapping layout after the former absolute-position layout was observed overlapping at 320px.

- 68 tests pass, including 14 new inference/geometry tests and two glossary regression tests: independent binary-sequence enumeration, exact squared-error risk, likelihood endpoints, posterior score roots, density normalization, factorial beta-binomial calculations, rejection probabilities, bootstrap variance, multiple-testing products/bounds, bar separation, all declared chart domains, authored relationship labels and exact-title selection across the entire glossary. Strict TypeScript, lint, schema validation, MDX compilation and production build pass.
- Production build generates 394 pages; export verification checks 392 content pages, all 340 legacy addresses and rendered local links/anchors. Full HTTP verification returns valid main content and status 200 for all 392 pages, including a glossary query URL.
- All 11 production labs respond to keyboard endpoint changes and reset after hydration, without captured console warnings/errors. Predictive m=1 agrees with its plug-in distribution; m=20 gives variances 20 versus 4.8. The numeric table exposes all 42 count probabilities at that setting.
- Predictive, MAP and multiple-testing layouts have no document overflow or offscreen SVG labels at 1440, 1024, 768, 390 and 320px. A 47-row predictive value table fits at 320px; light-theme grouped bars were inspected at 390px and theme choice persisted after reload.
- The old Multiple-testing correction HTML address renders the canonical reviewed lesson with a working lab. Library results expose one Multiple testing entry. The standard-error glossary query selects Standard error ahead of Bootstrap and maps Variance and covariance plus Point estimation as its prerequisites.
- Evidence: `design-qa/inference-predictive-desktop.jpg`, `inference-multiple-320.jpg`, `inference-predictive-light-390.jpg`, and `inference-glossary-320.jpg`. This is mathematical/content review plus representative layout verification, not a new design direction or a complete visual audit of every pending lesson.

### Latest probability-foundations batch

`content/editorial/probability-foundations.mjs` authors 13 topics: sample spaces/events, random variables, joint/marginal/conditional distributions, independence/conditional independence, total probability, expectation, variance/covariance, correlation, LLN, CLT, change of variables, conditional expectation, and total variance. The last two are new lessons. `lib/content/probability-foundations.ts` provides separate numerical models; the shared renderer now supports discrete scatter populations.

Examples distinguish zero correlation from independence, within-group independence from marginal dependence, finite distributions from samples, and raw data from standardized sums. The CLT compares two CDFs rather than equating probability mass with density. Total expectation and variance are verified against enumerated populations. Authored explanations include assumptions, worked arithmetic, limitations and canonical sources.

Removed leaked authoring prompts from pending lessons without marking them reviewed. Empty introductory panels are suppressed while preserving their anchors. A regression test guards against those prompt fragments returning. Library search now correctly labels a single result as one lesson.

- 52 tests pass, including 14 foundation-model tests and the authoring-prompt regression. Schema validation, strict TypeScript, lint, MDX compilation and production build pass.
- Build generated 392 pages. Static-export verification checked 390 content pages and all 340 legacy addresses, including rendered local links and anchors. HTTP requests returned valid main content and status 200 for all 390 pages, including the glossary query URL.
- All 13 production labs responded to keyboard changes after hydration, without captured console warnings/errors. Reset restored the correlation example to zero; a=2 produced correlation 0.86066. CLT n=100 produced a maximum CDF gap of approximately 0.04912, versus 0.14961 at n=10.
- Correlation, CLT and joint distributions had no document overflow or offscreen SVG labels at 1440, 1024, 768, 390 and 320px. Expanded joint/marginal tables fit at 320px. Light-theme correlation was inspected at 390px and the theme survived reload.
- Evidence: `design-qa/probability-correlation-desktop.jpg`, `probability-clt-320.jpg`, `probability-correlation-light-390.jpg`, `probability-foundations-comparison.jpg`, and `probability-foundations-controls.jpg`. These checks cover this batch, not the entire remaining corpus.

### Latest probability-distribution batch

`content/editorial/distributions.mjs` adds authored content for probability mass/density functions, CDFs, categorical, multinomial, uniform, Gaussian, multivariate Gaussian, Poisson, geometric, exponential, gamma, beta, Dirichlet, log-normal, Student's t, and Gumbel. `lib/content/distributions.ts` supplies 16 separate calculation models. The geometric lesson fills the discrete first-success waiting-time gap, with the support convention stated explicitly.

Plots distinguish density from mass, joint distributions from marginals, and finite display windows from complete support. Gaussian and uniform shading encodes actual probability area. Covariance contours preserve equal coordinate scales. Undefined t moments are explained rather than displayed as zero; small nonzero tails use scientific notation. Poisson upper tails are summed directly to avoid cancellation. Numeric rows are unique, including the zero-count row.

The shared renderer omits exact repeats already shown in the hero or first lab: introductory text, hooks, duplicated equation/assumption pairs, and takeaways. Authored metadata and legacy anchors remain intact. This does not resolve the separate corpus-wide repeated-passage queue.

- 37 tests passed, including normalization, moments, boundary conventions, Mahalanobis contour residuals, omitted tail accounting, and every declared slider value. Schema validation, strict TypeScript, lint, MDX compilation and production build passed.
- Production build generated 390 pages; export verification checked 388 content pages and all 340 legacy addresses. Actual HTTP requests returned valid content and HTTP 200 for all 388, including the glossary query URL.
- All 16 production labs rendered and responded to keyboard controls after hydration, with no captured console warnings/errors in a fresh tab. Reset checks passed. Student's t at ν=1 reports undefined mean and no finite variance; Gaussian σ=2 reports variance 4; Poisson λ=0 puts all mass at zero.
- Gaussian, Poisson and multivariate Gaussian had no document overflow or offscreen SVG labels at 1440, 1024, 768, 390 and 320px. Student's t was inspected in light theme at 390px; theme persisted across reload. The new topic is discoverable through library search and the glossary-to-lesson link.
- Evidence: `design-qa/distributions-gaussian-desktop.jpg`, `distributions-poisson-320.jpg`, `distributions-student-light-390.jpg`, and the combined reference/control comparisons in the same directory. This is a representative visual pass, not a complete visual audit of every remaining page.

### Earlier verification history

- `npm run check`: content generation, real Zod schema parsing, canonical/prerequisite resolution, reviewed-content completeness, numerical tests, strict TypeScript, and lint passed.
- 24 tests cover probability normalization and moments, fixed worked values, edge cases, state-transition conservation, checkpoint selection, eigenvector residual relationships, conformal order statistics, all declared slider settings, duplicate route preservation, SVD reconstruction, orthogonal projection identities, finite-difference derivatives, Kronecker block ordering, sparse storage crossover, and condition-number amplification. Matrix entries and nonempty visual output are checked across every declared control value.
- Production build generated 389 pages. `npm run test:export` inspected 387 content pages, confirmed all 340 legacy HTML outputs, and found no unresolved rendered local links or fragment anchors.
- Browser: all 382 canonical entries are reachable in the library; the 100-item cap is gone. Searching Markov chains returns one result. The reviewed-only filter works.
- Browser: Bayes prior change from 0.1 to 0.5 changes posterior from 0.5 to 0.9; early-stopping control responds to Home/ArrowRight; old Early stopping address renders the canonical lesson; light and dark themes render the new diagrams; Bayes lesson has no horizontal overflow at 390px or 320px.
- Initial chart tooltip hydration failure was reproduced and fixed. Fresh navigation showed no console errors on the tested reviewed page.
- Glossary export now includes headings, definitions, and links before its query-aware client controls load.
- Latest batch: all 20 new labs rendered a visual and control in the exported site, with no captured console errors or desktop overflow. SVD and matrix-product pages had no document overflow at 320, 390, 768, 1024, and 1440px. Sparse 5×5 tables were checked at 320px; light-theme matrices at 390px. SVD keyboard input at 90° produced output length 2; a matrix-product control change updated C₀₀ to 5; moving from SVD's 360° setting to Sparse matrices reset correctly to five entries. Theme choice survived reload.
- A server/browser floating-point difference in SVG point strings caused an initial hydration warning. Display coordinates are now rounded to 0.001 SVG units; a fresh production tab traversed all 20 new models with no console errors.
- HTTP verification against the exported server returned valid main content and HTTP 200 for all 387 addressable content pages, including `/index.html`, the library, and `/terms/index.html?term=matrix`. Strict checks, production build, export verification, and `git diff --check` passed after the final implementation edits.

Screenshot evidence: `design-qa/content-review-bayes-desktop.png`, `design-qa/content-review-bayes-mobile.png`, `design-qa/content-review-conformal-desktop.png`. These are representative checks, not evidence that every page has been visually reviewed.

Latest visual evidence: `design-qa/linear-svd-desktop.png`, `design-qa/linear-svd-320.png`, `design-qa/linear-sparse-320.png`, `design-qa/linear-product-light-390.png`, and `design-qa/linear-reference-comparison.png`. The comparison transfers the selected design language to an SVD lesson; it is not a pixel-identical copy of the eigendecomposition reference.

## Remaining work and completion gate

1. Use `content/generated/editorial-audit.json` as the complete route-by-route queue. Review pending topics against sources; replace each generic lesson with topic-specific assumptions, correct notation, a worked example, limitations, and a truthful visual. Start with the probability/statistics and linear-algebra prerequisites around the reviewed topics, then cover classical AI, probabilistic models, deep learning, generative modelling, and the remaining phase hubs.
2. Review the 41 repeated passages in context. Merge truly duplicated concepts while retaining aliases; distinguish overview lessons from deeper treatments instead of deleting by title similarity.
3. Audit curriculum coverage across every phase. The six new concepts are not a claim that the curriculum gap analysis is complete.
4. Replace the remaining schematic engines with mathematically valid or explicitly explanatory topic visuals, with meaningful controls and textual alternatives. Keep current metadata and source links synchronized.
5. Recheck mobile/desktop rendering, dark/light themes, keyboard controls, glossary query URLs, and numeric outputs across the expanded set of visual models. Verify the entire static export again after final content changes.
6. Run `npm run audit:editorial -- --require-complete`. It intentionally fails while pending lessons or repeated passages remain. Even a pass requires a final manual source/factual review; structural checks cannot certify every claim.

Do not mark the thread goal complete until the full route inventory and curriculum review are complete. This pass is substantive progress, not completion of the requested all-page review.
