"use client";

import * as React from "react";
import { buildThumbnailOptions, extractYoutubeVideoId } from "@/lib/tools/youtube-thumbnail-downloader/calculations";
import type { ThumbnailOption } from "@/lib/tools/youtube-thumbnail-downloader/types";

interface UseYoutubeThumbnailDownloaderResult {
  url: string;
  setUrl: (value: string) => void;
  videoId: string | null;
  options: ThumbnailOption[] | null;
  errorMessage: string | null;
  reset: () => void;
}

/** Drives the Thumbnail Downloader: parses the URL live, no server round trip needed. */
export function useYoutubeThumbnailDownloader(): UseYoutubeThumbnailDownloaderResult {
  const [url, setUrl] = React.useState("");

  const reset = React.useCallback(() => setUrl(""), []);

  const { videoId, options, errorMessage } = React.useMemo(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      return { videoId: null, options: null, errorMessage: null };
    }

    const id = extractYoutubeVideoId(trimmed);
    if (!id) {
      return {
        videoId: null,
        options: null,
        errorMessage: "That doesn't look like a valid YouTube video URL. Try pasting the full link.",
      };
    }

    return { videoId: id, options: buildThumbnailOptions(id), errorMessage: null };
  }, [url]);

  return { url, setUrl, videoId, options, errorMessage, reset };
}
