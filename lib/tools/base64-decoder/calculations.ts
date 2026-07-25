import type { TransformResult } from "@/components/shared/text-transform-tool";

/** UTF-8-safe Base64 decoding — the counterpart to encodeBase64(). */
export function decodeBase64(input: string): TransformResult {
  try {
    const binary = atob(input.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return { success: true, output: new TextDecoder().decode(bytes) };
  } catch {
    return { success: false, output: "Invalid Base64 input — check for typos, spaces, or missing characters." };
  }
}
