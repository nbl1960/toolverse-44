import type { FaqItem, ToolExample } from "@/lib/types";
import type { TwitterCardType } from "./types";

export const CARD_TYPE_OPTIONS: { value: TwitterCardType; label: string }[] = [
  { value: "summary", label: "Summary" },
  { value: "summary_large_image", label: "Summary + large image" },
];
export const DEFAULT_CARD_TYPE: TwitterCardType = "summary_large_image";

export const TWITTER_CARD_FAQ_ITEMS: FaqItem[] = [
  { question: "What's the difference between the two card types?", answer: "\"Summary\" shows a small square thumbnail; \"Summary + large image\" shows a full-width image above the text — the large-image version generally gets more attention in the feed." },
  { question: "Do I still need Open Graph tags too?", answer: "Yes for other platforms — X/Twitter reads twitter:* tags first but falls back to Open Graph tags (og:title, og:description, og:image) if a twitter:* tag is missing, so having both covers every platform." },
  { question: "What image size should I use?", answer: "For the large-image card, 1200×628px (roughly 1.91:1) is the commonly recommended size." },
  { question: "What does twitter:site do?", answer: "Attributes the card to your account's @handle — optional, but useful for brand recognition when your content is shared." },
];

export const TWITTER_CARD_EXAMPLE: ToolExample = {
  title: "Example: a blog post's Twitter Card",
  summary: "Entering title, description, and image with the large-image card type:",
  inputs: [{ label: "Card type", value: "Summary + large image" }],
  outputs: [{ label: "Output", value: '<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="..." />' }],
};
