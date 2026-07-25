"use client";

import * as React from "react";
import { buildSitemap } from "@/lib/tools/sitemap-generator/calculations";
import { DEFAULT_CHANGE_FREQ, DEFAULT_PRIORITY } from "@/lib/tools/sitemap-generator/constants";
import type { SitemapFormValues } from "@/lib/tools/sitemap-generator/types";

const DEFAULT_VALUES: SitemapFormValues = {
  urls: "",
  changeFreq: DEFAULT_CHANGE_FREQ,
  priority: DEFAULT_PRIORITY,
};

interface UseSitemapGeneratorResult {
  values: SitemapFormValues;
  setField: <K extends keyof SitemapFormValues>(key: K, value: SitemapFormValues[K]) => void;
  output: string | null;
  reset: () => void;
}

/** Drives the Sitemap Generator: live-recalculates as any field changes, no server round trip. */
export function useSitemapGenerator(): UseSitemapGeneratorResult {
  const [values, setValues] = React.useState<SitemapFormValues>(DEFAULT_VALUES);

  const setField = React.useCallback(
    <K extends keyof SitemapFormValues>(key: K, value: SitemapFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = React.useCallback(() => setValues(DEFAULT_VALUES), []);
  const output = React.useMemo(() => buildSitemap(values), [values]);

  return { values, setField, output, reset };
}
