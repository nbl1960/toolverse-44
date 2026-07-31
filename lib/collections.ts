const STORAGE_KEY = "toolverse:collections";
const STORAGE_EVENT = "toolverse:collections-changed";
const MAX_COLLECTIONS = 20;
const MAX_NAME_LENGTH = 50;

export interface Collection {
  id: string;
  name: string;
  toolSlugs: string[];
  createdAt: string;
}

function isCollection(value: unknown): value is Collection {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Collection).id === "string" &&
    typeof (value as Collection).name === "string" &&
    Array.isArray((value as Collection).toolSlugs)
  );
}

/** Defensive against SSR, private browsing, and corrupted data — same pattern as lib/favorites.ts. */
export function getCollections(): Collection[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCollection);
  } catch {
    return [];
  }
}

function persist(collections: Collection[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
  } catch {
    // Storage unavailable (private browsing, quota exceeded) — the
    // change still reflects in this call's return value for the
    // current render, it just won't persist across reloads.
  }
}

export function getCollection(id: string): Collection | undefined {
  return getCollections().find((c) => c.id === id);
}

export function createCollection(name: string): Collection[] {
  const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
  const current = getCollections();
  if (!trimmed || current.length >= MAX_COLLECTIONS) return current;
  const collection: Collection = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: trimmed,
    toolSlugs: [],
    createdAt: new Date().toISOString(),
  };
  const next = [...current, collection];
  persist(next);
  return next;
}

export function renameCollection(id: string, name: string): Collection[] {
  const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
  if (!trimmed) return getCollections();
  const next = getCollections().map((c) => (c.id === id ? { ...c, name: trimmed } : c));
  persist(next);
  return next;
}

export function deleteCollection(id: string): Collection[] {
  const next = getCollections().filter((c) => c.id !== id);
  persist(next);
  return next;
}

export function addToolToCollection(id: string, slug: string): Collection[] {
  const next = getCollections().map((c) =>
    c.id === id && !c.toolSlugs.includes(slug) ? { ...c, toolSlugs: [...c.toolSlugs, slug] } : c
  );
  persist(next);
  return next;
}

export function removeToolFromCollection(id: string, slug: string): Collection[] {
  const next = getCollections().map((c) =>
    c.id === id ? { ...c, toolSlugs: c.toolSlugs.filter((s) => s !== slug) } : c
  );
  persist(next);
  return next;
}

export function isToolInAnyCollection(slug: string): boolean {
  return getCollections().some((c) => c.toolSlugs.includes(slug));
}

export { STORAGE_EVENT as COLLECTIONS_CHANGED_EVENT, MAX_COLLECTIONS, MAX_NAME_LENGTH };
