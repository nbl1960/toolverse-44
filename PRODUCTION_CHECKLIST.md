# Production Checklist

This checklist is deliberately honest about what's actually been
verified versus what hasn't. Every item is marked:

- ✅ **Verified** — confirmed by static code inspection or actual
  execution (a real Node script run against the real logic), not just
  written and assumed correct.
- ⚠️ **Needs your verification** — the code is written to be correct,
  but requires tooling this development environment doesn't have
  (a real `npm install`, a browser, network access, Lighthouse, a
  package registry) to actually confirm.
- 📋 **Recommended, not yet done** — a genuine gap, tracked honestly
  rather than hidden.

**Read this before the rest of the checklist:** this project has been
built entirely through AI-assisted development sessions, verified by
extensive static analysis (import graphs, export matching, type-shape
checks) and, for risky pure logic (parsers, financial math, a
minifier, JWT decoding), by actually running that logic against real
test cases in Node — but **never once by a real `npm run build`,
`tsc`, `eslint`, or a browser.** That is a genuine, structural gap in
how this project has been verified so far, not a formality. Items
marked ⚠️ below are not "probably fine" — they are specifically the
things that have never been checked by a tool independent of the
system that wrote the code.

## Functionality

- ✅ All 100 tools are registered with `status: "live"` — zero
  placeholder/"coming soon" pages presented as if functional.
- ✅ Every tool's component loader in `lib/tool-components.ts` resolves
  to a real file with a matching named export — checked programmatically
  for all 100, not spot-checked.
- ✅ Zero duplicate slugs across the registry (checked programmatically).
- ✅ Zero circular imports across the project (checked programmatically).
- ⚠️ Every tool actually renders correctly and is interactive in a real
  browser — this requires opening each page, which this environment
  cannot do.

## Build & Type Safety

- ⚠️ `npm install` completes without errors.
- ⚠️ `npm run typecheck` (`tsc --noEmit`) passes with zero errors.
- ⚠️ `npm run lint` (`next lint`) passes with zero errors/warnings.
- ⚠️ `npm run build` completes successfully.
- ✅ Extensive static verification substitutes for the above where
  possible: every `@/` and relative import resolves to a real file;
  every named import matches a real export; brace/paren balance
  checked on every modified file.

## Testing

- ✅ A real unit test suite exists (`test/*.test.ts`, Vitest) covering
  the highest-risk pure logic: the JS/CSS/HTML minifier (including
  actually executing its output to confirm minified code still runs
  correctly), CSV parsing, GST/loan financial math (checked against an
  independently-computed reference value, not the same formula
  reused), JWT decoding (checked against the well-known jwt.io
  reference token), search ranking, and the shared AI-response parser.
- ⚠️ `npm run test` has never actually been executed in this
  environment (no `vitest` package installed) — the tests are written
  correctly and the underlying logic was independently verified via
  raw Node execution during development, but the test *files
  themselves*, run through the real Vitest runner, have not been.
- 📋 No component/integration tests (React Testing Library) exist yet.
- 📋 No end-to-end tests (Playwright/Cypress) exist yet — would require
  a real browser environment to write and run meaningfully.
- 📋 No automated accessibility testing (axe-core) has been run — see
  the Accessibility section below.

## Performance

- ✅ Code-splitting is used deliberately: every tool component,
  below-the-fold sections (FAQ, feedback), and interaction-triggered
  content (the demo modal) are dynamically imported rather than bundled
  into the initial page load.
- ✅ Long-lived immutable caching is set for content-hashed static
  assets.
- ✅ A known, documented risk was found and *not* blindly "fixed": nine
  finance calculators eagerly load `recharts` (a heavy charting
  library) rather than deferring it — `next.config.mjs` itself
  documents a prior real build failure from an automated attempt to
  optimize this exact dependency. Left as a tracked recommendation
  (`GROWTH_ROADMAP.md` #11) rather than risking nine live production
  tools without the ability to verify a fix with a real build.
- ⚠️ Actual Core Web Vitals / Lighthouse scores — **never measured**.
  No number in this document or any prior communication about this
  project should be read as a Lighthouse score, because none has ever
  been run.

## Security

- ✅ Security headers set (HSTS, X-Content-Type-Options, X-Frame-Options,
  Referrer-Policy, Permissions-Policy) — see `SECURITY.md` for the
  complete, verified list.
- ✅ Rate limiting on every AI-powered route.
- ✅ Input validation (Zod schemas, explicit checks) before any external
  API call.
- ✅ No secrets reachable from client bundles — verified by checking
  every `GEMINI_API_KEY` read happens inside a `runtime = "nodejs"` API
  route, never a Client Component.
- 📋 No Content-Security-Policy header yet (tracked, not hidden — see
  `SECURITY.md`).
- ⚠️ `npm audit` / dependency vulnerability scanning — never run (no
  package registry access in this environment). Run this yourself
  before launch, and keep it running on a schedule.
- ⚠️ No independent security review or penetration test has been
  performed by anyone other than the same process that wrote the code.

## Accessibility

- ✅ Semantic landmarks present (`<header>`, `<nav aria-label="Primary">`,
  skip-to-content link, breadcrumb `<nav>`).
- ✅ The redesigned global search uses a real ARIA combobox pattern
  (`role="combobox"`, `aria-activedescendant`, `role="listbox"`/`"option"`)
  with full keyboard navigation, not just visual highlighting.
- ✅ Every `<img>` tag in the project has descriptive alt text (checked
  for all 5 raw `<img>` usages across the codebase).
- ⚠️ No automated accessibility audit (axe-core or similar) has actually
  been run against a rendered page. Everything above is real, but it's
  not a substitute for that specific check.
- ⚠️ Color contrast ratios have not been measured against WCAG AA,
  specifically for the smallest text sizes (confidence-tier badges).
- ⚠️ No screen reader testing has been performed.

## SEO

- ✅ Every tool page: unique title (verified programmatically, all
  under 60 chars), unique meta description (verified, zero duplicates
  across all 100), canonical URL, Open Graph, Twitter Card, JSON-LD
  (SoftwareApplication + WebPage + BreadcrumbList + FAQPage where
  applicable).
- ✅ Homepage: WebSite + Organization + WebApplication + SearchAction
  structured data, with a genuinely functional `?q=` search backing the
  SearchAction (not a decorative schema claim).
- ✅ Sitemap and robots.txt are dynamically generated from the actual
  registry — a new tool automatically appears, nothing to remember to
  update manually.
- ⚠️ 30 of 100 tools have substantive on-page intro content (150-250
  words); the other 70 still have only a one-line tagline. This is
  explicitly tracked as the top SEO priority in `GROWTH_ROADMAP.md`,
  not something to claim as complete.
- ⚠️ Real Google Search Console / Google Analytics data has never been
  reviewed as part of this engineering pass — verification that
  indexing and tracking actually work in production requires checking
  your live dashboards, which this environment cannot access.

## Code Quality & Maintainability

- ✅ 4 confirmed orphaned files/directories removed (individually
  verified unreferenced before deletion, not assumed).
- ✅ Every declared npm dependency confirmed genuinely used (including
  catching two false "unused" flags from an initial narrow grep before
  correcting the check).
- ✅ Zero circular imports, zero unresolved imports, zero duplicate
  top-level declarations — all checked programmatically across the
  full ~460-file project, not sampled.
- ✅ Shared engines used consistently instead of duplicated logic (one
  AI-generator UI/API pattern reused across 6 platforms, one CSV
  parser, one image-processing core, one loan/amortization engine
  behind multiple calculators).

## Documentation

- ✅ `README.md`, `DEPLOYMENT.md`, `SECURITY.md`, `ENVIRONMENT.md`,
  `CHANGELOG.md`, and this file all exist and reflect the actual
  current codebase, not a template.
- ✅ `CHANGELOG.md` is reconstructed from real commit history, not
  invented.

## Before you actually launch

In priority order, the things on this list that matter most and are
genuinely unverified:

1. Run `npm install && npm run typecheck && npm run lint && npm run
   build` yourself, locally, and fix whatever it finds. This has never
   been done.
2. Run `npm run test` and confirm the test suite actually passes under
   the real Vitest runner.
3. Run a real Lighthouse audit against a deployed preview URL.
4. Run `npm audit` and address anything it flags.
5. Manually click through at least one tool per category in a real
   browser, on a real phone.
