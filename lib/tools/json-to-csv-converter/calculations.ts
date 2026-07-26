import { arrayToCsv } from "@/lib/csv-export";
import type { TransformResult } from "@/components/shared/text-transform-tool";

/** Converts a JSON array of flat objects into CSV text, reusing the same CSV-writing logic as the finance tools' schedule export. */
export function convertJsonToCsv(input: string): TransformResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (error) {
    return {
      success: false,
      output: error instanceof Error ? `Invalid JSON: ${error.message}` : "Invalid JSON.",
    };
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { success: false, output: "Expected a non-empty JSON array of objects." };
  }

  if (!parsed.every((item) => typeof item === "object" && item !== null && !Array.isArray(item))) {
    return { success: false, output: "Every item in the array must be a plain object." };
  }

  const objects = parsed as Record<string, unknown>[];

  // Union of every key across all objects, in first-seen order — so
  // objects with slightly different shapes still produce one consistent
  // header row instead of silently dropping columns.
  const headers: string[] = [];
  for (const obj of objects) {
    for (const key of Object.keys(obj)) {
      if (!headers.includes(key)) headers.push(key);
    }
  }

  const rows = objects.map((obj) =>
    headers.map((header) => {
      const value = obj[header];
      if (value === undefined || value === null) return "";
      return typeof value === "object" ? JSON.stringify(value) : String(value);
    })
  );

  return { success: true, output: arrayToCsv(headers, rows) };
}
