import type { FaqItem, ToolExample } from "@/lib/types";
import type { ChangeFrequency } from "./types";

export const CHANGE_FREQ_OPTIONS: ChangeFrequency[] = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
export const DEFAULT_CHANGE_FREQ: ChangeFrequency = "weekly";
export const DEFAULT_PRIORITY = "0.5";

export const SITEMAP_FAQ_ITEMS: FaqItem[] = [
  { question: "How many URLs can one sitemap have?", answer: "The sitemap protocol allows up to 50,000 URLs per file (and a 50MB size limit) — for more than that, search engines expect multiple sitemap files linked from a sitemap index." },
  { question: "What does priority actually do?", answer: "It's a hint (0.0-1.0) about a page's relative importance within your own site — search engines treat it as a weak signal at best, not a ranking factor, so it's fine to leave every page at the same value." },
  { question: "Where do I put the sitemap file?", answer: "Anywhere accessible on your domain, commonly at /sitemap.xml — then submit that URL in Google Search Console (or reference it in robots.txt) so search engines know where to find it." },
  { question: "Does lastmod need to be accurate?", answer: "Ideally yes — it should reflect when the page's content actually changed, since search engines use it to help prioritize re-crawling. This tool stamps today's date; update it if you're generating this ahead of publishing." },
];

export const SITEMAP_EXAMPLE: ToolExample = {
  title: "Example: a small site's sitemap",
  summary: "Entering three URLs:",
  inputs: [{ label: "URLs", value: "https://example.com/\nhttps://example.com/about\nhttps://example.com/contact" }],
  outputs: [{ label: "Output", value: "A valid XML sitemap with <url> entries for all three pages" }],
};
