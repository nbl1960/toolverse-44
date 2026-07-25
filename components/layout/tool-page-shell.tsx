import type { ReactNode } from "react";
import { Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { RelatedTools } from "@/components/shared/related-tools";
import { Faq } from "@/components/shared/faq";
import { FormulaSection } from "@/components/shared/formula-section";
import { ExampleCalculation } from "@/components/shared/example-calculation";
import { FeedbackSection } from "@/components/shared/feedback-section";
import { getCategoryBySlug } from "@/lib/categories";
import { resolveIcon } from "@/lib/icon-map";
import { buildToolBreadcrumbs } from "@/lib/breadcrumbs";
import type { ToolDefinition } from "@/lib/types";

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
 */
export function ToolPageShell({ tool, children }: ToolPageShellProps) {
  const category = getCategoryBySlug(tool.category);
  const Icon = resolveIcon(tool.iconName);

  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={buildToolBreadcrumbs(tool)} />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brass bg-primary text-primary-foreground">
            <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {tool.name}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground sm:text-base">{tool.tagline}</p>
          </div>
        </div>
        {category && (
          <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            {category.name}
          </span>
        )}
      </div>

      <div className="mt-8">
        {tool.status === "live" ? children : <ComingSoonPanel tool={tool} />}
      </div>

      {tool.formula && <FormulaSection formula={tool.formula} />}

      {tool.example && <ExampleCalculation example={tool.example} />}

      {tool.faq && tool.faq.length > 0 && <Faq items={tool.faq} />}

      {tool.status === "live" && <FeedbackSection toolName={tool.name} />}

      <RelatedTools tool={tool} limit={tool.relatedToolsLimit} />
    </div>
  );
}

function ComingSoonPanel({ tool }: { tool: ToolDefinition }) {
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
