import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { NewsletterSignup } from "@/components/shared/newsletter-signup";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Newsletter",
  description: `Get notified when ${SITE_NAME} ships new tools — no spam, unsubscribe anytime.`,
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Newsletter" }]} />
      <div className="mx-auto mt-6 max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Get new tools in your inbox
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          One email when we ship something new. No spam, unsubscribe anytime.
        </p>
        <div className="mt-6">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
}
