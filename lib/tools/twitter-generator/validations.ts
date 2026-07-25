import { z } from "zod";
import { MAX_TOPIC_LENGTH, MIN_TOPIC_LENGTH } from "./constants";

export const twitterGeneratorFormSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(MIN_TOPIC_LENGTH, `Tell us a bit more — at least ${MIN_TOPIC_LENGTH} characters.`)
    .max(MAX_TOPIC_LENGTH, `Keep it under ${MAX_TOPIC_LENGTH} characters.`),
});

export type TwitterGeneratorFormSchema = z.infer<typeof twitterGeneratorFormSchema>;
