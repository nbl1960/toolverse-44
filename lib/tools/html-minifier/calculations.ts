import { minifyHtml } from "@/lib/minify";
import type { TransformResult } from "@/components/shared/text-transform-tool";

export function runHtmlMinify(input: string): TransformResult {
  const output = minifyHtml(input);
  return { success: true, output };
}
