"use client";

import * as React from "react";
import { toast } from "sonner";
import { summarizeNotesFormSchema } from "@/lib/tools/meeting-notes-summarizer/validations";
import type { MeetingSummaryResult, SummarizeNotesResponse } from "@/lib/tools/meeting-notes-summarizer/types";

interface UseMeetingNotesSummarizerResult {
  notes: string;
  setNotes: (value: string) => void;
  result: MeetingSummaryResult | null;
  isSummarizing: boolean;
  errorMessage: string | null;
  summarize: () => Promise<void>;
  clear: () => void;
}

export function useMeetingNotesSummarizer(): UseMeetingNotesSummarizerResult {
  const [notes, setNotes] = React.useState("");
  const [result, setResult] = React.useState<MeetingSummaryResult | null>(null);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const summarize = React.useCallback(async () => {
    const parsed = summarizeNotesFormSchema.safeParse({ notes });
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Please check your input and try again.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }
    setErrorMessage(null);
    setIsSummarizing(true);
    try {
      const response = await fetch("/api/tools/meeting-notes-summarizer/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: parsed.data.notes }),
      });
      const data = (await response.json()) as SummarizeNotesResponse;
      if (!data.success) {
        setErrorMessage(data.error);
        toast.error(data.error);
        return;
      }
      setResult(data.result);
      toast.success("Summarized successfully.");
    } catch {
      const message = "Couldn't reach the server. Check your connection and try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSummarizing(false);
    }
  }, [notes]);

  const clear = React.useCallback(() => {
    setNotes("");
    setResult(null);
    setErrorMessage(null);
  }, []);

  return { notes, setNotes, result, isSummarizing, errorMessage, summarize, clear };
}
