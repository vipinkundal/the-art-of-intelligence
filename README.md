# The Art of Intelligence

The Art of Intelligence is a static learning website for studying artificial intelligence from first principles through modern AI systems.

The project is built to make the learning path visible: what to study, why each topic matters, how ideas connect, and what kind of projects prove understanding.

## What Exists In The Project

- A searchable AI glossary with plain-language definitions, examples, categories, and lesson links.
- A lesson library organized as a broad AI roadmap, from mathematical foundations through classical AI, machine learning, deep learning, generative AI, retrieval, agents, safety, infrastructure, research methodology, and representative papers.
- Phase landing pages that summarize major areas of AI and list the concepts to study.
- Deeper topic pages for selected foundations, generative modelling topics, neural networks, transformers, agents, and portfolio projects.
- External learning links on many lesson topics, pointing to Wikipedia, papers, documentation, courses, or other useful references.
- Shared site templates for the header, footer, lesson layout, and lesson cards.
- Scripts for creating lesson pages, listing lessons, applying shared templates, serving the static site locally, and auditing lesson links and structure.

## How It Is Built

This is a simple static HTML, CSS, and JavaScript site. There is no framework build step.

The main pieces are:

- `index.html` and `script.js` for the glossary experience.
- `lessons/` for the roadmap and lesson content.
- `lesson-data.js` for lesson-card data.
- `site-template.js` for shared rendering of navigation, footers, cards, and lesson pages.
- `styles.css` for the visual design.
- `scripts/` for local maintenance tools.

## Local Development

Install dependencies once:

```text
npm install
```

Serve the site locally:

```text
npm run serve
```

Run validation after changing lesson content or shared templates:

```text
npm run check
```

Useful maintenance commands:

```text
npm run list:lessons
npm run create:lesson
npm run apply:templates
```

## Project Goals

- Build a clear path from AI foundations to applied systems.
- Connect concepts, experiments, papers, and projects in one learning map.
- Keep explanations practical, readable, and easy to navigate.
- Support iterative expansion as the roadmap grows.
