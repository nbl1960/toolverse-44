"use client";

import * as React from "react";
import { runUrlCodec } from "@/lib/tools/url-encoder-decoder/calculations";
import type { UrlCodecMode } from "@/lib/tools/url-encoder-decoder/types";
import type { TransformResult } from "@/components/shared/text-transform-tool";

interface UseUrlEncoderDecoderResult {
  input: string;
  setInput: (value: string) => void;
  mode: UrlCodecMode;
  setMode: (value: UrlCodecMode) => void;
  result: TransformResult | null;
  reset: () => void;
}

/** Drives the URL Encoder/Decoder: live-recalculates as input or mode changes, no server round trip. */
export function useUrlEncoderDecoder(): UseUrlEncoderDecoderResult {
  const [input, setInput] = React.useState("");
  const [mode, setMode] = React.useState<UrlCodecMode>("encode");

  const reset = React.useCallback(() => setInput(""), []);
  const result = React.useMemo(() => (input ? runUrlCodec(input, mode) : null), [input, mode]);

  return { input, setInput, mode, setMode, result, reset };
}
