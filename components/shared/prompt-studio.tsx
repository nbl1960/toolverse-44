"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy, Loader2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePromptEngine } from "@/hooks/use-prompt-engine";
import { analyzePrompt, getAnalyzerRating } from "@/lib/prompt-studio/analyzer";
import type { AnalyzerRating } from "@/lib/prompt-studio/analyzer";
import { MAX_REQUEST_LENGTH, MAX_ANALYZER_LENGTH, TARGET_MODELS } from "@/lib/prompt-studio/models";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { AnalyzerResult } from "@/lib/prompt-studio/types";

type StudioMode = "engine" | "analyzer";

const RATING_STYLES: Record<AnalyzerRating, string> = {
  Excellent: "border-success/40 bg-success/10 text-success",
  Good: "border-brass/40 bg-accent text-brass",
  Fair: "border-border bg-muted text-muted-foreground",
  "Needs work": "border-destructive/30 bg-destructive/10 text-destructive",
};

function useCopyToClipboard() {
  const [copied, setCopied] = React.useState(false);
  const copy = React.useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toastFallback();
    }
  }, []);
  function toastFallback() {
    // Clipboard API can fail (permissions, insecure context) — the text
    // is still visible and selectable on screen either way, so this
    // isn't a dead end, just a missed convenience.
  }
  return { copied, copy };
}

/**
 * ToolVerse Prompt Studio — Smart Prompt Engine (AI-powered, transforms
 * a rough request into a model-optimized structured prompt) and Prompt
 * Analyzer (deterministic, rule-based — see lib/prompt-studio/analyzer.ts
 * for why this isn't an AI-generated score) in one tabbed view. Every
 * successful Engine generation is recorded to Prompt History
 * automatically (localStorage, see lib/prompt-history.ts).
 */
export function PromptStudio() {
  const searchParams = useSearchParams();
  const initialText = searchParams.get("text") ?? "";
  const initialMode: StudioMode = searchParams.get("mode") === "analyzer" ? "analyzer" : "engine";

  const [mode, setMode] = React.useState<StudioMode>(initialMode);
  const engine = usePromptEngine();
  const { copied, copy } = useCopyToClipboard();

  const [analyzerInput, setAnalyzerInput] = React.useState(initialMode === "analyzer" ? initialText : "");
  const [analyzerResult, setAnalyzerResult] = React.useState<AnalyzerResult | null>(null);

  function handleEngineSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void engine.generate();
  }

  function handleAnalyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = analyzePrompt(analyzerInput);
    setAnalyzerResult(result);
    trackEvent("prompt_analyzer_run", { score: String(result.score) });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div
        role="tablist"
        aria-label="Prompt Studio mode"
        className="inline-flex rounded-md border border-border bg-muted/40 p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "engine"}
          onClick={() => setMode("engine")}
          className={cn(
            "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors",
            mode === "engine" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
          Prompt Engine
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "analyzer"}
          onClick={() => setMode("analyzer")}
          className={cn(
            "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors",
            mode === "analyzer" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Prompt Analyzer
        </button>
      </div>

      {mode === "engine" && (
        <div className="mt-6">
          <form onSubmit={handleEngineSubmit} className="flex flex-col gap-4" noValidate>
            <div>
              <Textarea
                value={engine.request}
                onChange={(e) => engine.setRequest(e.target.value)}
                placeholder="Describe what you want, simply — e.g. write a blog post about coffee"
                rows={3}
                maxLength={MAX_REQUEST_LENGTH}
                aria-label="Your rough request"
              />
              <p className="mt-1 text-right font-mono text-[11px] text-muted-foreground">
                {engine.request.length}/{MAX_REQUEST_LENGTH}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Target model</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TARGET_MODELS.map((model) => {
                  const isSelected = engine.targetModel === model.id;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => engine.setTargetModel(model.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        isSelected
                          ? "border-brass bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-brass/40 hover:text-foreground"
                      )}
                    >
                      {model.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {engine.errorMessage && (
              <p role="alert" className="text-sm text-destructive">
                {engine.errorMessage}
              </p>
            )}

            <Button type="submit" disabled={engine.isGenerating || !engine.request.trim()} className="self-start">
              {engine.isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Structuring your prompt…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate structured prompt
                </>
              )}
            </Button>
          </form>

          {engine.isGenerating && (
            <div className="mt-6 h-32 animate-pulse rounded-lg border border-border bg-card" aria-hidden="true" />
          )}

          {!engine.isGenerating && engine.structuredPrompt && (
            <div className="mt-6 animate-fade-up rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Structured prompt for {TARGET_MODELS.find((m) => m.id === engine.targetModel)?.name}
                </p>
                <Button size="sm" variant="outline" onClick={() => copy(engine.structuredPrompt ?? "")}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{engine.structuredPrompt}</p>
            </div>
          )}
        </div>
      )}

      {mode === "analyzer" && (
        <div className="mt-6">
          <form onSubmit={handleAnalyze} className="flex flex-col gap-4" noValidate>
            <div>
              <Textarea
                value={analyzerInput}
                onChange={(e) => setAnalyzerInput(e.target.value)}
                placeholder="Paste a prompt you're already using to see how it scores"
                rows={4}
                maxLength={MAX_ANALYZER_LENGTH}
                aria-label="Prompt to analyze"
              />
              <p className="mt-1 text-right font-mono text-[11px] text-muted-foreground">
                {analyzerInput.length}/{MAX_ANALYZER_LENGTH}
              </p>
            </div>
            <Button type="submit" disabled={!analyzerInput.trim()} className="self-start">
              <Sparkles className="h-4 w-4" />
              Analyze prompt
            </Button>
          </form>

          {analyzerResult && (
            <div className="mt-6 animate-fade-up rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl font-semibold text-foreground">
                  {analyzerResult.score}/{analyzerResult.maxScore}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                    RATING_STYLES[getAnalyzerRating(analyzerResult.score, analyzerResult.maxScore)]
                  )}
                >
                  {getAnalyzerRating(analyzerResult.score, analyzerResult.maxScore)}
                </span>
                <span className="text-sm text-muted-foreground">practices followed</span>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {analyzerResult.checks.map((check) => (
                  <div key={check.id} className="flex items-start gap-2">
                    <span
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]",
                        check.passed ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {check.passed ? "✓" : "–"}
                    </span>
                    <div>
                      <p className={cn("text-sm", check.passed ? "text-foreground" : "text-muted-foreground")}>
                        {check.label}
                      </p>
                      {!check.passed && <p className="text-xs text-muted-foreground">{check.hint}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
