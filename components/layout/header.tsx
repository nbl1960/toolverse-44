import Link from "next/link";
import { Wrench } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ToolSearch } from "@/components/layout/search";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SITE_NAME } from "@/lib/site-config";

const NAV_LINKS = [
  { href: "/copilot", label: "Copilot" },
  { href: "/prompt-studio", label: "Prompt Studio" },
  { href: "/tools", label: "All Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/dashboard", label: "Dashboard" },
];

/**
 * Global site header used by the root layout, so it's identical across the
 * homepage, every category page, and every tool page (present or future).
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brass bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold italic tracking-tight text-foreground">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ToolSearch />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
