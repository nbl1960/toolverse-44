import { getLiveTools } from "@/lib/tools-registry";

export const MIN_QUERY_LENGTH = 3;
export const MAX_QUERY_LENGTH = 300;
export const MAX_RECOMMENDATIONS = 5;

/**
 * Builds the compact, plain-text tool catalog sent to Gemini as grounding
 * context — one line per live tool: slug, name, category, and a short
 * description. This is the ONLY source of truth Gemini is given for what
 * tools exist; the prompt explicitly instructs it to recommend only
 * slugs found here. Coming-soon tools are excluded since there's nothing
 * to actually open yet.
 *
 * Kept deliberately compact (no FAQ, no examples, no keywords) to keep
 * the prompt fast and cheap even as the catalog grows well past 100
 * tools — only what's needed to match intent to a tool.
 */
export function buildToolCatalogText(): string {
  return getLiveTools()
    .map((tool) => `${tool.slug} | ${tool.name} | ${tool.category} | ${tool.tagline}`)
    .join("\n");
}
