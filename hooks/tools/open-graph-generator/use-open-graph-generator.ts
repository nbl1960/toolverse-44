"use client";

import * as React from "react";
import { buildOpenGraphTags } from "@/lib/tools/open-graph-generator/calculations";
import { DEFAULT_OG_TYPE } from "@/lib/tools/open-graph-generator/constants";
import type { OpenGraphFormValues } from "@/lib/tools/open-graph-generator/types";

const DEFAULT_VALUES: OpenGraphFormValues = {
  title: "",
  description: "",
  url: "",
  imageUrl: "",
  siteName: "",
  type: DEFAULT_OG_TYPE,
};

interface UseOpenGraphGeneratorResult {
  values: OpenGraphFormValues;
  setField: <K extends keyof OpenGraphFormValues>(key: K, value: OpenGraphFormValues[K]) => void;
  output: string | null;
  reset: () => void;
}

export function useOpenGraphGenerator(): UseOpenGraphGeneratorResult {
  const [values, setValues] = React.useState<OpenGraphFormValues>(DEFAULT_VALUES);

  const setField = React.useCallback(
    <K extends keyof OpenGraphFormValues>(key: K, value: OpenGraphFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = React.useCallback(() => setValues(DEFAULT_VALUES), []);
  const output = React.useMemo(() => buildOpenGraphTags(values), [values]);

  return { values, setField, output, reset };
}
