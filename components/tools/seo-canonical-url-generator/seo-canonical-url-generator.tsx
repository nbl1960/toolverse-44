"use client";

import { TextTransformTool } from "@/components/shared/text-transform-tool";
import { buildCanonicalTag } from "@/lib/tools/canonical-url-generator/calculations";

export function SeoCanonicalUrlGenerator() {
  return (
    <TextTransformTool
      toolSlug="seo-canonical-url-generator"
      inputLabel="Your URL"
      inputPlaceholder="https://example.com/blog/post/?utm_source=newsletter"
      actionLabel="Generate canonical tag"
      outputLabel="Canonical tag"
      downloadFilename="canonical-tag"
      fileExtension="html"
      transform={buildCanonicalTag}
    />
  );
}
