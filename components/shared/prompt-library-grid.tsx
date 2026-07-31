"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Copy, Heart, Search, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PROMPT_LIBRARY, PROMPT_LIBRARY_CATEGORIES } from "@/lib/prompt-studio/library-content";
import { getTargetModel } from "@/lib/prompt-studio/models";
import {
  getFavoriteTemplateIds,
  toggleTemplateFavorite,
  TEMPLATE_FAVORITES_CHANGED_EVENT,
} from "@/lib/prompt-template-favorites";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * The interactive part of the Library page (search, category/model
 * filtering, favorites, copy-to-clipboard) — kept separate from
 * app/prompt-studio/library/page.tsx so that page can stay a Server
 * Component and export real metadata.
 */
export function PromptLibraryGrid() {
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = React.useState(false);
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>([]);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFavoriteIds(getFavoriteTemplateIds());
    function handleChange() {
      setFavoriteIds(getFavoriteTemplateIds());
    }
    window.addEventListener(TEMPLATE_FAVORITES_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(TEMPLATE_FAVORITES_CHANGED_EVENT, handleChange);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleTemplates = PROMPT_LIBRARY.filter((template) => {
    if (activeCategory && template.category !== activeCategory) return false;
    if (favoritesOnly && !favoriteIds.includes(template.id)) return false;
    if (normalizedQuery) {
      const modelName = getTargetModel(template.targetModel)?.name ?? template.targetModel;
      const haystack = `${template.title} ${template.category} ${template.prompt} ${modelName}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) return false;
    }
    return true;
  });

  async function handleCopy(id: string, prompt: string) {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(id);
      trackEvent("prompt_library_copy", { template: id });
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard can fail (permissions, insecure context) — the prompt
      // text is still visible and selectable on screen either way.
    }
  }

  function handleToggleFavorite(id: string) {
    const isNowFavorite = toggleTemplateFavorite(id);
    setFavoriteIds(getFavoriteTemplateIds());
    trackEvent("prompt_library_favorite", { template: id, favorited: String(isNowFavorite) });
  }

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates by title, category, or keyword"
            className="pl-9 pr-9"
            aria-label="Search prompt templates"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setFavoritesOnly((prev) => !prev)}
          aria-pressed={favoritesOnly}
          className={cn(
            "flex shrink-0 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
            favoritesOnly
              ? "border-brass bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-brass/40 hover:text-foreground"
          )}
        >
          <Heart className={cn("h-3.5 w-3.5", favoritesOnly && "fill-current")} aria-hidden="true" />
          Favorites {favoriteIds.length > 0 && `(${favoriteIds.length})`}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            activeCategory === null
              ? "border-brass bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-brass/40 hover:text-foreground"
          )}
        >
          All categories
        </button>
        {PROMPT_LIBRARY_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              activeCategory === category
                ? "border-brass bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-brass/40 hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {visibleTemplates.length} of {PROMPT_LIBRARY.length} templates
      </p>

      {visibleTemplates.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">No templates match that search or filter.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visibleTemplates.map((template) => {
            const model = getTargetModel(template.targetModel);
            const isFavorite = favoriteIds.includes(template.id);
            return (
              <div key={template.id} className="flex flex-col rounded-lg border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">{template.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {template.category} · {model?.name ?? template.targetModel}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(template.id)}
                      aria-pressed={isFavorite}
                      aria-label={isFavorite ? `Remove "${template.title}" from favorites` : `Add "${template.title}" to favorites`}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
                        isFavorite
                          ? "border-brass bg-brass/10 text-brass"
                          : "border-border text-muted-foreground hover:border-brass/40 hover:text-brass"
                      )}
                    >
                      <Heart className={cn("h-3.5 w-3.5", isFavorite && "fill-current")} aria-hidden="true" />
                    </button>
                    <Link
                      href={`/prompt-studio?mode=analyzer&text=${encodeURIComponent(template.prompt)}`}
                      onClick={() => trackEvent("prompt_library_analyze", { template: template.id })}
                      aria-label={`Analyze the "${template.title}" prompt`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brass/40 hover:text-brass"
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleCopy(template.id, template.prompt)}
                      aria-label={`Copy the "${template.title}" prompt`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brass/40 hover:text-brass"
                    >
                      {copiedId === template.id ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="mt-3 line-clamp-4 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {template.prompt}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
