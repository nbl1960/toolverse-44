"use client";

import { TextTransformTool } from "@/components/shared/text-transform-tool";
import { decodeBase64 } from "@/lib/tools/base64-decoder/calculations";

export function DevBase64Decoder() {
  return (
    <TextTransformTool
      toolSlug="dev-base64-decoder"
      inputLabel="Base64 to decode"
      inputPlaceholder="SGVsbG8sIHdvcmxkIQ=="
      actionLabel="Decode Base64"
      outputLabel="Decoded text"
      downloadFilename="decoded"
      fileExtension="txt"
      transform={decodeBase64}
    />
  );
}
