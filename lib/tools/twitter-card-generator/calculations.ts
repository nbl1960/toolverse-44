import type { TwitterCardFormValues } from "./types";

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/** Builds a complete set of Twitter/X Card meta tags from form values. Returns null if there's nothing to output yet. */
export function buildTwitterCardTags(values: TwitterCardFormValues): string | null {
  const title = values.title.trim();
  const description = values.description.trim();
  if (!title && !description) return null;

  const lines: string[] = [`<meta name="twitter:card" content="${values.cardType}" />`];
  if (title) lines.push(`<meta name="twitter:title" content="${escapeAttr(title)}" />`);
  if (description) lines.push(`<meta name="twitter:description" content="${escapeAttr(description)}" />`);
  if (values.imageUrl.trim()) lines.push(`<meta name="twitter:image" content="${escapeAttr(values.imageUrl.trim())}" />`);
  if (values.site.trim()) {
    const handle = values.site.trim().startsWith("@") ? values.site.trim() : `@${values.site.trim()}`;
    lines.push(`<meta name="twitter:site" content="${escapeAttr(handle)}" />`);
  }

  return lines.join("\n");
}
