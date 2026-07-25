import type { FaqItem, ToolExample } from "@/lib/types";
import type { CharacterCounterMode } from "./types";

export const CHARACTER_LIMITS: Record<CharacterCounterMode, number> = {
  caption: 2_200,
  bio: 150,
  comment: 2_200,
};

/** Instagram truncates feed captions behind a "...more" link after roughly this many characters. */
export const FEED_PREVIEW_LIMIT = 125;

export const MODE_OPTIONS: { value: CharacterCounterMode; label: string }[] = [
  { value: "caption", label: "Caption" },
  { value: "bio", label: "Bio" },
  { value: "comment", label: "Comment" },
];

export const CHARACTER_COUNTER_FAQ_ITEMS: FaqItem[] = [
  {
    question: "What's the Instagram caption character limit?",
    answer: "2,200 characters, including spaces, emojis, and hashtags — the same limit applies to comments.",
  },
  {
    question: "What's the Instagram bio character limit?",
    answer: "150 characters — noticeably shorter than a caption, which is why the Bio mode here uses a separate, stricter limit.",
  },
  {
    question: "Why does my caption get cut off with \"...more\"?",
    answer:
      "Instagram only shows roughly the first 125 characters of a caption in the main feed before truncating it behind a \"...more\" link — this tool flags when your caption would be cut off there, so you can put your hook before that point.",
  },
  {
    question: "Do hashtags count toward the character limit?",
    answer: "Yes — every character in a hashtag counts toward the same 2,200-character caption limit, which is why this tool also shows a running hashtag count.",
  },
  {
    question: "Does this count emojis correctly?",
    answer:
      "Most emojis are counted the same way Instagram counts them, though some complex multi-part emojis (like certain flag or skin-tone combinations) can be counted slightly differently across platforms — treat the count as very close, not always pixel-perfect.",
  },
];

export const CHARACTER_COUNTER_EXAMPLE: ToolExample = {
  title: "Example: checking a caption before posting",
  summary: "Pasting a caption into the counter:",
  inputs: [{ label: "Mode", value: "Caption" }],
  outputs: [
    { label: "Characters", value: "187 / 2,200" },
    { label: "Feed preview", value: "Exceeds 125-character preview" },
  ],
};
