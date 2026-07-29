const STORAGE_KEY = "toolverse:recent-tools";
const MAX_RECENT = 8;

export interface RecentToolEntry {
  slug: string;
  visitedAt: string;
}

export function getRecentToolSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is RecentToolEntry => typeof item === "object" && item !== null && typeof (item as RecentToolEntry).slug === "string")
      .map((item) => item.slug);
  } catch {
    return [];
  }
}

/** Records a tool visit — called once on mount from the tool page itself. De-duplicates (a re-visit moves to the front rather than adding a second entry). */
export function trackToolVisit(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const current: RecentToolEntry[] = Array.isArray(parsed)
      ? parsed.filter((item): item is RecentToolEntry => typeof item === "object" && item !== null && typeof (item as RecentToolEntry).slug === "string")
      : [];
    const next = [{ slug, visitedAt: new Date().toISOString() }, ...current.filter((entry) => entry.slug !== slug)].slice(0, MAX_RECENT);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Safe to ignore — same reasoning as lib/favorites.ts.
  }
}
