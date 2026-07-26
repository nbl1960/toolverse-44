import type { FaqItem, ToolExample } from "@/lib/types";

export const MIN_NOTES_LENGTH = 30;
export const MAX_NOTES_LENGTH = 10_000;

export const MEETING_SUMMARY_FAQ_ITEMS: FaqItem[] = [
  { question: "What kind of notes work best?", answer: "Raw, messy notes or a rough transcript both work — the tool is designed to find structure in unpolished input, not require it to already be organized." },
  { question: "Does this send my meeting notes to a server?", answer: "Yes, briefly — the text is sent to Google's Gemini API to generate the summary, then discarded. It is not stored or logged by this application. Avoid pasting anything highly sensitive." },
  { question: "What if my notes don't have clear action items?", answer: "The tool only lists decisions and action items it can actually identify — if none are present, those sections may come back short or empty rather than inventing items that weren't discussed." },
  { question: "Can I regenerate for a different summary?", answer: "Yes — click Regenerate for a fresh pass at the same notes." },
];

export const MEETING_SUMMARY_EXAMPLE: ToolExample = {
  title: "Example: summarizing a planning meeting",
  summary: "Pasting rough meeting notes:",
  inputs: [{ label: "Notes", value: "talked about q3 roadmap, sarah will own the new onboarding flow, need design review by friday, mike raised concern about timeline, decided to push launch to october" }],
  outputs: [
    { label: "Summary", value: "The team discussed the Q3 roadmap and adjusted the launch timeline." },
    { label: "Decisions", value: "Launch pushed to October" },
    { label: "Action items", value: "Sarah to own the new onboarding flow; design review due Friday" },
  ],
};
