import { describe, it, expect } from "vitest";
import { calculateGst } from "@/lib/tools/gst-calculator/calculations";

describe("calculateGst", () => {
  it("adds 18% GST correctly", () => {
    const result = calculateGst({ amount: 1000, rate: 18, mode: "add" });
    expect(result.originalAmount).toBe(1000);
    expect(result.gstAmount).toBe(180);
    expect(result.totalAmount).toBe(1180);
    expect(result.cgst).toBe(90);
    expect(result.sgst).toBe(90);
  });

  it("extracts 18% GST from a tax-inclusive amount", () => {
    const result = calculateGst({ amount: 1180, rate: 18, mode: "remove" });
    expect(result.originalAmount).toBeCloseTo(1000, 5);
    expect(result.gstAmount).toBeCloseTo(180, 5);
  });

  it("round-trips: adding then removing GST returns the original amount", () => {
    const added = calculateGst({ amount: 2500, rate: 12, mode: "add" });
    const removed = calculateGst({ amount: added.totalAmount, rate: 12, mode: "remove" });
    expect(removed.originalAmount).toBeCloseTo(2500, 5);
  });

  it("CGST and SGST always split the GST amount evenly", () => {
    const result = calculateGst({ amount: 999, rate: 28, mode: "add" });
    expect(result.cgst + result.sgst).toBeCloseTo(result.gstAmount, 10);
    expect(result.cgst).toBeCloseTo(result.sgst, 10);
  });
});
