"use client";

import * as React from "react";
import { toast } from "sonner";
import { youtubeGeneratorFormSchema } from "@/lib/tools/youtube-generator/validations";
import type { YoutubeGeneratorType, GenerateYoutubeContentResponse } from "@/lib/tools/youtube-generator/types";

interface UseYoutubeGeneratorResult {
  topic: string;
  setTopic: (value: string) => void;
  outputs: string[] | null;
  isGenerating: boolean;
  errorMessage: string | null;
  generate: () => Promise<void>;
  regenerate: () => Promise<void>;
  clear: () => void;
}

/**
 * Drives every YouTube AI-generator tool. Shared by all eight (tag,
 * title, description, hashtag, channel name, video idea, script,
 * keyword) — the only thing that differs between them is the `type`
 * passed in, which selects the right prompt on the server.
 */
export function useYoutubeGenerator(type: YoutubeGeneratorType): UseYoutubeGeneratorResult {
  const [topic, setTopic] = React.useState("");
  const [outputs, setOutputs] = React.useState<string[] | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const runGeneration = React.useCallback(
    async (currentTopic: string) => {
      const parsed = youtubeGeneratorFormSchema.safeParse({ topic: currentTopic });
      if (!parsed.success) {
        const message = parsed.error.issues[0]?.message ?? "Please check your input and try again.";
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      setErrorMessage(null);
      setIsGenerating(true);
      try {
        const response = await fetch("/api/tools/youtube-generator/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, topic: parsed.data.topic }),
        });

        const data = (await response.json()) as GenerateYoutubeContentResponse;

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
