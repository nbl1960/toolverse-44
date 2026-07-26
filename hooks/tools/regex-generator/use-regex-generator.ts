"use client";

import * as React from "react";
import { toast } from "sonner";
import { regexGeneratorFormSchema } from "@/lib/tools/regex-generator/validations";
import type { GenerateRegexResponse, RegexResult } from "@/lib/tools/regex-generator/types";

interface UseRegexGeneratorResult {
  description: string;
  setDescription: (value: string) => void;
  result: RegexResult | null;
  isGenerating: boolean;
  errorMessage: string | null;
  generate: () => Promise<void>;
  clear: () => void;
}

export function useRegexGenerator(): UseRegexGeneratorResult {
  const [description, setDescription] = React.useState("");
  const [result, setResult] = React.useState<RegexResult | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const generate = React.useCallback(async () => {
    const parsed = regexGeneratorFormSchema.safeParse({ description });
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Please check your input and try again.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }
    setErrorMessage(null);
    setIsGenerating(true);
    try {
      const response = await fetch("/api/tools/regex-generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: parsed.data.description }),
      });
      const data = (await response.json()) as GenerateRegexResponse;
      if (!data.success) {
        setErrorMessage(data.error);
        toast.error(data.error);
        return;
      }
      setResult(data.result);
      toast.success("Generated successfully.");
    } catch {
      const message = "Couldn't reach the server. Check your connection and try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  }, [description]);

  const clear = React.useCallback(() => {
    setDescription("");
    setResult(null);
    setErrorMessage(null);
  }, []);

  return { description, setDescription, result, isGenerating, errorMessage, generate, clear };
}
