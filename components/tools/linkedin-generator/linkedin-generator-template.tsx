"use client";

import { AiGeneratorView } from "@/components/shared/ai-generator-view";
import { useLinkedinGenerator } from "@/hooks/tools/linkedin-generator/use-linkedin-generator";
import { LINKEDIN_GENERATOR_CONFIG, MAX_TOPIC_LENGTH } from "@/lib/tools/linkedin-generator/constants";
import type { LinkedinGeneratorType } from "@/lib/tools/linkedin-generator/types";

interface LinkedinGeneratorTemplateProps {
  type: LinkedinGeneratorType;
}

/**
 * Thin wrapper around the shared `<AiGeneratorView>` — mirrors
 * `YoutubeGeneratorTemplate` / `InstagramGeneratorTemplate` exactly.
 * Owns the LinkedIn-specific state hook and config lookup; the actual UI
 * is the one shared implementation used by every AI-generator tool on
 * the platform.
 */
export function LinkedinGeneratorTemplate({ type }: LinkedinGeneratorTemplateProps) {
  const config = LINKEDIN_GENERATOR_CONFIG[type];
  const { topic, setTopic, outputs, isGenerating, errorMessage, generate, regenerate, clear } =
    useLinkedinGenerator(type);

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
