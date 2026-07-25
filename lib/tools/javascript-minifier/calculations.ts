import { minifyJs } from "@/lib/minify";
import type { TransformResult } from "@/components/shared/text-transform-tool";

export function runJsMinify(input: string): TransformResult {
  const output = minifyJs(input);
  return { success: true, output };
}
