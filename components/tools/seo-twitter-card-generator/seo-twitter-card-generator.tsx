"use client";

import * as React from "react";
import { Check, Copy, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useTwitterCardGenerator } from "@/hooks/tools/twitter-card-generator/use-twitter-card-generator";
import { CARD_TYPE_OPTIONS } from "@/lib/tools/twitter-card-generator/constants";
import { copyToClipboard, cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { TwitterCardFormValues } from "@/lib/tools/twitter-card-generator/types";

export function SeoTwitterCardGenerator() {
  const { values, setField, output, reset } = useTwitterCardGenerator();
  const [copied, setCopied] = React.useState(false);

  function handleChange(key: keyof TwitterCardFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField(key, e.target.value);
  }

  async function handleCopy() {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      trackEvent("copy_click", { tool: "seo-twitter-card-generator" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
      <div className="lg:sticky lg:top-20">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
          <div>
            <Label>Card type</Label>
            <div role="radiogroup" aria-label="Card type" className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-muted/40 p-1">
              {CARD_TYPE_OPTIONS.map((option) => {
                const isSelected = values.cardType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setField("cardType", option.value)}
                    className={cn(
                      "rounded px-2 py-1.5 text-sm font-medium transition-all duration-150",
                      isSelected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={values.title} onChange={handleChange("title")} placeholder="Page title" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={values.description} onChange={handleChange("description")} placeholder="Page description" rows={3} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" value={values.imageUrl} onChange={handleChange("imageUrl")} placeholder="https://example.com/image.jpg" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="site">@handle (optional)</Label>
            <Input id="site" value={values.site} onChange={handleChange("site")} placeholder="@yoursite" className="mt-2" />
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
                <h3 className="font-display text-base font-semibold text-foreground">Twitter Card tags</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="mt-3 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/40 p-4 font-mono text-sm text-foreground">
                {output}
              </pre>
            </div>
            <ShareActions title="Twitter Card tags" text={output} />
            <AdSlot label="Advertisement" />
          </>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">Add at least a title or description to generate your Twitter Card tags.</p>
          </div>
        )}
      </div>
    </div>
  );
}
