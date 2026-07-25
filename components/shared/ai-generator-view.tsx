"use client";

import * as React from "react";
import { Check, Copy, Download, Eraser, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { buildGeneratorExportText, type GeneratorConfig } from "@/lib/generator-config";
import { downloadTextFile } from "@/lib/file-export";
import { copyToClipboard } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

interface AiGeneratorViewProps {
  config: GeneratorConfig;
  maxTopicLength: number;
  /** Used to build the exported .txt filename and GA event labels, e.g. "youtube-title-generator". */
  toolSlug: string;
  topic: string;
  setTopic: (value: string) => void;
  outputs: string[] | null;
  isGenerating: boolean;
  errorMessage: string | null;
  onGenerate: () => void;
  onRegenerate: () => void;
  onClear: () => void;
}

/**
 * The shared UI for every AI text-generator tool across every platform
 * (YouTube, Instagram, and any future one) — one implementation. Each
 * platform's own thin template component (e.g. `YoutubeGeneratorTemplate`,
 * `InstagramGeneratorTemplate`) owns its own state hook and just renders
 * this with the resulting values as props.
 */
export function AiGeneratorView({
  config,
  maxTopicLength,
  toolSlug,
  topic,
  setTopic,
  outputs,
  isGenerating,
  errorMessage,
  onGenerate,
  onRegenerate,
  onClear,
}: AiGeneratorViewProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("generate_click", { tool: toolSlug });
    onGenerate();
  }

  function handleRegenerateClick() {
    trackEvent("regenerate_click", { tool: toolSlug });
    onRegenerate();
  }

  async function handleCopyOne(index: number, value: string) {
    const success = await copyToClipboard(value);
    if (success) {
      trackEvent("copy_click", { tool: toolSlug, option: index + 1 });
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((current) => (current === index ? null : current)), 2000);
    }
  }

  function handleExportTxt() {
    if (!outputs) return;
    trackEvent("export_click", { tool: toolSlug });
    const content = buildGeneratorExportText(config, topic, outputs);
    const filename = `${toolSlug}-${new Date().toISOString().slice(0, 10)}.txt`;
    downloadTextFile(filename, content);
  }

  const shareText = outputs ? buildGeneratorExportText(config, topic, outputs) : "";

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7"
        noValidate
      >
        <div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="topic">{config.inputLabel}</Label>
            <span className="font-mono text-[11px] text-muted-foreground" aria-live="polite">
              {topic.length}/{maxTopicLength}
            </span>
          </div>
          <Textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={config.placeholder}
            maxLength={maxTopicLength}
            rows={3}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? "topic-error" : "topic-helper"}
            className="mt-2"
          />
          <p id="topic-helper" className="mt-1.5 text-xs text-muted-foreground">
            {config.helperText}
          </p>
          {errorMessage && (
            <p id="topic-error" role="alert" className="mt-1.5 text-xs text-destructive">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={onClear} disabled={isGenerating} className="sm:flex-none">
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
          <Button type="submit" disabled={isGenerating} className="flex-1">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate {config.outputNoun}s
              </>
            )}
          </Button>
        </div>
      </form>

      {outputs && outputs.length > 0 && (
        <div className="flex flex-col gap-4 animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-foreground">
              {outputs.length} option{outputs.length === 1 ? "" : "s"}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRegenerateClick}
                disabled={isGenerating}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleExportTxt}>
                <Download className="h-3.5 w-3.5" />
                Export TXT
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {outputs.map((output, index) => (
              <div key={index} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-brass">
                    Option {index + 1}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleCopyOne(index, output)}
                  >
                    {copiedIndex === index ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copiedIndex === index ? "Copied" : "Copy"}
                  </Button>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">
                  {output}
                </p>
              </div>
            ))}
          </div>

          <ShareActions title={`${config.outputNoun} results`} text={shareText} />

          <AdSlot label="Advertisement" />
        </div>
      )}

      {!outputs && !isGenerating && <AdSlot label="Advertisement" />}
    </div>
  );
}
