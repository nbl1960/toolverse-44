import type { FaqItem, ToolExample } from "@/lib/types";

export const MIN_TEXT_LENGTH = 1;
export const MAX_TEXT_LENGTH = 1_000;
export const SIZE_OPTIONS = [200, 300, 500, 800];
export const DEFAULT_SIZE = 300;

export const QR_FAQ_ITEMS: FaqItem[] = [
  { question: "How is this QR code actually generated?", answer: "Via a well-established, free public QR generation service (goqr.me), not an encoder built into this page — properly encoding a QR code (error correction, finder patterns) is genuinely complex, and this is the honest, reliable way to produce a real, scannable code rather than an unverified implementation." },
  { question: "Does this work for URLs, WiFi, or plain text?", answer: "Yes for URLs and plain text directly — just paste what you want encoded. WiFi and contact-card QR codes use a specific text format (e.g. WIFI:S:name;T:WPA;P:password;;) which you can paste in directly if you know the format." },
  { question: "Is there a size limit to what I can encode?", answer: "QR codes have a real data capacity limit that varies with the code's size and error-correction level — very long text may fail to encode. Keep it reasonably short (a URL or a few sentences) for reliable results." },
  { question: "Can I use the downloaded QR code commercially?", answer: "Yes — QR codes generated this way are just images encoding your data; there's no licensing restriction on the code itself." },
];

export const QR_EXAMPLE: ToolExample = {
  title: "Example: a QR code for a URL",
  summary: "Entering a URL:",
  inputs: [{ label: "Text", value: "https://example.com" }],
  outputs: [{ label: "Result", value: "A scannable QR code image linking to that URL" }],
};
