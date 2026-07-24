import { NextResponse, type NextRequest } from "next/server";

/**
 * Permanently redirects www.toolsverse.co -> toolsverse.co, so the domain
 * has a single canonical host regardless of which one a visitor or search
 * engine landed on. Runs at the edge for every request; both hostnames
 * must be attached as custom domains on the same Worker for this to see
 * both (see the Cloudflare custom-domain setup in the deployment guide).
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  if (host === "www.toolsverse.co") {
    const canonicalUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, "https://toolsverse.co");
    return NextResponse.redirect(canonicalUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run on every path except static assets and Next.js internals, which
  // never need the redirect check and shouldn't pay its cost.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
