import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

interface LegalPageShellProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

/**
 * Shared layout for Privacy Policy, Terms & Conditions, Disclaimer, and
 * Cookie Policy — consistent breadcrumb, heading, "last updated" date,
 * and prose typography so these four pages read as one coherent set
 * rather than four independently-styled documents.
 */
export function LegalPageShell({ title, lastUpdated, children }: LegalPageShellProps) {
  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Legal", href: "/privacy" }, { label: title }]} />
      <div className="mx-auto mt-6 max-w-3xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-foreground sm:text-base [&_h2]:mt-4 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_a]:text-brass [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brass-dark">
          {children}
        </div>
      </div>
    </div>
  );
}
