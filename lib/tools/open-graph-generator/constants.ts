import type { FaqItem, ToolExample } from "@/lib/types";

export const OG_TYPE_OPTIONS = ["website", "article", "product", "profile"];
export const DEFAULT_OG_TYPE = "website";

export const OPEN_GRAPH_FAQ_ITEMS: FaqItem[] = [
  { question: "Where do these tags go?", answer: "Inside the <head> of the page they describe — they control how the page appears when shared on Facebook, LinkedIn, and most other platforms that support Open Graph." },
  { question: "What image size should I use?", answer: "1200×630px is the commonly recommended size for og:image — large enough to display well, with an aspect ratio that avoids awkward cropping on most platforms." },
  { question: "Do I need all of these tags?", answer: "og:title and og:description are the most important — the rest (image, url, type, site name) improve the preview but aren't strictly required." },
  { question: "How is this different from a Twitter Card?", answer: "Twitter/X uses its own tag format (twitter:*) alongside or instead of Open Graph — use the Twitter Card Generator separately for that platform's specific tags." },
];

export const OPEN_GRAPH_EXAMPLE: ToolExample = {
  title: "Example: a blog post's OG tags",
  summary: "Entering title, description, and image:",
  inputs: [
    { label: "Title", value: "7 Best Budget Mechanical Keyboards Under $100" },
    { label: "Type", value: "article" },
  ],
  outputs: [{ label: "Output", value: '<meta property="og:title" content="..." />\n<meta property="og:type" content="article" />' }],
};
