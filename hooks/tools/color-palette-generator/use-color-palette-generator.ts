"use client";

import * as React from "react";
import { generatePalette } from "@/lib/tools/color-palette-generator/calculations";
import { isValidHexColor } from "@/lib/tools/color-palette-generator/validations";
import { DEFAULT_BASE_COLOR, DEFAULT_SCHEME } from "@/lib/tools/color-palette-generator/constants";
import type { ColorScheme, PaletteColor } from "@/lib/tools/color-palette-generator/types";

interface UseColorPaletteGeneratorResult {
  baseColor: string;
  setBaseColor: (value: string) => void;
  scheme: ColorScheme;
  setScheme: (value: ColorScheme) => void;
  palette: PaletteColor[] | null;
  errorMessage: string | null;
}

/** Drives the Color Palette Generator: live-recalculates as the base color or scheme changes, no server round trip. */
export function useColorPaletteGenerator(): UseColorPaletteGeneratorResult {
  const [baseColor, setBaseColor] = React.useState(DEFAULT_BASE_COLOR);
  const [scheme, setScheme] = React.useState<ColorScheme>(DEFAULT_SCHEME);

  const { palette, errorMessage } = React.useMemo(() => {
    if (!isValidHexColor(baseColor)) {
      return { palette: null, errorMessage: "Enter a valid 6-digit hex color, e.g. #3B82F6." };
    }
    const result = generatePalette(baseColor, scheme);
    return { palette: result, errorMessage: result ? null : "Couldn't parse that color." };
  }, [baseColor, scheme]);

  return { baseColor, setBaseColor, scheme, setScheme, palette, errorMessage };
}
