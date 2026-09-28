# Design QA — Latent Atlas cutover

The original cutover baseline is retained below. The September linear-algebra implementation pass is recorded at the end. The ongoing content review and its verification limits are documented in `CONTENT_REVIEW.md`; this report does not certify the factual accuracy of the entire course.

## Reference and implementation

- Selected source: `design/latent-atlas-reference.png`
- Representative implementation: `design-qa/eigendecomposition-1487x1058.jpg`
- Representative section hub: `design-qa/mathematical-foundations-hub-1440.png`
- Combined comparison: `design-qa/reference-vs-implementation.png`
- Comparison dimensions: 1487 × 1058 pixels for both source and implementation
- State: dark theme, eigendecomposition lesson, initial geometry-lab state

## Visual comparison

The implementation preserves the selected direction’s dark indigo field, compact global header, left chapter rail, cyan/violet vector language, coral selected point, large technical visualization, formula readout, and bottom insight/control console. Typography, border density, spacing rhythm, and near-square control geometry match the reference language. The production layout intentionally replaces the reference’s fixed matrix story with the validated lesson summary, outcomes, accessibility metadata, and reusable lab shell.

No P0, P1, or P2 visual differences remain. The reference contains a more illustrative three-stage matrix transformation, while the implementation uses a reusable, data-driven invariant field; this is an intentional content difference and not a fidelity defect.

## Interaction and accessibility checks

- Cross-site search resolves beside its input and opens the matching lesson.
- Phase filters update the library without a full-page reload.
- The lab slider accepts pointer and keyboard input; inspect/pause and reset controls work.
- Dark/light theme switching works and the explicit choice is stored locally.
- The glossary honors `?term=…`, shows related concepts, and links to the visual lab.
- SVG labs expose titles, descriptions, labels, and a textual selected-insight summary.
- Reduced-motion rules disable nonessential animation; print output uses the light token set.
- Keyboard focus styles and a working skip link are present.

## Responsive checks

- 1440 × 1024: passed
- 1024 × 768: passed
- 768 × 900: passed
- 390 × 844: passed
- 320 × 720: passed
- No document-level horizontal scrolling at the supported widths.

## Section hub checks

- Phase roots now render a dedicated Latent Atlas section system map instead of repeating the ordinary lesson template.
- The Mathematical Foundations hub groups 140 topic labs into visual-engine clusters, exposes a section lab, and preserves the complete learning sequence.
- The hub passed at 1440 × 1000 and 390 × 844 with no horizontal overflow.
- Individual topics continue to render their topic-specific field labs and retain the shared typography, color, rail, graph, and control language.

## Build and route checks

- Strict TypeScript: passed
- ESLint: passed
- MDX compilation: passed
- Content schema validation: passed
- Production static export: passed (387 generated pages)
- Legacy route parity: passed (340 of 340 lesson HTML addresses generated)

## September 28 — linear-algebra design continuation

Scope: 20 additional topic-specific calculated labs, shared matrix rendering, readable responsive chart labels, and a more compact shared lesson heading. This is a design-system transfer to new lesson content, not a pixel-identical clone of the original eigendecomposition scene or a completed course-wide redesign.

### Evidence and normalization

- Source visual truth: `design/latent-atlas-reference.png`, 1487×1058 pixels.
- Implementation: `design-qa/linear-svd-desktop.png`, 1487×1058 pixels, CSS viewport 1487×1058 with one captured pixel per CSS pixel. No density rescaling in the comparison.
- Full-view combined comparison: `design-qa/linear-reference-comparison.png` (2974×1058).
- Focused comparison: `design-qa/linear-controls-comparison.png`, unscaled crops of the source and implemented control consoles. The different crop widths reflect their different content and are not treated as a sizing defect.
- State: dark theme, SVD lesson, initial 30° input, lab anchor selected; supporting matrices collapsed. The reference is an eigendecomposition lesson. Its three-stage decomposition story is intentionally replaced by SVD's calculated circle/ellipse and explicit reduced factors; the reference's playback is replaced by a meaningful angle control and reset.
- Additional evidence: `linear-svd-320.png`, `linear-sparse-320.png`, `linear-product-light-390.png` in the same folder.

### Findings and iteration

1. [P2, fixed] Long duplicated lesson titles delayed the visual on mobile. Short topic-specific lab titles now identify the actual experiment; shared page headings have a compact responsive scale.
2. [P2, fixed] Supporting factor tables separated graph controls from the plot. They now expand below the control console. Matrix-only lessons retain immediate visible tables.
3. [P2, fixed] Fixed-width SVG rendering made narrow-screen labels shrink. The plot now measures its container, preserves 12px labels, and maintains equal coordinate scales for geometry. SVD and matrix-product pages have no document overflow at 320, 390, 768, 1024, and 1440px.
4. [P1, fixed] Cross-runtime trigonometric rounding caused an SVG hydration warning. Coordinates now serialize to three decimals. A fresh production browser traversed all 20 new lessons with no captured console errors.

Post-fix evidence is the desktop/phone captures above, the 90° SVD length-2 readout, updated matrix-product cell values, five-column sparse table at 320px, persisted light theme, and successful SVD-to-Sparse navigation with independent slider state.

### Required fidelity surfaces

- Typography: retains the established sans-serif headings and monospaced graph labels, formulas, and controls. Shorter lab titles wrap cleanly. Numeric labels remain 12px rather than scaling with the diagram.
- Spacing/layout: retains the left chapter rail, bordered lab surface, graph-first hierarchy, and split insight/control console. Additional prose and data tables follow the experiment. The three-panel mock composition is not copied onto unrelated mathematical topics.
- Colors/tokens: uses the existing dark indigo, cyan, violet, coral, and semantic light-theme tokens. Matrix sign/zero shading supplements explicit numeric values; series labels and dash patterns supplement color.
- Image/graph quality: visuals are computed SVG data plots and semantic numeric tables, as explicitly required for interactive labs. No raster illustration is substituted or needed for this batch. Equal axis scaling keeps circles circular and projection angles meaningful.
- Copy/content: 20 authored explanations with worked examples, assumptions, pitfalls, and sources replace schematic material. The larger review remains incomplete (35 of 382 canonical lessons reviewed). This pass does not certify pending topics.
- Controls/accessibility: native sliders respond to keyboard, reset works, table captions and row/column headers are exposed, selected values have text summaries, and nonanimated plots work with the site's reduced-motion rules.

No remaining actionable P0/P1/P2 issues were observed within this batch's inspected states. P3 follow-up: the wide SVD plot could use the surrounding space for an additional explanatory stage, provided it remains mathematically specific rather than decorative. A full visual and factual review of every remaining section is still required.

### Verification

24 tests, schema validation, strict TypeScript, lint, and production export passed. The export link/anchor audit passed for 387 content pages and all 340 legacy lesson addresses. Actual HTTP checks returned valid content for all 387 pages including the glossary query URL. All 20 new production labs rendered controls and a plot/table; detailed interaction checks covered SVD, matrix multiplication, and sparse storage. The complete user acceptance plan across every lesson is not yet complete.

## September 28 — probability design continuation

Scope: 16 topic-specific probability labs and exact-repeat suppression in the shared lesson body. This continues the selected option 3 design system; the complete course-wide content and design acceptance remains unfinished.

### Evidence and comparison

- Source visual truth: `design/latent-atlas-reference.png`, 1487×1058.
- Final implementation: `design-qa/distributions-gaussian-desktop.jpg`, 1487×1058 CSS/pixel viewport, dark theme, initial σ=1, field-lab anchor. Captures have one pixel per CSS pixel and are not rescaled in the saved comparison.
- Full-view combined evidence: `design-qa/distributions-reference-comparison.png`, 2974×1058.
- Focused control evidence: `design-qa/distributions-controls-comparison.png`, source and implementation console crops at original density. Different crop widths reflect their different content.
- Mobile evidence: `design-qa/distributions-poisson-320.jpg` (320×720, dark, scrolled graph/readout); `design-qa/distributions-student-light-390.jpg` (390×844, light, ν=1, graph/readout).
- State difference: the source depicts an eigendecomposition scene, while the implementation is a Gaussian experiment. This comparison evaluates transfer of the selected design language, not pixel equality or identical mathematical content. The established site header, section rail and bordered lab shell are retained.

### Findings and fixes

1. [P2, fixed] Dense count labels crowded narrow plots. Tick density now follows available width; non-bar plots use three x ticks when narrow. Bar outlines were removed so zero-height bars do not imply positive probability.
2. [P1, fixed] Poisson exposed a duplicate P(K=0) data row and React key warning. The redundant row was removed; all reviewed models now have an automated unique-label assertion. The fresh production traversal had no captured warnings/errors.
3. [P2, fixed] Very small tail probabilities rounded to zero. Poisson tails are summed directly, and tiny numeric readouts use scientific notation. The final Poisson screenshot reports the positive tail rather than zero.
4. [P2, fixed] The body repeated the hero summary, lab hook, equation/assumptions and outcomes verbatim. Exact repeats are now suppressed without removing authored content or legacy fragment targets. Additional equation explanations remain when they differ from the lab.

Post-fix screenshots and full/focused comparisons above were opened and inspected. No actionable P0/P1/P2 issue remains in this batch's tested states.

### Required fidelity surfaces

- Typography: retains the established sans-serif headings and 12px monospaced plot labels. Topic-specific titles wrap on small screens; axis descriptions move below mobile plots rather than shrinking.
- Layout/spacing: maintains the chapter rail, prominent graph and split result/control console. Mobile layouts stack the console. The Gaussian plot intentionally uses one distribution and its shaded interval, not the unrelated three-stage matrix illustration.
- Colors/tokens: existing indigo surfaces, cyan marks, coral comparison series and semantic light palette are reused. Probability area has a subdued cyan fill; meaningful labels accompany series colors.
- Image/graph fidelity: computed SVG plots and semantic tables are explicitly requested functional data graphics, not replacements for decorative image assets. No new raster assets are needed. Contours use equal scales and probability plots keep labeled units.
- Copy/content: 16 authored topic explanations and examples, explicit assumptions, tail limitations and moment-existence caveats. Shared exact repetitions are removed. The full content review remains at 51 of 383 canonical lessons.
- Interaction/accessibility: all 16 sliders changed their readouts after hydration; reset and keyboard endpoints were tested. Numeric details are accessible, t's undefined moments are textual, and these nonanimated calculations do not depend on motion. Light choice survived reload.

### Verification and remaining scope

37 tests, strict TypeScript, lint, schema validation, MDX compilation, production build and export checks passed. All 340 legacy lesson files remain, with rendered local links and fragment anchors resolving. HTTP checked all 388 content pages. Three representative distribution layouts were checked at 1440, 1024, 768, 390 and 320px with no document overflow or offscreen chart labels. All 16 production pages rendered and had no captured console errors; library search and glossary navigation found the new geometric lesson.

P3 follow-up: richer multi-stage stories may help selected distributions once their core models are established. The one-result count wording was corrected in the subsequent foundations batch. A full course-wide source review and visual pass remain outstanding.

## September 28 — probability foundations continuation

Scope: 13 topic-specific calculated labs using the established option 3 design system. This is not a pixel-identical recreation of the eigendecomposition reference and does not certify the pending course content.

### Evidence and comparison

- Source: `design/latent-atlas-reference.png`, 1487×1058 pixels.
- Implementation: `design-qa/probability-correlation-desktop.jpg`, 1487×1058 CSS and captured pixels, dark theme, initial a=0, field-lab anchor. Both captures have matching dimensions; no density normalization was needed.
- Full comparison: `design-qa/probability-foundations-comparison.jpg`, 2974×1058. Focused comparison: `design-qa/probability-foundations-controls.jpg`, unscaled source and implementation control-console crops.
- Additional states: `design-qa/probability-clt-320.jpg` (320×1000) and `design-qa/probability-correlation-light-390.jpg` (390×844).
- Intentional difference: the reference's matrix transformation becomes an exact five-point scatter population. The shared chapter rail, dominant plot, formula, and lower readout/control layout carry across; playback is replaced by a meaningful numeric parameter. The reference's lesson-specific annotations and artwork are not appropriate to this different topic.

### Findings and required surfaces

No new actionable P0/P1/P2 mismatch was observed in the compared states. This was a verification pass; no visual defect/fix loop was required.

- Typography: established sans-serif headings and monospaced graph/control labels remain consistent. Mobile axis descriptions wrap below plots instead of shrinking chart text. Labels remain readable in the inspected light/dark states.
- Spacing/layout: chapter rail, bordered plot region, restrained separators, and split desktop console continue the existing implementation. Phone controls stack beneath the graph. Supporting joint-distribution tables expand separately and fit at 320px.
- Colors/tokens: dark indigo surfaces and cyan/coral data marks reuse semantic tokens; light mode provides dark text and darker plot marks on pale surfaces. Explicit series labels supplement color.
- Graph/asset quality: SVG points encode actual discrete population values, and CLT staircases retain their jumps. These are user-requested functional graphs, not decorative raster-asset substitutes. No new image assets are required.
- Copy/content: explanations are specific to each example. Exact repetitions and leaked writing prompts are removed; remaining unreviewed topics are still marked pending. The global content review is 64 of 385 canonical lessons, not complete.
- Interactions/accessibility: all 13 sliders update readouts via keyboard after hydration; reset works. Numeric tables, chart descriptions, and nonanimated plots remain usable without hover or motion. Theme persistence passed on reload. No captured console warnings/errors in the production test tab.

### Verification and checklist

- Passed: 52 tests; strict TypeScript; lint; schema validation; MDX compilation; 392-page production build; link/anchor audit of 390 content pages; all 340 legacy addresses; HTTP checks of all 390 content pages.
- Passed: correlation, CLT and joint-distribution layouts at 1440, 1024, 768, 390 and 320px without document overflow or offscreen SVG labels.
- P3 follow-up: consider compact direct point labels for the five-point correlation population; its accessible numeric table already exposes exact values.
- Remaining work: continue source review and bespoke examples across the 321 pending canonical lessons, then run the complete course-wide acceptance pass.

final result: passed
