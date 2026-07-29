import { describe, it, expect } from "vitest";
import { searchToolsRanked } from "@/lib/search-index";

/**
 * These run against the REAL tool registry (not mocked), so they double
 * as a check that specific well-known tools continue to exist with the
 * expected slugs — a regression here would mean either the search
 * ranking broke, or a tool got renamed/removed without updating this
 * test, both worth knowing about.
 */
describe("searchToolsRanked", () => {
  it("ranks an exact-name-adjacent match above a coincidental description mention", () => {
    const results = searchToolsRanked("email");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.tool.slug).toBe("email-writer");
  });

  it("matches by category name, not just name/description/keywords", () => {
    const results = searchToolsRanked("finance");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.categoryName.toLowerCase() === "finance")).toBe(true);
  });

  it("returns an empty array for an empty query", () => {
    expect(searchToolsRanked("")).toEqual([]);
    expect(searchToolsRanked("   ")).toEqual([]);
  });

  it("returns an empty array for a query that matches nothing", () => {
    expect(searchToolsRanked("zzzznonexistentqueryxyz123")).toEqual([]);
  });

  it("respects the limit parameter", () => {
    // "generator" appears in many tool names/keywords across the catalog.
    const results = searchToolsRanked("generator", 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("never returns a result whose slug is not a real, live tool", () => {
    const results = searchToolsRanked("calculator");
    for (const result of results) {
      expect(result.tool.status).toBe("live");
    }
  });
});
