"use client";

import * as React from "react";
import { toast } from "sonner";
import type { CopilotPlanResponse, CopilotStep } from "@/lib/copilot/types";

interface UseCopilotResult {
  goal: string;
  setGoal: (value: string) => void;
  summary: string | null;
  steps: CopilotStep[] | null;
  isPlanning: boolean;
  errorMessage: string | null;
  plan: () => Promise<void>;
  reset: () => void;
}

/** Drives the ToolVerse Copilot: sends a goal, gets back a registry-verified, ordered multi-tool plan. */
export function useCopilot(): UseCopilotResult {
  const [goal, setGoal] = React.useState("");
  const [summary, setSummary] = React.useState<string | null>(null);
  const [steps, setSteps] = React.useState<CopilotStep[] | null>(null);
  const [isPlanning, setIsPlanning] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const plan = React.useCallback(async () => {
    const trimmed = goal.trim();
    if (trimmed.length < 6) {
      setErrorMessage("Tell us a bit more about what you're trying to accomplish.");
      return;
    }
    setErrorMessage(null);
    setIsPlanning(true);
    try {
      const response = await fetch("/api/copilot/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: trimmed }),
      });
      const data = (await response.json()) as CopilotPlanResponse;

      if (!data.success) {
        setErrorMessage(data.error);
        toast.error(data.error);
        return;
      }

      setSummary(data.summary);
      setSteps(data.steps);
    } catch {
      const message = "Couldn't reach the Copilot. Check your connection and try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsPlanning(false);
    }
  }, [goal]);

  const reset = React.useCallback(() => {
    setGoal("");
    setSummary(null);
    setSteps(null);
    setErrorMessage(null);
  }, []);

  return { goal, setGoal, summary, steps, isPlanning, errorMessage, plan, reset };
}
