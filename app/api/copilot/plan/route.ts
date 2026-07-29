import { NextRequest, NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/gemini";
import { createRateLimiter, getClientIp } from "@/lib/generator-api";
import { buildToolCatalogText } from "@/lib/ai-assistant/catalog";
import { getToolBySlug } from "@/lib/tools-registry";
import { COPILOT_MAX_GOAL_LENGTH, COPILOT_MAX_STEPS, COPILOT_MIN_GOAL_LENGTH } from "@/lib/copilot/example-goals";
import type { CopilotPlanResponse, CopilotStepConfidence, RawCopilotStep } from "@/lib/copilot/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isRateLimited = createRateLimiter(15);
const isDev = process.env.NODE_ENV === "development";
const CONFIDENCE_VALUES: CopilotStepConfidence[] = ["essential", "recommended", "optional"];

function logDev(label: string, value: unknown) {
  if (isDev) console.log(`[copilot/plan] ${label}:`, value);
}

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          slug: { type: "string" },
          whyThisStep: { type: "string" },
          confidence: { type: "string", enum: CONFIDENCE_VALUES },
        },
        required: ["slug", "whyThisStep", "confidence"],
        propertyOrdering: ["slug", "whyThisStep", "confidence"],
      },
    },
  },
  required: ["summary", "steps"],
};

function buildPrompt(goal: string, catalog: string): string {
  return `You are the ToolVerse Copilot. A user describes a broader GOAL they're trying to accomplish — not a single task — and you build them a short, ordered, step-by-step path through real tools from the catalog below that gets them there.

CATALOG (format: slug | name | category | tagline) — the complete, only list of tools that exist. You may ONLY use slugs copied exactly from this list:
${catalog}

User's goal: "${goal}"

Task:
1. Write one encouraging, concrete sentence (under 25 words) summarizing the path you're about to lay out.
2. Break the goal into up to ${COPILOT_MAX_STEPS} ordered steps, each using one real tool from the catalog, in the sequence a person would actually want to do them in.
3. For each step, write one short sentence (under 20 words) explaining why that tool fits that step of the goal specifically.
4. Mark each step's confidence: "essential" (a core part of this goal), "recommended" (genuinely helpful, not strictly required), or "optional" (a nice extra once the essentials are done).

Rules:
- ONLY use slugs copied exactly from the catalog above. Never invent a tool or a slug variation that isn't listed verbatim.
- If the catalog doesn't have enough relevant tools to build a meaningful path for this goal, return fewer steps — even zero — rather than padding with weak or unrelated tools.
- Order matters: sequence steps the way someone would actually work through them, not by confidence or alphabetically.
- Don't repeat the same tool twice.`;
}

function parseRawPlan(raw: string): { summary: string; steps: RawCopilotStep[] } {
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
    throw new Error("Response did not contain a JSON object.");
  }
  const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1)) as { summary?: unknown; steps?: unknown };
  if (typeof parsed.summary !== "string" || !Array.isArray(parsed.steps)) {
    throw new Error("Response was valid JSON but missing 'summary' or 'steps'.");
  }
  const steps = parsed.steps.filter(
    (item): item is RawCopilotStep =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as RawCopilotStep).slug === "string" &&
      typeof (item as RawCopilotStep).whyThisStep === "string"
  );
  return { summary: parsed.summary, steps };
}

async function fetchPlanWithRetry(prompt: string, apiKey: string): Promise<{ summary: string; steps: RawCopilotStep[] }> {
  const generationConfig = {
    temperature: 0.3,
    maxOutputTokens: 1200,
    responseMimeType: "application/json",
    responseSchema: RESPONSE_SCHEMA,
  };
  for (let attempt = 1; attempt <= 2; attempt++) {
    const rawText = await generateGeminiText(prompt, apiKey, generationConfig);
    try {
      return parseRawPlan(rawText);
    } catch (error) {
      logDev(`attempt ${attempt} failed to parse`, { error: String(error), rawText });
      if (attempt === 2) throw new Error("The Copilot's response couldn't be understood after two attempts.");
    }
  }
  throw new Error("Unexpected retry loop exit.");
}

function isValidConfidence(value: unknown): value is CopilotStepConfidence {
  return typeof value === "string" && (CONFIDENCE_VALUES as string[]).includes(value);
}

export async function POST(request: NextRequest): Promise<NextResponse<CopilotPlanResponse>> {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "You're planning too quickly. Wait a moment and try again." },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "The server is missing a GEMINI_API_KEY." },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Malformed request body." }, { status: 400 });
    }

    const goal = (body as { goal?: unknown }).goal;
    if (typeof goal !== "string" || goal.trim().length < COPILOT_MIN_GOAL_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Tell us a bit more about what you're trying to accomplish — at least ${COPILOT_MIN_GOAL_LENGTH} characters.` },
        { status: 400 }
      );
    }
    if (goal.trim().length > COPILOT_MAX_GOAL_LENGTH) {
      return NextResponse.json({ success: false, error: `Keep it under ${COPILOT_MAX_GOAL_LENGTH} characters.` }, { status: 400 });
    }

    const catalog = buildToolCatalogText();
    const prompt = buildPrompt(goal.trim(), catalog);

    let plan: { summary: string; steps: RawCopilotStep[] };
    try {
      plan = await fetchPlanWithRetry(prompt, apiKey);
    } catch (error) {
      console.error("[/api/copilot/plan] Unparseable after retry:", error);
      return NextResponse.json(
        { success: false, error: "The Copilot is having trouble right now. Try rephrasing your goal or try again shortly." },
        { status: 502 }
      );
    }

    // Same grounding discipline as the AI Guide: the model only picked
    // slugs, wrote reasons, and assigned confidence. Every other field —
    // name, tagline, icon, route — comes from the real registry via
    // getToolBySlug(). A hallucinated slug is dropped silently, not
    // surfaced as an error. Steps are then re-numbered 1..n over
    // whatever survives grounding, so there's never a gap in the
    // sequence shown to the user.
    const seen = new Set<string>();
    const steps = plan.steps
      .map((step) => {
        const tool = getToolBySlug(step.slug);
        if (!tool || tool.status !== "live" || seen.has(tool.slug)) return null;
        seen.add(tool.slug);
        return {
          slug: tool.slug,
          name: tool.name,
          tagline: tool.tagline,
          iconName: tool.iconName,
          route: `/tools/${tool.slug}`,
          whyThisStep: step.whyThisStep.trim(),
          confidence: isValidConfidence(step.confidence) ? step.confidence : ("recommended" as const),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .slice(0, COPILOT_MAX_STEPS)
      .map((step, index) => ({ ...step, order: index + 1 }));

    return NextResponse.json(
      { success: true, goal: goal.trim(), summary: plan.summary.trim(), steps },
      { status: 200 }
    );
  } catch (error) {
    console.error("[/api/copilot/plan] Failed:", error);
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ success: false, error: `Couldn't build a plan right now: ${message}` }, { status: 502 });
  }
}
