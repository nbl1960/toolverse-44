import type { FaqItem, ToolExample } from "@/lib/types";

export const MIN_LENGTH = 4;
export const MAX_LENGTH = 64;
export const DEFAULT_LENGTH = 16;

export const PASSWORD_FAQ_ITEMS: FaqItem[] = [
  { question: "How random is this really?", answer: "It uses crypto.getRandomValues(), the browser's cryptographically secure random number generator — the same class of randomness used for security-sensitive operations, not Math.random(), which is not suitable for passwords." },
  { question: "Why are some characters excluded?", answer: "Characters that look alike (0/O, 1/l/I) are excluded by default to avoid transcription mistakes when typing a password by hand." },
  { question: "Are generated passwords stored anywhere?", answer: "No — generation happens entirely in your browser and nothing is sent to or logged by a server." },
  { question: "How long should my password be?", answer: "Longer is generally better — 16+ characters with a mix of character types is a reasonable baseline for most accounts, more for anything especially sensitive." },
];

export const PASSWORD_EXAMPLE: ToolExample = {
  title: "Example: a 16-character password",
  summary: "With all character types enabled:",
  inputs: [{ label: "Length", value: "16" }, { label: "Character types", value: "Uppercase, lowercase, numbers, symbols" }],
  outputs: [{ label: "Result", value: "A password using crypto-secure randomness, guaranteed to include all selected character types" }],
};
