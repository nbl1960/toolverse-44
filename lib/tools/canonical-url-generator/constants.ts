import type { FaqItem, ToolExample } from "@/lib/types";

export const CANONICAL_FAQ_ITEMS: FaqItem[] = [
  { question: "What does a canonical tag actually do?", answer: "It tells search engines which URL is the \"master\" version when the same or similar content is reachable at multiple URLs (with/without tracking params, trailing slash, etc.) — consolidating ranking signals to one URL instead of splitting them." },
  { question: "Why are tracking parameters removed?", answer: "Parameters like utm_source or gclid create technically-different URLs for the same content — a canonical tag should point at the clean version so search engines don't treat every marketing link as a separate page." },
  { question: "Where does this tag go?", answer: "Inside the <head> of the page it refers to — every page should have exactly one canonical tag, usually pointing to itself unless it's explicitly a duplicate of another page." },
  { question: "Does this change my actual URL?", answer: "No — it only generates the tag. Your actual URL structure is unaffected; the canonical tag is purely a signal to search engines." },
];

export const CANONICAL_EXAMPLE: ToolExample = {
  title: "Example: cleaning up a tracked URL",
  summary: "Entering a URL with tracking parameters:",
  inputs: [{ label: "URL", value: "http://Example.com/blog/post/?utm_source=newsletter" }],
  outputs: [{ label: "Output", value: '<link rel="canonical" href="https://example.com/blog/post" />' }],
};
