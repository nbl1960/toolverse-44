import type { TransformResult } from "@/components/shared/text-transform-tool";

/** Converts arbitrary text into a clean, URL-safe slug: lowercase, diacritics stripped, non-alphanumerics collapsed to single hyphens. */
export function generateSlug(input: string): TransformResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { success: false, output: "Enter some text to convert." };
  }

  const slug = trimmed
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics (é -> e, etc.)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    return { success: false, output: "That text doesn't contain any characters that can form a slug." };
  }

  return { success: true, output: slug };
}
