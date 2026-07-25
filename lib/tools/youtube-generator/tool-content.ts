import type { FaqItem, ToolExample } from "@/lib/types";
import type { YoutubeGeneratorType } from "./types";

interface GeneratorContent {
  faq: FaqItem[];
  example: ToolExample;
}

export const YOUTUBE_GENERATOR_CONTENT: Record<YoutubeGeneratorType, GeneratorContent> = {
  "tag-generator": {
    faq: [
      {
        question: "How many tags should I actually use?",
        answer:
          "YouTube allows up to 500 characters of tags total. Using all of the generated tags is fine, but prioritize the ones that most specifically describe your video — overly generic tags do less for discoverability than a handful of precise, relevant ones.",
      },
      {
        question: "Do tags still matter for YouTube SEO?",
        answer:
          "Tags carry less weight than your title, description, and thumbnail, but they still help YouTube understand your video's context, especially for less common searches and for correcting typos in search queries.",
      },
      {
        question: "Can I regenerate if the first set isn't right?",
        answer: "Yes — click Regenerate as many times as you like; each pass produces three new tag sets.",
      },
    ],
    example: {
      title: "Example: a beginner baking video",
      summary: "Entering a video topic generates three ready-to-use tag sets:",
      inputs: [{ label: "Video topic", value: "Beginner's guide to sourdough bread baking at home" }],
      outputs: [
        { label: "Option 1", value: "sourdough bread, baking bread at home, bread starter, beginner baking…" },
      ],
    },
  },
  "title-generator": {
    faq: [
      {
        question: "How long should a YouTube title be?",
        answer:
          "Aim to stay under about 60-70 characters so your full title shows in search results and suggested videos without being cut off with an ellipsis.",
      },
      {
        question: "Should titles be clickbait?",
        answer:
          "A compelling title creates curiosity without misleading viewers about what the video actually delivers — titles that overpromise tend to hurt watch time and audience trust once viewers click through.",
      },
      {
        question: "Can I combine ideas from multiple generated titles?",
        answer: "Absolutely — treat the three options as a starting point and mix and match freely.",
      },
    ],
    example: {
      title: "Example: a 30-day challenge video",
      summary: "Entering a video topic generates three distinct title options:",
      inputs: [{ label: "Video topic", value: "I tried the 75 Hard challenge for 30 days" }],
      outputs: [
        { label: "Option 1", value: "I Did 75 Hard for 30 Days — Here's What Actually Happened" },
      ],
    },
  },
  "description-generator": {
    faq: [
      {
        question: "How long should a video description be?",
        answer:
          "There's no strict rule, but 150-300 words is a good target — enough to include context and keywords naturally without padding. The first 1-2 sentences matter most, since that's what shows before \"Show more.\"",
      },
      {
        question: "Should I add timestamps to the description?",
        answer:
          "If your video has clear sections, yes — timestamps improve viewer experience and can appear directly in search results. See the Timestamp Generator to build them quickly.",
      },
      {
        question: "Will this include hashtags or links automatically?",
        answer:
          "No — the generated description focuses on the written content. Add your own links, hashtags, and timestamps afterward to keep those accurate to your specific video.",
      },
    ],
    example: {
      title: "Example: a home workout video",
      summary: "Entering the video's topic and key points generates three description drafts:",
      inputs: [
        {
          label: "Topic and key points",
          value: "A 10-minute full-body home workout, no equipment needed, great for beginners",
        },
      ],
      outputs: [{ label: "Option 1", value: "A full multi-paragraph description, ready to paste and edit." }],
    },
  },
  "hashtag-generator": {
    faq: [
      {
        question: "How many hashtags does YouTube actually support?",
        answer:
          "YouTube displays up to 15 hashtags from your description above the video title; anything beyond that is still included in the description text but won't display as clickable tags at the top.",
      },
      {
        question: "Where do I put the hashtags?",
        answer:
          "Anywhere in your video description — YouTube automatically detects hashtags in the text and displays the first few above your title.",
      },
      {
        question: "Should I use the same hashtags on every video?",
        answer:
          "A few consistent, channel-wide hashtags can help build a recognizable niche presence, but mixing in video-specific ones (like the ones generated here) helps each video get discovered on its own topic too.",
      },
    ],
    example: {
      title: "Example: a travel video",
      summary: "Entering a topic generates three hashtag sets:",
      inputs: [{ label: "Video topic", value: "Budget-friendly travel tips for Southeast Asia" }],
      outputs: [{ label: "Option 1", value: "#travel #budgettravel #southeastasia #backpacking #traveltips…" }],
    },
  },
  "channel-name-generator": {
    faq: [
      {
        question: "How do I know if a name is available?",
        answer:
          "This tool generates name ideas only — check availability directly on YouTube and as a matching handle/domain before committing to one.",
      },
      {
        question: "Should my channel name include my niche?",
        answer:
          "It can help new viewers immediately understand what your channel is about, but it isn't required — many successful channels use a distinctive, memorable name instead and let their content speak for itself.",
      },
      {
        question: "Can I regenerate for more options?",
        answer: "Yes — click Regenerate for a fresh set of three name ideas any time.",
      },
    ],
    example: {
      title: "Example: a retro gaming channel",
      summary: "Entering your niche generates three channel name ideas:",
      inputs: [{ label: "Channel niche", value: "Retro video game reviews and speedrun commentary" }],
      outputs: [{ label: "Option 1", value: "Pixel Rewind" }],
    },
  },
  "video-idea-generator": {
    faq: [
      {
        question: "What if I want ideas for a completely new channel?",
        answer:
          "Describe the general topic or audience you want to reach instead of an existing channel — the generator works the same way for a brand-new niche.",
      },
      {
        question: "How specific are the generated ideas?",
        answer:
          "Each idea is framed as a concrete, ready-to-film concept rather than a broad topic, so you can move straight to outlining or scripting.",
      },
      {
        question: "Can I use these for a video series?",
        answer: "Yes — generate a few rounds and pick several ideas that work well together as a series or playlist.",
      },
    ],
    example: {
      title: "Example: a personal finance channel",
      summary: "Entering your niche generates three specific video concepts:",
      inputs: [{ label: "Channel niche", value: "Personal finance for people in their 20s" }],
      outputs: [
        { label: "Option 1", value: "I Tracked Every Dollar for 30 Days — Here's What I Learned" },
      ],
    },
  },
  "script-generator": {
    faq: [
      {
        question: "Will the script match my exact video length?",
        answer:
          "Each generated script is a solid first draft (roughly 200-350 words, about 1.5-2.5 minutes spoken) — trim or expand sections to match your target length and add your own examples and personality.",
      },
      {
        question: "What do the bracketed notes mean?",
        answer:
          "Text in [brackets] marks suggested visual cues or moments to cut to b-roll — they're prompts for filming and editing, not meant to be read aloud.",
      },
      {
        question: "Can I generate a script in a different tone?",
        answer:
          "Try rephrasing your topic input to hint at the tone you want (e.g. \"...explained casually\" or \"...a serious deep dive into\"), then regenerate.",
      },
    ],
    example: {
      title: "Example: a short explainer video",
      summary: "Entering a topic generates three complete script drafts:",
      inputs: [{ label: "Video topic", value: "Why you should stop multitasking, explained in 3 minutes" }],
      outputs: [{ label: "Option 1", value: "A full hook + body + outro script, ready to read and film." }],
    },
  },
  "keyword-generator": {
    faq: [
      {
        question: "How is this different from the Tag Generator?",
        answer:
          "Tags are metadata attached directly to your video upload. Keywords are the actual search phrases people type — use this tool to shape your title, description, and script wording, and the Tag Generator for the tags field itself.",
      },
      {
        question: "Should I use exact keyword phrases in my title?",
        answer:
          "Working a top keyword phrase naturally into your title and the first line of your description tends to help more than stuffing multiple keywords in awkwardly.",
      },
      {
        question: "Are these YouTube-specific or general SEO keywords?",
        answer:
          "Both — the generated phrases are chosen to reflect how people search on YouTube, which overlaps significantly with how they'd search on Google for the same topic.",
      },
    ],
    example: {
      title: "Example: a woodworking channel",
      summary: "Entering a topic generates three keyword phrase sets:",
      inputs: [{ label: "Topic", value: "Beginner woodworking projects" }],
      outputs: [
        { label: "Option 1", value: "easy woodworking projects for beginners, diy wood projects, beginner woodworking tools…" },
      ],
    },
  },
};
