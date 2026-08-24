# Design QA — Latent Atlas cutover

## Reference and implementation

- Selected source: `design/latent-atlas-reference.png`
- Representative implementation: `design-qa/eigendecomposition-1487x1058.jpg`
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

## Build and route checks

- Strict TypeScript: passed
- ESLint: passed
- MDX compilation: passed
- Content schema validation: passed
- Production static export: passed (387 generated pages)
- Legacy route parity: passed (340 of 340 lesson HTML addresses generated)

final result: passed
