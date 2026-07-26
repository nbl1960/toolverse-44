export type WritingGeneratorType = "resume-builder" | "seo-meta-generator";

export interface WritingGeneratorFormValues {
  topic: string;
}

export interface GenerateWritingContentRequest {
  type: WritingGeneratorType;
  topic: string;
}

export interface GenerateWritingContentSuccessResponse {
  success: true;
  outputs: string[];
}

export interface GenerateWritingContentErrorResponse {
  success: false;
  error: string;
}

export type GenerateWritingContentResponse =
  | GenerateWritingContentSuccessResponse
  | GenerateWritingContentErrorResponse;
