import type { GeneratorConfig } from "@/lib/generator-config";
import type { TwitterGeneratorType } from "./types";

export const MIN_TOPIC_LENGTH = 3;
export const MAX_TOPIC_LENGTH = 300;

export const TWITTER_GENERATOR_CONFIG: Record<TwitterGeneratorType, GeneratorConfig> = {
  "tweet-generator": {
    inputLabel: "What's the tweet about?",
    placeholder: "e.g. Why I switched from a to-do list app to just using a notebook",
    helperText: "Describe your point or observation — X posts have a 280-character limit.",
    outputNoun: "tweet",
    promptInstruction:
      "Write a tweet for X (formerly Twitter) on this topic. Strong tweets are direct, have a clear point, and don't waste words.",
    formatHint: "Each output must be under 280 characters, a single tweet, no quotation marks, no hashtags unless they add real value.",
  },
  "viral-tweet-generator": {
    inputLabel: "What's the topic or take?",
    placeholder: "e.g. Most productivity advice makes people less productive",
    helperText: "Describe your topic or a bold opinion — this style leans into strong hooks and sharp takes.",
    outputNoun: "tweet",
    promptInstruction:
      "Write a tweet for X designed to stop the scroll and drive engagement: a bold, specific claim or a surprising angle stated confidently in the first few words, structured for high reply/share potential.",
    formatHint: "Each output must be under 280 characters, a single tweet, no quotation marks, no hedging language.",
  },
  "thread-generator": {
    inputLabel: "What's the thread about?",
    placeholder: "e.g. 5 lessons from my first year running a small business",
    helperText: "Describe the topic — this generates a multi-tweet thread outline.",
    outputNoun: "thread",
    promptInstruction:
      "Write an X thread outline on this topic: a strong hook as tweet 1, then 4-6 numbered tweets each making one clear point, each short enough to stand alone.",
    formatHint:
      "Each output should be a complete thread as one block of text, tweets numbered like '1/ ...', '2/ ...', separated by \\n\\n, each individual tweet under 280 characters.",
  },
  "bio-generator": {
    inputLabel: "What's your account about?",
    placeholder: "e.g. Indie hacker building small profitable software products",
    helperText: "Describe who you are or what your account is about — X bios have a 160-character limit.",
    outputNoun: "bio",
    promptInstruction:
      "Write an X (Twitter) bio for this account. Should be punchy and specific, can use relevant emojis sparingly, and fit the platform's terse, personality-forward style.",
    formatHint: "Each output must be under 160 characters, a single bio, ready to paste as-is.",
  },
  "username-generator": {
    inputLabel: "Name or niche",
    placeholder: "e.g. A developer named Sam who posts about Rust and systems programming",
    helperText: "Include a name and/or niche you'd like reflected in the handle.",
    outputNoun: "username idea",
    promptInstruction:
      "Generate a catchy, likely-available X (Twitter) handle idea for this person or niche. Short, easy to type, using only letters, numbers, or underscores.",
    formatHint: "Each output should be a single handle (no @ symbol, no spaces), ready to try on X.",
  },
  "hashtag-generator": {
    inputLabel: "Post topic",
    placeholder: "e.g. Launching a new open-source CLI tool",
    helperText: "Describe your post's topic.",
    outputNoun: "hashtag set",
    promptInstruction:
      "Generate a small set of relevant X (Twitter) hashtags for this post. X posts perform best with very few hashtags — favor 1-3 well-targeted ones over a long list.",
    formatHint: "Each output should be a single space-separated line of 2-4 hashtags, each starting with #.",
  },
  "hook-generator": {
    inputLabel: "What's the hook for?",
    placeholder: "e.g. A thread about how I taught myself to code in 6 months",
    helperText: "Describe the tweet or thread this hook will open — the first line is what earns the click.",
    outputNoun: "hook",
    promptInstruction:
      "Write an opening hook line for an X post or thread on this topic. Strong hooks create curiosity, state a bold claim, or promise a specific payoff, in as few words as possible.",
    formatHint: "Each output should be a single short hook line, under 100 characters, no quotation marks.",
  },
  "poll-generator": {
    inputLabel: "What do you want to poll people on?",
    placeholder: "e.g. Which productivity method actually works for people",
    helperText: "Describe the question or decision you want your audience's opinion on.",
    outputNoun: "poll",
    promptInstruction:
      "Write an X poll: a short, clear question followed by up to 4 short answer options (X polls support 2-4 options, each under 25 characters).",
    formatHint:
      "Each output should be the question on the first line, then each option on its own line prefixed with '- ', using \\n between lines.",
  },
  "reply-generator": {
    inputLabel: "What are you replying to, and with what angle?",
    placeholder: "e.g. Replying to a post about remote work with my experience managing a distributed team",
    helperText: "Describe the post you're replying to and the point you want to make.",
    outputNoun: "reply",
    promptInstruction:
      "Write a reply to an X post based on this context. Should add genuine value or perspective, not just agree — a good reply could stand on its own.",
    formatHint: "Each output must be under 280 characters, a single reply, no quotation marks.",
  },
  "content-calendar": {
    inputLabel: "Your niche or account theme",
    placeholder: "e.g. A newsletter about personal finance for freelancers",
    helperText: "Describe your account's niche — this generates a week of post ideas.",
    outputNoun: "weekly content calendar",
    promptInstruction:
      "Generate a 7-day X (Twitter) content calendar for this niche: one specific post idea per day (not a generic topic — a concrete angle or hook for that day), covering a healthy mix of formats (a tip, a question, a personal story, an opinion, a thread idea, etc.) across the week.",
    formatHint:
      "Each output should be a complete 7-day calendar as one block of text, one line per day formatted 'Day 1: ...' through 'Day 7: ...', using \\n between lines.",
  },
};
