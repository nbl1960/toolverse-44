import { LinkedinGeneratorTemplate } from "@/components/tools/linkedin-generator/linkedin-generator-template";

/** Thin wrapper around the shared generator template — see linkedin-generator-template.tsx for the actual UI. */
export function LinkedinConnectionRequestGenerator() {
  return <LinkedinGeneratorTemplate type="connection-request-generator" />;
}
