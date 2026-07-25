"use client";

import { AiGeneratorView } from "@/components/shared/ai-generator-view";
import { useInstagramGenerator } from "@/hooks/tools/instagram-generator/use-instagram-generator";
import { INSTAGRAM_GENERATOR_CONFIG, MAX_TOPIC_LENGTH } from "@/lib/tools/instagram-generator/constants";
import type { InstagramGeneratorType } from "@/lib/tools/instagram-generator/types";

interface InstagramGeneratorTemplateProps {
  type: InstagramGeneratorType;
}

/**
 * Thin wrapper around the shared `<AiGeneratorView>` — mirrors
 * `YoutubeGeneratorTemplate` exactly. Owns the Instagram-specific state
 * hook and config lookup; the actual UI is the one shared implementation.
 */
export function InstagramGeneratorTemplate({ type }: InstagramGeneratorTemplateProps) {
  const config = INSTAGRAM_GENERATOR_CONFIG[type];
  const { topic, setTopic, outputs, isGenerating, errorMessage, generate, regenerate, clear } =
    useInstagramGenerator(type);

  return (
    <AiGeneratorView
      config={config}
      maxTopicLength={MAX_TOPIC_LENGTH}
      toolSlug={type}
      topic={topic}
      setTopic={setTopic}
      outputs={outputs}
      isGenerating={isGenerating}
      errorMessage={errorMessage}
      onGenerate={() => void generate()}
      onRegenerate={() => void regenerate()}
      onClear={clear}
    />
  );
}
