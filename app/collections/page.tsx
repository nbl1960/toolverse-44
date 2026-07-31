import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CollectionsContent } from "@/components/shared/collections-content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Collections",
  description: "Your saved tool collections.",
  path: "/collections",
});

export default function CollectionsPage() {
  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Collections" }]} />
      <div className="mt-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Your collections
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Stored on this device only — group tools by project, workflow, or however you like.
        </p>
      </div>
      <div className="mt-8">
        <CollectionsContent />
      </div>
    </div>
  );
}
