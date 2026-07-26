export type GstMode = "add" | "remove";

export interface GstFormValues {
  amount: number;
  rate: number;
  mode: GstMode;
}

export interface GstCalculationResult {
  originalAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
}
