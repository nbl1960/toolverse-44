import type { RobotsFormValues } from "./types";

function parseLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Builds a valid robots.txt file from form values. Returns null if there's nothing meaningful to output yet. */
export function buildRobotsTxt(values: RobotsFormValues): string | null {
  const userAgent = values.userAgent.trim() || "*";
  const disallowPaths = parseLines(values.disallowPaths);
  const allowPaths = parseLines(values.allowPaths);
  const sitemapUrl = values.sitemapUrl.trim();
  const crawlDelay = values.crawlDelay.trim();

  if (disallowPaths.length === 0 && allowPaths.length === 0 && !sitemapUrl) {
    return null;
  }

  const lines: string[] = [`User-agent: ${userAgent}`];

  for (const path of disallowPaths) {
    lines.push(`Disallow: ${path.startsWith("/") ? path : `/${path}`}`);
  }
  for (const path of allowPaths) {
    lines.push(`Allow: ${path.startsWith("/") ? path : `/${path}`}`);
  }
  if (crawlDelay && /^\d+$/.test(crawlDelay)) {
    lines.push(`Crawl-delay: ${crawlDelay}`);
  }
  if (sitemapUrl) {
    lines.push("", `Sitemap: ${sitemapUrl}`);
  }

  return lines.join("\n");
}
