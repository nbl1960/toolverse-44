import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SuggestToolForm } from "@/components/shared/suggest-tool-form";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Suggest a Tool",
  description: `Have an idea for a tool ${SITE_NAME} should build next? Tell us about it.`,
  path: "/suggest-a-tool",
});

export default function SuggestToolPage() {
  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Suggest a Tool" }]} />
      <div className="mx-auto mt-6 max-w-2xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Suggest a tool
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Tell us what you wish existed — this directly shapes what gets built next.
        </p>
        <div className="mt-8">
          <SuggestToolForm />
        </div>
      </div>
    </div>
  );
}
