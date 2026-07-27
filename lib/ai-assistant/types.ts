export interface AssistantSearchRequest {
  query: string;
}

export interface AssistantRecommendation {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  iconName: string;
  reason: string;
  route: string;
}

export interface AssistantSearchSuccessResponse {
  success: true;
  recommendations: AssistantRecommendation[];
}

export interface AssistantSearchErrorResponse {
  success: false;
  error: string;
}

export type AssistantSearchResponse = AssistantSearchSuccessResponse | AssistantSearchErrorResponse;

/** Raw shape Gemini is asked to return — slug + reason only. Never trusted for name/tagline/route (see route.ts). */
export interface RawAssistantMatch {
  slug: string;
  reason: string;
}
