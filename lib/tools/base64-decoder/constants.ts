import type { FaqItem, ToolExample } from "@/lib/types";

export const BASE64_DECODER_FAQ_ITEMS: FaqItem[] = [
  { question: "Why does it say my input is invalid?", answer: "Base64 text uses a specific character set (A-Z, a-z, 0-9, +, /, and = padding) — extra spaces, line breaks, or a truncated string will fail to decode." },
  { question: "Does this handle emoji and non-English text correctly?", answer: "Yes — it decodes using proper UTF-8, matching the Base64 Encoder tool, so text encoded there decodes back exactly." },
  { question: "Does this send my text to a server?", answer: "No — decoding happens entirely in your browser." },
];

export const BASE64_DECODER_EXAMPLE: ToolExample = {
  title: "Example: decoding a string",
  summary: "Entering Base64 text:",
  inputs: [{ label: "Input", value: "SGVsbG8sIHdvcmxkIQ==" }],
  outputs: [{ label: "Output", value: "Hello, world!" }],
};
