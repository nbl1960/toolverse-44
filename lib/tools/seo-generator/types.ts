export type SeoGeneratorType = "meta-title-generator" | "meta-description-generator";

export interface SeoGeneratorFormValues {
  topic: string;
}

export interface GenerateSeoContentRequest {
  type: SeoGeneratorType;
  topic: string;
}

export interface GenerateSeoContentSuccessResponse {
  success: true;
  outputs: string[];
}

export interface GenerateSeoContentErrorResponse {
  success: false;
  error: string;
}

export type GenerateSeoContentResponse = GenerateSeoContentSuccessResponse | GenerateSeoContentErrorResponse;
