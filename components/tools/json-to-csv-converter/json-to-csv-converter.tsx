"use client";

import { TextTransformTool } from "@/components/shared/text-transform-tool";
import { convertJsonToCsv } from "@/lib/tools/json-to-csv-converter/calculations";

export function JsonToCsvConverter() {
  return (
    <TextTransformTool
      toolSlug="json-to-csv-converter"
      inputLabel="Paste your JSON array"
      inputPlaceholder='[{"name":"Ada","age":30},{"name":"Grace","age":28}]'
      actionLabel="Convert to CSV"
      outputLabel="CSV output"
      downloadFilename="converted"
      fileExtension="csv"
      transform={convertJsonToCsv}
    />
  );
}
