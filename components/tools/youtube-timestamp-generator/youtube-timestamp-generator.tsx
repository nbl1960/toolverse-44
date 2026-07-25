"use client";

import * as React from "react";
import { Check, Copy, Download, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useYoutubeTimestampGenerator } from "@/hooks/tools/youtube-timestamp-generator/use-youtube-timestamp-generator";
import { downloadTextFile } from "@/lib/file-export";
import { copyToClipboard } from "@/lib/utils";

export function YoutubeTimestampGenerator() {
  const { input, setInput, result, errorMessage, reset } = useYoutubeTimestampGenerator();
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    if (!result) return;
    const success = await copyToClipboard(result.exportText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleExport() {
    if (!result) return;
    downloadTextFile(`youtube-timestamps-${new Date().toISOString().slice(0, 10)}.txt`, result.exportText);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
      <div className="lg:sticky lg:top-20">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
          <div>
            <Label htmlFor="chapters">Chapters (one per line)</Label>
            <Textarea
              id="chapters"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"Intro | 0:45\nMain topic | 3:30\nOutro | 0:30"}
              rows={10}
              className="mt-2 font-mono text-sm"
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? "chapters-error" : "chapters-helper"}
            />
            <p id="chapters-helper" className="mt-1.5 text-xs text-muted-foreground">
              Format: <span className="font-mono">Title | duration</span> — duration is how long that
              section runs, e.g. <span className="font-mono">Intro | 0:45</span>.
            </p>
            {errorMessage && (
              <p id="chapters-error" role="alert" className="mt-1.5 text-xs text-destructive">
                {errorMessage}
              </p>
            )}
          </div>
          <Button type="button" variant="outline" onClick={reset}>
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {result ? (
          <>
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    Chapter timestamps
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Total video length: {result.totalFormatted}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy all"}
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-3.5 w-3.5" />
                    Export TXT
                  </Button>
                </div>
              </div>

              <div className="mt-4 rounded-md border border-border bg-muted/40 p-4">
                <pre className="whitespace-pre-wrap break-words font-mono text-sm text-foreground">
                  {result.exportText}
                </pre>
              </div>
            </div>

            <ShareActions title="YouTube timestamps" text={result.exportText} />

            <AdSlot label="Advertisement" />
          </>
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {errorMessage ?? "Add your chapters on the left to generate timestamps."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
