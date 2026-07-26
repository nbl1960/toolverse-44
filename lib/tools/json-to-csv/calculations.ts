import type { TransformResult } from "@/components/shared/text-transform-tool";
import { arrayToCsv } from "@/lib/csv-export";

function stringifyCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/** Converts a JSON array of flat objects into CSV text, reusing the same CSV-building logic the finance tools use for their schedule exports. */
export function convertJsonToCsv(input: string): TransformResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (error) {
    return { success: false, output: error instanceof Error ? `Invalid JSON: ${error.message}` : "Invalid JSON." };
  }

  if (!Array.isArray(parsed)) {
    return { success: false, output: "Expected a JSON array of objects, e.g. [{\"name\": \"Ada\"}, ...]." };
  }
  if (parsed.length === 0) {
    return { success: false, output: "The array is empty — nothing to convert." };
  }
  if (typeof parsed[0] !== "object" || parsed[0] === null || Array.isArray(parsed[0])) {
    return { success: false, output: "Expected an array of objects, e.g. [{\"name\": \"Ada\"}, ...]." };
  }

  // Union of every key across all objects, in first-seen order, so rows
  // with slightly different shapes still line up under the same headers.
  const headers: string[] = [];
  const seen = new Set<string>();
  for (const item of parsed) {
    if (typeof item !== "object" || item === null) continue;
    for (const key of Object.keys(item as Record<string, unknown>)) {
      if (!seen.has(key)) {
        seen.add(key);
        headers.push(key);
      }
    }
  }

  const rows = (parsed as Record<string, unknown>[]).map((item) =>
    headers.map((header) => stringifyCell(item[header]))
  );

  return { success: true, output: arrayToCsv(headers, rows) };
}
