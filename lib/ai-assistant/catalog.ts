import { getLiveTools, getRecentlyAddedTools, getRelatedTools } from "@/lib/tools-registry";
import type { AssistantRelatedTool } from "./types";

export const MIN_QUERY_LENGTH = 3;
export const MAX_QUERY_LENGTH = 300;
export const MAX_RECOMMENDATIONS = 5;
export const RELATED_TOOLS_PER_RESULT = 3;
export const FALLBACK_SUGGESTIONS_COUNT = 4;

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

/**
 * A handful of real, recently-added tools shown when a search comes back
 * with zero grounded matches — a genuine discovery path instead of a
 * dead end, using the same registry data as everywhere else on the site
 * (not a special-cased or invented list).
 */
export function getFallbackSuggestions(): AssistantRelatedTool[] {
  return getRecentlyAddedTools(FALLBACK_SUGGESTIONS_COUNT).map((tool) => ({
    slug: tool.slug,
    name: tool.name,
    route: `/tools/${tool.slug}`,
  }));
}

/** Related tools for a matched result, using the same relatedGroup/category logic every tool page already uses. */
export function getRelatedToolLinks(slug: string): AssistantRelatedTool[] {
  const tool = getLiveTools().find((t) => t.slug === slug);
  if (!tool) return [];
  return getRelatedTools(tool, RELATED_TOOLS_PER_RESULT).map((related) => ({
    slug: related.slug,
    name: related.name,
    route: `/tools/${related.slug}`,
  }));
}
