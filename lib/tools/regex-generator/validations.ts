import { z } from "zod";
import { MAX_DESCRIPTION_LENGTH, MIN_DESCRIPTION_LENGTH } from "./constants";

export const regexGeneratorFormSchema = z.object({
  description: z
    .string()
    .trim()
    .min(MIN_DESCRIPTION_LENGTH, `Tell us a bit more — at least ${MIN_DESCRIPTION_LENGTH} characters.`)
    .max(MAX_DESCRIPTION_LENGTH, `Keep it under ${MAX_DESCRIPTION_LENGTH} characters.`),
});

export type RegexGeneratorFormSchema = z.infer<typeof regexGeneratorFormSchema>;
