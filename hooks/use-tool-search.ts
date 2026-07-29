"use client";

import * as React from "react";
import { searchToolsRanked } from "@/lib/search-index";
import { addRecentSearch, getRecentSearches } from "@/lib/recent-searches";
import { trackEvent } from "@/lib/analytics";
import type { SearchResult } from "@/lib/search-index";

const RESULT_LIMIT = 8;
/** How long to wait after the user stops typing before recording a search term as "recent" — avoids saving every keystroke as its own entry. */
const RECORD_DELAY_MS = 600;

interface UseToolSearchResult {
  query: string;
  setQuery: (value: string) => void;
  results: SearchResult[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  recentSearches: string[];
  clearQuery: () => void;
  clearRecent: () => void;
  moveActive: (direction: 1 | -1) => void;
  recordSearch: (term: string) => void;
}

/**
 * Drives the global search palette: query state, ranked results (via
 * the memoized search index — see lib/search-index.ts), roving
 * keyboard-navigation index, and recent-search tracking. Recording a
 * term as "recent" is debounced so it happens once someone pauses
 * typing (or picks a result), not on every keystroke.
 */
export function useToolSearch(): UseToolSearchResult {
  const [query, setQueryState] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const recordTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recent searches live in localStorage, which doesn't exist during SSR —
  // load them after mount, not during the initial render.
  React.useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const results = React.useMemo(() => searchToolsRanked(query, RESULT_LIMIT), [query]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const recordSearch = React.useCallback((term: string) => {
    const trimmed = term.trim();
    if (trimmed.length < 2) return;
    const updated = addRecentSearch(trimmed);
    setRecentSearches(updated);
  }, []);

  const setQuery = React.useCallback(
    (value: string) => {
      setQueryState(value);
      if (recordTimerRef.current) clearTimeout(recordTimerRef.current);
      if (value.trim().length >= 2) {
        recordTimerRef.current = setTimeout(() => {
          trackEvent("search_query", { query_length: String(value.trim().length) });
          recordSearch(value);
        }, RECORD_DELAY_MS);
      }
    },
    [recordSearch]
  );

  const clearQuery = React.useCallback(() => {
    if (recordTimerRef.current) clearTimeout(recordTimerRef.current);
    setQueryState("");
    setActiveIndex(0);
  }, []);

  const clearRecent = React.useCallback(() => {
    setRecentSearches([]);
    // lib/recent-searches's clearRecentSearches() is called by the
    // consumer directly where the "clear" UI lives, alongside this
    // state reset — kept separate so this hook doesn't need to import
    // a component-triggered side effect it doesn't otherwise need.
  }, []);

  const moveActive = React.useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((current) => {
        if (results.length === 0) return 0;
        const next = current + direction;
        if (next < 0) return results.length - 1;
        if (next >= results.length) return 0;
        return next;
      });
    },
    [results.length]
  );

  React.useEffect(() => {
    return () => {
      if (recordTimerRef.current) clearTimeout(recordTimerRef.current);
    };
  }, []);

  return {
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
  };
}
