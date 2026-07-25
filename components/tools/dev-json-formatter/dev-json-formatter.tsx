"use client";

import { TextTransformTool } from "@/components/shared/text-transform-tool";
import { formatJson } from "@/lib/tools/json-formatter/calculations";

export function DevJsonFormatter() {
  return (
    <TextTransformTool
      toolSlug="dev-json-formatter"
      inputLabel="Paste your JSON"
      inputPlaceholder='{"name":"Ada","active":true}'
      actionLabel="Format JSON"
      outputLabel="Formatted JSON"
      downloadFilename="formatted"
      fileExtension="json"
      transform={formatJson}
    />
  );
}
