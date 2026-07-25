/**
 * Triggers a browser download of `content` as `filename`, with the given
 * MIME type. The one place the actual blob/anchor-click download
 * mechanism lives — `downloadCsv` (csv-export.ts) and any plain-text
 * export (e.g. the YouTube generator tools' "Export as TXT") both call
 * this instead of re-implementing it.
 */
export function downloadTextFile(filename: string, content: string, mimeType = "text/plain;charset=utf-8;"): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
