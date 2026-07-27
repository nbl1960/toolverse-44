import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-config";

/**
 * Web app manifest, served at /manifest.webmanifest and auto-linked by
 * Next.js into every page's <head> via this file-convention route — no
 * manual <link rel="manifest"> needed in layout.tsx.
 *
 * The icon entry points at the existing /icon route (app/icon.tsx, a
 * dynamically generated 32x32 PNG) — the actual icon this app has today.
 * For a fuller PWA/home-screen icon set, dedicated 192x192 and 512x512
 * icons would be a worthwhile follow-up (see the SEO report).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: SITE_TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#f5f2ea",
    theme_color: "#f5f2ea",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
