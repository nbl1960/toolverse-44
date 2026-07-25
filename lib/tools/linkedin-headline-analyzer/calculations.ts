import type { HeadlineAnalysisResult, HeadlineCheck } from "./types";
import { HEADLINE_CHAR_LIMIT, POWER_WORDS } from "./constants";

function scoreToRating(score: number): HeadlineAnalysisResult["rating"] {
  if (score >= 71) return "Great";
  if (score >= 41) return "Good";
  return "Needs work";
}

/**
 * Scores a LinkedIn headline against concrete, checkable criteria —
 * length utilization, presence of a value-signaling word, a
 * quantifiable/numeric element, a multi-part structure (separators like
 * "|" or "•"), and avoiding all-caps. Every point is tied to one visible
 * check in the result, not a hidden black-box score.
 */
export function analyzeHeadline(headline: string): HeadlineAnalysisResult {
  const trimmed = headline.trim();
  const characterCount = trimmed.length;

  const checks: HeadlineCheck[] = [];
  let score = 0;

  // Length utilization — up to 30 points.
  let lengthPoints = 0;
  let lengthDetail: string;
  if (characterCount === 0) {
    lengthDetail = "Add a headline to get started.";
  } else if (characterCount < 20) {
    lengthPoints = 5;
    lengthDetail = "Very short — likely just a job title. Add what makes your work distinct.";
  } else if (characterCount < 80) {
    lengthPoints = 20;
    lengthDetail = `${characterCount}/${HEADLINE_CHAR_LIMIT} characters — reasonable length, room to add more.`;
  } else {
    lengthPoints = 30;
    lengthDetail = `${characterCount}/${HEADLINE_CHAR_LIMIT} characters — makes good use of the available space.`;
  }
  score += lengthPoints;
  checks.push({ label: "Length", passed: lengthPoints >= 20, detail: lengthDetail });

  // Value/power word — 25 points.
  const lowerHeadline = trimmed.toLowerCase();
  const matchedWord = POWER_WORDS.find((word) => lowerHeadline.includes(word));
  const hasPowerWord = Boolean(matchedWord);
  score += hasPowerWord ? 25 : 0;
  checks.push({
    label: "Value-signaling language",
    passed: hasPowerWord,
    detail: hasPowerWord
      ? `Includes a value-signaling word ("${matchedWord}").`
      : 'No value-signaling words found (e.g. "helping", "specializing in", "leading").',
  });

  // Quantifiable element — 20 points.
  const hasNumber = /\d/.test(trimmed);
  score += hasNumber ? 20 : 0;
  checks.push({
    label: "Quantifiable detail",
    passed: hasNumber,
    detail: hasNumber
      ? "Includes a number — quantifiable details stand out."
      : "No numbers found. A specific figure (years, scale, results) can make a headline more concrete.",
  });

  // Multi-part structure — 15 points.
  const hasSeparator = /[|•·–—]/.test(trimmed) || /\bat\b.*\band\b/i.test(trimmed);
  score += hasSeparator ? 15 : 0;
  checks.push({
    label: "Multi-part structure",
    passed: hasSeparator,
    detail: hasSeparator
      ? "Uses a separator to pack in more than one value point."
      : 'No separator found (e.g. "|" or "•"). Many strong headlines combine role + focus + outcome this way.',
  });

  // Not all-caps — 10 points.
  const isShouting = trimmed.length > 3 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed);
  score += isShouting ? 0 : 10;
  checks.push({
    label: "Readable formatting",
    passed: !isShouting,
    detail: isShouting ? "Avoid writing in all caps — it can read as spammy." : "Formatting reads naturally.",
  });

  return {
    characterCount,
    limit: HEADLINE_CHAR_LIMIT,
    score,
    rating: scoreToRating(score),
    checks,
  };
}
