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
  MATCH_CONFIDENCE_VALUES,
  type AssistantSearchResponse,
  type MatchConfidence,
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
 * matching this exact shape.
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
          confidence: { type: "string", enum: MATCH_CONFIDENCE_VALUES },
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
2. For each, assign a confidence tier — exactly one of: "Best Match" (directly and precisely does what was asked), "Good Match" (clearly helps, maybe with one extra step), or "Related" (adjacent/useful but not a direct fit).
3. For each, write one short, specific sentence (under 20 words) explaining why THIS tool fits THIS request — not a generic description of the tool.

Rules:
- ONLY use slugs copied exactly from the catalog above. Never invent a slug, a tool, or a variation of a slug that isn't listed verbatim.
- If nothing in the catalog is a good match for the request, return an empty "recommendations" array rather than forcing a weak or unrelated match. Do not pad the list to reach 5.
- Be honest about confidence: don't call something a "Best Match" just to have one — if the closest thing is only "Related", say so.`;
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

function isValidConfidence(value: unknown): value is MatchConfidence {
  return typeof value === "string" && (MATCH_CONFIDENCE_VALUES as string[]).includes(value);
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
    // write reasons, and assign a confidence tier. Every other field
    // shown to the user — name, tagline, category, icon, route, related
    // tools — comes from OUR OWN registry via getToolBySlug() and
    // getRelatedToolLinks(), never from the model's text. Any slug that
    // doesn't actually exist (a hallucination) is silently dropped here,
    // not surfaced as an error — the user just sees fewer, all-real
    // results. An invalid/missing confidence value is never trusted
    // either — it falls back to the lowest-confidence label. (The
    // schema's enum already constrains this at generation time, but
    // this check stays as defense-in-depth rather than assuming the
    // schema constraint can never be bypassed.)
    const seen = new Set<string>();
    const recommendations = rawMatches
      .map((match) => {
        const tool = getToolBySlug(match.slug);
        if (!tool || tool.status !== "live" || seen.has(tool.slug)) return null;
        seen.add(tool.slug);
        return {
          slug: tool.slug,
          name: tool.name,
          tagline: tool.tagline,
          category: tool.category,
          iconName: tool.iconName,
          reason: match.reason.trim(),
          confidence: isValidConfidence(match.confidence) ? match.confidence : ("Related" as const),
          route: `/tools/${tool.slug}`,
          relatedTools: getRelatedToolLinks(tool.slug),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .slice(0, MAX_RECOMMENDATIONS);

    return NextResponse.json(
      {
        success: true,
        recommendations,
        ...(recommendations.length === 0 ? { fallbackSuggestions: getFallbackSuggestions() } : {}),
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
