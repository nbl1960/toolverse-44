import type { FaqItem, ToolExample } from "@/lib/types";

export const JSON_TO_CSV_FAQ_ITEMS: FaqItem[] = [
  { question: "What JSON structure does this expect?", answer: "A JSON array of flat objects, like [{\"name\": \"Ada\", \"age\": 30}, ...] — each object becomes one CSV row." },
  { question: "What if objects have different fields?", answer: "The header row uses the union of every key seen across all objects — any object missing a given field just gets an empty cell there instead of the columns shifting or breaking." },
  { question: "What happens to nested objects or arrays as values?", answer: "They're converted to their JSON string representation within that cell, since CSV has no native way to represent nested structure." },
  { question: "Does this send my data to a server?", answer: "No — conversion happens entirely in your browser." },
];

export const JSON_TO_CSV_EXAMPLE: ToolExample = {
  title: "Example: converting a small array",
  summary: "Pasting a JSON array of objects:",
  inputs: [{ label: "Input", value: '[{"name":"Ada","age":30},{"name":"Grace","age":28}]' }],
  outputs: [{ label: "Output", value: "name,age\nAda,30\nGrace,28" }],
};
