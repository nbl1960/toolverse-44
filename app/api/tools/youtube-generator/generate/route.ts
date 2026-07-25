import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { youtubeGeneratorFormSchema } from "@/lib/tools/youtube-generator/validations";
import { YOUTUBE_GENERATOR_CONFIG } from "@/lib/tools/youtube-generator/constants";
import type {
  GenerateYoutubeContentResponse,
  YoutubeGeneratorType,
} from "@/lib/tools/youtube-generator/types";

// Calls a third-party API on every request; must run dynamically.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MODEL = "claude-sonnet-5";
const OUTPUT_COUNT = 3;

/** Basic in-memory rate limiter: N requests per IP per minute. */
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isValidGeneratorType(value: unknown): value is YoutubeGeneratorType {
  return typeof value === "string" && value in YOUTUBE_GENERATOR_CONFIG;
}

function buildPrompt(type: YoutubeGeneratorType, topic: string): string {
  const config = YOUTUBE_GENERATOR_CONFIG[type];

  return `You are an expert YouTube growth strategist and copywriter. A creator gives you a topic; you produce ${OUTPUT_COUNT} distinct, high-quality options for them to choose from.

Task: ${config.promptInstruction}

Video topic: "${topic}"

Format requirements: ${config.formatHint}

Rules:
- Produce exactly ${OUTPUT_COUNT} genuinely different options, not minor rewordings of each other.
- Do not include any preamble, numbering, labels, or commentary — each string in the array should be exactly the ${config.outputNoun} itself, ready to use as-is.
- Respond with ONLY a raw JSON object, no markdown code fences, no commentary, in exactly this shape:
{"outputs": ["...", "...", "..."]}`;
}

/** Extracts and parses the {outputs: [...]} JSON object from Claude's raw text reply. */
function parseModelOutput(raw: string): string[] {
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
  const parsed = JSON.parse(jsonSlice) as { outputs?: unknown };

  if (!Array.isArray(parsed.outputs) || parsed.outputs.length === 0) {
    throw new Error("Model response was missing a valid 'outputs' array.");
  }

  const outputs = parsed.outputs
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  if (outputs.length === 0) {
    throw new Error("Model response contained no usable outputs.");
  }

  return outputs.slice(0, OUTPUT_COUNT);
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateYoutubeContentResponse>> {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "You're generating too quickly. Wait a moment and try again." },
        { status: 429 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The server is missing an ANTHROPIC_API_KEY. Add it to your environment variables to enable generation.",
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

    const bodyRecord = body as { type?: unknown; topic?: unknown };
    if (!isValidGeneratorType(bodyRecord.type)) {
      return NextResponse.json({ success: false, error: "Unknown generator type." }, { status: 400 });
    }

    const parseResult = youtubeGeneratorFormSchema.safeParse({ topic: bodyRecord.topic });
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey });
    const prompt = buildPrompt(bodyRecord.type, parseResult.data.topic);

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("The model did not return any text.");
    }

    const outputs = parseModelOutput(textBlock.text);

    return NextResponse.json({ success: true, outputs }, { status: 200 });
  } catch (error) {
    console.error("[/api/tools/youtube-generator/generate] Generation failed:", error);
    const message = error instanceof Error ? error.message : "Something went wrong while generating.";
    return NextResponse.json(
      { success: false, error: `Couldn't generate content: ${message}` },
      { status: 502 }
    );
  }
}
