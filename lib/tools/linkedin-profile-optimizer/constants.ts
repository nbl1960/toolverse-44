import type { FaqItem, ToolExample } from "@/lib/types";

export const MIN_TEXT_LENGTH = 10;
export const MAX_TEXT_LENGTH = 2_600;

export const OPTIMIZER_FAQ_ITEMS: FaqItem[] = [
  {
    question: "What should I paste in — my headline or my About section?",
    answer:
      "Either works. Paste your current LinkedIn headline for headline-specific feedback, or your full About section for feedback on the longer narrative.",
  },
  {
    question: "How is this different from the Headline or About Generator?",
    answer:
      "The generators write new content from scratch based on a description of your background. The Optimizer instead improves text you already have — it reads your current version and rewrites it with specific reasoning for the changes.",
  },
  {
    question: "Should I use the improved version exactly as given?",
    answer:
      "Treat it as a strong revision — review the suggestions alongside it, and adjust anything that doesn't match your actual experience or voice.",
  },
  {
    question: "Can I run this multiple times?",
    answer: "Yes — paste the improved version back in for another pass, or try again with different original text.",
  },
];

export const OPTIMIZER_EXAMPLE: ToolExample = {
  title: "Example: optimizing a generic headline",
  summary: "Pasting in a current, generic headline:",
  inputs: [{ label: "Current headline", value: "Marketing Manager at Acme Inc." }],
  outputs: [
    { label: "Improved version", value: "Marketing Manager helping B2B SaaS companies turn content into pipeline" },
    { label: "Suggestions", value: "3-4 specific reasons for the changes" },
  ],
};
