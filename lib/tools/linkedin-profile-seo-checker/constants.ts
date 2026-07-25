import type { FaqItem, ToolExample } from "@/lib/types";

export const HEADLINE_CHAR_LIMIT = 220;
export const ABOUT_CHAR_LIMIT = 2_600;
export const MIN_RECOMMENDED_SKILLS = 5;
export const MAX_FIELD_LENGTH = 3_000;

export const PROFILE_SEO_FAQ_ITEMS: FaqItem[] = [
  {
    question: "What are 'target keywords'?",
    answer:
      "The terms you want to be found for — usually your role, skills, or industry (e.g. \"product manager\", \"SQL\", \"B2B SaaS\"). The checker looks for these exact terms across your headline, About section, and skills list.",
  },
  {
    question: "Why does keyword placement in the headline matter more?",
    answer:
      "LinkedIn's search weights the headline heavily, and it's also the first thing anyone sees on your profile — a keyword there works harder than the same keyword buried in your About section.",
  },
  {
    question: "How is the overall score calculated?",
    answer:
      "Keyword coverage (up to 50 points, weighted toward headline placement), headline presence and length (15), About section presence and length (20), and skills count (15) — 100 points total, each tied to a specific, visible finding below.",
  },
  {
    question: "Is a perfect score required?",
    answer:
      "No — this checks common, checkable factors in profile discoverability, not a guarantee of ranking. Treat the findings as a checklist for what to improve, not a pass/fail grade.",
  },
];

export const PROFILE_SEO_EXAMPLE: ToolExample = {
  title: "Example: checking coverage for a target role",
  summary: "Checking a profile against keywords a recruiter might search for:",
  inputs: [
    { label: "Target keywords", value: "product manager, B2B, fintech" },
    { label: "Headline", value: "Product Manager helping B2B fintechs move money faster" },
  ],
  outputs: [
    { label: "Keyword coverage", value: "3/3 keywords found, 3/3 in headline" },
    { label: "Score", value: "High coverage score" },
  ],
};
