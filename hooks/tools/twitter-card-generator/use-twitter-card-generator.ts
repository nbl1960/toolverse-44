"use client";

import * as React from "react";
import { buildTwitterCardTags } from "@/lib/tools/twitter-card-generator/calculations";
import { DEFAULT_CARD_TYPE } from "@/lib/tools/twitter-card-generator/constants";
import type { TwitterCardFormValues } from "@/lib/tools/twitter-card-generator/types";

const DEFAULT_VALUES: TwitterCardFormValues = {
  cardType: DEFAULT_CARD_TYPE,
  title: "",
  description: "",
  imageUrl: "",
  site: "",
};

interface UseTwitterCardGeneratorResult {
  values: TwitterCardFormValues;
  setField: <K extends keyof TwitterCardFormValues>(key: K, value: TwitterCardFormValues[K]) => void;
  output: string | null;
  reset: () => void;
}

export function useTwitterCardGenerator(): UseTwitterCardGeneratorResult {
  const [values, setValues] = React.useState<TwitterCardFormValues>(DEFAULT_VALUES);

  const setField = React.useCallback(
    <K extends keyof TwitterCardFormValues>(key: K, value: TwitterCardFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = React.useCallback(() => setValues(DEFAULT_VALUES), []);
  const output = React.useMemo(() => buildTwitterCardTags(values), [values]);

  return { values, setField, output, reset };
}
