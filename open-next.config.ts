import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * OpenNext build configuration for the Cloudflare Workers adapter.
 *
 * ToolVerse is an SSG site — every tool page, category page, and legal
 * page is pre-rendered via `generateStaticParams`, with no ISR or
 * on-demand revalidation anywhere. Per OpenNext's own "SSG site"
 * caching guideline, that means the incremental cache should point at
 * Workers Static Assets (the build-time output, already wired via the
 * `assets` binding in wrangler.jsonc) with cache interception enabled.
 *
 * `enableCacheInterception: true` is what actually matters for CPU:
 * without it, a request to an already-statically-generated route still
 * loads and invokes the full Next.js server runtime inside the Worker
 * to serve the cached page. With it, a cache hit is served directly
 * from Static Assets and the NextServer JS is never loaded or run at
 * all for that request. An earlier version of this file used zero
 * overrides on the assumption that "no ISR/revalidation" meant "no
 * incremental cache config needed" — that was incomplete: even a pure
 * SSG site needs this specific configuration to avoid paying full
 * server-rendering cost on every request to already-static content.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
