export interface EngagementFormValues {
  followers: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}

export type EngagementRating = "Low" | "Average" | "Good" | "High" | "Excellent";

export interface EngagementCalculationResult {
  totalInteractions: number;
  engagementRate: number;
  rating: EngagementRating;
}
