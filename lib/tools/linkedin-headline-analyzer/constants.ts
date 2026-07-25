import type { FaqItem, ToolExample } from "@/lib/types";

export const HEADLINE_CHAR_LIMIT = 220;

/** Words that signal specific value or focus, rather than just a job title. */
export const POWER_WORDS = [
  "helping",
  "help",
  "specializing",
  "specialist",
  "expert",
  "leading",
  "leader",
  "building",
  "scaling",
  "growing",
  "growth",
  "founder",
  "co-founder",
  "driving",
  "results",
  "passionate",
  "focused",
  "obsessed",
  "empowering",
  "transforming",
  "delivering",
];

export const HEADLINE_ANALYZER_FAQ_ITEMS: FaqItem[] = [
  {
    question: "How is the score calculated?",
    answer:
      "Five checks, each worth points: length utilization (up to 30), a value-signaling word like \"helping\" or \"specializing\" (25), a quantifiable detail such as a number (20), a multi-part structure using a separator like \"|\" (15), and avoiding all-caps formatting (10) — 100 points total. Every point is tied to a specific, visible check.",
  },
  {
    question: "Is a high score the only thing that matters?",
    answer:
      "No — these checks reward common patterns in strong headlines, but a headline that's accurate and genuinely reflects you matters more than maximizing a score. Use this as a checklist, not a hard rule.",
  },
  {
    question: "What's the LinkedIn headline character limit?",
    answer: "220 characters — the analyzer checks your headline's length against this exact limit.",
  },
  {
    question: "Why does a separator like \"|\" matter?",
    answer:
      "Headlines that combine a role, a focus area, and an outcome (often divided by \"|\" or \"•\") tend to pack in more searchable, specific information than a single short phrase.",
  },
];

export const HEADLINE_ANALYZER_EXAMPLE: ToolExample = {
  title: "Example: comparing two headlines",
  summary: "A generic headline versus one using more of the available checks:",
  inputs: [{ label: "Headline", value: "Marketing Manager" }],
  outputs: [
    { label: "Score", value: "15/100 — Needs work" },
    { label: "Why", value: "Too short, no value word, no number, no separator" },
  ],
};
