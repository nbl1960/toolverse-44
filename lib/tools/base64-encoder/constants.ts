import type { FaqItem, ToolExample } from "@/lib/types";

export const BASE64_ENCODER_FAQ_ITEMS: FaqItem[] = [
  { question: "Does this handle emoji and non-English text correctly?", answer: "Yes — it uses proper UTF-8 encoding before converting to Base64, so emoji, accented characters, and non-Latin scripts round-trip correctly." },
  { question: "Is Base64 encryption?", answer: "No — Base64 is a reversible encoding, not encryption. Anyone can decode it back to the original text; don't use it to protect sensitive data." },
  { question: "Does this send my text to a server?", answer: "No — encoding happens entirely in your browser." },
];

export const BASE64_ENCODER_EXAMPLE: ToolExample = {
  title: "Example: encoding a string",
  summary: "Entering plain text:",
  inputs: [{ label: "Input", value: "Hello, world!" }],
  outputs: [{ label: "Output", value: "SGVsbG8sIHdvcmxkIQ==" }],
};
