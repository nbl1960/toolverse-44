import type { JwtDecodeResult } from "./types";

/** Decodes a base64url string (JWT's encoding: "-"/"_" instead of "+"/"/", no padding) to UTF-8 text. */
function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Decodes a JWT's header and payload (NOT signature verification — that
 * requires the signing secret/key, which this client-side tool never
 * has and shouldn't ask for). Purely inspects the token's claims.
 */
export function decodeJwt(token: string): JwtDecodeResult {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("A JWT should have exactly three dot-separated parts (header.payload.signature).");
  }

  const [headerPart, payloadPart, signaturePart] = parts;
  if (!headerPart || !payloadPart) {
    throw new Error("This doesn't look like a valid JWT.");
  }

  let headerJson: unknown;
  let payloadJson: unknown;
  try {
    headerJson = JSON.parse(base64UrlDecode(headerPart));
    payloadJson = JSON.parse(base64UrlDecode(payloadPart));
  } catch {
    throw new Error("Couldn't decode this token — it may not be a valid JWT.");
  }

  const payloadRecord = payloadJson as Record<string, unknown>;
  const exp = typeof payloadRecord.exp === "number" ? payloadRecord.exp : null;
  const isExpired = exp !== null ? exp * 1000 < Date.now() : null;
  const expiresAt = exp !== null ? new Date(exp * 1000).toISOString() : null;

  return {
    header: JSON.stringify(headerJson, null, 2),
    payload: JSON.stringify(payloadJson, null, 2),
    signature: signaturePart ?? "",
    isExpired,
    expiresAt,
  };
}
