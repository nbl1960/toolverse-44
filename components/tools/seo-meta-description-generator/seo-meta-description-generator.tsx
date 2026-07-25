import { SeoGeneratorTemplate } from "@/components/tools/seo-generator/seo-generator-template";

/** Thin wrapper around the shared generator template — see seo-generator-template.tsx for the actual UI. */
export function SeoMetaDescriptionGenerator() {
  return <SeoGeneratorTemplate type="meta-description-generator" />;
}
