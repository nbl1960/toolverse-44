"use client";

import * as React from "react";
import { Check, Copy, Download, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useSitemapGenerator } from "@/hooks/tools/sitemap-generator/use-sitemap-generator";
import { CHANGE_FREQ_OPTIONS } from "@/lib/tools/sitemap-generator/constants";
import { downloadTextFile } from "@/lib/file-export";
import { copyToClipboard, cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function SeoSitemapGenerator() {
  const { values, setField, output, reset } = useSitemapGenerator();
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      trackEvent("copy_click", { tool: "seo-sitemap-generator" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleDownload() {
    if (!output) return;
    trackEvent("export_click", { tool: "seo-sitemap-generator" });
    downloadTextFile("sitemap.xml", output);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
      <div className="lg:sticky lg:top-20">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
          <div>
            <Label htmlFor="urls">URLs (one per line)</Label>
            <Textarea
              id="urls"
              value={values.urls}
              onChange={(e) => setField("urls", e.target.value)}
              placeholder={"https://example.com/\nhttps://example.com/about"}
              rows={8}
              className="mt-2 font-mono text-sm"
            />
          </div>
          <div>
            <Label htmlFor="changeFreq">Change frequency</Label>
            <div role="radiogroup" aria-label="Change frequency" className="mt-2 grid grid-cols-3 gap-1 rounded-md border border-border bg-muted/40 p-1">
              {CHANGE_FREQ_OPTIONS.slice(0, 6).map((freq) => {
                const isSelected = values.changeFreq === freq;
                return (
                  <button
                    key={freq}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setField("changeFreq", freq)}
                    className={cn(
                      "rounded px-2 py-1.5 text-xs font-medium capitalize transition-all duration-150",
                      isSelected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {freq}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <Label htmlFor="priority">Priority (0.0–1.0)</Label>
            <input
              id="priority"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={values.priority}
              onChange={(e) => setField("priority", e.target.value)}
              className="mt-2 h-9 w-full cursor-pointer"
            />
            <p className="mt-1 text-xs text-muted-foreground">{values.priority}</p>
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
                <h3 className="font-display text-base font-semibold text-foreground">sitemap.xml</h3>
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
              <pre className="mt-3 max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-muted/40 p-4 font-mono text-xs text-foreground">
                {output}
              </pre>
            </div>
            <ShareActions title="sitemap.xml" text={output} />
            <AdSlot label="Advertisement" />
          </>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">Add at least one URL to generate your sitemap.</p>
          </div>
        )}
      </div>
    </div>
  );
}
