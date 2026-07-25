import type { FaqItem, ToolExample } from "@/lib/types";

export const HTML_MINIFIER_FAQ_ITEMS: FaqItem[] = [
  { question: "What does this actually remove?", answer: "HTML comments and extra blank lines. It deliberately does not collapse whitespace between tags or attributes, since that whitespace can affect rendering in some cases (inline elements especially)." },
  { question: "Will this break my HTML?", answer: "No — it only removes comments and blank lines, never restructures tags or attributes, so the rendered output is unchanged." },
  { question: "Why not a more aggressive minifier?", answer: "A fully aggressive HTML minifier requires a real parser to avoid subtle rendering changes. For maximum compression in production, a build-time tool like html-minifier-terser is the safer choice — this tool is for quick, safe cleanup." },
];

export const HTML_MINIFIER_EXAMPLE: ToolExample = {
  title: "Example: cleaning up commented HTML",
  summary: "Pasting HTML with comments and extra blank lines:",
  inputs: [{ label: "Input", value: "<!-- header -->\n<div>\n\n\n  <p>Hello</p>\n</div>" }],
  outputs: [{ label: "Output", value: "<div>\n\n  <p>Hello</p>\n</div>" }],
};
