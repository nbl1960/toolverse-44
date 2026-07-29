const STORAGE_KEY = "toolverse:favorites";
const STORAGE_EVENT = "toolverse:favorites-changed";

/** Defensive against SSR, private browsing, and corrupted data — same pattern as lib/recent-searches.ts. */
export function getFavoriteSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function isFavorite(slug: string): boolean {
  return getFavoriteSlugs().includes(slug);
}

/** Toggles a tool's favorite status and dispatches a same-tab event so every FavoriteButton instance for that tool stays in sync without prop drilling. */
export function toggleFavorite(slug: string): boolean {
  const current = getFavoriteSlugs();
  const isNowFavorite = !current.includes(slug);
  const next = isNowFavorite ? [...current, slug] : current.filter((s) => s !== slug);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { slug, isFavorite: isNowFavorite } }));
    } catch {
      // Storage unavailable — the toggle still reflects in this call's
      // return value for the current render, it just won't persist.
    }
  }
  return isNowFavorite;
}

export { STORAGE_EVENT as FAVORITES_CHANGED_EVENT };
