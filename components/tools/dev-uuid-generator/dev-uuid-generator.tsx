"use client";

import * as React from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useUuidGenerator } from "@/hooks/tools/uuid-generator/use-uuid-generator";
import { MAX_COUNT, MIN_COUNT } from "@/lib/tools/uuid-generator/constants";
import { copyToClipboard } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function DevUuidGenerator() {
  const { count, setCount, uuids, regenerate } = useUuidGenerator();
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [copiedAll, setCopiedAll] = React.useState(false);

  async function handleCopyOne(index: number, value: string) {
    const success = await copyToClipboard(value);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((current) => (current === index ? null : current)), 2000);
    }
  }

  async function handleCopyAll() {
    const success = await copyToClipboard(uuids.join("\n"));
    if (success) {
      trackEvent("copy_click", { tool: "dev-uuid-generator" });
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  }

  function handleRegenerate() {
    trackEvent("generate_click", { tool: "dev-uuid-generator" });
    regenerate();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[160px]">
          <Label htmlFor="count">How many?</Label>
          <Input
            id="count"
            type="number"
            inputMode="numeric"
            min={MIN_COUNT}
            max={MAX_COUNT}
            value={count}
            onChange={(e) => setCount(Math.min(MAX_COUNT, Math.max(MIN_COUNT, Number(e.target.value) || MIN_COUNT)))}
            className="mt-2"
          />
        </div>
        <Button type="button" onClick={handleRegenerate}>
          <RefreshCw className="h-4 w-4" />
          Generate
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-base font-semibold text-foreground">
              {uuids.length} UUID{uuids.length === 1 ? "" : "s"}
            </h3>
            <Button type="button" variant="outline" size="sm" onClick={() => void handleCopyAll()}>
              {copiedAll ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedAll ? "Copied" : "Copy all"}
            </Button>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {uuids.map((uuid, index) => (
              <li
                key={uuid}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-3 py-2"
              >
                <code className="truncate font-mono text-sm text-foreground">{uuid}</code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleCopyOne(index, uuid)}
                  className="shrink-0"
                >
                  {copiedIndex === index ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <ShareActions title="Generated UUIDs" text={uuids.join("\n")} />

        <AdSlot label="Advertisement" />
      </div>
    </div>
  );
}
