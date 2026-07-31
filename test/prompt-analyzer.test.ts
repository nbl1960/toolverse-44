import { describe, it, expect } from "vitest";
import { analyzePrompt, getAnalyzerRating } from "@/lib/prompt-studio/analyzer";

describe("analyzePrompt", () => {
  it("scores a comprehensive, well-structured prompt highly", () => {
    const result = analyzePrompt(
      "You are an expert copywriter. Write a professional 300-word blog post about coffee for beginners, formatted with headings and bullet points, in a friendly tone, avoiding jargon. For example, start with a relatable hook."
    );
    expect(result.score).toBeGreaterThanOrEqual(17);
    expect(result.maxScore).toBe(20);
  });

  it("scores a trivially short prompt near zero", () => {
    const result = analyzePrompt("help");
    expect(result.score).toBeLessThanOrEqual(1);
  });

  it("scores an empty prompt near zero without throwing", () => {
    const result = analyzePrompt("");
    expect(result.score).toBeLessThanOrEqual(1);
    expect(result.maxScore).toBe(20);
  });

  it("weights always sum to exactly 20, regardless of input", () => {
    for (const input of ["", "a", "a longer test prompt here", "You are an expert. Write something detailed."]) {
      const result = analyzePrompt(input);
      const summedWeights = result.checks.reduce((sum, c) => sum + c.weight, 0);
      expect(summedWeights).toBe(20);
      expect(result.maxScore).toBe(20);
    }
  });

  it("only counts a check's weight toward the score when it actually passed", () => {
    const result = analyzePrompt("write a blog post");
    const manualScore = result.checks.filter((c) => c.passed).reduce((sum, c) => sum + c.weight, 0);
    expect(result.score).toBe(manualScore);
  });

  it("detects a defined role", () => {
    const withRole = analyzePrompt("You are a career coach. Help me improve my resume with specific, actionable feedback.");
    const withoutRole = analyzePrompt("Help me improve my resume with specific, actionable feedback please.");
    const roleCheck = (r: ReturnType<typeof analyzePrompt>) => r.checks.find((c) => c.id === "role")?.passed;
    expect(roleCheck(withRole)).toBe(true);
    expect(roleCheck(withoutRole)).toBe(false);
  });

  it("detects vague filler words and only flags them when actually present", () => {
    const vague = analyzePrompt("Please write something good about stuff that matters.");
    const specific = analyzePrompt("Write a 200-word article about renewable energy policy for policymakers.");
    const vagueCheck = (r: ReturnType<typeof analyzePrompt>) => r.checks.find((c) => c.id === "vague-language")?.passed;
    expect(vagueCheck(vague)).toBe(false);
    expect(vagueCheck(specific)).toBe(true);
  });
});

describe("getAnalyzerRating", () => {
  it("returns Excellent for a high ratio", () => {
    expect(getAnalyzerRating(18, 20)).toBe("Excellent");
  });

  it("returns Good for a mid-high ratio", () => {
    expect(getAnalyzerRating(13, 20)).toBe("Good");
  });

  it("returns Fair for a mid-low ratio", () => {
    expect(getAnalyzerRating(8, 20)).toBe("Fair");
  });

  it("returns Needs work for a low ratio", () => {
    expect(getAnalyzerRating(2, 20)).toBe("Needs work");
  });

  it("never divides by zero when maxScore is 0", () => {
    expect(getAnalyzerRating(0, 0)).toBe("Needs work");
  });
});
