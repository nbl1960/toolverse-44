import type { ColorScheme, PaletteColor } from "./types";

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match || !match[1]) return null;

  const r = parseInt(match[1].slice(0, 2), 16) / 255;
  const g = parseInt(match[1].slice(2, 4), 16) / 255;
  const b = parseInt(match[1].slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;

  return { h, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  const hNorm = ((h % 360) + 360) % 360;
  const sNorm = Math.min(100, Math.max(0, s)) / 100;
  const lNorm = Math.min(100, Math.max(0, l)) / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;
  if (hNorm < 60) [r, g, b] = [c, x, 0];
  else if (hNorm < 120) [r, g, b] = [x, c, 0];
  else if (hNorm < 180) [r, g, b] = [0, c, x];
  else if (hNorm < 240) [r, g, b] = [0, x, c];
  else if (hNorm < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (value: number) =>
    Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/** Generates a harmonious color palette from a base hex color using standard HSL color-wheel relationships. */
export function generatePalette(baseHex: string, scheme: ColorScheme): PaletteColor[] | null {
  const hsl = hexToHsl(baseHex);
  if (!hsl) return null;

  const { h, s, l } = hsl;
  let hues: number[];

  switch (scheme) {
    case "complementary":
      hues = [h, h + 180, h, h + 180, h];
      break;
    case "analogous":
      hues = [h - 30, h - 15, h, h + 15, h + 30];
      break;
    case "triadic":
      hues = [h, h + 120, h + 240, h + 120, h + 240];
      break;
    case "monochromatic":
      hues = [h, h, h, h, h];
      break;
  }

  return hues.map((hue, index) => {
    let lightness = l;
    if (scheme === "monochromatic") {
      // Spread lightness across the palette instead of varying hue.
      const lightnessSteps = [20, 40, 55, 70, 85];
      lightness = lightnessSteps[index] ?? l;
    }
    const hex = hslToHex(hue, s, lightness);
    return { hex, hsl: `hsl(${Math.round(((hue % 360) + 360) % 360)}, ${Math.round(s)}%, ${Math.round(lightness)}%)` };
  });
}
