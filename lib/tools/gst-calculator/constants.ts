import type { FaqItem, ToolExample } from "@/lib/types";
import type { GstMode } from "./types";

export const GST_RATE_OPTIONS = [5, 12, 18, 28];
export const DEFAULT_AMOUNT = 1_000;
export const DEFAULT_RATE = 18;
export const DEFAULT_MODE: GstMode = "add";
export const MAX_AMOUNT = 100_000_000;

export const GST_FAQ_ITEMS: FaqItem[] = [
  { question: "What's the difference between 'Add GST' and 'Remove GST'?", answer: "Add GST treats your entered amount as the pre-tax price and calculates the tax on top of it. Remove GST treats your entered amount as the final, tax-inclusive price and works backward to find the original pre-tax amount." },
  { question: "What are the standard GST rates in India?", answer: "5%, 12%, 18%, and 28% are the standard slabs, though exact rates depend on the specific goods or services — check the applicable rate for your item if you're unsure." },
  { question: "What are CGST and SGST?", answer: "For a transaction within the same state, GST is split evenly between Central GST (CGST) and State GST (SGST) — each is exactly half of the total GST amount shown here." },
  { question: "Is this calculation exact for tax filing purposes?", answer: "The math is standard and correct, but always confirm the applicable rate and any rounding rules with a tax professional or official source before using figures for filing." },
];

export const GST_EXAMPLE: ToolExample = {
  title: "Example: adding 18% GST to ₹1,000",
  summary: "Entering an amount with Add GST mode:",
  inputs: [{ label: "Amount", value: "₹1,000" }, { label: "Rate", value: "18%" }],
  outputs: [
    { label: "GST amount", value: "₹180" },
    { label: "Total amount", value: "₹1,180" },
  ],
};
