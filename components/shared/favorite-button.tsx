"use client";

import { Heart } from "lucide-react";
import { useFavorite } from "@/hooks/use-favorite";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  slug: string;
  toolName: string;
  className?: string;
}

/** A small, self-contained favorite toggle — works anywhere a tool is shown (cards, tool pages) since it owns its own localStorage-backed state via useFavorite. */
export function FavoriteButton({ slug, toolName, className }: FavoriteButtonProps) {
  const { favorited, toggle } = useFavorite(slug);

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggle();
    trackEvent("favorite_toggle", { tool: slug, favorited: String(!favorited) });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={favorited}
      aria-label={favorited ? `Remove ${toolName} from favorites` : `Add ${toolName} to favorites`}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
        favorited
          ? "border-brass bg-brass/10 text-brass"
          : "border-border bg-card text-muted-foreground hover:border-brass/40 hover:text-brass",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", favorited && "fill-current")} aria-hidden="true" />
    </button>
  );
}
