import type { FaqItem, ToolExample } from "@/lib/types";

export const CSS_MINIFIER_FAQ_ITEMS: FaqItem[] = [
  { question: "What does this actually remove?", answer: "CSS comments (/* ... */) and extra blank lines, while correctly leaving comment-like text inside strings (e.g. in content: or url()) untouched." },
  { question: "Will this break my CSS?", answer: "No — it only removes comments and blank lines, never touches selectors, properties, or values, so the rendered styles are unchanged." },
  { question: "Why not a more aggressive minifier?", answer: "A fully aggressive CSS minifier also merges rules and shortens values, which requires a real parser to do safely. For maximum compression in production, a build-time tool like cssnano is the safer choice — this tool is for quick, safe cleanup." },
];

export const CSS_MINIFIER_EXAMPLE: ToolExample = {
  title: "Example: cleaning up commented CSS",
  summary: "Pasting CSS with comments and extra blank lines:",
  inputs: [{ label: "Input", value: "/* button styles */\n.btn {\n  color: red;\n\n\n  padding: 8px;\n}" }],
  outputs: [{ label: "Output", value: ".btn {\n  color: red;\n\n  padding: 8px;\n}" }],
};
