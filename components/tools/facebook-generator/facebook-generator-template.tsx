"use client";

import { AiGeneratorView } from "@/components/shared/ai-generator-view";
import { useFacebookGenerator } from "@/hooks/tools/facebook-generator/use-facebook-generator";
import { FACEBOOK_GENERATOR_CONFIG, MAX_TOPIC_LENGTH } from "@/lib/tools/facebook-generator/constants";
import type { FacebookGeneratorType } from "@/lib/tools/facebook-generator/types";

interface FacebookGeneratorTemplateProps {
  type: FacebookGeneratorType;
}

/** Thin wrapper around the shared `<AiGeneratorView>` — mirrors the YouTube/Instagram/LinkedIn/Twitter generator templates exactly. */
export function FacebookGeneratorTemplate({ type }: FacebookGeneratorTemplateProps) {
  const config = FACEBOOK_GENERATOR_CONFIG[type];
  const { topic, setTopic, outputs, isGenerating, errorMessage, generate, regenerate, clear } =
    useFacebookGenerator(type);

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
