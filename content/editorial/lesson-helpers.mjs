export const math = (name) => `mathematical-foundations/topics/${name}`;
export const source = (label, url) => ({ label, url });

export function reviewed({ title, labTitle, summary, hook, model, control, equation, assumptions, takeaway, prerequisites = [], sources, ideas, process, example, pitfalls, implementation, outcomes }) {
  return {
    title, summary, prerequisites: prerequisites.map((slug) => slug.replaceAll("/", "--")), sources, outcomes,
    tags: [title.toLowerCase(), model, "reviewed"],
    labs: [{ engine: "calculation", model, title: labTitle || `${title}: calculate and compare`, summary: hook, equation,
      assumptions, accessibilitySummary: `${title}. ${assumptions} A data table and numeric summary accompany the graph.`,
      takeaway, seed: 0, parameter: { id: model, label: control[0], min: control[1], max: control[2], step: control[3], initial: control[4], unit: control[5] || "" } }],
    narrative: { hook, overview: summary, concepts: ideas.map(([title, explanation]) => ({ title, explanation })), process,
      formulas: [{ label: "Definition and assumptions", expression: equation, meaning: assumptions }],
      example: { title: example[0], setup: example[1], steps: example[2], result: example[3] },
      pitfalls, implementation, takeaways: [takeaway, outcomes[1]] },
  };
}
