import type { FaqItem, ToolExample } from "@/lib/types";
import type { SchemaType } from "./types";

export const SCHEMA_TYPE_OPTIONS: SchemaType[] = ["Article", "Product", "LocalBusiness", "Person", "Organization"];
export const DEFAULT_SCHEMA_TYPE: SchemaType = "Article";

export const SCHEMA_FAQ_ITEMS: FaqItem[] = [
  { question: "Where does this JSON-LD go?", answer: "Inside a <script type=\"application/ld+json\"> tag, typically in the <head> or anywhere in the <body> of the page it describes." },
  { question: "Does structured data guarantee rich results in search?", answer: "No — it makes your page eligible for rich results (like star ratings or article cards), but search engines decide whether and how to display them, and eligibility isn't guaranteed." },
  { question: "Can I combine multiple schema types on one page?", answer: "Yes — a page can have multiple JSON-LD blocks (e.g. an Article and an Organization for the publisher) as separate <script> tags." },
  { question: "How do I check if my structured data is valid?", answer: "Google's Rich Results Test and the Schema.org validator are the standard tools for checking that generated JSON-LD is both valid and eligible for rich results." },
];

export const SCHEMA_EXAMPLE: ToolExample = {
  title: "Example: an Article schema",
  summary: "Entering an article's details:",
  inputs: [{ label: "Type", value: "Article" }, { label: "Name", value: "7 Best Budget Mechanical Keyboards" }],
  outputs: [{ label: "Output", value: '{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "7 Best Budget Mechanical Keyboards"\n}' }],
};
