import { z } from "zod";
import { MAX_NOTES_LENGTH, MIN_NOTES_LENGTH } from "./constants";

export const summarizeNotesFormSchema = z.object({
  notes: z
    .string()
    .trim()
    .min(MIN_NOTES_LENGTH, `Paste a bit more — at least ${MIN_NOTES_LENGTH} characters.`)
    .max(MAX_NOTES_LENGTH, `Keep it under ${MAX_NOTES_LENGTH.toLocaleString()} characters.`),
});

export type SummarizeNotesFormSchema = z.infer<typeof summarizeNotesFormSchema>;
