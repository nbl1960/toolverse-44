"use client";

import { TextTransformTool } from "@/components/shared/text-transform-tool";
import { encodeBase64 } from "@/lib/tools/base64-encoder/calculations";

export function DevBase64Encoder() {
  return (
    <TextTransformTool
      toolSlug="dev-base64-encoder"
      inputLabel="Text to encode"
      inputPlaceholder="Hello, world!"
      actionLabel="Encode to Base64"
      outputLabel="Base64 output"
      downloadFilename="encoded"
      fileExtension="txt"
      transform={encodeBase64}
    />
  );
}
