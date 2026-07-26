"use client";

import * as React from "react";
import { Download, Eraser, ImageUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { processImage, downloadImageBlob, formatBytes, type ProcessImageResult } from "@/lib/image-processing";
import { trackEvent } from "@/lib/analytics";

export interface ImageTransformToolProps {
  toolSlug: string;
  /** Accepted input MIME types for the file picker, e.g. "image/png,image/webp". */
  acceptTypes: string;
  outputMimeType: string;
  outputExtension: string;
  downloadFilenamePrefix: string;
  /** Shows a 0-100 quality slider (compressor, and lossy converters). */
  showQualityControl?: boolean;
  defaultQuality?: number;
  /** Shows width/height inputs (resizer). */
  showDimensionControls?: boolean;
  actionLabel: string;
}

/**
 * Shared UI for every Canvas-based Image Studio tool (Compressor,
 * Resizer, PNG↔JPG, WebP Converter) — one implementation, each tool
 * supplies its own target format/quality/dimension configuration. All
 * processing happens via lib/image-processing.ts, entirely in the
 * browser — no file is ever uploaded to a server.
 */
export function ImageTransformTool({
  toolSlug,
  acceptTypes,
  outputMimeType,
  outputExtension,
  downloadFilenamePrefix,
  showQualityControl = false,
  defaultQuality = 80,
  showDimensionControls = false,
  actionLabel,
}: ImageTransformToolProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [quality, setQuality] = React.useState(defaultQuality);
  const [width, setWidth] = React.useState<string>("");
  const [height, setHeight] = React.useState<string>("");
  const [naturalSize, setNaturalSize] = React.useState<{ width: number; height: number } | null>(null);
  const [result, setResult] = React.useState<ProcessImageResult | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setResult(null);
    setErrorMessage(null);

    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    const img = new window.Image();
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      if (showDimensionControls) {
        setWidth(String(img.naturalWidth));
        setHeight(String(img.naturalHeight));
      }
    };
    img.src = url;
  }

  function handleClear() {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setErrorMessage(null);
    setNaturalSize(null);
    setWidth("");
    setHeight("");
  }

  async function handleProcess() {
    if (!file) return;
    trackEvent("generate_click", { tool: toolSlug });
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const targetWidth = showDimensionControls && width ? Number(width) : undefined;
      const targetHeight = showDimensionControls && height ? Number(height) : undefined;
      const processed = await processImage(file, {
        mimeType: outputMimeType,
        quality: showQualityControl ? quality / 100 : undefined,
        targetWidth,
        targetHeight,
      });
      setResult(processed);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Couldn't process this image.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    trackEvent("export_click", { tool: toolSlug });
    downloadImageBlob(result.blob, `${downloadFilenamePrefix}.${outputExtension}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
        <div>
          <Label htmlFor="file">Choose an image</Label>
          <Input id="file" type="file" accept={acceptTypes} onChange={handleFileChange} className="mt-2" />
        </div>

        {previewUrl && (
          /* eslint-disable-next-line @next/next/no-img-element -- user-supplied local file via object URL, not a static/remote asset Next's optimizer can handle. */
          <img src={previewUrl} alt="Selected image preview" className="max-h-64 w-auto rounded-md border border-border object-contain" />
        )}

        {naturalSize && (
          <p className="text-xs text-muted-foreground">
            Original: {naturalSize.width}×{naturalSize.height}px, {formatBytes(file?.size ?? 0)}
          </p>
        )}

        {showQualityControl && (
          <div>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="quality">Quality</Label>
              <span className="font-mono text-[11px] text-muted-foreground">{quality}%</span>
            </div>
            <input
              id="quality"
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="mt-2 h-9 w-full cursor-pointer"
            />
          </div>
        )}

        {showDimensionControls && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="width">Width (px)</Label>
              <Input id="width" type="number" inputMode="numeric" min={1} value={width} onChange={(e) => setWidth(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="height">Height (px)</Label>
              <Input id="height" type="number" inputMode="numeric" min={1} value={height} onChange={(e) => setHeight(e.target.value)} className="mt-2" />
            </div>
          </div>
        )}

        {errorMessage && (
          <p role="alert" className="text-xs text-destructive">
            {errorMessage}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={handleClear} disabled={isProcessing} className="sm:flex-none">
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
          <Button type="button" onClick={() => void handleProcess()} disabled={!file || isProcessing} className="flex-1">
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <ImageUp className="h-4 w-4" />
                {actionLabel}
              </>
            )}
          </Button>
        </div>
      </div>

      {result && (
        <div className="flex flex-col gap-4 animate-fade-up">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">Result</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {result.width}×{result.height}px, {formatBytes(result.newSize)}
                  {result.newSize < result.originalSize && (
                    <> — {Math.round((1 - result.newSize / result.originalSize) * 100)}% smaller</>
                  )}
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- locally generated data URL, not a static/remote asset. */}
            <img src={result.dataUrl} alt="Processed result" className="mt-3 max-h-80 w-auto rounded-md border border-border object-contain" />
          </div>

          <ShareActions title="Image processed" text={`Processed image: ${result.width}×${result.height}px, ${formatBytes(result.newSize)}`} />

          <AdSlot label="Advertisement" />
        </div>
      )}
    </div>
  );
}
