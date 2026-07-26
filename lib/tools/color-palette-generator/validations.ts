export function isValidHexColor(value: string): boolean {
  return /^#?[0-9a-f]{6}$/i.test(value.trim());
}
