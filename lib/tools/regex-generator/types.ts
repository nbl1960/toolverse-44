export interface GenerateRegexRequest {
  description: string;
}

export interface RegexResult {
  pattern: string;
  explanation: string;
  example: string;
}

export interface GenerateRegexSuccessResponse {
  success: true;
  result: RegexResult;
}

export interface GenerateRegexErrorResponse {
  success: false;
  error: string;
}

export type GenerateRegexResponse = GenerateRegexSuccessResponse | GenerateRegexErrorResponse;
