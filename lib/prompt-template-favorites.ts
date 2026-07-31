const STORAGE_KEY = "toolverse:prompt-template-favorites";
const STORAGE_EVENT = "toolverse:prompt-template-favorites-changed";

/** Defensive against SSR, private browsing, and corrupted data — same pattern as lib/favorites.ts (tool favorites), kept separate since templates and tools are different domains with different IDs. */
export function getFavoriteTemplateIds(): string[] {
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

export function isTemplateFavorite(id: string): boolean {
  return getFavoriteTemplateIds().includes(id);
}

export function toggleTemplateFavorite(id: string): boolean {
  const current = getFavoriteTemplateIds();
  const isNowFavorite = !current.includes(id);
  const next = isNowFavorite ? [...current, id] : current.filter((existing) => existing !== id);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { id, isFavorite: isNowFavorite } }));
    } catch {
      // Storage unavailable — the toggle still reflects for this render, it just won't persist.
    }
  }
  return isNowFavorite;
}

export { STORAGE_EVENT as TEMPLATE_FAVORITES_CHANGED_EVENT };
