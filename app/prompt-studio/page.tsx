import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Library, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { Faq } from "@/components/shared/faq";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/structured-data";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";
import type { FaqItem } from "@/lib/types";

// Both are interactive-only client components with no SEO-relevant
// static content of their own (the page's own text/headings/FAQ carry
// that) — code-splitting keeps their JS out of the initial bundle.
const PromptStudio = dynamic(() => import("@/components/shared/prompt-studio").then((m) => ({ default: m.PromptStudio })));
const PromptHistoryPanel = dynamic(() =>
  import("@/components/shared/prompt-history-panel").then((m) => ({ default: m.PromptHistoryPanel }))
);

export const metadata: Metadata = buildMetadata({
  title: "Prompt Studio",
  description: `Turn a simple request into a professional, structured prompt optimized for ChatGPT, Claude, Gemini, Grok, Perplexity, DeepSeek, Qwen, Midjourney, or DALL·E — plus a prompt quality analyzer, all free on ${SITE_NAME}.`,
  path: "/prompt-studio",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What does the Prompt Engine actually do?",
    answer:
      "It takes a rough, plain-language request and rewrites it into a structured prompt following the real conventions of whichever AI model you're targeting — chat models get role, context, task, and format structure; image models get the terser, visually-descriptive style they actually respond to.",
  },
  {
    question: "How is the Prompt Analyzer's score calculated?",
    answer:
      "It's a deterministic checklist of established prompt-engineering practices — role definition, a specific task, context, output format, constraints, examples, and length — not an AI-generated number. The same prompt always scores the same way, and every point is explained.",
  },
  {
    question: "Is my prompt history private?",
    answer: "Yes — it's stored only in your browser's local storage on this device, never sent to or stored on a server.",
  },
  {
    question: "Can I use the Prompt Library templates as-is?",
    answer: "Yes — every template is written to be copied, have its bracketed placeholder filled in, and used immediately.",
  },
];

export default function PromptStudioPage() {
  return (
    <div className="container py-8 sm:py-10">
      <JsonLd data={buildBreadcrumbJsonLd([{ label: "Prompt Studio" }])} />
      <JsonLd data={buildFaqJsonLd(FAQ_ITEMS)} />
      <Breadcrumbs items={[{ label: "Prompt Studio" }]} />

      <div className="mx-auto mt-6 max-w-2xl text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-accent px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-brass">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          Prompt Studio
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Turn a rough idea into a great prompt
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Describe what you want in plain language — get back a structured prompt built for the
          model you&apos;re actually using. Already have a prompt? Switch to the Analyzer to see how it
          scores.
        </p>
      </div>

      <div className="mt-8">
        <Suspense fallback={null}>
          <PromptStudio />
        </Suspense>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <PromptHistoryPanel />
      </div>

      <div className="mx-auto mt-8 flex max-w-2xl justify-center">
        <Link
          href="/prompt-studio/library"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brass hover:text-brass-dark"
        >
          <Library className="h-4 w-4" aria-hidden="true" />
          Browse the Prompt Library
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        <Faq items={FAQ_ITEMS} />
      </div>
    </div>
  );
}
