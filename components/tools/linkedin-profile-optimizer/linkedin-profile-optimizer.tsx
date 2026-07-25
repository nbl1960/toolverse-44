"use client";

import * as React from "react";
import { Check, Copy, Eraser, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useLinkedinProfileOptimizer } from "@/hooks/tools/linkedin-profile-optimizer/use-linkedin-profile-optimizer";
import { MAX_TEXT_LENGTH } from "@/lib/tools/linkedin-profile-optimizer/constants";
import { copyToClipboard } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function LinkedinProfileOptimizer() {
  const { text, setText, result, isOptimizing, errorMessage, optimize, clear } =
    useLinkedinProfileOptimizer();
  const [copied, setCopied] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("generate_click", { tool: "linkedin-profile-optimizer" });
    void optimize();
  }

  async function handleCopy() {
    if (!result) return;
    const success = await copyToClipboard(result.improvedVersion);
    if (success) {
      trackEvent("copy_click", { tool: "linkedin-profile-optimizer" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const shareText = result
    ? `Improved version:\n${result.improvedVersion}\n\nWhy it's stronger:\n${result.suggestions.map((s) => `• ${s}`).join("\n")}`
    : "";

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7"
        noValidate
      >
        <div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="text">Your current headline or About section</Label>
            <span className="font-mono text-[11px] text-muted-foreground" aria-live="polite">
              {text.length}/{MAX_TEXT_LENGTH}
            </span>
          </div>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your current LinkedIn headline or About section text here…"
            maxLength={MAX_TEXT_LENGTH}
            rows={6}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? "text-error" : "text-helper"}
            className="mt-2"
          />
          <p id="text-helper" className="mt-1.5 text-xs text-muted-foreground">
            Works with either a short headline or a full About section.
          </p>
          {errorMessage && (
            <p id="text-error" role="alert" className="mt-1.5 text-xs text-destructive">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={clear} disabled={isOptimizing} className="sm:flex-none">
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
          <Button type="submit" disabled={isOptimizing} className="flex-1">
            {isOptimizing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Optimizing…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Optimize
              </>
            )}
          </Button>
        </div>
      </form>

      {result && (
        <div className="flex flex-col gap-4 animate-fade-up">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-brass">Improved version</p>
              <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">
              {result.improvedVersion}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-brass">Why it's stronger</p>
            <ul className="mt-3 flex flex-col gap-2">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="flex gap-2 text-sm leading-relaxed text-foreground">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" aria-hidden="true" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          <ShareActions title="LinkedIn profile optimization" text={shareText} />

          <AdSlot label="Advertisement" />
        </div>
      )}

      {!result && !isOptimizing && <AdSlot label="Advertisement" />}
    </div>
  );
}
