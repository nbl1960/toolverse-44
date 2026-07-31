import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CompareTools } from "@/components/shared/compare-tools";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Compare Tools",
  description: `Compare up to 4 ${SITE_NAME} tools side by side — category, what each does, and best-fit use cases.`,
  path: "/compare",
});

export default function ComparePage() {
  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Compare Tools" }]} />
      <div className="mx-auto mt-6 max-w-2xl text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Compare tools side by side
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Not sure which of two similar tools fits your task? Add them below and compare directly.
        </p>
      </div>
      <div className="mt-8">
        <Suspense fallback={null}>
          <CompareTools />
        </Suspense>
      </div>
    </div>
  );
}
