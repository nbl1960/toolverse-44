export type TwitterGeneratorType =
  | "tweet-generator"
  | "viral-tweet-generator"
  | "thread-generator"
  | "bio-generator"
  | "username-generator"
  | "hashtag-generator"
  | "hook-generator"
  | "poll-generator"
  | "reply-generator"
  | "content-calendar";

export interface TwitterGeneratorFormValues {
  topic: string;
}

export interface GenerateTwitterContentRequest {
  type: TwitterGeneratorType;
  topic: string;
}

export interface GenerateTwitterContentSuccessResponse {
  success: true;
  outputs: string[];
}

export interface GenerateTwitterContentErrorResponse {
  success: false;
  error: string;
}

export type GenerateTwitterContentResponse =
  | GenerateTwitterContentSuccessResponse
  | GenerateTwitterContentErrorResponse;
