import type { FaqItem, ToolExample } from "@/lib/types";
import type { ColorScheme } from "./types";

export const SCHEME_OPTIONS: { value: ColorScheme; label: string }[] = [
  { value: "complementary", label: "Complementary" },
  { value: "analogous", label: "Analogous" },
  { value: "triadic", label: "Triadic" },
  { value: "monochromatic", label: "Monochromatic" },
];
export const DEFAULT_SCHEME: ColorScheme = "analogous";
export const DEFAULT_BASE_COLOR = "#3B82F6";

export const PALETTE_FAQ_ITEMS: FaqItem[] = [
  { question: "How are these palettes calculated?", answer: "Using standard HSL color-wheel relationships — complementary colors sit 180° apart on the hue wheel, triadic colors are spaced 120° apart, analogous colors are close neighbors, and monochromatic varies only lightness. This is real color theory, not an AI guess at hex codes." },
  { question: "What's the difference between the schemes?", answer: "Complementary gives high contrast (opposite hues); analogous gives a calm, cohesive look (neighboring hues); triadic gives vibrant balance (three evenly-spaced hues); monochromatic gives a clean, single-hue look at different lightness levels." },
  { question: "Does this send my color to a server?", answer: "No — every calculation happens entirely in your browser." },
  { question: "Can I use any starting color?", answer: "Yes — enter any valid 6-digit hex color (e.g. #3B82F6) or use the color picker." },
];

export const PALETTE_EXAMPLE: ToolExample = {
  title: "Example: an analogous palette from blue",
  summary: "Entering a base color with the analogous scheme:",
  inputs: [{ label: "Base color", value: "#3B82F6" }, { label: "Scheme", value: "Analogous" }],
  outputs: [{ label: "Result", value: "5 hex colors with neighboring hues on the color wheel" }],
};
