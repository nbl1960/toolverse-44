import {
  Briefcase,
  Heart,
  Scale,
  Coffee,
  Megaphone,
  HandHeart,
  Sparkles,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import type { EmailTone, ToneOption, LengthOption } from "./types";
import type { FaqItem } from "@/lib/types";

export const TONE_OPTIONS: ToneOption[] = [
  {
    value: "professional",
    label: "Professional",
    description: "Polished and business-appropriate",
  },
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm, approachable, easygoing",
  },
  {
    value: "formal",
    label: "Formal",
    description: "Reserved, precise, traditional",
  },
  {
    value: "casual",
    label: "Casual",
    description: "Relaxed, conversational",
  },
  {
    value: "persuasive",
    label: "Persuasive",
    description: "Confident and compelling",
  },
  {
    value: "apology",
    label: "Apology",
    description: "Sincere and accountable",
  },
  {
    value: "thank-you",
    label: "Thank You",
    description: "Grateful and genuine",
  },
  {
    value: "follow-up",
    label: "Follow-up",
    description: "Direct and courteous nudge",
  },
];

export const TONE_ICONS: Record<EmailTone, LucideIcon> = {
  professional: Briefcase,
  friendly: Heart,
  formal: Scale,
  casual: Coffee,
  persuasive: Megaphone,
  apology: HandHeart,
  "thank-you": Sparkles,
  "follow-up": RefreshCw,
};

export const LENGTH_OPTIONS: LengthOption[] = [
  {
    value: "short",
    label: "Short",
    description: "Quick and to the point",
    wordRange: "~60-90 words",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Balanced detail",
    wordRange: "~120-180 words",
  },
  {
    value: "long",
    label: "Long",
    description: "Thorough and detailed",
    wordRange: "~220-320 words",
  },
];

export const MAX_TOPIC_LENGTH = 500;
export const MAX_NAME_LENGTH = 100;

export const EMAIL_WRITER_FAQ_ITEMS: FaqItem[] = [
  {
    question: "How much detail should I put in my description?",
    answer:
      "As much as you have — specific names, the situation, and what outcome you want all sharpen the draft. A one-line prompt still works, but a few sentences of real context consistently produces a better first draft.",
  },
  {
    question: "Can I edit the generated email before sending it?",
    answer:
      "Yes — treat it as a strong starting draft. Swap in specific details only you'd know, and adjust anything that doesn't quite match your voice before sending.",
  },
  {
    question: "Does the tone actually change the wording, or just add a greeting?",
    answer:
      "It changes the actual phrasing and structure — a Formal draft and a Casual draft on the same topic will read as genuinely different emails, not the same text with a different sign-off.",
  },
  {
    question: "Can I regenerate if the first draft isn't quite right?",
    answer: "Yes — click Regenerate for a fresh draft on the same topic, tone, and length, or adjust any of the three and try again.",
  },
];
