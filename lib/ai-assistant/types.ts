export type MatchConfidence = "Best Match" | "Good Match" | "Related";

export const MATCH_CONFIDENCE_VALUES: MatchConfidence[] = ["Best Match", "Good Match", "Related"];

/** Below this, a result isn't shown as a match at all — see route.ts's fallback logic. */
export const MIN_CONFIDENCE_SCORE = 60;

/**
 * Derives the categorical tier from the numeric score — a single source
 * of truth, so a result can never claim "Best Match" while scoring 45%,
 * or vice versa. Gemini only ever provides the number; this mapping is
 * ours, deterministic, and never delegated to the model.
 */
export function confidenceScoreToTier(score: number): MatchConfidence {
  if (score >= 80) return "Best Match";
  if (score >= MIN_CONFIDENCE_SCORE) return "Good Match";
  return "Related";
}

export interface AssistantSearchRequest {
  query: string;
}

export interface AssistantRelatedTool {
  slug: string;
  name: string;
  route: string;
}

export interface AssistantRecommendation {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  iconName: string;
  reason: string;
  /** 0-100, from Gemini, clamped and validated server-side — never trusted raw. */
  confidenceScore: number;
  /** Derived from confidenceScore via confidenceScoreToTier(), not provided by the model directly. */
  confidence: MatchConfidence;
  /** Every ToolVerse tool is free — this is a true, universal fact about this catalog, not a per-tool claim requiring external pricing data. */
  pricing: "Free";
  route: string;
  /** 2-3 related tools from the same registry group — computed locally, not by the model, so this is instant and always real. Also serves as "alternative tools" for a shown recommendation. */
  relatedTools: AssistantRelatedTool[];
}

export interface AssistantSearchSuccessResponse {
  success: true;
  recommendations: AssistantRecommendation[];
  /** Populated when recommendations is empty OR the best match scored below MIN_CONFIDENCE_SCORE — real, recently-added tools as a discovery path, not a dead end. */
  fallbackSuggestions?: AssistantRelatedTool[];
  /** True when nothing cleared the confidence bar — the client shows "I couldn't find a perfect match" instead of weak individual results. */
  belowConfidenceThreshold?: boolean;
}

export interface AssistantSearchErrorResponse {
  success: false;
  error: string;
}

export type AssistantSearchResponse = AssistantSearchSuccessResponse | AssistantSearchErrorResponse;

/** Raw shape Gemini is asked to return — slug + reason + numeric confidence only. Never trusted for name/tagline/route (see route.ts). */
export interface RawAssistantMatch {
  slug: string;
  reason: string;
  confidence: number;
}
