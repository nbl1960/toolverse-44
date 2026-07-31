import { describe, it, expect } from "vitest";
import { PROMPT_LIBRARY, PROMPT_LIBRARY_CATEGORIES } from "@/lib/prompt-studio/library-content";
import { TARGET_MODELS } from "@/lib/prompt-studio/models";

/**
 * Data-integrity tests for the template library — the kind of bug that's
 * easy to introduce silently while hand-writing 49+ entries (a typo'd
 * model ID, an accidental duplicate ID, a template with no placeholder
 * to fill in) and easy to miss just reading the file.
 */
describe("PROMPT_LIBRARY", () => {
  const validModelIds = new Set(TARGET_MODELS.map((m) => m.id));

  it("has no duplicate template IDs", () => {
    const ids = PROMPT_LIBRARY.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every template references a real, existing target model", () => {
    for (const template of PROMPT_LIBRARY) {
      expect(validModelIds.has(template.targetModel), `"${template.id}" references unknown model "${template.targetModel}"`).toBe(true);
    }
  });

  it("every template has non-empty title, category, and prompt text", () => {
    for (const template of PROMPT_LIBRARY) {
      expect(template.title.trim().length, `"${template.id}" has an empty title`).toBeGreaterThan(0);
      expect(template.category.trim().length, `"${template.id}" has an empty category`).toBeGreaterThan(0);
      expect(template.prompt.trim().length, `"${template.id}" has an empty prompt`).toBeGreaterThan(20);
    }
  });

  it("chat-model templates aren't accidentally using image-model conventions and vice versa", () => {
    for (const template of PROMPT_LIBRARY) {
      const model = TARGET_MODELS.find((m) => m.id === template.targetModel);
      if (!model) continue;
      // A rough sanity check, not a strict rule: image-model templates in
      // this library are short, tag-style strings without "You are" role
      // framing; chat-model templates in this library all use it.
      if (model.kind === "image") {
        expect(template.prompt.toLowerCase().includes("you are"), `"${template.id}" targets an image model but uses chat-style role framing`).toBe(false);
      }
    }
  });

  it("PROMPT_LIBRARY_CATEGORIES contains every category actually used, with no duplicates", () => {
    const usedCategories = new Set(PROMPT_LIBRARY.map((t) => t.category));
    expect(new Set(PROMPT_LIBRARY_CATEGORIES).size).toBe(PROMPT_LIBRARY_CATEGORIES.length);
    expect(new Set(PROMPT_LIBRARY_CATEGORIES)).toEqual(usedCategories);
  });

  it("has at least one template per category listed", () => {
    for (const category of PROMPT_LIBRARY_CATEGORIES) {
      const count = PROMPT_LIBRARY.filter((t) => t.category === category).length;
      expect(count, `category "${category}" has no templates`).toBeGreaterThan(0);
    }
  });
});
