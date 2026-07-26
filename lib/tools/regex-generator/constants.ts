import type { FaqItem, ToolExample } from "@/lib/types";

export const MIN_DESCRIPTION_LENGTH = 5;
export const MAX_DESCRIPTION_LENGTH = 500;

export const REGEX_FAQ_ITEMS: FaqItem[] = [
  { question: "Is the generated regex guaranteed to be correct?", answer: "It's a strong starting point, but always test it against your actual data before relying on it in production — edge cases in real-world text can surprise even carefully written patterns." },
  { question: "What regex flavor does this target?", answer: "Standard JavaScript/PCRE-compatible syntax, which works directly in JavaScript, Python, and most modern languages with minor adjustments." },
  { question: "Can I ask for something complex?", answer: "Yes — describe it as specifically as you can (what should match, what shouldn't) for the best result. Very complex patterns may need some manual refinement afterward." },
  { question: "Does this test the regex against real data?", answer: "No — it explains the pattern and gives one illustrative example, but doesn't run it against a dataset. Test it yourself against real examples before using it." },
];

export const REGEX_EXAMPLE: ToolExample = {
  title: "Example: matching an email address",
  summary: "Describing what you want to match:",
  inputs: [{ label: "Description", value: "Match a valid email address" }],
  outputs: [
    { label: "Pattern", value: "^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$" },
    { label: "Explanation", value: "Matches word characters/dots/plus/hyphen before an @, then a domain and a 2+ letter extension" },
  ],
};
