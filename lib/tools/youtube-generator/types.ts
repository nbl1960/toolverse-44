export type YoutubeGeneratorType =
  | "tag-generator"
  | "title-generator"
  | "description-generator"
  | "hashtag-generator"
  | "channel-name-generator"
  | "video-idea-generator"
  | "script-generator"
  | "keyword-generator";

export interface YoutubeGeneratorFormValues {
  topic: string;
}

/** Result of a generation call: always exactly three variations. */
export interface YoutubeGeneratorResult {
  outputs: [string, string, string];
}

export interface GenerateYoutubeContentRequest {
  type: YoutubeGeneratorType;
  topic: string;
}

export interface GenerateYoutubeContentSuccessResponse {
  success: true;
  outputs: string[];
}

export interface GenerateYoutubeContentErrorResponse {
  success: false;
  error: string;
}

export type GenerateYoutubeContentResponse =
  | GenerateYoutubeContentSuccessResponse
  | GenerateYoutubeContentErrorResponse;
