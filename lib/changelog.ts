export interface ChangelogEntry {
  date: string;
  title: string;
  description: string;
}

/**
 * Every entry here describes something genuinely shipped in this
 * codebase — not aspirational or invented release notes. Ordered most
 * recent first.
 */
export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-08-01",
    title: "Launch readiness: security, newsletter, tool suggestions",
    description:
      "Added a Content-Security-Policy header scoped to the exact external domains this app uses, a newsletter signup, and a Suggest a Tool page so ideas can reach us directly.",
  },
  {
    date: "2026-07-30",
    title: "Collections and Compare Tools",
    description:
      "Group tools into named collections from any tool page, and compare up to 4 tools side by side — category, description, and best-fit tags.",
  },
  {
    date: "2026-07-28",
    title: "ToolVerse Prompt Studio",
    description:
      "A Smart Prompt Engine that turns a rough request into a structured prompt for ChatGPT, Claude, Gemini, Grok, Perplexity, DeepSeek, Qwen, Midjourney, or DALL·E — plus a deterministic Prompt Analyzer and a library of ready-to-use templates.",
  },
  {
    date: "2026-07-27",
    title: "ToolVerse Copilot",
    description:
      "Describe a broader goal — not just a single task — and get an ordered, step-by-step path through the real tools that get you there.",
  },
  {
    date: "2026-07-26",
    title: "Global search overhaul",
    description:
      "The ⌘K command palette now ranks results by field (name, category, keywords, description), tolerates typos, expands common synonyms, and supports voice search where the browser allows it.",
  },
  {
    date: "2026-07-24",
    title: "AI Guide grounding and reliability",
    description:
      "The homepage AI Guide now uses Gemini's structured JSON output mode, retries once on a malformed response, and shows a confidence score instead of a vague match label — every recommendation is verified against the real tool catalog before it's shown.",
  },
  {
    date: "2026-07-20",
    title: "AI-first homepage redesign",
    description:
      "The homepage now leads with the AI Guide instead of a plain tool grid, with a real animated walkthrough instead of a placeholder video.",
  },
  {
    date: "2026-06-01",
    title: "ToolVerse launches with 100 tools",
    description:
      "Writing, developer, SEO, image, finance, and social-media tools — all free, all first-party, searchable by category or plain-language description.",
  },
];
