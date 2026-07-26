const QR_API_BASE = "https://api.qrserver.com/v1/create-qr-code/";

/**
 * Builds a QR code image URL via the goqr.me public QR generation API,
 * a long-standing, free, no-API-key service used by many QR tools
 * across the web. This tool does NOT implement QR encoding itself —
 * correctly encoding a QR code (Reed-Solomon error correction, finder
 * patterns, etc.) is genuinely complex, and there's no way to visually
 * verify a hand-rolled implementation actually scans correctly without
 * a real device. Using an established service is the honest choice
 * here rather than shipping an unverified encoder.
 */
export function buildQrCodeUrl(text: string, size: number): string {
  const params = new URLSearchParams({
    data: text,
    size: `${size}x${size}`,
  });
  return `${QR_API_BASE}?${params.toString()}`;
}
