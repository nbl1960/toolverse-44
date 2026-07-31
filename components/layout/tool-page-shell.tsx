import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { RelatedTools } from "@/components/shared/related-tools";
import { FormulaSection } from "@/components/shared/formula-section";
import { ExampleCalculation } from "@/components/shared/example-calculation";
import { JsonLd } from "@/components/shared/json-ld";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { SaveToCollection } from "@/components/shared/save-to-collection";
import { TrackToolVisit } from "@/components/shared/track-tool-visit";
import { getCategoryBySlug } from "@/lib/categories";
import { resolveIcon } from "@/lib/icon-map";
import { buildToolBreadcrumbs } from "@/lib/breadcrumbs";
import { buildToolWebPageJsonLd } from "@/lib/structured-data";
import type { ToolDefinition } from "@/lib/types";

// Faq and FeedbackSection are the only two sections here with real
// interactivity (accordion state, thumbs-up/down + a comment form) — the
// rest (Breadcrumbs, FormulaSection, ExampleCalculation, RelatedTools) are
// plain Server Components with no client JS cost, so splitting them out
// would add boundary overhead for zero benefit. Faq/FeedbackSection are
// also both below the fold on every tool page, so deferring their client
// bundle keeps the JS needed for the above-the-fold, interactive tool UI
// smaller — a direct Total Blocking Time / INP improvement. `ssr` is left
// at its default (true): both still render into the initial server HTML,
// so this is purely a client-bundle-splitting optimization, not a
// visibility or SEO change — the FAQ text is exactly as crawlable as
// before, and `loading: () => null` means there is no visible loading
// state to introduce, since real content is already present on first
// paint.
const Faq = dynamic(() => import("@/components/shared/faq").then((m) => ({ default: m.Faq })), {
  loading: () => null,
});
const FeedbackSection = dynamic(
  () => import("@/components/shared/feedback-section").then((m) => ({ default: m.FeedbackSection })),
  { loading: () => null }
);

interface ToolPageShellProps {
  tool: ToolDefinition;
  /** The tool's own rendered UI. Ignored (in favor of a "coming soon" panel) when the tool isn't live yet. */
  children?: ReactNode;
}

/**
 * The one layout every tool page is built from: breadcrumbs, a consistent
 * title block (icon, name, tagline, category), the tool's own UI, and a
 * related-tools rail. A new tool gets this whole page shell for free just
 * by having an entry in the registry — nothing here is duplicated per tool.
 *
 * SEO ownership, so nothing here ever gets duplicated elsewhere:
 * - `WebPage` JSON-LD is emitted from here (below), since this component
 *   is the one place with full context (tool + category + breadcrumbs).
 * - `SoftwareApplication`, `BreadcrumbList`, and `FAQPage` JSON-LD are
 *   emitted by `app/tools/[slug]/page.tsx`, not here — that's the route
 *   file, so it's the correct owner, and duplicating them in this
 *   component would emit the same structured data twice on one page.
 * - Canonical URL, Open Graph, and Twitter Card tags cannot be set from
 *   this file at all: Next.js only reads `generateMetadata` from
 *   `page.tsx`/`layout.tsx` files, never from an ordinary component. Those
 *   are correctly handled in `app/tools/[slug]/page.tsx` via
 *   `generateMetadata` + `buildMetadata()`, which already sets
 *   `alternates.canonical`, `openGraph`, and `twitter` for every tool page.
 */
export function ToolPageShell({ tool, children }: ToolPageShellProps) {
  const category = getCategoryBySlug(tool.category);
  const Icon = resolveIcon(tool.iconName);

  return (
    <div className="container py-8 sm:py-10">
      <JsonLd data={buildToolWebPageJsonLd(tool)} />

      <Breadcrumbs items={buildToolBreadcrumbs(tool)} />
      {tool.status === "live" && <TrackToolVisit slug={tool.slug} />}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brass bg-primary text-primary-foreground">
            <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </span>
          <div>
            <h1
              id="tool-heading"
              className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {tool.name}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground sm:text-base">{tool.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:self-center">
          {category && (
            <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              <span className="sr-only">Category: </span>
              {category.name}
            </span>
          )}
          <FavoriteButton slug={tool.slug} toolName={tool.name} />
          <SaveToCollection toolSlug={tool.slug} toolName={tool.name} />
        </div>
      </div>

      <section aria-labelledby="tool-heading" className="mt-8">
        {tool.status === "live" ? children : <ComingSoonPanel tool={tool} />}
      </section>

      {tool.introParagraph && (
        <section className="mt-10 max-w-3xl">
          <h2 className="font-display text-lg font-semibold text-foreground">About {tool.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {tool.introParagraph}
          </p>
        </section>
      )}

      {tool.formula && <FormulaSection formula={tool.formula} />}

      {tool.example && <ExampleCalculation example={tool.example} />}

      {tool.faq && tool.faq.length > 0 && <Faq items={tool.faq} />}

      {tool.status === "live" && <FeedbackSection toolName={tool.name} />}

      <RelatedTools tool={tool} limit={tool.relatedToolsLimit} />
    </div>
  );
}

interface ComingSoonPanelProps {
  tool: ToolDefinition;
}

function ComingSoonPanel({ tool }: ComingSoonPanelProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-muted-foreground">
        <Clock className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-display text-lg font-medium text-foreground">
          {tool.name} is coming soon
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          {tool.description} We&apos;re still building this one — check back soon, or explore a
          live tool below in the meantime.
        </p>
      </div>
    </div>
  );
}
