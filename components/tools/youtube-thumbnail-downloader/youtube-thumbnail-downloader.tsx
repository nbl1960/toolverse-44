"use client";

import * as React from "react";
import { AlertTriangle, Download, Eraser, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useYoutubeThumbnailDownloader } from "@/hooks/tools/youtube-thumbnail-downloader/use-youtube-thumbnail-downloader";

export function YoutubeThumbnailDownloader() {
  const { url, setUrl, videoId, options, errorMessage, reset } = useYoutubeThumbnailDownloader();
  const [unavailable, setUnavailable] = React.useState<Set<string>>(new Set());

  // Reset "unavailable" tracking whenever the video changes, so a new
  // video's maxresdefault gets a fresh chance to load.
  React.useEffect(() => {
    setUnavailable(new Set());
  }, [videoId]);

  function markUnavailable(key: string) {
    setUnavailable((prev) => new Set(prev).add(key));
  }

  const visibleOptions = options?.filter((option) => !unavailable.has(option.key)) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
        <div>
          <Label htmlFor="youtube-url">YouTube video URL</Label>
          <div className="relative mt-2">
            <Youtube
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="youtube-url"
              type="url"
              inputMode="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-9"
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? "youtube-url-error" : undefined}
            />
          </div>
          {errorMessage && (
            <p
              id="youtube-url-error"
              role="alert"
              className="mt-2 flex items-center gap-1.5 text-xs text-destructive"
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {errorMessage}
            </p>
          )}
        </div>
        {url && (
          <Button type="button" variant="outline" onClick={reset} className="self-start">
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {videoId && visibleOptions && (
        <div className="flex flex-col gap-6 animate-fade-up">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- external, dynamically-resolved YouTube CDN image; not a candidate for Next's built-in optimizer, and unsuited to it under this app's Cloudflare Workers deployment target. */}
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt="Video thumbnail preview"
              width={480}
              height={360}
              className="w-full"
              loading="eager"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h3 className="font-display text-base font-semibold text-foreground">
              Available resolutions
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Right-click (or press and hold) any preview to save it directly, or use the download
              button.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {visibleOptions.map((option) => (
                <div
                  key={option.key}
                  className="flex items-center gap-3 rounded-md border border-border p-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- see note above */}
                  <img
                    src={option.url}
                    alt={`${option.label} thumbnail (${option.resolution})`}
                    className="h-14 w-24 shrink-0 rounded object-cover"
                    loading="lazy"
                    onError={() => markUnavailable(option.key)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.resolution}</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <a href={option.url} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <AdSlot label="Advertisement" />
        </div>
      )}

      {!videoId && !errorMessage && (
        <div className="flex min-h-[160px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Paste a YouTube video URL above to see its available thumbnails.
          </p>
        </div>
      )}
    </div>
  );
}
