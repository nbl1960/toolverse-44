"use client";

import { TextTransformTool } from "@/components/shared/text-transform-tool";
import { generateSlug } from "@/lib/tools/seo-slug-generator/calculations";

export function SeoSlugGenerator() {
  return (
    <TextTransformTool
      toolSlug="seo-slug-generator"
      inputLabel="Text to convert"
      inputPlaceholder="Café Résumé — 7 Best Tips!"
      actionLabel="Generate slug"
      outputLabel="URL slug"
      downloadFilename="slug"
      fileExtension="txt"
      transform={generateSlug}
    />
  );
}
