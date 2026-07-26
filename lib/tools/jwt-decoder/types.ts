export interface JwtDecodeResult {
  header: string;
  payload: string;
  signature: string;
  isExpired: boolean | null;
  expiresAt: string | null;
}
