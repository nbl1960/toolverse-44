import type { FaqItem, ToolExample } from "@/lib/types";

export const SLUG_FAQ_ITEMS: FaqItem[] = [
  { question: "What counts as a 'URL-safe' slug?", answer: "Lowercase letters, numbers, and hyphens only — no spaces, punctuation, or special characters, since those either need to be encoded in a URL or aren't allowed at all." },
  { question: "Does this handle accented characters?", answer: "Yes — accented letters are converted to their closest plain-letter equivalent (é becomes e, ñ becomes n) rather than being stripped out entirely." },
  { question: "What happens to underscores?", answer: "They're treated as word separators, same as spaces, and converted to hyphens — not deleted, so \"my_page\" correctly becomes \"my-page\", not \"mypage\"." },
  { question: "Does this send my text to a server?", answer: "No — the conversion happens entirely in your browser." },
];

export const SLUG_EXAMPLE: ToolExample = {
  title: "Example: converting a blog title",
  summary: "Entering a title with punctuation:",
  inputs: [{ label: "Input", value: "10 Tips for Better Sleep (2026 Edition)!" }],
  outputs: [{ label: "Output", value: "10-tips-for-better-sleep-2026-edition" }],
};
