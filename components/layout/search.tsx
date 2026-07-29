"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Search as SearchIcon, TrendingUp, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resolveIcon } from "@/lib/icon-map";
import { highlightMatch } from "@/lib/highlight-match";
import { useToolSearch } from "@/hooks/use-tool-search";
import { clearRecentSearches, POPULAR_SEARCHES } from "@/lib/recent-searches";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

function optionId(index: number) {
  return `tool-search-option-${index}`;
}

/**
 * Site-wide search: a trigger button (with a ⌘K hint) that opens a
 * command palette searching the tool registry by name, category,
 * keywords, and description — see lib/search-index.ts for the ranked,
 * field-weighted matching and lib/highlight-match.ts for the matched-
 * text highlighting rendered below. Works the same whether the catalog
 * has 7 tools or 700, since it searches a memoized index built from
 * `getAllTools()` directly rather than any page-specific list.
 *
 * Full roving-focus combobox pattern: the text input keeps DOM focus at
 * all times (so typing is never interrupted), while ArrowUp/ArrowDown
 * move a visually- and ARIA-indicated "active" option that Enter
 * activates — the standard accessible pattern for this kind of search,
 * not a click-only list.
 */
export function ToolSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const {
    query,
    setQuery,
    results,
    activeIndex,
    setActiveIndex,
    recentSearches,
    clearQuery,
    clearRecent,
    moveActive,
    recordSearch,
  } = useToolSearch();

  React.useEffect(() => {
    function handleGlobalKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  React.useEffect(() => {
    if (!open) {
      clearQuery();
    }
  }, [open, clearQuery]);

  // Keep the highlighted result scrolled into view while navigating with arrow keys.
  React.useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(`#${optionId(activeIndex)}`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function goToTool(slug: string, isLive: boolean, term: string) {
    if (!isLive) return;
    trackEvent("search_result_click", { tool: slug });
    recordSearch(term || slug);
    setOpen(false);
    router.push(`/tools/${slug}`);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const active = results[activeIndex];
      if (active) goToTool(active.tool.slug, active.tool.status === "live", query);
    } else if (event.key === "Escape") {
      // Radix Dialog already closes on Escape by default; explicitly
      // handling it here too just ensures query state clears in the
      // same tick rather than relying on the onOpenChange effect alone.
      setOpen(false);
    }
  }

  function handleClearRecent() {
    clearRecentSearches();
    clearRecent();
  }

  const showSuggestions = query.trim().length === 0;
  const activeOptionId = results.length > 0 ? optionId(activeIndex) : undefined;

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-9 w-9 justify-center px-0 sm:h-10 sm:w-56 sm:justify-between sm:px-3"
        aria-label="Search tools"
      >
        <span className="flex items-center gap-2 text-muted-foreground">
          <SearchIcon className="h-4 w-4" aria-hidden="true" />
          <span className="hidden text-sm sm:inline">Search tools…</span>
        </span>
        <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
          ⌘K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-24 max-w-xl translate-y-0 gap-0 sm:top-24" hideCloseButton>
          <DialogHeader className="p-4 pb-3">
            <DialogTitle className="sr-only">Search tools</DialogTitle>
            <DialogDescription className="sr-only">
              Search the ToolVerse catalog by name, category, keyword, or description.
            </DialogDescription>
            <div className="relative">
              <SearchIcon
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                ref={inputRef}
                autoFocus
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="tool-search-listbox"
                aria-activedescendant={activeOptionId}
                aria-autocomplete="list"
                placeholder="Search for a tool… (e.g. email, resume, finance)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="h-11 pl-9 pr-9"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearQuery}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </DialogHeader>

          <div className="scrollbar-thin max-h-96 overflow-y-auto border-t border-border p-2">
            {showSuggestions ? (
              <div className="flex flex-col gap-4 px-1 py-2">
                <div>
                  <p className="flex items-center gap-1.5 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <TrendingUp className="h-3 w-3" aria-hidden="true" />
                    Popular searches
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5 px-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-brass/40 hover:text-foreground"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-2">
                      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        Recent searches
                      </p>
                      <button
                        type="button"
                        onClick={handleClearRecent}
                        className="text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5 px-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setQuery(term)}
                          className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-brass/40 hover:text-foreground"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : results.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">No matching tools found.</p>
            ) : (
              <ul id="tool-search-listbox" role="listbox" aria-label="Search results" ref={listRef} className="flex flex-col gap-0.5">
                {results.map((result, index) => {
                  const Icon = resolveIcon(result.tool.iconName);
                  const isLive = result.tool.status === "live";
                  const isActive = index === activeIndex;
                  const nameSegments = highlightMatch(result.tool.name, query);
                  const descriptionText = isLive ? result.tool.tagline : `Coming soon · ${result.categoryName}`;
                  return (
                    <li key={result.tool.slug} role="presentation">
                      <button
                        id={optionId(index)}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => goToTool(result.tool.slug, isLive, query)}
                        onMouseEnter={() => setActiveIndex(index)}
                        disabled={!isLive}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                          isLive ? "cursor-pointer" : "cursor-not-allowed opacity-60",
                          isActive && isLive ? "bg-accent" : "",
                          "focus-visible:outline-none"
                        )}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brass/40 bg-accent text-accent-foreground">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">
                            {nameSegments.map((segment, i) =>
                              segment.isMatch ? (
                                <mark key={i} className="rounded-sm bg-brass/25 text-foreground">
                                  {segment.text}
                                </mark>
                              ) : (
                                <React.Fragment key={i}>{segment.text}</React.Fragment>
                              )
                            )}
                          </span>
                          <span className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                            <span className="truncate">{descriptionText}</span>
                            <span className="shrink-0 text-muted-foreground/50">·</span>
                            <span className="shrink-0 truncate">{result.categoryName}</span>
                          </span>
                        </span>
                        {isLive && (
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
