import type { FaqItem, ToolExample } from "@/lib/types";
import type { SeoGeneratorType } from "./types";

interface GeneratorContent {
  faq: FaqItem[];
  example: ToolExample;
}

export const SEO_GENERATOR_CONTENT: Record<SeoGeneratorType, GeneratorContent> = {
  "meta-title-generator": {
    faq: [
      { question: "What's the ideal meta title length?", answer: "Roughly 50-60 characters — long enough to be descriptive, short enough to avoid being cut off with an ellipsis in most search results." },
      { question: "Should I include my brand name?", answer: "Many sites append it (e.g. \"...— YourBrand\"), but that's a site-wide template decision — the generated titles focus on the page content itself, which you can combine with your own template." },
      { question: "Does the meta title affect ranking?", answer: "It's a meaningful signal (especially keyword relevance), though click-through rate from a compelling title matters just as much as any direct ranking effect." },
      { question: "Can I regenerate for a different angle?", answer: "Yes — click Regenerate for three new title options." },
    ],
    example: {
      title: "Example: a keyboard comparison post",
      summary: "Entering the page topic generates three title options:",
      inputs: [{ label: "Page topic", value: "A blog post comparing the best budget mechanical keyboards under $100" }],
      outputs: [{ label: "Option 1", value: "7 Best Budget Mechanical Keyboards Under $100 (2026)" }],
    },
  },
  "meta-description-generator": {
    faq: [
      { question: "What's the ideal meta description length?", answer: "Roughly 150-160 characters — Google typically truncates longer descriptions in search results." },
      { question: "Does the meta description affect ranking?", answer: "Not directly, but it strongly influences click-through rate from search results, which is why it's worth writing deliberately rather than leaving it to be auto-generated from page content." },
      { question: "Should I include a call to action?", answer: "A short one (\"See the full comparison\", \"Find out which is right for you\") can help earn the click, and every generated option includes one naturally." },
      { question: "Can I regenerate for a different angle?", answer: "Yes — click Regenerate for three new description options." },
    ],
    example: {
      title: "Example: a keyboard comparison post",
      summary: "Entering the page topic generates three description options:",
      inputs: [{ label: "Page topic", value: "A blog post comparing the best budget mechanical keyboards under $100" }],
      outputs: [{ label: "Option 1", value: "We tested 7 mechanical keyboards under $100 to find the best switches, build quality, and value. See which one we'd actually buy." }],
    },
  },
};
