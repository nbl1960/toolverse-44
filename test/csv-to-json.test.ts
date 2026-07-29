import { describe, it, expect } from "vitest";
import { convertCsvToJson } from "@/lib/tools/csv-to-json/calculations";

describe("convertCsvToJson", () => {
  it("converts basic CSV to a JSON array", () => {
    const result = convertCsvToJson("name,age\nAda,30\nGrace,28");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual([
        { name: "Ada", age: "30" },
        { name: "Grace", age: "28" },
      ]);
    }
  });

  it("correctly handles a quoted field containing an embedded comma", () => {
    const result = convertCsvToJson('name,bio\n"Ada Lovelace","Mathematician, writer"');
    expect(result.success).toBe(true);
    if (result.success) {
      const parsed = JSON.parse(result.output);
      expect(parsed[0].bio).toBe("Mathematician, writer");
    }
  });

  it("correctly handles an escaped double-quote inside a quoted field", () => {
    const result = convertCsvToJson('name,quote\nAda,"She said ""hello"" to me"');
    expect(result.success).toBe(true);
    if (result.success) {
      const parsed = JSON.parse(result.output);
      expect(parsed[0].quote).toBe('She said "hello" to me');
    }
  });

  it("correctly handles a quoted field containing an embedded newline", () => {
    const result = convertCsvToJson('name,notes\nAda,"Line one\nLine two"');
    expect(result.success).toBe(true);
    if (result.success) {
      const parsed = JSON.parse(result.output);
      expect(parsed[0].notes).toBe("Line one\nLine two");
    }
  });

  it("handles CRLF line endings", () => {
    const result = convertCsvToJson("name,age\r\nAda,30\r\nGrace,28");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toHaveLength(2);
    }
  });

  it("fails gracefully on empty input", () => {
    const result = convertCsvToJson("");
    expect(result.success).toBe(false);
  });
});
