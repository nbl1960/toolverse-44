"use client";

import * as React from "react";
import { toast } from "sonner";
import type {
  AssistantRecommendation,
  AssistantRelatedTool,
  AssistantSearchResponse,
} from "@/lib/ai-assistant/types";

interface UseAiAssistantResult {
  query: string;
  setQuery: (value: string) => void;
  recommendations: AssistantRecommendation[] | null;
  fallbackSuggestions: AssistantRelatedTool[] | null;
  /** True when a search completed but the best result didn't clear the confidence bar — distinct from "zero recommendations returned for another reason," though both currently render the same fallback UI. */
  belowConfidenceThreshold: boolean;
  isSearching: boolean;
  errorMessage: string | null;
  search: () => Promise<void>;
  clear: () => void;
}

/** Drives the homepage AI Tool Assistant: sends the query, gets back only registry-verified recommendations. */
export function useAiAssistant(): UseAiAssistantResult {
  const [query, setQuery] = React.useState("");
  const [recommendations, setRecommendations] = React.useState<AssistantRecommendation[] | null>(null);
  const [fallbackSuggestions, setFallbackSuggestions] = React.useState<AssistantRelatedTool[] | null>(null);
  const [belowConfidenceThreshold, setBelowConfidenceThreshold] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const search = React.useCallback(async () => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setErrorMessage("Tell us a bit more about what you're trying to do.");
      return;
    }

    setErrorMessage(null);
    setIsSearching(true);
    try {
      const response = await fetch("/api/assistant/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = (await response.json()) as AssistantSearchResponse;

      if (!data.success) {
        setErrorMessage(data.error);
        toast.error(data.error);
        return;
      }

      setRecommendations(data.recommendations);
      setFallbackSuggestions(data.fallbackSuggestions ?? null);
      setBelowConfidenceThreshold(data.belowConfidenceThreshold ?? false);
    } catch {
      const message = "Couldn't reach the assistant. Check your connection and try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const clear = React.useCallback(() => {
    setQuery("");
    setRecommendations(null);
    setFallbackSuggestions(null);
    setBelowConfidenceThreshold(false);
    setErrorMessage(null);
  }, []);

  return {
    query,
    setQuery,
    recommendations,
    fallbackSuggestions,
    belowConfidenceThreshold,
    isSearching,
    errorMessage,
    search,
    clear,
  };
}
