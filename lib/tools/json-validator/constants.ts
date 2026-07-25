import type { FaqItem, ToolExample } from "@/lib/types";

export const JSON_VALIDATOR_FAQ_ITEMS: FaqItem[] = [
  { question: "How is this different from the JSON Formatter?", answer: "Both parse your JSON the same way — this one leads with a clear valid/invalid status, useful when you just need a quick check rather than a formatted copy." },
  { question: "Does this send my JSON to a server?", answer: "No — validation happens entirely in your browser." },
  { question: "What does 'invalid JSON' actually mean here?", answer: "The text isn't valid according to the JSON specification — often a trailing comma, unquoted key, or mismatched bracket. The error message points to where parsing failed." },
];

export const JSON_VALIDATOR_EXAMPLE: ToolExample = {
  title: "Example: catching a trailing comma",
  summary: "Pasting JSON with a common mistake:",
  inputs: [{ label: "Input", value: '{"name": "Ada", "active": true,}' }],
  outputs: [{ label: "Result", value: "Invalid JSON — trailing comma after the last property" }],
};
