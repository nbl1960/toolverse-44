import type { AnalyzerCheck, AnalyzerResult } from "./types";

const VAGUE_WORDS = ["something", "stuff", "things", "good", "nice", "better", "some", "etc"];

/**
 * Deterministic, rule-based analysis — not an AI-generated score. A
 * "quality score out of 100" produced by asking an LLM to judge a
 * prompt is an arbitrary, unverifiable number dressed up as an
 * objective measurement. This instead checks for specific, well-
 * established prompt-engineering practices (role definition, explicit
 * format, constraints, examples) — every point is inspectable and
 * explainable, and the same input always produces the same result.
 */
export function analyzePrompt(rawPrompt: string): AnalyzerResult {
  const prompt = rawPrompt.trim();
  const lower = prompt.toLowerCase();
  const wordCount = prompt.length === 0 ? 0 : prompt.split(/\s+/).length;
  const vagueWordCount = VAGUE_WORDS.filter((w) => new RegExp(`\\b${w}\\b`, "i").test(lower)).length;

  const checks: AnalyzerCheck[] = [
    {
      id: "role",
      label: "Defines a role or persona",
      passed: /\b(you are|act as|as an? |your role is)\b/i.test(prompt),
      hint: 'Try starting with "You are a..." or "Act as a..." to anchor the response.',
    },
    {
      id: "task",
      label: "States a specific, actionable task",
      passed: wordCount >= 6 && /\b(write|create|generate|explain|summarize|list|analyze|design|build|draft|compare|translate|convert|review)\b/i.test(lower),
      hint: "Lead with a concrete action verb — write, create, explain, summarize, analyze — rather than a vague topic.",
    },
    {
      id: "context",
      label: "Provides context or background",
      passed: wordCount >= 20,
      hint: "Add a sentence of background — who it's for, why it matters, what's already been tried.",
    },
    {
      id: "format",
      label: "Specifies the desired output format",
      passed: /\b(bullet|list|table|json|paragraph|steps?|outline|markdown|word count|words?|sentences?|headings?|sections?)\b/i.test(lower),
      hint: 'Specify how you want the answer structured — e.g. "as a bulleted list" or "in 3 short paragraphs".',
    },
    {
      id: "constraints",
      label: "Includes constraints (length, tone, audience)",
      passed: /\b(tone|audience|beginner|expert|professional|casual|formal|concise|detailed|under \d+|at least|no more than|for a|aimed at)\b/i.test(lower),
      hint: 'Add constraints like tone ("professional"), audience ("for beginners"), or length ("under 200 words").',
    },
    {
      id: "examples",
      label: "Includes an example or reference",
      passed: /\b(for example|e\.g\.|such as|like this|similar to|here's an example)\b/i.test(lower),
      hint: "One concrete example dramatically improves output consistency — even a single sentence helps.",
    },
    {
      id: "length",
      label: "Long enough to be actionable",
      passed: wordCount >= 8,
      hint: "Very short prompts leave too much to interpretation — aim for at least a full sentence of detail.",
    },
    {
      id: "vague-language",
      label: "Avoids vague filler words",
      passed: wordCount === 0 || vagueWordCount === 0,
      hint: 'Replace vague words like "stuff", "things", or "good" with specific nouns and outcomes.',
    },
    {
      id: "negative-constraints",
      label: "States what to avoid (optional but helpful)",
      passed: /\b(avoid|don't|do not|without|never|no jargon|not too)\b/i.test(lower),
      hint: 'Telling the model what NOT to do — e.g. "avoid jargon" — is often as useful as saying what to do.',
    },
  ];

  const score = checks.filter((c) => c.passed).length;
  return { score, maxScore: checks.length, checks };
}

export type AnalyzerRating = "Needs work" | "Fair" | "Good" | "Excellent";

/** A plain-language label for the score — a raw "5/9" is less immediately meaningful than "Good". */
export function getAnalyzerRating(score: number, maxScore: number): AnalyzerRating {
  const ratio = maxScore === 0 ? 0 : score / maxScore;
  if (ratio >= 0.85) return "Excellent";
  if (ratio >= 0.6) return "Good";
  if (ratio >= 0.35) return "Fair";
  return "Needs work";
}
