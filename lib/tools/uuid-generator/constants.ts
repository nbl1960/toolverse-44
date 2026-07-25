import type { FaqItem, ToolExample } from "@/lib/types";

export const MIN_COUNT = 1;
export const MAX_COUNT = 100;
export const DEFAULT_COUNT = 5;

export const UUID_FAQ_ITEMS: FaqItem[] = [
  { question: "What version of UUID does this generate?", answer: "Version 4 (random) — the most common type, generated using the browser's built-in cryptographically secure random number generator." },
  { question: "How unique are these?", answer: "Astronomically unique — the chance of two v4 UUIDs colliding is effectively zero for any practical use, even generating billions of them." },
  { question: "Does this send anything to a server?", answer: "No — generation happens entirely in your browser using the native crypto.randomUUID() API." },
];

export const UUID_EXAMPLE: ToolExample = {
  title: "Example: generating 3 UUIDs",
  summary: "Clicking generate produces unique identifiers:",
  inputs: [{ label: "Count", value: "3" }],
  outputs: [{ label: "Output", value: "550e8400-e29b-41d4-a716-446655440000, 6ba7b810-9dad-11d1-80b4-00c04fd430c8, ..." }],
};
