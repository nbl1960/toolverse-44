import { NextRequest, NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/gemini";
import { createRateLimiter, getClientIp, parseGeneratorOutputs } from "@/lib/generator-api";
import { facebookGeneratorFormSchema } from "@/lib/tools/facebook-generator/validations";
import { FACEBOOK_GENERATOR_CONFIG } from "@/lib/tools/facebook-generator/constants";
import type {
  GenerateFacebookContentResponse,
  FacebookGeneratorType,
} from "@/lib/tools/facebook-generator/types";

// Calls a third-party API on every request; must run dynamically.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const OUTPUT_COUNT = 3;
const isRateLimited = createRateLimiter(15);

function isValidGeneratorType(value: unknown): value is FacebookGeneratorType {
  return typeof value === "string" && value in FACEBOOK_GENERATOR_CONFIG;
}

function buildPrompt(type: FacebookGeneratorType, topic: string): string {
  const config = FACEBOOK_GENERATOR_CONFIG[type];

  return `You are an expert Facebook content strategist and copywriter. A user gives you a topic; you produce ${OUTPUT_COUNT} distinct, high-quality options for them to choose from.

Task: ${config.promptInstruction}

Topic: "${topic}"

Format requirements: ${config.formatHint}

Rules:
- Produce exactly ${OUTPUT_COUNT} genuinely different options, not minor rewordings of each other.
- Do not include any preamble, numbering, labels, or commentary — each string in the array should be exactly the ${config.outputNoun} itself, ready to use as-is.
- Respond with ONLY a raw JSON object, no markdown code fences, no commentary, in exactly this shape:
{"outputs": ["...", "...", "..."]}`;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateFacebookContentResponse>> {
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
            "The server is missing a GEMINI_API_KEY. Add it to your environment variables to enable generation.",
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

    const parseResult = facebookGeneratorFormSchema.safeParse({ topic: bodyRecord.topic });
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(bodyRecord.type, parseResult.data.topic);
    const rawText = await generateGeminiText(prompt, apiKey);
    const outputs = parseGeneratorOutputs(rawText, OUTPUT_COUNT);

    return NextResponse.json({ success: true, outputs }, { status: 200 });
  } catch (error) {
    console.error("[/api/tools/facebook-generator/generate] Generation failed:", error);
    const message = error instanceof Error ? error.message : "Something went wrong while generating.";
    return NextResponse.json(
      { success: false, error: `Couldn't generate content: ${message}` },
      { status: 502 }
    );
  }
}
