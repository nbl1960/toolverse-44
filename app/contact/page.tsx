import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ContactFormWithType } from "@/components/shared/contact-form-with-type";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: `Get in touch with ${SITE_NAME} — support, feedback, bug reports, and feature requests.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Contact Us" }]} />

      <div className="mx-auto mt-6 max-w-2xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Contact us
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Support, feedback, a bug you&apos;ve found, or a tool you wish existed — all of it goes to a
          real inbox, read by a real person.
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-brass" aria-hidden="true" />
          <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="font-medium text-brass hover:text-brass-dark">
            {SITE_SUPPORT_EMAIL}
          </a>
        </div>

        <div className="mt-8">
          <Suspense fallback={null}>
            <ContactFormWithType />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
