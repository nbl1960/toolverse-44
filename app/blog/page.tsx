import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: `Guides, comparisons, and updates from ${SITE_NAME} — coming soon.`,
  path: "/blog",
});

/**
 * Explicitly, honestly labeled as coming soon — no fabricated posts,
 * no placeholder content dressed up as real. When the blog launches,
 * this page becomes the real index.
 */
export default function BlogPage() {
  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Blog" }]} />

      <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
        <Newspaper className="h-8 w-8 text-brass" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          The {SITE_NAME} blog is coming soon
        </h1>
        <p className="max-w-md text-sm text-muted-foreground sm:text-base">
          Guides, comparisons, and deep dives on getting more out of the tools in the catalog.
          Nothing&apos;s published here yet — check back, or explore the catalog in the meantime.
        </p>
        <Button asChild className="mt-2">
          <Link href="/tools">
            Browse all tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
