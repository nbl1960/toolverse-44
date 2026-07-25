import type { CharacterCounterMode, CharacterCountResult } from "./types";
import { CHARACTER_LIMITS, FEED_PREVIEW_LIMIT } from "./constants";

/** Counts live text stats for a given Instagram field type (caption, bio, or comment). */
export function calculateCharacterCount(text: string, mode: CharacterCounterMode): CharacterCountResult {
  const limit = CHARACTER_LIMITS[mode];
  const characterCount = text.length;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const hashtags = text.match(/#[\p{L}0-9_]+/gu) ?? [];
  const mentions = text.match(/@[\w.]+/g) ?? [];

  return {
    characterCount,
    limit,
    remaining: limit - characterCount,
    isOverLimit: characterCount > limit,
    wordCount: words.length,
    hashtagCount: hashtags.length,
    mentionCount: mentions.length,
    exceedsFeedPreview: mode === "caption" && characterCount > FEED_PREVIEW_LIMIT,
  };
}
