import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/shared/tool-card";
import { CategoryCard } from "@/components/shared/category-card";
import { JsonLd } from "@/components/shared/json-ld";
import { buildWebApplicationJsonLd } from "@/lib/structured-data";
import { CATEGORIES } from "@/lib/categories";
import { getAllTools, getLiveTools, getRecentlyAddedTools } from "@/lib/tools-registry";
import { SITE_TAGLINE } from "@/lib/site-config";

export default function HomePage() {
  const allTools = getAllTools();
  const liveTools = getLiveTools();
  const recentlyAddedTools = getRecentlyAddedTools(6);

  return (
    <>
      <JsonLd data={buildWebApplicationJsonLd()} />
      {/* Hero */}
      <section className="container pb-8 pt-14 sm:pb-10 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-accent px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-brass">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {liveTools.length} tool{liveTools.length === 1 ? "" : "s"} live · {allTools.length - liveTools.length} coming soon
          </p>
          <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            {SITE_TAGLINE}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-balance text-sm text-muted-foreground sm:text-base">
            Every tool here does one job well — no sign-up walls, no clutter. Pick a
            category below, or jump straight into a tool.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/tools">
                Browse all tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/categories">Explore categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-10 sm:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
              Explore by category
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {CATEGORIES.length} categories, growing every week.
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brass transition-colors hover:text-brass-dark sm:flex"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {/* Recently added */}
      <section className="container pb-16 pt-2 sm:pb-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
              Recently added
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The newest tools in the catalog, live or on the way.
            </p>
          </div>
          <Link
            href="/tools"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brass transition-colors hover:text-brass-dark sm:flex"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentlyAddedTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
        <div className="mt-8 flex justify-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/tools">
              View all tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
