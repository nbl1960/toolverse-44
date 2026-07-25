import { NextRequest, NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/gemini";
import { createRateLimiter, getClientIp } from "@/lib/generator-api";
import { optimizeProfileFormSchema } from "@/lib/tools/linkedin-profile-optimizer/validations";
import type {
  OptimizeProfileResponse,
  ProfileOptimizationResult,
} from "@/lib/tools/linkedin-profile-optimizer/types";

// Calls a third-party API on every request; must run dynamically.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isRateLimited = createRateLimiter(15);

function buildPrompt(text: string): string {
  return `You are an expert LinkedIn profile strategist. A user gives you their current LinkedIn headline or About section text; you improve it and explain why.

Current text: "${text}"

Task:
1. Rewrite this into a stronger version — sharper, more specific, and more likely to stand out, while staying true to what the original text actually says (don't invent achievements or experience that weren't mentioned).
2. List 3-5 specific, actionable reasons why the rewrite is stronger (e.g. "Added a specific outcome instead of a generic duty", not vague praise).

Rules:
- If the input is headline-length (under ~250 characters), keep the improved version headline-length too. If it's About-section-length, keep the improved version in that same longer format.
- Do not include any preamble or commentary outside the JSON.
- Respond with ONLY a raw JSON object, no markdown code fences, in exactly this shape:
{"improvedVersion": "...", "suggestions": ["...", "...", "..."]}`;
}

function parseOptimizationResult(raw: string): ProfileOptimizationResult {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
    throw new Error("Model response did not contain a parseable JSON object.");
  }

  const jsonSlice = cleaned.slice(jsonStart, jsonEnd + 1);
  const parsed = JSON.parse(jsonSlice) as Partial<ProfileOptimizationResult>;

  if (typeof parsed.improvedVersion !== "string" || !Array.isArray(parsed.suggestions)) {
    throw new Error("Model response was missing 'improvedVersion' or 'suggestions'.");
  }

  const suggestions = parsed.suggestions
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  if (suggestions.length === 0) {
    throw new Error("Model response contained no usable suggestions.");
  }

  return { improvedVersion: parsed.improvedVersion.trim(), suggestions };
}

export async function POST(request: NextRequest): Promise<NextResponse<OptimizeProfileResponse>> {
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
        {
          success: false,
          error:
            "The server is missing a GEMINI_API_KEY. Add it to your environment variables to enable this tool.",
        },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Malformed request body." }, { status: 400 });
    }

    const parseResult = optimizeProfileFormSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(parseResult.data.text);
    const rawText = await generateGeminiText(prompt, apiKey);
    const result = parseOptimizationResult(rawText);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("[/api/tools/linkedin-profile-optimizer/generate] Optimization failed:", error);
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json(
      { success: false, error: `Couldn't optimize this text: ${message}` },
      { status: 502 }
    );
  }
}
