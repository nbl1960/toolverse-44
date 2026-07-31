"use client";

import * as React from "react";
import { Check, FolderPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addToolToCollection,
  createCollection,
  getCollections,
  removeToolFromCollection,
  COLLECTIONS_CHANGED_EVENT,
} from "@/lib/collections";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { Collection } from "@/lib/collections";

interface SaveToCollectionProps {
  toolSlug: string;
  toolName: string;
}

/** A popover for adding/removing a specific tool from any of the user's collections, and creating a new one inline — mirrors FavoriteButton's self-contained, localStorage-backed pattern. */
export function SaveToCollection({ toolSlug, toolName }: SaveToCollectionProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [newName, setNewName] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const refresh = React.useCallback(() => setCollections(getCollections()), []);

  React.useEffect(() => {
    refresh();
    window.addEventListener(COLLECTIONS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(COLLECTIONS_CHANGED_EVENT, refresh);
  }, [refresh]);

  React.useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function handleToggleCollection(collectionId: string, isInCollection: boolean) {
    if (isInCollection) {
      setCollections(removeToolFromCollection(collectionId, toolSlug));
    } else {
      setCollections(addToolToCollection(collectionId, toolSlug));
      trackEvent("collection_add_tool", { collection: collectionId, tool: toolSlug });
    }
  }

  function handleCreateAndAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newName.trim()) return;
    const updated = createCollection(newName);
    const created = updated[updated.length - 1];
    if (created) {
      const withTool = addToolToCollection(created.id, toolSlug);
      setCollections(withTool);
      trackEvent("collection_create", { name_length: String(newName.trim().length) });
    }
    setNewName("");
  }

  const inCollectionCount = collections.filter((c) => c.toolSlugs.includes(toolSlug)).length;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={`Save ${toolName} to a collection`}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
          inCollectionCount > 0
            ? "border-brass bg-brass/10 text-brass"
            : "border-border bg-card text-muted-foreground hover:border-brass/40 hover:text-brass"
        )}
      >
        <FolderPlus className="h-4 w-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-border bg-card p-3 shadow-lg">
          <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Save to collection</p>
          {collections.length > 0 && (
            <div className="mt-2 flex max-h-40 flex-col gap-0.5 overflow-y-auto">
              {collections.map((collection) => {
                const isInCollection = collection.toolSlugs.includes(toolSlug);
                return (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() => handleToggleCollection(collection.id, isInCollection)}
                    className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    <span className="truncate">{collection.name}</span>
                    {isInCollection && <Check className="h-3.5 w-3.5 shrink-0 text-brass" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          )}
          <form onSubmit={handleCreateAndAdd} className="mt-2 flex items-center gap-1.5 border-t border-border pt-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New collection name"
              className="h-8 text-xs"
              aria-label="New collection name"
            />
            <Button type="submit" size="sm" variant="outline" disabled={!newName.trim()} className="h-8 shrink-0 px-2">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
