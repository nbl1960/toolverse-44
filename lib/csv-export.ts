import { downloadTextFile } from "./file-export";

/**
 * Converts headers + rows into a well-formed CSV string, quoting any field
 * that contains a comma, quote, or newline.
 */
export function arrayToCsv(headers: string[], rows: Array<Array<string | number>>): string {
  const escapeCell = (value: string | number): string => {
    const stringValue = String(value);
    return /[",\n]/.test(stringValue)
      ? `"${stringValue.replace(/"/g, '""')}"`
      : stringValue;
  };

  const lines = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ];

  return lines.join("\n");
}

/** Triggers a browser download of the given CSV content as `filename`. */
export function downloadCsv(filename: string, csvContent: string): void {
  downloadTextFile(filename, csvContent, "text/csv;charset=utf-8;");
}
