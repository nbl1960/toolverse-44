import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { DashboardContent } from "@/components/shared/dashboard-content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Dashboard",
  description: "Your favorited and recently used tools.",
  path: "/dashboard",
});

export default function DashboardPage() {
  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Dashboard" }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Your dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Stored on this device only — favorites and recently used tools.
          </p>
        </div>
        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brass hover:text-brass-dark"
        >
          <FolderOpen className="h-4 w-4" aria-hidden="true" />
          Your collections
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-8">
        <DashboardContent />
      </div>
    </div>
  );
}
