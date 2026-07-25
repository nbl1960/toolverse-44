import type { SitemapFormValues } from "./types";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseUrls(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Builds a valid XML sitemap from a list of URLs and shared change-frequency/priority settings. */
export function buildSitemap(values: SitemapFormValues): string | null {
  const urls = parseUrls(values.urls);
  if (urls.length === 0) return null;

  const priority = /^(0(\.\d)?|1(\.0)?)$/.test(values.priority.trim()) ? values.priority.trim() : "0.5";
  const today = new Date().toISOString().slice(0, 10);

  const entries = urls
    .map(
      (url) =>
        `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${values.changeFreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}
