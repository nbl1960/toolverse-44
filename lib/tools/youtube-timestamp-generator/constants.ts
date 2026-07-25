import type { FaqItem, ToolExample } from "@/lib/types";

export const DEFAULT_CHAPTERS_INPUT = `Intro | 0:45
Main topic | 3:30
Tips and tricks | 2:15
Outro | 0:30`;

export const TIMESTAMP_FAQ_ITEMS: FaqItem[] = [
  {
    question: "What format should I use for each line?",
    answer:
      "One chapter per line, in the format \"Chapter Title | duration\", where duration is how long that section runs — not its start time. For example \"Intro | 0:45\" means the intro lasts 45 seconds. The tool adds up the durations to calculate each chapter's actual start time in the video.",
  },
  {
    question: "Can I use hours in the duration?",
    answer:
      "Yes — use h:mm:ss format for a section longer than an hour, e.g. \"Deep dive | 1:15:00\". Shorter sections can just use m:ss, like \"2:30\".",
  },
  {
    question: "Where do I paste the result?",
    answer:
      "Paste the generated timestamps directly into your YouTube video description. YouTube automatically turns lines starting with a timestamp (like \"0:00 Intro\") into clickable chapter markers, as long as the first line starts at 0:00 and you have at least three timestamps.",
  },
  {
    question: "What happens if a line is formatted incorrectly?",
    answer:
      "Lines that don't match the \"Title | duration\" format are skipped automatically, so a typo on one line won't block the rest — just check the result to make sure every chapter you expected shows up.",
  },
];

export const TIMESTAMP_EXAMPLE: ToolExample = {
  title: "Example: a 4-chapter tutorial video",
  summary: "Entering four chapters with their individual lengths:",
  inputs: [
    { label: "Intro", value: "0:45" },
    { label: "Main topic", value: "3:30" },
    { label: "Tips and tricks", value: "2:15" },
    { label: "Outro", value: "0:30" },
  ],
  outputs: [
    { label: "0:00", value: "Intro" },
    { label: "0:45", value: "Main topic" },
    { label: "4:15", value: "Tips and tricks" },
    { label: "6:30", value: "Outro" },
  ],
};
