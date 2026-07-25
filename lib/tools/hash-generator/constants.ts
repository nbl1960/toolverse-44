import type { FaqItem, ToolExample } from "@/lib/types";
import type { HashAlgorithm } from "./types";

export const HASH_ALGORITHMS: HashAlgorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
export const DEFAULT_ALGORITHM: HashAlgorithm = "SHA-256";

export const HASH_FAQ_ITEMS: FaqItem[] = [
  { question: "Why isn't MD5 available?", answer: "MD5 isn't part of the browser's Web Crypto API — it's cryptographically broken and was deliberately excluded from the standard. This tool only offers algorithms with real, verified browser implementations rather than a hand-rolled MD5." },
  { question: "Is SHA-1 secure?", answer: "No longer considered secure for cryptographic purposes (e.g. certificates or password hashing) — it's included here mainly for compatibility with older systems that still expect it. SHA-256 or higher is recommended for anything security-sensitive." },
  { question: "Does this send my text to a server?", answer: "No — hashing happens entirely in your browser using the native Web Crypto API." },
  { question: "Can I reverse a hash back to the original text?", answer: "No — hashing is one-way by design. The same input always produces the same hash, but the hash can't be converted back to the original text." },
];

export const HASH_EXAMPLE: ToolExample = {
  title: "Example: hashing a string",
  summary: "Entering text with SHA-256 selected:",
  inputs: [{ label: "Text", value: "hello" }],
  outputs: [{ label: "SHA-256", value: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824" }],
};
