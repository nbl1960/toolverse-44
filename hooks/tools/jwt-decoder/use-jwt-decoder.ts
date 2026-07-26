"use client";

import * as React from "react";
import { decodeJwt } from "@/lib/tools/jwt-decoder/calculations";
import type { JwtDecodeResult } from "@/lib/tools/jwt-decoder/types";

interface UseJwtDecoderResult {
  token: string;
  setToken: (value: string) => void;
  result: JwtDecodeResult | null;
  errorMessage: string | null;
  reset: () => void;
}

/** Drives the JWT Decoder: live-decodes as the token input changes, no server round trip. */
export function useJwtDecoder(): UseJwtDecoderResult {
  const [token, setToken] = React.useState("");

  const reset = React.useCallback(() => setToken(""), []);

  const { result, errorMessage } = React.useMemo(() => {
    if (!token.trim()) return { result: null, errorMessage: null };
    try {
      return { result: decodeJwt(token), errorMessage: null };
    } catch (error) {
      return { result: null, errorMessage: error instanceof Error ? error.message : "Couldn't decode this token." };
    }
  }, [token]);

  return { token, setToken, result, errorMessage, reset };
}
