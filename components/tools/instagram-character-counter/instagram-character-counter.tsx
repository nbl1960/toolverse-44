"use client";

import { AlertTriangle, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useInstagramCharacterCounter } from "@/hooks/tools/instagram-character-counter/use-instagram-character-counter";
import { MODE_OPTIONS } from "@/lib/tools/instagram-character-counter/constants";
import { cn } from "@/lib/utils";

export function InstagramCharacterCounter() {
  const { text, setText, mode, setMode, result, reset } = useInstagramCharacterCounter();

  const shareText = `Instagram ${mode} length: ${result.characterCount}/${result.limit} characters\nWords: ${result.wordCount} · Hashtags: ${result.hashtagCount} · Mentions: ${result.mentionCount}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
        <div
          role="radiogroup"
          aria-label="Content type"
          className="grid grid-cols-3 gap-1 rounded-md border border-border bg-muted/40 p-1"
        >
          {MODE_OPTIONS.map((option) => {
            const isSelected = mode === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setMode(option.value)}
                className={cn(
                  "rounded px-2 py-1.5 text-sm font-medium transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isSelected
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="content">Your {mode} text</Label>
            <span
              className={cn(
                "font-mono text-[11px]",
                result.isOverLimit ? "text-destructive" : "text-muted-foreground"
              )}
              aria-live="polite"
            >
              {result.characterCount.toLocaleString()}/{result.limit.toLocaleString()}
            </span>
          </div>
          <Textarea
            id="content"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Paste or write your Instagram ${mode} here…`}
            rows={8}
            aria-describedby="content-stats"
            className={cn("mt-2", result.isOverLimit && "border-destructive")}
          />
        </div>

        {result.isOverLimit && (
          <p role="alert" className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {Math.abs(result.remaining).toLocaleString()} characters over the {result.limit.toLocaleString()}-character limit.
          </p>
        )}
        {result.exceedsFeedPreview && !result.isOverLimit && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            This caption will be cut off behind a "...more" link in the main feed after ~125 characters.
          </p>
        )}

        <Button type="button" variant="outline" onClick={reset} className="self-start">
          <Eraser className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <div id="content-stats" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Characters", value: result.characterCount },
          { label: "Words", value: result.wordCount },
          { label: "Hashtags", value: result.hashtagCount },
          { label: "Mentions", value: result.mentionCount },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-4 text-center shadow-sm">
            <p className="font-display text-xl font-semibold text-foreground">{stat.value.toLocaleString()}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {text && <ShareActions title="Instagram Character Counter results" text={shareText} />}

      <AdSlot label="Advertisement" />
    </div>
  );
}
