"use client";

import * as React from "react";
import { analyzeKeywordDensity } from "@/lib/tools/keyword-density-checker/calculations";

interface UseKeywordDensityCheckerResult {
  text: string;
  setText: (value: string) => void;
  targetKeyword: string;
  setTargetKeyword: (value: string) => void;
  result: ReturnType<typeof analyzeKeywordDensity>;
  reset: () => void;
}

/** Drives the Keyword Density Checker: live-recalculates as text or keyword changes, no server round trip. */
export function useKeywordDensityChecker(): UseKeywordDensityCheckerResult {
  const [text, setText] = React.useState("");
  const [targetKeyword, setTargetKeyword] = React.useState("");

  const reset = React.useCallback(() => {
    setText("");
    setTargetKeyword("");
  }, []);

  const result = React.useMemo(() => analyzeKeywordDensity(text, targetKeyword), [text, targetKeyword]);

  return { text, setText, targetKeyword, setTargetKeyword, result, reset };
}
