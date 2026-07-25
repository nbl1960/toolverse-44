import Link from "next/link";
import { Wrench } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { getLiveTools } from "@/lib/tools-registry";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-config";

/** Global site footer: brand recap, category shortcuts, and live tool links. */
export function Footer() {
  const liveTools = getLiveTools();

  return (
    <footer className="border-t border-border">
      <div className="container grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-brass bg-primary text-primary-foreground">
              <Wrench className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="font-display text-base font-semibold italic text-foreground">
              {SITE_NAME}
            </span>
          </Link>
          <p className="mt-3 max-w-[26ch] text-sm text-muted-foreground">{SITE_TAGLINE}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Categories
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Live tools
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {liveTools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Explore
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link
                href="/tools"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                All tools
              </Link>
            </li>
            <li>
              <Link
                href="/categories"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                All categories
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Every tool starts here.</p>
          <p>Built with Next.js &amp; Gemini.</p>
        </div>
      </div>
    </footer>
  );
}
