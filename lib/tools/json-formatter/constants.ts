import type { FaqItem, ToolExample } from "@/lib/types";

export const JSON_FORMATTER_FAQ_ITEMS: FaqItem[] = [
  { question: "Does this send my JSON to a server?", answer: "No — formatting happens entirely in your browser. Your data never leaves your device, which also makes it instant." },
  { question: "What indentation does it use?", answer: "2 spaces, matching the most common convention for readable JSON in code editors and documentation." },
  { question: "What happens if my JSON is invalid?", answer: "You'll see the exact parse error (including where it occurred), so you can find and fix the issue instead of guessing." },
];

export const JSON_FORMATTER_EXAMPLE: ToolExample = {
  title: "Example: formatting compact JSON",
  summary: "Pasting minified JSON in:",
  inputs: [{ label: "Input", value: '{"name":"Ada","active":true,"tags":["dev","admin"]}' }],
  outputs: [{ label: "Output", value: '{\n  "name": "Ada",\n  "active": true,\n  "tags": ["dev", "admin"]\n}' }],
};
