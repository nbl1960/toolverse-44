export type TargetModelId = "chatgpt" | "claude" | "gemini" | "midjourney" | "dalle";

export interface TargetModel {
  id: TargetModelId;
  name: string;
  kind: "chat" | "image";
  description: string;
}

export interface TransformRequest {
  request: string;
  targetModel: TargetModelId;
}

export interface TransformSuccessResponse {
  success: true;
  structuredPrompt: string;
  targetModel: TargetModelId;
}

export interface TransformErrorResponse {
  success: false;
  error: string;
}

export type TransformResponse = TransformSuccessResponse | TransformErrorResponse;

export interface AnalyzerCheck {
  id: string;
  label: string;
  passed: boolean;
  hint: string;
}

export interface AnalyzerResult {
  score: number;
  maxScore: number;
  checks: AnalyzerCheck[];
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  targetModel: TargetModelId;
  prompt: string;
}

export interface PromptHistoryEntry {
  id: string;
  input: string;
  output: string;
  targetModel: TargetModelId;
  createdAt: string;
}
