"use client";

import * as React from "react";
import { buildQrCodeUrl } from "@/lib/tools/qr-code-generator/calculations";
import { DEFAULT_SIZE } from "@/lib/tools/qr-code-generator/constants";

interface UseQrCodeGeneratorResult {
  text: string;
  setText: (value: string) => void;
  size: number;
  setSize: (value: number) => void;
  qrCodeUrl: string | null;
  reset: () => void;
}

/** Drives the QR Code Generator: live-recalculates the QR image URL as text or size changes. */
export function useQrCodeGenerator(): UseQrCodeGeneratorResult {
  const [text, setText] = React.useState("");
  const [size, setSize] = React.useState(DEFAULT_SIZE);

  const reset = React.useCallback(() => setText(""), []);

  const qrCodeUrl = React.useMemo(() => (text.trim() ? buildQrCodeUrl(text.trim(), size) : null), [text, size]);

  return { text, setText, size, setSize, qrCodeUrl, reset };
}
