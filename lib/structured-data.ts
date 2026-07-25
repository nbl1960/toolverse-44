import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "./site-config";
import type { BreadcrumbItem, FaqItem, ToolDefinition } from "./types";

/** schema.org WebSite entry, used once on the homepage. */
export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  };
}

/** schema.org SoftwareApplication entry for an individual tool page. */
export function buildToolJsonLd(tool: ToolDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: `${SITE_URL}/tools/${tool.slug}`,
    applicationCategory: tool.applicationCategory ?? "WebApplication",
    ...(tool.isCalculator ? { applicationSubCategory: "Calculator" } : {}),
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/**
 * schema.org WebPage entry for an individual tool page — describes the
 * page itself (as distinct from `SoftwareApplication`, which describes
 * the tool it hosts). Rendered from `ToolPageShell`, the one component
 * with direct access to the tool's full context.
 */
export function buildToolWebPageJsonLd(tool: ToolDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: tool.name,
    description: tool.description,
    url: `${SITE_URL}/tools/${tool.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/** schema.org FAQPage entry, built from a tool's `faq` list. */
export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** schema.org BreadcrumbList entry, mirrors the visible breadcrumb trail. */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };
}
