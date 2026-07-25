import type { FaqItem, ToolExample } from "@/lib/types";

export const JS_MINIFIER_FAQ_ITEMS: FaqItem[] = [
  { question: "What does this actually remove?", answer: "JavaScript comments (both // and /* */) and extra blank lines — correctly leaving comment-like text inside strings, template literals, and regex literals untouched." },
  { question: "Will this break my JavaScript?", answer: "No — this is deliberately conservative. It never joins lines together or removes whitespace between tokens, which is where naive minifiers commonly break code that relies on automatic semicolon insertion. Comments are only stripped when they're genuinely comments, not text that merely looks like one inside a string or regex." },
  { question: "Why not a more aggressive minifier that shrinks file size further?", answer: "True minification (renaming variables, removing all unnecessary whitespace) requires a full JavaScript parser to do safely — a hand-rolled version risks silently producing broken code. For production, a real bundler-based minifier (Terser, esbuild) is the correct tool; this one is for quick, safe cleanup of a snippet." },
];

export const JS_MINIFIER_EXAMPLE: ToolExample = {
  title: "Example: cleaning up commented JavaScript",
  summary: "Pasting JS with comments and extra blank lines:",
  inputs: [{ label: "Input", value: "// calculate total\nfunction total(a, b) {\n\n\n  return a + b; // sum\n}" }],
  outputs: [{ label: "Output", value: "function total(a, b) {\n\n  return a + b;\n}" }],
};
