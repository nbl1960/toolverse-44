import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Copilot } from "@/components/shared/copilot";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Copilot",
  description: `Describe a goal, not just a task, and the ${SITE_NAME} Copilot builds you a real, step-by-step path through the tools that get you there.`,
  path: "/copilot",
});

export default function CopilotPage() {
  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Copilot" }]} />

      <div className="mx-auto mt-6 max-w-2xl text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-accent px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-brass">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          {SITE_NAME} Copilot
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          What do you want to accomplish?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Not a single task — a goal. Describe it, and we&apos;ll lay out the real tools, in the
          right order, to get you there.
        </p>
      </div>

      <div className="mt-8">
        <Copilot />
      </div>
    </div>
  );
}
