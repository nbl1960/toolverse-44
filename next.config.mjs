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
    ];
  },
};

export default nextConfig;
