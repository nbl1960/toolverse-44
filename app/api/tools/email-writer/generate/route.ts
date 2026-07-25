import { NextRequest, NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/gemini";
import { emailFormSchema } from "@/lib/tools/email-writer/validations";
import { LENGTH_OPTIONS, TONE_OPTIONS } from "@/lib/tools/email-writer/constants";
import type { GenerateEmailResponse, GeneratedEmail } from "@/lib/tools/email-writer/types";

// This route calls a third-party API on every request, so it must run
// dynamically rather than be statically optimized.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Basic in-memory rate limiter: N requests per IP per minute. */
const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 60_000;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Builds the instruction prompt sent to Gemini for a given, validated form. */
function buildPrompt(input: {
  topic: string;
  recipientName: string;
  senderName: string;
  tone: string;
  length: string;
}): string {
  const toneMeta = TONE_OPTIONS.find((t) => t.value === input.tone);
  const lengthMeta = LENGTH_OPTIONS.find((l) => l.value === input.length);

  const recipientLine = input.recipientName
    ? `The recipient's name is "${input.recipientName}". Address them appropriately in the greeting.`
    : `No recipient name was given. Use a generic but polite greeting (e.g. "Hi there,").`;

  const senderLine = input.senderName
    ? `Sign the email off using the sender's name: "${input.senderName}".`
    : `No sender name was given. End with a generic sign-off with no name (e.g. "Best regards,") and no placeholder brackets.`;

  return `You are an expert email-writing assistant. Draft a complete, ready-to-send email.

Topic / context for the email: "${input.topic}"

Tone: ${toneMeta?.label ?? input.tone} (${toneMeta?.description ?? ""})
Target length: ${lengthMeta?.label ?? input.length} (${lengthMeta?.wordRange ?? ""})

${recipientLine}
${senderLine}

Rules:
- Write a concise, compelling subject line (no "Subject:" prefix, no quotation marks).
- Write the full email body with a greeting, body paragraphs, and a sign-off.
- Do not use placeholder brackets like [Name] or [Company] anywhere — if information is missing, phrase around it naturally.
- Match the requested tone and length precisely.
- Respond with ONLY a raw JSON object, no markdown code fences, no commentary, in exactly this shape:
{"subject": "...", "body": "..."}
- In the "body" field, use "\\n\\n" to separate paragraphs and "\\n" for line breaks (e.g. after the greeting, before the sign-off).`;
}

/** Extracts and parses the {subject, body} JSON object from Gemini's raw text reply. */
function parseModelOutput(raw: string): GeneratedEmail {
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
  const parsed = JSON.parse(jsonSlice) as Partial<GeneratedEmail>;

  if (typeof parsed.subject !== "string" || typeof parsed.body !== "string") {
    throw new Error("Model response was missing 'subject' or 'body'.");
  }

  return { subject: parsed.subject.trim(), body: parsed.body.trim() };
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateEmailResponse>> {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "You're generating emails too quickly. Wait a moment and try again." },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The server is missing a GEMINI_API_KEY. Add it to your environment variables to enable email generation.",
        },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Malformed request body." },
        { status: 400 }
      );
    }

    const parseResult = emailFormSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    const { topic, recipientName, senderName, tone, length } = parseResult.data;

    const prompt = buildPrompt({ topic, recipientName, senderName, tone, length });
    const rawText = await generateGeminiText(prompt, apiKey);
    const email = parseModelOutput(rawText);

    return NextResponse.json({ success: true, email }, { status: 200 });
  } catch (error) {
    console.error("[/api/tools/email-writer/generate] Generation failed:", error);
    const message = error instanceof Error ? error.message : "Something went wrong while generating your email.";
    return NextResponse.json(
      { success: false, error: `Couldn't generate the email: ${message}` },
      { status: 502 }
    );
  }
}
