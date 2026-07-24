import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext build configuration for the Cloudflare Workers adapter. The
 * defaults are correct for this app — no KV/R2/D1 caching overrides are
 * needed since ToolVerse has no incremental-cache or ISR requirements
 * beyond what static generation already covers (every tool/category page
 * is pre-rendered via generateStaticParams).
 */
export default defineCloudflareConfig();
