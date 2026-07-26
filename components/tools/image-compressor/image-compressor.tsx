"use client";

import { ImageTransformTool } from "@/components/shared/image-transform-tool";

export function ImageCompressor() {
  return (
    <ImageTransformTool
      toolSlug="image-compressor"
      acceptTypes="image/jpeg,image/png,image/webp"
      outputMimeType="image/jpeg"
      outputExtension="jpg"
      downloadFilenamePrefix="compressed"
      showQualityControl
      defaultQuality={75}
      actionLabel="Compress image"
    />
  );
}
