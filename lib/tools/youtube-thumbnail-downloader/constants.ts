import type { FaqItem, ToolExample } from "@/lib/types";

export const THUMBNAIL_FAQ_ITEMS: FaqItem[] = [
  {
    question: "What YouTube URL formats are supported?",
    answer:
      "Standard watch URLs (youtube.com/watch?v=...), short links (youtu.be/...), embed links, YouTube Shorts links, and live stream links all work.",
  },
  {
    question: "Why is the max resolution option sometimes missing?",
    answer:
      "YouTube only generates a 1280×720 \"maxresdefault\" thumbnail for videos uploaded in HD. Older or lower-resolution videos may not have one — this tool detects that automatically and hides options that don't exist for a given video.",
  },
  {
    question: "Why did the image open in a new tab instead of downloading directly?",
    answer:
      "Thumbnails are served directly from YouTube's own image servers, not from this site, so your browser controls exactly how the download happens. If it opens in a new tab, right-click (or press and hold on mobile) and choose \"Save image\" to download it.",
  },
  {
    question: "Can I use downloaded thumbnails for my own videos?",
    answer:
      "A video's own thumbnail is intended for referencing or reviewing that specific video — for example, in a reaction video or a compilation. It isn't your artwork to reuse as your own thumbnail; make sure you have the rights to use any image before publishing it.",
  },
];

export const THUMBNAIL_EXAMPLE: ToolExample = {
  title: "Example: pulling a thumbnail from a watch URL",
  summary: "Pasting a standard YouTube watch link:",
  inputs: [{ label: "YouTube URL", value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }],
  outputs: [
    { label: "Video ID", value: "dQw4w9WgXcQ" },
    { label: "Available resolutions", value: "Up to 5, from 120×90 to 1280×720" },
  ],
};
