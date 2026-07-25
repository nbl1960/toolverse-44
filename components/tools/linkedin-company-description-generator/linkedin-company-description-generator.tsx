import { LinkedinGeneratorTemplate } from "@/components/tools/linkedin-generator/linkedin-generator-template";

/** Thin wrapper around the shared generator template — see linkedin-generator-template.tsx for the actual UI. */
export function LinkedinCompanyDescriptionGenerator() {
  return <LinkedinGeneratorTemplate type="company-description-generator" />;
}
