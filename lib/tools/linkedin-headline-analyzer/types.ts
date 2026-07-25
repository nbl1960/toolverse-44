export interface HeadlineAnalysisResult {
  characterCount: number;
  limit: number;
  score: number;
  rating: "Needs work" | "Good" | "Great";
  checks: HeadlineCheck[];
}

export interface HeadlineCheck {
  label: string;
  passed: boolean;
  detail: string;
}
