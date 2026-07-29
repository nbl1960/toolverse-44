import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bug, HelpCircle, Lightbulb, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Help Center",
  description: `Get help with ${SITE_NAME} — FAQs, bug reports, feature requests, and direct support.`,
  path: "/help",
});

const HELP_LINKS = [
  { href: "/faq", icon: HelpCircle, title: "FAQ", detail: "Answers to the most common questions about the site and the AI Guide." },
  { href: "/contact?type=bug", icon: Bug, title: "Report a bug", detail: "Found something broken? Tell us exactly what happened and which tool." },
  { href: "/contact?type=feature", icon: Lightbulb, title: "Request a feature", detail: "A tool you wish existed, or an improvement to an existing one." },
  { href: "/contact", icon: MessageCircle, title: "Contact support", detail: "Anything else — we read every message." },
];

export default function HelpCenterPage() {
  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Help Center" }]} />

      <div className="mx-auto mt-6 max-w-2xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Help Center
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Pick whatever fits — most questions are answered in the FAQ, and everything else reaches
          a real person.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {HELP_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-brass/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brass/50 bg-primary text-primary-foreground">
                <link.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="font-display text-sm font-semibold text-foreground">{link.title}</p>
              <p className="text-xs text-muted-foreground">{link.detail}</p>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brass group-hover:text-brass-dark">
                Go
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
