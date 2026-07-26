import type { FaqItem, ToolExample } from "@/lib/types";

export const JWT_FAQ_ITEMS: FaqItem[] = [
  { question: "Does this verify the token's signature?", answer: "No — verifying a signature requires the secret or public key used to sign it, which this client-side tool never has (and shouldn't ask for). This decodes and displays the header and payload only, so you can inspect the claims." },
  { question: "Is my token sent to a server?", answer: "No — decoding happens entirely in your browser. A JWT's payload is only base64-encoded, not encrypted, so anyone with the token can already read its contents; this tool doesn't change that exposure." },
  { question: "What does the expiration check mean?", answer: "If the payload has an 'exp' claim (a standard JWT field for expiration time), this tool compares it to the current time and flags whether the token has expired — a simple, useful sanity check when debugging auth issues." },
  { question: "Why does it say my token is invalid?", answer: "A JWT must have exactly three dot-separated, base64url-encoded parts (header.payload.signature) — check for missing characters, extra whitespace, or that you've pasted the whole token." },
];

export const JWT_EXAMPLE: ToolExample = {
  title: "Example: decoding a standard JWT",
  summary: "Pasting a token:",
  inputs: [{ label: "Token", value: "eyJhbGciOiJIUzI1NiIs...(truncated)" }],
  outputs: [
    { label: "Header", value: '{"alg": "HS256", "typ": "JWT"}' },
    { label: "Payload", value: '{"sub": "1234567890", "name": "John Doe"}' },
  ],
};
