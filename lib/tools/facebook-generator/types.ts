export type FacebookGeneratorType =
  | "caption-generator"
  | "post-generator"
  | "bio-generator"
  | "ad-copy-generator"
  | "headline-generator"
  | "cta-generator"
  | "comment-generator"
  | "event-description-generator"
  | "group-description-generator"
  | "hashtag-generator";

export interface FacebookGeneratorFormValues {
  topic: string;
}

export interface GenerateFacebookContentRequest {
  type: FacebookGeneratorType;
  topic: string;
}

export interface GenerateFacebookContentSuccessResponse {
  success: true;
  outputs: string[];
}

export interface GenerateFacebookContentErrorResponse {
  success: false;
  error: string;
}

export type GenerateFacebookContentResponse =
  | GenerateFacebookContentSuccessResponse
  | GenerateFacebookContentErrorResponse;
