import type { Metadata } from "next";
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
      <div className="mt-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Your dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Stored on this device only — favorites and recently used tools.
        </p>
      </div>
      <div className="mt-8">
        <DashboardContent />
      </div>
    </div>
  );
}
