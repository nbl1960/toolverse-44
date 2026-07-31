import type { TargetModel } from "./types";

export const MIN_REQUEST_LENGTH = 4;
export const MAX_REQUEST_LENGTH = 500;
export const MAX_ANALYZER_LENGTH = 2000;

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
    id: "grok",
    name: "Grok",
    kind: "chat",
    description:
      "Tolerates and often benefits from a more direct, informal register than other chat models — state the task plainly without excessive politeness padding, and it's comfortable with a candid, less risk-averse tone if you ask for one.",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    kind: "chat",
    description:
      "Search-augmented — frame the request as a research question that benefits from current, citable sources rather than a purely generative task, and explicitly ask for sources or a comparison across viewpoints when that matters.",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    kind: "chat",
    description:
      "A strong reasoning model — explicitly asking it to think step by step or show its reasoning before the final answer noticeably improves output on non-trivial tasks, more so than with purely conversational models.",
  },
  {
    id: "qwen",
    name: "Qwen",
    kind: "chat",
    description:
      "Also reasoning-oriented and multilingual-capable — benefits from explicit step-by-step instructions like DeepSeek, and from specifying the target language explicitly if the request isn't in English.",
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
