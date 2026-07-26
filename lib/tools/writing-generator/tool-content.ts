import type { FaqItem, ToolExample } from "@/lib/types";
import type { WritingGeneratorType } from "./types";

interface GeneratorContent {
  faq: FaqItem[];
  example: ToolExample;
}

export const WRITING_GENERATOR_CONTENT: Record<WritingGeneratorType, GeneratorContent> = {
  "resume-builder": {
    faq: [
      { question: "Will this invent experience I don't have?", answer: "No — it's instructed to work only from what you describe, polishing the wording and structure rather than inventing achievements. Review the output and correct anything that doesn't match your actual experience." },
      { question: "Should I include numbers in my input?", answer: "Yes if you have them — specific figures (team size, growth percentages, budget managed) produce noticeably stronger, more quantified bullet points." },
      { question: "Can I use this for a career change?", answer: "Yes — describe your actual background and your target role clearly, and the draft will frame your existing experience toward that new direction." },
      { question: "Can I regenerate for a different emphasis?", answer: "Yes — click Regenerate for three new drafts, or adjust your input to highlight different aspects of your background." },
    ],
    example: {
      title: "Example: a marketing career",
      summary: "Entering a target role and background generates three resume drafts:",
      inputs: [{ label: "Background", value: "Target role: Marketing Manager. 5 years running social campaigns, grew Instagram from 2k to 50k, managed $30k/month ad budget" }],
      outputs: [{ label: "Option 1", value: "Summary: Marketing professional with 5 years scaling social channels and managing five-figure ad budgets...\\n\\nExperience:\\n• Grew Instagram following from 2,000 to 50,000 (25x) through targeted campaigns…" }],
    },
  },
  "seo-meta-generator": {
    faq: [
      { question: "How is this different from the separate Meta Title and Meta Description generators?", answer: "This generates a matched title + description pair together in one pass, so the two work as a cohesive unit — useful when you want a complete meta tag set in one step rather than generating each separately." },
      { question: "What are the length limits?", answer: "Titles target 50-60 characters, descriptions target 150-160 characters — the typical display limits before Google truncates each in search results." },
      { question: "Can I mix and match from different options?", answer: "Yes — use one option's title with a different option's description if that combination reads better." },
      { question: "Can I regenerate for a different angle?", answer: "Yes — click Regenerate for three new title/description pairs." },
    ],
    example: {
      title: "Example: a keyboard comparison post",
      summary: "Entering the page topic generates three complete meta tag sets:",
      inputs: [{ label: "Page topic", value: "A blog post comparing the best budget mechanical keyboards under $100" }],
      outputs: [{ label: "Option 1", value: "Title: 7 Best Budget Mechanical Keyboards Under $100 (2026)\\nDescription: We tested 7 mechanical keyboards under $100 to find the best switches, build quality, and value." }],
    },
  },
};
