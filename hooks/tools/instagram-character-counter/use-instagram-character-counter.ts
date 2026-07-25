"use client";

import * as React from "react";
import { calculateCharacterCount } from "@/lib/tools/instagram-character-counter/calculations";
import type { CharacterCounterMode, CharacterCountResult } from "@/lib/tools/instagram-character-counter/types";

interface UseInstagramCharacterCounterResult {
  text: string;
  setText: (value: string) => void;
  mode: CharacterCounterMode;
  setMode: (mode: CharacterCounterMode) => void;
  result: CharacterCountResult;
  reset: () => void;
}

/** Drives the Character Counter: live-recalculates on every keystroke, no server round trip. */
export function useInstagramCharacterCounter(): UseInstagramCharacterCounterResult {
  const [text, setText] = React.useState("");
  const [mode, setMode] = React.useState<CharacterCounterMode>("caption");

  const reset = React.useCallback(() => setText(""), []);

  const result = React.useMemo(() => calculateCharacterCount(text, mode), [text, mode]);

  return { text, setText, mode, setMode, result, reset };
}
