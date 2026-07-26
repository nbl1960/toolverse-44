"use client";

import { ImageTransformTool } from "@/components/shared/image-transform-tool";

export function JpgToPngConverter() {
  return (
    <ImageTransformTool
      toolSlug="jpg-to-png-converter"
      acceptTypes="image/jpeg"
      outputMimeType="image/png"
      outputExtension="png"
      downloadFilenamePrefix="converted"
      actionLabel="Convert to PNG"
    />
  );
}
