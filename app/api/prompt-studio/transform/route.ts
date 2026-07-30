import { NextRequest, NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/gemini";
import { createRateLimiter, getClientIp } from "@/lib/generator-api";
import { getTargetModel, TARGET_MODELS } from "@/lib/prompt-studio/models";
import type { TargetModelId, TransformResponse } from "@/lib/prompt-studio/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isRateLimited = createRateLimiter(15);
const MIN_LENGTH = 4;
const MAX_LENGTH = 500;
const VALID_MODEL_IDS = TARGET_MODELS.map((m) => m.id);

function buildPrompt(request: string, targetModelId: TargetModelId): string {
  const model = getTargetModel(targetModelId);
  const convention = model?.description ?? "";
  return `You are a prompt engineering assistant. A user gives you a simple, rough request, and you rewrite it into a well-structured, professional prompt optimized specifically for ${model?.name ?? targetModelId}.

Target model's effective prompting convention: ${convention}

User's rough request: "${request}"

Rules:
- Write ONLY the improved prompt itself — no preamble, no explanation, no markdown code fences, no "Here's your prompt:" framing.
- Follow the target model's actual convention described above — a chat-model prompt should NOT look like a comma-separated image prompt, and vice versa.
- Preserve the user's original intent exactly — add structure and clarity, never invent a different task than what they asked for.
- Keep it genuinely usable — something a person could paste directly into ${model?.name ?? "the target model"} right now.`;
}

export async function POST(request: NextRequest): Promise<NextResponse<TransformResponse>> {
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
      return NextResponse.json({ success: false, error: "The server is missing a GEMINI_API_KEY." }, { status: 500 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Malformed request body." }, { status: 400 });
    }

    const { request: rawRequest, targetModel } = body as { request?: unknown; targetModel?: unknown };

    if (typeof rawRequest !== "string" || rawRequest.trim().length < MIN_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Describe what you want in at least ${MIN_LENGTH} characters.` },
        { status: 400 }
      );
    }
    if (rawRequest.trim().length > MAX_LENGTH) {
      return NextResponse.json({ success: false, error: `Keep it under ${MAX_LENGTH} characters.` }, { status: 400 });
    }
    if (typeof targetModel !== "string" || !VALID_MODEL_IDS.includes(targetModel as TargetModelId)) {
      return NextResponse.json({ success: false, error: "Choose a valid target model." }, { status: 400 });
    }

    const prompt = buildPrompt(rawRequest.trim(), targetModel as TargetModelId);
    const structuredPrompt = await generateGeminiText(prompt, apiKey, { temperature: 0.4, maxOutputTokens: 600 });

    return NextResponse.json(
      { success: true, structuredPrompt: structuredPrompt.trim(), targetModel: targetModel as TargetModelId },
      { status: 200 }
    );
  } catch (error) {
    console.error("[/api/prompt-studio/transform] Failed:", error);
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ success: false, error: `Couldn't generate a prompt right now: ${message}` }, { status: 502 });
  }
}
