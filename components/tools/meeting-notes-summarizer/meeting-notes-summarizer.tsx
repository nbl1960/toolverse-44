"use client";

import * as React from "react";
import { Check, Copy, Eraser, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useMeetingNotesSummarizer } from "@/hooks/tools/meeting-notes-summarizer/use-meeting-notes-summarizer";
import { MAX_NOTES_LENGTH } from "@/lib/tools/meeting-notes-summarizer/constants";
import { copyToClipboard } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function MeetingNotesSummarizer() {
  const { notes, setNotes, result, isSummarizing, errorMessage, summarize, clear } = useMeetingNotesSummarizer();
  const [copied, setCopied] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("generate_click", { tool: "meeting-notes-summarizer" });
    void summarize();
  }

  const shareText = result
    ? `Summary: ${result.summary}\n\nDecisions:\n${result.decisions.map((d) => `• ${d}`).join("\n")}\n\nAction items:\n${result.actionItems.map((a) => `• ${a}`).join("\n")}`
    : "";

  async function handleCopy() {
    if (!result) return;
    const success = await copyToClipboard(shareText);
    if (success) {
      trackEvent("copy_click", { tool: "meeting-notes-summarizer" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7" noValidate>
        <div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="notes">Meeting notes or transcript</Label>
            <span className="font-mono text-[11px] text-muted-foreground">{notes.length}/{MAX_NOTES_LENGTH}</span>
          </div>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste raw meeting notes or a transcript here…"
            maxLength={MAX_NOTES_LENGTH}
            rows={10}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? "notes-error" : undefined}
            className="mt-2"
          />
          {errorMessage && (
            <p id="notes-error" role="alert" className="mt-1.5 text-xs text-destructive">
              {errorMessage}
            </p>
          )}
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={clear} disabled={isSummarizing} className="sm:flex-none">
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
          <Button type="submit" disabled={isSummarizing || !notes.trim()} className="flex-1">
            {isSummarizing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Summarizing…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Summarize notes
              </>
            )}
          </Button>
        </div>
      </form>

      {result && (
        <div className="flex flex-col gap-4 animate-fade-up">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-brass">Summary</p>
              <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy all"}
              </Button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{result.summary}</p>
          </div>

          {result.decisions.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-brass">Decisions</p>
              <ul className="mt-3 flex flex-col gap-2">
                {result.decisions.map((decision, index) => (
                  <li key={index} className="flex gap-2 text-sm leading-relaxed text-foreground">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" aria-hidden="true" />
                    {decision}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.actionItems.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-brass">Action items</p>
              <ul className="mt-3 flex flex-col gap-2">
                {result.actionItems.map((item, index) => (
                  <li key={index} className="flex gap-2 text-sm leading-relaxed text-foreground">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ShareActions title="Meeting summary" text={shareText} />

          <AdSlot label="Advertisement" />
        </div>
      )}

      {!result && !isSummarizing && <AdSlot label="Advertisement" />}
    </div>
  );
}
