"use client";

import * as React from "react";
import { generatePassword } from "@/lib/tools/password-generator/calculations";
import { DEFAULT_LENGTH } from "@/lib/tools/password-generator/constants";
import type { PasswordOptions, PasswordResult } from "@/lib/tools/password-generator/types";

const DEFAULT_OPTIONS: PasswordOptions = {
  length: DEFAULT_LENGTH,
  useUppercase: true,
  useLowercase: true,
  useNumbers: true,
  useSymbols: true,
};

interface UsePasswordGeneratorResult {
  options: PasswordOptions;
  setOption: <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => void;
  result: PasswordResult | null;
  regenerate: () => void;
}

/** Drives the Password Generator: generates a fresh password on mount and whenever options change or regenerate() is called. */
export function usePasswordGenerator(): UsePasswordGeneratorResult {
  const [options, setOptions] = React.useState<PasswordOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = React.useState<PasswordResult | null>(() => generatePassword(DEFAULT_OPTIONS));

  const setOption = React.useCallback(
    <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const regenerate = React.useCallback(() => {
    setResult(generatePassword(options));
  }, [options]);

  // Regenerate automatically whenever the options change, so the
  // displayed password always matches the current settings.
  React.useEffect(() => {
    setResult(generatePassword(options));
  }, [options]);

  return { options, setOption, result, regenerate };
}
