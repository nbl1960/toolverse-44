import type { FaqItem, ToolExample } from "@/lib/types";
import type { FacebookGeneratorType } from "./types";

interface GeneratorContent {
  faq: FaqItem[];
  example: ToolExample;
}

export const FACEBOOK_GENERATOR_CONTENT: Record<FacebookGeneratorType, GeneratorContent> = {
  "caption-generator": {
    faq: [
      { question: "How is this different from a Facebook post?", answer: "A caption is the shorter text that accompanies a photo or video — a post can be text-only and longer. Use the Post Generator for a standalone update instead." },
      { question: "Should I include a call to action?", answer: "A light prompt (a question, a tag-a-friend line) tends to increase comments, which helps a post's reach in Facebook's feed algorithm." },
      { question: "Can I edit the generated caption?", answer: "Yes — treat it as a strong starting draft and personalize the details." },
      { question: "Can I regenerate if none of the three fit?", answer: "Yes — click Regenerate for three new caption options." },
    ],
    example: {
      title: "Example: a volunteer day photo",
      summary: "Entering a short description generates three caption options:",
      inputs: [{ label: "Photo description", value: "A photo from our team's weekend volunteer day at the community garden" }],
      outputs: [{ label: "Option 1", value: "Traded desks for dirt this weekend. Proud of this team for showing up for the community garden. 🌱" }],
    },
  },
  "post-generator": {
    faq: [
      { question: "How long should a Facebook post be?", answer: "There's more room than on X — 60-150 words tends to read well without losing people, especially with a strong opening line." },
      { question: "Should I add a photo?", answer: "Posts with an image generally get more engagement than text-only posts — pair the generated text with a relevant photo where you can." },
      { question: "Can I use this for a Page instead of a personal profile?", answer: "Yes — the tone generated works for either; adjust the voice slightly if your Page has a more formal brand tone." },
      { question: "Can I regenerate for a different angle?", answer: "Yes — click Regenerate for three new drafts on the same topic." },
    ],
    example: {
      title: "Example: announcing new store hours",
      summary: "Entering the topic generates three post drafts:",
      inputs: [{ label: "Topic", value: "Announcing our store's new weekend hours" }],
      outputs: [{ label: "Option 1", value: "Big news for weekend shoppers — we're now open Saturdays AND Sundays starting this week!…" }],
    },
  },
  "bio-generator": {
    faq: [
      { question: "What's the Facebook Page bio limit?", answer: "255 characters — every generated bio is written to fit within that limit." },
      { question: "Should my Page bio include a call to action?", answer: "A short direct line can help if you have a specific goal (visit the website, call, book) — otherwise a clear description of what you offer works well on its own." },
      { question: "Can I use this for a personal profile bio too?", answer: "Yes — describe yourself instead of your business, and the same short, clear style applies." },
      { question: "Can I regenerate for a different tone?", answer: "Yes — click Regenerate for three new bio options." },
    ],
    example: {
      title: "Example: a family-owned restaurant",
      summary: "Entering a description generates three bio options:",
      inputs: [{ label: "Page description", value: "A family-owned Italian restaurant open for 20 years" }],
      outputs: [{ label: "Option 1", value: "Family-owned, family-run, family recipes — serving the neighborhood since day one. 🍝" }],
    },
  },
  "ad-copy-generator": {
    faq: [
      { question: "How long should Facebook ad primary text be?", answer: "Facebook can truncate longer text behind a 'See more' link, so the generated copy is written to make its point within the first couple of lines." },
      { question: "Does this include the headline too?", answer: "No — use the Headline Generator separately for the short bold text shown above the primary text." },
      { question: "Can I use this for organic (non-paid) posts too?", answer: "It's written with a persuasive, offer-focused angle suited to ads — for a regular update, the Post Generator is a better fit." },
      { question: "Can I regenerate for a different offer emphasis?", answer: "Yes — click Regenerate, or adjust your input to highlight a different part of the offer." },
    ],
    example: {
      title: "Example: a candle sale ad",
      summary: "Entering the offer generates three ad copy options:",
      inputs: [{ label: "Offer", value: "A 20%-off sale on handmade candles, ending Sunday" }],
      outputs: [{ label: "Option 1", value: "20% off all handmade candles — but only until Sunday. Hand-poured, small batch, gone once they're gone." }],
    },
  },
  "headline-generator": {
    faq: [
      { question: "How long is a Facebook ad headline?", answer: "Around 40 characters is the safe zone before truncation — every generated headline is written to fit." },
      { question: "How is this different from the ad copy?", answer: "The headline is the short bold text above the primary text — the ad copy is the longer body text below it. Use both together." },
      { question: "Can I regenerate for a shorter or punchier version?", answer: "Yes — click Regenerate for three new headline options." },
      { question: "Should the headline restate the ad copy?", answer: "No — it works best as a distinct, punchy hook, with the ad copy providing the supporting detail." },
    ],
    example: {
      title: "Example: a meal planning app trial",
      summary: "Entering the offer generates three headline options:",
      inputs: [{ label: "Offer", value: "A free 7-day trial for a meal planning app" }],
      outputs: [{ label: "Option 1", value: "Meal planning, solved. Free for 7 days." }],
    },
  },
  "cta-generator": {
    faq: [
      { question: "Where do I use this?", answer: "As the closing line of a post or ad, right before (or alongside) the actual button/link — it primes the specific action you want taken." },
      { question: "Should this match Facebook's built-in CTA buttons?", answer: "It can complement a built-in button (like 'Sign Up' or 'Learn More') with a more specific, persuasive line rather than replacing it." },
      { question: "Can I regenerate for a softer or more direct tone?", answer: "Yes — click Regenerate, or rephrase your input to hint at the tone you want." },
      { question: "Should every post end with a CTA?", answer: "Not necessarily — save a strong CTA for posts where you actually want a specific action, so it doesn't lose impact from overuse." },
    ],
    example: {
      title: "Example: booking a consultation",
      summary: "Entering the desired action generates three CTA options:",
      inputs: [{ label: "Desired action", value: "Sign up for a free consultation call" }],
      outputs: [{ label: "Option 1", value: "Grab a free 15-minute call — no pressure, just answers." }],
    },
  },
  "comment-generator": {
    faq: [
      { question: "What should I include in my input?", answer: "Briefly describe the post you're commenting on and what you want to say — the more context, the more natural and specific the comment." },
      { question: "Should a comment sound formal?", answer: "No — Facebook comments read best as casual and conversational, which is the tone the generated options aim for." },
      { question: "Can I use this for a business Page's comments?", answer: "Yes — describe the context and it'll generate a comment in that conversational register, which you can adjust for brand tone." },
      { question: "Can I regenerate for a different angle?", answer: "Yes — click Regenerate for three new comment options." },
    ],
    example: {
      title: "Example: replying in a local group",
      summary: "Entering the context generates three comment options:",
      inputs: [{ label: "Context", value: "Replying to a post in a local business group asking for restaurant recommendations" }],
      outputs: [{ label: "Option 1", value: "If you haven't tried the taco place on 5th, go now — cash only but worth the ATM trip." }],
    },
  },
  "event-description-generator": {
    faq: [
      { question: "What details should I include in my input?", answer: "What the event is, who it's for, and any key logistics (recurring, free, location type) — the more specific, the more useful the draft." },
      { question: "Does this include date and time?", answer: "No — add the actual date, time, and location using Facebook Events' own fields; the generated text focuses on the description itself." },
      { question: "Can I regenerate for a different tone?", answer: "Yes — click Regenerate, or rephrase your input for a more formal or more casual tone." },
      { question: "Can I use this for a recurring event?", answer: "Yes — mention that it's recurring in your input (e.g. 'every Saturday') and the description will reflect that." },
    ],
    example: {
      title: "Example: a weekly yoga class",
      summary: "Entering the event details generates three description options:",
      inputs: [{ label: "Event", value: "A free community yoga class in the park every Saturday morning" }],
      outputs: [{ label: "Option 1", value: "Roll out your mat and join us — every Saturday morning, rain or shine (well, mostly shine). No experience needed, completely free…" }],
    },
  },
  "group-description-generator": {
    faq: [
      { question: "What makes a good group description?", answer: "Clarity about who the group is for and what members can expect — it helps the right people join and sets expectations upfront." },
      { question: "Should I include rules in the description?", answer: "A brief mention of tone or expectations can help, though detailed rules are usually better placed in the Group Rules section Facebook provides separately." },
      { question: "Can I regenerate for a different tone?", answer: "Yes — click Regenerate, or rephrase your input for a warmer or more formal tone." },
      { question: "Can I use this for a private or closed group?", answer: "Yes — the description works the same regardless of the group's privacy setting." },
    ],
    example: {
      title: "Example: a new-parents support group",
      summary: "Entering the group's purpose generates three description options:",
      inputs: [{ label: "Group purpose", value: "A support group for new parents in the Denver area" }],
      outputs: [{ label: "Option 1", value: "A space for Denver-area parents navigating the (wonderful, exhausting) first years. Ask questions, vent, swap recommendations — no judgment, ever…" }],
    },
  },
  "hashtag-generator": {
    faq: [
      { question: "How many hashtags should I use on Facebook?", answer: "Facebook posts tend to perform best with just a few relevant hashtags rather than a long list, which is why the generated sets stay short." },
      { question: "Do hashtags matter as much on Facebook as Instagram?", answer: "Less so — Facebook's discovery relies less on hashtag browsing, but a couple of relevant ones can still help categorize your post." },
      { question: "Where should hashtags go?", answer: "Anywhere in the post text — at the end is most common and keeps the main text easy to read." },
      { question: "Can I regenerate for a different set?", answer: "Yes — click Regenerate for three new hashtag sets." },
    ],
    example: {
      title: "Example: a first pop-up shop",
      summary: "Entering the topic generates three hashtag sets:",
      inputs: [{ label: "Topic", value: "A small business's first pop-up shop event" }],
      outputs: [{ label: "Option 1", value: "#smallbusiness #popupshop #shoplocal" }],
    },
  },
};
