import type { GeneratorConfig } from "@/lib/generator-config";
import type { WritingGeneratorType } from "./types";

export const MIN_TOPIC_LENGTH = 10;
export const MAX_TOPIC_LENGTH = 800;

export const WRITING_GENERATOR_CONFIG: Record<WritingGeneratorType, GeneratorConfig> = {
  "resume-builder": {
    inputLabel: "Your work history and target role",
    placeholder: "e.g. Target role: Marketing Manager. Background: 5 years running social campaigns at a retail startup, grew Instagram following from 2k to 50k, managed a $30k/month ad budget, led a team of 2.",
    helperText: "Include your target role and a rough summary of your experience — the more specific, the better the result.",
    outputNoun: "resume draft",
    promptInstruction:
      "Write a polished, recruiter-ready resume draft from this rough work history and target role. Include a short professional summary (2-3 sentences), then 4-6 action-oriented, quantified experience bullet points, then a relevant skills line.",
    formatHint:
      "Each output should be a complete draft with clear sections (Summary / Experience / Skills), using \\n\\n between sections and '• ' for bullet points.",
  },
  "seo-meta-generator": {
    inputLabel: "What's the page about?",
    placeholder: "e.g. A blog post comparing the best budget mechanical keyboards under $100",
    helperText: "Describe the page's content and main topic — this generates a complete title + meta description pair.",
    outputNoun: "meta tag set",
    promptInstruction:
      "Write a complete SEO meta tag set for this page: a title (50-60 characters) and a meta description (150-160 characters) that work well together.",
    formatHint:
      "Each output should be exactly two lines: 'Title: ...' then 'Description: ...', using \\n between them, no extra commentary.",
  },
};
