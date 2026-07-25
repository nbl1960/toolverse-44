"use client";

import * as React from "react";
import { calculateTimestamps, parseChapterLines } from "@/lib/tools/youtube-timestamp-generator/calculations";
import { DEFAULT_CHAPTERS_INPUT } from "@/lib/tools/youtube-timestamp-generator/constants";
import type { TimestampGeneratorResult } from "@/lib/tools/youtube-timestamp-generator/types";

interface UseYoutubeTimestampGeneratorResult {
  input: string;
  setInput: (value: string) => void;
  result: TimestampGeneratorResult | null;
  errorMessage: string | null;
  reset: () => void;
}

/** Drives the Timestamp Generator: live-recalculates as the user edits their chapter list. */
export function useYoutubeTimestampGenerator(): UseYoutubeTimestampGeneratorResult {
  const [input, setInput] = React.useState(DEFAULT_CHAPTERS_INPUT);

  const reset = React.useCallback(() => setInput(""), []);

  const { result, errorMessage } = React.useMemo(() => {
    const chapters = parseChapterLines(input);
    if (chapters.length === 0) {
      return {
        result: null,
        errorMessage: input.trim()
          ? "No valid chapters found. Use one per line: \"Title | duration\", e.g. \"Intro | 0:45\"."
          : null,
      };
    }
    return { result: calculateTimestamps(chapters), errorMessage: null };
  }, [input]);

  return { input, setInput, result, errorMessage, reset };
}
