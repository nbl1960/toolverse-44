"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Heart } from "lucide-react";
import { ToolCard } from "@/components/shared/tool-card";
import { Button } from "@/components/ui/button";
import { getFavoriteSlugs, FAVORITES_CHANGED_EVENT } from "@/lib/favorites";
import { getRecentToolSlugs } from "@/lib/recent-tools";
import { getToolBySlug } from "@/lib/tools-registry";
import type { ToolDefinition } from "@/lib/types";

function slugsToTools(slugs: string[]): ToolDefinition[] {
  return slugs.map((slug) => getToolBySlug(slug)).filter((tool): tool is ToolDefinition => Boolean(tool));
}

/**
 * Client component (not the page itself) because both data sources —
 * favorites and recently-used tools — live in localStorage, which
 * doesn't exist during server rendering. Reads on mount, and stays in
 * sync with FavoriteButton toggles anywhere else on the site via the
 * same custom event useFavorite listens for.
 */
export function DashboardContent() {
  const [favoriteTools, setFavoriteTools] = React.useState<ToolDefinition[] | null>(null);
  const [recentTools, setRecentTools] = React.useState<ToolDefinition[] | null>(null);

  React.useEffect(() => {
    setFavoriteTools(slugsToTools(getFavoriteSlugs()));
    setRecentTools(slugsToTools(getRecentToolSlugs()));

    function handleFavoritesChanged() {
      setFavoriteTools(slugsToTools(getFavoriteSlugs()));
    }
    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged);
    return () => window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged);
  }, []);

  const isLoading = favoriteTools === null || recentTools === null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-hidden="true">
        {[0, 1].map((i) => (
          <div key={i} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((j) => (
              <div key={j} className="h-28 animate-pulse rounded-lg border border-border bg-card" style={{ animationDelay: `${j * 80}ms` }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const hasNothing = favoriteTools.length === 0 && recentTools.length === 0;

  if (hasNothing) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Nothing here yet — favorite a tool or open one from the catalog, and it&apos;ll show up here.
        </p>
        <Button asChild variant="outline" className="mt-5">
          <Link href="/tools">
            Browse all tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {favoriteTools.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
            <Heart className="h-4 w-4 fill-brass text-brass" aria-hidden="true" />
            Favorites
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {recentTools.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
            <Clock className="h-4 w-4 text-brass" aria-hidden="true" />
            Recently used
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
