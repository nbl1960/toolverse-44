# Environment Variables Reference

This is the complete list — every environment variable actually
referenced anywhere in the codebase, verified by searching for every
`process.env.*` usage rather than assumed. If a variable isn't listed
here, the application doesn't read it.

## Required

### `GEMINI_API_KEY`

- **Used by:** every AI-powered tool and the AI Guide (`lib/gemini.ts`,
  called from every `app/api/tools/*/generate/route.ts` and
  `app/api/assistant/search/route.ts`).
- **Server-only.** Never exposed to the client — every route reading it
  declares `export const runtime = "nodejs"`.
- **Get one:** [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- **Without it:** every AI-powered tool returns a clear "missing
  GEMINI_API_KEY" error instead of crashing. Deterministic tools
  (calculators, JSON/image utilities, generators that don't call AI)
  work identically with or without this key set.

## Optional

### `NEXT_PUBLIC_SITE_URL`

- **Used by:** `lib/site-config.ts`'s `SITE_URL`, which feeds canonical
  URLs, sitemap generation, Open Graph tags, and structured data.
- **Public** (the `NEXT_PUBLIC_` prefix means this is inlined into the
  client bundle at build time — never put a secret here).
- **Default if unset:** `https://toolsverse.co`
- Set this to your actual production domain if it differs from the
  default, or to your preview deployment's URL for accurate metadata
  during staging.

### `CONTACT_WEBHOOK_URL`

- **Used by:** `app/api/contact/submit/route.ts`.
- **Server-only.**
- **What it does:** if set, contact form submissions are POSTed as JSON
  to this URL — point it at any endpoint that accepts a JSON webhook
  (a Resend/SendGrid serverless function, a Slack incoming webhook, a
  Zapier catch hook, etc.).
- **Without it:** submissions are still validated and logged
  server-side, but not delivered anywhere automatically — the contact
  form honestly falls back to opening the visitor's own email client
  via a pre-filled `mailto:` link instead of claiming a delivery that
  didn't happen. See `hooks/use-contact-form.ts` for the exact logic.

## Set automatically (not something you configure)

### `NODE_ENV`

- Set by Next.js itself (`development` under `next dev`, `production`
  in a production build) — never set this manually.
- **Used by:** `app/api/assistant/search/route.ts` to gate debug logging
  of raw Gemini responses to development only, so nothing sensitive or
  verbose lands in production logs.

## Which file to use, for which command

See the **"Configure environment variables"** section of `README.md`
for the full walkthrough — the short version:

| Command | Reads from |
|---|---|
| `npm run dev` | `.env.local` (copy from `.env.example`) |
| `npm run preview` (local Cloudflare Workers simulation) | `.dev.vars` (copy from `.dev.vars.example`) |
| `npm run deploy` (production) | A Cloudflare Worker secret — `npx wrangler secret put GEMINI_API_KEY` |

`.env.local` and `.dev.vars` are both gitignored. Never commit either
one, and never put a real secret directly in `wrangler.jsonc`'s `vars`
block (that file is committed — it's for non-secret configuration like
`NEXT_PUBLIC_SITE_URL` only).
