import type { TransformResult } from "@/components/shared/text-transform-tool";

const TRACKING_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid", "ref"];

/**
 * Normalizes a URL into a canonical form: enforces https, lowercases the
 * host, strips common tracking query parameters, and removes a trailing
 * slash (except for the root path) — then wraps it in a
 * <link rel="canonical"> tag.
 */
export function buildCanonicalTag(input: string): TransformResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { success: false, output: "Enter a URL." };
  }

  let parsed: URL;
  try {
    parsed = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return { success: false, output: "That doesn't look like a valid URL." };
  }

  parsed.protocol = "https:";
  parsed.hostname = parsed.hostname.toLowerCase();
  parsed.hash = "";

  for (const param of TRACKING_PARAMS) {
    parsed.searchParams.delete(param);
  }

  let pathname = parsed.pathname;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  parsed.pathname = pathname;

  const canonicalUrl = parsed.toString();
  return { success: true, output: `<link rel="canonical" href="${canonicalUrl}" />` };
}
