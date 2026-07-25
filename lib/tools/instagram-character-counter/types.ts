export type CharacterCounterMode = "caption" | "bio" | "comment";

export interface CharacterCountResult {
  characterCount: number;
  limit: number;
  remaining: number;
  isOverLimit: boolean;
  wordCount: number;
  hashtagCount: number;
  mentionCount: number;
  /** True if a caption would be cut off behind Instagram's "...more" link in-feed. */
  exceedsFeedPreview: boolean;
}
