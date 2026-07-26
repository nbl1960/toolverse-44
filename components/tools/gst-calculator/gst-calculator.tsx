"use client";

import * as React from "react";
import { Percent, Receipt, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SummaryCards, type SummaryCardItem } from "@/components/shared/finance/summary-cards";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useGstCalculator } from "@/hooks/tools/gst-calculator/use-gst-calculator";
import { GST_RATE_OPTIONS } from "@/lib/tools/gst-calculator/constants";
import { formatCurrency } from "@/lib/finance/currency";
import { cn } from "@/lib/utils";

export function GstCalculator() {
  const { values, setField, result, errorMessage, reset } = useGstCalculator();

  const summaryItems: SummaryCardItem[] = React.useMemo(() => {
    if (!result) return [];
    return [
      { key: "original", label: values.mode === "add" ? "Original amount" : "Amount before tax", value: formatCurrency(result.originalAmount), icon: Wallet },
      { key: "gst", label: "GST amount", value: formatCurrency(result.gstAmount), icon: Percent, emphasis: true },
      { key: "total", label: "Total amount", value: formatCurrency(result.totalAmount), icon: Receipt },
    ];
  }, [result, values.mode]);

  const shareText = result
    ? `GST calculation: ${formatCurrency(result.originalAmount)} + ${formatCurrency(result.gstAmount)} GST = ${formatCurrency(result.totalAmount)}`
    : "";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
      <div className="lg:sticky lg:top-20">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
          <div role="radiogroup" aria-label="Mode" className="grid grid-cols-2 gap-1 rounded-md border border-border bg-muted/40 p-1">
            {(["add", "remove"] as const).map((mode) => {
              const isSelected = values.mode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setField("mode", mode)}
                  className={cn(
                    "rounded px-2 py-1.5 text-sm font-medium transition-all duration-150",
                    isSelected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {mode === "add" ? "Add GST" : "Remove GST"}
                </button>
              );
            })}
          </div>

          <div>
            <Label htmlFor="amount">{values.mode === "add" ? "Amount (excluding GST)" : "Amount (including GST)"}</Label>
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              min={0}
              value={values.amount}
              onChange={(e) => setField("amount", Number(e.target.value) || 0)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="rate">GST rate</Label>
            <div role="radiogroup" aria-label="GST rate" className="mt-2 grid grid-cols-4 gap-1 rounded-md border border-border bg-muted/40 p-1">
              {GST_RATE_OPTIONS.map((rate) => {
                const isSelected = values.rate === rate;
                return (
                  <button
                    key={rate}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setField("rate", rate)}
                    className={cn(
                      "rounded px-2 py-1.5 text-sm font-medium transition-all duration-150",
                      isSelected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {rate}%
                  </button>
                );
              })}
            </div>
          </div>

          {errorMessage && (
            <p role="alert" className="text-xs text-destructive">
              {errorMessage}
            </p>
          )}

          <Button type="button" variant="outline" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {result ? (
          <>
            <SummaryCards items={summaryItems} />

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <h3 className="font-display text-base font-semibold text-foreground">GST breakdown</h3>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">CGST (Central)</p>
                  <p className="mt-0.5 font-display text-lg font-semibold text-foreground">{formatCurrency(result.cgst)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">SGST (State)</p>
                  <p className="mt-0.5 font-display text-lg font-semibold text-foreground">{formatCurrency(result.sgst)}</p>
                </div>
              </div>
            </div>

            <ShareActions title="GST Calculator results" text={shareText} />

            <AdSlot label="Advertisement" />
          </>
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">{errorMessage ?? "Enter an amount to see the GST breakdown."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
