"use client";

import * as React from "react";
import { toast } from "sonner";
import { addPromptHistoryEntry } from "@/lib/prompt-history";
import { trackEvent } from "@/lib/analytics";
import type { TargetModelId, TransformResponse } from "@/lib/prompt-studio/types";

interface UsePromptEngineResult {
  request: string;
  setRequest: (value: string) => void;
  targetModel: TargetModelId;
  setTargetModel: (value: TargetModelId) => void;
  structuredPrompt: string | null;
  isGenerating: boolean;
  errorMessage: string | null;
  generate: () => Promise<void>;
  reset: () => void;
}

/** Drives the Smart Prompt Engine: sends a rough request + target model, records a successful result to Prompt History. */
export function usePromptEngine(): UsePromptEngineResult {
  const [request, setRequest] = React.useState("");
  const [targetModel, setTargetModel] = React.useState<TargetModelId>("chatgpt");
  const [structuredPrompt, setStructuredPrompt] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const generate = React.useCallback(async () => {
    const trimmed = request.trim();
    if (trimmed.length < 4) {
      setErrorMessage("Describe what you want in a bit more detail.");
      return;
    }
    setErrorMessage(null);
    setIsGenerating(true);
    try {
      const response = await fetch("/api/prompt-studio/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: trimmed, targetModel }),
      });
      const data = (await response.json()) as TransformResponse;

      if (!data.success) {
        setErrorMessage(data.error);
        toast.error(data.error);
        return;
      }

      setStructuredPrompt(data.structuredPrompt);
      addPromptHistoryEntry(trimmed, data.structuredPrompt, targetModel);
      trackEvent("prompt_engine_generate", { target_model: targetModel });
    } catch {
      const message = "Couldn't reach the Prompt Engine. Check your connection and try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  }, [request, targetModel]);

  const reset = React.useCallback(() => {
    setRequest("");
    setStructuredPrompt(null);
    setErrorMessage(null);
  }, []);

  return { request, setRequest, targetModel, setTargetModel, structuredPrompt, isGenerating, errorMessage, generate, reset };
}
