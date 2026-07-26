"use client";

import { TextTransformTool } from "@/components/shared/text-transform-tool";
import { convertCsvToJson } from "@/lib/tools/csv-to-json/calculations";

export function CsvToJson() {
  return (
    <TextTransformTool
      toolSlug="csv-to-json"
      inputLabel="Paste your CSV"
      inputPlaceholder={"name,age\nAda,30\nGrace,28"}
      actionLabel="Convert to JSON"
      outputLabel="JSON output"
      downloadFilename="converted"
      fileExtension="json"
      transform={convertCsvToJson}
    />
  );
}
