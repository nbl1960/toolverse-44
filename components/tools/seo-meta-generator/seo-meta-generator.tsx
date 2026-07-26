import { WritingGeneratorTemplate } from "@/components/tools/writing-generator/writing-generator-template";

/** Thin wrapper around the shared generator template — see writing-generator-template.tsx for the actual UI. */
export function SeoMetaGenerator() {
  return <WritingGeneratorTemplate type="seo-meta-generator" />;
}
