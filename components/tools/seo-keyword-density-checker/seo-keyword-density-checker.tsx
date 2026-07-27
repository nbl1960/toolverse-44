"use client";

import { Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useKeywordDensityChecker } from "@/hooks/tools/keyword-density-checker/use-keyword-density-checker";
import { MAX_TEXT_LENGTH } from "@/lib/tools/keyword-density-checker/constants";

export function SeoKeywordDensityChecker() {
  const { text, setText, targetKeyword, setTargetKeyword, result, reset } = useKeywordDensityChecker();

  const shareText = result
    ? `Keyword density analysis: ${result.totalWords} words${result.targetKeyword ? `, "${result.targetKeyword.word}" density: ${result.targetKeyword.density.toFixed(2)}%` : ""}`
    : "";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
      <div className="lg:sticky lg:top-20">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
          <div>
            <Label htmlFor="targetKeyword">Target keyword (optional)</Label>
            <Input
              id="targetKeyword"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="e.g. mechanical keyboard"
              className="mt-2"
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="text">Text to analyze</Label>
              <span className="font-mono text-[11px] text-muted-foreground">{text.length}/{MAX_TEXT_LENGTH}</span>
            </div>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT_LENGTH))}
              placeholder="Paste your article, product description, or page copy…"
              rows={10}
              className="mt-2"
            />
          </div>
          <Button type="button" variant="outline" onClick={reset}>
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {result ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-5 text-center shadow-sm">
                <p className="font-display text-2xl font-semibold text-foreground">{result.totalWords.toLocaleString()}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Total words</p>
              </div>
              {result.targetKeyword && (
                <div className="rounded-lg border border-brass/50 bg-accent p-5 text-center shadow-sm">
                  <p className="font-display text-2xl font-semibold text-foreground">{result.targetKeyword.density.toFixed(2)}%</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    &quot;{result.targetKeyword.word}&quot; — {result.targetKeyword.count} occurrence{result.targetKeyword.count === 1 ? "" : "s"}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <h3 className="font-display text-base font-semibold text-foreground">Most frequent words</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="py-2 pr-4 font-medium">Word</th>
                      <th className="py-2 pr-4 font-medium">Count</th>
                      <th className="py-2 font-medium">Density</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.topWords.map((entry) => (
                      <tr key={entry.word} className="border-b border-border/60 last:border-0">
                        <td className="py-2 pr-4 font-medium text-foreground">{entry.word}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{entry.count}</td>
                        <td className="py-2 text-muted-foreground">{entry.density.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <ShareActions title="Keyword density results" text={shareText} />

            <AdSlot label="Advertisement" />
          </>
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">Paste some text to see its keyword density breakdown.</p>
          </div>
        )}
      </div>
    </div>
  );
}
