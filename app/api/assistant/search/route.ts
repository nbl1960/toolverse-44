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
- If nothing in the catalog is a good match for the request, return fewer results — even an empty list — rather than forcing a weak or unrelated match. Do not pad the list to reach 5.
- Be honest about confidence: don't call something a "Best Match" just to have one — if the closest thing is only "Related", say so.
- Respond with ONLY a raw JSON object, no markdown code fences, no commentary, in exactly this shape:
{"recommendations": [{"slug": "...", "reason": "...", "confidence": "Best Match"}]}`;
}

function isValidConfidence(value: unknown): value is MatchConfidence {
  return typeof value === "string" && (MATCH_CONFIDENCE_VALUES as string[]).includes(value);
}

function parseRawMatches(raw: string): RawAssistantMatch[] {
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
    throw new Error("Model response did not contain a parseable JSON object.");
  }
  const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1)) as { recommendations?: unknown };
  if (!Array.isArray(parsed.recommendations)) {
    return [];
  }
  return parsed.recommendations.filter(
    (item): item is RawAssistantMatch =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as RawAssistantMatch).slug === "string" &&
      typeof (item as RawAssistantMatch).reason === "string"
  );
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
    // Tuned for this specific call: low temperature for consistent,
    // fast-converging structured output, and a token cap since the
    // response is always short (5 slugs + brief reasons) — both help
    // keep this under the 2-second target latency.
    const rawText = await generateGeminiText(prompt, apiKey, { temperature: 0.2, maxOutputTokens: 700 });
    const rawMatches = parseRawMatches(rawText);

    // The critical grounding step: Gemini's job was only to pick slugs,
    // write reasons, and assign a confidence tier. Every other field
    // shown to the user — name, tagline, category, icon, route, related
    // tools — comes from OUR OWN registry via getToolBySlug() and
    // getRelatedToolLinks(), never from the model's text. Any slug that
    // doesn't actually exist (a hallucination) is silently dropped here,
    // not surfaced as an error — the user just sees fewer, all-real
    // results. An invalid/missing confidence value is never trusted
    // either — it falls back to the lowest-confidence label rather than
    // letting the model claim "Best Match" with a malformed response.
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
    return NextResponse.json({ success: false, error: `Couldn't search right now: ${message}` }, { status: 502 });
  }
}
