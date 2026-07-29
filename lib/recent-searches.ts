const STORAGE_KEY = "toolverse:recent-searches";
const MAX_RECENT = 5;

/** Popular, curated search terms — each verified to return a strong result with the current ranking algorithm. */
export const POPULAR_SEARCHES = [
  "Email Writer",
  "Resume",
  "EMI Calculator",
  "YouTube Tags",
  "Password Generator",
  "Image Compressor",
];

/**
 * Reads recent searches from localStorage. Defensive against every way
 * this can fail: server-side rendering (no `window`), private browsing
 * (storage access throws), and corrupted/foreign data in the key
 * (parses to something that isn't a string array) — any of these
 * quietly returns an empty list rather than crashing the search UI.
 */
export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string").slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

/** Adds a search term to the front of the recent list, de-duplicated, capped at MAX_RECENT. Silently no-ops if storage is unavailable. */
export function addRecentSearch(term: string): string[] {
  const trimmed = term.trim();
  if (!trimmed) return getRecentSearches();
  const current = getRecentSearches();
  const next = [trimmed, ...current.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable (private browsing, quota exceeded, etc.) — the
      // search still works this session, it just won't persist. Not worth
      // surfacing an error for.
    }
  }
  return next;
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Same reasoning as above — safe to ignore.
  }
}
