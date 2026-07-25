import type { ThumbnailOption } from "./types";

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/**
 * Extracts the 11-character video ID from any common YouTube URL shape:
 * watch?v=, youtu.be/, /embed/, /shorts/, /live/, with or without a
 * leading "www."/"m." subdomain or trailing query params. Returns null
 * for anything that isn't a recognizable YouTube video URL.
 */
export function extractYoutubeVideoId(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^(www\.|m\.)/, "");
  if (host !== "youtube.com" && host !== "youtu.be") return null;

  let candidate: string | null = null;

  if (host === "youtu.be") {
    candidate = parsed.pathname.slice(1).split("/")[0] ?? null;
  } else if (parsed.pathname === "/watch") {
    candidate = parsed.searchParams.get("v");
  } else {
    const match = parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/);
    candidate = match ? (match[1] ?? null) : null;
  }

  return candidate && YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
}

/**
 * Every thumbnail resolution YouTube publishes at a predictable, public
 * CDN URL for a given video ID. `maxresdefault` isn't generated for every
 * video (older or low-resolution uploads may not have it) — the UI
 * handles that by hiding options that fail to load, not by pretending
 * they're guaranteed to exist.
 */
export function buildThumbnailOptions(videoId: string): ThumbnailOption[] {
  return [
    {
      key: "maxresdefault",
      label: "Max resolution",
      resolution: "1280×720",
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    },
    {
      key: "sddefault",
      label: "Standard definition",
      resolution: "640×480",
      url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    },
    {
      key: "hqdefault",
      label: "High quality",
      resolution: "480×360",
      url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    },
    {
      key: "mqdefault",
      label: "Medium quality",
      resolution: "320×180",
      url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    },
    {
      key: "default",
      label: "Default",
      resolution: "120×90",
      url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    },
  ];
}
