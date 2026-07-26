"use client";

import * as React from "react";
import { toast } from "sonner";
import { writingGeneratorFormSchema } from "@/lib/tools/writing-generator/validations";
import type { WritingGeneratorType, GenerateWritingContentResponse } from "@/lib/tools/writing-generator/types";

interface UseWritingGeneratorResult {
  topic: string;
  setTopic: (value: string) => void;
  outputs: string[] | null;
  isGenerating: boolean;
  errorMessage: string | null;
  generate: () => Promise<void>;
  regenerate: () => Promise<void>;
  clear: () => void;
}

/** Drives the Resume Builder / SEO Meta Tag generators. Mirrors every other platform's generator hook exactly. */
export function useWritingGenerator(type: WritingGeneratorType): UseWritingGeneratorResult {
  const [topic, setTopic] = React.useState("");
  const [outputs, setOutputs] = React.useState<string[] | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const runGeneration = React.useCallback(
    async (currentTopic: string) => {
      const parsed = writingGeneratorFormSchema.safeParse({ topic: currentTopic });
      if (!parsed.success) {
        const message = parsed.error.issues[0]?.message ?? "Please check your input and try again.";
        setErrorMessage(message);
        toast.error(message);
        return;
      }
      setErrorMessage(null);
      setIsGenerating(true);
      try {
        const response = await fetch("/api/tools/writing-generator/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, topic: parsed.data.topic }),
        });
        const data = (await response.json()) as GenerateWritingContentResponse;
        if (!data.success) {
          setErrorMessage(data.error);
          toast.error(data.error);
          return;
        }
        setOutputs(data.outputs);
        toast.success("Generated successfully.");
      } catch {
        const message = "Couldn't reach the server. Check your connection and try again.";
        setErrorMessage(message);
        toast.error(message);
      } finally {
        setIsGenerating(false);
      }
    },
    [type]
  );

  const generate = React.useCallback(() => runGeneration(topic), [runGeneration, topic]);
  const regenerate = React.useCallback(() => runGeneration(topic), [runGeneration, topic]);
  const clear = React.useCallback(() => {
    setTopic("");
    setOutputs(null);
    setErrorMessage(null);
  }, []);

  return { topic, setTopic, outputs, isGenerating, errorMessage, generate, regenerate, clear };
}
