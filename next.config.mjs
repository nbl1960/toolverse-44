/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Only lucide-react here: recharts' internal cross-file dependencies
    // are incompatible with this optimization and cause "Collecting page
    // data" failures (createContext errors) during static generation.
    optimizePackageImports: ["lucide-react"],
  },

  // Security headers, applied to every route. This is the code-based,
  // host-portable equivalent of a Cloudflare Pages `_headers` file — it
  // works identically whether the app runs on Cloudflare Workers (via
  // OpenNext), Vercel, or anywhere else, since Next.js itself renders
  // these at request time rather than relying on a platform-specific file.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // HSTS: force HTTPS for this host and its subdomains for a year,
          // and opt into browser preload lists. Cloudflare's edge already
          // terminates TLS for every request, so this simply tells
          // browsers never to attempt a plain-HTTP request in the first
          // place.
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Prevents the browser from guessing content types away from
          // what the server declared (mitigates some XSS/MIME-sniffing
          // attacks).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Blocks this site from being embedded in an <iframe> on another
          // origin, preventing clickjacking.
          { key: "X-Frame-Options", value: "DENY" },
          // Only send the origin (not the full URL/path) as a Referer
          // header on cross-origin navigations; send the full URL for
          // same-origin ones.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Explicitly disable browser features this app never uses.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Legacy header some older browsers/scanners still check;
          // modern browsers use CSP instead, but this is a harmless,
          // widely-recommended safety net.
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Restricts which origins scripts/styles/images/connections can
          // load from, as defense-in-depth against XSS. Scoped to the
          // domains this app actually loads client-side — verified by
          // grepping the real source, not guessed: Google Analytics
          // (googletagmanager.com for the script, google-analytics.com/
          // analytics.google.com for the beacon calls it makes),
          // api.qrserver.com (the QR Code Generator's image), and
          // img.youtube.com (the Thumbnail Downloader's previews).
          // 'unsafe-inline' on script-src is required because Next.js
          // itself injects inline hydration scripts without a nonce in
          // this setup — a nonce-based strict CSP is possible but adds
          // real complexity (per-request middleware nonce generation)
          // that isn't worth the risk to add untested here.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://www.google-analytics.com https://api.qrserver.com https://img.youtube.com",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
      {
        // Every file under /_next/static/ has a content hash baked into
        // its filename (Next.js's own build output convention) — the
        // filename itself changes whenever the content does, so it's
        // safe to tell browsers to cache it forever and skip
        // revalidation entirely on repeat visits, rather than the
        // shorter default cache window. This measurably helps repeat-
        // visit LCP/load time without risking stale content, since a
        // changed file is a different URL by construction.
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // The favicon and site-wide OG image are generated from fully
        // static content with zero external dependencies — identical
        // until the next deploy. Explicit long-lived caching here is
        // defense-in-depth: even if the platform's own static-generation
        // caching is ever bypassed for any reason, this header still
        // tells any CDN/browser in front of the Worker to serve a cached
        // copy rather than re-invoke the comparatively expensive,
        // Satori/WASM-based image generation on every hit.
        source: "/icon",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=31536000" }],
      },
      {
        // Same reasoning, for every per-tool OG image — each is fully
        // determined by its slug and never changes until the next
        // deploy, now that generateStaticParams pre-renders all of them
        // at build time (see app/tools/[slug]/opengraph-image.tsx).
        source: "/tools/:slug/opengraph-image",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=31536000" }],
      },
    ];
  },
};

export default nextConfig;
