export interface OptimizeProfileRequest {
  text: string;
}

export interface ProfileOptimizationResult {
  improvedVersion: string;
  suggestions: string[];
}

export interface OptimizeProfileSuccessResponse {
  success: true;
  result: ProfileOptimizationResult;
}

export interface OptimizeProfileErrorResponse {
  success: false;
  error: string;
}

export type OptimizeProfileResponse = OptimizeProfileSuccessResponse | OptimizeProfileErrorResponse;
