import { describe, it, expect } from "vitest";
import { parseGeneratorOutputs } from "@/lib/generator-api";

describe("parseGeneratorOutputs", () => {
  it("parses a clean, well-formed response", () => {
    const raw = '{"outputs": ["First option", "Second option", "Third option"]}';
    expect(parseGeneratorOutputs(raw, 3)).toEqual(["First option", "Second option", "Third option"]);
  });

  it("strips markdown code fences before parsing", () => {
    const raw = '```json\n{"outputs": ["A", "B"]}\n```';
    expect(parseGeneratorOutputs(raw, 3)).toEqual(["A", "B"]);
  });

  it("truncates to maxCount even if the model returns more", () => {
    const raw = '{"outputs": ["1", "2", "3", "4", "5"]}';
    expect(parseGeneratorOutputs(raw, 3)).toEqual(["1", "2", "3"]);
  });

  it("filters out non-string entries and empty strings", () => {
    const raw = '{"outputs": ["Valid", "", 42, null, "Also valid"]}';
    expect(parseGeneratorOutputs(raw, 5)).toEqual(["Valid", "Also valid"]);
  });

  it("throws when the response has no parseable JSON object at all", () => {
    expect(() => parseGeneratorOutputs("this is not JSON", 3)).toThrow();
  });

  it("throws when the outputs array is missing entirely", () => {
    expect(() => parseGeneratorOutputs('{"result": "wrong shape"}', 3)).toThrow();
  });

  it("throws when outputs is present but empty", () => {
    expect(() => parseGeneratorOutputs('{"outputs": []}', 3)).toThrow();
  });
});
