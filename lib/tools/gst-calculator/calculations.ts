import type { GstCalculationResult, GstFormValues } from "./types";

/**
 * Calculates GST (India's Goods and Services Tax) either way: "add"
 * treats the entered amount as GST-exclusive and adds tax on top;
 * "remove" treats it as GST-inclusive and extracts the tax already
 * built into it. CGST/SGST are shown as the standard even split of
 * total GST for intra-state transactions.
 */
export function calculateGst(values: GstFormValues): GstCalculationResult {
  const rateFraction = values.rate / 100;

  let originalAmount: number;
  let gstAmount: number;
  let totalAmount: number;

  if (values.mode === "add") {
    originalAmount = values.amount;
    gstAmount = originalAmount * rateFraction;
    totalAmount = originalAmount + gstAmount;
  } else {
    totalAmount = values.amount;
    originalAmount = totalAmount / (1 + rateFraction);
    gstAmount = totalAmount - originalAmount;
  }

  return {
    originalAmount,
    gstAmount,
    totalAmount,
    cgst: gstAmount / 2,
    sgst: gstAmount / 2,
  };
}
