import { describe, it, expect } from "vitest";
import { generatePalette } from "@/lib/tools/color-palette-generator/calculations";

describe("generatePalette", () => {
  it("returns 5 colors for a valid hex input", () => {
    const palette = generatePalette("#3B82F6", "analogous");
    expect(palette).not.toBeNull();
    expect(palette).toHaveLength(5);
  });

  it("returns null for an invalid hex color", () => {
    expect(generatePalette("not-a-color", "analogous")).toBeNull();
    expect(generatePalette("#GGG", "analogous")).toBeNull();
  });

  it("produces every color as a valid 6-digit hex string", () => {
    const palette = generatePalette("#3B82F6", "triadic");
    for (const color of palette ?? []) {
      expect(color.hex).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it("complementary scheme produces a hue roughly 180° from the base (red -> cyan-ish)", () => {
    // Pure red (#FF0000) has hue 0; its complement should sit near hue 180 (cyan region).
    const palette = generatePalette("#FF0000", "complementary");
    expect(palette).not.toBeNull();
    const hexes = (palette ?? []).map((c) => c.hex);
    // The complementary color for pure red at full saturation/lightness is cyan (#00FFFF).
    expect(hexes).toContain("#00FFFF");
  });

  it("monochromatic scheme varies lightness while keeping a consistent hue family", () => {
    const palette = generatePalette("#3B82F6", "monochromatic");
    expect(palette).not.toBeNull();
    // 5 distinct lightness steps should produce 5 distinct hex values.
    const uniqueHexes = new Set((palette ?? []).map((c) => c.hex));
    expect(uniqueHexes.size).toBe(5);
  });

  it("accepts a hex value without a leading #", () => {
    expect(generatePalette("3B82F6", "analogous")).not.toBeNull();
  });
});
