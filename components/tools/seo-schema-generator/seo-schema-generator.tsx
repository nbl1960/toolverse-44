"use client";

import * as React from "react";
import { Check, Copy, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useSchemaGenerator } from "@/hooks/tools/schema-generator/use-schema-generator";
import { SCHEMA_TYPE_OPTIONS } from "@/lib/tools/schema-generator/constants";
import { copyToClipboard, cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { SchemaFormValues } from "@/lib/tools/schema-generator/types";

export function SeoSchemaGenerator() {
  const { values, setField, output, reset } = useSchemaGenerator();
  const [copied, setCopied] = React.useState(false);

  function handleChange(key: keyof SchemaFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField(key, e.target.value);
  }

  async function handleCopy() {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      trackEvent("copy_click", { tool: "seo-schema-generator" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
      <div className="lg:sticky lg:top-20">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
          <div>
            <Label>Schema type</Label>
            <div role="radiogroup" aria-label="Schema type" className="mt-2 grid grid-cols-2 gap-1 rounded-md border border-border bg-muted/40 p-1">
              {SCHEMA_TYPE_OPTIONS.map((type) => {
                const isSelected = values.schemaType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setField("schemaType", type)}
                    className={cn(
                      "rounded px-2 py-1.5 text-xs font-medium transition-all duration-150",
                      isSelected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="name">Name / headline</Label>
            <Input id="name" value={values.name} onChange={handleChange("name")} placeholder="Required" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={values.description} onChange={handleChange("description")} rows={2} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input id="url" value={values.url} onChange={handleChange("url")} placeholder="https://example.com/page" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" value={values.imageUrl} onChange={handleChange("imageUrl")} className="mt-2" />
          </div>

          {values.schemaType === "Article" && (
            <>
              <div>
                <Label htmlFor="authorName">Author name</Label>
                <Input id="authorName" value={values.authorName} onChange={handleChange("authorName")} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="datePublished">Date published</Label>
                <Input id="datePublished" type="date" value={values.datePublished} onChange={handleChange("datePublished")} className="mt-2" />
              </div>
            </>
          )}

          {values.schemaType === "Product" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" value={values.price} onChange={handleChange("price")} placeholder="29.99" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="priceCurrency">Currency</Label>
                <Input id="priceCurrency" value={values.priceCurrency} onChange={handleChange("priceCurrency")} placeholder="USD" className="mt-2" />
              </div>
            </div>
          )}

          {values.schemaType === "LocalBusiness" && (
            <>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={values.address} onChange={handleChange("address")} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="telephone">Telephone</Label>
                <Input id="telephone" value={values.telephone} onChange={handleChange("telephone")} className="mt-2" />
              </div>
            </>
          )}

          {values.schemaType === "Person" && (
            <div>
              <Label htmlFor="jobTitle">Job title</Label>
              <Input id="jobTitle" value={values.jobTitle} onChange={handleChange("jobTitle")} className="mt-2" />
            </div>
          )}

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
                <h3 className="font-display text-base font-semibold text-foreground">JSON-LD</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="mt-3 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/40 p-4 font-mono text-sm text-foreground">
                {output}
              </pre>
            </div>
            <ShareActions title="Schema JSON-LD" text={output} />
            <AdSlot label="Advertisement" />
          </>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">Enter a name to generate your schema.</p>
          </div>
        )}
      </div>
    </div>
  );
}
