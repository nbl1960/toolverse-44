"use client";

import * as React from "react";
import { Check, Copy, Download, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useRobotsTxtGenerator } from "@/hooks/tools/robots-txt-generator/use-robots-txt-generator";
import { downloadTextFile } from "@/lib/file-export";
import { copyToClipboard } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { RobotsFormValues } from "@/lib/tools/robots-txt-generator/types";

export function SeoRobotsTxtGenerator() {
  const { values, setField, output, reset } = useRobotsTxtGenerator();
  const [copied, setCopied] = React.useState(false);

  function handleChange(key: keyof RobotsFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField(key, e.target.value);
  }

  async function handleCopy() {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      trackEvent("copy_click", { tool: "seo-robots-txt-generator" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleDownload() {
    if (!output) return;
    trackEvent("export_click", { tool: "seo-robots-txt-generator" });
    downloadTextFile("robots.txt", output);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
      <div className="lg:sticky lg:top-20">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
          <div>
            <Label htmlFor="userAgent">User-agent</Label>
            <Input id="userAgent" value={values.userAgent} onChange={handleChange("userAgent")} placeholder="*" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="disallowPaths">Disallow paths (one per line)</Label>
            <Textarea id="disallowPaths" value={values.disallowPaths} onChange={handleChange("disallowPaths")} placeholder="/admin/&#10;/api/" rows={4} className="mt-2 font-mono text-sm" />
          </div>
          <div>
            <Label htmlFor="allowPaths">Allow paths (one per line, optional)</Label>
            <Textarea id="allowPaths" value={values.allowPaths} onChange={handleChange("allowPaths")} placeholder="/api/public/" rows={3} className="mt-2 font-mono text-sm" />
          </div>
          <div>
            <Label htmlFor="crawlDelay">Crawl-delay in seconds (optional)</Label>
            <Input id="crawlDelay" value={values.crawlDelay} onChange={handleChange("crawlDelay")} placeholder="10" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="sitemapUrl">Sitemap URL (optional)</Label>
            <Input id="sitemapUrl" value={values.sitemapUrl} onChange={handleChange("sitemapUrl")} placeholder="https://example.com/sitemap.xml" className="mt-2" />
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
                <h3 className="font-display text-base font-semibold text-foreground">robots.txt</h3>
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
              <pre className="mt-3 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/40 p-4 font-mono text-sm text-foreground">
                {output}
              </pre>
            </div>
            <ShareActions title="robots.txt" text={output} />
            <AdSlot label="Advertisement" />
          </>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">Add at least one rule or a sitemap URL to generate your robots.txt.</p>
          </div>
        )}
      </div>
    </div>
  );
}
