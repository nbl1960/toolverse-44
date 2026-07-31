"use client";

import * as React from "react";
import { toast } from "sonner";

interface SuggestToolValues {
  toolName: string;
  description: string;
  email: string;
}

interface UseSuggestToolResult {
  values: SuggestToolValues;
  setField: <K extends keyof SuggestToolValues>(key: K, value: string) => void;
  isSubmitting: boolean;
  submit: () => Promise<void>;
}

/** Same honest pattern as Contact and Newsletter — only confirms success if the server actually delivered it somewhere real. */
export function useSuggestTool(): UseSuggestToolResult {
  const [values, setValues] = React.useState<SuggestToolValues>({ toolName: "", description: "", email: "" });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const setField = React.useCallback(<K extends keyof SuggestToolValues>(key: K, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const submit = React.useCallback(async () => {
    if (!values.toolName.trim() || values.description.trim().length < 10) {
      toast.error("Add a tool name and describe what it would do.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/tool-suggestions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { success: boolean; delivered: boolean; error?: string };

      if (!data.success) {
        toast.error(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (data.delivered) {
        toast.success("Thanks! We've received your suggestion.");
      } else {
        toast.success("Suggestion logged — thanks for the idea!");
      }
      setValues({ toolName: "", description: "", email: "" });
    } catch {
      toast.error("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [values]);

  return { values, setField, isSubmitting, submit };
}
