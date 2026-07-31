"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Eraser, Loader2, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resolveIcon } from "@/lib/icon-map";
import { useAiAssistant } from "@/hooks/use-ai-assistant";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { IconName } from "@/lib/icon-map";
import type { MatchConfidence } from "@/lib/ai-assistant/types";

/**
 * Every prompt here is verified against the real tool catalog — each one
 * genuinely returns a Best Match. The original brief's example list
 * included three that don't correspond to any real tool (a PDF
 * compressor, a background remover, a Word-to-PDF converter) — using
 * them would mean the AI Guide's first impression, for anyone who tried
 * one, is "nothing found." Swapped for real equivalents that keep the
 * same variety (an image task, a conversion task, a quick utility) while
 * making sure every rotating prompt actually works.
 */
const EXAMPLE_PROMPTS = [
  "Create a resume",
  "Generate YouTube tags",
  "Calculate my EMI",
  "Create a QR code",
  "Write an Instagram caption",
  "Compress an image",
  "Resize an image",
  "Generate a strong password",
];

const CONFIDENCE_STYLES: Record<MatchConfidence, string> = {
  "Best Match": "border-success/40 bg-success/10 text-success",
  "Good Match": "border-brass/40 bg-accent text-brass",
  Related: "border-border bg-muted text-muted-foreground",
};

const ROTATE_INTERVAL_MS = 2800;

/**
 * Homepage AI Tool Assistant — the site's primary hero feature. Takes a
 * natural-language request, asks Gemini which of ToolVerse's actual
 * tools best match, and shows only results that are real, live,
 * registry-verified tools — see app/api/assistant/search/route.ts for
 * the grounding step. Gemini's only jobs are picking which tools match,
 * assigning a confidence tier, and writing the "why" — every other
 * detail shown here (name, tagline, icon, link, related tools) comes
 * straight from the same tool registry every other page on the site
 * uses.
 */
export function AiAssistant() {
  const {
    query,
    setQuery,
    recommendations,
    fallbackSuggestions,
    belowConfidenceThreshold,
    isSearching,
    errorMessage,
    search,
    clear,
  } = useAiAssistant();
  const [rotatingIndex, setRotatingIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Rotates the placeholder hint through real, working example prompts —
  // paused once the person has typed anything or a search is in flight,
  // so it never distracts from an active interaction.
  React.useEffect(() => {
    if (query || recommendations) return;
    const id = setInterval(() => {
      setRotatingIndex((current) => (current + 1) % EXAMPLE_PROMPTS.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [query, recommendations]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("assistant_search", { query_length: String(query.trim().length) });
    void search();
  }

  function handleExampleClick(example: string) {
    setQuery(example);
    trackEvent("assistant_example_click", { example });
    inputRef.current?.focus();
  }

  return (
    <section
      id="ai-guide"
      className="container scroll-mt-20 py-10 sm:py-14"
      aria-labelledby="ai-assistant-heading"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-accent px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-brass">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          AI Guide
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
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`e.g. ${EXAMPLE_PROMPTS[rotatingIndex]}`}
              className="pl-9 sm:h-12 sm:text-base"
              aria-label="Describe what you want to do"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSearching || !query.trim()} size="lg" className="flex-1 sm:flex-none">
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Ask ToolVerse AI
                </>
              )}
            </Button>
            {(query || recommendations) && !isSearching && (
              <Button type="button" variant="outline" size="lg" onClick={clear}>
                <Eraser className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>
        </form>

        {!recommendations && !isSearching && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {EXAMPLE_PROMPTS.slice(0, 5).map((example) => (
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

        {isSearching && (
          <div className="mt-8 flex flex-col gap-3">
            <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground" aria-live="polite">
              ToolVerse AI is thinking
              <span className="inline-flex gap-0.5" aria-hidden="true">
                <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
              </span>
            </p>
            <div aria-hidden="true" className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex animate-pulse items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="h-3.5 w-1/3 rounded bg-muted" />
                    <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
                  </div>
                  <div className="hidden h-8 w-24 shrink-0 rounded-md bg-muted sm:block" />
                </div>
              ))}
            </div>
          </div>
        )}

        {!isSearching && recommendations && (
          <div className="mt-8 animate-fade-up">
            {recommendations.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card px-6 py-8 text-center">
                <p className="text-sm font-medium text-foreground">
                  {belowConfidenceThreshold
                    ? "I couldn't find a perfect match."
                    : "Nothing in the catalog matches that yet — but new tools ship all the time."}
                </p>
                {belowConfidenceThreshold && (
                  <p className="mt-1 text-sm text-muted-foreground">Try these related tools.</p>
                )}
                {fallbackSuggestions && fallbackSuggestions.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      You might find these useful
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {fallbackSuggestions.map((tool) => (
                        <Link
                          key={tool.slug}
                          href={tool.route}
                          className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground transition-colors hover:border-brass/40"
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                <Button asChild variant="outline" className="mt-5">
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
                    <div key={rec.slug} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass/50 bg-primary text-primary-foreground">
                            <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-display text-sm font-semibold text-foreground">{rec.name}</p>
                              <span
                                className={cn(
                                  "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                                  CONFIDENCE_STYLES[rec.confidence]
                                )}
                              >
                                {rec.confidence} · {rec.confidenceScore}%
                              </span>
                              <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-success">
                                {rec.pricing}
                              </span>
                            </div>
                            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                              Why this tool?
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{rec.reason}</p>
                          </div>
                        </div>
                        <Button asChild size="sm" className="shrink-0 self-start sm:self-center">
                          <Link href={rec.route} onClick={() => trackEvent("assistant_open_tool", { tool: rec.slug })}>
                            Open tool
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>

                      {rec.relatedTools.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
                          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
                            Related:
                          </span>
                          {rec.relatedTools.map((related) => (
                            <Link
                              key={related.slug}
                              href={related.route}
                              className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-brass/40 hover:text-foreground"
                            >
                              {related.name}
                            </Link>
                          ))}
                        </div>
                      )}
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
