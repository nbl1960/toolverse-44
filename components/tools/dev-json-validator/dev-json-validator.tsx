"use client";

import { TextTransformTool } from "@/components/shared/text-transform-tool";
import { validateJson } from "@/lib/tools/json-validator/calculations";

export function DevJsonValidator() {
  return (
    <TextTransformTool
      toolSlug="dev-json-validator"
      inputLabel="Paste your JSON"
      inputPlaceholder='{"name":"Ada","active":true}'
      actionLabel="Validate JSON"
      outputLabel="Result"
      downloadFilename="validated"
      fileExtension="json"
      transform={validateJson}
    />
  );
}
