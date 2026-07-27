export type MatchConfidence = "Best Match" | "Good Match" | "Related";

export const MATCH_CONFIDENCE_VALUES: MatchConfidence[] = ["Best Match", "Good Match", "Related"];

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
  confidence: MatchConfidence;
  route: string;
  /** 2-3 related tools from the same registry group — computed locally, not by the model, so this is instant and always real. */
  relatedTools: AssistantRelatedTool[];
}

export interface AssistantSearchSuccessResponse {
  success: true;
  recommendations: AssistantRecommendation[];
  /** Populated only when recommendations is empty — real, recently-added tools as a discovery path, not a dead end. */
  fallbackSuggestions?: AssistantRelatedTool[];
}

export interface AssistantSearchErrorResponse {
  success: false;
  error: string;
}

export type AssistantSearchResponse = AssistantSearchSuccessResponse | AssistantSearchErrorResponse;

/** Raw shape Gemini is asked to return — slug + reason + confidence only. Never trusted for name/tagline/route (see route.ts). */
export interface RawAssistantMatch {
  slug: string;
  reason: string;
  confidence: string;
}
