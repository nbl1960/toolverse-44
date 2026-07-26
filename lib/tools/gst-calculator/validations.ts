import { z } from "zod";
import { numberRangeField } from "@/lib/finance/validation";
import { MAX_AMOUNT } from "./constants";

export const gstFormSchema = z.object({
  amount: numberRangeField(0, MAX_AMOUNT, "Amount"),
  rate: numberRangeField(0, 100, "GST rate"),
  mode: z.enum(["add", "remove"]),
});

export type GstFormSchema = z.infer<typeof gstFormSchema>;
