"use client";

import * as React from "react";
import { checkProfileSeo } from "@/lib/tools/linkedin-profile-seo-checker/calculations";
import type { ProfileSeoFormValues, ProfileSeoResult } from "@/lib/tools/linkedin-profile-seo-checker/types";

const DEFAULT_VALUES: ProfileSeoFormValues = {
  headline: "",
  about: "",
  skills: "",
  targetKeywords: "",
};

interface UseLinkedinProfileSeoCheckerResult {
  values: ProfileSeoFormValues;
  setField: <K extends keyof ProfileSeoFormValues>(key: K, value: ProfileSeoFormValues[K]) => void;
  result: ProfileSeoResult | null;
  reset: () => void;
}

/** Drives the Profile SEO Checker: live-recalculates as any field changes, no server round trip. */
export function useLinkedinProfileSeoChecker(): UseLinkedinProfileSeoCheckerResult {
  const [values, setValues] = React.useState<ProfileSeoFormValues>(DEFAULT_VALUES);

  const setField = React.useCallback(
    <K extends keyof ProfileSeoFormValues>(key: K, value: ProfileSeoFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = React.useCallback(() => setValues(DEFAULT_VALUES), []);

  const hasAnyInput = Object.values(values).some((value) => value.trim().length > 0);
  const result = React.useMemo(
    () => (hasAnyInput ? checkProfileSeo(values) : null),
    [hasAnyInput, values]
  );

  return { values, setField, result, reset };
}
