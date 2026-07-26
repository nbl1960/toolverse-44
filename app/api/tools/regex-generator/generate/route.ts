import { NextRequest, NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/gemini";
import { createRateLimiter, getClientIp } from "@/lib/generator-api";
import { regexGeneratorFormSchema } from "@/lib/tools/regex-generator/validations";
import type { GenerateRegexResponse, RegexResult } from "@/lib/tools/regex-generator/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isRateLimited = createRateLimiter(15);

function buildPrompt(description: string): string {
  return `You are an expert in regular expressions. A user describes, in plain English, what they want to match; you produce a working JavaScript-compatible regex pattern.

Description: "${description}"

Task:
1. Write a regex pattern that matches this description. Use standard JavaScript regex syntax (no leading/trailing slashes, no flags in the pattern string itself).
2. Write a short, clear explanation of how the pattern works.
3. Give one example string that the pattern would match.

Rules:
- The pattern must be valid, working regex syntax.
- In the JSON string for "pattern", escape backslashes correctly (e.g. a literal backslash-d becomes \\\\d in the JSON string).
- Do not include any preamble or commentary outside the JSON.
- Respond with ONLY a raw JSON object, no markdown code fences, in exactly this shape:
{"pattern": "...", "explanation": "...", "example": "..."}`;
}

function parseRegexResult(raw: string): RegexResult {
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
    throw new Error("Model response did not contain a parseable JSON object.");
  }
  const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1)) as Partial<RegexResult>;
  if (typeof parsed.pattern !== "string" || typeof parsed.explanation !== "string" || typeof parsed.example !== "string") {
    throw new Error("Model response was missing a required field.");
  }

  // Real safety check, not just trusting the model: confirm the returned
  // pattern is actually syntactically valid regex before handing it back.
  try {
    new RegExp(parsed.pattern);
  } catch {
    throw new Error("The generated pattern wasn't valid regex syntax. Try rephrasing your description.");
  }

  return { pattern: parsed.pattern.trim(), explanation: parsed.explanation.trim(), example: parsed.example.trim() };
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateRegexResponse>> {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "You're generating too quickly. Wait a moment and try again." },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "The server is missing a GEMINI_API_KEY. Add it to your environment variables to enable this tool." },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Malformed request body." }, { status: 400 });
    }

    const parseResult = regexGeneratorFormSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json({ success: false, error: firstIssue?.message ?? "Invalid input." }, { status: 400 });
    }

    const prompt = buildPrompt(parseResult.data.description);
    const rawText = await generateGeminiText(prompt, apiKey);
    const result = parseRegexResult(rawText);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("[/api/tools/regex-generator/generate] Generation failed:", error);
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ success: false, error: `Couldn't generate a regex: ${message}` }, { status: 502 });
  }
}
