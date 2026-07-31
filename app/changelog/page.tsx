import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CHANGELOG } from "@/lib/changelog";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Changelog",
  description: `What's shipped on ${SITE_NAME}, most recent first.`,
  path: "/changelog",
});

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function ChangelogPage() {
  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Changelog" }]} />
      <div className="mx-auto mt-6 max-w-2xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Changelog
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          What&apos;s actually shipped, most recent first.
        </p>

        <div className="mt-8 flex flex-col gap-6 border-l border-border pl-6">
          {CHANGELOG.map((entry) => (
            <div key={entry.date + entry.title} className="relative">
              <span className="absolute -left-[29px] top-1 h-2.5 w-2.5 rounded-full border-2 border-brass bg-card" aria-hidden="true" />
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{formatDate(entry.date)}</p>
              <h2 className="mt-1 font-display text-base font-semibold text-foreground">{entry.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
