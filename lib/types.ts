import type { IconName } from "./icon-map";

/** Lifecycle status of a tool in the catalog. */
export type ToolStatus = "live" | "coming-soon";

/**
 * Central definition for a single tool in the catalog. Every tool — whether
 * there are 1 or 1,000 of them — is described by exactly one of these
 * objects in `lib/tools-registry.ts`. Routing, navigation, search,
 * category pages, related-tools, and SEO metadata are all derived from
 * this shape, so adding a new tool never requires touching routing code.
 *
 * Deliberately plain, serializable data — no component references, no
 * functions. Icons are resolved by name via `lib/icon-map.ts`, and each
 * live tool's component loader lives separately in `lib/tool-components.ts`
 * (used only by the server-only `/tools/[slug]` route). This is what lets
 * `ToolDefinition` be safely read by Client Components (search, the tools
 * browser) without ever crossing a function value over the Server→Client
 * boundary.
 */
export interface ToolDefinition {
  /** URL-safe unique identifier, used as the route segment /tools/[slug]. */
  slug: string;
  /** Display name, e.g. "AI Email Writer". */
  name: string;
  /** Short one-line pitch shown on cards. */
  tagline: string;
  /** Longer description used on the tool's page and in SEO metadata. */
  description: string;
  /** Slug of the category this tool belongs to (see lib/categories.ts). */
  category: string;
  /** Name of the icon representing the tool, resolved via `resolveIcon()` from `lib/icon-map.ts`. */
  iconName: IconName;
  /** Search/SEO keywords. */
  keywords: string[];
  /** Whether the tool is live or a planned/announced placeholder. */
  status: ToolStatus;
  /**
   * ISO date the tool was added to the catalog. Drives the homepage's
   * "Recently added" rail — set it once per tool and ordering is automatic.
   */
  addedAt: string;
  /**
   * Optional FAQ entries. When present, `ToolPageShell` renders them via
   * the shared `<Faq>` component and the tool page emits FAQPage JSON-LD —
   * no per-tool FAQ markup needed.
   */
  faq?: FaqItem[];
  /**
   * Overrides the default related-tools count (3) shown on this tool's
   * page. Useful for a tightly-scoped category where every tool genuinely
   * wants to recommend all its siblings, not just a handful.
   */
  relatedToolsLimit?: number;
  /**
   * Overrides `category` for the purpose of picking related tools. Lets
   * two toolsets share one category (e.g. YouTube and Instagram tools
   * both under "Creator Studio") while each still recommends only its
   * own siblings, not a mix of both.
   */
  relatedGroup?: string;
  /**
   * schema.org `applicationCategory` value for this tool's structured
   * data, e.g. "FinanceApplication" for a calculator. Defaults to
   * "WebApplication" when omitted.
   */
  applicationCategory?: string;
  /**
   * When true, the tool page's SoftwareApplication JSON-LD adds
   * `applicationSubCategory: "Calculator"` — the "Calculator schema"
   * signal for search engines, without inventing a bespoke schema type.
   */
  isCalculator?: boolean;
  /**
   * Optional formula explanation. When present, `ToolPageShell` renders
   * it via the shared `<FormulaSection>` component — one implementation,
   * reused by every calculator-style tool.
   */
  formula?: ToolFormula;
  /**
   * Optional worked example. When present, `ToolPageShell` renders it via
   * the shared `<ExampleCalculation>` component, right after the formula.
   */
  example?: ToolExample;
}

/** One question/answer pair, reused for both the visible FAQ and FAQPage JSON-LD. */
export interface FaqItem {
  question: string;
  answer: string;
}

/** One symbol explained in a formula's variable legend. */
export interface FormulaVariable {
  symbol: string;
  meaning: string;
}

/** A formula explanation shown on a tool's page via the shared FormulaSection. */
export interface ToolFormula {
  title: string;
  expression: string;
  description: string;
  variables: FormulaVariable[];
}

/** One labeled input or output line in a worked example. */
export interface ExampleLine {
  label: string;
  value: string;
}

/** A worked example shown on a tool's page via the shared ExampleCalculation component. */
export interface ToolExample {
  title: string;
  summary: string;
  inputs: ExampleLine[];
  outputs: ExampleLine[];
}

/** A grouping of related tools, e.g. "Writing & Content". */
export interface Category {
  slug: string;
  name: string;
  description: string;
  /** Name of the icon representing the category, resolved via `resolveIcon()` from `lib/icon-map.ts`. */
  iconName: IconName;
}

/** A single crumb in a breadcrumb trail. Omit `href` for the current page. */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
