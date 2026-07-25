import type { GeneratorConfig } from "@/lib/generator-config";
import type { InstagramGeneratorType } from "./types";

export const MIN_TOPIC_LENGTH = 3;
export const MAX_TOPIC_LENGTH = 300;

export const INSTAGRAM_GENERATOR_CONFIG: Record<InstagramGeneratorType, GeneratorConfig> = {
  "caption-generator": {
    inputLabel: "What's the post about?",
    placeholder: "e.g. A sunset beach walk with my dog after a long week",
    helperText: "Describe the photo or moment — one sentence works best.",
    outputNoun: "caption",
    promptInstruction:
      "Generate an engaging Instagram caption for this post. Captions should feel authentic and conversational, not like an ad, and should encourage engagement (a question, a relatable moment, or a clear thought).",
    formatHint:
      "Each output should be a single caption (1-3 short sentences, or a few short lines), no hashtags included, no quotation marks.",
  },
  "hashtag-generator": {
    inputLabel: "Post topic or niche",
    placeholder: "e.g. Home workout routine for busy mornings",
    helperText: "Describe your post's topic or your account's niche.",
    outputNoun: "hashtag set",
    promptInstruction:
      "Generate a set of relevant Instagram hashtags for this post, mixing broad, medium-competition, and niche-specific hashtags for better reach.",
    formatHint:
      "Each output should be a single space-separated line of 15-20 hashtags, each starting with #, no spaces within a hashtag.",
  },
  "bio-generator": {
    inputLabel: "What's your account about?",
    placeholder: "e.g. A personal trainer sharing home workouts and healthy recipes",
    helperText: "Describe who you are or what your account is about, in a sentence.",
    outputNoun: "bio",
    promptInstruction:
      "Write a short, compelling Instagram bio for this account. Bios should communicate who the person/brand is and what followers get, and can include relevant emojis sparingly.",
    formatHint:
      "Each output should be a complete bio under 150 characters, using \\n for line breaks between short lines if helpful.",
  },
  "username-generator": {
    inputLabel: "Name or niche",
    placeholder: "e.g. A travel photographer named Alex who focuses on mountains",
    helperText: "Include a name and/or niche you'd like reflected in the username.",
    outputNoun: "username idea",
    promptInstruction:
      "Generate a catchy, available-sounding Instagram username idea for this person or niche. Usernames should be short, easy to type and remember, using only letters, numbers, periods, or underscores.",
    formatHint: "Each output should be a single username (no @ symbol, no spaces), ready to try on Instagram.",
  },
  "reel-caption-generator": {
    inputLabel: "What's the Reel about?",
    placeholder: "e.g. A 15-second before-and-after room makeover",
    helperText: "Describe what happens in the Reel — the hook matters most here.",
    outputNoun: "Reel caption",
    promptInstruction:
      "Write a short, punchy Instagram Reel caption for this video. Reel captions should hook attention fast and match the quick, casual energy of short-form video.",
    formatHint: "Each output should be a short caption (under 2 sentences), no hashtags included.",
  },
  "post-idea-generator": {
    inputLabel: "Your niche or account theme",
    placeholder: "e.g. A small-batch candle business",
    helperText: "Describe your account's niche or theme.",
    outputNoun: "post idea",
    promptInstruction:
      "Generate a specific, ready-to-shoot Instagram post idea for this niche — a concrete concept, not a generic topic.",
    formatHint:
      "Each output should be one idea: a short concept line followed by a one-sentence execution note, separated by ' — '.",
  },
  "story-caption-generator": {
    inputLabel: "What's happening in the Story?",
    placeholder: "e.g. Behind the scenes setting up for a weekend pop-up shop",
    helperText: "Describe the moment — Story captions are quick and casual.",
    outputNoun: "Story caption",
    promptInstruction:
      "Write a very short, casual Instagram Story caption for this moment — the tone should feel like a quick, in-the-moment update to friends.",
    formatHint: "Each output should be a single short line, well under 20 words, casual tone.",
  },
  "quote-generator": {
    inputLabel: "Theme or topic",
    placeholder: "e.g. Staying motivated when starting a new business",
    helperText: "Describe the theme you want a shareable quote about.",
    outputNoun: "quote",
    promptInstruction:
      "Write an original, shareable quote about this theme, suitable for an Instagram quote graphic — short, quotable, and not a paraphrase of a famous existing quote.",
    formatHint: "Each output should be a single quote (one sentence, under 25 words), no attribution, no quotation marks.",
  },
};
