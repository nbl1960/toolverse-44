import type { Category } from "./types";

/**
 * Central category registry. Every tool in `tools-registry.ts` references
 * one of these slugs. Add a category once here and it's immediately
 * available for filtering, navigation, and /categories/[slug] pages.
 *
 * Deliberately plain, serializable data — no component references. Icons
 * are resolved by name via `lib/icon-map.ts`, the same pattern used by
 * `ToolDefinition`.
 */
export const CATEGORIES: Category[] = [
  {
    slug: "writing",
    name: "Writing & Content",
    description: "Draft, edit, and polish written content in seconds.",
    iconName: "PenLine",
  },
  {
    slug: "productivity",
    name: "Productivity",
    description: "Move faster through the small tasks that add up.",
    iconName: "Zap",
  },
  {
    slug: "developer",
    name: "Developer Tools",
    description: "Everyday utilities for building and debugging software.",
    iconName: "Code2",
  },
  {
    slug: "design",
    name: "Design",
    description: "Visual and creative helpers for makers.",
    iconName: "Palette",
  },
  {
    slug: "marketing",
    name: "Marketing & SEO",
    description: "Reach an audience and say it well.",
    iconName: "Megaphone",
  },
  {
    slug: "data",
    name: "Data & Analysis",
    description: "Convert, clean, and make sense of data.",
    iconName: "BarChart3",
  },
  {
    slug: "finance",
    name: "Finance",
    description: "Calculators and tools for loans, budgeting, and money decisions.",
    iconName: "Landmark",
  },
  {
    slug: "creator-studio",
    name: "Creator Studio",
    description: "AI-powered tools for YouTube creators — titles, tags, scripts, and more.",
    iconName: "Video",
  },
  {
    slug: "linkedin-studio",
    name: "LinkedIn Studio",
    description: "AI-powered tools for LinkedIn — headlines, About sections, posts, and profile optimization.",
    iconName: "Briefcase",
  },
  {
    slug: "image-studio",
    name: "Image Studio",
    description: "Fast, private, browser-based image tools — compress, resize, and convert formats.",
    iconName: "FileImage",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}
