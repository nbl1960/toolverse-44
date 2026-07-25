"use client";

import { AiGeneratorView } from "@/components/shared/ai-generator-view";
import { useSeoGenerator } from "@/hooks/tools/seo-generator/use-seo-generator";
import { SEO_GENERATOR_CONFIG, MAX_TOPIC_LENGTH } from "@/lib/tools/seo-generator/constants";
import type { SeoGeneratorType } from "@/lib/tools/seo-generator/types";

interface SeoGeneratorTemplateProps {
  type: SeoGeneratorType;
}

/** Thin wrapper around the shared `<AiGeneratorView>` — mirrors every other platform's generator template. */
export function SeoGeneratorTemplate({ type }: SeoGeneratorTemplateProps) {
  const config = SEO_GENERATOR_CONFIG[type];
  const { topic, setTopic, outputs, isGenerating, errorMessage, generate, regenerate, clear } =
    useSeoGenerator(type);

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
