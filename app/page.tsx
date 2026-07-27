import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/shared/tool-card";
import { CategoryCard } from "@/components/shared/category-card";
import { AiAssistant } from "@/components/shared/ai-assistant";
import { WatchDemoTrigger } from "@/components/shared/watch-demo-trigger";
import { JsonLd } from "@/components/shared/json-ld";
import { buildWebApplicationJsonLd } from "@/lib/structured-data";
import { CATEGORIES } from "@/lib/categories";
import { getLiveTools, getRecentlyAddedTools, getToolBySlug } from "@/lib/tools-registry";
import { SITE_BRAND_LINE, SITE_TAGLINE } from "@/lib/site-config";

/**
 * Hand-picked for variety across the catalog (writing, finance, image
 * tools, dev utilities, social) rather than pulled from any single
 * category — every slug is verified against the real registry.
 */
const FEATURED_TOOL_SLUGS = [
  "resume-builder",
  "emi-calculator",
  "image-compressor",
  "qr-code-generator",
  "dev-password-generator",
  "instagram-caption-generator",
];

const WHY_TOOLVERSE = [
  { icon: Sparkles, label: "100+ Smart Tools", detail: "One catalog, no hunting across a dozen sites." },
  { icon: Rocket, label: "AI-Powered Recommendations", detail: "Describe the task — skip the browsing." },
  { icon: Wallet, label: "Free", detail: "No sign-up walls, no paywalled features." },
  { icon: Smartphone, label: "Mobile Friendly", detail: "Every tool works the same on a phone as a desktop." },
  { icon: Lock, label: "Privacy Focused", detail: "Most tools run entirely in your browser — nothing uploaded." },
  { icon: ShieldCheck, label: "Fast", detail: "No bloated dashboards — open a tool, get your result." },
];

export default function HomePage() {
  const liveTools = getLiveTools();
  const recentlyAddedTools = getRecentlyAddedTools(6);
  const featuredTools = FEATURED_TOOL_SLUGS.map((slug) => getToolBySlug(slug)).filter(
    (tool): tool is NonNullable<typeof tool> => Boolean(tool)
  );

  return (
    <>
      <JsonLd data={buildWebApplicationJsonLd()} />

      {/* Hero */}
      <section className="container pb-6 pt-14 sm:pb-8 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-accent px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-brass">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {SITE_BRAND_LINE}
          </p>
          <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            {SITE_TAGLINE}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-balance text-sm text-muted-foreground sm:text-base">
            {liveTools.length} tools, one search box. Tell the AI Guide what you&apos;re trying to
            do, and it points you straight to the right tool — no browsing required.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#ai-guide">
                <Sparkles className="h-4 w-4" />
                Ask ToolVerse AI
              </a>
            </Button>
            <WatchDemoTrigger />
          </div>
        </div>
      </section>

      <AiAssistant />

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

      {/* Featured tools */}
      <section className="container py-10 sm:py-14">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
            Featured tools
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A handful of the most useful tools across the catalog.
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Why ToolVerse */}
      <section className="border-y border-border bg-card/50 py-10 sm:py-14">
        <div className="container">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
              Why ToolVerse
            </h2>
          </div>
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_TOOLVERSE.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brass/50 bg-primary text-primary-foreground">
                  <item.icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently added */}
      <section className="container pb-16 pt-10 sm:pb-24 sm:pt-14">
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
