"use client";

import * as React from "react";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearPromptHistory, getPromptHistory, removePromptHistoryEntry } from "@/lib/prompt-history";
import { getTargetModel } from "@/lib/prompt-studio/models";
import type { PromptHistoryEntry } from "@/lib/prompt-studio/types";

/**
 * Reads from localStorage, so this has to be a client component that
 * loads on mount rather than at render time — same reasoning as
 * DashboardContent for Favorites/Recently Used.
 */
export function PromptHistoryPanel() {
  const [entries, setEntries] = React.useState<PromptHistoryEntry[] | null>(null);

  React.useEffect(() => {
    setEntries(getPromptHistory());
  }, []);

  function handleRemove(id: string) {
    setEntries(removePromptHistoryEntry(id));
  }

  function handleClear() {
    clearPromptHistory();
    setEntries([]);
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
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">{entry.input}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {getTargetModel(entry.targetModel)?.name ?? entry.targetModel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(entry.id)}
                aria-label={`Remove "${entry.input}" from history`}
                className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
