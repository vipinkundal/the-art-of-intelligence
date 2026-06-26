# Lesson Folder Guide

Each lesson belongs inside a phase folder, then a topic folder, then an `index.html` page.

```text
lessons/<phase-folder>/<topic-folder>/index.html
```

Each phase folder also has a landing page:

```text
lessons/<phase-folder>/index.html
```

Example:

```text
lessons/generative-ai/transformers/index.html
```

## Current Phase Folders

- `foundations/`
- `mathematical-foundations/`
- `programming-and-systems-foundations/`
- `classical-artificial-intelligence/`
- `probabilistic-ai/`
- `machine-learning/`
- `deep-learning/`
- `generative-ai/`
- `retrieval-search-and-rag/`
- `reasoning-models-and-inference-time-computation/`
- `ai-systems/`
- `representation-learning-and-self-supervision/`
- `generative-modelling/`
- `state-space-models-and-alternative-sequence-architectures/`
- `mixture-of-experts-models/`
- `computer-vision/`
- `speech-audio-and-time-series-ai/`
- `multimodal-ai/`
- `reinforcement-learning/`
- `portfolio/`

## Topic Page Checklist

- Use lowercase folder names with hyphens, such as `prompt-engineering`.
- Keep one lesson topic per folder.
- Link back to `../../index.html` for the lesson library.
- Link shared styles with `../../../styles.css`.
- Include a short summary, the simple idea, study items, an example, AI relevance, a learning target, and lesson navigation.

## Template

Copy `lessons/_template/topic-name/index.html` when starting a new topic page.

## Generator

You can also create a starter lesson page with:

```text
npm run create:lesson -- --phase "mathematical foundations" --title "Numerical Methods" --number "1.8"
```

This creates:

```text
lessons/mathematical-foundations/numerical-methods/index.html
```

The generator will not overwrite an existing lesson page. It also links the new topic from the homepage, phase landing page, and main lesson library.

Useful content options:

- `--simpleIdea`: paragraph for the simple idea section.
- `--items`: semicolon-separated study items, such as `"Sets; Graphs; Induction"`.
- `--itemsHeading`: heading for the study-items section.
- `--formulas`: semicolon-separated `label=formula` pairs, such as `"Dot product=x . y; Norm=||x||_2"`.
- `--example`: paragraph for a concrete example section.
- `--why`: paragraph explaining why the topic matters for AI.
- `--note`: extra explanatory note paragraph.
- `--learningTarget`: paragraph for the final learning target.

## Inventory

To list the current lesson inventory:

```text
npm run list:lessons
```

## Audit

After adding or editing lessons, run:

```text
npm run check
```

The check command validates local scripts, confirms topic pages include the required lesson sections, audits that phase pages exist, checks that topic pages are linked from their phase page, the homepage, and the lesson library, verifies glossary lesson links, and confirms local HTML links resolve to real files.

## Local Preview

Run the static site locally with:

```text
npm run serve
```

The default local URL is `http://127.0.0.1:8000/index.html`.
