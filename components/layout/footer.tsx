import Link from "next/link";
import { Wrench } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { SITE_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-config";
import { APP_VERSION, BUILD_DATE } from "@/lib/version";

const FOOTER_DESCRIPTION =
  "ToolVerse is an AI-powered platform offering 100+ free productivity, writing, developer, SEO, business, and utility tools.";

/** A handful of genuinely AI-powered flagship tools — honest to the "AI Tools" label, not a mixed bag with deterministic utilities. */
const AI_TOOL_LINKS = [
  { href: "/tools/email-writer", label: "AI Email Writer" },
  { href: "/tools/resume-builder", label: "AI Resume Builder" },
  { href: "/tools/youtube-title-generator", label: "YouTube Title Generator" },
  { href: "/tools/instagram-caption-generator", label: "Instagram Caption Generator" },
  { href: "/tools/linkedin-headline-generator", label: "LinkedIn Headline Generator" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/changelog", label: "Changelog" },
];

const RESOURCE_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/help", label: "Help Center" },
  { href: "/contact?type=bug", label: "Report a Bug" },
  { href: "/contact?type=feature", label: "Request a Feature" },
  { href: "/suggest-a-tool", label: "Suggest a Tool" },
  { href: "/newsletter", label: "Newsletter" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/cookies", label: "Cookie Policy" },
];

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Global site footer: brand recap, AI tool highlights, categories, and company/resources/legal links. */
export function Footer() {
  const categoryLinks = CATEGORIES.map((category) => ({
    href: `/categories/${category.slug}`,
    label: category.name,
  }));

  return (
    <footer className="border-t border-border">
      <div className="container grid grid-cols-2 gap-8 py-12 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-brass bg-primary text-primary-foreground">
              <Wrench className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="font-display text-base font-semibold italic text-foreground">{SITE_NAME}</span>
          </Link>
          <p className="mt-3 max-w-[32ch] text-sm text-muted-foreground">{FOOTER_DESCRIPTION}</p>
          <a
            href={`mailto:${SITE_SUPPORT_EMAIL}`}
            className="mt-3 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {SITE_SUPPORT_EMAIL}
          </a>
        </div>

        <FooterColumn title="AI Tools" links={AI_TOOL_LINKS} />
        <FooterColumn title="Categories" links={categoryLinks} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />
        <FooterColumn title="Resources" links={RESOURCE_LINKS} />
        <FooterColumn title="Legal" links={LEGAL_LINKS} />
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All Rights Reserved.
          </p>
          <p>
            {SITE_NAME} {APP_VERSION} • {BUILD_DATE}
          </p>
          <p>Built with Next.js &amp; Gemini.</p>
        </div>
      </div>
    </footer>
  );
}
