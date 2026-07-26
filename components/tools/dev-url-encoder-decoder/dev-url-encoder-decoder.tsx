"use client";

import * as React from "react";
import { AlertTriangle, Check, Copy, Eraser, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useUrlEncoderDecoder } from "@/hooks/tools/url-encoder-decoder/use-url-encoder-decoder";
import { copyToClipboard, cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { UrlCodecMode } from "@/lib/tools/url-encoder-decoder/types";

export function DevUrlEncoderDecoder() {
  const { input, setInput, mode, setMode, result, run, reset } = useUrlEncoderDecoder();
  const [copied, setCopied] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("generate_click", { tool: "dev-url-encoder-decoder", mode });
    run();
  }

  async function handleCopy() {
    if (!result?.success) return;
    const success = await copyToClipboard(result.output);
    if (success) {
      trackEvent("copy_click", { tool: "dev-url-encoder-decoder" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7" noValidate>
        <div role="radiogroup" aria-label="Mode" className="grid grid-cols-2 gap-1 rounded-md border border-border bg-muted/40 p-1">
          {(["encode", "decode"] as UrlCodecMode[]).map((m) => {
            const isSelected = mode === m;
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded px-2 py-1.5 text-sm font-medium capitalize transition-all duration-150",
                  isSelected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m}
              </button>
            );
          })}
        </div>
        <div>
          <Label htmlFor="input">{mode === "encode" ? "Text to encode" : "URL-encoded text to decode"}</Label>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "hello world & more" : "hello%20world%20%26%20more"}
            rows={6}
            className="mt-2 font-mono text-sm"
          />
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={reset} className="sm:flex-none">
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
          <Button type="submit" disabled={!input.trim()} className="flex-1">
            <Wand2 className="h-4 w-4" />
            {mode === "encode" ? "Encode" : "Decode"}
          </Button>
        </div>
      </form>

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
          <ShareActions title="URL encode/decode result" text={result.success ? result.output : ""} />
          <AdSlot label="Advertisement" />
        </div>
      )}
    </div>
  );
}
