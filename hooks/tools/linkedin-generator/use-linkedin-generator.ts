"use client";

import * as React from "react";
import { toast } from "sonner";
import { linkedinGeneratorFormSchema } from "@/lib/tools/linkedin-generator/validations";
import type {
  LinkedinGeneratorType,
  GenerateLinkedinContentResponse,
} from "@/lib/tools/linkedin-generator/types";

interface UseLinkedinGeneratorResult {
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
 * Drives every LinkedIn AI-generator tool. Mirrors `useYoutubeGenerator`
 * and `useInstagramGenerator` exactly — kept as its own hook (rather than
 * a further-generalized shared one) because each platform's API route is
 * a physically separate URL in the App Router.
 */
export function useLinkedinGenerator(type: LinkedinGeneratorType): UseLinkedinGeneratorResult {
  const [topic, setTopic] = React.useState("");
  const [outputs, setOutputs] = React.useState<string[] | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const runGeneration = React.useCallback(
    async (currentTopic: string) => {
      const parsed = linkedinGeneratorFormSchema.safeParse({ topic: currentTopic });
      if (!parsed.success) {
        const message = parsed.error.issues[0]?.message ?? "Please check your input and try again.";
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      setErrorMessage(null);
      setIsGenerating(true);
      try {
        const response = await fetch("/api/tools/linkedin-generator/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, topic: parsed.data.topic }),
        });

        const data = (await response.json()) as GenerateLinkedinContentResponse;

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
