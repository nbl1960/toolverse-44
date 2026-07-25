"use client";

import * as React from "react";
import { buildFaqSchemaJsonLd, parseFaqPairs } from "@/lib/tools/faq-schema-generator/calculations";
import { DEFAULT_FAQ_INPUT } from "@/lib/tools/faq-schema-generator/constants";

interface UseFaqSchemaGeneratorResult {
  input: string;
  setInput: (value: string) => void;
  output: string | null;
  pairCount: number;
  reset: () => void;
}

/** Drives the FAQ Schema Generator: live-recalculates as the input changes, no server round trip. */
export function useFaqSchemaGenerator(): UseFaqSchemaGeneratorResult {
  const [input, setInput] = React.useState(DEFAULT_FAQ_INPUT);

  const reset = React.useCallback(() => setInput(""), []);

  const { output, pairCount } = React.useMemo(() => {
    const pairs = parseFaqPairs(input);
    return { output: buildFaqSchemaJsonLd(pairs), pairCount: pairs.length };
  }, [input]);

  return { input, setInput, output, pairCount, reset };
}
