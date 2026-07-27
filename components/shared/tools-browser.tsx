"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/shared/tool-card";
import { CATEGORIES } from "@/lib/categories";
import { getAllTools } from "@/lib/tools-registry";
import { cn } from "@/lib/utils";

/**
 * Client-side filter over the full tool catalog: free-text search plus
 * category chips. Works unmodified whether the catalog has 7 entries or
 * 700 — filtering is O(n) over plain data, no pagination logic required
 * yet.
 *
 * Reads the catalog directly via `getAllTools()` rather than receiving it
 * as a prop from a Server Component parent: each `ToolDefinition` carries
 * an `icon` component reference and an optional `loadComponent` function,
 * neither of which can be serialized across the Server→Client boundary.
 * Importing the registry here — the same pattern already used for
 * `CATEGORIES` below — keeps this a plain client-side data read instead
 * of a boundary crossing.
 *
 * Also reads an initial `?q=` from the URL (if present) to seed the
 * search field — this backs the WebSite JSON-LD's SearchAction with a
 * URL that actually performs a search, rather than a schema claim the
 * page doesn't honor. Purely additive: with no `?q=` param, behavior is
 * unchanged from before.
 */
export function ToolsBrowser() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const tools = React.useMemo(() => getAllTools(), []);
  const [query, setQuery] = React.useState(initialQuery);
  const [category, setCategory] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = category ? tool.category === category : true;
      const matchesQuery = normalized
        ? [tool.name, tool.tagline, tool.description, ...tool.keywords]
            .join(" ")
            .toLowerCase()
            .includes(normalized)
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [tools, query, category]);

  return (
    <div>
      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all tools…"
          className="pl-9"
          aria-label="Search all tools"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <Button
          type="button"
          variant={category === null ? "default" : "outline"}
          size="sm"
          onClick={() => setCategory(null)}
          className="rounded-full"
        >
          All
        </Button>
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.slug}
            type="button"
            variant={category === cat.slug ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory((prev) => (prev === cat.slug ? null : cat.slug))}
            className="rounded-full"
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className={cn("mt-12 text-center text-sm text-muted-foreground")}>
          No tools match your search yet. Try a different word or category.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
