import { describe, it, expect } from "vitest";
import { calculateEmiAmount, calculateLoan } from "@/lib/finance/loan";

describe("calculateEmiAmount", () => {
  it("matches an independently-computed reference EMI value", () => {
    // Reference value computed separately via the standard formula
    // EMI = P*r*(1+r)^n / ((1+r)^n - 1) for ₹100,000 at 10% annual for
    // 12 months — verified independently before writing this assertion.
    // Note: this function takes the ANNUAL rate directly (it converts
    // to monthly internally) — confirmed against the actual signature.
    const emi = calculateEmiAmount(100000, 10, 12);
    expect(emi).toBeCloseTo(8791.59, 1);
  });
});

describe("calculateLoan", () => {
  it("produces an amortization schedule where the final balance reaches zero", () => {
    const result = calculateLoan(500000, 8.5, 60);
    const finalRow = result.schedule[result.schedule.length - 1];
    expect(finalRow?.balance).toBeCloseTo(0, 1);
  });

  it("produces a schedule with exactly one row per month of tenure", () => {
    const result = calculateLoan(200000, 7, 24);
    expect(result.schedule).toHaveLength(24);
  });

  it("total interest paid equals the sum of each month's interest component", () => {
    const result = calculateLoan(300000, 9, 36);
    const summedInterest = result.schedule.reduce((sum, row) => sum + row.interest, 0);
    expect(result.totalInterest).toBeCloseTo(summedInterest, 1);
  });

  it("a higher interest rate always produces a higher total interest for the same principal and tenure", () => {
    const lower = calculateLoan(100000, 6, 12);
    const higher = calculateLoan(100000, 12, 12);
    expect(higher.totalInterest).toBeGreaterThan(lower.totalInterest);
  });
});
