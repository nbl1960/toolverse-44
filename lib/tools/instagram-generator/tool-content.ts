import type { FaqItem, ToolExample } from "@/lib/types";
import type { InstagramGeneratorType } from "./types";

interface GeneratorContent {
  faq: FaqItem[];
  example: ToolExample;
}

export const INSTAGRAM_GENERATOR_CONTENT: Record<InstagramGeneratorType, GeneratorContent> = {
  "caption-generator": {
    faq: [
      {
        question: "How long should an Instagram caption be?",
        answer:
          "There's no fixed rule — short, punchy captions work well for quick moments, while longer storytelling captions can perform just as well when the content earns the read. Instagram truncates captions after a couple of lines, so put your hook first either way.",
      },
      {
        question: "Should I include a call to action?",
        answer:
          "A soft call to action (a question, an invitation to share an opinion, or a prompt like \"save this for later\") tends to increase comments and saves, both of which help a post's reach.",
      },
      {
        question: "Can I edit the generated caption?",
        answer: "Yes — treat each option as a strong starting draft. Add your own voice, specific details, and any links or mentions before posting.",
      },
      {
        question: "Does this include hashtags?",
        answer:
          "No — captions and hashtags are generated separately. Use the Instagram Hashtag Generator alongside this one, so each can be regenerated independently without losing the other.",
      },
      {
        question: "Can I regenerate if none of the three fit?",
        answer: "Yes — click Regenerate as many times as you like for a fresh set of three captions.",
      },
    ],
    example: {
      title: "Example: a sunset beach photo",
      summary: "Entering a short description generates three caption options:",
      inputs: [{ label: "Post topic", value: "A sunset beach walk with my dog after a long week" }],
      outputs: [{ label: "Option 1", value: "Some weeks just need a sunset and a good dog. 🐾🌅" }],
    },
  },
  "hashtag-generator": {
    faq: [
      {
        question: "How many hashtags should I use on Instagram?",
        answer:
          "Instagram allows up to 30 hashtags per post. Using a well-targeted 15-20 (a mix of broad and niche) generally works better than maxing out with overly generic ones.",
      },
      {
        question: "Do hashtags still help with reach?",
        answer:
          "Yes, though their impact has shifted over time — they still help categorize content and can surface a post to people who follow or search those tags, especially niche-specific ones with less competition.",
      },
      {
        question: "Should hashtags go in the caption or the first comment?",
        answer:
          "Either works today — Instagram treats both the same for discovery purposes. Putting them in the first comment just keeps the caption itself cleaner to read.",
      },
      {
        question: "Will the same hashtags work for every post?",
        answer:
          "Reusing a small set of consistent, brand-relevant hashtags is fine, but mixing in post-specific ones (like the ones generated here) helps each individual post reach the right audience.",
      },
      {
        question: "Can I regenerate for a different mix?",
        answer: "Yes — click Regenerate for a fresh set of three hashtag groups any time.",
      },
    ],
    example: {
      title: "Example: a home workout post",
      summary: "Entering a topic generates three hashtag sets:",
      inputs: [{ label: "Post topic", value: "Home workout routine for busy mornings" }],
      outputs: [{ label: "Option 1", value: "#homeworkout #morningworkout #fitnessmotivation #busylife…" }],
    },
  },
  "bio-generator": {
    faq: [
      {
        question: "What's the Instagram bio character limit?",
        answer:
          "150 characters, including spaces and emojis — every generated bio is written to fit within that limit.",
      },
      {
        question: "Should I include emojis in my bio?",
        answer:
          "A few relevant emojis can help break up lines and add personality, but overusing them can make a bio feel cluttered — the generated options use them sparingly as a starting point you can adjust.",
      },
      {
        question: "Should my bio include a call to action?",
        answer:
          "If you have a link, product, or specific next step you want visitors to take, a short direct line (\"Shop below ⬇️\") in your bio can meaningfully increase link clicks.",
      },
      {
        question: "Can I combine parts of different generated bios?",
        answer: "Yes — mix and match freely, or use one option as-is and just personalize the details.",
      },
      {
        question: "Will this include my actual links?",
        answer:
          "No — the bio text is generated based on your description only. Add your actual link(s) separately in the bio link field.",
      },
    ],
    example: {
      title: "Example: a personal trainer's bio",
      summary: "Entering an account description generates three bio options:",
      inputs: [{ label: "Account description", value: "A personal trainer sharing home workouts and healthy recipes" }],
      outputs: [{ label: "Option 1", value: "Personal trainer 💪\nHome workouts + easy healthy recipes\nNew routine every Monday ⬇️" }],
    },
  },
  "username-generator": {
    faq: [
      {
        question: "How do I know if a username is available?",
        answer:
          "This tool generates ideas only — check availability directly in the Instagram app or website before committing to one.",
      },
      {
        question: "What characters can an Instagram username use?",
        answer:
          "Letters, numbers, periods, and underscores only — no spaces or other symbols. Every generated username follows this rule.",
      },
      {
        question: "Should my username match my display name?",
        answer:
          "It doesn't have to, but a username that's close to your display name or niche makes your account easier to find and remember.",
      },
      {
        question: "What if all three options are taken?",
        answer: "Click Regenerate for a fresh set of three, or add a distinguishing word or number to a username you like.",
      },
      {
        question: "Can I use this for a business account?",
        answer: "Yes — describe your brand or niche the same way you would a personal account, and the generated ideas will reflect that.",
      },
    ],
    example: {
      title: "Example: a travel photographer",
      summary: "Entering a name and niche generates three username ideas:",
      inputs: [{ label: "Name or niche", value: "A travel photographer named Alex who focuses on mountains" }],
      outputs: [{ label: "Option 1", value: "alex.climbs" }],
    },
  },
  "reel-caption-generator": {
    faq: [
      {
        question: "How is a Reel caption different from a regular post caption?",
        answer:
          "Reel captions tend to be shorter and punchier, since they're layered over fast-moving video and viewers are scrolling quickly — the hook in the first few words matters even more than in a regular post.",
      },
      {
        question: "Should the caption repeat what's shown on-screen text?",
        answer:
          "It can add context or a hook that isn't obvious from the video alone, rather than just repeating on-screen text word for word.",
      },
      {
        question: "Do Reel captions need hashtags?",
        answer:
          "Not necessarily in the caption itself — many creators add hashtags in the first comment instead to keep the caption short. Use the Hashtag Generator separately if you want a set.",
      },
      {
        question: "Can I use this for Instagram carousels too?",
        answer:
          "It's optimized for the quick, punchy tone Reels need — for a carousel, the regular Caption Generator's slightly longer style is usually a better fit.",
      },
      {
        question: "Can I regenerate for a different tone?",
        answer: "Yes — click Regenerate, or rephrase your input to hint at a different tone (e.g. \"...funny\" or \"...emotional\").",
      },
    ],
    example: {
      title: "Example: a room makeover Reel",
      summary: "Entering what happens in the Reel generates three caption options:",
      inputs: [{ label: "Reel topic", value: "A 15-second before-and-after room makeover" }],
      outputs: [{ label: "Option 1", value: "POV: you finally stopped procrastinating on that spare room 👀" }],
    },
  },
  "post-idea-generator": {
    faq: [
      {
        question: "What if I want ideas for a brand-new account?",
        answer:
          "Describe the general niche or theme you're planning instead of an existing account — the generator works the same way for a fresh start.",
      },
      {
        question: "How specific are the generated ideas?",
        answer:
          "Each idea is framed as a concrete, ready-to-shoot concept with a short execution note, not just a broad topic — so you can move straight to planning the shot.",
      },
      {
        question: "Can I use these for a content calendar?",
        answer: "Yes — generate a few rounds and pick several ideas that work well spread across a week or month.",
      },
      {
        question: "Does this work for Reels and Stories too?",
        answer:
          "The ideas here are post-format-agnostic — pair a generated concept with the Reel Caption or Story Caption generator once you've picked the format.",
      },
      {
        question: "Can I regenerate for more variety?",
        answer: "Yes — click Regenerate for three new ideas any time.",
      },
    ],
    example: {
      title: "Example: a candle business account",
      summary: "Entering your niche generates three specific post concepts:",
      inputs: [{ label: "Account niche", value: "A small-batch candle business" }],
      outputs: [{ label: "Option 1", value: "Behind-the-scenes pour day — film the wax being poured into 3 different scents" }],
    },
  },
  "story-caption-generator": {
    faq: [
      {
        question: "How is a Story caption different from a post caption?",
        answer:
          "Stories disappear after 24 hours and feel more in-the-moment and casual — captions here are meant to feel like a quick update to friends, not a polished post.",
      },
      {
        question: "How short should it be?",
        answer:
          "Very short — a single quick line works best, since Stories are viewed briefly and often with sound off.",
      },
      {
        question: "Can I use this for Story polls or questions?",
        answer:
          "The generated caption works well as the text overlay accompanying a poll, question, or slider sticker — add the interactive sticker separately in the Instagram app.",
      },
      {
        question: "Should I include a call to action?",
        answer: "A short prompt (\"swipe up\", \"DM me\", \"vote above\") can work well if it matches what's actually on the Story.",
      },
      {
        question: "Can I regenerate for a different moment?",
        answer: "Yes — click Regenerate, or update your description if the moment or mood has changed.",
      },
    ],
    example: {
      title: "Example: pop-up shop behind the scenes",
      summary: "Entering what's happening generates three short caption options:",
      inputs: [{ label: "Story moment", value: "Behind the scenes setting up for a weekend pop-up shop" }],
      outputs: [{ label: "Option 1", value: "setup chaos before the calm 🫠" }],
    },
  },
  "quote-generator": {
    faq: [
      {
        question: "Are these quotes original?",
        answer:
          "Yes — each one is generated fresh based on your theme, not pulled from or paraphrasing an existing famous quote.",
      },
      {
        question: "What should I use these for?",
        answer:
          "They work well as text for a quote graphic, a caption on their own, or a starting line you build a longer caption around.",
      },
      {
        question: "Can I attribute these to myself?",
        answer: "Yes — since each quote is generated specifically for your input, you're free to use and share it as your own content.",
      },
      {
        question: "How long is each quote?",
        answer: "Each is a single short sentence, generally under 25 words, so it reads well on a quote graphic without feeling cramped.",
      },
      {
        question: "Can I regenerate for a different angle on the same theme?",
        answer: "Yes — click Regenerate for three new takes on the same theme.",
      },
    ],
    example: {
      title: "Example: a motivation-themed quote",
      summary: "Entering a theme generates three original quotes:",
      inputs: [{ label: "Theme", value: "Staying motivated when starting a new business" }],
      outputs: [{ label: "Option 1", value: "Start before you're ready — readiness is just confidence in disguise." }],
    },
  },
};
