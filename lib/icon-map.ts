import {
  Mail,
  FileText,
  ListChecks,
  Braces,
  Palette,
  Tags,
  FileJson,
  Calculator,
  TrendingUp,
  Banknote,
  Lock,
  RefreshCw,
  TrendingDown,
  Percent,
  PiggyBank,
  ArrowUpRight,
  PenLine,
  Zap,
  Code2,
  Megaphone,
  BarChart3,
  Landmark,
  Video,
  Type,
  AlignLeft,
  Hash,
  AtSign,
  Lightbulb,
  ScrollText,
  KeyRound,
  Timer,
  Youtube,
  type LucideIcon,
} from "lucide-react";

/**
 * Every icon a tool or category can reference, keyed by name.
 * `ToolDefinition` and `Category` store only the string key (`iconName`)
 * — never the component itself — so that data stays plain, serializable
 * data with no function values. Components that need to render the icon
 * (ToolCard, CategoryCard, ToolPageShell, category pages, search results)
 * resolve it through `resolveIcon()` below, at the point where it's
 * actually rendered.
 */
export const ICON_MAP = {
  Mail,
  FileText,
  ListChecks,
  Braces,
  Palette,
  Tags,
  FileJson,
  Calculator,
  TrendingUp,
  Banknote,
  Lock,
  RefreshCw,
  TrendingDown,
  Percent,
  PiggyBank,
  ArrowUpRight,
  PenLine,
  Zap,
  Code2,
  Megaphone,
  BarChart3,
  Landmark,
  Video,
  Type,
  AlignLeft,
  Hash,
  AtSign,
  Lightbulb,
  ScrollText,
  KeyRound,
  Timer,
  Youtube,
} satisfies Record<string, LucideIcon>;

/** The set of valid icon names a `ToolDefinition.iconName` or `Category.iconName` can use. */
export type IconName = keyof typeof ICON_MAP;

/** Resolves an icon name to its component for rendering. */
export function resolveIcon(name: IconName): LucideIcon {
  return ICON_MAP[name];
}
