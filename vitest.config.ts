import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Minimal, focused config for pure-logic unit tests — no jsdom, no
 * React Testing Library. Everything under test/ exercises deterministic
 * business logic (financial math, parsers, search ranking, minifiers)
 * directly, the same way it was manually verified during development,
 * just made permanent and re-runnable instead of throwaway scratch
 * scripts.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
