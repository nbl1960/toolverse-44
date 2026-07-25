import type { OpenGraphFormValues } from "./types";

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/** Builds a complete set of Open Graph meta tags from form values. Returns null if there's nothing to output yet. */
export function buildOpenGraphTags(values: OpenGraphFormValues): string | null {
  const title = values.title.trim();
  const description = values.description.trim();
  if (!title && !description) return null;

  const lines: string[] = [];
  if (title) lines.push(`<meta property="og:title" content="${escapeAttr(title)}" />`);
  if (description) lines.push(`<meta property="og:description" content="${escapeAttr(description)}" />`);
  lines.push(`<meta property="og:type" content="${escapeAttr(values.type.trim() || "website")}" />`);
  if (values.url.trim()) lines.push(`<meta property="og:url" content="${escapeAttr(values.url.trim())}" />`);
  if (values.imageUrl.trim()) lines.push(`<meta property="og:image" content="${escapeAttr(values.imageUrl.trim())}" />`);
  if (values.siteName.trim()) lines.push(`<meta property="og:site_name" content="${escapeAttr(values.siteName.trim())}" />`);

  return lines.join("\n");
}
