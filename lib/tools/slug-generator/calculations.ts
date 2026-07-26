import type { TransformResult } from "@/components/shared/text-transform-tool";

/** Converts arbitrary text into a URL-safe slug: lowercase, hyphen-separated, no special characters. */
export function generateSlug(input: string): TransformResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { success: false, output: "Enter some text to convert." };
  }

  const slug = trimmed
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents (é -> e)
    .replace(/[_]+/g, "-") // underscores are word separators, not noise to delete
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    return { success: false, output: "That text doesn't produce a usable slug — try including some letters or numbers." };
  }

  return { success: true, output: slug };
}
