"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchToolsRanked } from "@/lib/search-index";
import { getToolBySlug } from "@/lib/tools-registry";
import { getCategoryBySlug } from "@/lib/categories";
import { resolveIcon } from "@/lib/icon-map";
import { MAX_COMPARE_TOOLS, MIN_COMPARE_TOOLS } from "@/lib/compare/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { IconName } from "@/lib/icon-map";
import type { ToolDefinition } from "@/lib/types";

/**
 * Compares real attributes of real, first-party ToolVerse tools —
 * category, description, keywords, FAQ depth. No pricing/rating rows,
 * since every tool here is free and there's no real aggregated rating
 * data to show (see the Product Phase discussion on why those aren't
 * faked). Selection is synced to `?tools=slug1,slug2` so a specific
 * comparison is shareable and bookmarkable, same pattern as the Prompt
 * Library's search/category filters.
 */
export function CompareTools() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSlugs = (searchParams.get("tools") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_COMPARE_TOOLS);

  const [selectedSlugs, setSelectedSlugs] = React.useState<string[]>(initialSlugs);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (selectedSlugs.length > 0) params.set("tools", selectedSlugs.join(","));
    const queryString = params.toString();
    router.replace(queryString ? `/compare?${queryString}` : "/compare", { scroll: false });
  }, [selectedSlugs, router]);

  const selectedTools = selectedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolDefinition => Boolean(t));

  const searchResults = query.trim().length >= 2 ? searchToolsRanked(query, 6) : [];

  function addTool(slug: string) {
    if (selectedSlugs.includes(slug) || selectedSlugs.length >= MAX_COMPARE_TOOLS) return;
    setSelectedSlugs((prev) => [...prev, slug]);
    setQuery("");
    trackEvent("compare_add_tool", { tool: slug });
  }

  function removeTool(slug: string) {
    setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
  }

  const canCompare = selectedTools.length >= MIN_COMPARE_TOOLS;

  return (
    <div>
      {selectedSlugs.length < MAX_COMPARE_TOOLS && (
        <div className="relative mx-auto max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Add a tool to compare (${selectedSlugs.length}/${MAX_COMPARE_TOOLS})`}
            className="pl-9"
            aria-label="Search for a tool to add to the comparison"
          />
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-md border border-border bg-card shadow-lg">
              {searchResults
                .filter((r) => !selectedSlugs.includes(r.tool.slug))
                .map((result) => {
                  const Icon = resolveIcon(result.tool.iconName);
                  return (
                    <button
                      key={result.tool.slug}
                      type="button"
                      onClick={() => addTool(result.tool.slug)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
                      <span className="truncate">{result.tool.name}</span>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {selectedTools.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Search above and add at least {MIN_COMPARE_TOOLS} tools to compare them side by side.
        </p>
      ) : !canCompare ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {selectedTools.map((tool) => (
            <SelectedChip key={tool.slug} tool={tool} onRemove={() => removeTool(tool.slug)} />
          ))}
          <p className="w-full text-center text-xs text-muted-foreground">
            Add {MIN_COMPARE_TOOLS - selectedTools.length} more to compare.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {selectedTools.map((tool) => (
              <SelectedChip key={tool.slug} tool={tool} onRemove={() => removeTool(tool.slug)} />
            ))}
          </div>

          <div className="mt-6 overflow-x-auto">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${selectedTools.length}, minmax(220px, 1fr))` }}
            >
              {selectedTools.map((tool) => {
                const Icon = resolveIcon(tool.iconName as IconName);
                const category = getCategoryBySlug(tool.category);
                return (
                  <div key={tool.slug} className="flex flex-col rounded-lg border border-border bg-card p-4 shadow-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brass/50 bg-primary text-primary-foreground">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="mt-3 font-display text-sm font-semibold text-foreground">{tool.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{tool.tagline}</p>

                    <dl className="mt-4 flex flex-col gap-3 border-t border-border pt-4 text-xs">
                      <div>
                        <dt className="font-medium uppercase tracking-wide text-muted-foreground/70">Category</dt>
                        <dd className="mt-0.5 text-foreground">{category?.name ?? tool.category}</dd>
                      </div>
                      <div>
                        <dt className="font-medium uppercase tracking-wide text-muted-foreground/70">What it does</dt>
                        <dd className="mt-0.5 text-foreground">{tool.description}</dd>
                      </div>
                      <div>
                        <dt className="font-medium uppercase tracking-wide text-muted-foreground/70">Best for</dt>
                        <dd className="mt-0.5 flex flex-wrap gap-1">
                          {tool.keywords.slice(0, 4).map((kw) => (
                            <span key={kw} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                              {kw}
                            </span>
                          ))}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium uppercase tracking-wide text-muted-foreground/70">Pricing</dt>
                        <dd className="mt-0.5 inline-flex items-center gap-1 text-success">
                          <Check className="h-3 w-3" aria-hidden="true" />
                          Free
                        </dd>
                      </div>
                    </dl>

                    <Button asChild size="sm" className="mt-4">
                      <Link href={`/tools/${tool.slug}`} onClick={() => trackEvent("compare_open_tool", { tool: tool.slug })}>
                        Open tool
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SelectedChip({ tool, onRemove }: { tool: ToolDefinition; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-brass/40 bg-accent py-1 pl-3 pr-1 text-xs font-medium text-brass">
      {tool.name}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${tool.name} from comparison`}
        className={cn("flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-brass/20")}
      >
        <X className="h-3 w-3" aria-hidden="true" />
      </button>
    </span>
  );
}
