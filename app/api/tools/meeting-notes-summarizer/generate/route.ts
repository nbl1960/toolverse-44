import { NextRequest, NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/gemini";
import { createRateLimiter, getClientIp } from "@/lib/generator-api";
import { summarizeNotesFormSchema } from "@/lib/tools/meeting-notes-summarizer/validations";
import type { MeetingSummaryResult, SummarizeNotesResponse } from "@/lib/tools/meeting-notes-summarizer/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isRateLimited = createRateLimiter(15);

function buildPrompt(notes: string): string {
  return `You are an expert meeting-notes summarizer. A user gives you raw, possibly messy meeting notes or a transcript; you extract structure from them.

Notes: "${notes}"

Task:
1. Write a concise 1-3 sentence summary of what the meeting was about.
2. List the concrete decisions that were made (empty array if none were clearly made).
3. List the action items, including who owns each one if mentioned (empty array if none).

Rules:
- Only include decisions and action items that are actually present in the notes — do not invent any.
- Do not include any preamble or commentary outside the JSON.
- Respond with ONLY a raw JSON object, no markdown code fences, in exactly this shape:
{"summary": "...", "decisions": ["...", "..."], "actionItems": ["...", "..."]}`;
}

function parseSummaryResult(raw: string): MeetingSummaryResult {
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
    throw new Error("Model response did not contain a parseable JSON object.");
  }
  const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1)) as Partial<MeetingSummaryResult>;
  if (typeof parsed.summary !== "string") {
    throw new Error("Model response was missing a summary.");
  }
  const decisions = Array.isArray(parsed.decisions)
    ? parsed.decisions.filter((d): d is string => typeof d === "string" && d.trim().length > 0)
    : [];
  const actionItems = Array.isArray(parsed.actionItems)
    ? parsed.actionItems.filter((a): a is string => typeof a === "string" && a.trim().length > 0)
    : [];
  return { summary: parsed.summary.trim(), decisions, actionItems };
}

export async function POST(request: NextRequest): Promise<NextResponse<SummarizeNotesResponse>> {
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

    const parseResult = summarizeNotesFormSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json({ success: false, error: firstIssue?.message ?? "Invalid input." }, { status: 400 });
    }

    const prompt = buildPrompt(parseResult.data.notes);
    const rawText = await generateGeminiText(prompt, apiKey);
    const result = parseSummaryResult(rawText);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("[/api/tools/meeting-notes-summarizer/generate] Summarization failed:", error);
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ success: false, error: `Couldn't summarize these notes: ${message}` }, { status: 502 });
  }
}
