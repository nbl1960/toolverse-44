import { NextRequest, NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/gemini";
import { createRateLimiter, getClientIp } from "@/lib/generator-api";
import { buildToolCatalogText, MAX_QUERY_LENGTH, MAX_RECOMMENDATIONS, MIN_QUERY_LENGTH } from "@/lib/ai-assistant/catalog";
import { getToolBySlug } from "@/lib/tools-registry";
import type {
  AssistantSearchResponse,
  RawAssistantMatch,
} from "@/lib/ai-assistant/types";

// Calls a third-party API on every request; must run dynamically.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isRateLimited = createRateLimiter(20);

function buildPrompt(query: string, catalog: string): string {
  return `You are the ToolVerse Tool Assistant. A user describes what they want to do; you find the most relevant tools from this exact catalog and explain briefly why each matches.

CATALOG (format: slug | name | category | tagline) — this is the complete, only list of tools that exist. You may ONLY recommend slugs that appear literally in this list:
${catalog}

User's request: "${query}"

Rules:
- Recommend up to ${MAX_RECOMMENDATIONS} tools that genuinely match, ranked most relevant first.
- ONLY use slugs copied exactly from the catalog above. Never invent a slug, a tool, or a variation of a slug that isn't listed verbatim.
- If nothing in the catalog is a good match for the request, return fewer results — even an empty list — rather than forcing a weak or unrelated match.
- For each recommendation, write one short, specific sentence (under 20 words) explaining why that particular tool fits this particular request.
- Respond with ONLY a raw JSON object, no markdown code fences, no commentary, in exactly this shape:
{"recommendations": [{"slug": "...", "reason": "..."}]}`;
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
    const rawText = await generateGeminiText(prompt, apiKey);
    const rawMatches = parseRawMatches(rawText);

    // The critical grounding step: Gemini's job was only to pick slugs
    // and write reasons. Every other field shown to the user — name,
    // tagline, category, icon, route — comes from OUR OWN registry via
    // getToolBySlug(), never from the model's text. Any slug that
    // doesn't actually exist (a hallucination) is silently dropped here,
    // not surfaced as an error — the user just sees fewer, all-real
    // results.
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
          route: `/tools/${tool.slug}`,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .slice(0, MAX_RECOMMENDATIONS);

    return NextResponse.json({ success: true, recommendations }, { status: 200 });
  } catch (error) {
    console.error("[/api/assistant/search] Search failed:", error);
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ success: false, error: `Couldn't search right now: ${message}` }, { status: 502 });
  }
}
