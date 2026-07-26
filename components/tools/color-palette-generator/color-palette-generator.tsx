"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useColorPaletteGenerator } from "@/hooks/tools/color-palette-generator/use-color-palette-generator";
import { SCHEME_OPTIONS } from "@/lib/tools/color-palette-generator/constants";
import { copyToClipboard, cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function ColorPaletteGenerator() {
  const { baseColor, setBaseColor, scheme, setScheme, palette, errorMessage } = useColorPaletteGenerator();
  const [copiedHex, setCopiedHex] = React.useState<string | null>(null);

  async function handleCopy(hex: string) {
    const success = await copyToClipboard(hex);
    if (success) {
      trackEvent("copy_click", { tool: "color-palette-generator" });
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex((current) => (current === hex ? null : current)), 2000);
    }
  }

  const shareText = palette ? palette.map((c) => c.hex).join(", ") : "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7 sm:flex-row sm:items-end sm:gap-6">
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={/^#[0-9a-f]{6}$/i.test(baseColor) ? baseColor : "#3B82F6"}
            onChange={(e) => setBaseColor(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded border border-border"
            aria-label="Pick a base color"
          />
          <div>
            <Label htmlFor="baseColor">Base color</Label>
            <Input
              id="baseColor"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              placeholder="#3B82F6"
              className="mt-2 font-mono"
            />
          </div>
        </div>

        <div className="flex-1">
          <Label>Scheme</Label>
          <div role="radiogroup" aria-label="Color scheme" className="mt-2 grid grid-cols-2 gap-1 rounded-md border border-border bg-muted/40 p-1 sm:grid-cols-4">
            {SCHEME_OPTIONS.map((option) => {
              const isSelected = scheme === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setScheme(option.value)}
                  className={cn(
                    "rounded px-2 py-1.5 text-xs font-medium transition-all duration-150",
                    isSelected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      {palette && (
        <div className="flex flex-col gap-6 animate-fade-up">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            {palette.map((color, index) => (
              <div key={`${color.hex}-${index}`} className="overflow-hidden rounded-lg border border-border shadow-sm">
                <div className="h-24 w-full" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                <div className="flex items-center justify-between gap-2 bg-card p-3">
                  <code className="truncate font-mono text-xs text-foreground">{color.hex}</code>
                  <button
                    type="button"
                    onClick={() => void handleCopy(color.hex)}
                    aria-label={`Copy ${color.hex}`}
                    className="shrink-0 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {copiedHex === color.hex ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <ShareActions title="Color palette" text={shareText} />

          <AdSlot label="Advertisement" />
        </div>
      )}
    </div>
  );
}
