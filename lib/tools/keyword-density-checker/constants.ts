import type { FaqItem, ToolExample } from "@/lib/types";

export const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "then", "so", "of", "to", "in", "on", "at", "for",
  "with", "by", "from", "up", "about", "into", "over", "after", "is", "are", "was", "were", "be",
  "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
  "this", "that", "these", "those", "it", "its", "as", "not", "can", "you", "your", "i", "we",
  "they", "he", "she", "his", "her", "their", "our", "my", "me", "him", "them",
]);

export const TOP_WORDS_COUNT = 10;
export const MAX_TEXT_LENGTH = 20_000;

export const KEYWORD_DENSITY_FAQ_ITEMS: FaqItem[] = [
  { question: "What's a good keyword density?", answer: "There's no universally \"correct\" number — historically 1-2% was a common guideline, but modern search engines focus far more on natural, relevant writing than hitting a specific percentage. Use this as a sanity check against obvious keyword stuffing, not a target to optimize toward." },
  { question: "Are common words like \"the\" and \"and\" included?", answer: "No — common stopwords are filtered out of the top-words list so it reflects meaningful, topic-relevant words instead of function words that appear in almost any text." },
  { question: "How is density calculated?", answer: "(Number of times the word appears ÷ total word count) × 100 — the same calculation for both the top-words list and a specific target keyword you enter." },
  { question: "Does this send my text to a server?", answer: "No — analysis happens entirely in your browser." },
];

export const KEYWORD_DENSITY_EXAMPLE: ToolExample = {
  title: "Example: checking a product description",
  summary: "Pasting text and entering a target keyword:",
  inputs: [{ label: "Target keyword", value: "mechanical keyboard" }],
  outputs: [{ label: "Result", value: "Density %, occurrence count, and the top 10 most frequent meaningful words" }],
};
