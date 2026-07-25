"use client";

import * as React from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { usePasswordGenerator } from "@/hooks/tools/password-generator/use-password-generator";
import { MAX_LENGTH, MIN_LENGTH } from "@/lib/tools/password-generator/constants";
import { copyToClipboard } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { PasswordOptions } from "@/lib/tools/password-generator/types";

const TOGGLE_OPTIONS: { key: keyof Omit<PasswordOptions, "length">; label: string }[] = [
  { key: "useUppercase", label: "Uppercase (A-Z)" },
  { key: "useLowercase", label: "Lowercase (a-z)" },
  { key: "useNumbers", label: "Numbers (0-9)" },
  { key: "useSymbols", label: "Symbols (!@#$...)" },
];

export function DevPasswordGenerator() {
  const { options, setOption, result, regenerate } = usePasswordGenerator();
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    if (!result) return;
    const success = await copyToClipboard(result.password);
    if (success) {
      trackEvent("copy_click", { tool: "dev-password-generator" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleRegenerate() {
    trackEvent("generate_click", { tool: "dev-password-generator" });
    regenerate();
  }

  const noPoolsSelected = !options.useUppercase && !options.useLowercase && !options.useNumbers && !options.useSymbols;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="length">Length</Label>
            <span className="font-mono text-[11px] text-muted-foreground">{options.length} characters</span>
          </div>
          <Input
            id="length"
            type="range"
            min={MIN_LENGTH}
            max={MAX_LENGTH}
            value={options.length}
            onChange={(e) => setOption("length", Number(e.target.value))}
            className="mt-2 h-9 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {TOGGLE_OPTIONS.map((toggle) => (
            <label
              key={toggle.key}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                checked={options[toggle.key]}
                onChange={(e) => setOption(toggle.key, e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              {toggle.label}
            </label>
          ))}
        </div>

        {noPoolsSelected && (
          <p role="alert" className="text-xs text-destructive">
            Select at least one character type.
          </p>
        )}

        <Button type="button" onClick={handleRegenerate} disabled={noPoolsSelected}>
          <RefreshCw className="h-4 w-4" />
          Generate new password
        </Button>
      </div>

      {result && (
        <div className="flex flex-col gap-6 animate-fade-up">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <code className="break-all font-mono text-lg font-medium text-foreground">{result.password}</code>
              <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()} className="shrink-0">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <p
              className={cn(
                "mt-3 text-sm font-medium",
                result.strength === "Very strong" && "text-success",
                result.strength === "Strong" && "text-success",
                result.strength === "Fair" && "text-brass",
                result.strength === "Weak" && "text-destructive"
              )}
            >
              Strength: {result.strength}
            </p>
          </div>

          <ShareActions title="Generated password" text={`Password strength: ${result.strength}`} />

          <AdSlot label="Advertisement" />
        </div>
      )}
    </div>
  );
}
