import { z } from "zod";
import { MAX_TEXT_LENGTH, MIN_TEXT_LENGTH } from "./constants";

export const optimizeProfileFormSchema = z.object({
  text: z
    .string()
    .trim()
    .min(MIN_TEXT_LENGTH, `Paste at least ${MIN_TEXT_LENGTH} characters — a full headline or About section.`)
    .max(MAX_TEXT_LENGTH, `Keep it under ${MAX_TEXT_LENGTH} characters (LinkedIn's own About section limit).`),
});

export type OptimizeProfileFormSchema = z.infer<typeof optimizeProfileFormSchema>;
