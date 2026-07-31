import { getAllTools } from "@/lib/tools-registry";
import { CATEGORIES } from "@/lib/categories";
import { ICON_MAP } from "@/lib/icon-map";

export interface ToolDraft {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  iconName: string;
  keywords: string;
  status: "live" | "coming-soon";
  addedAt: string;
}

export interface ValidationIssue {
  field: keyof ToolDraft;
  message: string;
}

/**
 * Validates a draft against the exact same rules the real registry
 * already enforces elsewhere in this codebase — unique slug, valid
 * category, valid icon name, description length — so a generated entry
 * can't accidentally break the schema or collide with an existing tool.
 * This is checked against `getAllTools()` live, so it's always current,
 * not a stale snapshot.
 */
export function validateToolDraft(draft: ToolDraft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const existingSlugs = new Set(getAllTools().map((t) => t.slug));
  const validCategories = new Set(CATEGORIES.map((c) => c.slug));
  const validIcons = new Set(Object.keys(ICON_MAP));

  const slug = draft.slug.trim();
  if (!slug) {
    issues.push({ field: "slug", message: "Slug is required." });
  } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    issues.push({ field: "slug", message: "Slug must be lowercase, hyphen-separated (e.g. my-new-tool)." });
  } else if (existingSlugs.has(slug)) {
    issues.push({ field: "slug", message: `"${slug}" is already used by an existing tool.` });
  }

  if (!draft.name.trim()) {
    issues.push({ field: "name", message: "Name is required." });
  }

  if (!draft.tagline.trim()) {
    issues.push({ field: "tagline", message: "Tagline is required." });
  } else if (draft.tagline.length > 80) {
    issues.push({ field: "tagline", message: `Tagline is ${draft.tagline.length} characters — keep it under 80 for card display.` });
  }

  if (!draft.description.trim()) {
    issues.push({ field: "description", message: "Description is required." });
  } else if (draft.description.length > 155) {
    issues.push({ field: "description", message: `Description is ${draft.description.length} characters — over the 155 SEO meta-description limit.` });
  }

  if (!draft.category) {
    issues.push({ field: "category", message: "Choose a category." });
  } else if (!validCategories.has(draft.category)) {
    issues.push({ field: "category", message: `"${draft.category}" isn't a real category slug.` });
  }

  if (!draft.iconName) {
    issues.push({ field: "iconName", message: "Choose an icon." });
  } else if (!validIcons.has(draft.iconName)) {
    issues.push({ field: "iconName", message: `"${draft.iconName}" isn't in the icon map.` });
  }

  const keywordList = draft.keywords.split(",").map((k) => k.trim()).filter(Boolean);
  if (keywordList.length === 0) {
    issues.push({ field: "keywords", message: "Add at least one keyword (comma-separated)." });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.addedAt)) {
    issues.push({ field: "addedAt", message: "Date must be in YYYY-MM-DD format." });
  }

  return issues;
}

/** Escapes a string for safe embedding in a double-quoted TS string literal — handles both literal quote and backslash characters. */
function escapeForTsString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Generates the exact TypeScript object literal text for this draft,
 * matching the real formatting convention already used throughout
 * lib/tools-registry.ts — ready to paste directly into the TOOLS array.
 * This does NOT write to any file: Cloudflare Workers has no writable
 * filesystem at runtime, and the registry is compiled into the
 * deployment at build time, not read at request time. Pasting this into
 * the registry and deploying is still a real, required step — this tool
 * makes that step fast and typo-free, not unnecessary.
 */
export function generateToolEntryCode(draft: ToolDraft): string {
  const keywordList = draft.keywords.split(",").map((k) => k.trim()).filter(Boolean);
  const keywordsCode = keywordList.map((k) => `"${escapeForTsString(k)}"`).join(", ");

  return `  {
    slug: "${escapeForTsString(draft.slug.trim())}",
    name: "${escapeForTsString(draft.name.trim())}",
    tagline: "${escapeForTsString(draft.tagline.trim())}",
    description:
      "${escapeForTsString(draft.description.trim())}",
    category: "${draft.category}",
    iconName: "${draft.iconName}",
    keywords: [${keywordsCode}],
    status: "${draft.status}",
    addedAt: "${draft.addedAt}",
  },`;
}
