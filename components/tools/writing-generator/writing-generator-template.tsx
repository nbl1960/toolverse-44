"use client";

import { AiGeneratorView } from "@/components/shared/ai-generator-view";
import { useWritingGenerator } from "@/hooks/tools/writing-generator/use-writing-generator";
import { WRITING_GENERATOR_CONFIG, MAX_TOPIC_LENGTH } from "@/lib/tools/writing-generator/constants";
import type { WritingGeneratorType } from "@/lib/tools/writing-generator/types";

interface WritingGeneratorTemplateProps {
  type: WritingGeneratorType;
}

/** Thin wrapper around the shared `<AiGeneratorView>` — mirrors every other platform's generator template. */
export function WritingGeneratorTemplate({ type }: WritingGeneratorTemplateProps) {
  const config = WRITING_GENERATOR_CONFIG[type];
  const { topic, setTopic, outputs, isGenerating, errorMessage, generate, regenerate, clear } =
    useWritingGenerator(type);

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
