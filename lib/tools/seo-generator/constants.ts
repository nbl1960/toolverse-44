import type { GeneratorConfig } from "@/lib/generator-config";
import type { SeoGeneratorType } from "./types";

export const MIN_TOPIC_LENGTH = 3;
export const MAX_TOPIC_LENGTH = 400;

export const SEO_GENERATOR_CONFIG: Record<SeoGeneratorType, GeneratorConfig> = {
  "meta-title-generator": {
    inputLabel: "What's the page about?",
    placeholder: "e.g. A blog post comparing the best budget mechanical keyboards under $100",
    helperText: "Describe the page's content and main topic — meta titles show in search results at roughly 50-60 characters.",
    outputNoun: "meta title",
    promptInstruction:
      "Write an SEO meta title for this page. Should include the primary topic/keyword naturally near the front, be compelling enough to earn a click in search results, and fit within Google's typical display width.",
    formatHint: "Each output must be 50-60 characters, a single title, no quotation marks, no pipe-separated site name.",
  },
  "meta-description-generator": {
    inputLabel: "What's the page about?",
    placeholder: "e.g. A blog post comparing the best budget mechanical keyboards under $100",
    helperText: "Describe the page's content — meta descriptions show in search results at roughly 150-160 characters.",
    outputNoun: "meta description",
    promptInstruction:
      "Write an SEO meta description for this page. Should summarize the page's value, include relevant keywords naturally, and end with enough of a hook to earn a click — this is what shows under the title in search results.",
    formatHint: "Each output must be 150-160 characters, a single description, no quotation marks.",
  },
};
