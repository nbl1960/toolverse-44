import type { TargetModel } from "./types";

/**
 * Each model's `description` is used directly in the transform prompt
 * sent to Gemini — real, established prompting conventions per model
 * family, not interchangeable labels. Chat models (ChatGPT/Claude/
 * Gemini) genuinely do respond better to explicit role+context+task+
 * format structure; image models (Midjourney/DALL-E) genuinely use a
 * different, terser, visually-descriptive convention — collapsing
 * these into one generic "structured prompt" format would produce a
 * worse result for whichever type wasn't assumed.
 */
export const TARGET_MODELS: TargetModel[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    kind: "chat",
    description:
      "Structure with a clear role, context, specific task, and desired output format. Numbered constraints work well.",
  },
  {
    id: "claude",
    name: "Claude",
    kind: "chat",
    description:
      "Responds well to explicit structure (XML-style tags or clear sections), a defined role, and explicit reasoning/format instructions.",
  },
  {
    id: "gemini",
    name: "Gemini",
    kind: "chat",
    description:
      "Similar to ChatGPT — clear role, context, and task, with explicit output format instructions when structure matters.",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    kind: "image",
    description:
      "Terse, comma-separated visual descriptors (subject, style, lighting, composition) rather than full sentences — no role or task framing.",
  },
  {
    id: "dalle",
    name: "DALL·E",
    kind: "image",
    description:
      "A single clear, descriptive natural-language sentence describing the image in visual detail — more prose-like than Midjourney's comma-separated style.",
  },
];

export function getTargetModel(id: string): TargetModel | undefined {
  return TARGET_MODELS.find((m) => m.id === id);
}
