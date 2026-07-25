import type { YoutubeGeneratorConfig } from "./constants";

/** Plain-text summary used by the Copy Results / Share actions and TXT export. */
export function buildGeneratorExportText(
  config: YoutubeGeneratorConfig,
  topic: string,
  outputs: string[]
): string {
  const lines = [`Topic: ${topic}`, ""];
  outputs.forEach((output, index) => {
    lines.push(`Option ${index + 1}`, output, "");
  });
  return lines.join("\n").trim();
}
