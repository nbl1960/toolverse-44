import { ImageResponse } from "next/og";
import { getAllTools, getToolBySlug } from "@/lib/tools-registry";
import { SITE_NAME } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OpengraphImageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-renders one OG image per registry entry at build time — same
 * pattern as the tool page itself. Without this, Next.js has no way to
 * know these 100 routes exist ahead of time, so each one falls back to
 * on-demand server rendering: real Satori/WASM image generation work
 * running inside the Worker on every request instead of once at build
 * time, then served as a static asset forever after.
 */
export function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

/** Generates a per-tool social share image: tool name + tagline on the brand background. */
export default async function OpengraphImage({ params }: OpengraphImageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const title = tool?.name ?? SITE_NAME;
  const tagline = tool?.tagline ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f2ea",
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(192,136,61,0.16) 0%, rgba(192,136,61,0) 45%)",
          fontFamily: "serif",
          padding: "0 100px",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontFamily: "sans-serif",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#c0883d",
            marginBottom: 20,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            color: "#1c2b45",
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        {tagline && (
          <div
            style={{
              marginTop: 18,
              fontSize: 28,
              fontFamily: "sans-serif",
              color: "#5b5142",
              textAlign: "center",
              maxWidth: 820,
            }}
          >
            {tagline}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
