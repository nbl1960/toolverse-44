"use client";

import { AiGeneratorView } from "@/components/shared/ai-generator-view";
import { useYoutubeGenerator } from "@/hooks/tools/youtube-generator/use-youtube-generator";
import { YOUTUBE_GENERATOR_CONFIG, MAX_TOPIC_LENGTH } from "@/lib/tools/youtube-generator/constants";
import type { YoutubeGeneratorType } from "@/lib/tools/youtube-generator/types";

interface YoutubeGeneratorTemplateProps {
  type: YoutubeGeneratorType;
}

/**
 * Thin wrapper around the shared `<AiGeneratorView>`: owns the YouTube-
 * specific state hook and config lookup, renders the actual UI from the
 * one shared implementation used by every AI-generator tool on the
 * platform (YouTube and Instagram alike).
 */
export function YoutubeGeneratorTemplate({ type }: YoutubeGeneratorTemplateProps) {
  const config = YOUTUBE_GENERATOR_CONFIG[type];
  const { topic, setTopic, outputs, isGenerating, errorMessage, generate, regenerate, clear } =
    useYoutubeGenerator(type);

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
