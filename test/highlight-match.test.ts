import { describe, it, expect } from "vitest";
import { highlightMatch } from "@/lib/highlight-match";

describe("highlightMatch", () => {
  it("marks a case-insensitive mid-string match while preserving original casing", () => {
    const result = highlightMatch("AI Email Writer", "email");
    expect(result).toEqual([
      { text: "AI ", isMatch: false },
      { text: "Email", isMatch: true },
      { text: " Writer", isMatch: false },
    ]);
  });

  it("marks every occurrence when the query appears multiple times", () => {
    const result = highlightMatch("Password Password Generator", "password");
    const matches = result.filter((s) => s.isMatch);
    expect(matches).toHaveLength(2);
  });

  it("returns the whole text unmatched when there is no match", () => {
    const result = highlightMatch("JSON Formatter", "xyz");
    expect(result).toEqual([{ text: "JSON Formatter", isMatch: false }]);
  });

  it("returns the whole text unmatched for an empty query", () => {
    const result = highlightMatch("JSON Formatter", "");
    expect(result).toEqual([{ text: "JSON Formatter", isMatch: false }]);
  });

  it("always reconstructs to the exact original text (no character loss)", () => {
    const cases: [string, string][] = [
      ["AI Email Writer", "email"],
      ["EMI Calculator", "calc"],
      ["Instagram Hashtag Generator", "Instagram"],
      ["Password Password Generator", "password"],
    ];
    for (const [text, query] of cases) {
      const result = highlightMatch(text, query);
      expect(result.map((s) => s.text).join("")).toBe(text);
    }
  });
});
