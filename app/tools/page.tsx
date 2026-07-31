import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ToolsBrowser } from "@/components/shared/tools-browser";
import { getAllTools } from "@/lib/tools-registry";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "All Tools",
  description: "Browse every tool in the ToolVerse catalog, live and upcoming.",
  path: "/tools",
});

export default function AllToolsPage() {
  const tools = getAllTools();

  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "All Tools" }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            All tools
          </h1>
          <p className="mt-1 max-w-lg text-sm text-muted-foreground sm:text-base">
            {tools.length} tools across the catalog — search or filter by category to find
            what you need.
          </p>
        </div>
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brass hover:text-brass-dark"
        >
          <Scale className="h-4 w-4" aria-hidden="true" />
          Compare tools
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-8">
        <Suspense fallback={null}>
          <ToolsBrowser />
        </Suspense>
      </div>
    </div>
  );
}
