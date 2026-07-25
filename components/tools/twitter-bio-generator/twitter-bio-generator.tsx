import { TwitterGeneratorTemplate } from "@/components/tools/twitter-generator/twitter-generator-template";

/** Thin wrapper around the shared generator template — see twitter-generator-template.tsx for the actual UI. */
export function TwitterBioGenerator() {
  return <TwitterGeneratorTemplate type="bio-generator" />;
}
