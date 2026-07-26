import type { FaqItem, ToolExample } from "@/lib/types";

export const SLUG_FAQ_ITEMS: FaqItem[] = [
  { question: "What counts as a good URL slug?", answer: "Lowercase, hyphen-separated, no special characters — short and descriptive enough that someone can guess the page's content just from the URL." },
  { question: "Does this handle accented characters?", answer: "Yes — characters like é, ñ, or ü are converted to their closest plain-letter equivalent (e -> e, n, u) rather than stripped entirely or left as unsafe characters." },
  { question: "Will this ever produce a leading or trailing hyphen?", answer: "No — leading and trailing hyphens are always trimmed, and multiple consecutive special characters collapse into a single hyphen." },
  { question: "Does this send my text to a server?", answer: "No — slug generation happens entirely in your browser." },
];

export const SLUG_EXAMPLE: ToolExample = {
  title: "Example: converting a blog title",
  summary: "Entering a title with punctuation and accents:",
  inputs: [{ label: "Input", value: "Café Résumé — 7 Best Tips!" }],
  outputs: [{ label: "Output", value: "cafe-resume-7-best-tips" }],
};
