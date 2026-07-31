import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { PROMPT_LIBRARY } from "@/lib/prompt-studio/library-content";
import { buildMetadata } from "@/lib/seo";

const PromptLibraryGrid = dynamic(() =>
  import("@/components/shared/prompt-library-grid").then((m) => ({ default: m.PromptLibraryGrid }))
);

export const metadata: Metadata = buildMetadata({
  title: "Prompt Library",
  description: `${PROMPT_LIBRARY.length} ready-to-use prompt templates for ChatGPT, Claude, Gemini, Grok, Perplexity, DeepSeek, Qwen, Midjourney, and DALL·E — writing, coding, business, marketing, and more.`,
  path: "/prompt-studio/library",
});

export default function PromptLibraryPage() {
  return (
    <div className="container py-8 sm:py-10">
      <JsonLd data={buildBreadcrumbJsonLd([{ label: "Prompt Studio", href: "/prompt-studio" }, { label: "Library" }])} />
      <Breadcrumbs items={[{ label: "Prompt Studio", href: "/prompt-studio" }, { label: "Library" }]} />

      <div className="mt-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Prompt Library
        </h1>
        <p className="mt-1 max-w-lg text-sm text-muted-foreground sm:text-base">
          {PROMPT_LIBRARY.length} ready-to-use prompt templates — copy one, fill in the bracketed
          placeholder, and go. Want one built specifically for your request instead?{" "}
          <Link href="/prompt-studio" className="font-medium text-brass hover:text-brass-dark">
            Try the Prompt Engine
          </Link>
          .
        </p>
      </div>

      <Suspense fallback={null}>
        <PromptLibraryGrid />
      </Suspense>
    </div>
  );
}
