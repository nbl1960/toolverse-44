export interface ProcessImageOptions {
  /** Target MIME type for the output, e.g. "image/jpeg", "image/png", "image/webp". */
  mimeType: string;
  /** 0-1, only meaningful for lossy formats (JPEG/WebP). Ignored for PNG. */
  quality?: number;
  /** If set, the image is resized to these dimensions. Omit either to keep the original for that axis. */
  targetWidth?: number;
  targetHeight?: number;
}

export interface ProcessImageResult {
  blob: Blob;
  dataUrl: string;
  originalSize: number;
  newSize: number;
  width: number;
  height: number;
}

/** Loads a File into an HTMLImageElement via an object URL, resolving once it's decoded and ready to draw. */
function loadImageFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read this image — it may be corrupted or an unsupported format."));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Couldn't encode the image in that format. Your browser may not support it."));
      },
      mimeType,
      quality
    );
  });
}

/**
 * The shared core behind every Image Studio tool (Compressor, Resizer,
 * PNG↔JPG, WebP Converter): decode the uploaded file, draw it onto a
 * canvas at the target size, then re-encode via canvas.toBlob() at the
 * target format/quality. This is real browser image processing — the
 * Canvas API, not a simulation — but runs entirely client-side, so
 * nothing is uploaded anywhere.
 */
export async function processImage(file: File, options: ProcessImageOptions): Promise<ProcessImageResult> {
  const img = await loadImageFile(file);

  const width = options.targetWidth ?? img.naturalWidth;
  const height = options.targetHeight ?? img.naturalHeight;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Couldn't access a 2D canvas context in this browser.");
  }
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, options.mimeType, options.quality);
  const dataUrl = canvas.toDataURL(options.mimeType, options.quality);

  return {
    blob,
    dataUrl,
    originalSize: file.size,
    newSize: blob.size,
    width,
    height,
  };
}

/** Triggers a browser download of a processed image blob. */
export function downloadImageBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
