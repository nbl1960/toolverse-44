"use client";

import * as React from "react";
import { Check, Copy, Eraser, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useHashGenerator } from "@/hooks/tools/hash-generator/use-hash-generator";
import { HASH_ALGORITHMS } from "@/lib/tools/hash-generator/constants";
import { copyToClipboard, cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function DevHashGenerator() {
  const { text, setText, algorithm, setAlgorithm, result, isHashing, generate, clear } = useHashGenerator();
  const [copied, setCopied] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("generate_click", { tool: "dev-hash-generator", algorithm });
    generate();
  }

  async function handleCopy() {
    if (!result) return;
    const success = await copyToClipboard(result.hash);
    if (success) {
      trackEvent("copy_click", { tool: "dev-hash-generator" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7"
        noValidate
      >
        <div>
          <Label htmlFor="text">Text to hash</Label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to hash…"
            rows={5}
            className="mt-2 font-mono text-sm"
          />
        </div>

        <div
          role="radiogroup"
          aria-label="Hash algorithm"
          className="grid grid-cols-2 gap-1 rounded-md border border-border bg-muted/40 p-1 sm:grid-cols-4"
        >
          {HASH_ALGORITHMS.map((algo) => {
            const isSelected = algorithm === algo;
            return (
              <button
                key={algo}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setAlgorithm(algo)}
                className={cn(
                  "rounded px-2 py-1.5 text-sm font-medium transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isSelected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {algo}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={clear} disabled={isHashing} className="sm:flex-none">
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
          <Button type="submit" disabled={isHashing || !text.trim()} className="flex-1">
            {isHashing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Hashing…
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Generate hash
              </>
            )}
          </Button>
        </div>
      </form>

      {result && (
        <div className="flex flex-col gap-4 animate-fade-up">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-brass">{result.algorithm}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <code className="mt-3 block break-all font-mono text-sm text-foreground">{result.hash}</code>
          </div>

          <ShareActions title={`${result.algorithm} hash`} text={result.hash} />

          <AdSlot label="Advertisement" />
        </div>
      )}
    </div>
  );
}
