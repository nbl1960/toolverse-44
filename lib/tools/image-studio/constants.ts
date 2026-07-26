import type { FaqItem, ToolExample } from "@/lib/types";

/** Shared FAQ/example content for the Canvas-based Image Studio tools — grouped here since they share one implementation. */

export const IMAGE_PRIVACY_NOTE: FaqItem = {
  question: "Does this upload my image to a server?",
  answer: "No — every step (decoding, resizing, re-encoding) happens entirely in your browser using the Canvas API. Your image is never uploaded anywhere.",
};

export const COMPRESSOR_FAQ_ITEMS: FaqItem[] = [
  { question: "How does the quality slider work?", answer: "It controls JPEG compression quality (0-100) — lower values produce a smaller file at the cost of more visible compression artifacts. 70-85 is a reasonable starting point for most photos." },
  { question: "Why does the output become a JPEG even if I upload a PNG?", answer: "JPEG's lossy compression is what actually reduces file size for photos — PNG is lossless, so re-saving as PNG wouldn't meaningfully shrink it. Use the PNG↔JPG converters directly if you specifically need to keep a PNG." },
  { question: "How much smaller will my file get?", answer: "It depends heavily on the source image and quality setting — the result panel shows the exact percentage reduction for your specific file." },
  IMAGE_PRIVACY_NOTE,
];

export const RESIZER_FAQ_ITEMS: FaqItem[] = [
  { question: "Does resizing maintain the aspect ratio?", answer: "Not automatically — width and height are set independently, so enter values that match your original image's proportions if you want to avoid stretching or squashing." },
  { question: "Can I make an image larger, not just smaller?", answer: "Yes, though enlarging a raster image beyond its original resolution won't add real detail — it will look softer than a genuinely higher-resolution source." },
  { question: "What format is the resized image saved as?", answer: "PNG, to preserve quality without introducing compression artifacts on top of the resize." },
  IMAGE_PRIVACY_NOTE,
];

export const PNG_TO_JPG_FAQ_ITEMS: FaqItem[] = [
  { question: "What happens to transparency?", answer: "JPEG doesn't support transparency, so any transparent areas in your PNG are filled with a solid background (typically white) when converted." },
  { question: "Will this reduce my file size?", answer: "Usually, yes — JPEG's lossy compression is generally more space-efficient for photos than PNG, though very simple graphics (logos, screenshots with text) can sometimes end up larger." },
  { question: "Can I control the JPEG quality?", answer: "Yes — use the quality slider to balance file size against visual quality." },
  IMAGE_PRIVACY_NOTE,
];

export const JPG_TO_PNG_FAQ_ITEMS: FaqItem[] = [
  { question: "Why convert JPG to PNG?", answer: "PNG is lossless, so it's useful when you need to edit an image further without compounding compression artifacts, or when you need transparency support going forward." },
  { question: "Will this add transparency to my JPEG?", answer: "No — a JPEG has no transparency data to begin with, so the converted PNG will still have a solid background; converting formats can't recover information that was never there." },
  { question: "Will the file size change?", answer: "PNG is generally larger than JPEG for photographic images, since it doesn't use lossy compression — expect the converted file to be bigger, not smaller." },
  IMAGE_PRIVACY_NOTE,
];

export const WEBP_FAQ_ITEMS: FaqItem[] = [
  { question: "Why convert to WebP?", answer: "WebP typically produces smaller files than JPEG or PNG at comparable visual quality, which is why it's widely used for web images — faster page loads with less visible quality loss." },
  { question: "Do all browsers support WebP?", answer: "All current major browsers do. If you need to support very old browser versions, keep a JPEG/PNG fallback available." },
  { question: "Can I control the WebP quality?", answer: "Yes — use the quality slider, the same way as the JPEG-based tools." },
  IMAGE_PRIVACY_NOTE,
];

export const COMPRESSOR_EXAMPLE: ToolExample = {
  title: "Example: compressing a photo",
  summary: "Uploading an image with quality set to 75%:",
  inputs: [{ label: "Quality", value: "75%" }],
  outputs: [{ label: "Result", value: "The same image, typically 40-70% smaller depending on content" }],
};

export const RESIZER_EXAMPLE: ToolExample = {
  title: "Example: resizing for a thumbnail",
  summary: "Uploading a large photo and setting new dimensions:",
  inputs: [{ label: "Width", value: "400" }, { label: "Height", value: "400" }],
  outputs: [{ label: "Result", value: "A 400×400px version of the image, ready to download" }],
};

export const PNG_TO_JPG_EXAMPLE: ToolExample = {
  title: "Example: converting a screenshot",
  summary: "Uploading a PNG file:",
  inputs: [{ label: "File", value: "screenshot.png" }],
  outputs: [{ label: "Result", value: "screenshot.jpg, typically smaller in file size" }],
};

export const JPG_TO_PNG_EXAMPLE: ToolExample = {
  title: "Example: converting a photo for editing",
  summary: "Uploading a JPG file:",
  inputs: [{ label: "File", value: "photo.jpg" }],
  outputs: [{ label: "Result", value: "photo.png, lossless and ready for further editing" }],
};

export const WEBP_EXAMPLE: ToolExample = {
  title: "Example: converting for faster web loading",
  summary: "Uploading a JPG or PNG file:",
  inputs: [{ label: "File", value: "hero-image.jpg" }],
  outputs: [{ label: "Result", value: "hero-image.webp, typically smaller than the original" }],
};
