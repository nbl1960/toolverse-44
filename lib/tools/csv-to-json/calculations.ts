import type { TransformResult } from "@/components/shared/text-transform-tool";

/**
 * Parses CSV text into rows of string fields, correctly handling quoted
 * fields (including embedded commas, newlines, and escaped "" quotes) —
 * not a naive split(","), which breaks on any real-world CSV with quoted
 * values.
 */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += char;
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (char === "\r") {
      i += 1;
      continue;
    }
    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }
    field += char;
    i += 1;
  }

  // Flush the final field/row if the text didn't end with a newline.
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

/** Converts CSV text (first row = headers) into a JSON array of objects. */
export function convertCsvToJson(input: string): TransformResult {
  const rows = parseCsvRows(input.trim());
  if (rows.length === 0) {
    return { success: false, output: "No data found." };
  }

  const headers = rows[0];
  if (!headers || headers.length === 0) {
    return { success: false, output: "Couldn't read a header row." };
  }

  const dataRows = rows.slice(1);
  const objects = dataRows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] ?? "";
    });
    return obj;
  });

  return { success: true, output: JSON.stringify(objects, null, 2) };
}
