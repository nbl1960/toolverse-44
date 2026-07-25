import { z } from "zod";
import { numberRangeField } from "@/lib/finance/validation";
import { MAX_FOLLOWERS, MAX_INTERACTIONS, MIN_VALUE } from "./constants";

export const engagementFormSchema = z.object({
  followers: numberRangeField(1, MAX_FOLLOWERS, "Followers"),
  likes: numberRangeField(MIN_VALUE, MAX_INTERACTIONS, "Likes"),
  comments: numberRangeField(MIN_VALUE, MAX_INTERACTIONS, "Comments"),
  shares: numberRangeField(MIN_VALUE, MAX_INTERACTIONS, "Shares"),
  saves: numberRangeField(MIN_VALUE, MAX_INTERACTIONS, "Saves"),
});

export type EngagementFormSchema = z.infer<typeof engagementFormSchema>;
