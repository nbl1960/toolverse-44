"use client";

import * as React from "react";
import { toast } from "sonner";
import { optimizeProfileFormSchema } from "@/lib/tools/linkedin-profile-optimizer/validations";
import type {
  OptimizeProfileResponse,
  ProfileOptimizationResult,
} from "@/lib/tools/linkedin-profile-optimizer/types";

interface UseLinkedinProfileOptimizerResult {
  text: string;
  setText: (value: string) => void;
  result: ProfileOptimizationResult | null;
  isOptimizing: boolean;
  errorMessage: string | null;
  optimize: () => Promise<void>;
  clear: () => void;
}

export function useLinkedinProfileOptimizer(): UseLinkedinProfileOptimizerResult {
  const [text, setText] = React.useState("");
  const [result, setResult] = React.useState<ProfileOptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const optimize = React.useCallback(async () => {
    const parsed = optimizeProfileFormSchema.safeParse({ text });
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Please check your input and try again.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    setErrorMessage(null);
    setIsOptimizing(true);
    try {
      const response = await fetch("/api/tools/linkedin-profile-optimizer/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: parsed.data.text }),
      });

      const data = (await response.json()) as OptimizeProfileResponse;

      if (!data.success) {
        setErrorMessage(data.error);
        toast.error(data.error);
        return;
      }

      setResult(data.result);
      toast.success("Optimized successfully.");
    } catch {
      const message = "Couldn't reach the server. Check your connection and try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsOptimizing(false);
    }
  }, [text]);

  const clear = React.useCallback(() => {
    setText("");
    setResult(null);
    setErrorMessage(null);
  }, []);

  return { text, setText, result, isOptimizing, errorMessage, optimize, clear };
}
