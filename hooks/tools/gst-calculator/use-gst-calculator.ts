"use client";

import * as React from "react";
import { calculateGst } from "@/lib/tools/gst-calculator/calculations";
import { gstFormSchema } from "@/lib/tools/gst-calculator/validations";
import { DEFAULT_AMOUNT, DEFAULT_MODE, DEFAULT_RATE } from "@/lib/tools/gst-calculator/constants";
import type { GstCalculationResult, GstFormValues, GstMode } from "@/lib/tools/gst-calculator/types";

const DEFAULT_VALUES: GstFormValues = { amount: DEFAULT_AMOUNT, rate: DEFAULT_RATE, mode: DEFAULT_MODE };

interface UseGstCalculatorResult {
  values: GstFormValues;
  setField: <K extends keyof GstFormValues>(key: K, value: GstFormValues[K]) => void;
  result: GstCalculationResult | null;
  errorMessage: string | null;
  reset: () => void;
}

/** Drives the GST Calculator: live-updating as inputs change, same pattern as the other finance calculators. */
export function useGstCalculator(): UseGstCalculatorResult {
  const [values, setValues] = React.useState<GstFormValues>(DEFAULT_VALUES);

  const setField = React.useCallback(
    <K extends keyof GstFormValues>(key: K, value: GstFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = React.useCallback(() => setValues(DEFAULT_VALUES), []);

  const { result, errorMessage } = React.useMemo(() => {
    const parsed = gstFormSchema.safeParse(values);
    if (!parsed.success) {
      return { result: null, errorMessage: parsed.error.issues[0]?.message ?? "Enter valid values." };
    }
    return { result: calculateGst(parsed.data), errorMessage: null };
  }, [values]);

  return { values, setField, result, errorMessage, reset };
}

export type { GstMode };
