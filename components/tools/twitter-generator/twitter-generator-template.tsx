"use client";

import { AiGeneratorView } from "@/components/shared/ai-generator-view";
import { useTwitterGenerator } from "@/hooks/tools/twitter-generator/use-twitter-generator";
import { TWITTER_GENERATOR_CONFIG, MAX_TOPIC_LENGTH } from "@/lib/tools/twitter-generator/constants";
import type { TwitterGeneratorType } from "@/lib/tools/twitter-generator/types";

interface TwitterGeneratorTemplateProps {
  type: TwitterGeneratorType;
}

/** Thin wrapper around the shared `<AiGeneratorView>` — mirrors the YouTube/Instagram/LinkedIn generator templates exactly. */
export function TwitterGeneratorTemplate({ type }: TwitterGeneratorTemplateProps) {
  const config = TWITTER_GENERATOR_CONFIG[type];
  const { topic, setTopic, outputs, isGenerating, errorMessage, generate, regenerate, clear } =
    useTwitterGenerator(type);

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
