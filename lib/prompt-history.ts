import type { PromptHistoryEntry, TargetModelId } from "./prompt-studio/types";

const STORAGE_KEY = "toolverse:prompt-history";
const MAX_ENTRIES = 20;

/** Defensive against SSR, private browsing, and corrupted data — same pattern as lib/recent-searches.ts and lib/favorites.ts. */
export function getPromptHistory(): PromptHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is PromptHistoryEntry =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as PromptHistoryEntry).id === "string" &&
        typeof (item as PromptHistoryEntry).input === "string" &&
        typeof (item as PromptHistoryEntry).output === "string"
    );
  } catch {
    return [];
  }
}

export function addPromptHistoryEntry(input: string, output: string, targetModel: TargetModelId): PromptHistoryEntry[] {
  const entry: PromptHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    input,
    output,
    targetModel,
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...getPromptHistory()].slice(0, MAX_ENTRIES);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable — safe to ignore, same reasoning as elsewhere.
    }
  }
  return next;
}

export function removePromptHistoryEntry(id: string): PromptHistoryEntry[] {
  const next = getPromptHistory().filter((entry) => entry.id !== id);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Safe to ignore.
    }
  }
  return next;
}

export function clearPromptHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Safe to ignore.
  }
}
