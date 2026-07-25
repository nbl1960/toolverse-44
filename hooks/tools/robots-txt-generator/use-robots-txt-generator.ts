"use client";

import * as React from "react";
import { buildRobotsTxt } from "@/lib/tools/robots-txt-generator/calculations";
import type { RobotsFormValues } from "@/lib/tools/robots-txt-generator/types";

const DEFAULT_VALUES: RobotsFormValues = {
  userAgent: "*",
  disallowPaths: "",
  allowPaths: "",
  sitemapUrl: "",
  crawlDelay: "",
};

interface UseRobotsTxtGeneratorResult {
  values: RobotsFormValues;
  setField: <K extends keyof RobotsFormValues>(key: K, value: RobotsFormValues[K]) => void;
  output: string | null;
  reset: () => void;
}

/** Drives the Robots.txt Generator: live-recalculates as any field changes, no server round trip. */
export function useRobotsTxtGenerator(): UseRobotsTxtGeneratorResult {
  const [values, setValues] = React.useState<RobotsFormValues>(DEFAULT_VALUES);

  const setField = React.useCallback(
    <K extends keyof RobotsFormValues>(key: K, value: RobotsFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = React.useCallback(() => setValues(DEFAULT_VALUES), []);

  const output = React.useMemo(() => buildRobotsTxt(values), [values]);

  return { values, setField, output, reset };
}
