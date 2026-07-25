import type { EngagementCalculationResult, EngagementFormValues, EngagementRating } from "./types";

/** Common, widely-cited rule-of-thumb bands for Instagram engagement rate. */
function rateEngagement(rate: number): EngagementRating {
  if (rate < 1) return "Low";
  if (rate < 3.5) return "Average";
  if (rate < 6) return "Good";
  if (rate < 10) return "High";
  return "Excellent";
}

/**
 * Engagement rate = total interactions ÷ followers × 100. "Interactions"
 * here is likes + comments, plus shares and saves if provided — both are
 * optional since not every creator tracks them, but including them gives
 * a more complete picture where available.
 */
export function calculateEngagement(values: EngagementFormValues): EngagementCalculationResult {
  const totalInteractions = values.likes + values.comments + values.shares + values.saves;
  const engagementRate = values.followers > 0 ? (totalInteractions / values.followers) * 100 : 0;

  return {
    totalInteractions,
    engagementRate,
    rating: rateEngagement(engagementRate),
  };
}
