export type CopilotStepConfidence = "essential" | "recommended" | "optional";

export interface CopilotStep {
  order: number;
  slug: string;
  name: string;
  tagline: string;
  iconName: string;
  route: string;
  whyThisStep: string;
  confidence: CopilotStepConfidence;
}

export interface CopilotPlanSuccessResponse {
  success: true;
  goal: string;
  summary: string;
  steps: CopilotStep[];
}

export interface CopilotPlanErrorResponse {
  success: false;
  error: string;
}

export type CopilotPlanResponse = CopilotPlanSuccessResponse | CopilotPlanErrorResponse;

/** Raw shape Gemini is asked to return — never trusted for name/tagline/route (see route.ts). */
export interface RawCopilotStep {
  slug: string;
  whyThisStep: string;
  confidence: string;
}
