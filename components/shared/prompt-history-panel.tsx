"use client";

import * as React from "react";
import { Check, ChevronDown, Clock, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearPromptHistory, getPromptHistory, removePromptHistoryEntry } from "@/lib/prompt-history";
import { getTargetModel } from "@/lib/prompt-studio/models";
import { cn } from "@/lib/utils";
import type { PromptHistoryEntry } from "@/lib/prompt-studio/types";

/**
 * Reads from localStorage, so this has to be a client component that
 * loads on mount rather than at render time — same reasoning as
 * DashboardContent for Favorites/Recently Used. Entries expand in place
 * to show the full stored output with its own copy button — a history
 * list you can only delete from, never actually reuse, isn't much of a
 * history feature.
 */
export function PromptHistoryPanel() {
  const [entries, setEntries] = React.useState<PromptHistoryEntry[] | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setEntries(getPromptHistory());
  }, []);

  function handleRemove(id: string) {
    setEntries(removePromptHistoryEntry(id));
    if (expandedId === id) setExpandedId(null);
  }

  function handleClear() {
    clearPromptHistory();
    setEntries([]);
    setExpandedId(null);
  }

  async function handleCopy(id: string, output: string) {
    try {
      await navigator.clipboard.writeText(output);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard can fail — the text is still visible on screen either way.
    }
  }

  if (entries === null) {
    return <div className="h-24 animate-pulse rounded-lg border border-border bg-card" aria-hidden="true" />;
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card px-4 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Prompts you generate will show up here — stored on this device only.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Clock className="h-3 w-3" aria-hidden="true" />
          History
        </p>
        <Button size="sm" variant="outline" onClick={handleClear}>
          <Trash2 className="h-3.5 w-3.5" />
          Clear all
        </Button>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {entries.map((entry) => {
          const isExpanded = expandedId === entry.id;
          return (
            <div key={entry.id} className="rounded-lg border border-border bg-card p-3">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                aria-expanded={isExpanded}
                className="flex w-full items-start justify-between gap-2 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{entry.input}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {getTargetModel(entry.targetModel)?.name ?? entry.targetModel}
                  </p>
                </div>
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isExpanded && "rotate-180")}
                  aria-hidden="true"
                />
              </button>

              {isExpanded && (
                <div className="mt-3 border-t border-border pt-3">
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">{entry.output}</p>
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => void handleCopy(entry.id, entry.output)}>
                      {copiedId === entry.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedId === entry.id ? "Copied" : "Copy"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleRemove(entry.id)}
                      aria-label={`Remove "${entry.input}" from history`}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
