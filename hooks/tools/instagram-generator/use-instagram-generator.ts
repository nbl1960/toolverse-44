"use client";

import * as React from "react";
import { toast } from "sonner";
import { instagramGeneratorFormSchema } from "@/lib/tools/instagram-generator/validations";
import type {
  InstagramGeneratorType,
  GenerateInstagramContentResponse,
} from "@/lib/tools/instagram-generator/types";

interface UseInstagramGeneratorResult {
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
 * Drives every Instagram AI-generator tool. Shared by all eight (caption,
 * hashtag, bio, username, Reel caption, post idea, Story caption, quote)
 * — the only thing that differs between them is the `type` passed in,
 * which selects the right prompt on the server. Mirrors
 * `useYoutubeGenerator` exactly; kept as its own hook (rather than a
 * further-generalized shared one) because each platform's API route is a
 * physically separate URL in the App Router.
 */
export function useInstagramGenerator(type: InstagramGeneratorType): UseInstagramGeneratorResult {
  const [topic, setTopic] = React.useState("");
  const [outputs, setOutputs] = React.useState<string[] | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const runGeneration = React.useCallback(
    async (currentTopic: string) => {
      const parsed = instagramGeneratorFormSchema.safeParse({ topic: currentTopic });
      if (!parsed.success) {
        const message = parsed.error.issues[0]?.message ?? "Please check your input and try again.";
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      setErrorMessage(null);
      setIsGenerating(true);
      try {
        const response = await fetch("/api/tools/instagram-generator/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, topic: parsed.data.topic }),
        });

        const data = (await response.json()) as GenerateInstagramContentResponse;

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
