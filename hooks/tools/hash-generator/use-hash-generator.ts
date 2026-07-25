"use client";

import * as React from "react";
import { generateHash } from "@/lib/tools/hash-generator/calculations";
import { DEFAULT_ALGORITHM } from "@/lib/tools/hash-generator/constants";
import type { HashAlgorithm, HashResult } from "@/lib/tools/hash-generator/types";

interface UseHashGeneratorResult {
  text: string;
  setText: (value: string) => void;
  algorithm: HashAlgorithm;
  setAlgorithm: (value: HashAlgorithm) => void;
  result: HashResult | null;
  isHashing: boolean;
  generate: () => void;
  clear: () => void;
}

/** Drives the Hash Generator. crypto.subtle.digest is async, so this manages its own loading state. */
export function useHashGenerator(): UseHashGeneratorResult {
  const [text, setText] = React.useState("");
  const [algorithm, setAlgorithm] = React.useState<HashAlgorithm>(DEFAULT_ALGORITHM);
  const [result, setResult] = React.useState<HashResult | null>(null);
  const [isHashing, setIsHashing] = React.useState(false);

  const generate = React.useCallback(() => {
    if (!text) return;
    setIsHashing(true);
    generateHash(text, algorithm)
      .then((hashResult) => setResult(hashResult))
      .catch(() => setResult(null))
      .finally(() => setIsHashing(false));
  }, [text, algorithm]);

  const clear = React.useCallback(() => {
    setText("");
    setResult(null);
  }, []);

  return { text, setText, algorithm, setAlgorithm, result, isHashing, generate, clear };
}
