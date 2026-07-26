"use client";

import * as React from "react";
import { Check, Copy, Eraser, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useRegexGenerator } from "@/hooks/tools/regex-generator/use-regex-generator";
import { MAX_DESCRIPTION_LENGTH } from "@/lib/tools/regex-generator/constants";
import { copyToClipboard } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function RegexGenerator() {
  const { description, setDescription, result, isGenerating, errorMessage, generate, clear } = useRegexGenerator();
  const [copied, setCopied] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("generate_click", { tool: "regex-generator" });
    void generate();
  }

  async function handleCopy() {
    if (!result) return;
    const success = await copyToClipboard(result.pattern);
    if (success) {
      trackEvent("copy_click", { tool: "regex-generator" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const shareText = result ? `Pattern: ${result.pattern}\nExplanation: ${result.explanation}\nExample match: ${result.example}` : "";

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7" noValidate>
        <div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="description">What do you want to match?</Label>
            <span className="font-mono text-[11px] text-muted-foreground">{description.length}/{MAX_DESCRIPTION_LENGTH}</span>
          </div>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Match a valid email address"
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={3}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? "description-error" : undefined}
            className="mt-2"
          />
          {errorMessage && (
            <p id="description-error" role="alert" className="mt-1.5 text-xs text-destructive">
              {errorMessage}
            </p>
          )}
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={clear} disabled={isGenerating} className="sm:flex-none">
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
          <Button type="submit" disabled={isGenerating || !description.trim()} className="flex-1">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate regex
              </>
            )}
          </Button>
        </div>
      </form>

      {result && (
        <div className="flex flex-col gap-4 animate-fade-up">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-brass">Pattern</p>
              <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <code className="mt-3 block break-all font-mono text-sm text-foreground">{result.pattern}</code>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-brass">Explanation</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{result.explanation}</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-brass">Example match</p>
            <code className="mt-3 block font-mono text-sm text-foreground">{result.example}</code>
          </div>

          <ShareActions title="Generated regex" text={shareText} />

          <AdSlot label="Advertisement" />
        </div>
      )}

      {!result && !isGenerating && <AdSlot label="Advertisement" />}
    </div>
  );
}
