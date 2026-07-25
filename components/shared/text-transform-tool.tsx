"use client";

import * as React from "react";
import { AlertTriangle, Check, Copy, Download, Eraser, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { downloadTextFile } from "@/lib/file-export";
import { copyToClipboard } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export interface TransformResult {
  success: boolean;
  output: string;
  /** Shown above the output on success — e.g. "Valid JSON" for a validator. */
  statusMessage?: string;
}

interface TextTransformToolProps {
  toolSlug: string;
  inputLabel: string;
  inputPlaceholder: string;
  actionLabel: string;
  outputLabel: string;
  downloadFilename: string;
  /** Pure function: input text in, transformed output (or an error) out. Never throws. */
  transform: (input: string) => TransformResult;
  /** Extension used for the downloaded file, without a leading dot, e.g. "json". */
  fileExtension: string;
}

/**
 * Shared UI for every "paste text, transform it, copy the result" tool —
 * JSON Formatter/Validator, Base64 Encode/Decode, HTML/CSS/JS Minifier.
 * One implementation; each tool just supplies its own `transform`
 * function and copy. The actual transform always runs client-side (no
 * API call), so there's no loading state beyond the transform itself,
 * which is effectively instant for any reasonably-sized input.
 */
export function TextTransformTool({
  toolSlug,
  inputLabel,
  inputPlaceholder,
  actionLabel,
  outputLabel,
  downloadFilename,
  transform,
  fileExtension,
}: TextTransformToolProps) {
  const [input, setInput] = React.useState("");
  const [result, setResult] = React.useState<TransformResult | null>(null);
  const [copied, setCopied] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("generate_click", { tool: toolSlug });
    setResult(transform(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  async function handleCopy() {
    if (!result?.success) return;
    const success = await copyToClipboard(result.output);
    if (success) {
      trackEvent("copy_click", { tool: toolSlug });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleDownload() {
    if (!result?.success) return;
    trackEvent("export_click", { tool: toolSlug });
    downloadTextFile(`${downloadFilename}.${fileExtension}`, result.output);
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7"
        noValidate
      >
        <div>
          <Label htmlFor="input">{inputLabel}</Label>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            rows={8}
            className="mt-2 font-mono text-sm"
          />
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={handleClear} className="sm:flex-none">
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
          <Button type="submit" disabled={!input.trim()} className="flex-1">
            <Wand2 className="h-4 w-4" />
            {actionLabel}
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
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-brass">{outputLabel}</p>
                  {result.statusMessage && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-success">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      {result.statusMessage}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>
              </div>
              <pre className="mt-3 max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-muted/40 p-4 font-mono text-sm text-foreground">
                {result.output}
              </pre>
            </div>
          )}

          <ShareActions title={`${outputLabel} result`} text={result.success ? result.output : ""} />

          <AdSlot label="Advertisement" />
        </div>
      )}

      {!result && <AdSlot label="Advertisement" />}
    </div>
  );
}
