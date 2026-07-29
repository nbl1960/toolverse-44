"use client";

import * as React from "react";
import { toggleFavorite, isFavorite, FAVORITES_CHANGED_EVENT } from "@/lib/favorites";

/** Tracks and toggles a single tool's favorite status, staying in sync across every FavoriteButton instance for the same slug via a same-tab custom event. */
export function useFavorite(slug: string) {
  const [favorited, setFavorited] = React.useState(false);

  React.useEffect(() => {
    setFavorited(isFavorite(slug));
    function handleChange(event: Event) {
      const detail = (event as CustomEvent<{ slug: string; isFavorite: boolean }>).detail;
      if (detail?.slug === slug) setFavorited(detail.isFavorite);
    }
    window.addEventListener(FAVORITES_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(FAVORITES_CHANGED_EVENT, handleChange);
  }, [slug]);

  const toggle = React.useCallback(() => {
    setFavorited(toggleFavorite(slug));
  }, [slug]);

  return { favorited, toggle };
}
