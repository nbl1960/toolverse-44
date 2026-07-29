# Security Policy

## Reporting a vulnerability

If you find a security issue in ToolVerse, please report it privately
rather than opening a public GitHub issue — email the address in
`lib/site-config.ts`'s `SITE_SUPPORT_EMAIL`, or use the
[Contact page](/contact) with "Report a Bug" selected. Include enough
detail to reproduce the issue; we'll acknowledge receipt and follow up
as we investigate.

This is a best-effort project, not a company with a formal bug bounty
program — please don't expect a specific SLA, but genuine reports are
taken seriously and acted on.

## What's actually in place today

This section describes measures that genuinely exist in the codebase,
verified by direct inspection — not a generic security checklist.

- **Security headers** (`next.config.mjs`): HSTS (with preload),
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`, a `Permissions-Policy`
  disabling unused browser features, and legacy `X-XSS-Protection`.
- **Rate limiting** on every AI-powered API route (`lib/generator-api.ts`'s
  `createRateLimiter`), independently applied per route. **Known
  limitation:** this is in-memory per Worker instance — it resets on
  redeploy and doesn't coordinate across Cloudflare's edge locations. It
  deters casual abuse today; it is not a substitute for a distributed
  rate limiter (Cloudflare KV or Durable Objects) if traffic grows
  enough for that gap to matter.
- **Input validation** on every API route — Zod schemas for
  structured-form tools, explicit length/type checks for AI-generator
  and contact-form endpoints, before any external API call is made.
- **AI output grounding**: the AI Guide and every AI-generator tool
  validates model output against real data (the tool registry, a
  regex-validity check, a JSON schema) before returning it — see
  `app/api/assistant/search/route.ts` for the most complete example. A
  hallucinated tool slug is silently dropped, never surfaced to the
  user as if it were real.
- **Structured output** (`responseSchema` + `responseMimeType` on
  Gemini calls that need it) constrains model output at the
  token-sampling level, reducing malformed-response attack surface
  (and, separately, malformed-response bugs) rather than relying only
  on prompt instructions.
- **No secrets in client bundles**: `GEMINI_API_KEY` and any future
  server-only secret is read only inside API routes
  (`export const runtime = "nodejs"`), never in a Client Component or
  anything that ships to the browser.
- **Client-side processing where possible**: image compression/resizing/
  conversion, JSON/CSV tools, hashing, password and UUID generation all
  run entirely in the browser — files and text never touch a server for
  these tools, which also means there's no server-side attack surface
  for them at all.
- **Cryptographically secure randomness** where it matters: the
  Password Generator uses `crypto.getRandomValues()`, not `Math.random()`
  (which is not suitable for anything security-relevant); the Hash
  Generator uses the browser's native Web Crypto API, not a hand-rolled
  implementation.
- **`.gitignore` correctly excludes** `.env`, `.env*.local`, and
  `.dev.vars` — no secrets should ever reach version control via the
  standard local-dev workflow.

## Known gaps (tracked, not hidden)

- **No Content-Security-Policy header yet.** This is the single most
  impactful remaining header for defense-in-depth against XSS. It's not
  implemented yet because it needs to be tested carefully against every
  external resource this app actually loads (Gemini API, the QR code
  service, YouTube's CDN, Google Analytics) — see `GROWTH_ROADMAP.md`.
- **No automated dependency vulnerability scanning has been run** as
  part of this specific engineering pass — this environment has no
  package registry access to run `npm audit`. Run it in your own CI
  before deploying, and keep it running on a schedule (GitHub's Dependabot
  or `npm audit` in CI are both reasonable, low-effort options).
- **No independent third-party security review has been performed.**
  Everything above was verified by static code inspection during
  development, by the same process that wrote the code — see the
  "Verification and its limits" section of `PRODUCTION_CHECKLIST.md`
  for why that matters and what it doesn't substitute for.

## Supported versions

Only the latest deployed version of ToolVerse receives security fixes —
there's no long-term-support branch or versioned release track at this
project's current stage.
