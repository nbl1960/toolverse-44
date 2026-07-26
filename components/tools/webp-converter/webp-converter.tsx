"use client";

import { ImageTransformTool } from "@/components/shared/image-transform-tool";

export function WebpConverter() {
  return (
    <ImageTransformTool
      toolSlug="webp-converter"
      acceptTypes="image/jpeg,image/png"
      outputMimeType="image/webp"
      outputExtension="webp"
      downloadFilenamePrefix="converted"
      showQualityControl
      defaultQuality={80}
      actionLabel="Convert to WebP"
    />
  );
}
