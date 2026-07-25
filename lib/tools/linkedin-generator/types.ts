export type LinkedinGeneratorType =
  | "headline-generator"
  | "about-generator"
  | "summary-generator"
  | "post-generator"
  | "experience-generator"
  | "skills-generator"
  | "recommendation-generator"
  | "connection-request-generator"
  | "company-description-generator"
  | "job-description-generator";

export interface LinkedinGeneratorFormValues {
  topic: string;
}

export interface GenerateLinkedinContentRequest {
  type: LinkedinGeneratorType;
  topic: string;
}

export interface GenerateLinkedinContentSuccessResponse {
  success: true;
  outputs: string[];
}

export interface GenerateLinkedinContentErrorResponse {
  success: false;
  error: string;
}

export type GenerateLinkedinContentResponse =
  | GenerateLinkedinContentSuccessResponse
  | GenerateLinkedinContentErrorResponse;
