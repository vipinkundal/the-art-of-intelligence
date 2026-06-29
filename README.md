# The Art of Intelligence

The Art of Intelligence is a roadmap project for learning artificial intelligence from first principles through practical implementation.

The goal is to make the AI learning process visible: what to learn, why it matters, how concepts connect, and what projects prove understanding.

## Website

Open [index.html](index.html) in a browser to use the simple AI glossary website. It includes search, category filters, plain-language definitions, examples, and lesson links for common AI terms.

Lesson pages live under [lessons/](lessons/). The pattern is:

```text
lessons/<phase-folder>/<topic-folder>/index.html
```

Each phase folder also has a landing page:

```text
lessons/<phase-folder>/index.html
```

For example:

```text
lessons/generative-ai/transformers/index.html
```

The first mathematical foundations lesson is:

```text
lessons/mathematical-foundations/linear-algebra/index.html
```

The 1.2 mathematical foundations lesson is:

```text
lessons/mathematical-foundations/calculus-and-matrix-calculus/index.html
```

The 1.3 mathematical foundations lesson is:

```text
lessons/mathematical-foundations/probability/index.html
```

The 1.4 mathematical foundations lesson is:

```text
lessons/mathematical-foundations/statistics/index.html
```

The 1.5 mathematical foundations lesson is:

```text
lessons/mathematical-foundations/optimization/index.html
```

The 1.6 mathematical foundations lesson is:

```text
lessons/mathematical-foundations/information-theory/index.html
```

The 1.7 mathematical foundations lesson is:

```text
lessons/mathematical-foundations/discrete-mathematics-theoretical-computer-science/index.html
```

Use `lessons/_template/topic-name/index.html` as the starter file for new lesson topics.

You can also generate a starter lesson page with:

```text
npm run create:lesson -- --phase "mathematical foundations" --title "Numerical Methods" --number "1.8"
```

The generator creates the topic page and links it from the matching phase page and lesson library.

You can pass content while generating:

```text
npm run create:lesson -- --phase "mathematical foundations" --title "Numerical Methods" --number "1.8" --items "Floating-point arithmetic; Stability; Iterative methods" --example "A numerically stable implementation can avoid overflow when computing probabilities." --why "Numerical methods help AI systems compute reliably at scale."
```

Formula sections can be generated with `--formulas "Mean=E[X]; Variance=E[(X - mu)^2]"`. Use `--example` for a concrete example and `--note` for an extra closing explanation from a source screenshot.

To list the current lesson inventory:

```text
npm run list:lessons
```

After adding or editing lessons, run:

```text
npm run check
```

The check command validates local scripts, audits phase, homepage, lesson-library, glossary lesson links, shared template usage, and checks that topic pages contain the required lesson sections.

## Shared Templates

The site header and footer are rendered from [site-template.js](site-template.js). HTML pages should use placeholders instead of copying the full navigation and footer markup:

```html
<div data-site-header data-root="../../" data-active="lessons"></div>
...
<div data-site-footer></div>
<script src="../../site-template.js"></script>
```

Use the correct `data-root` depth for the page location. Use `data-active="terms"`, `data-active="lessons"`, or `data-active="sequence"` when a top navigation item should be marked as current.

Lesson card grids are rendered from [lesson-data.js](lesson-data.js). Use `data-lesson-card-grid` for shared lesson-library grids and `data-phase-card-grid` for phase landing pages:

```html
<div data-lesson-card-grid="phaseCards" data-compact="true"></div>
<div data-lesson-card-grid="topicCards" data-label="Available lessons"></div>
<div data-phase-card-grid="mathematical-foundations" data-label="Mathematical foundations lessons"></div>
```

Pages that use card-grid placeholders must load `lesson-data.js` before `site-template.js`.

Lesson article pages use the same shared renderer. Put the unique sections and lesson navigation inside the template:

```html
<template data-lesson-page data-eyebrow="Phase 8" data-title="8. Retrieval, Search And RAG" data-summary="Short summary." data-article-class="phase-article">
  <section>...</section>
  <nav class="lesson-nav" aria-label="Lesson navigation">...</nav>
</template>
```

To normalize existing pages after manual edits, run:

```text
npm run apply:templates
```

To serve the static site locally:

```text
npm run serve
```

The default local URL is `http://127.0.0.1:57391/index.html`. Set `PORT` if that port is already in use.

## Project Goals

- Build a clear path from AI foundations to applied systems.
- Track concepts, experiments, projects, and reflections in one place.
- Turn abstract AI topics into practical milestones.
- Create a reusable learning map for future learners.

## Roadmap Structure

The roadmap is organized into phases:

1. Foundations: mathematics, programming, data, and problem solving.
2. Machine learning: supervised learning, evaluation, feature engineering, and model selection.
3. Deep learning: neural networks, optimization, computer vision, and sequence models.
4. Generative AI: transformers, embeddings, language models, prompt design, and retrieval.
5. AI systems: agents, tooling, evaluation, safety, deployment, and product design.
6. Portfolio: complete projects that demonstrate real skill and judgment.

See [ROADMAP.md](ROADMAP.md) for the working roadmap.

## Repository Status

This repository has been initialized with Git and is ready for iterative updates.
