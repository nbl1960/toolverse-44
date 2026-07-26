"use client";

import { Download, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useQrCodeGenerator } from "@/hooks/tools/qr-code-generator/use-qr-code-generator";
import { MAX_TEXT_LENGTH, SIZE_OPTIONS } from "@/lib/tools/qr-code-generator/constants";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function QrCodeGenerator() {
  const { text, setText, size, setSize, qrCodeUrl, reset } = useQrCodeGenerator();

  function handleDownload() {
    if (!qrCodeUrl) return;
    trackEvent("export_click", { tool: "qr-code-generator" });
    window.open(qrCodeUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="text">Text or URL to encode</Label>
            <span className="font-mono text-[11px] text-muted-foreground">{text.length}/{MAX_TEXT_LENGTH}</span>
          </div>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT_LENGTH))}
            placeholder="https://example.com"
            rows={3}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Size</Label>
          <div role="radiogroup" aria-label="QR code size" className="mt-2 grid grid-cols-4 gap-1 rounded-md border border-border bg-muted/40 p-1">
            {SIZE_OPTIONS.map((option) => {
              const isSelected = size === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSize(option)}
                  className={cn(
                    "rounded px-2 py-1.5 text-xs font-medium transition-all duration-150",
                    isSelected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {option}px
                </button>
              );
            })}
          </div>
        </div>
        {text && (
          <Button type="button" variant="outline" onClick={reset} className="self-start">
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {qrCodeUrl ? (
        <div className="flex flex-col gap-6 animate-fade-up">
          <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- external, dynamically-generated QR image from a public API, not a static/remote asset Next's optimizer can handle. */}
            <img src={qrCodeUrl} alt={`QR code for: ${text}`} width={size} height={size} className="rounded-md border border-border" />
            <Button type="button" variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Open full size / Save image
            </Button>
          </div>

          <ShareActions title="QR code" text={`QR code for: ${text}`} />

          <AdSlot label="Advertisement" />
        </div>
      ) : (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">Enter text or a URL above to generate your QR code.</p>
        </div>
      )}
    </div>
  );
}
