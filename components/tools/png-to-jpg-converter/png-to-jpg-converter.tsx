"use client";

import { ImageTransformTool } from "@/components/shared/image-transform-tool";

export function PngToJpgConverter() {
  return (
    <ImageTransformTool
      toolSlug="png-to-jpg-converter"
      acceptTypes="image/png"
      outputMimeType="image/jpeg"
      outputExtension="jpg"
      downloadFilenamePrefix="converted"
      showQualityControl
      defaultQuality={90}
      actionLabel="Convert to JPG"
    />
  );
}
