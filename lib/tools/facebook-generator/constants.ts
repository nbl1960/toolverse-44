import type { GeneratorConfig } from "@/lib/generator-config";
import type { FacebookGeneratorType } from "./types";

export const MIN_TOPIC_LENGTH = 3;
export const MAX_TOPIC_LENGTH = 400;

export const FACEBOOK_GENERATOR_CONFIG: Record<FacebookGeneratorType, GeneratorConfig> = {
  "caption-generator": {
    inputLabel: "What's the photo or post about?",
    placeholder: "e.g. A photo from our team's weekend volunteer day at the community garden",
    helperText: "Describe the photo or moment — one sentence works best.",
    outputNoun: "caption",
    promptInstruction:
      "Write a Facebook caption for this post. Facebook captions tend to read a bit warmer and more conversational than other platforms, and often work well with a light call to engage (a question, a tag-a-friend prompt).",
    formatHint: "Each output should be a single caption (1-3 sentences), no hashtags included, no quotation marks.",
  },
  "post-generator": {
    inputLabel: "What do you want to post about?",
    placeholder: "e.g. Announcing our store's new weekend hours",
    helperText: "Describe the topic or update you want to share.",
    outputNoun: "post",
    promptInstruction:
      "Write a Facebook post on this topic. Facebook posts can be a bit longer and more conversational than other platforms — open with something that earns attention, then give the actual update or story.",
    formatHint: "Each output should be a complete post (60-150 words), using \\n\\n between short paragraphs.",
  },
  "bio-generator": {
    inputLabel: "What's your Page or profile about?",
    placeholder: "e.g. A family-owned Italian restaurant open for 20 years",
    helperText: "Describe who you are or what your Page is about.",
    outputNoun: "bio",
    promptInstruction:
      "Write a short Facebook Page or profile bio/description for this account — clear and welcoming, communicating what visitors can expect.",
    formatHint: "Each output should be 1-3 short sentences, under 255 characters (Facebook's Page bio limit).",
  },
  "ad-copy-generator": {
    inputLabel: "What are you advertising?",
    placeholder: "e.g. A 20%-off sale on handmade candles, ending Sunday",
    helperText: "Describe the product, offer, or service being advertised.",
    outputNoun: "ad copy",
    promptInstruction:
      "Write the primary text for a Facebook ad based on this offer. Should lead with the benefit or hook, be persuasive without being pushy, and naturally lead toward a clear next step.",
    formatHint: "Each output should be 2-4 short sentences (under 125 words), no hashtags, no quotation marks.",
  },
  "headline-generator": {
    inputLabel: "What are you advertising or promoting?",
    placeholder: "e.g. A free 7-day trial for a meal planning app",
    helperText: "Describe the offer — Facebook ad headlines are short, around 40 characters.",
    outputNoun: "headline",
    promptInstruction:
      "Write a short, punchy Facebook ad headline for this offer — the large bold text shown above the ad's primary text.",
    formatHint: "Each output must be under 40 characters, a single headline, no quotation marks.",
  },
  "cta-generator": {
    inputLabel: "What action do you want people to take?",
    placeholder: "e.g. Sign up for a free consultation call",
    helperText: "Describe the specific action you want the reader to take.",
    outputNoun: "call to action",
    promptInstruction:
      "Write a short, compelling call-to-action line for a Facebook post or ad, prompting this specific action. Should create a clear, low-friction next step.",
    formatHint: "Each output should be a single short line, under 15 words, no quotation marks.",
  },
  "comment-generator": {
    inputLabel: "What are you commenting on, and with what angle?",
    placeholder: "e.g. Replying to a post in a local business group asking for restaurant recommendations",
    helperText: "Describe the post you're commenting on and what you want to say.",
    outputNoun: "comment",
    promptInstruction:
      "Write a Facebook comment based on this context. Should sound natural and conversational, add genuine value, and match how people actually write comments (not a formal reply).",
    formatHint: "Each output should be a short comment (1-3 sentences), no quotation marks.",
  },
  "event-description-generator": {
    inputLabel: "What's the event?",
    placeholder: "e.g. A free community yoga class in the park every Saturday morning",
    helperText: "Describe the event, who it's for, and any key details.",
    outputNoun: "event description",
    promptInstruction:
      "Write a Facebook Event description for this event — should clearly convey what it is, who it's for, and why someone should attend, in an inviting tone.",
    formatHint: "Each output should be 2-3 short paragraphs (60-120 words), using \\n\\n between paragraphs.",
  },
  "group-description-generator": {
    inputLabel: "What's the group about?",
    placeholder: "e.g. A support group for new parents in the Denver area",
    helperText: "Describe the group's purpose and who it's for.",
    outputNoun: "group description",
    promptInstruction:
      "Write a Facebook Group description for this group — should clearly state the group's purpose, who it's for, and what members can expect, and can briefly set expectations for tone/rules.",
    formatHint: "Each output should be 2-3 short paragraphs (60-120 words), using \\n\\n between paragraphs.",
  },
  "hashtag-generator": {
    inputLabel: "Post topic",
    placeholder: "e.g. A small business's first pop-up shop event",
    helperText: "Describe your post's topic.",
    outputNoun: "hashtag set",
    promptInstruction:
      "Generate a small set of relevant Facebook hashtags for this post. Facebook posts perform best with only a few well-chosen hashtags, not a long list.",
    formatHint: "Each output should be a single space-separated line of 2-5 hashtags, each starting with #.",
  },
};
