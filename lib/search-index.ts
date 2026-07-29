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
export function searchToolsRanked(rawQuery: string, limit = 8): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const index = getSearchIndex();
  const scored: { entry: IndexEntry; score: number; matchField: SearchMatchField }[] = [];

  for (const entry of index) {
    let bestScore = 0;
    let bestField: SearchMatchField = "description";

    if (entry.nameLower === query) {
      bestScore = 100;
      bestField = "name";
    } else if (entry.nameLower.startsWith(query)) {
      bestScore = 90;
      bestField = "name";
    } else if (entry.nameLower.includes(query)) {
      bestScore = 75;
      bestField = "name";
    } else if (entry.categoryLower.includes(query)) {
      bestScore = 55;
      bestField = "category";
    } else if (entry.keywordsLower.includes(query)) {
      bestScore = 45;
      bestField = "keywords";
    } else if (entry.descriptionLower.includes(query)) {
      bestScore = 30;
      bestField = "description";
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
