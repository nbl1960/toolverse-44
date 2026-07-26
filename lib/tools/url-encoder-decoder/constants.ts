import type { FaqItem, ToolExample } from "@/lib/types";

export const URL_CODEC_FAQ_ITEMS: FaqItem[] = [
  { question: "What does URL encoding actually do?", answer: "It converts characters that aren't safe in a URL (spaces, &, ?, #, and others) into a % followed by their hex code, so the text can be safely used as a query parameter or part of a URL." },
  { question: "When would I need to decode instead?", answer: "When you have a URL-encoded string (like %20 for a space, or %3F for a question mark) and want to read or edit the original, human-readable text." },
  { question: "Does this handle the whole URL or just a component?", answer: "This encodes/decodes a single value, matching JavaScript's encodeURIComponent/decodeURIComponent — the standard choice for encoding a query parameter or path segment, not an entire URL with its scheme and structure intact." },
  { question: "Does this send my text to a server?", answer: "No — encoding and decoding both happen entirely in your browser." },
];

export const URL_CODEC_EXAMPLE: ToolExample = {
  title: "Example: encoding a search query",
  summary: "Entering plain text in encode mode:",
  inputs: [{ label: "Input", value: "hello world & welcome?" }],
  outputs: [{ label: "Output", value: "hello%20world%20%26%20welcome%3F" }],
};
