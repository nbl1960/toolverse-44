import type { NextRequest } from "next/server";

/**
 * A simple in-memory rate limiter keyed by client IP. Each call site
 * creates its own instance (so YouTube and Instagram generation have
 * independent limits) via `createRateLimiter()`, but the actual
 * tracking logic is written once.
 */
export function createRateLimiter(limit: number, windowMs = 60_000) {
  const requestLog = new Map<string, number[]>();

  return function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < windowMs);
    timestamps.push(now);
    requestLog.set(ip, timestamps);
    return timestamps.length > limit;
  };
}

/** Best-effort client IP extraction from standard proxy headers. */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Extracts and parses a `{"outputs": ["...", "...", "..."]}` JSON object
 * from a model's raw text reply — the shared response shape every
 * "generate N options" tool (YouTube and Instagram alike) asks Gemini
 * for. Tolerates markdown code fences and surrounding commentary.
 */
export function parseGeneratorOutputs(raw: string, maxCount: number): string[] {
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

  return outputs.slice(0, maxCount);
}
