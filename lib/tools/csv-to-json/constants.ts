import type { FaqItem, ToolExample } from "@/lib/types";

export const CSV_TO_JSON_FAQ_ITEMS: FaqItem[] = [
  { question: "Does this handle commas inside quoted fields?", answer: "Yes — a field like \"Smith, John\" wrapped in quotes is correctly kept as one value, not split into two." },
  { question: "What if a field itself contains a quote character?", answer: "Use a doubled quote (\"\") inside a quoted field, the standard CSV escaping convention — this tool parses that correctly." },
  { question: "Does the first row have to be headers?", answer: "Yes — the first row is always treated as column headers and becomes the keys in each JSON object." },
  { question: "Does this send my data to a server?", answer: "No — parsing happens entirely in your browser." },
];

export const CSV_TO_JSON_EXAMPLE: ToolExample = {
  title: "Example: converting a small table",
  summary: "Pasting CSV with a header row:",
  inputs: [{ label: "Input", value: "name,age\nAda,30\nGrace,28" }],
  outputs: [{ label: "Output", value: '[\n  {"name": "Ada", "age": "30"},\n  {"name": "Grace", "age": "28"}\n]' }],
};
