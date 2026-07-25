"use client";

import * as React from "react";
import { Check, Copy, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useFaqSchemaGenerator } from "@/hooks/tools/faq-schema-generator/use-faq-schema-generator";
import { copyToClipboard } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function SeoFaqSchemaGenerator() {
  const { input, setInput, output, pairCount, reset } = useFaqSchemaGenerator();
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      trackEvent("copy_click", { tool: "seo-faq-schema-generator" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
      <div className="lg:sticky lg:top-20">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
          <div>
            <Label htmlFor="input">Questions and answers</Label>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"Q: Your question here?\nA: Your answer here.\n\nQ: Another question?\nA: Another answer."}
              rows={12}
              className="mt-2 font-mono text-sm"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              One pair per block: a line starting with "Q:", a line starting with "A:", separated by a blank line between pairs.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={reset}>
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {output ? (
          <>
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">FAQPage JSON-LD</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{pairCount} question{pairCount === 1 ? "" : "s"} detected</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="mt-3 max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-muted/40 p-4 font-mono text-sm text-foreground">
                {output}
              </pre>
            </div>
            <ShareActions title="FAQ schema JSON-LD" text={output} />
            <AdSlot label="Advertisement" />
          </>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">Add at least one Q&amp;A pair in the format shown to generate your FAQ schema.</p>
          </div>
        )}
      </div>
    </div>
  );
}
