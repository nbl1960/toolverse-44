import type { Metadata } from "next";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { getLiveTools } from "@/lib/tools-registry";
import { SITE_NAME } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Roadmap",
  description: `What's shipped and what's coming next for ${SITE_NAME}'s tool catalog and AI Guide.`,
  path: "/roadmap",
});

interface RoadmapItem {
  title: string;
  detail: string;
  status: "shipped" | "in-progress" | "planned";
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  { title: "100+ tool catalog across 10 categories", detail: "Writing, finance, developer, SEO, image, and social tools — all live today.", status: "shipped" },
  { title: "AI Guide", detail: "Describe a task in plain language and get real, verified tool recommendations — not a search box, not a guess.", status: "shipped" },
  { title: "Client-side privacy for utility tools", detail: "Image, JSON, hashing, and password tools that never upload your data anywhere.", status: "shipped" },
  { title: "Deeper on-page content for every tool", detail: "Rolling out full explanations — what each tool does, who it's for, how to use it well — across the whole catalog.", status: "in-progress" },
  { title: "Document tools", detail: "A dedicated suite for common document tasks — this is the single most requested gap in our current catalog.", status: "planned" },
  { title: "Smarter AI Guide reasoning", detail: "Continuing to improve how well plain-language requests map to the right tool, especially for less obvious phrasing.", status: "in-progress" },
  { title: "Deeper category-specific suites", detail: "Going further in a couple of categories rather than staying uniformly broad everywhere.", status: "planned" },
  { title: "Community feedback loop", detail: "A more direct way to tell us what tool you wish existed — the Contact page already routes straight to us today.", status: "planned" },
];

const STATUS_CONFIG: Record<RoadmapItem["status"], { label: string; icon: typeof CheckCircle2; className: string }> = {
  shipped: { label: "Shipped", icon: CheckCircle2, className: "text-success" },
  "in-progress": { label: "In progress", icon: Clock, className: "text-brass" },
  planned: { label: "Planned", icon: Circle, className: "text-muted-foreground" },
};

export default function RoadmapPage() {
  const liveTools = getLiveTools();

  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Roadmap" }]} />

      <div className="mx-auto mt-6 max-w-2xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Roadmap
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Where {SITE_NAME} is today — {liveTools.length} live tools — and what&apos;s next. We&apos;d rather
          under-promise here than list things that aren&apos;t real yet.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {ROADMAP_ITEMS.map((item) => {
            const config = STATUS_CONFIG[item.status];
            const Icon = config.icon;
            return (
              <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
                <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.className)} aria-hidden="true" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <span className={cn("text-[10px] font-medium uppercase tracking-wide", config.className)}>
                      {config.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Have a tool idea or a request? <a href="/contact?type=feature" className="font-medium text-brass hover:text-brass-dark">Tell us</a> — this list gets shaped directly by what people actually ask for.
        </p>
      </div>
    </div>
  );
}
