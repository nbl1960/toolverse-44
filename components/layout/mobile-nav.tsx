"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";

const NAV_LINKS = [
  { href: "/copilot", label: "Copilot" },
  { href: "/prompt-studio", label: "Prompt Studio" },
  { href: "/tools", label: "All Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/dashboard", label: "Dashboard" },
];

/** Hamburger menu for small screens: primary nav links + category shortcuts. */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="sm:hidden">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-20 max-w-sm translate-y-0">
          <DialogHeader className="p-5 pb-0">
            <DialogTitle>Browse ToolVerse</DialogTitle>
          </DialogHeader>
          <nav className="flex flex-col gap-1 p-5 pt-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
            <p className="mt-3 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Categories
            </p>
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  );
}
