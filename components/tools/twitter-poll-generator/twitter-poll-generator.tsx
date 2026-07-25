import { TwitterGeneratorTemplate } from "@/components/tools/twitter-generator/twitter-generator-template";

/** Thin wrapper around the shared generator template — see twitter-generator-template.tsx for the actual UI. */
export function TwitterPollGenerator() {
  return <TwitterGeneratorTemplate type="poll-generator" />;
}
