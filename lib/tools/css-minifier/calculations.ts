import { minifyCss } from "@/lib/minify";
import type { TransformResult } from "@/components/shared/text-transform-tool";

export function runCssMinify(input: string): TransformResult {
  const output = minifyCss(input);
  return { success: true, output };
}
