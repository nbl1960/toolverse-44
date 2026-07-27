"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Eraser, Loader2, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resolveIcon } from "@/lib/icon-map";
import { useAiAssistant } from "@/hooks/use-ai-assistant";
import { trackEvent } from "@/lib/analytics";
import type { IconName } from "@/lib/icon-map";

const EXAMPLE_PROMPTS = [
  "I want to resize an image",
  "Create a resume",
  "Download a YouTube thumbnail",
  "Calculate my EMI",
  "Write an Instagram caption",
];

/**
 * Homepage AI Tool Assistant: takes a natural-language request, asks
 * Gemini which of ToolVerse's actual tools best match, and shows only
 * results that are real, live, registry-verified tools — see
 * app/api/assistant/search/route.ts for the grounding step. Gemini's
 * only jobs are picking which tools match and writing the "why"; every
 * other detail shown here (name, tagline, icon, link) comes straight
 * from the same tool registry every other page on the site uses.
 */
export function AiAssistant() {
  const { query, setQuery, recommendations, isSearching, errorMessage, search, clear } = useAiAssistant();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("assistant_search", { query_length: String(query.trim().length) });
    void search();
  }

  function handleExampleClick(example: string) {
    setQuery(example);
  }

  return (
    <section className="container py-10 sm:py-14" aria-labelledby="ai-assistant-heading">
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-accent px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-brass">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          AI Tool Assistant
        </p>
        <h2 id="ai-assistant-heading" className="mt-3 font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Not sure which tool you need?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Describe what you&apos;re trying to do, in your own words — we&apos;ll point you to the right tool.
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row" noValidate>
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. I want to compress an image before uploading it"
              className="pl-9"
              aria-label="Describe what you want to do"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSearching || !query.trim()} className="flex-1 sm:flex-none">
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Find my tool
                </>
              )}
            </Button>
            {(query || recommendations) && (
              <Button type="button" variant="outline" onClick={clear} disabled={isSearching}>
                <Eraser className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>
        </form>

        {!recommendations && !isSearching && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {EXAMPLE_PROMPTS.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => handleExampleClick(example)}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-brass/40 hover:text-foreground"
              >
                {example}
              </button>
            ))}
          </div>
        )}

        {errorMessage && (
          <p role="alert" className="mt-4 text-center text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        {recommendations && (
          <div className="mt-8 animate-fade-up">
            {recommendations.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Nothing in the catalog matches that yet — but new tools ship all the time.
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/tools">
                    Browse all tools
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recommendations.map((rec) => {
                  const Icon = resolveIcon(rec.iconName as IconName);
                  return (
                    <div
                      key={rec.slug}
                      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass/50 bg-primary text-primary-foreground">
                          <Icon className="h-4.5 w-4.5" strokeWidth={2} aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-display text-sm font-semibold text-foreground">{rec.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{rec.reason}</p>
                        </div>
                      </div>
                      <Button asChild size="sm" className="shrink-0 self-start sm:self-center">
                        <Link href={rec.route} onClick={() => trackEvent("assistant_open_tool", { tool: rec.slug })}>
                          Open tool
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
