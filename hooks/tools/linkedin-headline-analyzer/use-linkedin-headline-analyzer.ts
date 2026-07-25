"use client";

import * as React from "react";
import { analyzeHeadline } from "@/lib/tools/linkedin-headline-analyzer/calculations";
import type { HeadlineAnalysisResult } from "@/lib/tools/linkedin-headline-analyzer/types";

interface UseLinkedinHeadlineAnalyzerResult {
  headline: string;
  setHeadline: (value: string) => void;
  result: HeadlineAnalysisResult | null;
  reset: () => void;
}

/** Drives the Headline Analyzer: live-recalculates on every keystroke, no server round trip. */
export function useLinkedinHeadlineAnalyzer(): UseLinkedinHeadlineAnalyzerResult {
  const [headline, setHeadline] = React.useState("");

  const reset = React.useCallback(() => setHeadline(""), []);

  const result = React.useMemo(() => (headline.trim() ? analyzeHeadline(headline) : null), [headline]);

  return { headline, setHeadline, result, reset };
}
