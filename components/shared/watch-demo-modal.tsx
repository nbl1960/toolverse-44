"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, RotateCcw, Search, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resolveIcon } from "@/lib/icon-map";
import { SITE_BRAND_LINE, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface WatchDemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEMO_QUERY = "I want to compress an image before uploading it";

/**
 * Real tool data (name, icon, route) for the three tools this scripted
 * demo shows — pulled from the actual registry values, not invented
 * copy, so the demo shows exactly what a real visitor would see.
 */
const DEMO_RESULTS = [
  { slug: "image-compressor", name: "Image Compressor", iconName: "Minimize2", confidence: "Best Match" as const },
  { slug: "image-resizer", name: "Image Resizer", iconName: "Maximize2", confidence: "Good Match" as const },
  { slug: "webp-converter", name: "WebP Converter", iconName: "RefreshCw", confidence: "Related" as const },
];

const CONFIDENCE_STYLES = {
  "Best Match": "border-success/40 bg-success/10 text-success",
  "Good Match": "border-brass/40 bg-accent text-brass",
  Related: "border-border bg-muted text-muted-foreground",
};

type Scene = "typing" | "thinking" | "results" | "click" | "end";

// Timing adds up to ~20 seconds total, matching the "20 Second Demo" promise.
const SCENE_DURATIONS_MS: Record<Scene, number> = {
  typing: 3200,
  thinking: 1400,
  results: 8000,
  click: 2200,
  end: 5200,
};

const SCENE_ORDER: Scene[] = ["typing", "thinking", "results", "click", "end"];

/**
 * A lightweight animated storyboard, not an embedded video — there's no
 * recorded video asset to show, and building one wasn't possible here.
 * Rather than fake a `<video>` element pointing at a file that doesn't
 * exist, this plays through real UI states (typing, matching, results,
 * opening a tool) using genuine tool names, icons, and confidence tiers
 * from the actual registry, so what's shown is an accurate — if
 * scripted — walkthrough rather than a real-time AI call. It only ever
 * starts once someone opens the modal (a deliberate click), never on
 * page load.
 */
export function WatchDemoModal({ open, onOpenChange }: WatchDemoModalProps) {
  const [sceneIndex, setSceneIndex] = React.useState(0);
  const [typedLength, setTypedLength] = React.useState(0);
  const [visibleResults, setVisibleResults] = React.useState(0);
  const scene = SCENE_ORDER[sceneIndex] ?? "typing";

  const resetAndPlay = React.useCallback(() => {
    setSceneIndex(0);
    setTypedLength(0);
    setVisibleResults(0);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    resetAndPlay();
    trackEvent("watch_demo_open");
  }, [open, resetAndPlay]);

  // Advances through the scripted scenes automatically once playing —
  // this is the "playback" of a demo the person already chose to open,
  // not autoplay on page load.
  React.useEffect(() => {
    if (!open) return;
    if (scene === "end") return; // holds on the end screen until replayed or closed
    const timer = setTimeout(() => {
      setSceneIndex((i) => Math.min(i + 1, SCENE_ORDER.length - 1));
    }, SCENE_DURATIONS_MS[scene]);
    return () => clearTimeout(timer);
  }, [open, scene]);

  // Typewriter effect for the query during the "typing" scene.
  React.useEffect(() => {
    if (!open || scene !== "typing") return;
    if (typedLength >= DEMO_QUERY.length) return;
    const timer = setTimeout(() => setTypedLength((n) => n + 1), 45);
    return () => clearTimeout(timer);
  }, [open, scene, typedLength]);

  // Staggers result cards in one at a time during the "results" scene.
  React.useEffect(() => {
    if (!open || scene !== "results") return;
    if (visibleResults >= DEMO_RESULTS.length) return;
    const timer = setTimeout(() => setVisibleResults((n) => n + 1), 700);
    return () => clearTimeout(timer);
  }, [open, scene, visibleResults]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>See ToolVerse AI in action</DialogTitle>
        </DialogHeader>

        <div className="min-h-[280px] px-6 pb-6">
          {(scene === "typing" || scene === "thinking" || scene === "results" || scene === "click") && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <div className="flex h-11 items-center rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground">
                  {DEMO_QUERY.slice(0, typedLength)}
                  {scene === "typing" && (
                    <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-brass" aria-hidden="true" />
                  )}
                </div>
              </div>

              {scene === "thinking" && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  ToolVerse AI is thinking
                  <span className="inline-flex gap-0.5" aria-hidden="true">
                    <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                  </span>
                </p>
              )}

              {(scene === "results" || scene === "click") && (
                <div className="flex flex-col gap-2">
                  {DEMO_RESULTS.slice(0, scene === "click" ? 1 : visibleResults).map((result, index) => {
                    const Icon = resolveIcon(result.iconName as Parameters<typeof resolveIcon>[0]);
                    const isClickTarget = scene === "click" && index === 0;
                    return (
                      <div
                        key={result.slug}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-3 animate-fade-up",
                          isClickTarget && "ring-2 ring-brass/60"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brass/50 bg-primary text-primary-foreground">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{result.name}</p>
                            <span
                              className={cn(
                                "mt-0.5 inline-block rounded-full border px-1.5 py-0 text-[9px] font-medium uppercase tracking-wide",
                                CONFIDENCE_STYLES[result.confidence]
                              )}
                            >
                              {result.confidence}
                            </span>
                          </div>
                        </div>
                        {isClickTarget && (
                          <span className="flex shrink-0 items-center gap-1 rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground">
                            <Check className="h-3 w-3" aria-hidden="true" />
                            Opening…
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {scene === "results" && visibleResults < DEMO_RESULTS.length && (
                    <div className="h-[52px] animate-pulse rounded-lg border border-border bg-muted/40" />
                  )}
                </div>
              )}
            </div>
          )}

          {scene === "end" && (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <Sparkles className="h-6 w-6 text-brass" aria-hidden="true" />
              <p className="font-display text-lg font-semibold text-foreground">{SITE_NAME}</p>
              <p className="text-xs text-muted-foreground">{SITE_BRAND_LINE}</p>
              <p className="mt-2 text-sm text-foreground">{SITE_TAGLINE}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{SITE_URL.replace(/^https?:\/\//, "")}</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={resetAndPlay}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Replay
                </button>
                <Link
                  href="/tools/image-compressor"
                  onClick={() => {
                    trackEvent("watch_demo_cta_click");
                    onOpenChange(false);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-brass-dark"
                >
                  Try it yourself
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
