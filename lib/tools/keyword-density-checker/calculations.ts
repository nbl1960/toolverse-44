import type { KeywordDensityResult, WordFrequency } from "./types";
import { STOPWORDS, TOP_WORDS_COUNT } from "./constants";

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? []).filter((word) => word.length > 1);
}

/** Analyzes word frequency and density in a block of text, optionally reporting a specific target keyword's density. */
export function analyzeKeywordDensity(text: string, targetKeyword: string): KeywordDensityResult | null {
  const words = tokenize(text);
  const totalWords = words.length;
  if (totalWords === 0) return null;

  const counts = new Map<string, number>();
  for (const word of words) {
    if (STOPWORDS.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  const topWords: WordFrequency[] = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_WORDS_COUNT)
    .map(([word, count]) => ({ word, count, density: (count / totalWords) * 100 }));

  let targetResult: WordFrequency | null = null;
  const normalizedTarget = targetKeyword.trim().toLowerCase();
  if (normalizedTarget) {
    // A target keyword can be a phrase (e.g. "mechanical keyboard"), so
    // count occurrences by scanning the original lowercased text rather
    // than the single-word token map above.
    const escaped = normalizedTarget.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = text.toLowerCase().match(new RegExp(escaped, "g"));
    const count = matches ? matches.length : 0;
    targetResult = { word: targetKeyword.trim(), count, density: (count / totalWords) * 100 };
  }

  return { totalWords, topWords, targetKeyword: targetResult };
}
