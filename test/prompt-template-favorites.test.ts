import { describe, it, expect } from "vitest";
import { getFavoriteTemplateIds, isTemplateFavorite, toggleTemplateFavorite } from "@/lib/prompt-template-favorites";

/**
 * vitest.config.ts runs these under environment: "node" — no `window`,
 * no `localStorage`, deliberately (see that config's own comment). That
 * makes this the right place to verify the SSR-safety branch every
 * localStorage-backed module in this app relies on: these functions
 * must degrade to safe, non-throwing defaults when `window` doesn't
 * exist, not just work correctly in a browser we can't simulate here.
 */
describe("prompt-template-favorites (SSR-safe fallback behavior)", () => {
  it("getFavoriteTemplateIds returns an empty array, not undefined or a thrown error, with no window", () => {
    expect(getFavoriteTemplateIds()).toEqual([]);
  });

  it("isTemplateFavorite returns false for any ID with no window, rather than throwing", () => {
    expect(isTemplateFavorite("any-template-id")).toBe(false);
  });

  it("toggleTemplateFavorite does not throw with no window, and still returns a boolean", () => {
    expect(() => toggleTemplateFavorite("some-id")).not.toThrow();
    expect(typeof toggleTemplateFavorite("some-id")).toBe("boolean");
  });
});
