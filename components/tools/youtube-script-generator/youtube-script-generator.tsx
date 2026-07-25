import { YoutubeGeneratorTemplate } from "@/components/tools/youtube-generator/youtube-generator-template";

/** Thin wrapper around the shared generator template — see youtube-generator-template.tsx for the actual UI. */
export function YoutubeScriptGenerator() {
  return <YoutubeGeneratorTemplate type="script-generator" />;
}
