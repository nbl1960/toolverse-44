"use client";

import { ImageTransformTool } from "@/components/shared/image-transform-tool";

export function ImageResizer() {
  return (
    <ImageTransformTool
      toolSlug="image-resizer"
      acceptTypes="image/jpeg,image/png,image/webp"
      outputMimeType="image/png"
      outputExtension="png"
      downloadFilenamePrefix="resized"
      showDimensionControls
      actionLabel="Resize image"
    />
  );
}
