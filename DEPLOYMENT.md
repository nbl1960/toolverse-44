# Deployment Guide

ToolVerse deploys to Cloudflare Workers via the OpenNext Cloudflare
adapter (`@opennextjs/cloudflare`). This guide covers first-time setup
through to an ongoing deployment workflow.

## Prerequisites

- Node.js 18.18+ (see `package.json`'s `engines` field)
- A Cloudflare account
- A Gemini API key ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))
- The Wrangler CLI (installed as a dev dependency — no separate global
  install needed)

## First-time setup

```bash
npm install
npx wrangler login
npx wrangler secret put GEMINI_API_KEY
```

The secret command prompts for the key's value and stores it encrypted
on Cloudflare's side — set once, persists across every future deploy.
It is never read from `.env.local` or `.dev.vars` (see `ENVIRONMENT.md`
for what each of those is actually for).

## Local verification before every deploy

Three separate things are worth checking locally before pushing to
production, in increasing order of fidelity to the real environment:

```bash
npm run typecheck   # tsc --noEmit — catches type errors
npm run lint        # next lint — catches ESLint issues
npm run build       # the actual Next.js production build
```

Then, to test against the **real Cloudflare Workers runtime** locally
(not just Next.js's own dev server, which doesn't fully replicate the
Workers environment):

```bash
cp .dev.vars.example .dev.vars   # first time only — add your GEMINI_API_KEY
npm run preview
```

This runs `opennextjs-cloudflare build && opennextjs-cloudflare preview`
— a genuine Workers runtime simulation. If something works in `npm run
dev` but not `npm run preview`, that's a real signal of a
Workers-specific incompatibility (edge runtime limitations,
`process.env` resolution, etc.) worth investigating before it reaches
production.

## Deploying

```bash
npm run deploy
```

Runs `opennextjs-cloudflare build && opennextjs-cloudflare deploy`.

## What actually needs to be correct in `wrangler.jsonc`

- `compatibility_flags: ["nodejs_compat"]` — **required.** Without this,
  `process.env` doesn't reliably resolve secrets/vars under the Workers
  runtime, and every AI-powered route would fail even with a correctly-set
  secret.
- `compatibility_date` — should be reasonably recent (real-world
  reports point to April 2025 or later mattering for `process.env`
  behavior specifically). Don't leave this stale indefinitely.
- `vars` — only for **non-secret** configuration
  (`NEXT_PUBLIC_SITE_URL`). Never put `GEMINI_API_KEY` or any other
  secret here — this file is committed to version control.

## CI/CD (GitHub Actions)

If using Cloudflare's Git integration or a custom GitHub Actions
workflow to auto-deploy on push:

- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` need to be set as
  repository secrets for `wrangler deploy` to authenticate.
- `GEMINI_API_KEY` is **not** passed through CI — it's a Worker secret
  set once via `wrangler secret put`, independent of any given deploy.
  Don't add it as a GitHub Actions secret unless you specifically need
  it at build time (this project doesn't — every AI route reads it at
  request time, not build time).
- Run `npm run typecheck && npm run lint && npm run build` as a gate
  *before* the deploy step — a build that doesn't type-check or lint
  cleanly shouldn't reach production automatically.

## Post-deploy checks

After every deploy, confirm — against the **actual live URL**, not just
that the deploy command exited successfully:

```bash
curl -sI https://your-domain.example.com/ | head -5          # site responds
curl -s https://your-domain.example.com/sitemap.xml | head    # sitemap generates
curl -s https://your-domain.example.com/robots.txt             # robots.txt generates
```

And manually verify at least one AI-powered tool actually returns a
result (not just that the page loads) — a missing or misconfigured
`GEMINI_API_KEY` secret won't show up in a build log, only at request
time.

**Why this step is explicitly called out:** this project has previously
had a real incident where source code was correct but the deployed
site showed stale content — a build/cache issue, discovered only
because someone checked the live site and noticed a discrepancy, not
because any build step failed. A successful deploy command is not the
same as a correct live site. Check the live site.

## Rolling back

Cloudflare Workers keeps prior deployment versions — use `wrangler
deployments list` and `wrangler rollback` if a deploy introduces a
regression, rather than rushing a forward-fix under pressure.
