"use client";

import * as React from "react";
import { AlertTriangle, Check, Copy, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useUrlEncoderDecoder } from "@/hooks/tools/url-encoder-decoder/use-url-encoder-decoder";
import { copyToClipboard, cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function UrlEncoderDecoder() {
  const { input, setInput, mode, setMode, result, reset } = useUrlEncoderDecoder();
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    if (!result?.success) return;
    const success = await copyToClipboard(result.output);
    if (success) {
      trackEvent("copy_click", { tool: "url-encoder-decoder", mode });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
        <div role="radiogroup" aria-label="Mode" className="grid grid-cols-2 gap-1 rounded-md border border-border bg-muted/40 p-1">
          {(["encode", "decode"] as const).map((option) => {
            const isSelected = mode === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setMode(option)}
                className={cn(
                  "rounded px-2 py-1.5 text-sm font-medium capitalize transition-all duration-150",
                  isSelected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div>
          <Label htmlFor="input">{mode === "encode" ? "Text to encode" : "Text to decode"}</Label>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "hello world & welcome?" : "hello%20world%20%26%20welcome%3F"}
            rows={5}
            className="mt-2 font-mono text-sm"
          />
        </div>

        {input && (
          <Button type="button" variant="outline" onClick={reset} className="self-start">
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {result && (
        <div className="flex flex-col gap-4 animate-fade-up">
          {!result.success ? (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/5 p-5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
              <p className="text-sm text-destructive">{result.output}</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-wide text-brass">Result</p>
                <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="mt-3 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/40 p-4 font-mono text-sm text-foreground">
                {result.output}
              </pre>
            </div>
          )}

          <ShareActions title="URL codec result" text={result.success ? result.output : ""} />

          <AdSlot label="Advertisement" />
        </div>
      )}
    </div>
  );
}
