# ToolVerse

A scalable, production-ready platform for hosting many focused web tools
under one roof. **Version 1.0** ships **100 live tools, zero
placeholders** — AI Email Writer, a complete "Phase 1 Finance" suite of
10 calculators, a 40-tool "Creator Studio" suite spanning YouTube,
Instagram, X (Twitter), and Facebook, a 13-tool "LinkedIn Studio" suite,
20 SEO/Developer utilities, a 6-tool "Image Studio" suite, and 10 more
across Writing, Productivity, Developer, Design, Marketing, and Data — and
an architecture designed to grow to 100+ tools without touching routing
code.

Built with Next.js 15 (App Router), React, TypeScript, Tailwind CSS,
shadcn/ui-style components, and the Google Gemini API.

---

## The core idea: one registry, generic routes

Every tool is one object in `lib/tools-registry.ts`:

```ts
{
  slug: "email-writer",
  name: "AI Email Writer",
  tagline: "Write the email. We'll find the words.",
  description: "...",
  category: "writing",
  icon: Mail,
  keywords: ["email", "writer", "ai"],
  status: "live",
  loadComponent: () =>
    import("@/components/tools/email-writer/email-writer").then((m) => ({
      default: m.EmailWriter,
    })),
}
```

`app/tools/[slug]/page.tsx` is the **only** route file for tool pages. It
looks the slug up in the registry, generates SEO metadata, breadcrumbs, and
a JSON-LD `SoftwareApplication` entry from that one object, and lazily
loads the tool's component. `generateStaticParams` pre-renders a static
page per tool at build time. Adding tool #101 means:

1. Add one object to `TOOLS` in `lib/tools-registry.ts`.
2. Drop its UI under `components/tools/<slug>/`.
3. Nothing else. No new route, no new page, no duplicated layout, header,
   breadcrumbs, or SEO code.

Categories work the same way: `lib/categories.ts` is the registry,
`app/categories/[category]/page.tsx` is the one generic route.

---

## Features

**Platform**
- Homepage with hero, category grid, and a data-driven "Recently added" rail
- `/tools` — searchable, filterable catalog of every tool
- `/categories` and `/categories/[category]` — browse by category
- Global header with nav, ⌘K command-palette search, mobile menu, theme toggle
- Footer with category and live-tool shortcuts
- Reusable `ToolPageShell` layout (breadcrumbs → title block → tool UI →
  formula → worked example → FAQ → feedback → related tools) that every
  tool page renders through — a tool gets all of this for free just by
  populating the matching fields on its registry entry
- `ToolCard` and `CategoryCard` — one implementation, used everywhere
- Related Tools rail (same-category tools, with sensible fallback)
- Shared SEO layer: `lib/seo.ts` (metadata builder) + `<JsonLd>` component
  (WebSite, SoftwareApplication + Calculator subcategory, FAQPage,
  BreadcrumbList schemas) used by every route; per-tool dynamic OG images
- Full dark/light mode, fully responsive, accessible (landmarks,
  `aria-current`, visible focus rings, `prefers-reduced-motion`)

**Tool #1 — AI Email Writer** (Writing)
Topic/recipient/sender inputs, 8 tones, 3 lengths, server-side generation
via the Google Gemini API with zod validation and rate limiting.

**Tools #2–10 — the Phase 1 Finance suite**

| Tool | Route | What it solves |
|---|---|---|
| EMI Calculator | `/tools/emi-calculator` | Loan amount + rate + tenure → monthly payment |
| SIP Calculator | `/tools/sip-calculator` | Monthly investment → projected corpus, with optional step-up and inflation adjustment |
| Loan Calculator | `/tools/loan-calculator` | EMI Calculator's math, plus a second mode: solve loan amount from an EMI budget |
| FD Calculator | `/tools/fd-calculator` | Lump-sum deposit → maturity value, with selectable compounding frequency |
| RD Calculator | `/tools/rd-calculator` | Monthly bank deposit → maturity value |
| SWP Calculator | `/tools/swp-calculator` | Lump sum + fixed monthly withdrawal → balance over time, flags early depletion |
| Compound Interest Calculator | `/tools/compound-interest-calculator` | General-purpose lump-sum compounding (same engine as FD) |
| Retirement Calculator | `/tools/retirement-calculator` | Current savings + monthly contribution → projected retirement corpus |
| CAGR Calculator | `/tools/cagr-calculator` | Initial + final value → smoothed annual growth rate |

Every finance tool ships with: live or explicit-Calculate results (EMI/FD/RD/
Loan/SWP/Compound Interest/Retirement/CAGR update live; SIP uses an explicit
Calculate/Reset flow), summary cards, at least one chart, a period-by-period
schedule table with CSV export, Share + Copy Results, a formula explanation,
a worked example, an FAQ (with FAQPage JSON-LD), and a feedback widget — all
via the shared components below, not reimplemented per tool.

**Tools #11–20 — Creator Studio (YouTube tools)**

| Tool | Route | Kind |
|---|---|---|
| YouTube Tag Generator | `/tools/youtube-tag-generator` | AI, 3 options |
| YouTube Title Generator | `/tools/youtube-title-generator` | AI, 3 options |
| YouTube Description Generator | `/tools/youtube-description-generator` | AI, 3 options |
| YouTube Hashtag Generator | `/tools/youtube-hashtag-generator` | AI, 3 options |
| YouTube Channel Name Generator | `/tools/youtube-channel-name-generator` | AI, 3 options |
| YouTube Video Idea Generator | `/tools/youtube-video-idea-generator` | AI, 3 options |
| YouTube Script Generator | `/tools/youtube-script-generator` | AI, 3 options |
| YouTube Keyword Generator | `/tools/youtube-keyword-generator` | AI, 3 options |
| YouTube Timestamp Generator | `/tools/youtube-timestamp-generator` | Deterministic — parses `Title \| duration` lines client-side, no API call |
| YouTube Thumbnail Downloader | `/tools/youtube-thumbnail-downloader` | Deterministic — parses the video ID and links directly to YouTube's public thumbnail CDN, no API call |

The 8 AI tools are **one shared implementation**, not eight: one API route
(`app/api/tools/youtube-generator/generate/route.ts`), one hook
(`hooks/tools/youtube-generator/use-youtube-generator.ts`), and one UI
template (`components/tools/youtube-generator/youtube-generator-template.tsx`)
parameterized by a `type`. Each tool's own component file is a five-line
wrapper selecting its type — the prompt, input copy, and format hints for
all 8 live in one config file
(`lib/tools/youtube-generator/constants.ts`). Every Creator Studio tool
sets `relatedToolsLimit: 9` on its registry entry, so its Related Tools
rail shows all nine siblings instead of the platform default of three.

**Tools #21–30 — Creator Studio (Instagram tools)**

| Tool | Route | Kind |
|---|---|---|
| Instagram Caption Generator | `/tools/instagram-caption-generator` | AI, 3 options |
| Instagram Hashtag Generator | `/tools/instagram-hashtag-generator` | AI, 3 options |
| Instagram Bio Generator | `/tools/instagram-bio-generator` | AI, 3 options |
| Instagram Username Generator | `/tools/instagram-username-generator` | AI, 3 options |
| Instagram Reel Caption Generator | `/tools/instagram-reel-caption-generator` | AI, 3 options |
| Instagram Post Idea Generator | `/tools/instagram-post-idea-generator` | AI, 3 options |
| Instagram Story Caption Generator | `/tools/instagram-story-caption-generator` | AI, 3 options |
| Instagram Quote Generator | `/tools/instagram-quote-generator` | AI, 3 options |
| Instagram Engagement Calculator | `/tools/instagram-engagement-calculator` | Deterministic — live client-side calculation, no API call |
| Instagram Character Counter | `/tools/instagram-character-counter` | Deterministic — live client-side counting, no API call |

The 8 Instagram AI tools reuse the exact same shared engine as YouTube's,
one level further up: `components/shared/ai-generator-view.tsx` is the
one presentational implementation both `YoutubeGeneratorTemplate` and
`InstagramGeneratorTemplate` render (each owns only its own state hook
and prompt config); `lib/generator-api.ts` and `lib/gemini.ts` are the
one server-side implementation both API routes call. YouTube and
Instagram tools share the `creator-studio` category (for browsing) but
set `relatedGroup: "youtube"` / `relatedGroup: "instagram"` respectively,
so each toolset's Related Tools rail recommends only its own nine
siblings, not a mix of both.

**Tools #31–43 — LinkedIn Studio**

| Tool | Route | Kind |
|---|---|---|
| LinkedIn Headline Generator | `/tools/linkedin-headline-generator` | AI, 3 options |
| LinkedIn About Generator | `/tools/linkedin-about-generator` | AI, 3 options |
| LinkedIn Summary Generator | `/tools/linkedin-summary-generator` | AI, 3 options |
| LinkedIn Post Generator | `/tools/linkedin-post-generator` | AI, 3 options |
| LinkedIn Experience Generator | `/tools/linkedin-experience-generator` | AI, 3 options |
| LinkedIn Skills Generator | `/tools/linkedin-skills-generator` | AI, 3 options |
| LinkedIn Recommendation Generator | `/tools/linkedin-recommendation-generator` | AI, 3 options |
| LinkedIn Connection Request Generator | `/tools/linkedin-connection-request-generator` | AI, 3 options |
| LinkedIn Company Description Generator | `/tools/linkedin-company-description-generator` | AI, 3 options |
| LinkedIn Job Description Generator | `/tools/linkedin-job-description-generator` | AI, 3 options |
| LinkedIn Profile Optimizer | `/tools/linkedin-profile-optimizer` | AI — critique + rewrite, not 3 options |
| LinkedIn Headline Analyzer | `/tools/linkedin-headline-analyzer` | Deterministic — transparent point-by-point scoring, no API call |
| LinkedIn Profile SEO Checker | `/tools/linkedin-profile-seo-checker` | Deterministic — keyword coverage + completeness checks, no API call |

The 10 LinkedIn AI generators reuse the exact same shared engine as
YouTube's and Instagram's — the third platform on
`components/shared/ai-generator-view.tsx` / `lib/generator-api.ts` /
`lib/gemini.ts`, none of which needed any changes to support it. LinkedIn
Studio is its own category (not folded into Creator Studio) since its
audience — professionals and job seekers — is meaningfully different from
YouTube/Instagram's content-creator audience. The Profile Optimizer,
Headline Analyzer, and Profile SEO Checker are deliberately *not* part of
the shared 3-options engine: the Optimizer returns a critique + rewrite
(a different response shape), and the two analyzers are fully
deterministic — no Gemini call, no API cost, instant results — with every
point in their scores tied to one specific, visible, named check rather
than a black-box number.

**Tools #44–53 — Creator Studio (X / Twitter tools)**

| Tool | Route | Kind |
|---|---|---|
| Twitter Tweet Generator | `/tools/twitter-tweet-generator` | AI, 3 options |
| Twitter Viral Tweet Generator | `/tools/twitter-viral-tweet-generator` | AI, 3 options |
| Twitter Thread Generator | `/tools/twitter-thread-generator` | AI, 3 options |
| Twitter Bio Generator | `/tools/twitter-bio-generator` | AI, 3 options |
| Twitter Username Generator | `/tools/twitter-username-generator` | AI, 3 options |
| Twitter Hashtag Generator | `/tools/twitter-hashtag-generator` | AI, 3 options |
| Twitter Hook Generator | `/tools/twitter-hook-generator` | AI, 3 options |
| Twitter Poll Generator | `/tools/twitter-poll-generator` | AI, 3 options |
| Twitter Reply Generator | `/tools/twitter-reply-generator` | AI, 3 options |
| Twitter Content Calendar | `/tools/twitter-content-calendar` | AI, 3 weekly-calendar options |

**Tools #54–63 — Creator Studio (Facebook tools)**

| Tool | Route | Kind |
|---|---|---|
| Facebook Caption Generator | `/tools/facebook-caption-generator` | AI, 3 options |
| Facebook Post Generator | `/tools/facebook-post-generator` | AI, 3 options |
| Facebook Bio Generator | `/tools/facebook-bio-generator` | AI, 3 options |
| Facebook Ad Copy Generator | `/tools/facebook-ad-copy-generator` | AI, 3 options |
| Facebook Headline Generator | `/tools/facebook-headline-generator` | AI, 3 options |
| Facebook CTA Generator | `/tools/facebook-cta-generator` | AI, 3 options |
| Facebook Comment Generator | `/tools/facebook-comment-generator` | AI, 3 options |
| Facebook Event Description Generator | `/tools/facebook-event-description-generator` | AI, 3 options |
| Facebook Group Description Generator | `/tools/facebook-group-description-generator` | AI, 3 options |
| Facebook Hashtag Generator | `/tools/facebook-hashtag-generator` | AI, 3 options |

Both toolsets are the fourth and fifth platforms on the same shared
engine — no changes to `ai-generator-view.tsx`, `lib/generator-api.ts`,
or `lib/gemini.ts` were needed. Unlike LinkedIn Studio, X and Facebook
tools rejoin the `creator-studio` category (same content-creator audience
as YouTube/Instagram) with `relatedGroup: "twitter"` /
`relatedGroup: "facebook"`, so each toolset's Related Tools rail
recommends only its own nine siblings — Creator Studio now spans four
platforms in one category without any toolset's recommendations blending
into another's.

**Tools #64–73 — SEO Studio**

| Tool | Route | Kind |
|---|---|---|
| Meta Title Generator | `/tools/seo-meta-title-generator` | AI, 3 options |
| Meta Description Generator | `/tools/seo-meta-description-generator` | AI, 3 options |
| Robots.txt Generator | `/tools/seo-robots-txt-generator` | Deterministic form builder |
| Sitemap Generator | `/tools/seo-sitemap-generator` | Deterministic form builder |
| Canonical URL Generator | `/tools/seo-canonical-url-generator` | Deterministic — URL normalization |
| Open Graph Generator | `/tools/seo-open-graph-generator` | Deterministic form builder |
| Twitter Card Generator | `/tools/seo-twitter-card-generator` | Deterministic form builder |
| Schema Generator | `/tools/seo-schema-generator` | Deterministic — 5 schema.org types |
| FAQ Schema Generator | `/tools/seo-faq-schema-generator` | Deterministic — parses Q&A pairs |
| Keyword Density Checker | `/tools/seo-keyword-density-checker` | Deterministic — word frequency analysis |

**Tools #74–83 — Developer Studio**

| Tool | Route | Kind |
|---|---|---|
| JSON Formatter | `/tools/dev-json-formatter` | Deterministic |
| JSON Validator | `/tools/dev-json-validator` | Deterministic |
| Base64 Encoder | `/tools/dev-base64-encoder` | Deterministic — UTF-8 safe |
| Base64 Decoder | `/tools/dev-base64-decoder` | Deterministic — UTF-8 safe |
| UUID Generator | `/tools/dev-uuid-generator` | Deterministic — crypto.randomUUID() |
| Password Generator | `/tools/dev-password-generator` | Deterministic — crypto.getRandomValues() |
| Hash Generator | `/tools/dev-hash-generator` | Deterministic — Web Crypto API (SHA-1/256/384/512) |
| HTML Minifier | `/tools/dev-html-minifier` | Deterministic — comment/whitespace only |
| CSS Minifier | `/tools/dev-css-minifier` | Deterministic — comment/whitespace only |
| JavaScript Minifier | `/tools/dev-javascript-minifier` | Deterministic — comment/whitespace only |

This batch is architecturally different from every prior one: only the
two Meta Title/Description tools are AI generators (the sixth platform on
the shared engine, via `lib/tools/seo-generator/`). The other 18 are
genuine deterministic utilities — no Gemini call, instant, free to run.

Seven of them (JSON Formatter/Validator, Base64 Encode/Decode, and the
three minifiers) share a new component,
`components/shared/text-transform-tool.tsx` — one "paste text, transform
it, copy the result" implementation instead of seven near-identical UIs.

The three minifiers share `lib/minify.ts`, a hand-written,
string/template-literal/regex-aware tokenizer that strips comments and
collapses blank lines — deliberately conservative. It never joins lines
or removes whitespace between tokens, because a more aggressive
whitespace-collapsing minifier can silently break code that relies on
JavaScript's automatic semicolon insertion. This logic was verified with
an actual test suite (not just reasoned about): edge cases like URLs
inside strings, regex-literal-vs-division disambiguation, and
comment-like text inside template literals, plus executing the minified
output of a realistic snippet to confirm it still runs correctly. MD5 is
deliberately not offered in the Hash Generator — it isn't part of the
Web Crypto API by design, and a hand-rolled implementation couldn't be
verified against a trusted reference in this environment, so it was left
out rather than shipped unverified.

**Version 1.0 — the final 17 tools**

Six formerly coming-soon tools are now fully live: AI Resume Builder and
SEO Meta Tag Generator (a 6th platform on the shared AI-generator engine,
`lib/tools/writing-generator/`), Meeting Notes Summarizer and Regex
Generator (custom AI tools with structured, non-"3-option" output —
Regex Generator's API route actually validates the returned pattern with
`new RegExp()` before ever returning it), Color Palette Generator
(deterministic HSL color-wheel math, not AI — verified against real
color theory), and CSV to JSON Converter (a genuine RFC-4180-style
parser, not a naive comma split).

Eleven brand-new tools complete the 100: a new **Image Studio** category
with 6 tools built on `lib/image-processing.ts` (real Canvas API
decode/resize/re-encode, entirely client-side — nothing uploaded) and one
shared `<ImageTransformTool>` component; QR Code Generator (via an
established public QR API rather than a hand-rolled, unverifiable
encoder); JWT Decoder (decodes only — never claims to verify a signature
it has no key for); URL Encoder/Decoder; Slug Generator; JSON to CSV
Converter (the reverse of CSV to JSON, reusing the same `arrayToCsv`
helper the finance tools' schedule export already used); and GST
Calculator (India's Goods and Services Tax, both directions, with a
CGST/SGST split).

**The shared finance layer this suite is built on**

- `lib/finance/loan.ts` — reducing-balance loan engine. Both EMI Calculator
  and Loan Calculator call this; EMI's own `calculateEmi()` was refactored
  to delegate to it internally (same external API, zero duplicate math).
- `lib/finance/annuity.ts` — recurring-contribution engine (optional
  starting lump sum, optional step-up, optional inflation adjustment).
  Powers SIP, RD, and Retirement; SIP's own `calculateSip()` now delegates
  to it the same way EMI does to `loan.ts`.
- `lib/finance/withdrawal.ts` — systematic withdrawal engine (SWP), flags
  the month a corpus depletes if the withdrawal rate outpaces returns.
- `lib/finance/interest.ts` — compound-interest engine with selectable
  compounding frequency. Powers both FD and Compound Interest Calculator.
- `lib/finance/cagr.ts` — CAGR engine, plus an implied year-by-year growth
  projection for charting.
- `lib/finance/currency.ts` / `format.ts` — shared currency/percent/tenure
  formatting used by every tool's summary cards and Copy/Share text.
- `lib/finance/validation.ts` — shared numeric-range field builder and
  tenure-bounds check, reused by every tool's zod schema.
- `lib/finance/chart-colors.ts` — theme-aware chart color, tooltip, and
  legend tokens (`hsl(var(--...))`), so every chart in every tool follows
  dark/light mode automatically.
- `components/shared/finance/` — `<SummaryCards>`, `<ScheduleTable>`
  (generic, typed, with CSV export built in), `<CompositionDonutChart>`,
  `<GrowthAreaChart>` (one or more area/line series), `<YearlyBarChart>` —
  five presentational primitives that all 9 finance tools configure with
  data rather than reimplement.
- `components/shared/tenure-toggle.tsx` — the Months/Years control, shared
  by every tool with a period input.
- `components/shared/formula-section.tsx` / `example-calculation.tsx` /
  `feedback-section.tsx` / `faq.tsx` / `share-actions.tsx` — rendered
  automatically by `ToolPageShell` from `formula` / `example` / `faq`
  fields on a tool's registry entry; a tool opts in by adding data, never
  by writing new section markup.
- `lib/csv-export.ts` — `arrayToCsv` / `downloadCsv`, used by every
  schedule table via `<ScheduleTable>`.
- `addedAt` on every `ToolDefinition` powers `getRecentlyAddedTools()`,
  which drives the homepage's "Recently added" rail automatically.
- `isCalculator: true` adds `applicationSubCategory: "Calculator"` to a
  tool's JSON-LD automatically.

---

## Folder structure

```
toolverse/
├── app/
│   ├── api/
│   │   └── tools/
│   │       └── email-writer/
│   │           └── generate/route.ts   # Tool-scoped API route
│   ├── categories/
│   │   ├── page.tsx                     # All categories
│   │   └── [category]/page.tsx          # One generic category route
│   ├── tools/
│   │   ├── page.tsx                     # All tools (search + filter)
│   │   └── [slug]/
│   │       ├── page.tsx                 # One generic tool route
│   │       └── opengraph-image.tsx      # Per-tool OG image
│   ├── layout.tsx                        # Root layout: Header, Footer, providers
│   ├── page.tsx                          # Homepage (categories + recently added)
│   ├── globals.css                       # Design tokens (light/dark)
│   ├── icon.tsx / opengraph-image.tsx    # Generated site-wide images
│   ├── robots.ts / sitemap.ts            # SEO — includes every tool/category
│   ├── loading.tsx / error.tsx / not-found.tsx
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── search.tsx                    # ⌘K command palette
│   │   ├── mobile-nav.tsx
│   │   └── tool-page-shell.tsx           # Reusable layout for every tool page
│   │                                        (renders formula/FAQ/feedback
│   │                                         automatically when present)
│   ├── shared/
│   │   ├── tool-card.tsx
│   │   ├── category-card.tsx
│   │   ├── breadcrumbs.tsx
│   │   ├── related-tools.tsx
│   │   ├── tools-browser.tsx             # Search/filter grid for /tools
│   │   ├── tenure-toggle.tsx             # Shared Months/Years control
│   │   ├── formula-section.tsx           # Shared formula explanation block
│   │   ├── example-calculation.tsx       # Shared worked-example block
│   │   ├── feedback-section.tsx          # Shared "was this helpful?" widget
│   │   ├── faq.tsx                       # Shared FAQ accordion
│   │   ├── share-actions.tsx             # Shared Share + Copy Results
│   │   ├── json-ld.tsx                   # Shared SEO structured-data component
│   │   └── finance/                      # Shared finance PRESENTATION components
│   │       ├── summary-cards.tsx         # Generic result-card grid
│   │       ├── schedule-table.tsx        # Generic period-by-period table + CSV
│   │       ├── composition-donut-chart.tsx
│   │       ├── growth-area-chart.tsx     # 1+ area/line series over time
│   │       └── yearly-bar-chart.tsx      # Grouped bar comparison
│   ├── tools/
│   │   ├── email-writer/                 # Tool #1's UI — namespaced, self-contained
│   │   │   ├── email-writer.tsx
│   │   │   ├── email-output.tsx
│   │   │   ├── tone-selector.tsx
│   │   │   └── length-selector.tsx
│   │   ├── emi-calculator/               # Each finance tool follows the same shape:
│   │   │   ├── emi-calculator.tsx        #   <slug>.tsx        — orchestrator, wires the
│   │   │   └── emi-inputs-form.tsx       #                       shared finance components
│   │   │   └── <slug>-inputs-form.tsx    #   <slug>-inputs-form.tsx — the input fields
│   │   ├── sip-calculator/               # (SIP additionally has its own summary-cards.tsx
│   │   │   └── ...                       #  and charts.tsx, predating the shared primitives —
│   │   ├── loan-calculator/              #  preserved as-is rather than retrofitted)
│   │   ├── fd-calculator/
│   │   ├── rd-calculator/
│   │   ├── swp-calculator/
│   │   ├── compound-interest-calculator/
│   │   ├── retirement-calculator/
│   │   └── cagr-calculator/
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── ui/                               # Reusable primitives (button, dialog, select, ...)
├── hooks/
│   └── tools/
│       ├── email-writer/use-email-generator.ts
│       └── <slug>/use-<slug>.ts          # One state hook per tool, same pattern throughout
├── lib/
│   ├── tools-registry.ts                 # THE catalog — single source of truth (10 tools)
│   ├── categories.ts                     # THE category list (incl. Finance)
│   ├── seo.ts                            # Shared metadata builder
│   ├── structured-data.ts                # JSON-LD builders (FAQPage, Calculator subcategory)
│   ├── breadcrumbs.ts                    # Shared breadcrumb-trail builder
│   ├── csv-export.ts                     # Shared CSV helpers
│   ├── finance/                          # Shared finance CALCULATION engines + formatting
│   │   ├── types.ts                      # TenureUnit + toMonths()
│   │   ├── currency.ts                   # formatCurrency / formatPercent
│   │   ├── format.ts                     # formatTenureText + re-exports currency helpers
│   │   ├── validation.ts                 # numberRangeField, tenure-bounds helpers
│   │   ├── chart-colors.ts               # Theme-aware chart color/tooltip/legend tokens
│   │   ├── loan.ts                       # Reducing-balance loan engine (EMI + Loan Calculator)
│   │   ├── annuity.ts                    # Recurring-contribution engine (SIP + RD + Retirement)
│   │   ├── withdrawal.ts                 # Systematic withdrawal engine (SWP)
│   │   ├── interest.ts                   # Compound-interest engine (FD + Compound Interest)
│   │   └── cagr.ts                       # CAGR engine (CAGR Calculator)
│   ├── site-config.ts                    # Site name/tagline/URL
│   ├── types.ts                          # Platform-wide types (ToolDefinition, FaqItem, ...)
│   ├── utils.ts                          # cn(), clipboard, char count
│   └── tools/
│       ├── email-writer/{constants,types,validations}.ts
│       └── <slug>/                       # Each finance tool: a thin domain layer that
│           ├── calculations.ts           #   delegates its math to lib/finance/*.ts
│           ├── constants.ts              #   (defaults, limits, FAQ, formula, example)
│           ├── format.ts                 #   (result-summary text; currency reused)
│           ├── types.ts
│           └── validations.ts
├── public/
├── .env.example
├── components.json                        # shadcn/ui config
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

**Namespacing rule:** anything specific to one tool lives under a
`<domain>/tools/<slug>/` folder (`lib/tools/email-writer/`,
`components/tools/email-writer/`, `hooks/tools/email-writer/`,
`app/api/tools/email-writer/`). Anything shared across the whole platform
lives at the top level of `lib/`, `components/layout/`, or
`components/shared/`. This is what keeps 100 tools from colliding on
file names or duplicating layout code — and it's why adding 7 finance
tools in one pass only required *one* new calculation engine per genuinely
distinct kind of math (loan, annuity, withdrawal, compound interest,
CAGR), not seven.

---

## Adding a new tool (walkthrough)

1. Create `components/tools/<slug>/<slug>.tsx` exporting your tool's root
   component (client component, same pattern as `EmailWriter`).
2. If it needs domain types/constants/validation, add
   `lib/tools/<slug>/{types,constants,validations}.ts`. For a calculator,
   put the actual math in a shared `lib/finance/<topic>.ts` engine if the
   same calculation could plausibly power more than one tool (interest,
   annuities, and loan amortization all already have one) — the tool's own
   `calculations.ts` should just adapt the shared engine's result, the way
   every finance tool in this repo does.
3. If it needs a backend, add `app/api/tools/<slug>/.../route.ts`.
4. Register it in `lib/tools-registry.ts`. `addedAt` is required — every
   tool needs one so `getRecentlyAddedTools()` can sort correctly:
   ```ts
   {
     slug: "your-tool",
     name: "Your Tool",
     tagline: "...",
     description: "...",
     category: "developer", // must match a slug in lib/categories.ts
     icon: SomeLucideIcon,
     keywords: ["..."],
     status: "live",
     addedAt: "2026-08-01", // ISO date — required, drives "Recently added"
     loadComponent: () =>
       import("@/components/tools/your-tool/your-tool").then((m) => ({
         default: m.YourTool,
       })),
     // All optional. Add any of these and ToolPageShell renders the
     // matching section automatically — no new component code needed:
     // faq: YourToolFaqItems,
     // formula: YourToolFormula,
     // example: YourToolExample,
     // applicationCategory: "FinanceApplication",
     // isCalculator: true, // adds the Calculator JSON-LD subcategory
   }
   ```
5. Done. It now has a page at `/tools/your-tool`, shows up on the
   homepage's category grid and "Recently added" rail, `/tools`,
   its category page, related-tools rails, search, the sitemap, and gets
   its own OG image — automatically.

---

## Prerequisites

- Node.js **18.18+** (Node 20 LTS recommended)
- npm 9+
- A [Google Gemini API key](https://aistudio.google.com/apikey) (used by
  the Email Writer tool and every Creator Studio / LinkedIn Studio tool)

## 1. Install

```bash
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

```env
# .env.local
GEMINI_API_KEY=your-gemini-api-key-here

# Optional — used for SEO metadata (Open Graph URLs, sitemap, robots.txt)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

`GEMINI_API_KEY` is read only on the server, inside `lib/gemini.ts` (the
shared helper both AI tools call) — never exposed to the browser.

## 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 4. Type-check and lint

```bash
npm run typecheck
npm run lint
```

## 5. Build for production

```bash
npm run build
npm run start
```

---

## Deploying to Cloudflare Workers

This project deploys via [OpenNext's Cloudflare adapter](https://opennext.js.org/cloudflare)
(`@opennextjs/cloudflare`), not Cloudflare Pages — Cloudflare deprecated
the Pages-specific Next.js adapter, and the Workers-based path is what
supports this app's Node.js-runtime API routes (the AI generation
endpoints).

### First-time setup

```bash
npx wrangler login
npx wrangler secret put GEMINI_API_KEY
npm run deploy
```

`npm run deploy` runs `opennextjs-cloudflare build` then
`opennextjs-cloudflare deploy` — see `package.json` for the exact scripts,
and `wrangler.jsonc` for the Worker's configuration (name, compatibility
flags, static asset binding).

### Custom domain

In the Cloudflare dashboard: **Workers & Pages → toolverse → Settings →
Domains & Routes → Add → Custom Domain**. Add both your apex domain and
`www` subdomain if you use both — `middleware.ts` handles redirecting one
to the other.

### Continuous deployment

`.github/workflows/deploy.yml` builds and deploys automatically on every
push to `main`. It needs two repository secrets (**Settings → Secrets and
variables → Actions** in your GitHub repo):

- `CLOUDFLARE_API_TOKEN` — create one at **My Profile → API Tokens**,
  using the "Edit Cloudflare Workers" template
- `CLOUDFLARE_ACCOUNT_ID` — shown in the Cloudflare dashboard sidebar on
  any zone overview page

`GEMINI_API_KEY` is never passed through CI — it's a Worker secret set
once via `wrangler secret put`, independent of any given deploy.

---

## Tech stack

| Layer       | Choice                                   |
|-------------|-------------------------------------------|
| Framework   | Next.js 15 (App Router, Route Handlers)   |
| Language    | TypeScript (strict mode)                  |
| Styling     | Tailwind CSS + CSS variables (light/dark) |
| Components  | shadcn/ui-style primitives + Radix UI     |
| Icons       | lucide-react                              |
| Validation  | zod                                       |
| Toasts      | sonner                                    |
| Theming     | next-themes                               |
| AI          | Google Gemini API (`gemini-flash-latest`, plain `fetch`)  |

---

## License

This project is provided as-is for your own use and modification.
