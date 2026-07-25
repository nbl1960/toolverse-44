import type { TransformResult } from "@/components/shared/text-transform-tool";

/** UTF-8-safe Base64 encoding — handles emoji and non-Latin text correctly, unlike plain btoa(). */
export function encodeBase64(input: string): TransformResult {
  try {
    const bytes = new TextEncoder().encode(input);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return { success: true, output: btoa(binary) };
  } catch {
    return { success: false, output: "Couldn't encode this text." };
  }
}
