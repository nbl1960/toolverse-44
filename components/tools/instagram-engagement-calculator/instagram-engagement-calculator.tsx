"use client";

import * as React from "react";
import { Heart, MessagesSquare, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SummaryCards, type SummaryCardItem } from "@/components/shared/finance/summary-cards";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useInstagramEngagementCalculator } from "@/hooks/tools/instagram-engagement-calculator/use-instagram-engagement-calculator";
import { MAX_FOLLOWERS, MAX_INTERACTIONS, MIN_VALUE } from "@/lib/tools/instagram-engagement-calculator/constants";
import { trackEvent } from "@/lib/analytics";
import type { EngagementFormValues } from "@/lib/tools/instagram-engagement-calculator/types";

function parseNumber(raw: string): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function InstagramEngagementCalculator() {
  const { values, setField, result, errorMessage, reset } = useInstagramEngagementCalculator();

  const summaryItems: SummaryCardItem[] = React.useMemo(() => {
    if (!result) return [];
    return [
      {
        key: "interactions",
        label: "Total interactions",
        value: result.totalInteractions.toLocaleString(),
        icon: Heart,
      },
      {
        key: "rate",
        label: "Engagement rate",
        value: `${result.engagementRate.toFixed(2)}%`,
        icon: TrendingUp,
        emphasis: true,
      },
      {
        key: "rating",
        label: "Rating",
        value: result.rating,
        icon: MessagesSquare,
      },
    ];
  }, [result]);

  const shareText = result
    ? `Instagram engagement rate: ${result.engagementRate.toFixed(2)}% (${result.rating})\nFollowers: ${values.followers.toLocaleString()}\nTotal interactions: ${result.totalInteractions.toLocaleString()}`
    : "";

  function handleReset() {
    trackEvent("reset_click", { tool: "instagram-engagement-calculator" });
    reset();
  }

  function fieldProps(key: keyof EngagementFormValues) {
    return {
      value: values[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField(key, parseNumber(e.target.value)),
      type: "number" as const,
      inputMode: "numeric" as const,
      min: MIN_VALUE,
      max: key === "followers" ? MAX_FOLLOWERS : MAX_INTERACTIONS,
    };
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
      <div className="lg:sticky lg:top-20">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
          <div>
            <Label htmlFor="followers">Followers</Label>
            <Input id="followers" className="mt-2" {...fieldProps("followers")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="likes">Likes</Label>
              <Input id="likes" className="mt-2" {...fieldProps("likes")} />
            </div>
            <div>
              <Label htmlFor="comments">Comments</Label>
              <Input id="comments" className="mt-2" {...fieldProps("comments")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shares">Shares (optional)</Label>
              <Input id="shares" className="mt-2" {...fieldProps("shares")} />
            </div>
            <div>
              <Label htmlFor="saves">Saves (optional)</Label>
              <Input id="saves" className="mt-2" {...fieldProps("saves")} />
            </div>
          </div>
          {errorMessage && (
            <p role="alert" className="text-xs text-destructive">
              {errorMessage}
            </p>
          )}
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {result ? (
          <>
            <SummaryCards items={summaryItems} />
            <ShareActions title="Instagram Engagement Calculator results" text={shareText} />
            <AdSlot label="Advertisement" />
          </>
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {errorMessage ?? "Enter your post stats to see your engagement rate."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
