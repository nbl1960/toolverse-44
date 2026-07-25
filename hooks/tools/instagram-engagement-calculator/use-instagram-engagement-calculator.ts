"use client";

import * as React from "react";
import { calculateEngagement } from "@/lib/tools/instagram-engagement-calculator/calculations";
import { engagementFormSchema } from "@/lib/tools/instagram-engagement-calculator/validations";
import {
  DEFAULT_COMMENTS,
  DEFAULT_FOLLOWERS,
  DEFAULT_LIKES,
  DEFAULT_SAVES,
  DEFAULT_SHARES,
} from "@/lib/tools/instagram-engagement-calculator/constants";
import type {
  EngagementCalculationResult,
  EngagementFormValues,
} from "@/lib/tools/instagram-engagement-calculator/types";

const DEFAULT_VALUES: EngagementFormValues = {
  followers: DEFAULT_FOLLOWERS,
  likes: DEFAULT_LIKES,
  comments: DEFAULT_COMMENTS,
  shares: DEFAULT_SHARES,
  saves: DEFAULT_SAVES,
};

interface UseInstagramEngagementCalculatorResult {
  values: EngagementFormValues;
  setField: <K extends keyof EngagementFormValues>(key: K, value: EngagementFormValues[K]) => void;
  result: EngagementCalculationResult | null;
  errorMessage: string | null;
  reset: () => void;
}

/** Drives the Engagement Calculator: live-updating as inputs change, same pattern as the finance calculators. */
export function useInstagramEngagementCalculator(): UseInstagramEngagementCalculatorResult {
  const [values, setValues] = React.useState<EngagementFormValues>(DEFAULT_VALUES);

  const setField = React.useCallback(
    <K extends keyof EngagementFormValues>(key: K, value: EngagementFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = React.useCallback(() => setValues(DEFAULT_VALUES), []);

  const { result, errorMessage } = React.useMemo(() => {
    const parsed = engagementFormSchema.safeParse(values);
    if (!parsed.success) {
      return {
        result: null,
        errorMessage: parsed.error.issues[0]?.message ?? "Enter valid values.",
      };
    }
    return { result: calculateEngagement(parsed.data), errorMessage: null };
  }, [values]);

  return { values, setField, result, errorMessage, reset };
}
