import type { FaqItem, ToolExample } from "@/lib/types";

export const DEFAULT_FOLLOWERS = 5_000;
export const DEFAULT_LIKES = 200;
export const DEFAULT_COMMENTS = 15;
export const DEFAULT_SHARES = 0;
export const DEFAULT_SAVES = 0;

export const MIN_VALUE = 0;
export const MAX_FOLLOWERS = 1_000_000_000;
export const MAX_INTERACTIONS = 100_000_000;

export const ENGAGEMENT_FAQ_ITEMS: FaqItem[] = [
  {
    question: "What's a good Instagram engagement rate?",
    answer:
      "As a rough industry rule of thumb: under 1% is low, 1-3.5% is average, 3.5-6% is good, 6-10% is high, and above 10% is excellent. Smaller accounts often see higher rates than large ones, so use this as a general guide, not an exact benchmark.",
  },
  {
    question: "How is engagement rate calculated here?",
    answer:
      "(Likes + Comments + Shares + Saves) ÷ Followers × 100. Shares and saves are optional — leave them at 0 if you don't track them, and the calculation just uses likes and comments.",
  },
  {
    question: "Why not use reach or impressions instead of followers?",
    answer:
      "Engagement-by-reach is a more precise metric but requires data from Instagram's own analytics (only available to you, for your own posts). Engagement-by-followers is the more common public-facing metric, useful for comparing accounts or estimating typical performance.",
  },
  {
    question: "Should I calculate this per post or as an account average?",
    answer:
      "Either works — enter a single post's numbers to check that post's engagement, or use your account's average likes/comments per post to get a sense of typical performance.",
  },
  {
    question: "Does a high follower count hurt engagement rate?",
    answer:
      "It often does in percentage terms — as an audience grows, it typically includes more casual followers less likely to engage with every post, which is part of why smaller accounts often show higher engagement rates than large ones.",
  },
];

export const ENGAGEMENT_EXAMPLE: ToolExample = {
  title: "Example: a 5,000-follower account",
  summary: "A post with 200 likes and 15 comments, no shares or saves tracked:",
  inputs: [
    { label: "Followers", value: "5,000" },
    { label: "Likes", value: "200" },
    { label: "Comments", value: "15" },
  ],
  outputs: [
    { label: "Total interactions", value: "215" },
    { label: "Engagement rate", value: "4.3%" },
    { label: "Rating", value: "Good" },
  ],
};
