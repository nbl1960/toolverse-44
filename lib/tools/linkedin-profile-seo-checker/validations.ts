import { z } from "zod";
import { MAX_FIELD_LENGTH } from "./constants";

export const profileSeoFormSchema = z.object({
  headline: z.string().trim().max(MAX_FIELD_LENGTH),
  about: z.string().trim().max(MAX_FIELD_LENGTH),
  skills: z.string().trim().max(MAX_FIELD_LENGTH),
  targetKeywords: z.string().trim().max(MAX_FIELD_LENGTH),
});

export type ProfileSeoFormSchema = z.infer<typeof profileSeoFormSchema>;
