import type { TransformResult } from "@/components/shared/text-transform-tool";

/** Pretty-prints valid JSON with 2-space indentation, or returns the parse error. */
export function formatJson(input: string): TransformResult {
  try {
    const parsed: unknown = JSON.parse(input);
    return { success: true, output: JSON.stringify(parsed, null, 2) };
  } catch (error) {
    return {
      success: false,
      output: error instanceof Error ? `Invalid JSON: ${error.message}` : "Invalid JSON.",
    };
  }
}
