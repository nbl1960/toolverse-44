"use client";

import { AlertTriangle, Check, Eraser, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useJwtDecoder } from "@/hooks/tools/jwt-decoder/use-jwt-decoder";
import { cn } from "@/lib/utils";

export function JwtDecoder() {
  const { token, setToken, result, errorMessage, reset } = useJwtDecoder();

  const shareText = result ? `JWT Header:\n${result.header}\n\nPayload:\n${result.payload}` : "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
        <div>
          <Label htmlFor="token">JWT to decode</Label>
          <Textarea
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            rows={5}
            className="mt-2 font-mono text-xs"
          />
          {errorMessage && (
            <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {errorMessage}
            </p>
          )}
        </div>
        {token && (
          <Button type="button" variant="outline" onClick={reset} className="self-start">
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {result && (
        <div className="flex flex-col gap-4 animate-fade-up">
          {result.isExpired !== null && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border p-4 text-sm",
                result.isExpired ? "border-destructive/40 bg-destructive/5 text-destructive" : "border-success/40 bg-success/5 text-success"
              )}
            >
              {result.isExpired ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              {result.isExpired ? "This token has expired" : "This token is not expired"}
              {result.expiresAt && <span className="text-muted-foreground">— exp: {result.expiresAt}</span>}
            </div>
          )}

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-brass">Header</p>
            <pre className="mt-3 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/40 p-4 font-mono text-sm text-foreground">
              {result.header}
            </pre>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-brass">Payload</p>
            <pre className="mt-3 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/40 p-4 font-mono text-sm text-foreground">
              {result.payload}
            </pre>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-brass">Signature (not verified)</p>
            <code className="mt-3 block break-all font-mono text-xs text-muted-foreground">{result.signature}</code>
          </div>

          <ShareActions title="Decoded JWT" text={shareText} />

          <AdSlot label="Advertisement" />
        </div>
      )}
    </div>
  );
}
