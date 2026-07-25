import type { FaqItem, ToolExample } from "@/lib/types";

export const DEFAULT_FAQ_INPUT = `Q: What is your return policy?
A: We accept returns within 30 days of purchase, no questions asked.

Q: Do you ship internationally?
A: Yes, we ship to over 40 countries with rates calculated at checkout.`;

export const FAQ_SCHEMA_FAQ_ITEMS: FaqItem[] = [
  { question: "What format should I use?", answer: "One Q&A pair per block, each starting with \"Q:\" and \"A:\" on their own lines, separated by a blank line between pairs — see the placeholder text for the exact format." },
  { question: "Does FAQ schema guarantee a rich result in search?", answer: "No — it makes your page eligible for the FAQ rich result, but Google decides whether to display it, and eligibility has narrowed over time to mostly well-known, authoritative sites for many query types." },
  { question: "Can I use this alongside a visible FAQ section on the page?", answer: "Yes — in fact the questions and answers in your JSON-LD should match content that's actually visible on the page, not hidden text only meant for search engines." },
  { question: "How many questions can I include?", answer: "There's no hard limit in the schema itself, but keep it to genuinely relevant questions — padding with low-value questions can hurt rather than help." },
];

export const FAQ_SCHEMA_EXAMPLE: ToolExample = {
  title: "Example: a return policy FAQ",
  summary: "Entering one Q&A pair:",
  inputs: [{ label: "Input", value: "Q: What is your return policy?\nA: 30 days, no questions asked." }],
  outputs: [{ label: "Output", value: 'A valid FAQPage JSON-LD block with one "Question" entity' }],
};
