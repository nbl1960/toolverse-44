import type { YoutubeGeneratorType } from "./types";

export const MIN_TOPIC_LENGTH = 3;
export const MAX_TOPIC_LENGTH = 300;

export interface YoutubeGeneratorConfig {
  /** Label shown above the input field, e.g. "Video topic". */
  inputLabel: string;
  placeholder: string;
  /** Short helper line under the input. */
  helperText: string;
  /** What one output unit is called, used in UI copy (e.g. "title", "script"). */
  outputNoun: string;
  /** Instruction sent to the model describing exactly what to produce. */
  promptInstruction: string;
  /** Guidance on the expected shape/format of each output string. */
  formatHint: string;
}

export const YOUTUBE_GENERATOR_CONFIG: Record<YoutubeGeneratorType, YoutubeGeneratorConfig> = {
  "tag-generator": {
    inputLabel: "Video topic or title",
    placeholder: "e.g. Beginner's guide to sourdough bread baking at home",
    helperText: "Describe your video in a sentence — the more specific, the better the tags.",
    outputNoun: "tag set",
    promptInstruction:
      "Generate a set of YouTube video tags (keywords) that maximize discoverability for this video. Mix broad and specific/long-tail tags.",
    formatHint:
      "Each output should be a single comma-separated line of 15-25 tags, lowercase, no hashtags, no numbering — ready to paste directly into YouTube's tags field.",
  },
  "title-generator": {
    inputLabel: "Video topic",
    placeholder: "e.g. I tried the 75 Hard challenge for 30 days",
    helperText: "Describe what the video is about — one clear sentence works best.",
    outputNoun: "title",
    promptInstruction:
      "Generate a compelling, click-worthy YouTube video title. Titles should be attention-grabbing but not misleading clickbait, and should stay under 70 characters where possible.",
    formatHint: "Each output should be a single title line, no quotation marks, no numbering.",
  },
  "description-generator": {
    inputLabel: "Video topic and key points",
    placeholder: "e.g. A 10-minute full-body home workout, no equipment needed, great for beginners",
    helperText: "Include the video's topic and any key points, links, or timestamps you want mentioned.",
    outputNoun: "description",
    promptInstruction:
      "Write a complete, SEO-friendly YouTube video description. Open with a strong hook in the first two lines (this is what shows before 'Show more'), include relevant keywords naturally, and end with a call to action to like/subscribe.",
    formatHint:
      "Each output should be a full multi-paragraph description (150-250 words), using \\n\\n between paragraphs.",
  },
  "hashtag-generator": {
    inputLabel: "Video topic",
    placeholder: "e.g. Budget-friendly travel tips for Southeast Asia",
    helperText: "Describe your video's topic or niche.",
    outputNoun: "hashtag set",
    promptInstruction:
      "Generate a set of relevant YouTube hashtags for this video, mixing popular broad hashtags with more specific niche ones.",
    formatHint:
      "Each output should be a single space-separated line of 8-15 hashtags, each starting with #, no spaces within a hashtag.",
  },
  "channel-name-generator": {
    inputLabel: "Channel niche or theme",
    placeholder: "e.g. Retro video game reviews and speedrun commentary",
    helperText: "Describe what your channel is about, and any style or personality you want the name to reflect.",
    outputNoun: "name idea",
    promptInstruction:
      "Generate a catchy, memorable YouTube channel name idea for this niche. Names should be short, easy to say out loud, and reasonably likely to be available as a handle.",
    formatHint: "Each output should be a single channel name, no quotation marks, no description attached.",
  },
  "video-idea-generator": {
    inputLabel: "Channel niche or topic area",
    placeholder: "e.g. Personal finance for people in their 20s",
    helperText: "Describe your channel or the general topic you want video ideas for.",
    outputNoun: "video idea",
    promptInstruction:
      "Generate a specific, compelling YouTube video idea (not just a broad topic) for this niche, framed the way a real video title/concept would be.",
    formatHint:
      "Each output should be one idea: a short title-like line followed by a one-sentence concept, on a single line separated by ' — '.",
  },
  "script-generator": {
    inputLabel: "Video topic",
    placeholder: "e.g. Why you should stop multitasking, explained in 3 minutes",
    helperText: "Describe your video's topic — the script will include a hook, main content, and outro.",
    outputNoun: "script",
    promptInstruction:
      "Write a complete, natural-sounding YouTube video script for this topic: a strong hook in the first two sentences, clearly organized main content, and a short outro with a call to action.",
    formatHint:
      "Each output should be a full script (200-350 words) with [brackets] marking suggested visual cues, using \\n\\n between sections.",
  },
  "keyword-generator": {
    inputLabel: "Video or channel topic",
    placeholder: "e.g. Beginner woodworking projects",
    helperText: "Describe the topic you want to rank for in YouTube and Google search.",
    outputNoun: "keyword set",
    promptInstruction:
      "Generate a set of SEO keyword phrases people actually search for related to this topic, including a mix of short-tail and long-tail phrases suitable for a YouTube title, description, and tags.",
    formatHint:
      "Each output should be a single comma-separated line of 10-15 keyword phrases (not single words), lowercase.",
  },
};
