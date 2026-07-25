"use client";

import * as React from "react";
import { generateUuids } from "@/lib/tools/uuid-generator/calculations";
import { DEFAULT_COUNT } from "@/lib/tools/uuid-generator/constants";

interface UseUuidGeneratorResult {
  count: number;
  setCount: (value: number) => void;
  uuids: string[];
  regenerate: () => void;
}

/** Drives the UUID Generator: generates a fresh batch on mount and whenever regenerate() is called. */
export function useUuidGenerator(): UseUuidGeneratorResult {
  const [count, setCount] = React.useState(DEFAULT_COUNT);
  const [uuids, setUuids] = React.useState<string[]>(() => generateUuids(DEFAULT_COUNT).uuids);

  const regenerate = React.useCallback(() => {
    setUuids(generateUuids(count).uuids);
  }, [count]);

  return { count, setCount, uuids, regenerate };
}
