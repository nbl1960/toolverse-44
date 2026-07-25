import type { FaqItem, ToolExample } from "@/lib/types";
import type { TwitterGeneratorType } from "./types";

interface GeneratorContent {
  faq: FaqItem[];
  example: ToolExample;
}

export const TWITTER_GENERATOR_CONTENT: Record<TwitterGeneratorType, GeneratorContent> = {
  "tweet-generator": {
    faq: [
      { question: "What's the X character limit?", answer: "280 characters for most accounts. Every generated tweet is written to fit within that limit." },
      { question: "Should I add hashtags to every tweet?", answer: "Not necessarily — X posts often perform better as clean, direct text. Use the Hashtag Generator separately when a post genuinely benefits from one or two." },
      { question: "Can I edit the generated tweet?", answer: "Yes — treat it as a strong draft and adjust the wording to match your voice." },
      { question: "Can I regenerate for a different angle?", answer: "Yes — click Regenerate for three new options on the same topic." },
    ],
    example: {
      title: "Example: a notebook vs. app observation",
      summary: "Entering a topic generates three tweet options:",
      inputs: [{ label: "Topic", value: "Why I switched from a to-do list app to just using a notebook" }],
      outputs: [{ label: "Option 1", value: "Switched my to-do list from an app to a notebook. Nothing to sync, nothing to notify me, nothing to abandon after 3 days." }],
    },
  },
  "viral-tweet-generator": {
    faq: [
      { question: "What makes this different from the regular Tweet Generator?", answer: "This style leans into a bolder hook and a sharper, more confident take, structured specifically for engagement — the regular generator is more general-purpose." },
      { question: "Will this guarantee my tweet goes viral?", answer: "No tool can guarantee that — X's algorithm and audience response involve too many variables. This generates content structured around patterns that tend to drive engagement, not a guarantee." },
      { question: "Should a bold take be something I don't actually believe?", answer: "No — use this for genuine opinions stated more confidently and specifically, not manufactured controversy you don't mean." },
      { question: "Can I regenerate for a bolder or softer take?", answer: "Yes — click Regenerate, or rephrase your input to hint at how strong you want the take to be." },
    ],
    example: {
      title: "Example: a productivity-advice take",
      summary: "Entering a topic generates three bold, hook-heavy options:",
      inputs: [{ label: "Topic", value: "Most productivity advice makes people less productive" }],
      outputs: [{ label: "Option 1", value: "Unpopular opinion: most productivity systems are just procrastination with extra steps." }],
    },
  },
  "thread-generator": {
    faq: [
      { question: "How many tweets should a thread have?", answer: "There's no fixed rule, but 5-8 tweets is a common range — long enough to deliver real value, short enough that people finish reading." },
      { question: "How important is the first tweet?", answer: "Extremely — it's the only part shown before someone taps to expand the thread, so it needs to earn the click on its own." },
      { question: "Can I post these as separate tweets?", answer: "Yes — the generated thread is formatted with each tweet numbered and separated, ready to post one at a time or with a thread-scheduling tool." },
      { question: "Can I regenerate for a different structure?", answer: "Yes — click Regenerate for a new thread outline on the same topic." },
    ],
    example: {
      title: "Example: lessons from running a small business",
      summary: "Entering a topic generates three thread outlines:",
      inputs: [{ label: "Topic", value: "5 lessons from my first year running a small business" }],
      outputs: [{ label: "Option 1", value: "1/ A year ago I quit my job to start a business. Here's what actually surprised me.\\n\\n2/ Lesson one: cash flow kills more businesses than bad ideas do…" }],
    },
  },
  "bio-generator": {
    faq: [
      { question: "What's the X bio character limit?", answer: "160 characters — every generated bio is written to fit within that limit." },
      { question: "Should I use emojis in my bio?", answer: "A few can add personality and help break up the text, but the generated options use them sparingly as a starting point." },
      { question: "Can I combine parts of different generated bios?", answer: "Yes — mix and match freely, or use one as-is." },
      { question: "Will this include my links?", answer: "No — add your actual link(s) separately in your profile's link field." },
    ],
    example: {
      title: "Example: an indie hacker's bio",
      summary: "Entering an account description generates three bio options:",
      inputs: [{ label: "Account description", value: "Indie hacker building small profitable software products" }],
      outputs: [{ label: "Option 1", value: "Building small software products that pay for themselves. Currently: a habit tracker nobody asked for but 400 people pay for." }],
    },
  },
  "username-generator": {
    faq: [
      { question: "How do I know if a handle is available?", answer: "This generates ideas only — check availability directly on X before committing to one." },
      { question: "What characters can an X handle use?", answer: "Letters, numbers, and underscores only, up to 15 characters — every generated handle follows this rule." },
      { question: "Should my handle match my display name?", answer: "It doesn't have to, but staying close to your display name or niche makes your account easier to find." },
      { question: "Can I regenerate for more options?", answer: "Yes — click Regenerate for a fresh set of three." },
    ],
    example: {
      title: "Example: a Rust developer",
      summary: "Entering a name and niche generates three handle ideas:",
      inputs: [{ label: "Name or niche", value: "A developer named Sam who posts about Rust and systems programming" }],
      outputs: [{ label: "Option 1", value: "sam_builds_rust" }],
    },
  },
  "hashtag-generator": {
    faq: [
      { question: "How many hashtags should I use on X?", answer: "Fewer than other platforms — 1-3 well-targeted hashtags tends to outperform a longer list, which is why the generated sets are intentionally short." },
      { question: "Do hashtags help on X the way they do elsewhere?", answer: "Less than on Instagram — X's discovery leans more on engagement and search than hashtag browsing, so use them sparingly and only when genuinely relevant." },
      { question: "Where should hashtags go in the tweet?", answer: "Anywhere natural — many strong tweets work them into the sentence itself rather than tacking them on at the end." },
      { question: "Can I regenerate for a different set?", answer: "Yes — click Regenerate for three new hashtag sets." },
    ],
    example: {
      title: "Example: launching an open-source tool",
      summary: "Entering a topic generates three hashtag sets:",
      inputs: [{ label: "Topic", value: "Launching a new open-source CLI tool" }],
      outputs: [{ label: "Option 1", value: "#buildinpublic #opensource #devtools" }],
    },
  },
  "hook-generator": {
    faq: [
      { question: "Where do I use this hook?", answer: "As the opening line of a standalone tweet or the first tweet of a thread — anywhere the very first words need to earn attention." },
      { question: "How short should a hook be?", answer: "Shorter is usually stronger — every generated hook stays under 100 characters so it reads instantly." },
      { question: "Should the hook give away the whole point?", answer: "No — a good hook creates curiosity or states a claim without fully resolving it, giving someone a reason to keep reading." },
      { question: "Can I regenerate for a different style of hook?", answer: "Yes — click Regenerate, or rephrase your input to hint at a bolder or more curious angle." },
    ],
    example: {
      title: "Example: a self-taught coding story",
      summary: "Entering the topic generates three hook options:",
      inputs: [{ label: "Topic", value: "A thread about how I taught myself to code in 6 months" }],
      outputs: [{ label: "Option 1", value: "I taught myself to code in 6 months with no CS degree. Here's exactly what I'd do differently." }],
    },
  },
  "poll-generator": {
    faq: [
      { question: "How many options can an X poll have?", answer: "2 to 4 options — every generated poll fits within that range, with each option kept short." },
      { question: "How long should the poll question be?", answer: "Short and unambiguous — a clear either/or or multiple-choice question tends to get more responses than a nuanced one." },
      { question: "Can I edit the options?", answer: "Yes — treat the generated poll as a strong starting draft." },
      { question: "Can I regenerate for different options?", answer: "Yes — click Regenerate for a new poll on the same topic." },
    ],
    example: {
      title: "Example: a productivity methods poll",
      summary: "Entering a topic generates three poll options:",
      inputs: [{ label: "Topic", value: "Which productivity method actually works for people" }],
      outputs: [{ label: "Option 1", value: "What actually works for you?\\n- To-do lists\\n- Time blocking\\n- Just winging it\\n- Nothing works" }],
    },
  },
  "reply-generator": {
    faq: [
      { question: "What should I include in my input?", answer: "Briefly describe what the original post said and the angle or experience you want to add — the more context, the more specific the reply." },
      { question: "Should a reply just agree with the post?", answer: "A reply that adds a genuine perspective, question, or experience tends to stand out more than simple agreement." },
      { question: "What's the character limit?", answer: "280 characters, same as a standalone tweet — every generated reply fits within that limit." },
      { question: "Can I regenerate for a different tone?", answer: "Yes — click Regenerate, or rephrase your input to hint at a different tone." },
    ],
    example: {
      title: "Example: replying about remote work",
      summary: "Entering the context generates three reply options:",
      inputs: [{ label: "Context", value: "Replying to a post about remote work with my experience managing a distributed team" }],
      outputs: [{ label: "Option 1", value: "Managed a fully distributed team for 3 years — the real unlock wasn't tools, it was writing things down instead of assuming everyone was in the same meeting." }],
    },
  },
  "content-calendar": {
    faq: [
      { question: "Does this post automatically?", answer: "No — it generates the ideas only. Post them yourself or paste them into your scheduling tool of choice." },
      { question: "Can I use this for a different number of days?", answer: "It generates a 7-day calendar by default — use as many or as few of the days as fit your posting schedule." },
      { question: "Will the ideas repeat week to week?", answer: "Each generation is fresh — regenerate for a new week's worth of ideas whenever you're ready to plan the next one." },
      { question: "Can I regenerate for different content formats?", answer: "Yes — click Regenerate, or rephrase your input to emphasize the formats you prefer (threads, polls, questions, etc.)." },
    ],
    example: {
      title: "Example: a freelancer finance newsletter",
      summary: "Entering your niche generates three weekly calendar options:",
      inputs: [{ label: "Niche", value: "A newsletter about personal finance for freelancers" }],
      outputs: [{ label: "Option 1", value: "Day 1: Poll — how do you set aside money for taxes?\\nDay 2: A mistake I made with quarterly taxes my first year freelancing…" }],
    },
  },
};
