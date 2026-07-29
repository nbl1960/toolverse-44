# Changelog

All notable changes to ToolVerse, reconstructed from the project's real
commit history — not a curated highlight reel. Dates are approximate to
each development phase, not exact calendar dates.

## v2.0 — Current

### Added
- Global search: field-weighted ranking (name > category > keywords >
  description), match highlighting, full keyboard navigation (arrows,
  Enter, Escape), popular/recent searches, analytics.
- Professional footer and legal section: About, Contact (with a working
  form), Privacy Policy, Terms & Conditions, Disclaimer, Cookie Policy,
  FAQ, Help Center, Roadmap, Blog (placeholder, honestly labeled).
- Growth roadmap and architecture documentation for the AI Guide's
  grounding mechanism.
- Static-asset caching headers.

### Fixed
- AI Guide JSON parsing: moved to Gemini's structured output mode
  (`responseSchema`), added explicit retry-on-malformed-response logic,
  and dev-mode-only raw-response logging — the direct fix for a reported
  "Expected ',' or ']' after array element" parse failure.
- Multiple `react/no-unescaped-entities` violations across newly-added
  prose pages, caught by a purpose-built scanner after the same bug
  class recurred several times.
- 4 orphaned files/directories left over from tool-naming iterations
  during earlier batches, removed after individually verifying each was
  genuinely unreferenced.
- 4 meta descriptions exceeding the 155-character SEO guideline.
- One tool (`AI Email Writer`, the project's first-ever tool) missing
  the FAQ content every other tool has.

## v1.1 — AI-First Homepage

### Added
- Homepage AI Guide: natural-language tool discovery, grounded
  exclusively in the real tool registry — never recommends a tool that
  doesn't exist, with every non-AI field (name, route, icon) looked up
  fresh from the registry rather than trusted from the model's output.
- Confidence scoring (Best Match / Good Match / Related), Related Tools
  per result, skeleton loading states.
- Homepage redesign: hero rebuild around the AI Guide, an animated
  (not video — none was available to produce) product walkthrough
  modal, Featured Tools and Why ToolVerse sections.
- WebSite/Organization/WebApplication/SearchAction structured data and
  a web app manifest.

## v1.0 — Full Catalog

### Added
- SEO Studio and Developer Studio: 20 tools, mostly deterministic
  utilities (JSON tools, minifiers, hash/UUID/password generators,
  Robots.txt/Sitemap/Schema generators) rather than AI-generated.
- X (Twitter) Studio and Facebook Studio: 20 AI-generator tools on the
  shared generator engine.
- LinkedIn Studio: 13 tools, including two fully deterministic
  analyzers (Headline Analyzer, Profile SEO Checker) alongside the AI
  generators.
- Converted all 6 remaining "coming soon" placeholders to fully
  functional tools, reaching **100 registered tools, 0 placeholders**.

## Foundational releases

### Added
- Instagram Studio (10 tools) — introduced the shared `AiGeneratorView` /
  `TextTransformTool` component patterns later reused by every
  subsequent platform, keeping 100+ tools from becoming 100+
  independently-styled UIs.
- Creator Studio / YouTube tools (10 tools).
- Migrated the AI provider from Anthropic to the Google Gemini API.
- Google Analytics 4 and Google Search Console verification.
- The original registry-driven architecture and the first tool
  (AI Email Writer) — the pattern every one of the 100 tools since has
  followed: one object in `lib/tools-registry.ts`, generic routes, no
  per-tool routing code.

---

*A note on how this file is maintained: entries above are reconstructed
from actual commit messages, not aspirational marketing copy. When
adding a new entry, describe what actually shipped and, where relevant,
what was found and fixed — including things that went wrong along the
way. A changelog that only ever says "improvements and bug fixes" is
not a changelog.*
