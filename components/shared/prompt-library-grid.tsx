"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Copy, Sparkles } from "lucide-react";
import { PROMPT_LIBRARY, PROMPT_LIBRARY_CATEGORIES } from "@/lib/prompt-studio/library-content";
import { getTargetModel } from "@/lib/prompt-studio/models";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** The interactive part of the Library page (category filtering, copy-to-clipboard) — kept separate from app/prompt-studio/library/page.tsx so that page can stay a Server Component and export real metadata. */
export function PromptLibraryGrid() {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const visibleTemplates = activeCategory
    ? PROMPT_LIBRARY.filter((t) => t.category === activeCategory)
    : PROMPT_LIBRARY;

  async function handleCopy(id: string, prompt: string) {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(id);
      trackEvent("prompt_library_copy", { template: id });
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard can fail (permissions, insecure context) — the prompt
      // text is still visible and selectable on screen either way.
    }
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            activeCategory === null
              ? "border-brass bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-brass/40 hover:text-foreground"
          )}
        >
          All
        </button>
        {PROMPT_LIBRARY_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              activeCategory === category
                ? "border-brass bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-brass/40 hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visibleTemplates.map((template) => {
          const model = getTargetModel(template.targetModel);
          return (
            <div key={template.id} className="flex flex-col rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">{template.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {template.category} · {model?.name ?? template.targetModel}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    href={`/prompt-studio?mode=analyzer&text=${encodeURIComponent(template.prompt)}`}
                    onClick={() => trackEvent("prompt_library_analyze", { template: template.id })}
                    aria-label={`Analyze the "${template.title}" prompt`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brass/40 hover:text-brass"
                  >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleCopy(template.id, template.prompt)}
                    aria-label={`Copy the "${template.title}" prompt`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brass/40 hover:text-brass"
                  >
                    {copiedId === template.id ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <p className="mt-3 line-clamp-4 flex-1 text-xs leading-relaxed text-muted-foreground">
                {template.prompt}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
