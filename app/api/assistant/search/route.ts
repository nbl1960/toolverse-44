import { NextRequest, NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/gemini";
import { createRateLimiter, getClientIp } from "@/lib/generator-api";
import {
  buildToolCatalogText,
  getFallbackSuggestions,
  getRelatedToolLinks,
  MAX_QUERY_LENGTH,
  MAX_RECOMMENDATIONS,
  MIN_QUERY_LENGTH,
} from "@/lib/ai-assistant/catalog";
import { getToolBySlug } from "@/lib/tools-registry";
import {
  confidenceScoreToTier,
  MIN_CONFIDENCE_SCORE,
  type AssistantSearchResponse,
  type RawAssistantMatch,
} from "@/lib/ai-assistant/types";

// Calls a third-party API on every request; must run dynamically.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isRateLimited = createRateLimiter(20);
const isDev = process.env.NODE_ENV === "development";

/** Only logged in development — never in production, to avoid leaking user queries or model output into production logs. */
function logDev(label: string, value: unknown) {
  if (isDev) {
    console.log(`[assistant/search] ${label}:`, value);
  }
}

/**
 * OpenAPI-3.0-subset schema, passed to Gemini as `responseSchema` — this
 * is what actually prevents malformed JSON, by constraining the model's
 * output at the token-sampling level rather than just asking nicely in
 * the prompt. Combined with `responseMimeType: "application/json"` (set
 * on the fetch call below), Gemini is guaranteed to return valid JSON
 * matching this exact shape. `confidence` is a plain integer here —
 * Gemini never assigns the "Best Match"/"Good Match"/"Related" label
 * directly; that's derived deterministically from the number server-side
 * (see confidenceScoreToTier), so a result can never claim a tier that
 * contradicts its own score.
 */
const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          slug: { type: "string" },
          reason: { type: "string" },
          confidence: { type: "integer" },
        },
        required: ["slug", "reason", "confidence"],
        propertyOrdering: ["slug", "reason", "confidence"],
      },
    },
  },
  required: ["recommendations"],
};

function buildPrompt(query: string, catalog: string): string {
  return `You are the ToolVerse Tool Assistant. A user describes, in their own words, what they're trying to do. Find the tools from the catalog below that genuinely help — matching on the underlying task and intent, not just literal keyword overlap. For example: "shrink a photo before uploading" should match an image compressor even without the word "shrink" in its listing; "turn text into a QR code" should match a QR generator; "check if my headline is good" should match a headline analyzer or scorer.

CATALOG (format: slug | name | category | tagline) — this is the complete, only list of tools that exist. You may ONLY recommend slugs that appear literally in this list:
${catalog}

User's request: "${query}"

Task:
1. Recommend up to ${MAX_RECOMMENDATIONS} tools that genuinely help with this request, ranked most relevant first.
2. For each, assign a confidence score from 0 to 100 reflecting how well it actually fits: 80-100 means it directly and precisely does what was asked, 60-79 means it clearly helps but maybe with an extra step, below 60 means it's only loosely related.
3. For each, write one short, specific sentence (under 20 words) explaining why THIS tool fits THIS request — not a generic description of the tool.

Rules:
- ONLY use slugs copied exactly from the catalog above. Never invent a slug, a tool, or a variation of a slug that isn't listed verbatim.
- If nothing in the catalog is a good match for the request, return an empty "recommendations" array rather than forcing a weak or unrelated match. Do not pad the list to reach 5.
- Be honest about the score: don't inflate a loose or partial fit into an 80+ just to seem confident. A genuinely poor fit should score low, even if it's the closest thing available.`;
}

/** Thrown when a Gemini response can't be turned into a usable recommendation list at all — distinct from individual items being dropped, which is normal and expected. */
class UnparseableAssistantResponse extends Error {}

/**
 * Parses and validates a raw Gemini response into the raw match list.
 * Two distinct failure modes are handled differently:
 *  - JSON.parse() itself throwing (malformed JSON) → caught explicitly,
 *    re-thrown as UnparseableAssistantResponse so the caller can retry.
 *  - Valid JSON but missing/wrong-shaped "recommendations" → also
 *    treated as unparseable and eligible for retry.
 *  - Individual array items with the wrong shape → filtered out
 *    silently; this is NOT a retry-triggering failure, since a partially
 *    good response is still useful.
 */
function parseRawMatches(raw: string): RawAssistantMatch[] {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
    throw new UnparseableAssistantResponse("Response did not contain a JSON object.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
  } catch (parseError) {
    // The exact failure the user reported ("Expected ',' or ']' after
    // array element...") lands here — caught explicitly rather than
    // left to crash the request.
    throw new UnparseableAssistantResponse(
      parseError instanceof Error ? parseError.message : "Malformed JSON."
    );
  }

  const recommendations = (parsed as { recommendations?: unknown }).recommendations;
  if (!Array.isArray(recommendations)) {
    throw new UnparseableAssistantResponse("Response was valid JSON but missing a 'recommendations' array.");
  }

  return recommendations.filter(
    (item): item is RawAssistantMatch =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as RawAssistantMatch).slug === "string" &&
      typeof (item as RawAssistantMatch).reason === "string"
  );
}

/**
 * Calls Gemini and parses the result, retrying once if the response
 * can't be parsed at all (malformed JSON or the wrong top-level shape).
 * A second consecutive failure gives up and lets the caller show a
 * friendly message — this never throws the raw parse error up to the
 * user.
 */
async function fetchRecommendationsWithRetry(prompt: string, apiKey: string): Promise<RawAssistantMatch[]> {
  const generationConfig = {
    temperature: 0.2,
    maxOutputTokens: 1024,
    responseMimeType: "application/json",
    responseSchema: RESPONSE_SCHEMA,
  };

  for (let attempt = 1; attempt <= 2; attempt++) {
    const rawText = await generateGeminiText(prompt, apiKey, generationConfig);
    try {
      return parseRawMatches(rawText);
    } catch (error) {
      logDev(`attempt ${attempt} failed to parse`, { error: String(error), rawText });
      if (attempt === 2) {
        throw new UnparseableAssistantResponse("The AI Guide's response couldn't be understood after two attempts.");
      }
      // First failure: fall through and retry once.
    }
  }

  // Unreachable, but keeps TypeScript's control-flow analysis happy.
  throw new UnparseableAssistantResponse("Unexpected retry loop exit.");
}

/** Never trusts Gemini's number blindly — clamps to a valid 0-100 integer, defaulting to 0 (not 100) if the value is missing or malformed, so a bad value can never accidentally look confident. */
function sanitizeConfidenceScore(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export async function POST(request: NextRequest): Promise<NextResponse<AssistantSearchResponse>> {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "You're searching too quickly. Wait a moment and try again." },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "The server is missing a GEMINI_API_KEY. Add it to your environment variables to enable the assistant." },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Malformed request body." }, { status: 400 });
    }

    const query = (body as { query?: unknown }).query;
    if (typeof query !== "string" || query.trim().length < MIN_QUERY_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Tell us a bit more about what you're trying to do — at least ${MIN_QUERY_LENGTH} characters.` },
        { status: 400 }
      );
    }
    if (query.trim().length > MAX_QUERY_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Keep it under ${MAX_QUERY_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const catalog = buildToolCatalogText();
    const prompt = buildPrompt(query.trim(), catalog);

    let rawMatches: RawAssistantMatch[];
    try {
      rawMatches = await fetchRecommendationsWithRetry(prompt, apiKey);
    } catch (error) {
      if (error instanceof UnparseableAssistantResponse) {
        // The friendly message the user asked for — never the raw
        // "Expected ',' or ']'..." parser error.
        console.error("[/api/assistant/search] Gemini response unparseable after retry:", error.message);
        return NextResponse.json(
          {
            success: false,
            error: "The AI Guide is having trouble right now. Please try rephrasing your request or try again in a moment.",
          },
          { status: 502 }
        );
      }
      throw error;
    }

    // The critical grounding step: Gemini's job was only to pick slugs,
    // write reasons, and assign a numeric confidence score. Every other
    // field shown to the user — name, tagline, category, icon, route,
    // pricing, related tools, and even the confidence TIER label — comes
    // from OUR OWN registry or is derived deterministically, never taken
    // from the model's text directly. Any slug that doesn't actually
    // exist (a hallucination) is silently dropped here, not surfaced as
    // an error — the user just sees fewer, all-real results.
    const seen = new Set<string>();
    const allRecommendations = rawMatches
      .map((match) => {
        const tool = getToolBySlug(match.slug);
        if (!tool || tool.status !== "live" || seen.has(tool.slug)) return null;
        seen.add(tool.slug);
        const confidenceScore = sanitizeConfidenceScore(match.confidence);
        return {
          slug: tool.slug,
          name: tool.name,
          tagline: tool.tagline,
          category: tool.category,
          iconName: tool.iconName,
          reason: match.reason.trim(),
          confidenceScore,
          confidence: confidenceScoreToTier(confidenceScore),
          pricing: "Free" as const,
          route: `/tools/${tool.slug}`,
          relatedTools: getRelatedToolLinks(tool.slug),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.confidenceScore - a.confidenceScore)
      .slice(0, MAX_RECOMMENDATIONS);

    // If the single best result still doesn't clear the confidence bar,
    // don't show a page of weak matches presented as if they were good
    // ones — show the honest "no confident match" state instead, with
    // real fallback suggestions rather than a dead end.
    const bestScore = allRecommendations[0]?.confidenceScore ?? 0;
    const belowThreshold = allRecommendations.length === 0 || bestScore < MIN_CONFIDENCE_SCORE;

    return NextResponse.json(
      {
        success: true,
        recommendations: belowThreshold ? [] : allRecommendations,
        ...(belowThreshold
          ? { fallbackSuggestions: getFallbackSuggestions(), belowConfidenceThreshold: true }
          : {}),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[/api/assistant/search] Search failed:", error);
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json(
      { success: false, error: `Couldn't search right now: ${message}` },
      { status: 502 }
    );
  }
}
