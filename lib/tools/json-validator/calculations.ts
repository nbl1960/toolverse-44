import type { TransformResult } from "@/components/shared/text-transform-tool";

/** Validates JSON and returns the pretty-printed version with a status message on success. */
export function validateJson(input: string): TransformResult {
  try {
    const parsed: unknown = JSON.parse(input);
    return { success: true, output: JSON.stringify(parsed, null, 2), statusMessage: "Valid JSON" };
  } catch (error) {
    return {
      success: false,
      output: error instanceof Error ? `Invalid JSON: ${error.message}` : "Invalid JSON.",
    };
  }
}
