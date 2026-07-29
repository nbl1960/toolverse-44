"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Compass, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { resolveIcon } from "@/lib/icon-map";
import { useCopilot } from "@/hooks/use-copilot";
import { COPILOT_EXAMPLE_GOALS } from "@/lib/copilot/example-goals";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { IconName } from "@/lib/icon-map";
import type { CopilotStepConfidence } from "@/lib/copilot/types";

const CONFIDENCE_STYLES: Record<CopilotStepConfidence, string> = {
  essential: "border-brass bg-brass text-primary-foreground",
  recommended: "border-brass/50 bg-accent text-brass",
  optional: "border-border bg-muted text-muted-foreground",
};

const CONFIDENCE_LABELS: Record<CopilotStepConfidence, string> = {
  essential: "Essential",
  recommended: "Recommended",
  optional: "Optional",
};

/**
 * ToolVerse Copilot — the signature feature. Where the AI Guide answers
 * "what tool do I need for this one task," the Copilot answers "how do
 * I accomplish this broader goal" — an ordered, multi-step path through
 * real tools, not a flat ranked list. Same non-negotiable grounding
 * discipline as everywhere else in this app: see
 * app/api/copilot/plan/route.ts for where every step gets verified
 * against the real registry before it ever reaches this component.
 */
export function Copilot() {
  const { goal, setGoal, summary, steps, isPlanning, errorMessage, plan, reset } = useCopilot();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("copilot_plan_request", { goal_length: String(goal.trim().length) });
    void plan();
  }

  function handleExampleClick(example: string) {
    setGoal(example);
    trackEvent("copilot_example_click", { example });
  }

  return (
    <div className="mx-auto max-w-2xl">
      {!steps && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <Textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What do you want to accomplish? e.g. I want to start a YouTube channel"
              rows={3}
              className="text-sm sm:text-base"
              aria-label="What do you want to accomplish?"
            />
          </div>

          {!isPlanning && (
            <div className="flex flex-wrap gap-2">
              {COPILOT_EXAMPLE_GOALS.map((example) => (
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
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <Button type="submit" size="lg" disabled={isPlanning || !goal.trim()} className="self-start">
            {isPlanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Building your path…
              </>
            ) : (
              <>
                <Compass className="h-4 w-4" />
                Show me the path
              </>
            )}
          </Button>
        </form>
      )}

      {isPlanning && (
        <div className="mt-8 flex flex-col gap-3" aria-hidden="true">
          <p className="flex items-center gap-1 text-xs text-muted-foreground" aria-live="polite">
            Mapping out your path
            <span className="inline-flex gap-0.5">
              <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
            </span>
          </p>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex animate-pulse items-center gap-3 rounded-lg border border-border bg-card p-4"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-9 w-9 shrink-0 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="h-3.5 w-1/3 rounded bg-muted" />
                <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isPlanning && steps && (
        <div className="animate-fade-up">
          {summary && (
            <p className="rounded-lg border border-brass/30 bg-accent px-4 py-3 text-sm text-foreground">
              <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-brass" aria-hidden="true" />
              {summary}
            </p>
          )}

          {steps.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t find enough tools in the catalog to build a real path for that goal yet.
              </p>
              <Button variant="outline" className="mt-4" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                Try a different goal
              </Button>
            </div>
          ) : (
            <ol className="relative mt-6 flex flex-col gap-1">
              {steps.map((step, index) => {
                const Icon = resolveIcon(step.iconName as IconName);
                const isLast = index === steps.length - 1;
                return (
                  <li key={step.slug} className="relative flex gap-4 pb-6">
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[19px] top-10 h-[calc(100%-1.5rem)] w-px bg-border"
                      />
                    )}
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brass bg-primary font-display text-sm font-semibold text-primary-foreground">
                      {step.order}
                    </span>
                    <div className="flex-1 rounded-lg border border-border bg-card p-4 shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brass/40 bg-accent text-accent-foreground">
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-display text-sm font-semibold text-foreground">{step.name}</p>
                              <span
                                className={cn(
                                  "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                                  CONFIDENCE_STYLES[step.confidence]
                                )}
                              >
                                {CONFIDENCE_LABELS[step.confidence]}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{step.whyThisStep}</p>
                          </div>
                        </div>
                        <Button asChild size="sm" className="shrink-0 self-start sm:self-center">
                          <Link href={step.route} onClick={() => trackEvent("copilot_step_open", { tool: step.slug })}>
                            Open tool
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <Button variant="outline" onClick={reset} className="mt-2">
            <RotateCcw className="h-4 w-4" />
            Plan a different goal
          </Button>
        </div>
      )}
    </div>
  );
}
