"use client";

import * as React from "react";
import { Check, Copy, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useOpenGraphGenerator } from "@/hooks/tools/open-graph-generator/use-open-graph-generator";
import { OG_TYPE_OPTIONS } from "@/lib/tools/open-graph-generator/constants";
import { copyToClipboard, cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { OpenGraphFormValues } from "@/lib/tools/open-graph-generator/types";

export function SeoOpenGraphGenerator() {
  const { values, setField, output, reset } = useOpenGraphGenerator();
  const [copied, setCopied] = React.useState(false);

  function handleChange(key: keyof OpenGraphFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField(key, e.target.value);
  }

  async function handleCopy() {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      trackEvent("copy_click", { tool: "seo-open-graph-generator" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
      <div className="lg:sticky lg:top-20">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={values.title} onChange={handleChange("title")} placeholder="Page title" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={values.description} onChange={handleChange("description")} placeholder="Page description" rows={3} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input id="url" value={values.url} onChange={handleChange("url")} placeholder="https://example.com/page" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" value={values.imageUrl} onChange={handleChange("imageUrl")} placeholder="https://example.com/image.jpg" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="siteName">Site name</Label>
            <Input id="siteName" value={values.siteName} onChange={handleChange("siteName")} placeholder="Your Site" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <div role="radiogroup" aria-label="Content type" className="mt-2 grid grid-cols-2 gap-1 rounded-md border border-border bg-muted/40 p-1">
              {OG_TYPE_OPTIONS.map((type) => {
                const isSelected = values.type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setField("type", type)}
                    className={cn(
                      "rounded px-2 py-1.5 text-xs font-medium capitalize transition-all duration-150",
                      isSelected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
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
                <h3 className="font-display text-base font-semibold text-foreground">Open Graph tags</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="mt-3 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/40 p-4 font-mono text-sm text-foreground">
                {output}
              </pre>
            </div>
            <ShareActions title="Open Graph tags" text={output} />
            <AdSlot label="Advertisement" />
          </>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">Add at least a title or description to generate your Open Graph tags.</p>
          </div>
        )}
      </div>
    </div>
  );
}
