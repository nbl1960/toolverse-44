import type { TransformResult } from "@/components/shared/text-transform-tool";
import type { UrlCodecMode } from "./types";

export function runUrlCodec(input: string, mode: UrlCodecMode): TransformResult {
  try {
    const output = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    return { success: true, output };
  } catch {
    return {
      success: false,
      output:
        mode === "decode"
          ? "Invalid encoded text — check for a stray % character or an incomplete escape sequence."
          : "Couldn't encode this text.",
    };
  }
}
