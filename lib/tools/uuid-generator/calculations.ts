import type { UuidGeneratorResult } from "./types";

/** Generates `count` RFC 4122 v4 UUIDs using the browser's native crypto.randomUUID(). */
export function generateUuids(count: number): UuidGeneratorResult {
  const uuids = Array.from({ length: count }, () => crypto.randomUUID());
  return { uuids };
}
