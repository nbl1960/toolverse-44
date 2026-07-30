import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Library, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PromptStudio } from "@/components/shared/prompt-studio";
import { PromptHistoryPanel } from "@/components/shared/prompt-history-panel";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Prompt Studio",
  description: `Turn a simple request into a professional, structured prompt optimized for ChatGPT, Claude, Gemini, Midjourney, or DALL·E — plus a prompt quality analyzer, all free on ${SITE_NAME}.`,
  path: "/prompt-studio",
});

export default function PromptStudioPage() {
  return (
    <div className="container py-8 sm:py-10">
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
        <PromptStudio />
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
    </div>
  );
}
