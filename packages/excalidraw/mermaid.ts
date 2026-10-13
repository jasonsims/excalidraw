const MERMAID_CHART_TYPES = [
  "flowchart",
  "graph",
  "sequenceDiagram",
  "classDiagram",
  "stateDiagram",
  "stateDiagram-v2",
  "erDiagram",
  "journey",
  "gantt",
  "pie",
  "quadrantChart",
  "requirementDiagram",
  "gitGraph",
  "C4Context",
  "mindmap",
  "timeline",
  "zenuml",
  "sankey",
  "xychart",
  "block",
];

/** heuristically checks whether the text may be a mermaid diagram definition */
export const isMaybeMermaidDefinition = (text: string) => {
  const chartTypes = MERMAID_CHART_TYPES;

  const re = new RegExp(
    `^(?:%%{.*?}%%[\\s\\n]*)?\\b(?:${chartTypes
      .map((x) => `\\s*${x}(-beta)?`)
      .join("|")})\\b`,
  );

  return re.test(text.trim());
};

const MERMAID_DIAGRAM_TYPE_RE = new RegExp(
  `^(?:%%{.*?}%%[\\s\\n]*)?\\s*(${[...MERMAID_CHART_TYPES]
    // match the longest type first (e.g. `stateDiagram-v2`)
    .sort((a, b) => b.length - a.length)
    .join("|")})(?:-beta)?\\b`,
);

/**
 * Returns the (known) chart type of a mermaid definition, e.g. `flowchart`.
 * Never returns any other part of the definition (it's user content).
 */
export const getMermaidDiagramType = (text: string) => {
  return text.trim().match(MERMAID_DIAGRAM_TYPE_RE)?.[1] ?? "unknown";
};
