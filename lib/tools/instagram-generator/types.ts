export type InstagramGeneratorType =
  | "caption-generator"
  | "hashtag-generator"
  | "bio-generator"
  | "username-generator"
  | "reel-caption-generator"
  | "post-idea-generator"
  | "story-caption-generator"
  | "quote-generator";

export interface InstagramGeneratorFormValues {
  topic: string;
}

export interface GenerateInstagramContentRequest {
  type: InstagramGeneratorType;
  topic: string;
}

export interface GenerateInstagramContentSuccessResponse {
  success: true;
  outputs: string[];
}

export interface GenerateInstagramContentErrorResponse {
  success: false;
  error: string;
}

export type GenerateInstagramContentResponse =
  | GenerateInstagramContentSuccessResponse
  | GenerateInstagramContentErrorResponse;
