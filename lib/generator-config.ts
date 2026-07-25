/**
 * Shared shape for an AI text-generator tool's configuration — used by
 * both the YouTube and Instagram generator suites (and any future one).
 * Each platform keeps its own `Record<Type, GeneratorConfig>` in its own
 * `lib/tools/<platform>-generator/constants.ts`, but the shape and the
 * export-text formatting below are written once, here.
 */
export interface GeneratorConfig {
  /** Label shown above the input field, e.g. "Video topic" or "Post topic". */
  inputLabel: string;
  placeholder: string;
  /** Short helper line under the input. */
  helperText: string;
  /** What one output unit is called, used in UI copy (e.g. "title", "caption"). */
  outputNoun: string;
  /** Instruction sent to the model describing exactly what to produce. */
  promptInstruction: string;
  /** Guidance on the expected shape/format of each output string. */
  formatHint: string;
}

/** Plain-text summary used by the Copy Results / Share actions and TXT export, for any generator tool. */
export function buildGeneratorExportText(config: GeneratorConfig, topic: string, outputs: string[]): string {
  const lines = [`Topic: ${topic}`, ""];
  outputs.forEach((output, index) => {
    lines.push(`Option ${index + 1}`, output, "");
  });
  return lines.join("\n").trim();
}
