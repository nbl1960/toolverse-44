"use client";

import { Check, Eraser, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useLinkedinHeadlineAnalyzer } from "@/hooks/tools/linkedin-headline-analyzer/use-linkedin-headline-analyzer";
import { HEADLINE_CHAR_LIMIT } from "@/lib/tools/linkedin-headline-analyzer/constants";
import { cn } from "@/lib/utils";

export function LinkedinHeadlineAnalyzer() {
  const { headline, setHeadline, result, reset } = useLinkedinHeadlineAnalyzer();

  const shareText = result
    ? `LinkedIn headline score: ${result.score}/100 (${result.rating})\nHeadline: "${headline}"`
    : "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="headline">Your LinkedIn headline</Label>
            <span className="font-mono text-[11px] text-muted-foreground" aria-live="polite">
              {headline.length}/{HEADLINE_CHAR_LIMIT}
            </span>
          </div>
          <Input
            id="headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Product Manager helping B2B fintechs move money faster"
            maxLength={HEADLINE_CHAR_LIMIT}
            className="mt-2"
          />
        </div>
        {headline && (
          <Button type="button" variant="outline" onClick={reset} className="self-start">
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {result ? (
        <div className="flex flex-col gap-6 animate-fade-up">
          <div className="rounded-lg border border-border bg-card p-6 text-center shadow-sm">
            <p className="font-display text-4xl font-semibold text-foreground">{result.score}<span className="text-lg text-muted-foreground">/100</span></p>
            <p
              className={cn(
                "mt-1 text-sm font-medium",
                result.rating === "Great" && "text-success",
                result.rating === "Good" && "text-brass",
                result.rating === "Needs work" && "text-muted-foreground"
              )}
            >
              {result.rating}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h3 className="font-display text-base font-semibold text-foreground">Checks</h3>
            <ul className="mt-3 flex flex-col gap-3">
              {result.checks.map((check) => (
                <li key={check.label} className="flex items-start gap-2.5">
                  {check.passed ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{check.label}</p>
                    <p className="text-xs text-muted-foreground">{check.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <ShareActions title="LinkedIn Headline Analyzer results" text={shareText} />

          <AdSlot label="Advertisement" />
        </div>
      ) : (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">Enter your headline above to see your score.</p>
        </div>
      )}
    </div>
  );
}
