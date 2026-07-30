import { getAllTools } from "@/lib/tools-registry";
import { getCategoryBySlug } from "@/lib/categories";
import type { ToolDefinition } from "@/lib/types";

export type SearchMatchField = "name" | "category" | "keywords" | "description";

export interface SearchResult {
  tool: ToolDefinition;
  categoryName: string;
  /** Which field produced the best (highest-weighted) match — drives what gets highlighted. */
  matchField: SearchMatchField;
}

interface IndexEntry {
  tool: ToolDefinition;
  categoryName: string;
  nameLower: string;
  categoryLower: string;
  keywordsLower: string;
  descriptionLower: string;
}

let cachedIndex: IndexEntry[] | null = null;

/**
 * Builds the searchable index once (module-level memoization) rather
 * than recomputing it on every keystroke — with 100 tools this is
 * already trivially fast either way, but there's no reason to redo the
 * lowercase/join work per character typed. Rebuilding only happens once
 * per page load, the first time a search actually runs.
 */
function getSearchIndex(): IndexEntry[] {
  if (cachedIndex) return cachedIndex;
  cachedIndex = getAllTools().map((tool) => {
    const categoryName = getCategoryBySlug(tool.category)?.name ?? tool.category;
    return {
      tool,
      categoryName,
      nameLower: tool.name.toLowerCase(),
      categoryLower: categoryName.toLowerCase(),
      keywordsLower: tool.keywords.join(" ").toLowerCase(),
      descriptionLower: `${tool.tagline} ${tool.description}`.toLowerCase(),
    };
  });
  return cachedIndex;
}

/**
 * Field-weighted, ranked search across name, category, keywords, and
 * description — name matches (especially ones at the very start of the
 * name) rank above category matches, which rank above keyword matches,
 * which rank above description-only matches. This is what makes typing
 * "email" surface "AI Email Writer" before some unrelated tool that
 * merely mentions "email" once in its long-form description.
 */
/**
 * Common shorthand/synonym expansions — when someone types "pic" they
 * mean "image", when they type "pw" they mean "password". Expanding the
 * query to include these lets a match succeed on a term that wouldn't
 * appear verbatim in any tool's name/keywords otherwise.
 */
const SYNONYMS: Record<string, string[]> = {
  pic: ["image", "photo", "picture"],
  photo: ["image", "picture"],
  pw: ["password"],
  pwd: ["password"],
  vid: ["video"],
  yt: ["youtube"],
  ig: ["instagram"],
  li: ["linkedin"],
  fb: ["facebook"],
  calc: ["calculator"],
  regex: ["pattern", "expression"],
  cv: ["resume"],
  json: ["data", "format"],
  qr: ["code", "scanner"],
  seo: ["search", "ranking"],
  ai: ["generator", "writer"],
};

function expandQuery(query: string): string[] {
  const terms = [query];
  if (SYNONYMS[query]) terms.push(...SYNONYMS[query]);
  return terms;
}

/**
 * Safe indexed access into an array. The loops in `editDistance` below
 * guarantee every index used here is in bounds by construction — but
 * `noUncheckedIndexedAccess` (on in this project's tsconfig) can't prove
 * that statically, since it doesn't reason about loop bounds. Throwing
 * here rather than using a bare non-null assertion means a future edit
 * that actually breaks the invariant fails loudly, instead of silently
 * treating `undefined` as a valid value or crashing somewhere less
 * obvious. Generic so it covers both the outer `number[][]` (selecting
 * a row) and inner `number[]` (a cell within that row) indexing below.
 */
function at<T>(arr: T[], index: number): T {
  const value = arr[index];
  if (value === undefined) {
    throw new Error(`editDistance: index ${index} out of bounds for array of length ${arr.length}`);
  }
  return value;
}

/** Cheap Levenshtein (edit) distance — fine at this scale (checked only against short tool names, only when the exact search comes up empty). */
function editDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const table: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

  for (let j = 0; j < cols; j++) at(table, 0)[j] = j;
  for (let i = 0; i < rows; i++) at(table, i)[0] = i;

  for (let i = 1; i < rows; i++) {
    // .charAt() returns a plain `string` (empty string if out of range),
    // never `string | undefined` — unlike the `a[i]` index operator,
    // it isn't affected by noUncheckedIndexedAccess, so no assertion or
    // helper is needed here at all.
    const charA = a.charAt(i - 1);
    const prevRow = at(table, i - 1);
    const currRow = at(table, i);
    for (let j = 1; j < cols; j++) {
      const charB = b.charAt(j - 1);
      const cost = charA === charB ? 0 : 1;
      currRow[j] = Math.min(at(prevRow, j) + 1, at(currRow, j - 1) + 1, at(prevRow, j - 1) + cost);
    }
  }

  return at(at(table, rows - 1), cols - 1);
}

/**
 * Typo-tolerant fallback: checks the query against each word of each
 * tool's name with a small edit-distance budget that scales with word
 * length (short words need to match almost exactly; longer words
 * tolerate a couple of typos) — "resizr" should still find "Resizer",
 * but a 3-letter query being "close" to everything doesn't flood
 * results with nonsense matches.
 */
function fuzzyMatchesName(query: string, nameLower: string): boolean {
  if (query.length < 3) return false;
  const budget = query.length <= 4 ? 1 : query.length <= 8 ? 2 : 3;
  return nameLower.split(/\s+/).some((word) => {
    if (Math.abs(word.length - query.length) > budget) return false;
    return editDistance(query, word) <= budget;
  });
}

export function searchToolsRanked(rawQuery: string, limit = 8): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const index = getSearchIndex();
  const queryVariants = expandQuery(query);
  const scored: { entry: IndexEntry; score: number; matchField: SearchMatchField }[] = [];

  for (const entry of index) {
    let bestScore = 0;
    let bestField: SearchMatchField = "description";

    for (const variant of queryVariants) {
      // A synonym expansion (e.g. "pic" -> "image") should never outrank
      // a genuine direct match on the original term, so it's scored
      // slightly lower at every tier — direct matches always win ties.
      const isDirectTerm = variant === query;
      const tierPenalty = isDirectTerm ? 0 : 3;

      if (entry.nameLower === variant) {
        bestScore = Math.max(bestScore, 100 - tierPenalty);
        if (bestScore === 100 - tierPenalty) bestField = "name";
      } else if (entry.nameLower.startsWith(variant)) {
        bestScore = Math.max(bestScore, 90 - tierPenalty);
        if (bestScore === 90 - tierPenalty) bestField = "name";
      } else if (entry.nameLower.includes(variant)) {
        bestScore = Math.max(bestScore, 75 - tierPenalty);
        if (bestScore === 75 - tierPenalty) bestField = "name";
      } else if (entry.categoryLower.includes(variant)) {
        bestScore = Math.max(bestScore, 55 - tierPenalty);
        if (bestScore === 55 - tierPenalty) bestField = "category";
      } else if (entry.keywordsLower.includes(variant)) {
        bestScore = Math.max(bestScore, 45 - tierPenalty);
        if (bestScore === 45 - tierPenalty) bestField = "keywords";
      } else if (entry.descriptionLower.includes(variant)) {
        bestScore = Math.max(bestScore, 30 - tierPenalty);
        if (bestScore === 30 - tierPenalty) bestField = "description";
      }
    }

    // Typo-tolerant fallback only kicks in when nothing matched at all —
    // it should never outrank a real substring match, only rescue an
    // otherwise-empty result set from a misspelling.
    if (bestScore === 0 && fuzzyMatchesName(query, entry.nameLower)) {
      bestScore = 20;
      bestField = "name";
    }

    if (bestScore > 0) {
      scored.push({ entry, score: bestScore, matchField: bestField });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.entry.nameLower.localeCompare(b.entry.nameLower));

  return scored.slice(0, limit).map(({ entry, matchField }) => ({
    tool: entry.tool,
    categoryName: entry.categoryName,
    matchField,
  }));
}
