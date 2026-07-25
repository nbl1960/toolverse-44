import type { HashAlgorithm, HashResult } from "./types";

/**
 * Hashes text using the browser's native Web Crypto API
 * (crypto.subtle.digest) — real, correct, standard implementations, not
 * a hand-rolled hash function. MD5 is deliberately not offered: it isn't
 * part of the Web Crypto API (by design — MD5 is cryptographically
 * broken), and implementing it by hand risks a subtly incorrect result
 * with no way to verify it against a trusted reference in this
 * environment. SHA-1 is included for legacy/compatibility use even
 * though it's also no longer considered secure for new work.
 */
export async function generateHash(text: string, algorithm: HashAlgorithm): Promise<HashResult> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return { algorithm, hash };
}
